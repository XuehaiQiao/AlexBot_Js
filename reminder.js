// E6S2
// E14N3

const { UH2O } = require("./src/config/labProductConfig");

// claimer spawn
Game.spawns['Spawn1_W18S15'].spawnCreep([...new Array(6).fill(CLAIM), ...new Array(6).fill(MOVE)], 'Claimer' + Game.time, { memory: { role: 'claimer', status: 1, targetRoom: 'E14N3', claim: true } });

Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'claim',
    body: [...new Array(1).fill(CLAIM), ...new Array(1).fill(MOVE)],
    memory: { role: 'claimer', status: 1, targetRoom: 'E11S2', claim: true }
});
// harvester2
Game.spawns['Spawn1_W18S15'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'harvester2' + Game.time, { memory: { role: 'harvester2', target: 0, targetRoom: 'W17S14' } });
Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'hav',
    body: [...new Array(6).fill(WORK), ...new Array(6).fill(MOVE)],
    memory: { role: 'harvester2', status: 0, targetRoom: 'E11S2' }
});
//builder2
Game.rooms['E14N3'].memory.tasks.spawnTasks.push({
    name: 'builder',
    body: [...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)],
    memory: { role: 'builder', status: 0, targetRoom: 'E15N3' }
});
Game.rooms['E6S2'].memory.tasks.spawnTasks.push({
    name: 'builder2',
    body: [...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)],
    memory: { role: 'builder', targetRoom: 'E6S4' }
});
Game.spawns['Spawn1_W18S15'].spawnCreep([...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], 'builder2' + Game.time, { memory: { role: 'builder2', status: 0, targetRoom: 'W17S14' } });

// upgrader2
Game.spawns['Spawn1_W18S15'].spawnCreep([...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], 'upgrader2' + Game.time, { memory: { role: 'upgrader2', status: 0, targetRoom: 'W17S14' } });

// carrier spawn
Game.spawns['Spawn2_W18S15'].spawnCreep([...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], 'carrier2' + Game.time, { memory: { role: 'carrier2', targetRoom: 'W17S14', status: 0 } });

// transporter spawn
Game.spawns['Spawn2_W18S15'].spawnCreep([...new Array(25).fill(CARRY), ...new Array(25).fill(MOVE)], 'transporter' + Game.time, { memory: { role: 'transporter', base: 'W17S14', targetRoom: 'W18S15' } });
Game.spawns['Spawn2_W21S19'].spawnCreep([...new Array(25).fill(CARRY), ...new Array(25).fill(MOVE)], 'transporter' + Game.time, { memory: { role: 'transporter', base: 'W21S19', targetRoom: 'W20S21', workType: 1 } });
Game.rooms['W16S17'].memory.tasks.spawnTasks.push({ name: 't', body: [...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], memory: { role: 'transporter', base: 'W16S17', targetRoom: 'W16S16', workType: 2 } });
// defender
Game.rooms['E14N3'].memory.tasks.spawnTasks.push({
    name: 'bM',
    body: [...new Array(2).fill(MOVE), ...new Array(2).fill(ATTACK)],
    memory: { role: 'defender' }
});
Game.rooms['E14N4'].memory.tasks.spawnTasks.push({
    name: 'bM',
    body: [...new Array(2).fill(MOVE), ...new Array(2).fill(ATTACK)],
    memory: { role: 'baseMelee' }
});

// scout
Game.rooms['W12S21'].memory.tasks.spawnTasks.push({ name: 'scout', body: [MOVE], memory: { role: 'scout', targetPos: { x: 42, y: 35, roomName: 'W10S20' } } });
// keeperAttacker
Game.spawns['Spawn3_W16S17'].spawnCreep([...new Array(25).fill(MOVE), ...new Array(19).fill(RANGED_ATTACK), ...new Array(6).fill(HEAL)], 'keeperAttacker' + Game.time, { memory: { role: 'keeperAttacker', base: 'W16S17', targetRoom: 'W16S16' } });

// rangeAtker boosted/unboosted
Game.rooms['W21S19'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(5).fill(TOUGH), ...new Array(25).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(10).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        base: 'W21S19',
        targetRoom: 'W22S18',
        boost: true,
        boosted: false,
        boostInfo: { XLHO2: 10, XGHO2: 5, XKHO2: 10 }
    }
});

