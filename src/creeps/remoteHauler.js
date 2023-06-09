const { roomInfo } = require("../config");

/*
    NOT FINISHED
    todo:
    1. calculate bodypart(WORK MOVE CARRY) / number needed for each room
    2. go directly to target if have vison of the room
*/
module.exports = {
    properties: {

    },
    properties: {
        role: 'remoteHauler',
        stages: {
            1: { maxEnergyCapacity: 300, bodyParts: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 4 },
            2: { maxEnergyCapacity: 550, bodyParts: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2 },
            3: { maxEnergyCapacity: 800, bodyParts: [...new Array(7).fill(CARRY), ...new Array(7).fill(MOVE)], number: 3 },
            4: { maxEnergyCapacity: 1300, bodyParts: [WORK, ...new Array(13).fill(CARRY), ...new Array(7).fill(MOVE)], number: 2 },
            // 5: { maxEnergyCapacity: 1800, bodyParts: [WORK, ...new Array(15).fill(CARRY), ...new Array(8).fill(MOVE)], number: 2 },
            6: { maxEnergyCapacity: 2300, bodyParts: [WORK, ...new Array(27).fill(CARRY), ...new Array(14).fill(MOVE)], number: 1 }, // 100 + 1350 + 700 = 2150
            7: { maxEnergyCapacity: 5600, bodyParts: [WORK, WORK, ...new Array(31).fill(CARRY), ...new Array(17).fill(MOVE)], number: 1 }, // 200 + 1650 + 850 = 2700
        },
    },

    /** @param {Creep} creep **/
    run: function (creep) {
        // set status: 0. harvest  1. transfer 
        creep.workerSetStatus();

        // harvest
        if (creep.memory.status == 0) {
            // rest
            if (creep.memory.rest) {
                creep.memory.rest -= 1;
                return;
            }

            if (takeNearResources(creep)) return;

            // move to room if not in
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoom(creep.memory.targetRoom);
                return;
            }

            // keep lair logic
            if (Memory.outSourceRooms[creep.memory.targetRoom] && Memory.outSourceRooms[creep.memory.targetRoom].sourceKeeper === true) {
                if (aviodHostiles(creep)) return;
            }

            // if already have targetSource, use targetSource logic, if not, find target, if have, use target logic, if not, assign targetSource and use targetSource logic.
            if (creep.memory.targetSource != null) withdrawBySouce(creep);
            else if (creep.memory.targetId != null) withdrawByTarget(creep);
            else {
                
                let targetId = findTarget(creep);
                if (targetId == null) {
                    if (creep.memory.targetSource == null) creep.memory.targetSource = findTargetSourceIndex(creep);
                    withdrawBySouce(creep);
                    return;
                }
                else {
                    creep.memory.targetId = targetId;
                    withdrawByTarget(creep);
                }
            }
        }
        // transfer (same as outSourcer)
        else {
            // reset targetSource and targetId:
            if (creep.memory.targetSource != null) creep.memory.targetSource = null;
            if (creep.memory.targetId != null) creep.memory.targetId = null;

            // build near road and container
            const myConstuct = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
            if (myConstuct.length > 0 && creep.room.name !== creep.memory.base) {
                if (creep.build(myConstuct[0]) == OK) return;
            }

            // repair near road and container
            const needRepair = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: struct => (
                    (struct.structureType == STRUCTURE_ROAD || struct.structureType == STRUCTURE_CONTAINER) &&
                    struct.hits < struct.hitsMax
                )
            });
            if (needRepair.length > 0) {
                creep.repair(needRepair[0]);
            }

            // feed tower / extension / spawn
            const needTransfer = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
                filter: struct => (
                    (struct.structureType === STRUCTURE_SPAWN || struct.structureType === STRUCTURE_EXTENSION || struct.structureType === STRUCTURE_TOWER) &&
                    struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            });
            if (needTransfer.length > 0) {
                creep.say("tran");
                creep.transfer(needTransfer[0], RESOURCE_ENERGY);
            }

            // directly move to storage if can
            let baseRoom = Game.rooms[creep.memory.base]
            if (baseRoom) {
                let target = baseRoom.getStorage(creep.store.getUsedCapacity());
                if (!target || target.store.getFreeCapacity() < creep.store.getUsedCapacity()) {
                    if (creep.pos.inRangeTo(baseRoom.controller.pos, 4)) {
                        let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                        creep.drop(resourceType);
                    }
                    else creep.moveToNoCreep(baseRoom.controller);
                }
                else {
                    let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                    if (creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveToNoCreep(target);
                    }
                }
            }
            else {
                // move to base room if not in
                if (creep.memory.base && creep.memory.base != creep.room.name) {
                    creep.moveToRoom(creep.memory.base);
                    return;
                }
            }

        }
    },

    // checks if the room needs to spawn a creep
    spawn: function (room, roomName) {
        // current num
        let creepCount;
        if (global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        // -------------- need to add in other places --------------------------- start
        let sourceNum = 1;
        if (!Memory.outSourceRooms[roomName]) Memory.outSourceRooms[roomName] = {};
        if (Memory.outSourceRooms[roomName].sourceNum != undefined) {
            sourceNum = Memory.outSourceRooms[roomName].sourceNum;
        }
        else if (Game.rooms[roomName]) {
            Memory.outSourceRooms[roomName].sourceNum = Game.rooms[roomName].find(FIND_SOURCES).length;
        }
        // -------------- need to add in other places --------------------------- end

        // addition hauler if needed
        let addednum = 0;
        if ((global.roomCensus[roomName] && global.roomCensus[roomName]['remoteMiner'])) {
            addednum += 1;
        }
        if (Memory.outSourceRooms[roomName] && Memory.outSourceRooms[roomName].addHauler) {
            addednum += Memory.outSourceRooms[roomName].addHauler;
        }

        // check if need spawn
        if (creepCount < sourceNum * this.properties.stages[this.getStage(room)].number + addednum) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room, outSourceRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts;
        let memory = { role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName };

        return { name, body, memory };
    },

    getStage: function (room) {
        var stage = 1;
        let capacity = room.energyCapacityAvailable;
        for (var level in this.properties.stages) {
            if (capacity >= this.properties.stages[level].maxEnergyCapacity) {
                stage = level;
            }
        }
        return stage;
    }
};

