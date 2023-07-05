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
            BOOSTROOM_WORK: 4,
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
            case 4:
                //this.takeThoriumHome(creep);
                this.takeThoriumHomeTest(creep);
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
            if(creep.takeEnergyFromClosest()) return;

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

            if (takeNearResource(creep, RESOURCE_ENERGY)) return;

            // move to its base room if not in
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }

            creep.takeEnergyFromClosest();
        }
        // transfer
        else {
            // move to its target room if not in
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoom(creep.memory.targetRoom);
                return;
            }

            // list includes: avaliable storage
            let storage = creep.room.storage;
            // if no storage, change target to containers that near controller
            if (!storage) {
                let containers = creep.room.find(FIND_STRUCTURES, {
                    filter: struct => (
                        struct.structureType == STRUCTURE_CONTAINER &&
                        struct.pos.inRangeTo(creep.room.controller.pos, 3)
                        // struct.store.getFreeCapacity() > 0
                    )
                });
                containers.sort((a, b) => b.store.getFreeCapacity() - a.store.getFreeCapacity());
                if (containers.length) {
                    storage = containers[0];
                }
            }

            if (!storage) {
                if (creep.pos.inRangeTo(creep.room.controller.pos, 4)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.travelTo(creep.room.controller, { range: 4 });
            }
            else if (storage.store.getFreeCapacity() == 0) {
                if (creep.pos.inRangeTo(storage.pos, 1)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.travelTo(storage);
            }
            else {
                if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(storage);
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

    takeThoriumHome: function (creep) {
        let targetRoom = Game.rooms[creep.memory.targetRoom];
        if (!targetRoom || !targetRoom.controller || targetRoom.controller.level < 6) {
            this.tranEnergyBetweenMyRooms(creep);
            return;
        }

        let extractor = targetRoom.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_EXTRACTOR })[0];
        if (!extractor && creep.memory.status) {
            this.collectDropedResources(creep);
            return;
        }

        let resourceType;
        let mineral = extractor.pos.lookFor(LOOK_MINERALS);
        if (!mineral) resourceType = RESOURCE_THORIUM;
        else resourceType = mineral.mineralType;

        if (takeNearResource(creep, resourceType)) return;

        // if (creep.store[RESOURCE_ENERGY] > 0) {
        //     creep.drop(RESOURCE_ENERGY);
        // }

        if (!creep.memory.status) {
            // move to its target room if not in
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.travelTo(new RoomPosition(25, 25, creep.memory.targetRoom));
                return;
            }

            // first find droped recources
            let dropedThorium = _.find(creep.room.find(FIND_DROPPED_RESOURCES), resource => resource.resourceType == resourceType);
            if (dropedThorium) {
                let result = creep.pickup(dropedThorium);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.travelTo(dropedThorium);
                }
                else if (result === OK) {
                    creep.memory.status = 1;
                }
                return;
            }

            let container = creep.room.find(FIND_STRUCTURES, {
                filter: struct => (
                    struct.structureType === STRUCTURE_CONTAINER &&
                    struct.pos.findInRange(FIND_MINERALS, 1, { filter: mine => mine.mineralType === resourceType }).length
                )
            })[0];

            if (container) {
                if (container.store[resourceType] >= 99) {
                    let result = creep.withdraw(container, resourceType, Math.min(99, creep.store.getFreeCapacity() - 1));
                    if (result === ERR_NOT_IN_RANGE) {
                        creep.travelTo(container);
                    }
                    else if (result === OK) {
                        creep.memory.status = 1;
                    }

                }
                else creep.travelTo(container, { range: 6 });
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
            let terminal = creep.room.terminal;
            let storage = creep.room.storage;

            if (terminal && terminal.store.getFreeCapacity() > 0) {
                let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(storage);
                }
                return;
            }
            else if (storage && storage.store.getFreeCapacity() > 0) {
                let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(storage);
                }
            }
        }
    },

    takeThoriumHomeTest: function (creep) {
        let targetRoom = Game.rooms[creep.memory.targetRoom];
        if (!targetRoom || (targetRoom.controller && targetRoom.controller.my && targetRoom.controller.level < 6)) {
            this.tranEnergyBetweenMyRooms(creep);
            return;
        }
        else if (targetRoom.controller && !targetRoom.controller.my) {
            this.collectDropedResources(creep);
        }

        if (creep.store[RESOURCE_ENERGY] > 0) {
            creep.drop(RESOURCE_ENERGY);
        }

        let thorium = targetRoom.find(FIND_MINERALS, { filter: mine => mine.mineralType === RESOURCE_THORIUM })[0];
        if(!thorium) {
            this.collectDropedResources(creep);
        }
        let extractor = targetRoom.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_EXTRACTOR })[0];
        if (!extractor) {
            if (creep.memory.status) this.collectDropedResources(creep);
            return;
        }

        let resourceType = RESOURCE_THORIUM;
        let mineral = extractor.pos.lookFor(LOOK_MINERALS)[0];
        if (mineral) {
            resourceType = mineral.mineralType;
        }

        if (takeNearResource(creep, resourceType)) {
            creep.memory.status = 1;
            return;
        }

        if (creep.memory.shift) {
            creep.memory.shift = false;
            if (creep.memory.status) creep.memory.status = 0;
            else creep.memory.status = 1;
        }

        if (!creep.memory.status) {
            // move to its target room if not in
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                // creep.travelTo(new RoomPosition(25, 25, creep.memory.targetRoom));
                if (this.shuffleTravelTo(creep, new RoomPosition(25, 25, creep.memory.targetRoom))) return;

                return;
            }

            // first find droped recources
            let dropedThorium = _.find(creep.room.find(FIND_DROPPED_RESOURCES), resource => resource.resourceType == resourceType);
            if (dropedThorium) {
                if (creep.pos.isNearTo(dropedThorium)) {
                    let result = creep.pickup(dropedThorium);
                    if (result === OK) {
                        creep.memory.status = 1;
                    }
                }
                else {
                    //creep.travelTo(dropedThorium);
                    if (this.shuffleTravelTo(creep, dropedThorium)) return;
                }

                return;
            }

            let container = creep.room.find(FIND_STRUCTURES, {
                filter: struct => (
                    struct.structureType === STRUCTURE_CONTAINER &&
                    struct.pos.isNearTo(extractor)
                )
            })[0];

            if (container) {
                if (container.store[resourceType] >= 99) {
                    if (creep.pos.isNearTo(container)) {
                        let result = creep.withdraw(container, resourceType, 99);
                        if (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_FULL) {
                            creep.withdraw(container, resourceType);
                        }

                        if (result === OK) {
                            creep.memory.status = 1;
                        }
                    }
                    else {
                        if (this.shuffleTravelTo(creep, container)) return;
                    }
                }
                else {
                    //creep.travelTo(container, { range: 6 });
                    if (this.shuffleTravelTo(creep, container, { range: 6 })) return;
                }
            }
        }
        // transfer
        else {
            // move to its base room if not in
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                //creep.moveToRoom(creep.memory.base);
                if (this.shuffleTravelTo(creep, new RoomPosition(25, 25, creep.memory.base))) return;
                return;
            }

            // list includes: avaliable storage
            let terminal = creep.room.terminal;
            let storage = creep.room.storage;

            if (storage && storage.store.getFreeCapacity() > 0) {
                //let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                if (creep.pos.isNearTo(storage)) {
                    creep.transfer(storage, resourceType);
                }
                else {
                    // creep.travelTo(storage);
                    if (this.shuffleTravelTo(creep, storage)) return;
                }
                return;
            }
            else if (terminal && terminal.store.getFreeCapacity() > 0) {
                //let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                if (creep.pos.isNearTo(terminal)) {
                    creep.transfer(terminal, resourceType);
                }
                else {
                    // creep.travelTo(terminal);
                    if (this.shuffleTravelTo(creep, terminal)) return;
                }
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
    },

    shuffleTravelTo: function (creep, target, ops = {}) {
        const data = {}
        ops.returnData = data;

        creep.travelTo(target, ops);

        if (data.nextPos) {
            let nextPosCreep = data.nextPos.lookFor(LOOK_CREEPS)[0];
            if (nextPosCreep && nextPosCreep.my && nextPosCreep.memory.role === creep.memory.role && nextPosCreep.memory.status !== creep.memory.status) {
                if (creep.store.getCapacity() !== nextPosCreep.store.getCapacity()) return false;

                if (nextPosCreep.memory.shiftCreep === creep.id) {
                    // only shift once a tick
                    if (creep.memory.shiftTick === Game.time || nextPosCreep.memory.shiftTick === Game.time) {
                        creep.say('shifted');
                        return false;
                    }
                    else {
                        creep.memory.shiftTick = Game.time;
                        nextPosCreep.memory.shiftTick = Game.time;
                    }

                    if (creep.memory.status) {
                        let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                        if (!resourceType) return false
                        if (creep.store[resourceType] < creep.store.getUsedCapacity()) return false;
                        creepShift(creep, nextPosCreep, resourceType);
                    }
                    else {
                        let resourceType = _.find(Object.keys(nextPosCreep.store), resource => nextPosCreep.store[resource] > 0);
                        if (!resourceType) return false
                        if (nextPosCreep.store[resourceType] < nextPosCreep.store.getUsedCapacity()) return false;
                        creepShift(nextPosCreep, creep, resourceType);
                    }

                    this.run(nextPosCreep);
                    this.run(creep);

                    return true;
                }
                else {
                    creep.memory.shiftCreep = nextPosCreep.id;
                }
            }
        }

        return false;
    }
};