Game.rooms['E17N2'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(9).fill(MOVE), ...new Array(5).fill(RANGED_ATTACK), ...new Array(4).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        targetRoom: 'E20N4',
    }
});

// invaderAtker
Game.rooms['W16S17'].memory.tasks.spawnTasks.push({
    name: 'invaderAttacker' + Game.time,
    body: [...new Array(2).fill(TOUGH), ...new Array(16).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(4).fill(HEAL)],
    memory: {
        role: 'invaderAttacker',
        base: 'W16S17',
        targetRoom: 'W16S16',
        boost: true,
        boosted: false,
        boostInfo: { XLHO2: 4, XGHO2: 2, XKHO2: 10 }
    }
});

// wrecker
Game.spawns['Spawn1_W18S15'].spawnCreep([...new Array(25).fill(WORK), ...new Array(25).fill(MOVE)], 'wrecker' + Game.time, { memory: { role: 'wrecker', targetRoom: 'W17S14' } });

_.forEach(_.filter(Game.rooms['W18S15'].find(FIND_STRUCTURES), structure => structure.structureType == STRUCTURE_TOWER), function (object) {
    object.destroy();
});

// outSourcer
Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'outSourcer',
    body: [...new Array(5).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(15).fill(MOVE)],
    memory: {
        role: 'outSourcer',
        targetRoom: 'E18N2',
    }
});

// if no tasks
if (roomInfo[creep.room.name]) {
    creep.moveTo(roomInfo[creep.room.name].restPos);
    return;
}

// destroy all the walls
let wallList = Game.rooms.W22S15.find(FIND_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_WALL });
for (let i in wallList) {
    wallList[i].destroy();
}

// wrecker spawn
Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE], 'wrecker' + Game.time, { memory: { role: 'wrecker', targetRoom: 'W17S14' } });
// scout spawn
Game.spawns['Spawn1_W21S19'].spawnCreep([MOVE], 'scout' + Game.time, { memory: { role: 'scout', targetRoom: 'W22S18' } });


outSourceRooms = {
    W17S15: {
        base: 'W18S15',
        sourceNum: 1,
    },
    W17S14: {
        base: 'W18S15',
        sourceNum: 2,
    }

}


// outSource logic: if in range 3 find hostile creep, move back home
// 20:MOVE, 20: ATTACK
// 10:HEAL, 10: MOVE

// destroy structures
_.forEach(
    Game.rooms['roomName'].find(FIND_STRUCTURES),
    struct => struct.destroy()
);

JSON.stringify(obj);

// create task
Game.rooms['W18S15'].memory.tasks.managerTasks.push({ from: STRUCTURE_FACTORY, to: STRUCTURE_STORAGE, resourceType: 'X', volume: 40000 });
Game.rooms['E6S2'].memory.tasks.managerTasks.push({ from: STRUCTURE_STORAGE, to: STRUCTURE_TERMINAL, resourceType: 'LHO2', volume: 2000 });
Game.rooms['W13S15'].memory.tasks.managerTasks.push({ from: STRUCTURE_STORAGE, to: STRUCTURE_NUKER, resourceType: 'G', volume: 5000 });
Game.rooms['W13S15'].memory.tasks.managerTasks.push({ from: STRUCTURE_STORAGE, to: STRUCTURE_NUKER, resourceType: 'energy', volume: 100000 });
// create reaction task
Game.rooms.W19S17.memory.tasks.labTasks.push({ resourceType: 'OH', amount: 3000 });


// orders
Game.rooms['E6S2'].terminal.send(RESOURCE_ENERGY, 30000, 'E2N6', 'From a remote friend');
Game.rooms['E6S2'].terminal.send('L', 4000, 'E17N2', 'L');

Game.market.deal('645bfc8403ae10376b827734', 4000, "W21S19");
// purifier
Game.market.deal('6465dacf03ae1047f9c239df', 10000, 'W18S15');

Game.market.cancelOrder('644046f346d8195c5404a845');

Game.market.createOrder({
    type: ORDER_BUY,
    resourceType: RESOURCE_ENERGY,
    price: 8.37,
    totalAmount: 400000,
    roomName: "W12S21"
});




