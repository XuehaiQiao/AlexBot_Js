var claimer = {
    properties: {
        role: "claimer",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[], number: 0},
            4: {maxEnergyCapacity: 1300, bodyParts:[CLAIM, MOVE, CLAIM, MOVE], number: 1},
            5: {maxEnergyCapacity: 1800, bodyParts:[CLAIM, MOVE, CLAIM, MOVE], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], number: 1},
            6: {maxEnergyCapacity: 5600, bodyParts:[CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], number: 1},
            7: {maxEnergyCapacity: 10000, bodyParts:[CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], number: 1},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            return;
        }

        let controller = creep.room.controller;
        if (!controller) {
            return;
        }
        else if (creep.memory.claim) {
            if(creep.claimController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(controller);
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
        }

        let creepCount = 0;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role];
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

module.exports = claimer;