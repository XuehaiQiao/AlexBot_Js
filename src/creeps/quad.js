module.exports = {
    properties: {
        role: "quad"
    },
    /** @param {Creep} creep **/
    run: function(creep) {

    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        // check if need spawn
        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {role: this.properties.role, status: 0, base: room.name};

        return {name, body, memory};
    },
};