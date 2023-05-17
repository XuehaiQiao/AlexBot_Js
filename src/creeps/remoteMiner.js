// no repair logic yet, no added to creeps yet
module.exports = {
    properties: {
        role: "remoteMiner",
        body: [...new Array(32).fill(WORK), CARRY, CARRY, ...new Array(16).fill(MOVE)] //cost: 3200+100+800 = $4100
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            return;
        }

        if(!creep.memory.targetId) creep.memory.targetId = creep.room.find(FIND_MINERALS)[0].id;
        let mineral = Game.getObjectById(creep.memory.targetId);

        if(keeperLairLogic(creep, mineral)) return;

        if(creep.memory.rest) {
            creep.memory.rest -= 1;
            return;
        }

        let container = Game.getObjectById(creep.memory.containerId);
        if(container) {
            haveContainerMineLogic(creep, mineral, container);
        }
        else {
            noContainerMineLogic(creep, mineral);
        }

        if(mineral.ticksToRegeneration > 0) {
            Memory.outSourceRooms[creep.room.name].mineralRegenTime = Game.time + mineral.ticksToRegeneration;
        }
    },

    // checks if the room needs to spawn a creep (logic differ from others)
    spawn: function(room, roomName) {
        if(room.energyCapacityAvailable < 5600) return false;
        if(!Memory.outSourceRooms[roomName] || Memory.outSourceRooms[roomName].neutral !== true) return false;
        
        if(!Game.rooms[roomName]) return false;
        mine = Game.rooms[roomName].find(FIND_MINERALS)[0];
        if(mine.mineralAmount === 0) return false;
        if(room.storage && room.storage.store[mine.resourceType] > 80000) return false;

        // check if need spawn
        let creepCount;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;
        
        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, outSourceRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.body;
        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName};

        return {name, body, memory};
    },
};

var haveContainerMineLogic = function(creep, mine, container) {
    if(!creep.pos.isEqualTo(container.pos)) {
        creep.moveToNoCreepInRoom(container);
    }
    else if(container.hits < container.hitsMax) {
        let nonEnergy = _.find(Object.keys(creep.store), resourceType => creep.store[resourceType] > 0 && resourceType !== RESOURCE_ENERGY);
        if(nonEnergy) {
            creep.drop(nonEnergy);
            return;
        }

        if(creep.store[RESOURCE_ENERGY] === 0) {
            let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: droped => droped.resourceType === RESOURCE_ENERGY});
            let tombs = creep.pos.findInRange(FIND_TOMBSTONES, 1, {filter: tomeb => tomeb.store[RESOURCE_ENERGY] > 0});
            if(drops.length) creep.pickup(drops[0]);
            else if(tombs.length) creep.withdraw(tombs[0], RESOURCE_ENERGY);
            else if(container.store[RESOURCE_ENERGY] > 0) creep.withdraw(container, RESOURCE_ENERGY);
        }
        creep.repair(container);
    }
    else {
        creep.harvest(mine);
        creep.memory.rest = 4;
    }
};

var noContainerMineLogic = function(creep, mine) {
    if(creep.pos.getRangeTo(mine) > 1) {
        creep.moveToNoCreepInRoom(mine);
    }

    let constSites = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 3, {filter: site => site.structureType === STRUCTURE_CONTAINER});
    if(constSites.length) {
        let nonEnergy = _.find(Object.keys(creep.store), resourceType => creep.store[resourceType] > 0 && resourceType !== RESOURCE_ENERGY);
        if(nonEnergy) {
            creep.drop(nonEnergy);
            return;
        }

        if(creep.store[RESOURCE_ENERGY] === 0) {
            let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: droped => droped.resourceType === RESOURCE_ENERGY});
            let tombs = creep.pos.findInRange(FIND_TOMBSTONES, 1, {filter: tomeb => tomeb.store[RESOURCE_ENERGY] > 0});
            if(drops.length) creep.pickup(drops[0]);
            if(tombs.length) creep.withdraw(tombs[0], RESOURCE_ENERGY);
        }
        creep.build(constSites[0]);
    }
    else {
        let result = creep.harvest(mine);
        if(result === OK) {
            creep.memory.rest = 4;
        }
    }
};

function keeperLairLogic(creep, mineral) {
    // keepLair logic
    if (Memory.outSourceRooms[creep.memory.targetRoom] && Memory.outSourceRooms[creep.memory.targetRoom].sourceKeeper === true) {
        if(!creep.memory.keeperLairId) {
            creep.memory.keeperLairId = mineral.pos.findInRange(FIND_STRUCTURES, 5, {filter: struct => struct.structureType === STRUCTURE_KEEPER_LAIR})[0].id;
        }
        let keeperLair = Game.getObjectById(creep.memory.keeperLairId);
        if(keeperLair.ticksToSpawn < 10) {
            creep.memory.rest = 0;
            if(creep.store.getUsedCapacity() > 0) {
                let resourceType = _.find(Object.keys(creep.store), rt => creep.store[rt] > 0 && rt !== RESOURCE_ENERGY);
                creep.drop(resourceType);
            }
            if(creep.pos.getRangeTo(keeperLair) < 8) creep.moveToRoomAdv(creep.memory.base);
            return true;
        }

        let hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostileCreep) {
            let distance = creep.pos.getRangeTo(hostileCreep);

            if (distance < 3) {
                // move away
                return true;
            }
            else if (distance <= 6) {
                return true;
            }
        }
    }

    return false;
}