// W11S27 X
// W14S29 O
// W21S24 O
// W23S24 O
// W5S18 X 111
// W6S18 L
// W9S19 O 111

// claimer spawn
Game.spawns['Spawn1_W18S15'].spawnCreep([MOVE, CLAIM], 'Claimer' + Game.time, {memory: {role: 'claimer', status: 1, targetRoom: 'W17S14', claim: true}});

// harvester2
Game.spawns['Spawn1_W18S15'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'harvester2' + Game.time, {memory: {role: 'harvester2', target: 0, targetRoom: 'W17S14'}});

//builder2
Game.rooms['W17S14'].memory.tasks.spawnTasks.push({
    name: 'builder2',
    body: [...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)],
    memory: {role: 'builder2', status: 0, base: 'W17S14'}
});
Game.spawns['Spawn1_W18S15'].spawnCreep([...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], 'builder2' + Game.time, {memory: {role: 'builder2', status: 0, targetRoom: 'W17S14'}});

// upgrader2
Game.spawns['Spawn1_W18S15'].spawnCreep([...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], 'upgrader2' + Game.time, {memory: {role: 'upgrader2', status: 0, targetRoom: 'W17S14'}});

// carrier spawn
Game.spawns['Spawn2_W18S15'].spawnCreep([...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], 'carrier2' + Game.time, {memory: {role: 'carrier2', targetRoom: 'W17S14', status: 0}});

// transporter spawn
Game.spawns['Spawn2_W18S15'].spawnCreep([...new Array(25).fill(CARRY), ...new Array(25).fill(MOVE)], 'transporter' + Game.time, {memory: {role: 'transporter', base: 'W17S14', targetRoom: 'W18S15'}});
Game.spawns['Spawn2_W21S19'].spawnCreep([...new Array(25).fill(CARRY), ...new Array(25).fill(MOVE)], 'transporter' + Game.time, {memory: {role: 'transporter', base: 'W21S19', targetRoom: 'W20S21', workType: 1}});
Game.rooms['W16S17'].memory.tasks.spawnTasks.push({name: 't', body:[...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], memory: {role: 'transporter', base: 'W16S17', targetRoom: 'W16S16', workType: 2}});
// defender
Game.spawns['Spawn2_W18S15'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], 'defender' + Game.time, {memory: {role: 'defender', targetRoom: 'W17S14'}});

// scout
Game.rooms['W12S21'].memory.tasks.spawnTasks.push({name: 'scout', body: [MOVE], memory: {role: 'scout', targetPos: {x:42, y:35, roomName:'W10S20'}}});
// keeperAttacker
Game.spawns['Spawn3_W16S17'].spawnCreep([...new Array(25).fill(MOVE), ...new Array(19).fill(RANGED_ATTACK), ...new Array(6).fill(HEAL)], 'keeperAttacker' + Game.time, {memory: {role: 'keeperAttacker', base: 'W16S17', targetRoom: 'W16S16'}});

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

// invaderAtker
Game.rooms['W16S17'].memory.tasks.spawnTasks.push({
    name:'invaderAttacker' + Game.time, 
    body:[...new Array(2).fill(TOUGH), ...new Array(16).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(4).fill(HEAL)], 
    memory: {
        role: 'invaderAttacker', 
        base: 'W16S17', 
        targetRoom: 'W16S16',
        boost: true,
        boosted: false,
        boostInfo: {XLHO2: 4, XGHO2: 2, XKHO2: 10}
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


_.forEach(_.filter(Game.rooms['W18S15'].find(FIND_STRUCTURES), structure => structure.structureType == STRUCTURE_TOWER), function(object) {
    object.destroy();
});

// if no tasks
if (roomInfo[creep.room.name]) {
    creep.moveTo(roomInfo[creep.room.name].restPos);
    return;
}

// destroy all the walls
let wallList = Game.rooms.W22S15.find(FIND_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_WALL});
for(let i in wallList) {
    wallList[i].destroy();
}

// wrecker spawn
Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE], 'wrecker' + Game.time, {memory: {role: 'wrecker', targetRoom: 'W17S14'}});
// scout spawn
Game.spawns['Spawn1_W21S19'].spawnCreep([MOVE], 'scout' + Game.time, {memory: {role: 'scout', targetRoom: 'W22S18'}});


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
Game.rooms.W19S17.memory.tasks.labTasks.push({resourceType: 'OH', amount: 3000});


