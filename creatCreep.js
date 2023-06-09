// duo 4450 + 5400
Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'atkM',
    body: [...new Array(5).fill(RANGED_ATTACK), ...new Array(15).fill(ATTACK), ...new Array(25).fill(MOVE), ...new Array(5).fill(HEAL)],
    memory: {
        role: 'atkMelee',
        targetRoom: 'E16N1',
        duoNumber: 1,
        boost: true,
        boostInfo: { LHO2: 5, KHO2: 5, UH: 15 }
    }
});

Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'atkMe',
    body: [...new Array(18).fill(MOVE), ...new Array(18).fill(HEAL)],
    memory: {
        role: 'atkMedic',
        duoNumber: 1,
        boost: true,
        boostInfo: { LHO2: 18 }
    }
});


Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'atkMel',
    body: [...new Array(2).fill(RANGED_ATTACK), ...new Array(2).fill(ATTACK), ...new Array(4).fill(MOVE)],
    memory: {
        role: 'atkMelee',
        targetRoom: 'E16N1',
        duoNumber: 1,
        boost: true,
        boostInfo: { KO: 2, UH: 2 }
    }
});

Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'atkMed',
    body: [...new Array(2).fill(HEAL), ...new Array(2).fill(MOVE)],
    memory: {
        role: 'atkMedic',
        duoNumber: 1,
        boost: true,
        boostInfo: { LO: 2 }
    }
});