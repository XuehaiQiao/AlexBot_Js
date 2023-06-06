const { baseUtil } = require("../util");

module.exports = function(room) {
    if(!room) return;

    const roomVisual = room.visual;
    
    // let creeps = room.find(FIND_HOSTILE_CREEPS);

    // creeps.map(creep => {
    //     roomVisual.text(baseUtil.posTowerDamage(room, creep.pos), creep.pos.x, creep.pos.y - 1, {color: 'white', font: 0.4});
    // });


    //enclosureMatrix visual
    const eMatrix = baseUtil.getEnclosureMatrix(room);
    for(var x = 0; x < 50; x++) {
        for(var y = 0; y < 50; y++) {
            let cost = eMatrix.get(x, y);
            //if(cost === 2) roomVisual.circle(x, y, {fill: 'transparent', radius: 0.55, stroke: '#0f0'});
            if(cost === 50) roomVisual.circle(x, y, {fill: 'transparent', radius: 0.55, stroke: 'blue'});
            if(cost === 100) roomVisual.circle(x, y, {fill: 'transparent', radius: 0.55, stroke: 'yellow'});
            if(cost === 255) roomVisual.circle(x, y, {fill: 'transparent', radius: 0.55, stroke: 'red'});
        }
    }
}