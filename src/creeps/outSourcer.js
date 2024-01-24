const { roomInfo } = require("../config");

/*
outSourcer1 - first generation out sourcer

description:
have equal amount of [WORK, MOVE, CARRY],
harvest energy source from other room and bring energy back.
*/
module.exports = {
    properties: {
        role: "outSourcer",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, CARRY, MOVE, MOVE], number: 3},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, CARRY, CARRY, CARRY, CARRY,  MOVE, MOVE, MOVE], number: 3}, // 550
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], number: 3}, // 700
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(3).fill(WORK), ...new Array(9).fill(CARRY), ...new Array(6).fill(MOVE)], number: 2}, // 1050
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(4).fill(WORK), ...new Array(12).fill(CARRY), ...new Array(8).fill(MOVE)], number: 2},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(5).fill(WORK), ...new Array(15).fill(CARRY), ...new Array(10).fill(MOVE)], number: 2},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(5).fill(WORK), ...new Array(20).fill(CARRY), ...new Array(13).fill(MOVE)], number: 2}, // 500 + 1000 + 650 = 2150, total: 8600
        },
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // set status: 0. harvest  1. work 
        creep.workerSetStatus();

        if(!creep.memory.status) {
            // pick up near energy
            const nearEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: resource => resource.resourceType == RESOURCE_ENERGY});
            if(nearEnergy.length > 0) {
                creep.pickup(nearEnergy[0]);
            }

            // move to its target room if not in
            if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
                return;
            }

            creep.harvestEnergy()
        }
        else {
            // repair near road and container
            const needRepair = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => (
                (struct.structureType == STRUCTURE_ROAD || struct.structureType == STRUCTURE_CONTAINER) &&
                struct.hits < struct.hitsMax
                )});
            if(needRepair.length > 0) {
                creep.repair(needRepair[0]);
            }

            // build near road and container
            const myConstuct = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
            if(myConstuct.length > 0) {
                creep.build(myConstuct[0]);
                return;
            }

            // move to base room if not in
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }

            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: struct => (
                (struct.structureType == STRUCTURE_STORAGE || struct.structureType == STRUCTURE_CONTAINER) && struct.store.getFreeCapacity() > 0
            )});
            if (target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }

            let constructSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(constructSites.length > 0) {
                if(creep.build(constructSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructSites[0]);
                }
                return;
            }

            // go rest
            if (roomInfo[creep.room.name]) {
                creep.moveTo(roomInfo[creep.room.name].restPos);
                return;
            };
        }
    },

    // checks if the room needs to spawn a creep (logic differ from others)
    spawn: function(room, roomName) {
        // var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.memory.targetRoom == roomName);
        // console.log(this.properties.role + ': ' + thisTypeCreeps.length, roomName);
    
        // check if need spawn
        let creepCount;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < Memory.outSourceRooms[roomName].sourceNum * this.properties.stages[this.getStage(room)].number) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, outSourceRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts; // cost: 400 + 600 + 400 = 1400 or 500 + 750 + 500 = 1750
        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName};

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