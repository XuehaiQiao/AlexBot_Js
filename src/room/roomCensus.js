
function roomCensus() {
    // let stat = {};
    // _.forEach(room.find(FIND_MY_CREEPS), creep => {
    //     if(stat[creep.memory.role] == undefined) stat[creep.memory.role] = 1;
    //     else stat[creep.memory.role] += 1;
    // })

    // console.log(room.name + " CREEPS: "  + JSON.stringify(stat));
    // return stat;

    // reset the global object
    global.roomCensus = {}
    
    // roles that needs to split based on targetRooms
    let targetRoomRoles = new Set(['outSourcer', 'claimer', 'defender']);
    // census
    _.forEach(Game.creeps, creep => {
        // don't count dying creeps
        if(creep.body.length * 3 > creep.ticksToLive) return;

        // if creep has targetRoom, count into the targetRoom creeps
        if(creep.memory.targetRoom) {
            if(global.roomCensus[creep.memory.targetRoom] == undefined) {
                global.roomCensus[creep.memory.targetRoom] = {}
            }
            if (global.roomCensus[creep.memory.targetRoom][creep.memory.role] == undefined) {
                global.roomCensus[creep.memory.targetRoom][creep.memory.role] = 1;
            }
            else {
                global.roomCensus[creep.memory.targetRoom][creep.memory.role] += 1;
            }
        }
        else if(creep.memory.base) {
            if(global.roomCensus[creep.memory.base] == undefined) {
                global.roomCensus[creep.memory.base] = {}
            }
            if (global.roomCensus[creep.memory.base][creep.memory.role] == undefined) {
                global.roomCensus[creep.memory.base][creep.memory.role] = 1;
            }
            else {
                global.roomCensus[creep.memory.base][creep.memory.role] += 1;
            }
        }
    })

    // print out creep for each room
    _.forEach(_.keys(global.roomCensus), roomName => {
        console.log(roomName, JSON.stringify(global.roomCensus[roomName]));
    })
}

module.exports = roomCensus;