module.exports = {
    properties: {
        role: "wrecker"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.travelTo(new RoomPosition(25, 25, creep.memory.targetRoom), {preferHighway: true});
            return;
        }

        let hostileStruct;
        if (creep.memory.target) {
            hostileStruct = Game.getObjectById(creep.memory.target);
            if(!hostileStruct) creep.memory.target = null;
        } else {
            hostileStruct = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                filter: struct => (
                    struct.structureType != STRUCTURE_CONTROLLER &&
                    struct.structureType != STRUCTURE_RAMPART
                    //struct.structureType != STRUCTURE_STORAGE &&
                    //struct.structureType != STRUCTURE_TERMINAL
                )
            });
        }

        if(!hostileStruct && creep.memory.wall) {
            hostileStruct = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_WALL && struct.structureType === STRUCTURE_RAMPART});
        }

        if (hostileStruct) {
            let result = creep.dismantle(hostileStruct);
            if(result === ERR_NOT_IN_RANGE) {
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
};