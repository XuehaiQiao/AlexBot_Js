const { inRoomUtil, roomUtil } = require("../util");

module.exports = {
    viewMatrix: function (roomName, costMatrix) {
        if (!roomName || !costMatrix) return;

        const roomVisual = new RoomVisual(roomName);

        for (var x = 0; x < 50; x++) {
            for (var y = 0; y < 50; y++) {
                let cost = costMatrix.get(x, y);
                //if(cost === 2) roomVisual.circle(x, y, {fill: 'transparent', radius: 0.45, stroke: '#0f0'});
                if (cost === 50) roomVisual.circle(x, y, { fill: 'transparent', radius: 0.45, stroke: 'blue', strokeWidth: 0.05 });
                if (cost === 100) roomVisual.circle(x, y, { fill: 'transparent', radius: 0.45, stroke: 'yellow', strokeWidth: 0.05 });
                if (cost === 255) roomVisual.circle(x, y, { fill: 'transparent', radius: 0.45, stroke: 'red', strokeWidth: 0.05 });
            }
        }
    },

    viewTowerDamage: function (room, creeps) {
        if(!room || !creeps) return;

        const roomVisual = new RoomVisual(room.name);

        for (let creep of creeps) {
            roomVisual.text(`💥${roomUtil.posTowerDamage(room, creep.pos)}`, creep.pos.x, creep.pos.y - 0.5, {font: 0.4})
        } 

    } 
}