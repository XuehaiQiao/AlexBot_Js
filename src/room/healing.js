
function repairing(room) {
    function needHeal(creep) {
        return creep.hits < creep.hitsMax;
    }

    var damagedCreep = _.find(room.find(FIND_MY_CREEPS), needHeal);
    
    if (damagedCreep) {
        var target = damagedCreep;
        var tower = _.find(room.find(FIND_STRUCTURES), structure => (
            structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        ));
        
        if (tower) {
            tower.heal(target)
        }
    }
}

module.exports = repairing;