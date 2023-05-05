
var miner = {
    properties: {
        role: "miner"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.rest) {
            creep.memory.rest -= 1;
        }

        creep.workerSetStatus();

        // transfer
        if(creep.memory.status) {
            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if(creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
        // harvest
        else {
            let mine = creep.room.find(FIND_MINERALS)[0];
            let result = creep.harvest(mine)
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(mine);
                
                //look for adjacent droped resources
                let dropedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
                if(dropedResources.length) creep.pickup(dropedResources[0]);
            }
            else {
                creep.memory.rest = 5;
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        // check mineralAmount & if have extractor
        let mineral = room.find(FIND_MINERALS)[0];
        let extractor = _.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType == STRUCTURE_EXTRACTOR);
        
        // mineral has resources, room have extractor, storage have less than 100000 this mineral type
        if(mineral.mineralAmount == 0) return false;
        if(!extractor) return false;
        if(room.storage && room.storage.store[mineral.mineralType] > 50000) return false;
        
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