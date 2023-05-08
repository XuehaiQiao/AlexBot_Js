module.exports = {
    properties: {
        role: "scout"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // directly move to pos if have one.
        if(creep.memory.targetPos) {
            let targetPos = creep.memory.targetPos;
            creep.moveTo(new RoomPosition(targetPos.x, targetPos.y, targetPos.roomName), {reusePath: 50});
            return;
        }

        // move to target room if not in
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            return;
        }
        
        if(creep.memory.target) {
            let target = Game.getObjectById(creep.memory.target);
            if(target) creep.moveTo(creep.memory.target, {reusePath: 50});

            return;
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.room.name == room.name);
        console.log(this.properties.role + ': ' + thisTypeCreeps.length, room.name);
    
        // level 2
        if (thisTypeCreeps.length < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: targetRoomName};

        return {name, body, memory};
    },
};