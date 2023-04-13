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
            let result = -1;
            if(target) {
                result = creep.transfer(target, resourceType);
            }
            else if(creep.room.storage) { 
                result = creep.transfer(creep.room.storage, resourceType);
            }
            
            // if cannot find place to put the resource, drop it
            if(result != OK) {
                creep.drop(resourceType);
            }
        }
        // status:0 withdraw
        else {
            // from storage to managerLink
            if(creep.memory.controllerLink && 
                Game.getObjectById(creep.memory.controllerLink) && 
                Game.getObjectById(creep.memory.controllerLink).store[RESOURCE_ENERGY] == 0 &&
                Game.getObjectById(creep.memory.controllerLink).cooldown <= 1) {
                
                creep.say('S2L');
                this.storageToLink(creep);
            }
            else if(creep.memory[STRUCTURE_LINK] && Game.getObjectById(creep.memory[STRUCTURE_LINK]) && Game.getObjectById(creep.memory[STRUCTURE_LINK]).store[RESOURCE_ENERGY] > 0) {
                creep.say('L2S');
                this.linkToStorage(creep);
            }
            // terminal energy balance
            else if(creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] < 50000) {
                creep.say('S2T');
                this.storageToTerminal(creep, RESOURCE_ENERGY);
            }
            else if(creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] > 60000) {
                creep.say('T2S');
                this.terminalToStorage(creep, RESOURCE_ENERGY);
            }
            // storage resource balance
            else if(creep.room.needStorage2Terminal()) {
                creep.say('S2T_R');
                this.storageToTerminal(creep, creep.room.needStorage2Terminal());
            }
            // other tasks
            else {
                if(creep.room.memory.managerTasks && creep.room.memory.managerTasks.length > 0) {
                    this.doTask(creep);
                }
            }
        }
    },

    doTask: function(creep) {
        let task = creep.room.memory.managerTasks[creep.room.memory.managerTasks.length - 1];

        // console.log(JSON.stringify(task), "dgffgdidgfrgfrognollkfmoirngoigigoqgqozhcklzbgfoginotnlgf");

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

    linkToStorage: function(creep) {
        let link = Game.getObjectById(creep.memory[STRUCTURE_LINK]);
        if(link && link.store[RESOURCE_ENERGY] > 0) {
            creep.withdraw(link, RESOURCE_ENERGY);
            creep.memory.status = 1;
        }
        // set transfer target
        creep.memory.target = creep.memory[STRUCTURE_STORAGE];
    },

    storageToLink: function(creep) {
        let storage = creep.room.storage;
        if(storage && storage.store[RESOURCE_ENERGY] > 0) {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            creep.memory.status = 1;
        }
        // set transfer target
        creep.memory.target = creep.memory[STRUCTURE_LINK];
    },

    storageToTerminal: function(creep, resourceType) {
        // withdraw
        let storage = creep.room.storage;
        if(storage && storage.store[resourceType] > 0) {
            creep.withdraw(creep.room.storage, resourceType);
            creep.memory.status = 1;
        }
        // set transfer target
        creep.memory.target = creep.memory[STRUCTURE_TERMINAL];
    },

    terminalToStorage: function(creep, resourceType) {
        // withdraw
        let terminal = Game.getObjectById(creep.memory[STRUCTURE_TERMINAL]);
        if(terminal && terminal.store[resourceType] > 0) {
            creep.withdraw(terminal, resourceType);
            creep.memory.status = 1;
        }
        // set transfer target
        creep.memory.target = creep.memory[STRUCTURE_STORAGE];
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