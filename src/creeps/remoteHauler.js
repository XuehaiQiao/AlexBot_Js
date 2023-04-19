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
            1: {maxEnergyCapacity: 300, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            2: {maxEnergyCapacity: 550, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, ...new Array(9).fill(CARRY), ...new Array(5).fill(MOVE)], number: 1},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, ...new Array(13).fill(CARRY), ...new Array(7).fill(MOVE)], number: 2},
            5: {maxEnergyCapacity: 1800, bodyParts:[WORK, ...new Array(15).fill(CARRY), ...new Array(8).fill(MOVE)], number: 2},
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
                return;
            }

            // move to its target room if not in
            if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
                return;
            }

            // set which Source is creep's target
            let targetSource = creep.memory.targetSource;
            if(targetSource == undefined || targetSource == null) {
                targetSource = Memory.outSourceRooms[creep.room.name].targetSource;
                if(targetSource === undefined) {
                    Memory.outSourceRooms[creep.room.name].targetSource = 1 % Memory.outSourceRooms[creep.room.name].sourceNum;
                    targetSource = 0;
                }
                else {
                    Memory.outSourceRooms[creep.room.name].targetSource = (targetSource + 1) % Memory.outSourceRooms[creep.room.name].sourceNum;
                }
                
                creep.memory.targetSource = targetSource;
            }
            

            let source = creep.room.find(FIND_SOURCES)[targetSource];
            // find dropedResource
            let dropedResources = source.pos.findInRange(FIND_DROPPED_RESOURCES, 3, {filter: resource => (
                resource.amount > Math.min(creep.store.getFreeCapacity(), creep.store.getCapacity() / 3)
            )});
            if (dropedResources.length) {
                let result = creep.pickup(dropedResources[0]);
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(dropedResources[0]);
                }
                return;
            }
        
            // find container
            let containers = source.pos.findInRange(FIND_STRUCTURES, 3, {filter: structure => (
                structure.structureType == STRUCTURE_CONTAINER && 
                structure.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity()
            )});
            if (containers.length) {
                let result = creep.withdraw(containers[0], RESOURCE_ENERGY);
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(containers[0]);
                }
                return;
            }

            if(!creep.pos.inRangeTo(source.pos, 3)) {
                creep.moveToNoCreepInRoom(source);
            }
            else {
                creep.memory.rest = 20;
            }
            return;
        }
        // transfer (same as outSourcer)
        else {
            // reset targetSource:
            if(creep.memory.targetSource != null) {
                creep.memory.targetSource = null;
            }
            
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
                if(creep.build(myConstuct[0]) == OK) return;
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
                    creep.moveToNoCreep(roomInfo[creep.room.name].restPos);
                    return;
                };
            }
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreep(target);
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

        let sourceNum = 1;
        if(Memory.outSourceRooms[roomName] && Memory.outSourceRooms[roomName].sourceNum) {
            sourceNum = Memory.outSourceRooms[roomName].sourceNum;
        }
        else if(Game.rooms[roomName]) {
            Memory.outSourceRooms[roomName] = {sourceNum: Game.rooms[roomName].find(FIND_SOURCES).length};
        }

        if (creepCount < sourceNum * this.properties.stages[this.getStage(room)].number) {
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