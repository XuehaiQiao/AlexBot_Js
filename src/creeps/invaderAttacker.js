const { G } = require("../config/roomResourceConfig");

module.exports = {
    properties: {
        role: "invaderAttacker"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        //move to targetRoom if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        
        let invaders = creep.room.find(FIND_HOSTILE_CREEPS, {filter: c => c.owner.username === 'Invader'});
        //find nearest keeper creep, attack.
        if(invaders.length) {
            let medic = _.find(invaders, invader => {
                for(const bodyPart of invader.body) {
                    if(bodyPart.type === HEAL) return true;
                }
                return false;
            })

            let invader;
            if(medic) invader = medic;
            else invader = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: c => c.owner.username === 'Invader'});

            
            if(creep.pos.getRangeTo(invader) > 2) {
                creep.rangedAttack(invader);
                creep.moveTo(invader);
            }
            else if(creep.pos.getRangeTo(invader) < 2) {
                // flee
                creep.rangedMassAttack();
            }
            else {
                creep.rangedAttack(invader);
            }
            creep.heal(creep);
        }
        else {
            let damaged = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
            if(damaged) {
                if(creep.heal(damaged) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(damaged, {reusePath: 20});
                    creep.rangedHeal(damaged);
                }
                
            }
            else {
                creep.suicide();
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room, targetRoomName) {
        if(!Memory.outSourceRooms[targetRoomName]) return false;
        if(Memory.outSourceRooms[targetRoomName].neutral !== true) return false;
        if(room.energyCapacityAvailable < 5600) return false;
        if(!Game.rooms[targetRoomName]) return false;
        if(Game.rooms[targetRoomName].find(FIND_HOSTILE_CREEPS, {filter: c => c.owner.username === 'Invader'}).length === 0) return false;

        let creepCount;
        if(global.roomCensus[targetRoomName] && global.roomCensus[targetRoomName][this.properties.role]) {
            creepCount = global.roomCensus[targetRoomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < 2) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = [...new Array(20).fill(MOVE), ...new Array(20).fill(RANGED_ATTACK), ...new Array(5).fill(MOVE), ...new Array(5).fill(HEAL)]; // $5500
        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: targetRoomName};

        return {name, body, memory};
    },
};