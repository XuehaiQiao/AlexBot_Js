const { KEEPER } = require("../constants/roomTypes");
const { inRoomUtil, roomUtil } = require("../util");

module.exports = {
    properties: {
        role: "claimer",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[], number: 0},
            3: {maxEnergyCapacity: 800, bodyParts:[CLAIM, MOVE], number: 2},
            4: {maxEnergyCapacity: 1300, bodyParts:[CLAIM, MOVE, CLAIM, MOVE], number: 1},
            5: {maxEnergyCapacity: 1800, bodyParts:[CLAIM, MOVE, CLAIM, MOVE], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], number: 1},
            8: {maxEnergyCapacity: 10000, bodyParts:[CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], number: 1},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        let ifRepath;
        if(!creep.room.memory.skMatrix && roomUtil.getRoomType(creep.room.name) === KEEPER) {         
            inRoomUtil.getSKMatrix(creep.room.name);
            ifRepath = 1;
        }

        // move to target room if not in
        if (creep.room.name !== creep.memory.targetRoom) {
            if(!creep.memory.targetRoom) return;

            creep.travelTo(new RoomPosition(25, 25, creep.memory.targetRoom), { 
                allowSK: true, 
                roomCallback: (roomName, costMatrix) => {
                    if (roomUtil.getRoomType(roomName) === KEEPER) {
                        let roomMemory = Memory.rooms[roomName];
                        if(roomMemory && roomMemory.invaderCore && roomMemory.invaderCore.endTime > Game.time) {
                            return false;
                        }
                        else return inRoomUtil.getSKMatrix(roomName);
                    }
                },
                repath: ifRepath,
                ensurePath: true,
            });
            return
        }

        if(creep.memory.reactor) {
            let reactor = creep.room.find(FIND_REACTORS)[0];
            if(reactor) {
                let result = creep.claimReactor(reactor);
                if(result === ERR_NOT_IN_RANGE) creep.travelTo(reactor);
            }
            return;
        }

        let controller = creep.room.controller;
        if (!controller) {
            return;
        }
        else if (creep.memory.claim) {
            if(controller && !controller.my && ((controller.reservation && creep.owner.username !== controller.reservation.username) || controller.level)) {
                if(creep.attackController(controller) == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(controller);
                }
            }
            else if(creep.claimController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(controller);
            }
            else {
                creep.signController(controller, "Keep Growing!!!");
            }
        }
        else if ((controller.reservation && controller.reservation.username != 'LeTsCrEEp') || (controller.owner && !controller.my)) {
            if(creep.attackController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(controller);
            }
        }
        else {
            if(creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(controller);
            }
        }
        
    },

    // checks if the room needs to spawn a creep
    spawn: function(room, roomName) {
        if(Game.rooms[roomName]) {
            if(!Game.rooms[roomName].controller) return false; // sourceKeeper rooms

            let controller = Game.rooms[roomName].controller;
            if(controller.reservation && controller.reservation.username == room.controller.owner.username && controller.reservation.ticksToEnd > 2000) {
                return false
            }
            if(controller.my) return false;
        }

        let creepCount = 0;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role];
        }

        if(Memory.outSourceRooms[roomName] && Memory.outSourceRooms[roomName].neutral === true) {
            return false;
        }

        if (creepCount < this.properties.stages[this.getStage(room)].number) return true;

        return false;

    },

    // returns an object with the data to spawn a new creep (no need for now)
    spawnData: function(room, targetRoomName) {
        // manual input
        // Game.spawns['Spawn1'].spawnCreep([MOVE, CLAIM, MOVE], 'Claimer' + Game.time, {memory: {role: 'claimer', status: 1, targetRoom: 'W21S19'}});
        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts;
        let memory = {role: this.properties.role, status: 1, base: room.name, targetRoom: targetRoomName}; // example

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
}