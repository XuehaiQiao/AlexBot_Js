let creepLogic = require('./creeps');
let roomLogic = require('./room');
let tools = require('./tools');
require('./prototypes');

global.roomInfo = require('./globalObjects').roomObject;

module.exports.loop = function () {
    //Memory.outSourceRooms['W16S13'] = {base: 'W15S13', sourceNum: 2};
    if (Game.cpu.bucket < 20) {
        console.log('CPU bucket is low, skip this tick..');
        return;
    }

    console.log("---------- Start Tick: " + Game.time + " ----------");

    // free up memory if creep no longer exists
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // make a list of all of our rooms
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    let totalRoomCpu = -Game.cpu.getUsed();

    // creep census
    roomLogic.roomCensus();

    // run room logic for each room in our empire
    _.forEach(Game.myRooms, r => {
        roomLogic.spawning(r);
        roomLogic.repairing(r);
        roomLogic.defending(r);
        roomLogic.healing(r);
        roomLogic.linkTransfer(r);
        roomLogic.labReaction(r);

        if(r.controller.level == 8) {
            let pSpawns = r.find(FIND_MY_STRUCTURES, {filter: struct => (
                struct.structureType == STRUCTURE_POWER_SPAWN && 
                struct.store[RESOURCE_ENERGY] >= 50 &&
                struct.store[RESOURCE_POWER] > 0
            )});

            if(pSpawns.length > 0) {
                pSpawns[0].processPower();
            }
        }
    });

    roomLogic.resourceBalancing(Game.myRooms);

    totalRoomCpu += Game.cpu.getUsed();
    console.log('total room cpu: ', totalRoomCpu);


    //if(true) return;

    //tools.roomPlanner('sim', { render: true });
    
    
    // Memory.statistics.totalCreepCpu = Memory.statistics.totalCreepCpu / 100 * 99 -  Game.cpu.getUsed() / 100;

    // for (const role in creepLogic) {
    //     if(Memory.statistics[role] == undefined) Memory.statistics[role] = 0
    //     Memory.statistics[role] = Memory.statistics[role] / 100 * 99;
    // }
    // Memory.statistics.totalCreepCpu
    // run each creep role see /creeps/index.js
    let totalCreepCpu = -Game.cpu.getUsed();
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        let role = creep.memory.role;
        
        //Memory.statistics[role] -= Game.cpu.getUsed() / 100;
        if (creepLogic[role]) creepLogic[role].run(creep);
        //Memory.statistics[role] += Game.cpu.getUsed() / 100;
    }

    totalCreepCpu += Game.cpu.getUsed();
    console.log('total creep cpu: ', totalCreepCpu);

    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }

    roomLogic.exportStats();
    
    // if(!Memory.statistics) Memory.statistics = {};
    // if(!Memory.statistics.cpu) Memory.statistics.cpu = 20;
    // Memory.statistics.cpu = Memory.statistics.cpu + Game.cpu.getUsed() / 1500 - Memory.statistics.cpu / 1500;
    console.log('CPU bucket: ', Game.cpu.bucket);
    // console.log('Average CPU usage: ', Math.round(Memory.statistics.cpu * 1000) / 1000);
    console.log("---------- End Tick, No Errors ----------");
}