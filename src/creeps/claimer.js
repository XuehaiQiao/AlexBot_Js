var claimer = {
    properties: {
        role: "claimer",
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
                creep.moveTo(controller);
            }
        }
        else if ((controller.reservation && controller.reservation.username != 'LeTsCrEEp') || (controller.owner && !controller.my)) {
            if(creep.attackController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        }
        else {
            if(creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        }
        
    },

    // checks if the room needs to spawn a creep
    spawn: function(room, roomName) {
        // var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.memory.targetRoom == roomName);
    
        // check if need spawn
        let creepCount;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep (no need for now)
    spawnData: function(room, targetRoomName) {
        // manual input
        // Game.spawns['Spawn1'].spawnCreep([MOVE, CLAIM, MOVE], 'Claimer' + Game.time, {memory: {role: 'claimer', status: 1, targetRoom: 'W21S19'}});
        let name = this.properties.role + Game.time;
        let body = [CLAIM, MOVE, CLAIM, MOVE];
        let memory = {role: this.properties.role, status: 1, base: room.name, targetRoom: targetRoomName}; // example

        return {name, body, memory};
    },
}

module.exports = claimer;