var miner = {
    properties: {
        role: "miner"
    },
    /** @param {Creep} creep **/
    run: function(creep) {

    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var extractor = _.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType == STRUCTURE_EXTRACTOR)
        if (!extractor) {
            return false;
        }
        
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
        let memory = {role: this.properties.role, status: 0, base: room.name};

        return {name, body, memory};
    },
}

module.exports = miner;