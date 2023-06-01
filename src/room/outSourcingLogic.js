const { roomInfo } = require("../config");
const util = require("../util")

module.exports = function(room) {
    if(Game.time % 100 !== 10) return;
    if(!roomInfo[room.name]) return;

    let storagePos = roomInfo[room.name].storagePos;
    if(!storagePos) storagePos = roomInfo[room.name].managerPos;
    if(!storagePos) return;

    const nearRoomNames = roomUtil.getRoomsInRange(room.name, 3);

    // for(const roomName of nearRoomNames) {
    //     if(Memory.rooms[roomName] && Memory.rooms[roomName].roomInfo) {
    //         room.memory.outSourceRooms
    //     }
    //     else {

    //     }
    // }
}