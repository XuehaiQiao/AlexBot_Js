// large
Game.rooms['E9S2'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(5).fill(RANGED_ATTACK), ...new Array(12).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(13).fill(MOVE), ...new Array(10).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        targetRoom: 'E9S3',
    }
});

// boost small
Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(1).fill(TOUGH), ...new Array(8).fill(MOVE), ...new Array(5).fill(RANGED_ATTACK), ...new Array(2).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        base: 'E16S2',
        targetRoom: 'E18S1',
        boost: true,
        boosted: false,
        boostInfo: { XLHO2: 2, XGHO2: 1, XKHO2: 5 }
    }
});

// boost middle
Game.rooms['E9S2'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(2).fill(TOUGH), ...new Array(11).fill(MOVE), ...new Array(5).fill(RANGED_ATTACK), ...new Array(4).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        targetRoom: 'E8S7',
        boost: true,
        boosted: false,
        boostInfo: { XLHO2: 4, XGHO2: 2, XKHO2: 5 }
    }
});

// boost large
Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(5).fill(TOUGH), ...new Array(25).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(10).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        base: 'E16S2',
        targetRoom: 'E18S1',
        boost: true,
        boosted: false,
        boostInfo: { XLHO2: 10, XGHO2: 5, XKHO2: 10 }
    }
});