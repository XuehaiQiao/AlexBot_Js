// todo

module.exports = {
    properties: {
        role: "keeperAttacker"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        //move to targetRoom if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        
        let targetKeeper = Game.getObjectById(creep.memory.enemyId);
        if(!targetKeeper) {
            targetKeeper = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(targetKeeper) creep.memory.enemyId = targetKeeper.id;
        }
        //find nearest keeper creep, attack.
        if(targetKeeper) {
            if(targetKeeper.owner.username === 'Source Keeper' || creep.pos.getRangeTo(targetKeeper) > 1) {
                if(creep.hits < creep.hitsMax) creep.heal(creep);
            }
            creep.moveTo(targetKeeper);
            creep.say(creep.attack(targetKeeper));
            creep.rangedAttack(targetKeeper);
        }
        //if no keeper, find closest spawning time keeper lair, move to it.
        else {
            if(creep.hits < creep.hitsMax) creep.heal(creep);

            let targetLairs = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_KEEPER_LAIR});
            if(targetLairs.length === 0) {
                console.log(creep.room, 'NO KEEPER LAIR!');
                return;
            };

            targetLairs.sort((a,b) => a.ticksToSpawn - b.ticksToSpawn);

            if(!creep.pos.inRangeTo(targetLairs[0].pos, 1)) {
                creep.moveToNoCreepInRoom(targetLairs[0]);
            }
        }

    },

    // checks if the room needs to spawn a creep
    spawn: function(room, targetRoomName) {
        if(!Memory.outSourceRooms[targetRoomName]) return false;
        if(Memory.outSourceRooms[targetRoomName].sourceKeeper !== true || Memory.outSourceRooms[targetRoomName].neutral !== true) return false;
        if(room.energyCapacityAvailable < 5600) return false;

        let creepCount;
        if(global.roomCensus[targetRoomName] && global.roomCensus[targetRoomName][this.properties.role]) {
            creepCount = global.roomCensus[targetRoomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = [...new Array(25).fill(MOVE), ...new Array(19).fill(ATTACK), ...new Array(6).fill(HEAL)]; // $4270
        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: targetRoomName};

        return {name, body, memory};
    },
};