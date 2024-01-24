module.exports = function (room) {
    if (!room || !room.controller || room.controller.level < 4) return;
    if (room.controller.safeMode != undefined) return;
    
    if(room.memory.enemyStayTime === undefined) room.memory.enemyStayTime = 0;

    const hostileParts = [ATTACK, RANGED_ATTACK, WORK, HEAL, CLAIM]
    let enemies = room.find(FIND_HOSTILE_CREEPS, {
        filter: c =>
            c.owner.username !== 'Invader' &&
            _.find(hostileParts, partType => c.getActiveBodyparts(partType) > 0
            )
    });

    let isEnemy = false;

    for (let e of enemies) {
        // let nearRamparts = e.pos.findInRange(FIND_MY_STRUCTURES, 1, { filter: struct => struct.structureType === STRUCTURE_RAMPART });
        // if (nearRamparts.length) {
        //     isEnemy = true;
        //     break;
        // }

        let closeSpwanAndExtensions = e.pos.findInRange(FIND_MY_STRUCTURES, 3, {
            filter: struct => (
                struct.structureType === STRUCTURE_EXTENSION &&
                struct.structureType === STRUCTURE_SPAWN
            )
        });
        if (closeSpwanAndExtensions.length) {
            isEnemy = true
            break;
        }
    }

    if(isEnemy) {
        room.memory.enemyStayTime += 1;
    }
    else {
        room.memory.enemyStayTime = 0;
    }

    if(room.memory.enemyStayTime >= 2) {
        room.controller.activateSafeMode();
    }
}