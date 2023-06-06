const { T3_HEAL, T3_TOUGH, T3_RANGE_ATTACK } = require("../constants/boostName");

module.exports = {
    properties: {
        role: 'rangeAtker',
        body: [...new Array(5).fill(TOUGH), ...new Array(25).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(10).fill(HEAL)],
        boostInfo: {[T3_HEAL]: 10, [T3_TOUGH]: 5, [T3_RANGE_ATTACK]: 10},
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.getBoosts();
            return;
        }

        // move to its target room if not in
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            if(creep.hits < creep.hitsMax) creep.heal(creep);
            return;
        }

        let hostile;
        if (creep.memory.target) {
            hostile = Game.getObjectById(creep.memory.target);
            if (!hostile) creep.memory.target = null;
        }
        if (!hostile) {
            hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }
        // if (!hostile && creep.memory.invader) {
        //     hostile = _.find(creep.room.find(FIND_HOSTILE_STRUCTURES), struct => struct.structureType == STRUCTURE_INVADER_CORE);
        //     if (!hostile && Memory.outSourceRooms[creep.memory.targetRoom]) {
        //         Memory.outSourceRooms[creep.memory.targetRoom].invaderCoreLevel = -1;
        //     }
        // }
        if (!hostile) {
            hostile = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                filter: struct => (
                    struct.structureType !== STRUCTURE_KEEPER_LAIR &&
                    struct.structureType !== STRUCTURE_INVADER_CORE &&
                    struct.structureType !== STRUCTURE_CONTROLLER &&
                    struct.structureType !== STRUCTURE_RAMPART &&
                    struct.structureType !== STRUCTURE_STORAGE &&
                    struct.structureType !== STRUCTURE_TERMINAL
                )
            });
        }

        if (hostile) {
            creep.heal(creep);
            //if (creep.memory.target === null) creep.memory.target = hostile.id;

            // struct
            if (hostile.structureType) {
                creep.say('struct')
                let atkers = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (!atkers.length) {
                    creep.moveTo(hostile);
                    if (hostile.owner && creep.pos.isNearTo(hostile)) creep.rangedMassAttack();
                    creep.rangedAttack(hostile);
                }
                else {
                    if (creep.pos.isNearTo(atkers[0])) creep.rangedMassAttack();
                    else creep.rangedAttack(atkers[0]);
                }
            }
            // creep
            else {
                creep.say('creep')
                let haveAttack = false;
                for(const part of hostile.body) {
                    if(part.type === ATTACK) {
                        haveAttack = true;
                        break;
                    }
                }

                if(haveAttack) {
                    attackInDistance(creep, hostile, 3);
                }
                else {
                    attackInDistance(creep, hostile, 2);

                }

            }

        }
        else {
            if(creep.hits < creep.hitsMax) creep.heal(creep);
        }

    },

    // checks if the room needs to spawn a creep
    spawn: function (room, roomName) {
        if (room.controller.level < 8) return false;

        // check if need spawn
        let creepCount;
        if (global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room, targetRoomName, opt = {}) {
        opt.boost = true;

        let name = this.properties.role + Game.time;
        let body;
        if (opt.body) body = opt.body;
        else body = this.properties.body;

        let memory = { role: this.properties.role, status: 0, targetRoom: targetRoomName, base: room.name };

        if (opt.targetId) memory.target = opt.targetId;

        if (opt.boost) {
            memory.boost = true;
            memory.boosted = false;
            if (opt.boostInfo) memory.boostInfo = opt.boostInfo;
            else memory.boostInfo = this.properties.boostInfo;
        }
        if (opt.invader) {
            memory.invader = true;
        }

        return { name, body, memory };
    },
};

function attackInDistance(creep, hostile, range) {
    if (creep.pos.getRangeTo(hostile) > range) creep.moveTo(hostile);
    else if (creep.pos.getRangeTo(hostile) < range) creep.fleeFromAdv(hostile, 5);

    creep.rangedAttack(hostile);
    if(creep.pos.isNearTo(hostile)) creep.rangedMassAttack();
}