const { min } = require("lodash");
const { reactionResources } = require("../constants");

module.exports = {
    properties: {
        type: 'mineralCarrier',
        stages: {
            1: { maxEnergyCapacity: 300, bodyParts: [CARRY, MOVE, CARRY, MOVE], number: 0 },
            6: { maxEnergyCapacity: 2300, bodyParts: [...new Array(20).fill(CARRY), ...new Array(10).fill(MOVE)], number: 1 },
        },
    },

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.restTime) {
            creep.memory.restTime -= 1;
            return;
        }

        // to avoid dead when holding resources, if tick to live less than 30, and finished transfer, suicide.
        if (creep.ticksToLive < 30) {
            if (creep.store.getUsedCapacity() > 0) creep.memory.status = 1;
            else {
                creep.suicide();
                return;
            }
        }

        // move to room if not in
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) return;
        // set status: 0. harvest  1. transfer 
        creep.workerSetStatus();

        const labTasks = creep.room.memory.tasks.labTasks;
        const labStatus = creep.room.memory.labStatus;

        if (this.feedBoostLabs(creep)) {
            creep.say('Boost!');
        }
        else if (labTasks && labTasks.length > 0 && labStatus !== undefined && labStatus !== 1) {
            this.labReactionWork(creep);
        }
        else if (!mineralContainerWithdraw(creep)) {
            // empty store.
            if (creep.store.getUsedCapacity() > 0) creep.memory.status = 1;

            if (creep.memory.status === 1) {
                const storage = creep.room.storage;
                if (storage) {
                    let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                    if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveToNoCreepInRoom(storage);
                    }
                }
            }
            else {
                // go rest
                creep.toResPos(10);
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function (room) {
        if (room.controller.level < 6) return false;

        // check miner
        let miner = global.roomCensus[room.name]['miner'];
        if (miner) {
            // run rest codes
        }
        // check boostLab
        else if (room.memory.labs && room.memory.labs.boostLab && Object.keys(room.memory.labs.boostLab).length > 0) {
            // run rest codes
        }
        // check labTasks
        else if (!room.memory.tasks || !room.memory.tasks.labTasks || room.memory.tasks.labTasks.length == 0) {
            return false;
        }
        else if (!room.memory.labs || !room.memory.labs.center || room.memory.labs.center.length != 2) {
            return false;
        }

        let stage = this.getStage(room);

        let creepCount;
        if (global.roomCensus[room.name][this.properties.type]) creepCount = global.roomCensus[room.name][this.properties.type]
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
    },

    labReactionWork: function (creep) {
        const task = creep.room.memory.tasks.labTasks[0];
        let allLabs = creep.room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_LAB });
        let outterLabs = _.filter(allLabs, lab => lab.isActive() && !creep.room.memory.labs.center.includes(lab.id) && !creep.room.memory.labs.boostLab[lab.id] && lab.cooldown === 0);
        let centerLabs = _.map(creep.room.memory.labs.center, id => Game.getObjectById(id));

        // labStatus: 0 finished, 1 running, 2 center feed, 3 outter withdraw 
        // 0 finished: remove all minerals from lab
        if (!creep.room.memory.labStatus) {
            //creep.say(creep.room.memory.labStatus);
            for (const lab of outterLabs) {
                if (lab.mineralType && lab.store.getUsedCapacity(lab.mineralType) > 0) {
                    labWithdraw(creep, lab);
                    return;
                }
            }
            for (const lab of centerLabs) {
                if (lab.mineralType && lab.store.getUsedCapacity(lab.mineralType) > 0) {
                    labWithdraw(creep, lab);
                    return;
                }
            }
        }
        // 1 running: do nothing
        else if (creep.room.memory.labStatus == 1) {
            // do nothing.
        }
        // 2 center feed: 
        else if (creep.room.memory.labStatus == 2) {
            //creep.say(creep.room.memory.labStatus);
            for (const i in centerLabs) {
                let lab = centerLabs[i];
                if (!lab || !lab.isActive()) return;
                if (!lab.mineralType || lab.store[lab.mineralType] < 15) {
                    let resourceType = reactionResources[task.resourceType][i];
                    let transResult = labTransfer(creep, lab, resourceType);
                    if(transResult === ERR_NOT_ENOUGH_RESOURCES) {
                        creep.room.memory.tasks.labTasks[0].amount = 0;
                    }
                    return;
                }
            }
        }
        // 3 outter withdraw
        else if (creep.room.memory.labStatus == 3) {
            //creep.say(creep.room.memory.labStatus);
            for (const lab of outterLabs) {
                if (lab.mineralType && lab.store.getUsedCapacity(lab.mineralType) >= 2000) {
                    labWithdraw(creep, lab);
                    return;
                }
                else if (lab.mineralType && lab.mineralType !== task.resourceType) {
                    labWithdraw(creep, lab);
                    return;
                }
            }
        }
    },

    feedBoostLabs: function (creep) {
        const boostLab = creep.room.memory.labs.boostLab;
        if (!boostLab) return false;

        for (const labId in boostLab) {
            const { resourceType, amount } = boostLab[labId];
            const lab = Game.getObjectById(labId);
            if (!lab || !lab.isActive()) {
                delete boostLab[labId];
                return false;
            }

            if (!lab.mineralType || (lab.mineralType === resourceType && lab.store[resourceType] < amount)) {
                console.log(lab.store[resourceType], amount)
                if (lab.store.getFreeCapacity(resourceType) === 0) continue;
                let transResult = labTransfer(creep, lab, resourceType);
                if(transResult === ERR_NOT_ENOUGH_RESOURCES) {
                    delete boostLab[labId];
                }
                return true;
            }
            else if (lab.mineralType !== resourceType) {
                // mineralType not correct
                labWithdraw(creep, lab);
                return true;
            }
            else {
                continue;
            }
        }

        return false;
    }
};

