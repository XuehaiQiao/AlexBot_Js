const { wall, rampart } = require("../structures");

const towerRestTime = 5;

module.exports = function (room) {
    //if(room.name === 'E16S2') return;
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
        if(room.memory.towerTarget) {
            let target = Game.getObjectById(room.memory.towerTarget);
            if(target) {
                if(target.hits === target.hitsMax) {
                    room.memory.towerTarget = null;
                    room.memory.towerRest = towerRestTime;
                }
                else {
                    _.forEach(towers, tower => {
                        tower.attack(target);
                    });
                }
            }
            else {
                room.memory.towerTarget = null;
                room.memory.towerRest = towerRestTime;
            }
        }
        else {
            if(room.memory.towerRest > 0) {
                room.memory.towerRest--;
            }
            else {
                // todo: target creep with highest attack damage
                // find enemy
                let target;
                const defMelees = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === 'defMelee'});
                const nearDefMelees = [];
                _.forEach(defMelees, c => {
                    nearDefMelees.push(...c.pos.findInRange(FIND_HOSTILE_CREEPS, 1))
                });
                if(nearDefMelees.length) {
                    target = nearDefMelees[Math.floor(Math.random() * nearDefMelees.length)];
                }
                else {
                    target = enemies[Math.floor(Math.random() * enemies.length)];
                }
                
                room.memory.towerTarget = target.id;
                _.forEach(towers, tower => {
                    tower.attack(target);
                })
            }
        }
        console.log(room, "Found Enemies!");
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
    if (Game.time % 10 === 0 && room.memory.needRepairStructures.length === 0) {
        let needRepairStructures = _.filter(room.find(FIND_STRUCTURES), isNeedRepair);
        room.memory.needRepairStructures = _.map(needRepairStructures, structure => structure.id);
    }

    let needRepairs = room.memory.needRepairStructures;
    while(needRepairs.length) {
        let target = Game.getObjectById(needRepairs[needRepairs.length - 1]);
        if(!target || !isNeedRepair(target)) {
            needRepairs.pop();
        }
        else {
            let tower = target.pos.findClosestByRange(towers);
            tower.repair(target);
            break;
        }
    }
}