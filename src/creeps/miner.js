
module.exports = {
    properties: {
        role: "miner",
        stages: {
            6: { maxEnergyCapacity: 2300, bodyParts: [...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], cBodyParts: [...new Array(16).fill(WORK), ...new Array(8).fill(MOVE)] },
            7: { maxEnergyCapacity: 5600, bodyParts: [...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], cBodyParts: [...new Array(32).fill(WORK), ...new Array(16).fill(MOVE)] },
        },
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.rest) {
            creep.memory.rest -= 1;
        }

        let extractor = creep.room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_EXTRACTOR })[0];
        if (!extractor) return;
        let mine = creep.room.find(FIND_MINERALS, { filter: mine => mine.pos.isEqualTo(extractor.pos) })[0];

        let container = Game.getObjectById(creep.memory.container);
        if (container) {
            haveContainerLogic(creep, mine, container);
        }
        else {
            noContainerLogic(creep, mine);
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function (room) {
        // check mineralAmount & if have extractor

        let extractor = _.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType == STRUCTURE_EXTRACTOR);
        if (!extractor) return false;
        let mineral = room.find(FIND_MINERALS, { filter: mineral => mineral.pos.isEqualTo(extractor.pos) })[0];
        if (!mineral || !mineral.mineralAmount) return false;

        if (room.storage && room.storage.store[mineral.mineralType] >= 50000) return false;

        let creepCount;
        if (global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room) {
        let name = this.properties.role + Game.time;
        let body;
        let memory = { role: this.properties.role, status: 0, base: room.name };
        let stage = this.getStage(room);

        let extractor = room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_EXTRACTOR })[0];
        let container = extractor.pos.findInRange(room.find(FIND_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_CONTAINER }), 1)[0];
        if (container) {
            memory.container = container.id;
            body = this.properties.stages[stage].cBodyParts;
        }
        else {
            body = this.properties.stages[stage].bodyParts;
        }

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
    },
};

var haveContainerLogic = function (creep, mine, container) {
    if(!mine) return;
    
    if(mine.mineralType === RESOURCE_THORIUM && creep.pos.isEqualTo(container.pos)) {
        creep.fleeFromAdv(container, 1);
    }

    if (creep.memory.countDown) {       
        creep.memory.countDown -= 1;
    }
    else if (!creep.pos.isEqualTo(container.pos)) {
        creep.moveToNoCreepInRoom(container);
    }
    else {
        creep.harvest(mine);
        creep.memory.countDown = 4;
        //creep.memory.rest = 4;
    }
};

var noContainerLogic = function (creep, mine) {
    creep.workerSetStatus();

    // transfer
    if (creep.memory.status) {
        let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
        if (creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage);
        }
    }
    // harvest
    else {
        let result = creep.harvest(mine);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(mine);

            //look for adjacent droped resources
            let dropedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if (dropedResources.length) creep.pickup(dropedResources[0]);
        }
        else {
            creep.memory.rest = 4;
        }
    }
};