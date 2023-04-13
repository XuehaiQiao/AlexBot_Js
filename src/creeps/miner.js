
var miner = {
    properties: {
        role: "miner"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.workerSetStatus();

        if(creep.memory.status) {
            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if(creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
        else {
            let mine = creep.room.find(FIND_MINERALS)[0];
            if(creep.harvest(mine) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mine);
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        // check mineralAmount & if have extractor
        let mine = room.find(FIND_MINERALS)[0];
        if(mine.mineralAmount == 0) return false;
        var extractor = _.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType == STRUCTURE_EXTRACTOR)
        if(!extractor) return false;
        
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
        let body = [...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)];
        let memory = {role: this.properties.role, status: 0, base: room.name};

        return {name, body, memory};
    },
}

module.exports = miner;