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
        // Your experimenting code here

        // let roomNames = roomUtil.getRoomsInRange('W8N3', 3);
        // console.log(roomNames);
        //console.log(roomUtil.getPosAccessSpace(Game.rooms.W8N3, new RoomPosition(30, 21, 'W8N3')));

        // console.log(JSON.stringify(roomUtil.getRoomInfo(Game.rooms.W8N3)));

        // tools.visual('E15S4', getSKMatrix('E15S4'));
        //tools.visual(Game.rooms['E14N3']);

        // E18N6
        let room = Game.rooms['E18N6'];
        if(room) {
            let enemies = room.find(FIND_HOSTILE_CREEPS);
            // let myCreeps = room.find(FIND_MY_CREEPS);
            // let creeps = room.find(FIND_CREEPS);
            if(enemies.length) {
                visual.viewTowerDamage(room, enemies);
            }
        }

        let myRooms = _.filter(Game.rooms, r => r.controller && r.controller.my);
        let ultraRooms = [];
        myRooms.forEach(r => {
            if(r.memory.thoriumDetection) {
                ultraRooms.push(...r.memory.thoriumDetection.observedRooms.ultra);

                const ultras = r.memory.thoriumDetection.observedRooms.ultra;
                const highs = r.memory.thoriumDetection.observedRooms.high;

                ultras.forEach(rN => {
                    Game.map.visual.text("Ultra", new RoomPosition(11,14,rN), {color: '#FFFFFF', fontSize: 10}); 
                })
                highs.forEach(rN => {
                    Game.map.visual.text("High", new RoomPosition(11,14,rN), {color: '#FFFFFF', fontSize: 10}); 
                })
            }
        })

        console.log(`ultraRooms: ${ultraRooms}`);
    },
}

module.exports = sandbox;