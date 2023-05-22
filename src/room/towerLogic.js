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
        console.log(room, "Found Enemies!");
        _.forEach(towers, tower => {
            let target = tower.pos.findClosestByRange(enemies);
            tower.attack(target);
        })
        return;
    }

    // repair (no enemy)
    const isNeedRepair = (struct) => {
        return (
        (struct.structureType === STRUCTURE_WALL && struct.hits >= wall.getTargetHits(room) && struct.hits < wall.getIdealHits(room)) ||
        (struct.structureType === STRUCTURE_RAMPART && struct.hits < 10000) ||
        (struct.structureType === STRUCTURE_RAMPART && struct.hits >= rampart.getTargetHits(room) && struct.hits < rampart.getIdealHits(room)) ||
        (struct.structureType === STRUCTURE_CONTAINER && struct.hitsMax - struct.hits >= 10000) ||
        (struct.structureType !== STRUCTURE_WALL && struct.structureType !== STRUCTURE_RAMPART && struct.structureType !== STRUCTURE_CONTAINER && struct.hits <= struct.hitsMax))
    }

    if (!room.memory.needRepairStructures) room.memory.needRepairStructures = [];
    if (Game.time % 50 === 0 && room.memory.needRepairStructures.length === 0) {
        let needRepairStructures = _.filter(room.find(FIND_STRUCTURES), isNeedRepair);
        room.memory.needRepairStructures = _.map(needRepairStructures, structure => structure.id);
    }

    let needRepairs = room.memory.needRepairStructures;
    if(!needRepairs.length) return
    let target = Game.getObjectById(needRepairs[needRepairs.length - 1]);
    if(!target || !isNeedRepair(target)) {
        needRepairs.pop();
        return;
    }

    let tower = target.pos.findClosestByRange(towers);
    tower.repair(target);
}