function takeNearResource(creep, resourceType) {
    // pick up near resources
    const nearResouce = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
        filter: droped => (
            droped.resourceType === resourceType &&
            droped.pos.getRangeTo(creep.room.controller) > 4)
    });
    if (nearResouce.length > 0) {
        let result = creep.pickup(nearResouce[0]);
        if (result === OK && nearResouce[0].amount > creep.store.getCapacity() * 0.5) creep.memory.status = 1;
    }

    // tomstone
    const nearTomstone = creep.pos.findInRange(FIND_TOMBSTONES, 1, { filter: ts => ts.store[resourceType] > 0 });
    if (nearTomstone.length > 0) {
        let result = creep.withdraw(nearTomstone[0], resourceType);
        if (result === OK && nearTomstone[0].store[resourceType] > creep.store.getCapacity() * 0.9) creep.memory.status = 1;
        return true;
    }
    return false;
}



function creepShift(sender, taker, resourceType) {
    sender.memory.shiftCreep = null;
    taker.memory.shiftCreep = null;

    sender.memory.shift = true;
    taker.memory.shift = true;

    // swap _.trav
    let senderTravMemery = sender.memory._trav;
    sender.memory._trav = taker.memory._trav;
    taker.memory._trav = senderTravMemery;

    sender.transfer(taker, resourceType);
}