// ============================================= Functions =============================================

// withdraw all resources from lab and send to storage
var labWithdraw = function (creep, targetLab) {
    // transfer
    if (creep.memory.status) {
        let storage = creep.room.storage;
        if (storage) {
            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(storage);
            }

        }
    }
    // withdraw
    else {
        if (targetLab) {
            if (creep.withdraw(targetLab, targetLab.mineralType) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(targetLab);
            }
        }
    }
};

var labTransfer = function (creep, targetLab, resourceType) {
    // check lab remaining resourceType
    if (targetLab.mineralType && targetLab.mineralType != resourceType) {
        console.log(creep.room, "Lab transfer error, mineral type not correct");
    }

    // check creep.store resourceType
    if (creep.store.getUsedCapacity() > 0) {
        let creepResourceTypes = _.filter(Object.keys(creep.store), resource => creep.store[resource] > 0);
        if (creepResourceTypes.length > 1 || creepResourceTypes[0] != resourceType) {
            if (creep.transfer(creep.room.storage, creepResourceTypes[0]) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(creep.room.storage);
            }
            return OK;
        }
    }

    // status 1: transfer
    if (creep.memory.status) {
        if ((!targetLab.mineralType || targetLab.store.getFreeCapacity(targetLab.mineralType) > 0) && creep.store[resourceType] > 0) {
            if (creep.transfer(targetLab, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(targetLab);
            }
        }
        else {
            let storage = creep.room.storage;
            if (storage) {
                let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(storage);
                }

            }
        }
    }
    // status 0: withdraw
    else {
        let target;
        if (creep.room.terminal && creep.room.terminal.store[resourceType] > 0) target = creep.room.terminal;
        else if (creep.room.storage && creep.room.storage.store[resourceType] > 0) target = creep.room.storage;
        else {
            console.log(creep.room, "mineral " + resourceType + " not enough");
            return ERR_NOT_ENOUGH_RESOURCES;
        }

        let result = creep.withdraw(target, resourceType);
        if (result == ERR_NOT_IN_RANGE) creep.moveToNoCreepInRoom(target);
        else if (result == OK) creep.memory.status = 1;
    }

    return OK;
};

var mineralContainerWithdraw = function (creep) {
    let storage = creep.room.storage;
    let extractor = creep.room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_EXTRACTOR })[0];
    if (!extractor || !storage) return false;

    // status 1: transfer
    if (creep.memory.status) {
        let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
        let result = creep.transfer(storage, resourceType);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(storage);
        }
    }
    else {
        //droped
        let dropedMineral = _.find(creep.room.find(FIND_DROPPED_RESOURCES), resource => resource.resourceType != RESOURCE_ENERGY && resource.amount >= 500);
        if (dropedMineral) {
            let result = creep.pickup(dropedMineral);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(dropedMineral);
            }
            else if (result == OK) {
                creep.memory.status = 1;
            }
            return true;
        }

        //container
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: struct =>
            (struct.structureType === STRUCTURE_CONTAINER &&
                struct.pos.inRangeTo(extractor.pos, 1))
        });
        if (containers.length === 0) return false;

        let target = containers[0];

        if (!(target.store[RESOURCE_THORIUM] >= 500) && target.store.getUsedCapacity() < creep.store.getFreeCapacity()) {
            return false;
        }

        let resourceType = _.find(Object.keys(target.store), resource => target.store[resource] > 0);
        let result = creep.withdraw(target, resourceType);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(target);
        }
        else if (result === OK) {
            if (target.store.getUsedCapacity() === 0) creep.memory.status = 1;
        }
    }

    return true;
}