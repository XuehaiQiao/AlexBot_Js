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

// duo ultra
Game.rooms['E17N2'].memory.tasks.spawnTasks.push({
    name: 'atkM',
    body: [...new Array(10).fill(TOUGH), ...new Array(5).fill(RANGED_ATTACK), ...new Array(25).fill(ATTACK), ...new Array(10).fill(MOVE)],
    memory: {
        role: 'atkMelee',
        targetRoom: 'E22N2',
        duoNumber: 6,
        boost: true,
        boostInfo: { XGHO2: 10, XKHO2: 5, XUH2O: 25, XZHO2: 10 }
    }
});

Game.rooms['E17N2'].memory.tasks.spawnTasks.push({
    name: 'atkMe',
    body: [...new Array(5).fill(TOUGH), ...new Array(10).fill(MOVE), ...new Array(5).fill(TOUGH), ...new Array(30).fill(HEAL)],
    memory: {
        role: 'atkMedic',
        duoNumber: 6,
        boost: true,
        boostInfo: { XGHO2: 10, XLHO2: 30, XZHO2: 10 }
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
Game.rooms['E17N2'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(2).fill(TOUGH), ...new Array(17).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(5).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        targetRoom: 'E26N2',
        boost: true,
        boostInfo: { XLHO2: 5, XGHO2: 2, XKHO2: 10 }
    }
});

// power =====================

Game.rooms['E17N2'].memory.tasks.spawnTasks.push({
    name: 'powerMedic',
    body: [...new Array(25).fill(MOVE), ...new Array(25).fill(HEAL)],
    memory: {
        role: 'powerMedic',
    }
});

Game.rooms['E17N2'].memory.tasks.spawnTasks.push({
    name: 'powerMiner',
    body: [...new Array(20).fill(MOVE), ...new Array(20).fill(ATTACK)],
    memory: {
        role: 'powerMiner',
        targetRoom: 'E16N0',
    }
});

// boosted power

Game.rooms['E11S2'].memory.tasks.spawnTasks.push({
    name: 'powerMedic',
    body: [...new Array(25).fill(MOVE), ...new Array(25).fill(HEAL)],
    memory: {
        role: 'powerMedic',
    }
});

Game.rooms['E11S2'].memory.tasks.spawnTasks.push({
    name: 'powerMiner',
    body: [...new Array(3).fill(TOUGH), ...new Array(19).fill(MOVE), ...new Array(16).fill(ATTACK)],
    memory: {
        role: 'powerMiner',
        targetRoom: 'E10S6',
        boost: true,
        boostInfo: { XGHO2: 3, XUH2O: 16 }
    }
});

// carrier

Game.rooms['E6S2'].memory.tasks.spawnTasks.push({
    name: 'transporter',
    body: [...new Array(25).fill(MOVE), ...new Array(25).fill(CARRY)],
    memory: {
        role: 'transporter',
        workType: 3,
        targetRoom: 'E3N0',
        base: 'E6S2',
    }
});


// ==================

// rangeAtker boosted/unboosted
Game.rooms['E14N3'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(5).fill(TOUGH), ...new Array(25).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(10).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        targetRoom: 'E14N4',
        boost: true,
        boostInfo: { XLHO2: 10, XGHO2: 5, XKHO2: 10 }
    }
});

// duo ultra
Game.rooms['E14N3'].memory.tasks.spawnTasks.push({
    name: 'atkM',
    body: [...new Array(10).fill(TOUGH), ...new Array(5).fill(RANGED_ATTACK), ...new Array(25).fill(ATTACK), ...new Array(10).fill(MOVE)],
    memory: {
        role: 'atkMelee',
        targetRoom: 'E13N6',
        duoNumber: 1,
        boost: true,
        boostInfo: { XGHO2: 10, XKHO2: 5, XUH2O: 25, XZHO2: 10 }
    }
});

Game.rooms['E14N3'].memory.tasks.spawnTasks.push({
    name: 'atkMe',
    body: [...new Array(5).fill(TOUGH), ...new Array(10).fill(MOVE), ...new Array(5).fill(TOUGH), ...new Array(30).fill(HEAL)],
    memory: {
        role: 'atkMedic',
        duoNumber: 1,
        boost: true,
        boostInfo: { XGHO2: 10, XLHO2: 30, XZHO2: 10 }
    }
});