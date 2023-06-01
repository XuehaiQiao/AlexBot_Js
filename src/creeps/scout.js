module.exports = {
    properties: {
        role: "scout"
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        // directly move to pos if have one.
        if (creep.memory.targetPos) {
            let targetPos = creep.memory.targetPos;
            creep.moveTo(new RoomPosition(targetPos.x, targetPos.y, targetPos.roomName), { reusePath: 50 });
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
        if (creep.moveToRoomAdv(targetRoomName)) {
            return;
        }

        if (creep.memory.target) {
            let target = Game.getObjectById(creep.memory.target);
            if (target) creep.moveTo(creep.memory.target, { reusePath: 50 });

            return;
        }
    },

    explorerLogic: function (creep) {
        let targetRoomName;
        if (creep.memory.targetRooms && creep.memory.targetRooms.length) {
            targetRoomName = creep.memory.targetRooms[0];
        }
        else creep.suicide();

        if (creep.moveToRoomAdv(targetRoomName)) {
            return;
        }



        const newRoomInfo = roomUtil.getRoomInfo(creep.room);
        if (!creep.room.memory.roomInfo) {
            creep.room.memory.roomInfo = newRoomInfo;
        }

        if (!creep.room.find(FIND_HOSTILE_STRUCTURES).length) {
            if (!Memory.outSourceRooms[creep.room.name]) {
                Memory.outSourceRooms[creep.room.name] = { sourceNum: newRoomInfo.sourceInfo.length };
            }
        }

        // remove current room after searched logic
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
        let body = [WORK, CARRY, MOVE];
        let memory = { role: this.properties.role, status: 0, base: room.name, targetRoom: targetRoomName };

        return { name, body, memory };
    },
};