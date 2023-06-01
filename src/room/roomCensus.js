const { event } = require("../util");

module.exports = function() {
    // reset the global object
    const lastRoomCensus = global.roomCensus;
    global.roomCensus = {};

    // census
    _.forEach(Game.creeps, creep => {
        // don't count dying creeps
        if(creep.ticksToLive < creep.body.length * 3) return;
        if(creep.memory.role === 'keeperAttacker' && creep.ticksToLive < creep.body.length * 3 + 50) return;

        let role = creep.memory.role;
        // if creep has targetRoom, count into the targetRoom creeps
        if(creep.memory.targetRoom) {
            let roomName = creep.memory.targetRoom;
            addInCensusObj(roomName, role);
        }
        else if(creep.memory.base) {
            let roomName = creep.memory.base;
            addInCensusObj(roomName, role);
        }
    });

    for (const roomName in lastRoomCensus) {
        let isSame = _.isEqual(lastRoomCensus[roomName], global.roomCensus[roomName]);
        if(!isSame) {
            console.log(roomName + ' creep changed');
            event.roomCreepDying(roomName);
        }
    }

    // print out creep for each room
    _.forEach(_.keys(global.roomCensus), roomName => {
        console.log(roomName, JSON.stringify(global.roomCensus[roomName]));
    })
}

function addInCensusObj(roomName, role) {
    if(global.roomCensus[roomName] == undefined) {
        global.roomCensus[roomName] = {};
    }
    if (global.roomCensus[roomName][role] == undefined) {
        global.roomCensus[roomName][role] = 1;
    }
    else {
        global.roomCensus[roomName][role] += 1;
    }
}