function findTarget(creep) {
    let targetQ = Memory.outSourceRooms[creep.room.name].haulerTargets;
    if (!targetQ || !targetQ.length) {
        let takenIds = _.map(creep.room.find(FIND_MY_CREEPS, { filter: creep => creep.role === 'remoteHauler' }), c => c.memory.targetId);
        let containers = creep.room.find(FIND_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_CONTAINER && !takenIds.includes(struct.id) && struct.store.getUsedCapacity() >= creep.store.getCapacity() });
        let dropedResources = creep.room.find(FIND_DROPPED_RESOURCES, { filter: resource => !takenIds.includes(resource.id) && resource.amount > creep.store.getCapacity() * 0.8 });

        let targets = [...dropedResources, ...containers];
        Memory.outSourceRooms[creep.room.name].haulerTargets = _.map(targets, target => { return { id: target.id, amount: (target.store ? target.store.getUsedCapacity() : target.amount) } });
    }
    targetQ = Memory.outSourceRooms[creep.room.name].haulerTargets;

    while (targetQ.length > 0) {
        let { id, amount } = targetQ[0];
        if (Game.getObjectById(id) && amount > creep.store.getFreeCapacity()) {
            targetQ[0].amount -= creep.store.getFreeCapacity();
            return id;
        }
        else targetQ.shift();
    }

    return null;
}

function findTargetSourceIndex(creep) {
    let sourceNum = Memory.outSourceRooms[creep.room.name].sourceNum;
    let res = Memory.outSourceRooms[creep.room.name].targetSource;
    if (res == null) {
        Memory.outSourceRooms[creep.room.name].targetSource = 1 % sourceNum;
        return 0;
    }
    else {
        // asign a no hauler source
        for (var i = 0; i < sourceNum; i++) {
            let curIndex = (res + i) % sourceNum;
            if (creep.room.find(FIND_MY_CREEPS, { filter: c => c.memory.targetSource === curIndex }).length === 0) {
                Memory.outSourceRooms[creep.room.name].targetSource = (curIndex + 1) % sourceNum;
                return curIndex;
            }
        }

        Memory.outSourceRooms[creep.room.name].targetSource = (res + 1) % sourceNum;
        return res;
    }
}

