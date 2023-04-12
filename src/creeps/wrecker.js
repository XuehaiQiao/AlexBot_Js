var wrecker = {
    properties: {
        role: "wrecker"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        let hostileStruct;
        if (creep.memory.target) {
            hostileStruct = Game.getObjectById(creep.memory.target);
        } else {
            hostileStruct = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        }

        

        if (hostileStruct) {
            creep.say(creep.dismantle(hostileStruct));
            if(creep.dismantle(hostileStruct) == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostileStruct, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            return;
        }
    
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.room.name == room.name);
        console.log(this.properties.role + ': ' + thisTypeCreeps.length, room.name);
    
        // level 2
        if (thisTypeCreeps.length < 0) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, targetRoomName, targetId = null) {
        let name = this.properties.role + Game.time;
        let body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE];
        let memory = {role: this.properties.role, status: 0, targetRoom: targetRoomName, target: targetId};

        return {name, body, memory};
    },
}

module.exports = wrecker;