// orders
Game.rooms['W13S15'].terminal.send('X', 2000, 'W16S17', 'X');
Game.rooms['W18S15'].terminal.send(RESOURCE_ENERGY, 45000, 'W17S14', 'energy');

Game.market.deal('645bfc8403ae10376b827734', 4000, "W21S19");
// purifier
Game.market.deal('6465dacf03ae1047f9c239df', 10000, 'W18S15');

Game.market.cancelOrder('644046f346d8195c5404a845');

Game.market.createOrder({
    type: ORDER_BUY,
    resourceType: RESOURCE_ENERGY,
    price: 27.3,
    totalAmount: 40000,
    roomName: "W18S15"   
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

// seasonal
// {
//     "name": "E16S2",
//     "shard": "shardSeason",
//     "rcl": 8,
//     "buildings": {
//       "road": [
//         {"x":25,"y":30},
//         {"x":24,"y":31},
//         {"x":23,"y":32},
//         {"x":22,"y":33},
//         {"x":23,"y":34},
//         {"x":24,"y":35},
//         {"x":25,"y":36},
//         {"x":26,"y":35},
//         {"x":27,"y":34},
//         {"x":28,"y":33},
//         {"x":27,"y":32},
//         {"x":26,"y":31},
//         {"x":25,"y":32},
//         {"x":25,"y":34},
//         {"x":24,"y":29},
//         {"x":23,"y":28},
//         {"x":22,"y":29},
//         {"x":21,"y":30},
//         {"x":22,"y":31},
//         {"x":14,"y":30},
//         {"x":15,"y":30},
//         {"x":17,"y":30},
//         {"x":29,"y":34},
//         {"x":30,"y":35},
//         {"x":31,"y":36},
//         {"x":32,"y":37},
//         {"x":34,"y":38},
//         {"x":33,"y":38},
//         {"x":35,"y":38},
//         {"x":36,"y":38},
//         {"x":37,"y":38},
//         {"x":38,"y":39},
//         {"x":39,"y":40},
//         {"x":34,"y":17},
//         {"x":33,"y":18},
//         {"x":32,"y":19},
//         {"x":31,"y":20},
//         {"x":30,"y":21},
//         {"x":29,"y":22},
//         {"x":28,"y":23},
//         {"x":27,"y":24},
//         {"x":26,"y":25},
//         {"x":25,"y":26},
//         {"x":24,"y":27},
//         {"x":19,"y":32},
//         {"x":20,"y":33},
//         {"x":21,"y":34},
//         {"x":20,"y":31},
//         {"x":23,"y":36},
//         {"x":22,"y":37},
//         {"x":23,"y":38},
//         {"x":24,"y":39},
//         {"x":25,"y":38},
//         {"x":25,"y":37},
//         {"x":28,"y":31},
//         {"x":29,"y":30},
//         {"x":30,"y":31},
//         {"x":31,"y":32},
//         {"x":30,"y":33},
//         {"x":22,"y":27},
//         {"x":21,"y":26},
//         {"x":20,"y":27},
//         {"x":19,"y":28},
//         {"x":20,"y":29},
//         {"x":18,"y":31},
//         {"x":18,"y":29},
//         {"x":16,"y":29},
//         {"x":15,"y":28},
//         {"x":16,"y":27},
//         {"x":17,"y":26},
//         {"x":18,"y":27},
//         {"x":18,"y":25},
//         {"x":19,"y":24},
//         {"x":20,"y":25},
//         {"x":27,"y":31},
//         {"x":25,"y":29},
//         {"x":27,"y":42},
//         {"x":21,"y":38},
//         {"x":20,"y":39},
//         {"x":21,"y":40},
//         {"x":22,"y":41},
//         {"x":23,"y":40}
//       ],
//       "lab": [
//         {"x":20,"y":32},
//         {"x":19,"y":33},
//         {"x":19,"y":34},
//         {"x":20,"y":34},
//         {"x":21,"y":33},
//         {"x":21,"y":32},
//         {"x":20,"y":35},
//         {"x":21,"y":35},
//         {"x":22,"y":35},
//         {"x":22,"y":34}
//       ],
//       "spawn": [
//         {"x":23,"y":30},
//         {"x":23,"y":31},
//         {"x":24,"y":30}
//       ],
//       "extension": [
//         {"x":21,"y":29},
//         {"x":21,"y":28},
//         {"x":21,"y":27},
//         {"x":22,"y":28},
//         {"x":20,"y":28},
//         {"x":19,"y":27},
//         {"x":19,"y":26},
//         {"x":19,"y":25},
//         {"x":20,"y":26},
//         {"x":18,"y":26},
//         {"x":17,"y":27},
//         {"x":17,"y":28},
//         {"x":17,"y":29},
//         {"x":18,"y":28},
//         {"x":16,"y":28},
//         {"x":18,"y":30},
//         {"x":19,"y":30},
//         {"x":19,"y":29},
//         {"x":20,"y":30},
//         {"x":19,"y":31},
//         {"x":24,"y":28},
//         {"x":25,"y":28},
//         {"x":29,"y":31},
//         {"x":30,"y":32},
//         {"x":29,"y":32},
//         {"x":29,"y":33},
//         {"x":28,"y":32},
//         {"x":24,"y":36},
//         {"x":23,"y":37},
//         {"x":24,"y":38},
//         {"x":24,"y":37},
//         {"x":26,"y":36},
//         {"x":27,"y":35},
//         {"x":28,"y":34},
//         {"x":28,"y":35},
//         {"x":29,"y":35},
//         {"x":30,"y":34},
//         {"x":31,"y":33},
//         {"x":31,"y":31},
//         {"x":31,"y":30},
//         {"x":30,"y":30},
//         {"x":31,"y":34},
//         {"x":23,"y":35},
//         {"x":22,"y":36},
//         {"x":21,"y":37},
//         {"x":20,"y":38},
//         {"x":20,"y":37},
//         {"x":22,"y":39},
//         {"x":23,"y":39},
//         {"x":22,"y":38},
//         {"x":21,"y":39},
//         {"x":22,"y":40},
//         {"x":25,"y":39},
//         {"x":23,"y":41},
//         {"x":19,"y":39},
//         {"x":19,"y":38},
//         {"x":25,"y":40},
//         {"x":24,"y":40},
//         {"x":24,"y":41},
//         {"x":23,"y":42}
//       ],
//       "link": [
//         {"x":26,"y":32},
//         {"x":35,"y":16},
//         {"x":41,"y":42},
//         {"x":12,"y":30}
//       ],
//       "rampart": [
//         {"x":31,"y":13},
//         {"x":30,"y":13},
//         {"x":29,"y":13},
//         {"x":28,"y":13},
//         {"x":27,"y":13},
//         {"x":27,"y":14},
//         {"x":32,"y":13},
//         {"x":8,"y":30},
//         {"x":8,"y":31},
//         {"x":8,"y":32},
//         {"x":8,"y":33},
//         {"x":8,"y":34},
//         {"x":8,"y":36},
//         {"x":8,"y":35},
//         {"x":8,"y":29}
//       ],
//       "storage": [
//         {"x":26,"y":33}
//       ],
//       "terminal": [
//         {"x":24,"y":33}
//       ],
//       "tower": [
//         {"x":29,"y":16},
//         {"x":31,"y":16},
//         {"x":33,"y":16},
//         {"x":11,"y":30},
//         {"x":11,"y":32},
//         {"x":11,"y":34}
//       ],
//       "nuker": [
//         {"x":24,"y":34}
//       ]
//     }
//   }