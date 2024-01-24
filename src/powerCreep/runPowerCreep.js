const { roomInfo } = require("../config");
const { traveler } = require("../tools");

/** @param {PowerCreep} pc **/
function runPowerCreep(pc) {
    if (pc.spawnCooldownTime != null) return;

    // spawn
    if (!(pc.spawnCooldownTime > Game.time)) {
        if (pc.memory && pc.memory.base) {
            let room = Game.rooms[pc.memory.base];
            let ps = room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_POWER_SPAWN })[0];
            if (ps) pc.spawn(ps);
        }
    }

    // renew if dying
    if (pc.ticksToLive < 300) {
        // moveTo base
        if (pc.memory.base && pc.room.name !== pc.memory.base) {
            pc.moveTo(new RoomPosition(25, 25, pc.memory.base));
            return;
        }

        let ps = pc.room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_POWER_SPAWN })[0];
        if (ps) {
            pc.moveTo(ps);
            pc.renew(ps);
        }

        return;
    }

    // moveTo targetRoom
    if (pc.memory.targetRoom && pc.room.name !== pc.memory.targetRoom) {
        traveler.travelTo(pc, new RoomPosition(25, 25, pc.memory.targetRoom));
        return;
    }

    if (!pc.room.controller || !pc.room.controller.my) return;

    // enable power
    if (!pc.room.controller.isPowerEnabled) {
        let result = pc.enableRoom(pc.room.controller);
        if (result === ERR_NOT_IN_RANGE) {
            pc.moveTo(pc.room.controller);
        }

        return;
    }

    // PWR_REGEN_MINERAL
    const thoriumMineral = pc.room.find(FIND_MINERALS, { filter: mineral => mineral.mineralType === RESOURCE_THORIUM })[0];
    //console.log('mineral: ', thoriumMineral);
    if (thoriumMineral &&
        pc.powers[PWR_REGEN_MINERAL] &&
        pc.powers[PWR_REGEN_MINERAL].cooldown === 0 &&
        (!thoriumMineral.effects || !thoriumMineral.effects.length)
    ) {
        let result = pc.usePower(PWR_REGEN_MINERAL, thoriumMineral);
        //console.log(result)
        if (result === ERR_NOT_IN_RANGE) pc.moveTo(thoriumMineral);

        return;
    }

    // spawn
    if (pc.powers[PWR_OPERATE_SPAWN] &&
        pc.powers[PWR_OPERATE_SPAWN].cooldown === 0 &&
        (pc.room.memory.boostRoom || pc.room.memory.powerSpawn)
    ) {
        const spawn = pc.room.find(FIND_MY_SPAWNS, { filter: spawn => !spawn.effects || !spawn.effects.length })[0];
        if (pc.store[RESOURCE_OPS] < 100) pc.memory.status = 0;
        else if (spawn) {
            let result = pc.usePower(PWR_OPERATE_SPAWN, spawn);
            if (result === ERR_NOT_IN_RANGE) pc.moveTo(spawn);
            return;
        }
    }


    // Lab
    if (pc.powers[PWR_OPERATE_LAB] &&
        pc.powers[PWR_OPERATE_LAB].cooldown === 0 &&
        pc.store[RESOURCE_OPS] >= 10 &&
        pc.room.memory.tasks &&
        pc.room.memory.tasks.labTasks.length) {
        const labs = pc.room.find(FIND_MY_STRUCTURES, {
            filter: struct => (
                struct.structureType === STRUCTURE_LAB &&
                !pc.room.memory.labs.center.includes(struct.id)
            )
        });

        const lab = _.find(labs, lab => !lab.effects || !lab.effects.length);
        if (lab) {
            let result = pc.usePower(PWR_OPERATE_LAB, lab);
            if (result === ERR_NOT_IN_RANGE) pc.moveTo(lab);
            return;
        }
    }

    // transfer
    if (pc.memory.status) {
        if (pc.store.getFreeCapacity() > 0) {
            pc.usePower(PWR_GENERATE_OPS);
        }
        else if (pc.room.storage && pc.room.storage.my && pc.room.storage.store[RESOURCE_OPS] < 10000) {
            pc.moveTo(pc.room.storage);
            pc.transfer(pc.room.storage, RESOURCE_OPS, pc.store[RESOURCE_OPS] / 2);
            return;
        }
    }
    // withdraw
    else {
        if (pc.level >= 5 && pc.room.terminal && pc.room.terminal.my && pc.room.terminal.store[RESOURCE_OPS] > 0) {
            pc.moveTo(pc.room.terminal);
            let result = pc.withdraw(pc.room.terminal, RESOURCE_OPS, Math.min([pc.room.terminal.store[RESOURCE_OPS], pc.store.getFreeCapacity()]));
            if(result === OK) pc.memory.status = 1;
            return;
        }
    }

    // moveTo pc rest pos
    const rInfo = roomInfo[pc.room.name];
    if (rInfo) {
        if (rInfo.powerCreepPos) {
            pc.moveTo(rInfo.powerCreepPos);
        }
        else {
            pc.moveTo(rInfo.managerPos.x, rInfo.managerPos.y + 2);
        }
    }



}

module.exports = runPowerCreep;