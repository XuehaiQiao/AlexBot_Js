module.exports = {
    properties: {
        role: "remoteHarvester",
        stages: {
            1: { maxEnergyCapacity: 300, bodyParts: [WORK, WORK, CARRY, MOVE], number: 2 },
            2: { maxEnergyCapacity: 550, bodyParts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 1 },
            3: { maxEnergyCapacity: 800, bodyParts: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 1 },
            4: { maxEnergyCapacity: 1300, bodyParts: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], number: 1 },
            7: { maxEnergyCapacity: 5600, bodyParts: [...new Array(12).fill(WORK), CARRY, CARRY, ...new Array(6).fill(MOVE)], number: 1 },
        },
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        // move to its target room if not in
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            return;
        }

        // keep lair logic
        if (Memory.outSourceRooms[creep.memory.targetRoom] && Memory.outSourceRooms[creep.memory.targetRoom].sourceKeeper === true) {
            if(creep.memory.target !== undefined) {
                let source = creep.room.find(FIND_SOURCES)[creep.memory.target];
                if(!creep.memory.keeperLairId) {
                    creep.memory.keeperLairId = source.pos.findInRange(FIND_STRUCTURES, 5, {filter: struct => struct.structureType === STRUCTURE_KEEPER_LAIR})[0].id;
                }
                let keeperLair = Game.getObjectById(creep.memory.keeperLairId);
                if(keeperLair.ticksToSpawn <= 12) {
                    creep.memory.rest = 0;
                    if(creep.store[RESOURCE_ENERGY] > 0) creep.drop(RESOURCE_ENERGY);
                    if(creep.pos.getRangeTo(keeperLair) <= 5) creep.moveToRoomAdv(creep.memory.base);
                    return;
                }
            }

            let hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (hostileCreep) {
                let distance = creep.pos.getRangeTo(hostileCreep);

                if (distance <= 4) {
                    creep.moveToRoomAdv(creep.memory.base);
                    return;
                }
                else if (distance <= 5) {
                    return;
                }
            }
        }
        
        if (creep.memory.rest) {
            creep.memory.rest -= 1;
            return;
        }

        // harvest
        let result = creep.harvestEnergy();

        // source no energy or container full
        if (creep.memory.target != undefined && result == ERR_NOT_ENOUGH_RESOURCES) {
            let source = creep.room.find(FIND_SOURCES)[creep.memory.target];
            creep.say('no e')
            if (!creep.memory.containerId) {
                let containerList = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: struct => struct.structureType == STRUCTURE_CONTAINER });
                if (containerList.length) creep.memory.containerId = containerList[0].id;
            }

            let container = Game.getObjectById(creep.memory.containerId);
            if (container && container.hits < container.hitsMax && container.store[RESOURCE_ENERGY] > 0) {
                if (creep.store[RESOURCE_ENERGY] == 0) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {reusePath: 20, maxRooms: 1});
                    }
                }
                creep.repair(container);
            }
            //build container if need
            else {
                let constSites = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 3, {filter: site => site.structureType === STRUCTURE_CONTAINER});
                if(constSites.length) {
                    if(creep.store[RESOURCE_ENERGY] === 0) {
                        let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: droped => droped.resourceType === RESOURCE_ENERGY});
                        creep.pickup(drops[0]);
                    }
                    creep.build(constSites[0]);
                }
                else if(source.energy === 0) {
                    creep.memory.rest = source.ticksToRegeneration;
                    return;
                }
            }
        }


    },

    // checks if the room needs to spawn a creep (logic differ from others)
    spawn: function (room, roomName) {
        const stage = this.getStage(room);

        // check if need spawn
        let creepCount;
        if (global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        let sourceNum = 1;
        if (!Memory.outSourceRooms[roomName]) Memory.outSourceRooms[roomName] = {};
        if (Memory.outSourceRooms[roomName].sourceNum != undefined) {
            sourceNum = Memory.outSourceRooms[roomName].sourceNum;
        }
        else if (Game.rooms[roomName]) {
            Memory.outSourceRooms[roomName].sourceNum = Game.rooms[roomName].find(FIND_SOURCES).length;
        }

        let totalNeeds;
        const rInfo = Memory.rooms[roomName].memory.roomInfo;
        if(rInfo) {
            for(const sourceObj of rInfo.sourceInfo) {
                totalNeeds += Math.min(this.properties.stages[stage].number, sourceObj.space);
            }
        }
        else {
            totalNeeds = sourceNum * this.properties.stages[stage].number
        }

        if (creepCount < totalNeeds) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room, outSourceRoomName) {
        const stage = this.getStage(room);
        const rInfo = room.memory.roomInfo;

        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts;

        const existingThisTypeCreeps = _.filter(Game.creeps, creep => (
            creep.memory.role == this.properties.role && 
            creep.memory.base == room.name &&
            !(creep.ticksToLive < creep.body.length * 3)
        ));
        
        let targetCount = {}
        existingThisTypeCreeps.forEach((creep) => {
            let targetId = creep.memory.target;
            if(targetCount[targetId]) targetCount[targetId] += 1;
            else targetCount[targetId] = 1;
        });

        let sourceCount = 1;
        if (Memory.outSourceRooms[outSourceRoomName]) {
            sourceCount = Memory.outSourceRooms[outSourceRoomName].sourceNum;
        }

        let sourceTarget;
        if(rInfo) {
            let sources = room.find(FIND_SOURCES);
            for(const index in sources) {
                let creepNeed = Math.min(this.properties.stages[stage].number, rInfo.sourceInfo[index].space);
                if (targetCount[index] >= creepNeed) continue;
                sourceTarget = index;
                break;
            }
        }
        else {
            for (var i = 0; i < sourceCount; i++) {
                let creepNeed = this.properties.stages[stage].number;
                if (targetCount[index] >= creepNeed) continue;
                sourceTarget = index;
                break;
            }
        }

        let memory = { role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName, target: sourceTarget };

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