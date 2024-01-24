const { roomInfo } = require("../config");

module.exports = {
    properties: {
        type: 'carrier2',
        stages: {
            1: { maxEnergyCapacity: 300, bodyParts: [CARRY, MOVE, CARRY, MOVE], number: 4 },
            2: { maxEnergyCapacity: 550, bodyParts: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 4 },
            3: { maxEnergyCapacity: 800, bodyParts: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 3 },
            4: { maxEnergyCapacity: 1300, bodyParts: [...new Array(16).fill(CARRY), ...new Array(8).fill(MOVE)], number: 2 },
            5: { maxEnergyCapacity: 1800, bodyParts: [...new Array(20).fill(CARRY), ...new Array(10).fill(MOVE)], number: 2 },
            7: { maxEnergyCapacity: 10000, bodyParts: [...new Array(32).fill(CARRY), ...new Array(16).fill(MOVE)], number: 2 },
        },
    },

    /** @param {Creep} creep **/
    run: function (creep) {
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
            (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 300) ||
            (structure.structureType == STRUCTURE_LAB && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        ))

        // if no need feeds, put energy to storage
        if (needFeedStructure) {
            this.toNeedFeed(creep);
        }
        else {
            this.toStorage(creep);
        }
    },

    // from [drop, container] to [storage]
    toStorage: function (creep) {
        var storage = creep.room.storage;

        // if no storage, change target to containers that near controller
        if (!storage) {
            let containers = creep.room.find(FIND_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_CONTAINER });

            if (containers.length) {
                if (roomInfo[creep.room.name] && roomInfo[creep.room.name].storagePos) {
                    storage = _.find(containers, con => (
                        con.pos.isEqualTo(roomInfo[creep.room.name].storagePos) &&
                        con.store.getFreeCapacity() > 0
                    ));
                }

                if (!storage) {
                    storage = creep.pos.findClosestByRange(containers, {
                        filter: con => (
                            con.pos.inRangeTo(creep.room.controller.pos, 3) &&
                            con.store.getFreeCapacity() > 0
                        )
                    });
                }

                if (!storage) {
                    storage = creep.pos.findClosestByRange(containers, {
                        filter: con => con.pos.inRangeTo(creep.room.controller.pos, 3)
                    });
                }
            };
        }

        // withdraw/pickup
        if (!creep.memory.status) {
            if (!creep.collectEnergy()) {
                creep.toResPos();
            }
            return;
        }
        // transfer
        else {
            if (!storage) {
                if (creep.pos.inRangeTo(creep.room.controller.pos, 4)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveToNoCreepInRoom(creep.room.controller);
            }
            else if(storage.store.getFreeCapacity() === 0) {
                if (creep.pos.inRangeTo(storage.pos, 1)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveToNoCreepInRoom(creep.room.storage);
            }
            else if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(storage);
            }
            return;
        }
    },

    // from [drop, container, storage] to [extension, spawn, tower]
    toNeedFeed: function (creep) {
        // harvest
        if (!creep.memory.status) {
            creep.takeEnergyFromClosest();
            return;
        }
        // transfer
        else {
            // list includes: spawn and extensions
            let extensionSpawns = creep.room.find(FIND_MY_STRUCTURES, {
                filter: struct => (struct.structureType == STRUCTURE_EXTENSION || struct.structureType == STRUCTURE_SPAWN) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });

            if (extensionSpawns.length) {
                let nearestTarget = extensionSpawns.reduce((a, b) => {
                    return (creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b) > 0) ? b : a;
                });

                let result = creep.transfer(nearestTarget, RESOURCE_ENERGY);
                if (result === ERR_NOT_IN_RANGE) creep.moveToNoCreepInRoom(nearestTarget);
                else if (result === OK) {
                    if (extensionSpawns.length > 1) {
                        let nextTarget = extensionSpawns.reduce((a, b) => {
                            if (a == nearestTarget) return b;
                            else if (b == nearestTarget) return a;
                            return (creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b) > 0) ? b : a;
                        });
                        creep.moveToNoCreepInRoom(nextTarget);
                    }
                }
                return;
            }

            //tower
            var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function (object) {
                    return object.structureType == STRUCTURE_TOWER && object.store.getFreeCapacity(RESOURCE_ENERGY) > 300
                }
            });
            if (tower) {
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(tower);
                }
                return;
            }

            //lab
            var lab = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function (object) {
                    return object.structureType == STRUCTURE_LAB && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            });
            if (lab) {
                if (creep.transfer(lab, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(lab);
                }
                return;
            }


            // if no transfer needs
            creep.toResPos();
            return;
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function (room) {
        // var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.type && creep.room.name == room.name);

        var stage = this.getStage(room);

        let creepCount;
        if (global.roomCensus[room.name] && global.roomCensus[room.name][this.properties.type] != null) creepCount = global.roomCensus[room.name][this.properties.type]
        else creepCount = 0;

        return creepCount < this.properties.stages[stage].number ? true : false;
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        let body = this.properties.stages[stage].bodyParts;
        let memory = { role: this.properties.type, status: 1, base: room.name };

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