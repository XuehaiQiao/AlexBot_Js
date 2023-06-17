module.exports = {
    properties: {
        role: 'powerMiner',
        body: [...new Array(20).fill(MOVE), ...new Array(20).fill(ATTACK)],
    },

    /** @param {Creep} creep **/
    run: function (creep) {
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

        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        // harvest
        let powerBank = creep.room.find(FIND_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_POWER_BANK })[0];
        if(powerBank) {
            if (creep.attack(powerBank) === ERR_NOT_IN_RANGE) {
                creep.moveTo(powerBank);
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