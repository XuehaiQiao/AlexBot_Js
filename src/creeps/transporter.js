var transporter = {
    properties: {
        type: 'transporter',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[...new Array(3).fill(CARRY), ...new Array(3).fill(MOVE)]},
            2: {maxEnergyCapacity: 550, bodyParts:[...new Array(5).fill(CARRY), ...new Array(5).fill(MOVE)]},
            3: {maxEnergyCapacity: 800, bodyParts:[...new Array(7).fill(CARRY), ...new Array(7).fill(MOVE)]},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)]},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(15).fill(CARRY), ...new Array(15).fill(MOVE)]},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(20).fill(CARRY), ...new Array(20).fill(MOVE)]},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(25).fill(CARRY), ...new Array(25).fill(MOVE)]},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // set status: 0. harvest  1. transfer 
        creep.workerSetStatus();

        switch(creep.memory.workType) {
            case 1:
                this.collectDropedResources(creep, creep.memory.targetResourceType);
                break;
            default:
                this.tranEnergyBetweenMyRooms(creep);
        }
    },

    // collect droped resources
    collectDropedResources: function(creep, resourceType) {
        // harvest
        if(creep.memory.status == 0) {
            // move to its target room if not in
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoom(creep.memory.targetRoom);
                return;
            }

            // first find droped recources
            let dropedRecource;
            if(resourceType) {
                dropedRecource = _.find(creep.room.find(FIND_DROPPED_RESOURCES), resource => resource.resourceType == resourceType);
            }
            else dropedRecource = _.find(creep.room.find(FIND_DROPPED_RESOURCES));

            if (dropedRecource) {
                if(creep.pickup(dropedRecource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedRecource, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else creep.suicide();
        }
        // transfer
        else {
            // move to its base room if not in
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }

            // list includes: avaliable storage
            var storage = creep.room.storage;

            if(!storage || storage.store.getFreeCapacity() == 0) {
                // if no transfer needs
                creep.suicide();
                return;
            }

            var resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if(creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
    },

    // transfer energy from one room to another (base room controll level < 6, no terminal)
    tranEnergyBetweenMyRooms: function(creep) {
        // harvest
        if(!creep.memory.status) {
            // move to its target room if not in
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoom(creep.memory.targetRoom);
                return;
            }

            creep.takeEnergyFromClosest();
        }
        // transfer
        else {
            // move to its base room if not in
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }

            // list includes: avaliable storage
            let storage = creep.room.storage;
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

            if(!storage) {
                if(creep.pos.inRangeTo(creep.room.controller.pos, 2)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveTo(storage);
            }
            else if(storage.store.getFreeCapacity() == 0) {
                if(creep.pos.inRangeTo(storage.pos, 2)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveTo(storage);
            }
            else { 
                if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        // only spawn when brain required
        return false;
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

module.exports = transporter;