/*
Todo list:

Best safe mode open time

Mineral mining
- miner creep
- mineral carrier creep

Remote sourcing
- knight (pertect & heal others)

Queues
1. creepGenerationQueue
- eventCreepQueue
- otherCreepGenerationQueue

Optimizing code
- minimizing room maintain cost
- maximizing out source resources
- optimizing defending algos

Scouting
- scout
- how to pertect it self
- keep memory of dangerous zone
- keep memory the killed scouts (where, creep, owner)

2. repairQueue(for tower)
3.

*/

// {
//     "path":[
//         {"x":36,"y":17,"roomName":"W18S15"},
//         {"x":37,"y":17,"roomName":"W18S15"},
//         {"x":38,"y":16,"roomName":"W18S15"},
//         {"x":39,"y":15,"roomName":"W18S15"},
//         {"x":40,"y":14,"roomName":"W18S15"},
//         {"x":41,"y":13,"roomName":"W18S15"},
//         {"x":42,"y":13,"roomName":"W18S15"},
//         {"x":43,"y":12,"roomName":"W18S15"},
//         {"x":44,"y":11,"roomName":"W18S15"},
//         {"x":45,"y":11,"roomName":"W18S15"},
//         {"x":46,"y":11,"roomName":"W18S15"},
//         {"x":47,"y":11,"roomName":"W18S15"},
//         {"x":48,"y":12,"roomName":"W18S15"},
//         {"x":49,"y":13,"roomName":"W18S15"},
//         {"x":0,"y":13,"roomName":"W17S15"},
//         {"x":1,"y":14,"roomName":"W17S15"},
//         {"x":1,"y":15,"roomName":"W17S15"},
//         {"x":1,"y":16,"roomName":"W17S15"},
//         {"x":1,"y":17,"roomName":"W17S15"},
//         {"x":1,"y":18,"roomName":"W17S15"},
//         {"x":2,"y":19,"roomName":"W17S15"},
//         {"x":3,"y":20,"roomName":"W17S15"},
//         {"x":4,"y":21,"roomName":"W17S15"},
//         {"x":5,"y":21,"roomName":"W17S15"},
//         {"x":6,"y":20,"roomName":"W17S15"},
//         {"x":7,"y":19,"roomName":"W17S15"},
//         {"x":8,"y":18,"roomName":"W17S15"},
//         {"x":9,"y":17,"roomName":"W17S15"},
//         {"x":10,"y":16,"roomName":"W17S15"},
//         {"x":11,"y":15,"roomName":"W17S15"},
//         {"x":12,"y":15,"roomName":"W17S15"},
//         {"x":13,"y":15,"roomName":"W17S15"},
//         {"x":14,"y":15,"roomName":"W17S15"},
//         {"x":15,"y":15,"roomName":"W17S15"},
//         {"x":16,"y":15,"roomName":"W17S15"},
//         {"x":17,"y":15,"roomName":"W17S15"},
//         {"x":18,"y":15,"roomName":"W17S15"},
//         {"x":19,"y":15,"roomName":"W17S15"},
//         {"x":20,"y":15,"roomName":"W17S15"},
//         {"x":21,"y":15,"roomName":"W17S15"},
//         {"x":22,"y":15,"roomName":"W17S15"},
//         {"x":23,"y":15,"roomName":"W17S15"},
//         {"x":24,"y":15,"roomName":"W17S15"},
//         {"x":25,"y":15,"roomName":"W17S15"},
//         {"x":26,"y":15,"roomName":"W17S15"},
//         {"x":27,"y":16,"roomName":"W17S15"},
//         {"x":28,"y":17,"roomName":"W17S15"},
//         {"x":29,"y":18,"roomName":"W17S15"},
//         {"x":30,"y":19,"roomName":"W17S15"},
//         {"x":31,"y":20,"roomName":"W17S15"},
//         {"x":32,"y":19,"roomName":"W17S15"},
//         {"x":33,"y":18,"roomName":"W17S15"},
//         {"x":33,"y":17,"roomName":"W17S15"},
//         {"x":32,"y":16,"roomName":"W17S15"}
//     ],
//     "ops":1388,
//     "cost":118,
//     "incomplete":false，
// }

// auto new room operation