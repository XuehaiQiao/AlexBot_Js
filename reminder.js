// E13N8

const { UH2O } = require("./src/config/labProductConfig");

// claimer spawn
Game.spawns['Spawn1_W18S15'].spawnCreep([...new Array(6).fill(CLAIM), ...new Array(6).fill(MOVE)], 'Claimer' + Game.time, { memory: { role: 'claimer', status: 1, targetRoom: 'E14N3', claim: true } });

// harvester2
Game.spawns['Spawn1_W18S15'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'harvester2' + Game.time, {memory: {role: 'harvester2', target: 0, targetRoom: 'W17S14'}});

//builder2
Game.rooms['W17S14'].memory.tasks.spawnTasks.push({
    name: 'builder2',
    body: [...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)],
    memory: {role: 'builder2', status: 0, base: 'W17S14'}
});
// harvester2
Game.spawns['Spawn1_W18S15'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'harvester2' + Game.time, { memory: { role: 'harvester2', target: 0, targetRoom: 'W17S14' } });
Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'hav',
    body: [...new Array(6).fill(WORK), ...new Array(6).fill(MOVE)],
    memory: { role: 'harvester2', status: 0, targetRoom: 'E18S5' }
});
//builder2
Game.rooms['E9S2'].memory.tasks.spawnTasks.push({
    name: 'builder',
    body: [...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)],
    memory: { role: 'builder', status: 0, targetRoom: 'E7N1' }
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
Game.rooms['E6S2'].memory.tasks.spawnTasks.push({ 
    name: 't', 
    body: [...new Array(25).fill(CARRY), ...new Array(25).fill(MOVE)], 
    memory: { role: 'transporter', targetRoom: 'E7N1' } 
});
// defender
Game.rooms['E11S2'].memory.tasks.spawnTasks.push({
    name: 'rDf',
    body: [...new Array(25).fill(ATTACK), ...new Array(25).fill(MOVE)],
    memory: { 
        role: 'defender',
        targetRoom: 'E11S2',
        boost: true,
        boostInfo: {XUH2O: 25}
    }
});
Game.rooms['E11N4'].memory.tasks.spawnTasks.push({
    name: 'bM',
    body: [...new Array(2).fill(MOVE), ...new Array(2).fill(ATTACK)],
    memory: { role: 'baseMelee' }
});

// scout
Game.rooms['E6S2'].memory.tasks.spawnTasks.push({ name: 'scout', body: [MOVE], memory: { role: 'scout', targetRoom: 'E7N2' } });
// keeperAttacker
Game.spawns['Spawn3_W16S17'].spawnCreep([...new Array(25).fill(MOVE), ...new Array(19).fill(RANGED_ATTACK), ...new Array(6).fill(HEAL)], 'keeperAttacker' + Game.time, { memory: { role: 'keeperAttacker', base: 'W16S17', targetRoom: 'W16S16' } });

// rangeAtker
Game.rooms['W12S21'].memory.tasks.spawnTasks.push({
    name:'rangeAtker', 
    body:[...new Array(5).fill(TOUGH), ...new Array(25).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(10).fill(HEAL)], 
    memory: {
        role: 'rangeAtker', 
        base: 'W12S21', 
        targetRoom: 'W11S19', 
        boost: true, 
        boosted: false, 
        boostInfo: {XLHO2: 10, XGHO2: 5, XKHO2: 10}}
});

// rangeAtker boosted/unboosted
Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(1).fill(TOUGH), ...new Array(18).fill(MOVE), ...new Array(5).fill(RANGED_ATTACK), ...new Array(2).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        base: 'E16S2',
        targetRoom: 'E18S1',
        boost: true,
        boosted: false,
        boostInfo: { XLHO2: 2, XGHO2: 1, XKHO2: 5 }
    }
});

