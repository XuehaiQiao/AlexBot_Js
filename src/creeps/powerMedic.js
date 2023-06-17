module.exports = {
    properties: {
        role: 'powerMedic',
        body: [...new Array(25).fill(MOVE), ...new Array(25).fill(HEAL)],
    },

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.spawning) return;

        if (!creep.memory.front) {
            creep.say('find');
            let partner = creep.room.find(FIND_MY_CREEPS, {
                filter: c => c.memory.role === 'powerMiner'
            })[0];

            if (partner) {
                creep.memory.front = partner.id;
                partner.memory.back = creep.id;
            }
            else creep.toResPos(0);

            return;
        }

        let partner = Game.getObjectById(creep.memory.front);

        if (!partner) {
            if(creep.hits < creep.hitsMax) creep.heal(creep);
            else {
                let damagedCreeps = creep.room.find(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
                let target = creep.pos.findClosestByRange(damagedCreeps);
                if(creep.heal(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            }

            return;
        }

        creep.moveTo(partner);
        if (partner.hits === partner.hitsMax && creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        else if (creep.hits <= creep.hitsMax - 12 * creep.getActiveBodyparts(HEAL)) {
            creep.heal(creep);
        }
        else {
            creep.heal(partner);
            creep.rangedHeal(partner);
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function (room, targetRoomName, opt) {
        return false;
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room, targetRoomName) {
        const name = this.properties.role + Game.time % 10000;
        const body = this.properties.body;
        const memory = { role: this.properties.role, base: room.name, targetRoom: targetRoomName };

        return { name, body, memory };
    },
};