function withdrawBySouce(creep) {
    let source = creep.room.find(FIND_SOURCES)[creep.memory.targetSource];

    // find dropedResource
    let dropedResources = source.pos.findInRange(FIND_DROPPED_RESOURCES, 3, {
        filter: resource => (resource.amount > creep.store.getCapacity() / 2)
    });
    if (dropedResources.length) {
        if (creep.pickup(dropedResources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(dropedResources[0]);
        }
        return;
    }

    // find container
    let containers = source.pos.findInRange(FIND_STRUCTURES, 2, {
        filter: structure => (
            structure.structureType === STRUCTURE_CONTAINER &&
            structure.store.getUsedCapacity() >= creep.store.getFreeCapacity()
        )
    });
    if (containers.length) {
        let container = containers[0];
        let resourceType = _.find(Object.keys(container.store), resource => container.store[resource] > 0);
        if (creep.withdraw(container, resourceType) === ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(container);
        }
        return;
    }

    if (!creep.pos.inRangeTo(source.pos, 4)) {
        creep.moveToNoCreepInRoom(source);
    }
    else {
        if (!Memory.outSourceRooms[creep.memory.targetRoom].sourceKeeper) creep.memory.rest = 3;
    }
}

function withdrawByTarget(creep) {
    let target = Game.getObjectById(creep.memory.targetId);
    if (!target) {
        creep.memory.targetId = null;
        return
    }
    else if (target.store && target.store.getUsedCapacity() <= creep.store.getFreeCapacity()) {
        creep.memory.targetId = null;
    }

    if (!creep.pos.inRangeTo(target.pos, 1)) {
        creep.moveToNoCreepInRoom(target);
        return;
    }

    if (target.amount) {
        creep.pickup(target);
    }
    else {
        let resourceType = _.find(Object.keys(target.store), resource => target.store[resource] > 0);
        creep.withdraw(target, resourceType);
    }
}


function takeNearResources(creep) {
    // pick up near resources
    const nearResouce = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: droped => creep.room.name != creep.memory.base || droped.pos.findInRange(creep.room.controller, 4).length === 0 });
    if (nearResouce.length > 0) {
        let result = creep.pickup(nearResouce[0]);
        if(result === OK && nearResouce[0].resourceType === RESOURCE_THORIUM) creep.memory.status = 1;
    }

    // withdraw near rains
    const nearRain = creep.pos.findInRange(FIND_RUINS, 1, { filter: ruin => ruin.store.getUsedCapacity() > 0 });
    if (nearRain.length > 0) {
        let resourceType = _.find(Object.keys(nearRain[0].store), resourceType => nearRain[0].store[resourceType] > 0);
        creep.withdraw(nearRain[0], resourceType);
        return true;
    }

    // tomstone
    const nearTomstone = creep.pos.findInRange(FIND_TOMBSTONES, 1, { filter: ts => ts.store.getUsedCapacity() > 0 });
    if (nearTomstone.length > 0) {
        let resourceType = _.find(Object.keys(nearTomstone[0].store), resourceType => nearTomstone[0].store[resourceType] > 0);
        let result = creep.withdraw(nearTomstone[0], resourceType);
        if (result === OK && nearTomstone[0].store[RESOURCE_ENERGY] > creep.store.getCapacity() * 0.9) creep.memory.status = 1;
        return true;
    }

    return false;
}

function aviodHostiles(creep) {
    let hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostileCreep) {
        let distance = creep.pos.getRangeTo(hostileCreep);

        if (distance <= 5) {
            creep.moveToRoomAdv(creep.memory.base);
            return true;
        }
        else if (distance <= 6) {
            return true;
        }
    }

    return false;
}