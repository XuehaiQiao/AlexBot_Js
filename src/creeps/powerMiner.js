module.exports = {
    properties: {
        role: 'powerMiner',
        body: [...new Array(20).fill(MOVE), ...new Array(20).fill(ATTACK)],
    },

    /** @param {Creep} creep **/
    run: function (creep) {
        // boost
        if (creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.say('boost')
            creep.getBoosts();
            return;
        }

        // partner haven't spawn
        if (!creep.memory.back) {
            creep.toResPos(0);
            return true;
        }

        let partner = Game.getObjectById(creep.memory.back);
        if (partner) {
            // if partner not near
            if (!creep.pos.isNearTo(partner) && !creep.isAtEdge()) {
                creep.say('wait');
                return true;
            }
            else {
                creep.pull(partner);
            }
        }
        else {
            // todo
        }

        // // move to its target room if not in
        // if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
        //     creep.moveToRoom(creep.memory.targetRoom);
        //     return;
        // }

        const hostileParts = [ATTACK, RANGED_ATTACK, HEAL, CARRY];
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: c => (
                _.find(hostileParts, partType => c.getActiveBodyparts(partType) > 0) ||
                c.body.length >= 10
            )
        });

        if (hostiles.length) {
            let target;
            let medic = creep.pos.findClosestByRange(hostiles, { filter: hostile => hostile.getActiveBodyparts(HEAL) > 0 && hostile.getActiveBodyparts(RANGED_ATTACK) === 0 });
            if (medic) target = medic;
            else target = creep.pos.findClosestByRange(hostiles);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        }

        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        // harvest
        let powerBank = creep.room.find(FIND_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_POWER_BANK })[0];
        if (powerBank) {
            if (creep.attack(powerBank) === ERR_NOT_IN_RANGE) {
                creep.moveTo(powerBank);
            }
        }
        else {
            let hostile = creep.room.find(FIND_HOSTILE_CREEPS)[0];
            if (hostile) {
                if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostile);
                }
            }
            else {
                if(creep.room.name !== creep.memory.base) creep.memory.targetRoom = creep.memory.base;
                else {
                    // suicide if finished all works
                    if (partner) partner.suicide();
                    creep.suicide();
                }

            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function (room) {
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