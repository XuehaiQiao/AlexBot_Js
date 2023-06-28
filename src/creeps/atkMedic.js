module.exports = {
    properties: {
        role: 'atkMedic',
    },

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.spawning) return;

        // boost
        if (creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.say('boost');
            creep.getBoosts();
            return;
        }

        if (creep.memory.duoNumber != null && !creep.memory.front) {
            creep.say('find');
            let partner = creep.room.find(FIND_MY_CREEPS, {
                filter: c => c.memory.duoNumber === creep.memory.duoNumber
            })[0];

            if (partner) {
                creep.memory.front = partner.id;
                partner.memory.back = creep.id;
            }
            else creep.toResPos(0);

            return;
        }

        let partner = Game.getObjectById(creep.memory.front);
        console.log('medic partner', partner)
        if (!partner) {
            // todo: heal surronding creeps
            let damagedCreeps = creep.room.find(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep);
            }
            else if (damagedCreeps.length) {
                let target = creep.pos.findClosestByRange(damagedCreeps);
                creep.travelTo(target);
                creep.heal(target);
                creep.rangedHeal(target);
            }
            else {
                creep.heal(creep);
            }
            return;
        }

        creep.moveTo(partner);
        // if (partner.hits === partner.hitsMax && creep.hits === creep.hitsMax) {
        //     let adjCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 3, { filter: c => c.hits < c.hitsMax });
        //     if (adjCreeps.length > 0) {
        //         let target = creep.pos.findClosestByRange(adjCreeps);
        //         if (creep.heal(target) === ERR_NOT_IN_RANGE) creep.rangedHeal(target);
        //     }
        // }
        if (partner.hits === partner.hitsMax && creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        else if (creep.hits <= creep.hitsMax - 500) {
            creep.heal(creep);
        }
        else {
            let result = creep.heal(partner);
            if (!creep.pos.isNearTo(partner)) creep.rangedHeal(partner);
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function (room, targetRoomName, opt) {
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room, targetRoomName) {
        let name = this.properties.role + Game.time % 10000;
        let body = []
        let memory = {
            role: this.properties.role,
            targetRoom: targetRoomName,
        };

        return { name, body, memory };
    },
};