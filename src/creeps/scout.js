module.exports = {
    properties: {
        role: "scout"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.moveToRoom(creep.memory.targetRoom);
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
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {role: this.properties.role, status: 0};

        return {name, body, memory};
    },
};