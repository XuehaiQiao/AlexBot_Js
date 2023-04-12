/*
    manager: manage link, storage, terminal...
    logic:
        if link is full, withdraw from link, send it to storage
        task queues
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

        // set up memory
        this.updateMemory(creep);

        // set status
        // currently only energy
        creep.workerSetStatus();        

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
        // terminal
        else if(creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] < 50000) {
            creep.say('S2T');
            this.storageToTerminal(creep, RESOURCE_ENERGY);
        }
        else if(creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] > 60000) {
            creep.say('T2S');
            this.terminalToStorage(creep, RESOURCE_ENERGY);
        }
        // other tasks
        else {
            // todo
            // empty self first
            if(creep.memory.status) {
                let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                // to storage:
                if(creep.room.storage) {
                    let storage = creep.room.storage;
                    creep.transfer(storage, resourceType);
                }
            }
        }
    },

    linkToStorage: function(creep) {
        // transfer
        if(creep.memory.status) {
            let storage = creep.room.storage;
            if(storage) { 
                creep.transfer(storage, RESOURCE_ENERGY);
            }
        }
        // withdraw
        else {
            let link = Game.getObjectById(creep.memory[STRUCTURE_LINK]);
            if(link && link.store[RESOURCE_ENERGY] > 0) {
                creep.withdraw(link, RESOURCE_ENERGY);
                creep.memory.status = 1;
            }
        }
    },

    storageToLink: function(creep) {
        // transfer
        if(creep.memory.status) {
            let link = Game.getObjectById(creep.memory[STRUCTURE_LINK]);
            if(link) {
                creep.transfer(link, RESOURCE_ENERGY);
            }
        }
        // withdraw
        else {
            let storage = creep.room.storage;
            if(storage && storage.store[RESOURCE_ENERGY] > 0) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                creep.memory.status = 1;
            }
        }
    },

    storageToTerminal: function(creep, resourceType) {
        // transfer
        if(creep.memory.status) {
            let terminal = Game.getObjectById(creep.memory[STRUCTURE_TERMINAL]);
            if(terminal) {
                creep.transfer(terminal, resourceType);
            }
        }
        // withdraw
        else {
            let storage = creep.room.storage;
            if(storage && storage.store[resourceType] > 0) {
                creep.withdraw(creep.room.storage, resourceType);
                creep.memory.status = 1;
            }
        }
    },

    terminalToStorage: function(creep, resourceType) {
        // transfer
        if(creep.memory.status) {
            let storage = creep.room.storage;
            if(storage) { 
                creep.transfer(storage, resourceType);
            }
        }
        // withdraw
        else {
            let terminal = Game.getObjectById(creep.memory[STRUCTURE_TERMINAL]);
            if(terminal && terminal.store[resourceType] > 0) {
                creep.withdraw(terminal, resourceType);
                creep.memory.status = 1;
            }
        }
    },

    updateMemory: function(creep) {
        if(creep.memory.updated && Game.time % 100 != 67) return;

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