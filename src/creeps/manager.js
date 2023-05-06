const { roomInfo, roomResourceConfig } = require("../config");
/*
    manager manage: link, storage, terminal, factory, power spawn, nuke.
    logic:
        for status == 0: find withdraw target, withdraw and set transfer target.
        for status == 1: transfer whatever resource to target.
*/
module.exports = {
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
            updateMemory(creep);
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
            let storage = Game.getObjectById(creep.memory[STRUCTURE_STORAGE]);

            // link, terminal balance, ps, factory, nuke, taskQueue
            if(coreWork(creep, storage)) return;
            else if(terminalBalance(creep, storage)) return;
            else if(feedPowerSpawn(creep, storage)) return;
            else {
                let managerTasks = creep.room.memory.managerTasks;
                if(managerTasks && managerTasks.length > 0) {
                    doTask(creep);
                }
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
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
};

// ========================================================= Functions ======================================================================================

// link to storage & storage to controllerLink
var coreWork = function(creep, storage) {
    let link = Game.getObjectById(creep.memory[STRUCTURE_LINK]);
    let controllerLink = Game.getObjectById(creep.memory.controllerLink);
    // upgrade: from storage to managerLink
    if(controllerLink && link && controllerLink.store[RESOURCE_ENERGY] < 100 && link.store[RESOURCE_ENERGY] < 700 && link.cooldown <= 3) {
        creep.say('S2L');
        fromA2B(creep, storage, link, RESOURCE_ENERGY, Math.min(link.store.getFreeCapacity(RESOURCE_ENERGY), controllerLink.store.getFreeCapacity(RESOURCE_ENERGY)));
        return true;
    }
    // collect link energy
    else if(link && link.store[RESOURCE_ENERGY] > 0 && controllerLink.store[RESOURCE_ENERGY] >= 100 && storage.store.getFreeCapacity() > creep.store.getCapacity()) {
        creep.say('L2S');
        fromA2B(creep, link, storage, RESOURCE_ENERGY);
        return true;
    }

    return false
};

var terminalBalance = function(creep, storage) {
    let terminal = Game.getObjectById(creep.memory[STRUCTURE_TERMINAL]);
    if(!terminal) return false;

    for(const resourceType in roomResourceConfig) {
        let targetAmount = roomResourceConfig[resourceType].terminal;
        if(terminal.store[resourceType] < targetAmount && storage.store[resourceType] > 0 && terminal.store.getFreeCapacity() > 0) {
            creep.say('S2T');
            let amount = targetAmount - terminal.store[resourceType];
            fromA2B(creep, storage, terminal, resourceType, amount);
            return true;
        }
        else if(terminal.store[resourceType] > targetAmount && terminal.store[resourceType] > 0 && storage.store.getFreeCapacity() > 0) {
            creep.say('T2S');
            let amount = terminal.store[resourceType] - targetAmount;
            fromA2B(creep, terminal, storage, resourceType, amount);
            return true;
        }
    }

    return false;
};

var feedPowerSpawn = function(creep, storage) {
    let powerSpawn = Game.getObjectById(creep.memory[STRUCTURE_POWER_SPAWN]);
    if(!powerSpawn) return false;

    if(storage && powerSpawn.store.getFreeCapacity(RESOURCE_ENERGY) > creep.store.getCapacity()) {
        creep.say('2PS');
        fromA2B(creep, storage, powerSpawn, RESOURCE_ENERGY);
        return true;
    }
    // transfer power to powerSpawn
    else if(storage && powerSpawn.store[RESOURCE_POWER] == 0 && storage.store[RESOURCE_POWER] > 0) {
        creep.say('2PS');
        fromA2B(creep, storage, powerSpawn, RESOURCE_POWER, Math.min(100, storage.store[RESOURCE_POWER]));
        return true;
    }

    return false;
};

var fromA2B = function(creep, fromStruct, toStruct, resourceType, amount = null) {
    if(!fromStruct || !toStruct) {
        console.log("some struct is missing");
        return;
    }
    
    if(fromStruct.store[resourceType] > 0) {
        if(amount == null) creep.withdraw(fromStruct, resourceType);
        else {
            amount = _.min([creep.store.getCapacity(), fromStruct.store[resourceType], amount]);
            creep.withdraw(fromStruct, resourceType, amount);
        }
        creep.memory.status = 1;
    }
    // set transfer target
    creep.memory.target = toStruct.id;
};

var doTask = function(creep) {
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
};

var updateMemory = function(creep) {
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
};