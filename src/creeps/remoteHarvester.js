var remoteHarvester = {
    properties: {
        role: "remoteHarvester",
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoomAdv(creep.memory.targetRoom);
            return;
        }

        // repair container when finished harvest source no energy
        if(creep.memory.target != undefined && creep.room.find(FIND_SOURCES)[creep.memory.target].energy == 0) {
            creep.say('no e')
            if(creep.memory.containerId == undefined) {
                let containerList = creep.room.find(FIND_SOURCES)[creep.memory.target].pos.findInRange(FIND_STRUCTURES, 2, {filter: struct => struct.structureType == STRUCTURE_CONTAINER});
                if(containerList) creep.memory.containerId = containerList[0].id;
                
            }
            let container = Game.getObjectById(creep.memory.containerId);
            //creep.say('no energy')
            // let container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => struct.structureType == STRUCTURE_CONTAINER && struct.hits < struct.hitsMax});
            if (container && container.hits < container.hitsMax) {
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                };
                creep.repair(container);
                
            }
            return;
        }
        // harvest
        creep.harvestEnergy();
    },

    // checks if the room needs to spawn a creep (logic differ from others)
    spawn: function(room, roomName) {
        // const thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.memory.targetRoom == roomName);

        // check if need spawn
        let creepCount;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < Memory.outSourceRooms[roomName].sourceNum) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, outSourceRoomName) {


        let name = this.properties.role + Game.time;
        let body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE] // cost: 600 + 150 + 50 = 800

        const existingThisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.memory.targetRoom == outSourceRoomName);
        var existingTargets = _.map(existingThisTypeCreeps, creep => creep.memory.target)

        const sourceCount = Memory.outSourceRooms[outSourceRoomName].sourceNum;
        var sourceTarget;
        for(var i = 0; i < sourceCount; i++) {
            if (!existingTargets.includes(i)) {
                sourceTarget = i;
                break;
            }
        }

        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName, target: sourceTarget};

        return {name, body, memory};
    },
}

module.exports = remoteHarvester;