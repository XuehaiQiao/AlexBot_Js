const { roomInfo } = require("../config");

module.exports = {
    properties: {
        type: 'upgrader2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 1},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, WORK, CARRY, MOVE, MOVE], number: 6},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 6},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(8).fill(WORK), ...new Array(2).fill(CARRY), ...new Array(4).fill(MOVE)], number: 5},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(10).fill(WORK), ...new Array(3).fill(CARRY), ...new Array(5).fill(MOVE)], mBodyParts: [...new Array(12).fill(WORK), ...new Array(2).fill(CARRY), ...new Array(6).fill(MOVE)], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(14).fill(WORK), ...new Array(4).fill(CARRY), ...new Array(7).fill(MOVE)], mBodyParts: [...new Array(14).fill(WORK), ...new Array(2).fill(CARRY), ...new Array(7).fill(MOVE)], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], mBodyParts: [...new Array(30).fill(WORK), ...new Array(2).fill(CARRY), ...new Array(15).fill(MOVE)], number: 0},
            8: {maxEnergyCapacity: 10000, bodyParts:[...new Array(15).fill(WORK), ...new Array(15).fill(CARRY), ...new Array(15).fill(MOVE)], mBodyParts: [...new Array(15).fill(WORK), ...new Array(2).fill(CARRY), ...new Array(8).fill(MOVE)], number: 1},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.getBoosts();
            return;
        }

        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        
        // check if have manager or not to decide what logic to use (set status and logics under status)
        if(
            creep.room.memory.linkInfo &&
            creep.room.memory.linkInfo.controllerLink && 
            creep.room.memory.linkInfo.managerLink &&
            roomInfo[creep.room.name] &&
            roomInfo[creep.room.name].managerPos
        ) this.managerLogic(creep);
        else  this.noManagerLogic(creep);
    },

    managerLogic: function(creep) {
        // set status: 0. harvest  1. upgrade 
        creep.workerSetStatus();

        // harvest: status 0
        if(!creep.memory.status) {
            creep.takeEnergyFromControllerLink();
            creep.upgradeController(creep.room.controller);
        }
        // upgrade: status 1
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.travelTo(creep.room.controller);
            }
            if(creep.store[RESOURCE_ENERGY] <= 40) creep.memory.status = 0;
        }
    },

    noManagerLogic: function(creep) {
        // set status: 0. harvest  1. work 
        creep.workerSetStatus();

        let targetRoom = creep.memory.targetRoom;
        if (!targetRoom) targetRoom = creep.memory.base;
        if(!Game.rooms[targetRoom] && creep.moveToRoomAdv(targetRoom)) return;

        let controller = Game.rooms[targetRoom].controller;
        // upgrade
        if(creep.memory.status) {
            let constSites = controller.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);
            if(constSites.length) {
                if(creep.build(constSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(constSites[0], {range: 3 });
                }
            }
            else if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                this.combineMove(creep, controller, 3);
            }
        }
        // harvest
        else {
            if(!this.takeEnergyNeerController(creep, controller)) {
                if(!creep.pos.inRangeTo(controller, 4)) {
                    this.combineMove(creep, controller, 4);
                }
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        let creepCount;
        if(global.roomCensus[room.name][this.properties.type]) creepCount = global.roomCensus[room.name][this.properties.type]
        else creepCount = 0;

        let storage = room.storage;
        let num = this.properties.stages[this.getStage(room)].number;

        // for level 8 room
        if(room.controller.level == 8){
            if(creepCount >= 1) return false
            else if ((storage && storage.store[RESOURCE_ENERGY] > 400000) || room.controller.ticksToDowngrade < 50000) {
                return true
            }
            else return false;
        }

        // create more upgrader2 for more energy in storage
        if (storage && storage.store[RESOURCE_ENERGY] > 200000) {
            num += Math.min(Math.ceil((2 * storage.store[RESOURCE_ENERGY] + 200000) / (1 + storage.store.getFreeCapacity())), 4);
        }

        // return upgraders.length < num ? true : false;
        return creepCount < num ? true : false;
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        
        // if energy not enough, create minimum upgrader
        let body;
        let storage = room.storage;
        
        if(
            room.memory.linkInfo.controllerLink && 
            room.memory.linkInfo.managerLink &&
            roomInfo[room.name] &&
            roomInfo[room.name].managerPos &&
            room.energyCapacityAvailable >= 1800
        ) body = this.properties.stages[stage].mBodyParts;
        else body = this.properties.stages[stage].bodyParts;

        let memory = {role: this.properties.type, status: 1, target: 0, base: room.name};

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

        //console.log(stage);
        return stage;
    },

    takeEnergyNeerController: function (creep, controller) {
        // first find droped resource
        let dropedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: resource =>
                resource.resourceType == RESOURCE_ENERGY &&
                resource.pos.inRangeTo(controller, 4)
        });
        if (dropedResource) {
            let result = creep.pickup(dropedResource)
            if (result === ERR_NOT_IN_RANGE) {
                this.combineMove(creep, dropedResource, 1);
                //creep.moveTo(dropedResource);
            }
            else if (result === OK) {
                creep.memory.status = 1;
            }
            return true;
        }
    
        // container
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: struct =>
                struct.structureType === STRUCTURE_CONTAINER &&
                struct.pos.inRangeTo(controller, 3) &&
                struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        })
        if (container) {
            let result = creep.withdraw(container, RESOURCE_ENERGY);
            if (result === ERR_NOT_IN_RANGE) {
                this.combineMove(creep, container, 1)
                //creep.moveTo(container);
            }
            else if (result === OK) {
                creep.memory.status = 1;
            }
            return true;
        }
    
        return false;
    },

    combineMove: function(creep, target, range) {
        let data = {};
        creep.travelTo(target, { returnData: data, range: range });
        if (data.path) { 
            creep.room.visual.circle(data.nextPos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
        }
        
        if(data.nextPos) {
            let nextPosCreep = data.nextPos.lookFor(LOOK_CREEPS)[0];
            if(nextPosCreep && nextPosCreep.my && nextPosCreep.memory.role === this.properties.type) {
                nextPosCreep.travelTo(creep.room.controller);
            }
        }
    }
    
};