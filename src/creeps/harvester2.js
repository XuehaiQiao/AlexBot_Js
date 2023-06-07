module.exports = {
    properties: {
        role: 'harvester2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, WORK, MOVE, MOVE], number: 3},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, WORK, WORK, MOVE, MOVE], number: 2},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 1},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 1},
            //7: {maxEnergyCapacity: 5600, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], number: 1},
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
            if(!source.energy) creep.memory.rest = source.ticksToRegeneration;
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        const sourceCount = room.find(FIND_SOURCES).length;
        const stage = this.getStage(room);

        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        let totalNeeds = 0;
        const rInfo = room.memory.roomInfo;
        if(rInfo) {
            for(const sourceObj of rInfo.sourceInfo) {
                totalNeeds += Math.min(this.properties.stages[stage].number, sourceObj.space);
            }
        }
        else {
            totalNeeds = sourceCount * this.properties.stages[stage].number
        }

        // console.log(totalNeeds);

        if (creepCount < totalNeeds) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        const stage = this.getStage(room);
        const rInfo = room.memory.roomInfo;

        const name = this.properties.role + Game.time; 
        const body = this.properties.stages[stage].bodyParts;

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

        let sourceTarget;
        let sources = room.find(FIND_SOURCES);
        for(const index in sources) {
            let creepNeed;
            if(rInfo) {
                creepNeed = Math.min(this.properties.stages[stage].number, rInfo.sourceInfo[index].space);
            }
            else creepNeed = this.properties.stages[stage].number;

            if (targetCount[index] >= creepNeed) continue;
            sourceTarget = index;
            break;
        }

        const memory = {role: this.properties.role, status: 0, target: sourceTarget, base: room.name};

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