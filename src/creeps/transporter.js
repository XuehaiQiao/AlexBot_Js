module.exports = {
    properties: {
        type: 'transporter',
        stages: {
            1: { maxEnergyCapacity: 300, bodyParts: [...new Array(3).fill(CARRY), ...new Array(3).fill(MOVE)] },
            2: { maxEnergyCapacity: 550, bodyParts: [...new Array(5).fill(CARRY), ...new Array(5).fill(MOVE)] },
            3: { maxEnergyCapacity: 800, bodyParts: [...new Array(7).fill(CARRY), ...new Array(7).fill(MOVE)] },
            4: { maxEnergyCapacity: 1300, bodyParts: [...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)] },
            5: { maxEnergyCapacity: 1800, bodyParts: [...new Array(15).fill(CARRY), ...new Array(15).fill(MOVE)] },
            6: { maxEnergyCapacity: 2300, bodyParts: [...new Array(20).fill(CARRY), ...new Array(20).fill(MOVE)] },
            7: { maxEnergyCapacity: 5600, bodyParts: [...new Array(25).fill(CARRY), ...new Array(25).fill(MOVE)] },
        },

        workTypes: {
            TAKE_DROPED: 1,
            COLLECT_INVADER_CORE: 2,
            TAKE_POWER: 3,
        }
    },

    /** @param {Creep} creep **/
    run: function (creep) {
        // set status: 0. harvest  1. transfer 
        creep.workerSetStatus();

        switch (creep.memory.workType) {
            case 1:
                this.collectDropedResources(creep);
                break;
            case 2:
                this.collectInvaderCore(creep);
                break;
            case 3:
                this.collectPower(creep);
                break;
            default:
                this.tranEnergyBetweenMyRooms(creep);
        }
    },

    // collect droped resources
    collectDropedResources: function (creep) {
        creep.say('cdr');
        // harvest
        if (!creep.memory.status) {
            // move to its target room if not in
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoomAdv(creep.memory.targetRoom);
                return;
            }

            // first find droped recources
            let dropedRecource;
            if (creep.memory.targetResourceType) {
                dropedRecource = _.find(creep.room.find(FIND_DROPPED_RESOURCES), resource => resource.resourceType == creep.memory.targetResourceType);
            }
            else dropedRecource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

            if (dropedRecource) {
                if (creep.pickup(dropedRecource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedRecource, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return;
            }

            // find tomstone
            let tomstone = _.find(creep.room.find(FIND_TOMBSTONES), ts => ts.store.getUsedCapacity() >= creep.store.getCapacity());
            if (tomstone) {
                resourceType = _.find(Object.keys(tomstone.store), resource => tomstone.store[resource] > 0);
                let result = creep.withdraw(tomstone, resourceType);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tomstone);
                }
                return;
            }

            if (creep.store.getUsedCapacity() > 0) creep.memory.status = 1;
            //else creep.suicide();
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

            if (!storage || storage.store.getFreeCapacity() == 0) {
                // if no transfer needs
                creep.suicide();
                return;
            }

            var resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
    },

    // transfer energy from targetRoom to base (base room controll level < 6, no terminal)
    tranEnergyBetweenMyRooms: function (creep) {
        // harvest
        if (!creep.memory.status) {
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
            if (!storage) {
                let containers = creep.room.find(FIND_STRUCTURES, {
                    filter: struct => (
                        struct.structureType == STRUCTURE_CONTAINER &&
                        struct.pos.inRangeTo(creep.room.controller.pos, 3) &&
                        struct.store.getFreeCapacity() > 0
                    )
                });
                if (containers.length) {
                    storage = containers[0];
                }
            }

            if (!storage) {
                if (creep.pos.inRangeTo(creep.room.controller.pos, 3)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveToNoCreepInRoom(creep.room.controller);
            }
            else if (storage.store.getFreeCapacity() == 0) {
                if (creep.pos.inRangeTo(storage.pos, 2)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveTo(storage);
            }
            else {
                if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        }
    },

    collectInvaderCore: function (creep) {
        // harvest
        if (!creep.memory.status) {
            let invaderPos = creep.memory.invaderPos;
            if (invaderPos) {
                let pos = new RoomPosition(invaderPos.x, invaderPos.y, invaderPos.roomName);
                if (!creep.pos.inRangeTo(pos, 5)) {
                    creep.say('approach')
                    creep.moveToNoCreep(pos);
                }
                else {
                    // find ruin

                    let ruins = pos.findInRange(FIND_RUINS, 4, { filter: ruin => ruin.store.getUsedCapacity() > 0 });
                    let containers = pos.findInRange(FIND_STRUCTURES, 4, { filter: struct => struct.structureType === STRUCTURE_CONTAINER && struct.store.getUsedCapacity() > 0 });
                    if (ruins.length) {
                        let target = ruins[0];
                        resourceType = _.find(Object.keys(target.store), resource => target.store[resource] > 0);
                        if (creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                    else if (containers.length) {
                        let target = containers[0];
                        resourceType = _.find(Object.keys(target.store), resource => target.store[resource] > 0);
                        if (creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                    else {
                        creep.memory.status = 1;
                    }
                }
            }
            else {
                // move to its target room if not in
                if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                    creep.moveToRoomAdv(creep.memory.targetRoom);
                    return;
                }

                let invaderRain = _.find(creep.room.find(FIND_RUINS), ruin => ruin.structure.structureType === STRUCTURE_INVADER_CORE);
                if (invaderRain) {
                    creep.memory.invaderPos = { x: invaderRain.pos.x, y: invaderRain.pos.y, roomName: invaderRain.pos.roomName };
                }
                else {
                    creep.suicide();
                }
            }

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

            if (!storage || storage.store.getFreeCapacity() == 0) {
                // if no transfer needs
                creep.suicide();
                return;
            }

            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
    },

    collectPower: function (creep) {
        // harvest
        if (!creep.memory.taken) {
            // move to its target room if not in
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoomAdv(creep.memory.targetRoom);
                return;
            }

            let ruin = creep.room.find(FIND_RUINS, { filter: ruin => ruin.store[RESOURCE_POWER] > 0 })[0];
            if (ruin) {
                let result = creep.withdraw(ruin, RESOURCE_POWER);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(ruin);
                }
                else if (result === OK) {
                    creep.memory.taken = true;
                }
                return;
            }

            // first find droped recources
            let dropedPower = _.find(creep.room.find(FIND_DROPPED_RESOURCES), resource => resource.resourceType == RESOURCE_POWER);
            if (dropedPower) {
                let result = creep.pickup(dropedPower);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedPower);
                }
                else if (result === OK) {
                    creep.memory.taken = true;
                }
                return;
            }

            let powerBank = creep.room.find(FIND_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_POWER_BANK })[0];
            if (powerBank) {
                creep.travelTo(powerBank, { range: 5 });
            }
        }
        // transfer
        else {
            if (creep.store.getUsedCapacity() === 0) {
                creep.suicide();
                return;
            }

            // move to its base room if not in
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }

            // list includes: avaliable storage
            let terminal = creep.room.terminal;
            let storage = creep.room.storage;

            if (terminal && terminal.store.getFreeCapacity() > 0) {
                let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
                return;
            }
            else if (storage && storage.store.getFreeCapacity() > 0) {
                let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
            else {
                creep.suicide();
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function (room) {
        // only spawn when brain required
        return false;
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