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

// rangeAtker boosted/unboosted
Game.rooms['E14N3'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(3).fill(TOUGH), ...new Array(25).fill(MOVE), ...new Array(15).fill(RANGED_ATTACK), ...new Array(7).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        targetRoom: 'E18N6',
        boost: true,
        boostInfo: { XLHO2: 7, XGHO2: 3, XKHO2: 15 }
    }
});

// power

Game.rooms['E6S2'].memory.tasks.spawnTasks.push({
    name: 'powerMedic',
    body: [...new Array(25).fill(MOVE), ...new Array(25).fill(HEAL)],
    memory: {
        role: 'powerMedic',
    }
});

Game.rooms['E6S2'].memory.tasks.spawnTasks.push({
    name: 'powerMiner',
    body: [...new Array(20).fill(MOVE), ...new Array(20).fill(ATTACK)],
    memory: {
        role: 'powerMiner',
        targetRoom: 'E8S0',
    }
});

Game.rooms['E6S2'].memory.tasks.spawnTasks.push({
    name: 'transporter',
    body: [...new Array(25).fill(MOVE), ...new Array(25).fill(CARRY)],
    memory: {
        role: 'transporter',
        workType: 3,
        targetRoom: 'E8S0',
        base: 'E16S2',
    }
});