Game.rooms['E6S2'].memory.tasks.spawnTasks.push({
    name: 'rangeAtker',
    body: [...new Array(10).fill(RANGED_ATTACK), ...new Array(15).fill(MOVE), ...new Array(5).fill(HEAL)],
    memory: {
        role: 'rangeAtker',
        targetRoom: 'E7N1',
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
Game.rooms['W16S17'].memory.tasks.spawnTasks.push({
    name:'wrecker', 
    body:[...new Array(10).fill(WORK), ...new Array(10).fill(MOVE)], 
    memory: {
        role: 'wrecker', 
        base: 'W16S17', 
        targetRoom: 'W16S16',
        targetId: '646e7411c38c3d169550b5a6'
    }
});

Game.spawns['Spawn'].spawnCreep([...new Array(5).fill(WORK), ...new Array(5).fill(MOVE)], 'wrecker' + Game.time, { memory: { role: 'wrecker', targetRoom: 'W17S14' } });

Game.rooms['E9S2'].memory.tasks.spawnTasks.push({
    name: 'wrecker',
    body: [...new Array(10).fill(WORK), ...new Array(10).fill(MOVE)],
    memory: {
        role: 'wrecker',
        targetRoom: 'E8S8',
        wall: true,
    }
});
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
Game.rooms['W18S15'].memory.tasks.managerTasks.push({from: STRUCTURE_FACTORY, to: STRUCTURE_STORAGE, resourceType: 'X', volume: 40000});
Game.rooms['W18S15'].memory.tasks.managerTasks.push({from: STRUCTURE_STORAGE, to: STRUCTURE_TERMINAL, resourceType: 'UO', volume: 3000});
Game.rooms['W18S15'].memory.tasks.managerTasks.push({from: STRUCTURE_TERMINAL, to: STRUCTURE_FACTORY, resourceType: RESOURCE_PURIFIER, volume: 8000});
Game.rooms['W18S15'].memory.tasks.managerTasks.push({from: STRUCTURE_STORAGE, to: STRUCTURE_NUKER, resourceType: RESOURCE_ENERGY, volume: 100000});
// create reaction task
Game.rooms.W19S17.memory.tasks.labTasks.push({ resourceType: 'OH', amount: 3000 });


// orders
Game.rooms['W13S15'].terminal.send('X', 2000, 'W16S17', 'X');
Game.rooms['W18S15'].terminal.send(RESOURCE_ENERGY, 45000, 'W17S14', 'energy');
Game.rooms['E6S2'].terminal.send(RESOURCE_ENERGY, 30000, 'E2N6', 'From a remote friend');
Game.rooms['E17N2'].terminal.send('XLHO2', 4000, 'E9S2', 'support');

Game.market.deal('645bfc8403ae10376b827734', 4000, "W21S19");
// purifier
Game.market.deal('649fab116ee77a6e75c40c5f', 25000, 'W18S15');

Game.market.cancelOrder('644046f346d8195c5404a845');

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: RESOURCE_ENERGY,
    price: 27.3,
    totalAmount: 40000,
    roomName: "W18S15"   
});


Game.rooms['E16S2'].memory.tasks.powerTasks.push({
    roomName: 'E17S0',
    status: 1, 
    space: 3, 
    decayTime: Game.time + 4800,
    amount: 7241,
});

Game.rooms.E6S2.memory.powerRooms.rooms = [
    'E3S0',
    'E4S0',
    'E5S0',
    'E6S0',
    'E7S0',
    'E8S0',
    'E9S0',
]

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

// lunch nuker
Game.getObjectById('644cc72b152e5b2407bfc7eb').launchNuke(new RoomPosition(21, 8, 'W12S19'));

// small
Game.rooms['W12S21'].memory.tasks.spawnTasks.push({
    name:'ret-m-', 
    body:[...new Array(5).fill(TOUGH), ...new Array(25).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(10).fill(HEAL)], 
    memory: {
        role: 'rangeAtker', 
        base: 'W12S21', 
        targetRoom: 'W11S19',
        boost: true,
        boosted: false,
        boostInfo: {XLHO2: 10, XGHO2: 5, XKHO2: 10}
    }
});

Game.rooms['W13S15'].memory.tasks.spawnTasks.push({
    name:'ret-s-', 
    body:[...new Array(2).fill(TOUGH), ...new Array(16).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(4).fill(HEAL)], 
    memory: {
        role: 'rangeAtker', 
        base: 'W13S15', 
        targetRoom: 'W11S14',
        boost: true,
        boosted: false,
        boostInfo: {XLHO2: 4, XGHO2: 2, XKHO2: 10}
    }
});

PathFinder.search(Game.rooms.E17N2.storage.pos, {pos: Game.rooms.E16N2.find.pos, range: 3}).path.length;
PathFinder.search(Game.rooms.E21N8.storage.pos, {pos: Game.rooms.E21N9.controller.pos, range: 3}).path.length;
PathFinder.search(Game.rooms.E11S2.storage.pos, {pos: Game.getObjectById('646f560c9bdd4e0008301e40').pos, range: 1}).path.length;
// start tick 717500

PathFinder.search(new RoomPosition(22, 26, 'E17N2'), {pos: new RoomPosition(31, 22, 'E28S3'), range: 1}, {maxOps: 10000}).path.length;
PathFinder.search(new RoomPosition(22, 26, 'E17N2'), {pos: new RoomPosition(5, 19, 'E19S0'), range: 1}, {maxOps: 100000, swampCost: 1, plainCost: 1}).incomplete

