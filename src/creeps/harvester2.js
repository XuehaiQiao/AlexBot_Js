var harvester2 = {
    properties: {
        role: 'harvester2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, WORK, CARRY, MOVE], number: 1},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], number: 1},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 1},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], number: 1},
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
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        // harvest
        let result = creep.harvestEnergy();

        if(result == ERR_NOT_ENOUGH_RESOURCES) {
            let source = creep.room.find(FIND_SOURCES)[creep.memory.target];
            if(source) creep.memory.rest = source.ticksToRegeneration;
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var sourceCount = Math.min(2, room.find(FIND_SOURCES).length);

        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        if (creepCount < sourceCount) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        let stage = this.getStage(room);
        let name = this.properties.role + Game.time; 
        let body = this.properties.stages[stage].bodyParts;


        var existingThisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.room.name == room.name);
        var existingTargets = []
        _.forEach(existingThisTypeCreeps, function(creep){existingTargets.push(creep.memory.target)});

        var sourceTarget = 0;

        var sourceCount = Math.min(2, room.find(FIND_SOURCES).length);

        for(var i = 0; i < sourceCount; i++) {
            if (!existingTargets.includes(i)) {
                sourceTarget = i;
                break;
            }
        }

        let memory = {role: this.properties.role, status: 0, target: sourceTarget, base: room.name};

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

module.exports = harvester2;