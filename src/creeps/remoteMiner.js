// no repair logic yet, no added to creeps yet
module.exports = {
    properties: {
        role: 'remoteMiner',
        body: [...new Array(32).fill(WORK), CARRY, CARRY, ...new Array(16).fill(MOVE)],
        boostInfo: { UHO2: 32 },
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        // boost if needed
        if (creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.getBoosts();
            return;
        }

        // move to its target room if not in
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            return;
        }

        if (!creep.memory.targetId) creep.memory.targetId = creep.room.find(FIND_MINERALS)[0].id;
        let mineral = Game.getObjectById(creep.memory.targetId);

        if (keeperLairLogic(creep, mineral)) return;

        container = mineral.pos.findInRange(FIND_STRUCTURES, 1, { filter: struct => struct.structureType == STRUCTURE_CONTAINER })[0];
        if (container) {
            creep.memory.containerId = container.id;
            haveContainerMineLogic(creep, mineral, container);
        }
        else noContainerMineLogic(creep, mineral);

    },

    // checks if the room needs to spawn a creep (logic differ from others)
    spawn: function (room, roomName) {
        if (room.energyCapacityAvailable < 5600) return false;
        if (!Memory.outSourceRooms[roomName] || Memory.outSourceRooms[roomName].neutral !== true) return false;

        if (!Game.rooms[roomName]) return false;
        mine = Game.rooms[roomName].find(FIND_MINERALS)[0];
        if (mine.mineralAmount === 0) return false;
        if (room.storage && room.storage.store[mine.resourceType] > 50000) return false;

        // check if need spawn
        let creepCount;
        if (global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room, outSourceRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.body;
        let memory = {
            role: this.properties.role,
            base: room.name,
            targetRoom: outSourceRoomName,
            boost: true,
            boostInfo: this.properties.boostInfo
        };

        return { name, body, memory };
    },
};

var haveContainerMineLogic = function (creep, mine, container) {


    let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 4, { filter: d => d.resourceType === RESOURCE_ENERGY });
    let tombs = creep.pos.findInRange(FIND_TOMBSTONES, 4, { filter: tb => tb.store[RESOURCE_ENERGY] > 0 });
    if (container.hits < container.hitsMax && (drops.length > 0 || tombs.length > 0)) {
        creep.say("repair")
        let nonEnergy = _.find(Object.keys(creep.store), resourceType => creep.store[resourceType] > 0 && resourceType !== RESOURCE_ENERGY);
        if (nonEnergy) {
            creep.drop(nonEnergy);
            return;
        }

        if (creep.store[RESOURCE_ENERGY] === 0) {
            if (drops.length) {
                if (creep.pickup(drops[0]) === ERR_NOT_IN_RANGE) creep.moveTo(drops[0]);
            }
            else if (tombs.length) {
                if (creep.withdraw(tombs[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.moveTo(tombs[0]);
            }
            else if (container.store[RESOURCE_ENERGY] > 0) creep.withdraw(container, RESOURCE_ENERGY);
        }
        creep.repair(container);
    }
    else {
        if (!creep.pos.isEqualTo(container.pos)) {
            creep.moveToNoCreepInRoom(container);
            return;
        }
        else creep.harvest(mine);
    }
};

var noContainerMineLogic = function (creep, mine) {
    let constSites = mine.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 3);
    let drops = mine.pos.findInRange(FIND_DROPPED_RESOURCES, 4, { filter: d => d.resourceType === RESOURCE_ENERGY });
    let tombs = mine.pos.findInRange(FIND_TOMBSTONES, 4, { filter: tb => tb.store[RESOURCE_ENERGY] > 0 });

    if (constSites.length && (drops.length || tombs.length)) {
        creep.say('build');
        let nonEnergy = _.find(Object.keys(creep.store), resourceType => creep.store[resourceType] > 0 && resourceType !== RESOURCE_ENERGY);
        if (nonEnergy) {
            creep.drop(nonEnergy);
            return;
        }

        if (creep.store[RESOURCE_ENERGY] === 0) {
            if (drops.length) {
                if (creep.pickup(drops[0]) === ERR_NOT_IN_RANGE) creep.moveTo(drops[0]);
            }
            else if (tombs.length) {
                if (creep.withdraw(tombs[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.moveTo(tombs[0]);
            }
        }
        
        if(creep.build(constSites[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(constSites[0]);
        }
    }
    else {
        if (creep.pos.getRangeTo(mine) > 1) {
            creep.moveToNoCreepInRoom(mine);
        }

        creep.harvest(mine);
    }
};

function keeperLairLogic(creep, mineral) {
    // keepLair logic
    if (Memory.outSourceRooms[creep.memory.targetRoom] && Memory.outSourceRooms[creep.memory.targetRoom].sourceKeeper === true) {
        if (!creep.memory.keeperLairId) {
            creep.memory.keeperLairId = mineral.pos.findInRange(FIND_STRUCTURES, 5, { filter: struct => struct.structureType === STRUCTURE_KEEPER_LAIR })[0].id;
        }
        let keeperLair = Game.getObjectById(creep.memory.keeperLairId);
        if (keeperLair.ticksToSpawn <= 12) {
            creep.memory.rest = 0;
            if (creep.store.getUsedCapacity() > 0) {
                let resourceType = _.find(Object.keys(creep.store), rt => creep.store[rt] > 0);
                creep.drop(resourceType);
            }
            if (creep.pos.getRangeTo(keeperLair) <= 4) creep.moveToRoomAdv(creep.memory.base);
            return true;
        }

        let hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostileCreep) {
            let distance = creep.pos.getRangeTo(hostileCreep);

            if (distance <= 4) {
                // move away
                creep.moveToRoomAdv(creep.memory.base);
                return true;
            }
            else if (distance <= 5) {
                return true;
            }
        }
    }

    return false;
}