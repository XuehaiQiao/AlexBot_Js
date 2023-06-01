const { wall, rampart } = require("../structures");

module.exports = function (room) {
    const towers = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_TOWER && struct.store[RESOURCE_ENERGY] >= 10});
    if(!towers.length) return;

    // heal
    let damagedCreeps = room.find(FIND_MY_CREEPS, { filter: creep => creep.hits < creep.hitsMax });
    if (damagedCreeps.length) {
        let tower = damagedCreeps[0].pos.findClosestByRange(towers);
        if (tower) tower.heal(damagedCreeps[0]);
    }

    // defending
    let enemies = room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length) {
        _.forEach(towers, tower => {
            let target = tower.pos.findClosestByRange(enemies);
            tower.attack(target);
        })
        return;
    }

    // repair (no enemy)
    function isNeedRepair(structure) {
        return (
            (structure.structureType == STRUCTURE_WALL && structure.hits >= wall.getTargetHits(room) && structure.hits < wall.getIdealHits(room)) || 
            (structure.structureType == STRUCTURE_RAMPART && structure.hits < 10000) ||
            (structure.structureType == STRUCTURE_RAMPART && structure.hits >= rampart.getTargetHits(room) && structure.hits < rampart.getIdealHits(room)) || 
            (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART && structure.hits <= structure.hitsMax - 800)
        )
    }

    if (!room.memory.needRepairStructures) room.memory.needRepairStructures = [];
    if (Game.time % 50 === 0 && room.memory.needRepairStructures.length === 0) {
        let needRepairStructures = _.filter(room.find(FIND_STRUCTURES), isNeedRepair);
        room.memory.needRepairStructures = _.map(needRepairStructures, structure => structure.id);
    }

    let needRepairs = room.memory.needRepairStructures;
    if(!needRepairs.length) return
    let target = Game.getObjectById(needRepairs[needRepairs.length - 1]);
    if(!target || !isNeedRepair(target)) needRepairs.pop();
    
    if(!needRepairs.length) return
    target = Game.getObjectById(needRepairs[needRepairs.length - 1]);
    let tower = target.pos.findClosestByRange(towers);
    tower.repair(target);
}