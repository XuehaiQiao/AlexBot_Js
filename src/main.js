let creepLogic = require('./creeps');
let roomLogic = require('./room');
require('./prototypes');

global.roomInfo = require('./globalObjects').roomObject;

module.exports.loop = function () {
    //Memory.outSourceRooms['W16S13'] = {base: 'W15S13', sourceNum: 2};
    if (Game.cpu.bucket < 20) {
        console.log('CPU bucket is low, skip this tick..');
        return;
    }
    console.log("---------- Start Tick: " + Game.time + " ----------")
    // make a list of all of our rooms
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    
    // creep census
    roomLogic.roomCensus();

    // run room logic for each room in our empire
    _.forEach(Game.myRooms, r => {
        roomLogic.spawning(r);
        roomLogic.repairing(r);
        roomLogic.defending(r);
        roomLogic.healing(r);
        roomLogic.linkTransfer(r);

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
    
    // run each creep role see /creeps/index.js
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
    }

    // free up memory if creep no longer exists
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    
    if(!Memory.statistics) Memory.statistics = {};
    if(!Memory.statistics.cpu) Memory.statistics.cpu = 20;
    Memory.statistics.cpu = Memory.statistics.cpu + Game.cpu.getUsed() / 1500 - Memory.statistics.cpu / 1500;
    console.log('CPU bucket: ', Game.cpu.bucket);
    console.log('Average CPU usage: ', Math.round(Memory.statistics.cpu * 1000) / 1000);
    console.log("---------- End Tick, No Errors ----------");
}