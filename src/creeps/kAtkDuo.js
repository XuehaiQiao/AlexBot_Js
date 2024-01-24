// todo
// this role is for season sourceKeeperRooms to defence NPCs with no boost.

module.exports = {
    properties: {
        role: 'kAtkDuo',
        type: {
            front: {
                body: [...new Array(6).fill(RANGED_ATTACK), ...new Array(25).fill(MOVE), ...new Array(19).fill(ATTACK)] // $3670,
            },
            back: {
                body: [...new Array(10).fill(HEAL), ...new Array(15).fill(MOVE), ...new Array(5).fill(HEAL)], // $4500
            }
        }

    },
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.type === 'front') this.runFront(creep);
        else if (creep.memory.type === 'back') this.runBack(creep);
    },

    runFront: function (creep) {
        // if no partner, wait
        if (!creep.memory.back) {
            creep.toResPos(0);
            return;
        }

        this.atkPassingHostile(creep);

        let partner = Game.getObjectById(creep.memory.back);
        if (!partner) {
            creep.memory.role = 'keeperAttacker';
            return;
        }
        else if (!creep.pos.isNearTo(partner) && !creep.isAtEdge()) {
            return;
        }
        else {
            // if followed by partner
            creep.pull(partner);

            // attack hostile if have
            if (this.atkPlayer(creep)) return;

            //move to targetRoom if not in
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoom(creep.memory.targetRoom);
                return;
            }

            let actions = [
                this.atkPlayer, // todo
                this.atkInvader,
                this.atkSourceKeeper
            ]

            for (let action of actions) {
                if (action(creep)) return;
            }
        }
    },

    runBack: function (creep) {
        if (creep.spawning) return;

        if (!creep.memory.front) {
            let partner = creep.room.find(FIND_MY_CREEPS, {
                filter: c => (
                    c.memory.role === this.properties.role &&
                    c.memory.type === 'front' &&
                    !c.memory.back &&
                    c.memory.targetRoom === creep.memory.targetRoom
                )
            })[0]

            if (partner) {
                creep.memory.front = partner.id;
                partner.memory.back = creep.id;
            }
            else creep.toResPos(0);
        }

        let partner = Game.getObjectById(creep.memory.front);
        if (!partner) {
            // todo: heal surronding creeps
            creep.heal(creep);
            return;
        }

        //this.atkPassingHostile(creep);

        creep.moveTo(partner);
        if (partner.hits === partner.hitsMax && creep.hits === creep.hitsMax) {
            let adjCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 3, { filter: c => c.hits < c.hitsMax });
            if (adjCreeps.length > 0) {
                let target = creep.pos.findClosestByRange(adjCreeps);
                if (creep.heal(target) === ERR_NOT_IN_RANGE) creep.rangedHeal(target);
            }
        }
        else if (partner.hits === partner.hitsMax && creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        else if (creep.hits <= creep.hitsMax - 12 * creep.getActiveBodyparts(HEAL)) {
            creep.heal(creep);
        }
        else {
            creep.heal(partner);
            if (!creep.pos.isNearTo(partner)) creep.rangedHeal(partner);
        }
    },

    atkPlayer: function (creep) {
        const hostileParts = [ATTACK, RANGED_ATTACK, WORK, HEAL, CLAIM, CARRY];
        let enemies = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: (
                c => c.owner.username !== 'Invader' &&
                    c.owner.username !== 'Source Keeper' &&
                    _.find(hostileParts, partType => c.getActiveBodyparts(partType) > 0)
            )
        });
        if (enemies.length) {
            let invader;
            let medic = creep.pos.findClosestByRange(enemies, { filter: c => c.getActiveBodyparts(HEAL) > 0 });
            if (medic) invader = medic;
            else invader = creep.pos.findClosestByRange(enemies);

            if (creep.pos.getRangeTo(invader) > 3) {
                creep.travelTo(invader);
            }
            else {
                let result = creep.attack(invader);
                creep.say(result);
                creep.rangedAttack(invader);
                if (result !== OK) {
                    creep.heal(creep);
                    creep.travelTo(invader, {ignoreCreeps: false});
                }

            }
            return true;
        }
        return false;
    },

    atkInvader: function (creep) {
        let invaders = creep.room.find(FIND_HOSTILE_CREEPS, { filter: c => c.owner.username === 'Invader' });
        if (invaders.length) {
            let invader;
            let medic = creep.pos.findClosestByRange(invaders, { filter: invader => invader.getActiveBodyparts(HEAL) > 0 });
            if (medic) invader = medic;
            else invader = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: c => c.owner.username === 'Invader' });

            if (creep.pos.getRangeTo(invader) > 3) {
                creep.travelTo(invader, { allowSK: true, movingTarget: true });
            }
            else {
                let result = creep.attack(invader);
                creep.say(result);
                creep.rangedAttack(invader);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.heal(creep);
                }
                creep.travelTo(invader, { allowSK: true });
            }
            return true;
        }
        return false;
    },

    atkSourceKeeper: function (creep) {
        let targetKeeper = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: c => c.owner.username === 'Source Keeper' });
        if (targetKeeper) {
            if (creep.attack(targetKeeper) === ERR_NOT_IN_RANGE) {
                creep.heal(creep);
                creep.moveTo(targetKeeper);
            }
            creep.rangedAttack(targetKeeper);
        }
        //if no keeper, find closest spawning time keeper lair, move to it.
        else {
            let targetLairs = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_KEEPER_LAIR });
            if (targetLairs.length === 0) {
                console.log(creep.room, 'NO KEEPER LAIR!');
                return false;
            };

            targetLairs.sort((a, b) => a.ticksToSpawn - b.ticksToSpawn);

            if (!creep.pos.inRangeTo(targetLairs[0].pos, 1)) {
                creep.moveToNoCreepInRoom(targetLairs[0]);
            }
            creep.heal(creep);
        }

        return true;
    },

    atkPassingHostile(creep) {
        let hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if (hostiles.length) {
            let target = creep.pos.findClosestByRange(hostiles);
            creep.attack(target)
            creep.rangedAttack(target);
        }

        return false;
    },

    // checks if the room needs to spawn a creep
    spawn: function (room, targetRoomName) {
        if (!Memory.outSourceRooms[targetRoomName]) return false;
        if (Memory.outSourceRooms[targetRoomName].sourceKeeper !== true || Memory.outSourceRooms[targetRoomName].neutral !== true) return false;
        if (room.energyCapacityAvailable < 5600) return false;

        let creeps = _.filter(Game.creeps, c => (
            c.memory.role === this.properties.role &&
            c.memory.targetRoom === targetRoomName &&
            (c.ticksToLive > c.body.length * 3 + 50 || c.ticksToLive === undefined)
        ));

        let workingFront = _.find(creeps, c => c.memory.back != null);
        if (workingFront) return false

        let waitings = _.filter(creeps, c => c.memory.front == null && c.memory.back == null);

        if (waitings.length < 2) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room, targetRoomName) {
        let creeps = _.filter(Game.creeps, c => (
            c.memory.role === this.properties.role &&
            c.memory.targetRoom === targetRoomName
        ));
        let waitings = _.filter(creeps, c => (c.memory.front == null && c.memory.back == null));

        let name;
        let body;
        let memory;

        if (waitings.length < 1) {
            // create front
            name = this.properties.role + 'F' + Game.time % 10000;
            body = this.properties.type.front.body;
            memory = { role: this.properties.role, base: room.name, targetRoom: targetRoomName, type: 'front', back: null };

        }
        else {
            name = this.properties.role + 'B' + Game.time % 10000;
            body = this.properties.type.back.body;
            memory = { role: this.properties.role, base: room.name, targetRoom: targetRoomName, type: 'back', front: null };
        }

        return { name, body, memory };
    },


};