/*
    atkMelee:
        bodyTypes: [ATTACK, RANGED_ATTACK, HEAL, TOUGH, MOVE],
        options: {
            front: bool (if act front type in a duo),
            body: [] (i.e. [ATTACK: {amount: 10, boost: 'XUH2O'}])
        }

        memory: {
            back: null / undefined, 
            targetRoom: string,
            boostInfo: {},
            boost: bool,

        }

        state {
            attackResult: if attck return OK, change this one to OK
        }

        LOGIC:
        // check threaten creeps: flee
        // check damage: flee

        // find path to hostile structs (no rampart, controller, extractor, stores)
        // if found path, move to and attack it
        // if didn't find, repath cross rampart wall, attack rampart/wall along the way
        // attack structs
        // attack creeps


*/

module.exports = {
    properties: {
        role: 'atkMelee',
    },

    /** @param {Creep} creep **/
    run: function (creep) {
        // set state
        const state = {
            ranged: creep.getActiveBodyparts(RANGED_ATTACK),
            heal: creep.getActiveBodyparts(HEAL),
        };

        // boost
        if (creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.say('boost')
            creep.getBoosts();
            return;
        }

        // duo logic
        if (this.duoLogic(creep, state)) {
            creep.say('freeze')
            this.checkAndHeal(creep, state);
            return;
        }

        // on the way to targetRoom
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            this.atkOnTheWay(creep, state);
            this.checkAndHeal(creep, state);
            return;
        }

        // moveTo flag logic
        if (this.blueFlagLogic(creep, state)) {
            this.checkAndHeal(creep, state);
            return;
        }

        // flee flag logic
        if (this.redFlagLogic(creep, state)) {
            this.checkAndHeal(creep, state);
            return;
        }

        // attack wall/rampart flag logic
        if (this.greenFlagLogic(creep, state)) {
            this.checkAndHeal(creep, state);
            return;
        }

        // attack all struct flag logic
        if (this.yellowFlagLogic(creep, state)) {
            this.checkAndHeal(creep, state);
            return;
        }

        // attack structs
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: struct => (
                struct.structureType != STRUCTURE_CONTROLLER &&
                struct.structureType != STRUCTURE_RAMPART &&
                //struct.structureType != STRUCTURE_STORAGE &&
                struct.structureType != STRUCTURE_TERMINAL
            )
        });

        if (target) {
            let result = creep.attack(target);

            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { maxRooms: 1 });
                creep.rangedAttack(target);
            }
            else if (result === OK) {
                creep.rangedMassAttack();
                state.attackResult = OK;
            }
            this.atkOnTheWay(creep, state);
            this.checkAndHeal(creep, state);
            return;
        }

        // attack creeps
        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            creep.moveTo(target, { maxRooms: 1 });

            this.atkOnTheWay(creep, state);
            this.checkAndHeal(creep, state);
            return;
        }

        // heal self
        if (creep.hits < creep.hitsMax) {
            this.checkAndHeal(creep, state);
            return;
        }

        // attack rampart / const wall
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: struct => (
                struct.structureType === STRUCTURE_WALL ||
                struct.structureType === STRUCTURE_RAMPART
            )
        });
        if (target) {
            creep.moveTo(target, { maxRooms: 1 });
            creep.attack(target);
            creep.rangedAttack(target);
        }
    },

    // return true if need stop other works
    duoLogic: function (creep, state) {
        if (creep.memory.duoNumber !== undefined) {
            state.front = true;
            state.partner = Game.getObjectById(creep.memory.back);
        }

        console.log('partner', state.partner);

        if (state.front) {
            // partner haven't spawn
            if (!creep.memory.back) {
                creep.toResPos(0);
                return true;
            }

            // partner dead
            if (!state.partner) {
                delete creep.memory.back;
            }
            // is partner not near
            else if (!creep.pos.isNearTo(state.partner) && !creep.isAtEdge()) {
                creep.say('wait');
                state.move = false;
                this.atkOnTheWay(creep, state);
                return true;
            }
            else {
                creep.pull(state.partner);
            }
        }

        return false;
    },

    blueFlagLogic: function (creep, state) {
        let blueFlag = creep.pos.findClosestByPath(FIND_FLAGS, { filter: { color: COLOR_BLUE } });
        if (blueFlag) {
            creep.say('toBlue');
            creep.moveTo(blueFlag, { maxRooms: 1 });
            this.atkOnTheWay(creep, state);
            return true;
        }

        return false;
    },

    greenFlagLogic: function (creep, state) {
        let greenFlag = creep.pos.findClosestByPath(FIND_FLAGS, { filter: { color: COLOR_GREEN } });
        if (greenFlag) {
            creep.say('green');
            let target = _.find(greenFlag.pos.lookFor(LOOK_STRUCTURES), struct => (
                struct.structureType === STRUCTURE_WALL ||
                struct.structureType === STRUCTURE_RAMPART
            ));

            if (target) {
                let result = creep.attack(target);
                creep.rangedAttack(target);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { maxRooms: 1 });
                    this.atkOnTheWay(creep, state);
                }
                else if (result === OK) {
                    state.attackResult = OK;
                }

                let closeHostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (closeHostiles.length) {
                    let targetCreep = creep.pos.findClosestByRange(closeHostiles);
                    creep.rangedAttack(targetCreep);
                }
                else {
                    if (state.attackResult === OK) creep.rangedMassAttack();
                }

                return true
            }
            else greenFlag.remove();
        }

        return false;
    },

    yellowFlagLogic: function (creep, state) {
        let yellowFlag = creep.pos.findClosestByPath(FIND_FLAGS, { filter: { color: COLOR_YELLOW } });
        if (yellowFlag) {
            creep.say('yellow')
            let target = _.find(yellowFlag.pos.lookFor(LOOK_STRUCTURES));
            if (target) {
                let result = creep.attack(target);
                creep.rangedAttack(target);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { maxRooms: 1 });
                    this.atkOnTheWay(creep, state);
                }
                else if (result === OK) {
                    state.attackResult = OK;
                }

                let closeHostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (closeHostiles.length) {
                    let targetCreep = creep.pos.findClosestByRange(closeHostiles);
                    creep.rangedAttack(targetCreep);
                }
                else {
                    if (state.attackResult === OK) creep.rangedMassAttack();
                }

                return true
            }
            else yellowFlag.remove();
        }

        return false;
    },

    redFlagLogic: function (creep, state) {
        let redFlag = creep.pos.findClosestByRange(FIND_FLAGS, { filter: { color: COLOR_RED } });
        if (redFlag && (creep.hits <= creep.hitsMax - 500)) {
            creep.say('flee');
            creep.fleeFromAdv(redFlag, creep.pos.getRangeTo(redFlag) + 3);
            this.atkOnTheWay(creep, state);
            return true;
        }

        return false;
    },

    atkOnTheWay(creep, state) {
        let attackResult;

        if (state.ranged) {
            let hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            if (hostiles.length) {
                let target = creep.pos.findClosestByRange(hostiles);
                attackResult = creep.attack(target);
                if (attackResult === OK) {
                    creep.rangedMassAttack();
                }
                else creep.rangedAttack(target);
            }
        }
        else {
            let hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
            if (hostiles.length) attackResult = creep.attack(hostiles[0]);
        }

        if (attackResult === OK) {
            state.attackResult = OK;
        }

        return false;
    },

    checkAndHeal: function (creep, state) {
        if(!state.heal) return;

        if (state.partner && creep.hits > creep.hitsMax - 500 && state.partner.hits < state.partner.hitsMax - 500) {
            creep.heal(state.partner);
            return;
        }

        if (state.attackResult !== OK) {
            creep.heal(creep);
        }
        else if (creep.hits < creep.hitsMax * 0.85) {
            creep.say('heal');
            creep.heal(creep);
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