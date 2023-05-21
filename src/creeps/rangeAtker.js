module.exports = {
    properties: {
        role: 'rangeAtker',
        body: [...new Array(5).fill(TOUGH), ...new Array(25).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(10).fill(HEAL)],
        boostInfo: {XLHO2: 10, XGHO2: 5, XKHO2: 10},
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.getBoosts(creep.memory.boostInfo);
            return;
        }

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
            hostile = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: struct => (struct.structureType != STRUCTURE_KEEPER_LAIR && struct.structureType != STRUCTURE_CONTROLLER)});
        }

        if (hostile) {
            if(creep.pos.isNearTo(hostile)) creep.rangedMassAttack();
            
            if(creep.rangedAttack(hostile) === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ff0000'}, maxRooms: 1});
            }
            
            creep.heal(creep);
            return;
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room, roomName) {
        if(room.controller.level < 8) return false;
        
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
    spawnData: function(room, targetRoomName, opt={}) {
        opt.boost = true;

        let name = this.properties.role + Game.time;
        let body;
        if(opt.body) body = opt.body;
        else body = this.properties.body;

        let memory = {role: this.properties.role, status: 0, targetRoom: targetRoomName, base: room.name};

        if(opt.targetId) memory.target = opt.targetId;
        
        if(opt.boost) {
            memory.boost = true;
            memory.boosted = false;
            if(opt.boostInfo) memory.boostInfo = opt.boostInfo;
            else memory.boostInfo = this.properties.boostInfo;
        }

        return {name, body, memory};
    },
};