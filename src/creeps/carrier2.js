var carrier2 = {
    properties: {
        type: 'carrier2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[CARRY, MOVE, CARRY, MOVE], number: 2},
            2: {maxEnergyCapacity: 550, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            3: {maxEnergyCapacity: 800, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(16).fill(CARRY), ...new Array(8).fill(MOVE)], number: 2},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(20).fill(CARRY), ...new Array(10).fill(MOVE)], number: 2},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(20).fill(CARRY), ...new Array(10).fill(MOVE)], number: 2},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(20).fill(CARRY), ...new Array(10).fill(MOVE)], number: 2},
            8: {maxEnergyCapacity: 10000, bodyParts:[...new Array(32).fill(CARRY), ...new Array(16).fill(MOVE)], number: 2},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        // if creep in rest
        if (creep.memory.restTime > 0) {
            creep.memory.restTime -= 1;
            return;
        }

        // set status: 0. harvest  1. transfer 
        creep.workerSetStatus();

        // extension, spawn, tower
        var needFeedStructure = _.find(creep.room.find(FIND_MY_STRUCTURES), (structure) => (
            ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
            (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 300)
            //(structure.structureType == STRUCTURE_LAB && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        ))

        // if no need feeds, put energy to storage
        if(needFeedStructure) {
            this.toNeedFeed(creep);
        }
        else {
            this.toStorage(creep);
        }
    },

    // from [drop, container] to [storage]
    toStorage: function(creep) {
        // console.log("in toStorage", creep.id)
        var storage = creep.room.storage;
        
        // if no storage, change target to containers that near controller
        if(!storage) {
            let containers = creep.room.find(FIND_STRUCTURES, {filter: struct => (
                struct.structureType == STRUCTURE_CONTAINER &&
                struct.pos.inRangeTo(creep.room.controller.pos, 3) &&
                struct.store.getFreeCapacity() > 0
            )});
            if(containers.length) {
                storage = containers[0];
            }
        }

        if (!storage || storage.store.getFreeCapacity() == 0) {
            // go rest
            creep.toResPos(10);
        }

        // harvest
        if(creep.memory.status == 0) {
            if(!creep.collectEnergy()) {
                creep.toResPos();
            }
            return;
        }
        // transfer
        else {
            if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
            return;
        }
    },

    // from [drop, container, storage] to [extension, spawn, tower]
    toNeedFeed: function(creep) {
        // harvest
        if(creep.memory.status == 0) {
            creep.takeEnergyFromClosest();

            return;
        }
        // transfer
        else {
            // list includes: spawn and extensions

            // extension && spwan
            var extensionSpawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function(object) {
                    return (object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN) && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (extensionSpawn) {
                if(creep.transfer(extensionSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(extensionSpawn);
                }
                return;
            }

            //tower
            var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function(object) {
                    return object.structureType == STRUCTURE_TOWER && object.store.getFreeCapacity(RESOURCE_ENERGY) > 300
                }
            });
            if (tower) {
                if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(tower);
                }
                return;
            }

            // //lab
            // var lab = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            //     filter: function(object) {
            //         return object.structureType == STRUCTURE_LAB && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            //     }
            // });
            // if (lab) {
            //     if(creep.transfer(lab, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveToNoCreepInRoom(lab);
            //     }
            //     return;
            // }
            

            // if no transfer needs
            creep.toResPos();
            return;
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        // var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.type && creep.room.name == room.name);

        var stage = this.getStage(room);

        let creepCount;
        if(global.roomCensus[room.name][this.properties.type]) creepCount = global.roomCensus[room.name][this.properties.type]
        else creepCount = 0;

        return creepCount < this.properties.stages[stage].number? true : false;
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        let body = this.properties.stages[stage].bodyParts;
        let memory = {role: this.properties.type, status: 1, base: room.name};

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

module.exports = carrier2;