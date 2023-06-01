const { roomInfo } = require("../config");

module.exports = {
    properties: {
        type: 'upgrader2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 1},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, CARRY, CARRY, MOVE, MOVE], number: 3},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, WORK, CARRY, CARRY, MOVE, MOVE, WORK, WORK, CARRY, CARRY, MOVE, MOVE], number: 3},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(6).fill(WORK), ...new Array(6).fill(CARRY), ...new Array(6).fill(MOVE)], number: 1},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(8).fill(WORK), ...new Array(8).fill(CARRY), ...new Array(8).fill(MOVE)], mBodyParts: [...new Array(12).fill(WORK), ...new Array(3).fill(CARRY), ...new Array(6).fill(MOVE)], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], mBodyParts: [...new Array(14).fill(WORK), ...new Array(4).fill(CARRY), ...new Array(7).fill(MOVE)], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], mBodyParts: [...new Array(30).fill(WORK), ...new Array(5).fill(CARRY), ...new Array(15).fill(MOVE)], number: 0},
            8: {maxEnergyCapacity: 10000, bodyParts:[...new Array(15).fill(WORK), ...new Array(15).fill(CARRY), ...new Array(15).fill(MOVE)], mBodyParts: [...new Array(15).fill(WORK), ...new Array(4).fill(CARRY), ...new Array(8).fill(MOVE)], number: 1},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.getBoosts();
            return;
        }

        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        
        // check if have manager or not to decide what logic to use (set status and logics under status)
        if(
            creep.room.memory.linkInfo.controllerLink && 
            creep.room.memory.linkInfo.managerLink &&
            roomInfo[creep.room.name] &&
            roomInfo[creep.room.name].managerPos
        ) this.managerLogic(creep);
        else  this.noManagerLogic(creep);
    },

    managerLogic: function(creep) {
        // set status: 0. harvest  1. upgrade 
        creep.workerSetStatus();

        // harvest: status 0
        if(!creep.memory.status) {
            creep.takeEnergyFromControllerLink();
            creep.upgradeController(creep.room.controller);
        }
        // upgrade: status 1
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {reusePath: 10});
            }
            if(creep.store[RESOURCE_ENERGY] <= 40) creep.memory.status = 0;
        }
    },

    noManagerLogic: function(creep) {
        // set status: 0. harvest  1. work 
        creep.workerSetStatus();

        // upgrade
        if(creep.memory.status) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {reusePath: 10});
            }
        }
        // harvest
        else {
            if(!creep.takeEnergyNeerController()) {
                if(!creep.pos.inRangeTo(creep.room.controller, 4)) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        let creepCount;
        if(global.roomCensus[room.name][this.properties.type]) creepCount = global.roomCensus[room.name][this.properties.type]
        else creepCount = 0;

        let storage = room.storage;
        let num = this.properties.stages[this.getStage(room)].number;

        // for level 8 room
        if(room.controller.level == 8){
            if(creepCount >= 1) return false
            else if ((storage && storage.store[RESOURCE_ENERGY] > 400000) || room.controller.ticksToDowngrade < 50000) {
                return true
            }
            else return false;
        }

        // create more upgrader2 for more energy in storage
        if (storage && storage.store[RESOURCE_ENERGY] > 200000) {
            num += Math.min(Math.ceil((storage.store[RESOURCE_ENERGY] + 300000) / (1 + storage.store.getFreeCapacity())), 4);
        }

        // return upgraders.length < num ? true : false;
        return creepCount < num ? true : false;
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        
        // if energy not enough, create minimum upgrader
        let body;
        let storage = room.storage;
        
        // if storage low, create tiny creep, if have managerPos, create small carry creep.
        if(storage && storage.store[RESOURCE_ENERGY] < 50000) body = [WORK, CARRY, CARRY, MOVE];
        else if(
            room.memory.linkInfo.controllerLink && 
            room.memory.linkInfo.managerLink &&
            roomInfo[room.name] &&
            roomInfo[room.name].managerPos
        ) body = this.properties.stages[stage].mBodyParts;
        else body = this.properties.stages[stage].bodyParts;

        let memory = {role: this.properties.type, status: 1, target: 0, base: room.name};

        return {name, body, memory};
    },

    getStage: function(room) {
        var stage = 1;
        let capacity = room.energyCapacityAvailable;
        for(var level in this.properties.stages) {
            if(capacity >= this.properties.stages[level].maxEnergyCapacity) {
                stage = level;
            }
        }

        return stage;
    }
};