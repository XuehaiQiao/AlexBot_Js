// duo 5300 + 5400
Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'atkM',
    body: [...new Array(5).fill(RANGED_ATTACK), ...new Array(10).fill(ATTACK), ...new Array(25).fill(MOVE), ...new Array(10).fill(HEAL)],
    memory: {
        role: 'atkMelee',
        targetRoom: 'E17N4',
        duoNumber: 3,
        boost: true,
        boostInfo: { LHO2: 10, KHO2: 5, UH2O: 10 }
    }
});

Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'atkMe',
    body: [...new Array(18).fill(MOVE), ...new Array(18).fill(HEAL)],
    memory: {
        role: 'atkMedic',
        duoNumber: 3,
        boost: true,
        boostInfo: { LHO2: 18 }
    }
});


Game.rooms['E11S2'].memory.tasks.spawnTasks.push({
    name: 'atkMel',
    body: [...new Array(2).fill(RANGED_ATTACK), ...new Array(2).fill(ATTACK), ...new Array(4).fill(MOVE)],
    memory: {
        role: 'atkMelee',
        targetRoom: 'E11S1',
        duoNumber: 1,
    }
});

Game.rooms['E11S2'].memory.tasks.spawnTasks.push({
    name: 'atkMed',
    body: [...new Array(8).fill(HEAL), ...new Array(2).fill(MOVE)],
    memory: {
        role: 'atkMedic',
        duoNumber: 1,
    }
});


Game.rooms['E11S2'].memory.tasks.spawnTasks.push({
    name: 'defM',
    body: [...new Array(5).fill(ATTACK), ...new Array(5).fill(MOVE)],
    memory: {
        role: 'defMelee',
        boost: true,
        boostInfo: { XUH2O: 5 }
    }
});