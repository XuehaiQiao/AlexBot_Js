var remoteHarvester = {
    properties: {
        role: "remoteHarvester",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, WORK, CARRY, MOVE], number: 2},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, WORK, CARRY, MOVE, MOVE], number: 1},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], number: 1},
        },
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.rest) {
            creep.memory.rest -= 1;
            return;
        }

        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoomAdv(creep.memory.targetRoom);
            return;
        }

        // harvest
        let result = creep.harvestEnergy();

        // repair container when finished harvest source no energy
        if(creep.memory.target != undefined && result == ERR_NOT_ENOUGH_RESOURCES) {
            let source = creep.room.find(FIND_SOURCES)[creep.memory.target];
            creep.say('no e')
            if(creep.memory.containerId == undefined) {
                let containerList = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => struct.structureType == STRUCTURE_CONTAINER});
                if(containerList.length) creep.memory.containerId = containerList[0].id;
            }
            
            let container = Game.getObjectById(creep.memory.containerId);
            if (container && container.hits < container.hitsMax && container.store[RESOURCE_ENERGY] > 0) {
                if(creep.store[RESOURCE_ENERGY] == 0) {
                    if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
                creep.repair(container);
            }
            else {
                creep.memory.rest = source.ticksToRegeneration;
            }
            return;
        }
        
        
    },

    // checks if the room needs to spawn a creep (logic differ from others)
    spawn: function(room, roomName) {
        // const thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.memory.targetRoom == roomName);

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

        const existingThisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.memory.targetRoom == outSourceRoomName);
        var existingTargets = _.map(existingThisTypeCreeps, creep => creep.memory.target)

        const sourceCount = Memory.outSourceRooms[outSourceRoomName].sourceNum;
        var sourceTarget;
        for(var i = 0; i < sourceCount; i++) {
            if (!existingTargets.includes(i)) {
                sourceTarget = i;
                break;
            }
        }

        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName, target: sourceTarget};

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
}

module.exports = remoteHarvester;