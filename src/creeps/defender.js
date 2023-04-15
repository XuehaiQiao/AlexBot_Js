var defender = {
    properties: {
        role: "defender",
        stages: {
            // 1: {maxEnergyCapacity: 300, bodyParts:[WORK, WORK, CARRY, MOVE], number: 1},
            // 2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], number: 1},
            3: {maxEnergyCapacity: 800, bodyParts:[MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], number: 1},
            4: {maxEnergyCapacity: 1300, bodyParts:[MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], number: 1},
            5: {maxEnergyCapacity: 1800, bodyParts:[MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], number: 1},
        },
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoomAdv(creep.memory.targetRoom);
            return;
        }

        let hostile;
        if (creep.memory.target) {
            hostile = Game.getObjectById(creep.memory.target);
        } 
        if(!hostile) {
            hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        } 
        if(!hostile) {
            hostile = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: struct => (struct.structureType != STRUCTURE_KEEPER_LAIR &&struct.structureType != STRUCTURE_CONTROLLER)});
        }

        

        if (hostile) {
            creep.rangedAttack(hostile);
            if(creep.attack(hostile) == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            return;
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room, roomName) {
        // var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.memory.targetRoom == roomName);
        // console.log(this.properties.role + ': ' + thisTypeCreeps.length, roomName);
    
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

    // returns an object with the data to spawn a new creep
    spawnData: function(room, targetRoomName, targetId = null) {
        let name = this.properties.role + Game.time;
        let body = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
        let memory = {role: this.properties.role, status: 0, targetRoom: targetRoomName, target: targetId, base: room.name};

        return {name, body, memory};
    },
}

module.exports = defender;