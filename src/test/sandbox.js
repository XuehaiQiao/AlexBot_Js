const tools = require("../tools");
const { roomUtil } = require("../util");

const sandbox = {
    startOfTheTick: function() {
        // Your experimenting code here

        // fast controller 6 to 7:

        // senders
        let room1 = Game.rooms.E16S2;
        let room2 = Game.rooms.E6S2;

        // receivers
        let room3 = Game.rooms.E17N2;

        if(
            room1 && room1.storage && room1.terminal &&
            room2 && room2.storage && room2.terminal &&
            room3 && room3.storage && room3.terminal
            ) {
            if(room1.storage.store[RESOURCE_ENERGY] > 190000 && room1.controller.ticksToDowngrade > 50000) {
                if(room3.storage.store[RESOURCE_ENERGY] < 320000 && room3.controller.level < 7) {
                    room1.terminal.send(RESOURCE_ENERGY, 20000, room3.name, 'energy');
                }
            }
            if(room2.storage.store[RESOURCE_ENERGY] > 190000 && room2.controller.ticksToDowngrade > 50000) {
                if(room3.storage.store[RESOURCE_ENERGY] < 320000 && room3.controller.level < 7) {
                    room2.terminal.send(RESOURCE_ENERGY, 20000, room3.name, 'energy');
                }
            }
        }

        // tools.visual(Game.rooms['E14N3']);
    },

    endOfTheTick: function() {
        // Your experimenting code here

        // let roomNames = roomUtil.getRoomsInRange('W8N3', 3);
        // console.log(roomNames);
        //console.log(roomUtil.getPosAccessSpace(Game.rooms.W8N3, new RoomPosition(30, 21, 'W8N3')));
        
        // console.log(JSON.stringify(roomUtil.getRoomInfo(Game.rooms.W8N3)));
        
    },
}

module.exports = sandbox;