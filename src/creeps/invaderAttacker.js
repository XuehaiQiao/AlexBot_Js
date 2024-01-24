const { T3_HEAL, T3_TOUGH, T3_RANGE_ATTACK } = require("../constants/boostName");

module.exports = {
    properties: {
        role: 'invaderAttacker',
        option: {
            boost: {body: [...new Array(2).fill(TOUGH), ...new Array(16).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(4).fill(HEAL)], number: 1},
            nonBoost: {body: [...new Array(20).fill(MOVE), ...new Array(20).fill(RANGED_ATTACK), ...new Array(5).fill(MOVE), ...new Array(5).fill(HEAL)], number: 2},
        },
        boostInfo: {[T3_HEAL]: 4, [T3_TOUGH]: 2, [T3_RANGE_ATTACK]: 10},
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.getBoosts();
            return;
        }

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
                creep.memory.role = 'keeperAttacker';
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room, targetRoomName) {
        if(room.energyCapacityAvailable < 5600) return false;

        let creepCount;
        if(global.roomCensus[targetRoomName] && global.roomCensus[targetRoomName][this.properties.role]) {
            creepCount = global.roomCensus[targetRoomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < this.properties.option.boost.number) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.option.boost.body;
        let memory = {
            role: this.properties.role, 
            base: room.name, 
            targetRoom: targetRoomName,
            boost: true,
            boosted: false,
            boostInfo: this.properties.boostInfo
        };

        return {name, body, memory};
    },
};