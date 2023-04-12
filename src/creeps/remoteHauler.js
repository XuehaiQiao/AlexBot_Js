/*
    NOT FINISHED
    todo:
    1. calculate bodypart(WORK MOVE CARRY) / number needed for each room
    2. advance strategys.
*/
var remoteHauler = {
    properties: {
        
    },
    properties: {
        role: 'remoteHauler',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[CARRY, MOVE, CARRY, MOVE], number: 2},
            2: {maxEnergyCapacity: 550, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            3: {maxEnergyCapacity: 800, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            4: {maxEnergyCapacity: 1300, bodyParts:[CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], number: 2},
            5: {maxEnergyCapacity: 1800, bodyParts:[CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], number: 2},
            6: {maxEnergyCapacity: 2300, bodyParts:[WORK, ...new Array(27).fill(CARRY), ...new Array(14).fill(MOVE)], number: 1}, // 100 + 1350 + 700 = 2150
            7: {maxEnergyCapacity: 5600, bodyParts:[WORK, WORK, ...new Array(31).fill(CARRY), ...new Array(17).fill(MOVE)], number: 1}, // 200 + 1650 + 850 = 2700
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // set status: 0. harvest  1. transfer 
        creep.workerSetStatus();

        // harvest
        if(creep.memory.status == 0) {
            // rest
            if(creep.memory.rest) {
                creep.memory.rest -= 1;
                return;
            }

            // pick up near energy
            const nearEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: resource => resource.resourceType == RESOURCE_ENERGY});
            if(nearEnergy.length > 0) {
                creep.pickup(nearEnergy[0]);
            }
            // tomstone
            const nearTomstone = creep.pos.findInRange(FIND_TOMBSTONES, 1, {filter: ts => ts.store[RESOURCE_ENERGY] > 0});
            if(nearTomstone.length > 0) {
                creep.withdraw(nearTomstone[0], RESOURCE_ENERGY);
            }

            // move to its target room if not in
            if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
                return;
            }

            // if no avilable source, move to nearest source
            var dropedResources = creep.room.find(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount > creep.store.getCapacity() / 2});
            if (dropedResources.length > 0) {
                let result = creep.pickup(dropedResources[0]);
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedResources[0]);
                }
                return;
            }
        
            // find containers
            var containers = creep.room.find(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity()});
            if (containers.length > 0) {
                let result = creep.withdraw(containers[0], RESOURCE_ENERGY);
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                }
                return;
            }

            let source = creep.room.find(FIND_SOURCES)[0];
            if(!creep.pos.inRangeTo(source.pos, 3)) {
                creep.moveTo(source, {reusePath: 20})
            }
            else {
                creep.memory.rest = 10;
            }
            return;
        }
        // transfer (same as outSourcer)
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
            const myConstuct = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1);
            if(myConstuct.length > 0) {
                creep.build(myConstuct[0]);
                return;
            }

            // move to base room if not in
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }

            // transfer to base room container / storage
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: struct => (
                (struct.structureType == STRUCTURE_STORAGE || struct.structureType == STRUCTURE_CONTAINER) && struct.store.getFreeCapacity() > 0
            )});
            if (!target) {
                // go rest
                if (roomInfo[creep.room.name]) {
                    creep.moveTo(roomInfo[creep.room.name].restPos);
                    return;
                };
            }
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room, roomName) {
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
        let body = this.properties.stages[this.getStage(room)].bodyParts;
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

module.exports = remoteHauler;