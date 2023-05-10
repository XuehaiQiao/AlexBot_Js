
module.exports = {
    properties: {
        role: "miner",
        stages: {
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], cBodyParts: [...new Array(16).fill(WORK), ...new Array(8).fill(MOVE)]},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], cBodyParts: [...new Array(32).fill(WORK), ...new Array(16).fill(MOVE)]},
        },
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.rest) {
            creep.memory.rest -= 1;
        }

        let mine = creep.room.find(FIND_MINERALS)[0];
        let container = Game.getObjectById(creep.memory.container);
        if(container) {
            haveContainerLogic(creep, mine, container);
        }
        else {
            noContainerLogic(creep, mine);
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        // check mineralAmount & if have extractor
        let mineral = room.find(FIND_MINERALS)[0];
        let extractor = _.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType == STRUCTURE_EXTRACTOR);
        
        // mineral has resources, room have extractor, storage have less than 100000 this mineral type
        if(mineral.mineralAmount == 0) return false;
        if(!extractor) return false;
        if(room.storage && room.storage.store[mineral.mineralType] >= 80000) return false;
        
        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body;
        let memory = {role: this.properties.role, status: 0, base: room.name};
        let stage = this.getStage(room);

        if(!room.memory.mineContainerId) {
            let mine = room.find(FIND_MINERALS)[0];
            let containers = mine.pos.findInRange(room.find(FIND_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_CONTAINER}), 1);
            if(containers.length > 0) {
                room.memory.mineContainerId = containers[0].id;
            }
        }
        
        if(Game.getObjectById(room.memory.mineContainerId)) {
            memory.container = room.memory.mineContainerId;
            body = this.properties.stages[stage].cBodyParts;
        }
        else {
            body = this.properties.stages[stage].bodyParts;
            delete room.memory.mineContainerId;
        }


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
    },
};

var haveContainerLogic = function(creep, mine, container) {
    if(!creep.pos.isEqualTo(container.pos)) {
        creep.moveToNoCreepInRoom(container);
    }
    else {
        creep.harvest(mine);
        creep.memory.rest = 4;
    }
};

var noContainerLogic = function(creep, mine) {
    creep.workerSetStatus();

    // transfer
    if(creep.memory.status) {
        let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
        if(creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage);
        }
    }
    // harvest
    else {
        let result = creep.harvest(mine);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(mine);
            
            //look for adjacent droped resources
            let dropedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if(dropedResources.length) creep.pickup(dropedResources[0]);
        }
        else {
            creep.memory.rest = 4;
        }
    }
};