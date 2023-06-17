const { KEEPER } = require("../constants/roomTypes");
const { roomUtil, inRoomUtil } = require("../util");

module.exports = {
    properties: {
        role: "scout"
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        // record roomMatrix
        let ifRepath;
        if(!creep.room.memory.skMatrix && roomUtil.getRoomType(creep.room.name) === KEEPER) {
            
            inRoomUtil.getSKMatrix(creep.room.name);
            ifRepath = 1;
        }

        // directly move to pos if have one.
        if (creep.memory.targetPos) {
            let targetPos = creep.memory.targetPos;
            creep.travelTo(new RoomPosition(targetPos.x, targetPos.y, targetPos.roomName), { 
                allowSK: true, 
                roomCallback: (roomName, costMatrix) => inRoomUtil.getSKMatrix(roomName),
                repath: ifRepath,
            });
            return;
        }

        // explorer
        if (creep.memory.explorer) {
            this.explorerLogic(creep);
            return;
        }

        // move to targetRoom
        let targetRoomName = creep.memory.targetRoom
        // move to target room if not in
        if (targetRoomName && creep.room.name !== targetRoomName) {
            creep.travelTo(new RoomPosition(25, 25, targetRoomName), { 
                allowSK: true, 
                roomCallback: (roomName, costMatrix) => inRoomUtil.getSKMatrix(roomName),
                repath: ifRepath,
            });
            return
        }

        if (creep.memory.target) {
            let target = Game.getObjectById(creep.memory.target);
            if (target) creep.moveTo(creep.memory.target, { reusePath: 50 });

            return;
        }

        if(targetRoomName) {
            creep.travelTo(new RoomPosition(25, 25, targetRoomName), { 
                allowSK: true, 
                roomCallback: (roomName, costMatrix) => inRoomUtil.getSKMatrix(roomName),
                repath: ifRepath,
                range: 15,
            });
            return;
        }

    },

    explorerLogic: function (creep) {
        let targetRoomName;
        if (creep.memory.targetRooms && creep.memory.targetRooms.length) {
            targetRoomName = creep.memory.targetRooms[0];
        }
        else creep.suicide();

        if (creep.moveToRoomAdv(targetRoomName)) return;

        const newRoomInfo = roomUtil.getRoomInfo(creep.room);
        if (!creep.room.memory.roomInfo) {
            creep.room.memory.roomInfo = newRoomInfo;
        }

        if (!creep.room.find(FIND_HOSTILE_STRUCTURES).length) {
            if (!Memory.outSourceRooms[creep.room.name]) {
                Memory.outSourceRooms[creep.room.name] = { sourceNum: newRoomInfo.sourceInfo.length };
            }
        }

        creep.memory.targetRooms.shift();
    },

    // checks if the room needs to spawn a creep
    spawn: function (room) {
        var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.room.name == room.name);
        console.log(this.properties.role + ': ' + thisTypeCreeps.length, room.name);

        // level 2
        if (thisTypeCreeps.length < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = [MOVE];
        let memory = { role: this.properties.role, base: room.name, targetRoom: targetRoomName };

        return { name, body, memory };
    },
};