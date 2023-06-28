const { roomUtil } = require("../util");

module.exports = {
    init: function (room) {
        room.memory.thoriumDetection = {
            observedRooms: {
                ultra: [],
                high: [],
            },
            closeRooms: roomUtil.getRoomsInRange(room.name, 5),
            lastObIndex: -1,
        }
    },

    run: function (room) {
        if (!room || room.level < 8) return;

        const observer = room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_OBSERVER })[0];
        if (!observer) return;
        const detectMemory = room.memory.thoriumDetection;
        if (!detectMemory) {
            this.init(room);
            return;
        }



        if (detectMemory.lastObIndex >= detectMemory.closeRooms.length) {
            if(Game.time % 10000 === 1234) {
                this.init(room);
            }
            return;
        }

        //detect last room
        if (detectMemory.closeRooms[detectMemory.lastObIndex]) {
            const obRoom = Game.rooms[detectMemory.closeRooms[detectMemory.lastObIndex]];
            if (!obRoom) detectMemory.lastObIndex -= 1;
            else {
                console.log('detect room:', obRoom.name);

                let thorium = obRoom.find(FIND_MINERALS, { filter: mine => mine.mineralType === RESOURCE_THORIUM })[0];
                if (thorium) {
                    if (thorium.mineralAmount > 60000) {
                        detectMemory.observedRooms.ultra.push(obRoom.name);
                    }
                    else if (thorium.mineralAmount > 40000) {
                        detectMemory.observedRooms.high.push(obRoom.name);
                    }
                }
            }
        }

        //ob next room
        if (detectMemory.closeRooms[detectMemory.lastObIndex + 1]) {
            let result = observer.observeRoom(detectMemory.closeRooms[detectMemory.lastObIndex + 1]);

            if (result != OK) {
                console.log('err in observe room:', detectMemory.closeRooms[detectMemory.lastObIndex + 1]);
            }
        }

        detectMemory.lastObIndex += 1;
    }
}