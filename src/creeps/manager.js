/*
    manager: manage link, storage, terminal...
    logic:
        for status == 0: find withdraw target, withdraw and set transfer target.
        for status == 1: transfer whatever resource to target.
*/
var manager = {
    properties: {
        role: "manager",
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its position.
        if (roomInfo[creep.room.name] && roomInfo[creep.room.name].managerPos) {
            let pos = roomInfo[creep.room.name].managerPos;
            if(!creep.pos.isEqualTo(pos)) {
                creep.moveTo(pos);
                return;
            }
        }

        // update memory every 100 sec
        if(creep.memory.updated == undefined || Game.time % 100 == 67) {
            this.updateMemory(creep);
        }

        // set status
        creep.workerSetStatus();

        // status:1 transfer
        if(creep.memory.status) {
            // In theory, manager only carry 1 resource at a time.
            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            let target = Game.getObjectById(creep.memory.target);

            if(target && creep.transfer(target, resourceType) == OK) {
                return;
            }
            else if(creep.room.storage && creep.transfer(creep.room.storage, resourceType) == OK) { 
                return;
            }
            else {
                creep.drop(resourceType);
                return;
            }
            
        }
        // status:0 withdraw
        else {
            let link = Game.getObjectById(creep.memory[STRUCTURE_LINK]);
            let powerSpawn = Game.getObjectById(creep.memory[STRUCTURE_POWER_SPAWN]);
            let terminal = Game.getObjectById(creep.memory[STRUCTURE_TERMINAL]);
            let storage = Game.getObjectById(creep.memory[STRUCTURE_STORAGE]);
            let nuker = Game.getObjectById(creep.memory[STRUCTURE_NUKER]);

            // from storage to managerLink
            if(creep.memory.controllerLink && 
                Game.getObjectById(creep.memory.controllerLink) && 
                Game.getObjectById(creep.memory.controllerLink).store[RESOURCE_ENERGY] == 0 &&
                Game.getObjectById(creep.memory.controllerLink).cooldown <= 1) {
                
                creep.say('S2L');
                this.storageToLink(creep);
            }
            else if(link && link.store[RESOURCE_ENERGY] > 0) {
                creep.say('L2S');
                this.fromA2B(creep, link, storage, RESOURCE_ENERGY);
            }
            // terminal energy balance
            else if(terminal && terminal.store[RESOURCE_ENERGY] < 50000) {
                creep.say('S2T');
                this.fromA2B(creep, storage, terminal, RESOURCE_ENERGY);
            }
            // transfer energy to powerSpawn 
            else if(powerSpawn && storage && powerSpawn.store.getFreeCapacity(RESOURCE_ENERGY) > creep.store.getCapacity()) {
                creep.say('2PS');
                this.fromA2B(creep, storage, powerSpawn, RESOURCE_ENERGY);
            }
            // transfer power to powerSpawn
            else if(powerSpawn && storage && powerSpawn.store[RESOURCE_POWER] == 0 && storage.store[RESOURCE_POWER] > 0) {
                creep.say('2PS');
                this.fromA2B(creep, storage, powerSpawn, RESOURCE_POWER, 100);
            }
            else if(terminal && terminal.store[RESOURCE_ENERGY] > 60000) {
                creep.say('T2S');
                this.fromA2B(creep, terminal, storage, RESOURCE_ENERGY);
            }
            // other tasks
            else {
                if(creep.room.memory.managerTasks && creep.room.memory.managerTasks.length > 0) {
                    this.doTask(creep);
                }
            }
        }
    },

    fromA2B: function(creep, fromStruct, toStruct, resourceType, amount=null) {
        if(!fromStruct || !toStruct) {
            console.log("some struct is missing");
            return;
        }

        
        if(fromStruct.store[resourceType] > 0) {
            if(amount == null) creep.withdraw(fromStruct, resourceType);
            else creep.withdraw(fromStruct, resourceType, amount);

            creep.memory.status = 1;
        }
        // set transfer target
        creep.memory.target = toStruct.id;
    },

    doTask: function(creep) {
        let task = creep.room.memory.managerTasks[creep.room.memory.managerTasks.length - 1];
        // delete task if withdraw meets requirements
        let transferVolume;
        if(task.volume <= creep.store.getFreeCapacity()) {
            transferVolume = task.volume;
            creep.room.memory.managerTasks.pop();
        }
        else {
            transferVolume = creep.store.getFreeCapacity();
            creep.room.memory.managerTasks[creep.room.memory.managerTasks.length - 1].volume -= transferVolume;
        }

        // withdraw
        let target = Game.getObjectById(creep.memory[task.from]);
        if(target && creep.withdraw(target, task.resourceType, transferVolume) == OK) {
            creep.memory.status = 1;
        }

        // set transfer target
        creep.memory.target = creep.memory[task.to];
    },

    updateMemory: function(creep) {
        // controllerLink id
        let controllerLink = _.find(creep.room.find(FIND_MY_STRUCTURES), struct => (
            struct.structureType == STRUCTURE_LINK &&
            struct.pos.inRangeTo(creep.room.controller.pos, 2)
        ));

        if(controllerLink) {
            creep.memory.controllerLink = controllerLink.id;
        }
        else {
            creep.memory.controllerLink = null;
        }

        // store adjacent structures into memory
        let structList = creep.pos.findInRange(FIND_MY_STRUCTURES, 1);
        creep.say(structList.length);
        _.forEach(structList, struct => {
            creep.memory[struct.structureType] = struct.id;
        })

        creep.memory.updated = 1
        creep.say("Updated")
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        // var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.room.name == room.name);
        // console.log(this.properties.role + ': ' + thisTypeCreeps.length, room.name);
    
        // 1 manager
        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body = [MOVE, ...new Array(16).fill(CARRY)];
        let memory = {role: this.properties.role, status: 0, base: room.name};

        return {name, body, memory};
    },
}

module.exports = manager;