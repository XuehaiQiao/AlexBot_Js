let structureLogic = require("../structures/index");

function repairing(room) {
    function needRepair(structure) {
        return (
            (structure.structureType == STRUCTURE_WALL && structure.hits >= structureLogic.wall.getTargetHits(room) && structure.hits < structureLogic.wall.getIdealHits(room)) || 
            (structure.structureType == STRUCTURE_RAMPART && structure.hits < 10000) ||
            (structure.structureType == STRUCTURE_RAMPART && structure.hits >= structureLogic.rampart.getTargetHits(room) && structure.hits < structureLogic.rampart.getIdealHits(room)) || 
            (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART && structure.hits < structure.hitsMax - 600)
        )
    }

    var hostileParts = [MOVE, WORK, ATTACK, RANGED_ATTACK, HEAL, CLAIM];
    var enemy = _.find(room.find(FIND_HOSTILE_CREEPS), creep =>
        _.filter(creep.body, object => hostileParts.includes(object.type)).length > 0
    );

    if (enemy) {
        return;
    }
    
    if(!room.memory.needRepairStructures || (Game.time % 50 == 0 && room.memory.needRepairStructures.length == 0)) {
        var needRepairStructures = _.filter(room.find(FIND_STRUCTURES), needRepair);
        room.memory.needRepairStructures = _.map(needRepairStructures, structure => structure.id);
    }
    
    // var needRepairStructure = _.find(room.find(FIND_STRUCTURES), needRepair);

    //remove if repaired
    if (room.memory.needRepairStructures.length > 0 && (!Game.getObjectById(room.memory.needRepairStructures[room.memory.needRepairStructures.length - 1]) || !needRepair(Game.getObjectById(room.memory.needRepairStructures[room.memory.needRepairStructures.length - 1])))) {
        room.memory.needRepairStructures.pop();
    }

    if (room.memory.needRepairStructures.length > 0) {
        var target = Game.getObjectById(room.memory.needRepairStructures[room.memory.needRepairStructures.length - 1]);
        var tower = _.find(room.find(FIND_STRUCTURES), structure => (
            structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 500
        ))
        
        if (tower) {
            tower.repair(target)
        }
        else {
            console.log("NO Tower Repairing Now! (room.repairing)")
        }
        
    }
}

module.exports = repairing;