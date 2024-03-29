// todo

module.exports = {
    properties: {
        role: 'keeperAttacker',
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        //move to targetRoom if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        // check high level invader core
        const invaderCore = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_INVADER_CORE});
        if(invaderCore.level >= 3) {
            console.log('invaderCore!')
            if (invaderCore.ticksToDeploy < 1500 || invaderCore.ticksToDeploy === undefined) {
                let roomMemory = Memory.outSourceRooms[creep.room.name];
                if(roomMemory) roomMemory.invaderCore = {level: invaderCore.level, endTime: Game.time + 70000 + invaderCore.ticksToDeploy};
            }
        }
        
        let targetKeeper = Game.getObjectById(creep.memory.enemyId);
        if(!targetKeeper) {
            targetKeeper = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: creep => creep.owner.username === 'Source Keeper'});
            if(targetKeeper) creep.memory.enemyId = targetKeeper.id;
        }
        //find nearest keeper creep, attack.
        if(targetKeeper) {
            if(targetKeeper.owner.username === 'Source Keeper' || creep.pos.getRangeTo(targetKeeper) > 1) {
                if(creep.hits < creep.hitsMax) creep.heal(creep);
            }
            creep.moveToNoCreepInRoom(targetKeeper);
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
            creepCount = global.roomCensus[targetRoomName][this.properties.role];
            if(global.roomCensus[targetRoomName]['invaderAttacker']) {
                creepCount += global.roomCensus[targetRoomName]['invaderAttacker'];
            }
        }
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.body;
        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: targetRoomName};

        return {name, body, memory};
    },
};