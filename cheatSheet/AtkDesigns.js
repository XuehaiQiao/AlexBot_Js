Game.rooms['E11S2'].memory.tasks.spawnTasks.push({
    name: 'atkM',
    body: [...new Array(10).fill(TOUGH), ...new Array(5).fill(RANGED_ATTACK), ...new Array(25).fill(ATTACK), ...new Array(10).fill(MOVE)],
    memory: {
        role: 'atkMelee',
        targetRoom: 'E13S7',
        duoNumber: 6,
        boost: true,
        boostInfo: { XGHO2: 10, XKHO2: 5, XUH2O: 25, XZHO2: 10 }
    }
});

Game.rooms['E11S2'].memory.tasks.spawnTasks.push({
    name: 'atkMe',
    body: [...new Array(5).fill(TOUGH), ...new Array(10).fill(MOVE), ...new Array(5).fill(TOUGH), ...new Array(30).fill(HEAL)],
    memory: {
        role: 'atkMedic',
        duoNumber: 6,
        boost: true,
        boostInfo: { XGHO2: 10, XLHO2: 30, XZHO2: 10 }
    }
});