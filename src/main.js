const creepLogic = require('./creeps');
const roomLogic = require('./room');
const test = require('./test');
const tools = require('./tools');

const util = require('./util');
// const runPowerCreep = require('./powerCreep/runPowerCreep');
require('./prototypes');

module.exports.loop = function () {
    if(Game.shard.name === 'shard2') {
        if (Game.cpu.bucket === 10000) {
            Game.cpu.generatePixel();
        }

        return;
    }
    
    console.log("---------- " + Game.shard.name + ", Start Tick: " + Game.time + " ----------");

    if (Game.cpu.bucket < 20) {
        console.log('CPU bucket is low, skip this tick..');
        return;
    }

    test.sandbox.startOfTheTick();

    /**
     * ====================================
     *       MEMORY FREE, INIT
     * ====================================
     */

    
    // free up memory if creep no longer exists
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    /**
     * ====================================
     *            ROOM LOGICS
     * ====================================
     */
    // make a list of all of our rooms
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    let totalRoomCpu = -Game.cpu.getUsed();
    // creep census
    roomLogic.roomCensus();
    // run room logic for each room in our empire
    _.forEach(Game.myRooms, r => {
        roomLogic.activeSafeMode(r);
        roomLogic.roomInit(r);
        roomLogic.spawning(r);
        roomLogic.towerLogic(r);
        roomLogic.linkTransfer(r);
        roomLogic.labReaction(r);
        roomLogic.powerOperation(r);
        roomLogic.factorayLogic(r);
        // tools.myRoomPlanner(r.name, { render: true });

    });
    roomLogic.resourceBalancing(Game.myRooms);
    roomLogic.marketLogic();
    totalRoomCpu += Game.cpu.getUsed();

    
    
    /**
     * =====================================
     *            CREEP LOGICS
     * =====================================
     */

    // run each creep role in ./creeps
    let totalCreepCpu = -Game.cpu.getUsed();
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        let role = creep.memory.role;
        
        //Memory.statistics[role] -= Game.cpu.getUsed() / 100;
        if (creepLogic[role]) creepLogic[role].run(creep);
        //Memory.statistics[role] += Game.cpu.getUsed() / 100;
    }

    totalCreepCpu += Game.cpu.getUsed();


    /**
     * =====================================
     *        POWER CREEP LOGICS
     * =====================================
     */

    // for(var name in Game.powerCreeps) {
    //     // if(name !== 'p1') continue;
    //     var pc = Game.powerCreeps[name];
    //     runPowerCreep(pc);
    // }


    // if (Game.shard.name === 'shard2' && Game.cpu.bucket === 10000) {
    //     Game.cpu.generatePixel();
    // }

    /**
     * ====================================
     *               LOGS
     * ====================================
     */

    // Grafana data log
    roomLogic.exportStats();
    
    console.log('total room cpu: ', totalRoomCpu);
    console.log('total creep cpu: ', totalCreepCpu);
    console.log('CPU bucket: ', Game.cpu.bucket);

    test.sandbox.endOfTheTick();

    console.log("---------- End Tick, No Errors ----------");
}