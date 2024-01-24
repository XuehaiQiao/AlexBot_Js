const { visual } = require("../tools");
const { roomUtil } = require("../util");
const { getSKMatrix } = require("../util/inRoomUtil");

const sandbox = {
    startOfTheTick: function () {
        // Your experimenting code here

        // //fast controller 6 to 7:
        // if (Game.time % 100 === 27) {
        //     // senders

        //     let room1 = Game.rooms.E17N2;
        //     // receivers
        //     let room2 = Game.rooms.E11S2;
        //     if (
        //         room1 && room1.storage && room1.terminal &&
        //         room2 && room2.storage && room2.terminal
        //     ) {
        //         if (room1.storage.store[RESOURCE_ENERGY] > 210000 && room1.controller.ticksToDowngrade > 50000) {
        //             if (room2.storage.store[RESOURCE_ENERGY] <= 380000 && room2.controller.level < 7) {
        //                 room1.terminal.send(RESOURCE_ENERGY, 20000, room2.name, 'energy');
        //             }
        //         }
        //     }
        // }
    },

    endOfTheTick: function () {
    },
}

module.exports = sandbox;