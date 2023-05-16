module.exports = function() {
    // reset the global object
    global.roomCensus = {};

    // census
    _.forEach(Game.creeps, creep => {
        // don't count dying creeps
        if(creep.body.length * 3 > creep.ticksToLive) return;

        let role = creep.memory.role;
        // if creep has targetRoom, count into the targetRoom creeps
        if(creep.memory.targetRoom) {
            let roomName = creep.memory.targetRoom;
            addInCensusObj(creep, roomName, role);
        }
        else if(creep.memory.base) {
            let roomName = creep.memory.base;
            addInCensusObj(creep, roomName, role);
        }
    })

    // print out creep for each room
    _.forEach(_.keys(global.roomCensus), roomName => {
        console.log(roomName, JSON.stringify(global.roomCensus[roomName]));
    })
}

function addInCensusObj(creep, roomName, role) {
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