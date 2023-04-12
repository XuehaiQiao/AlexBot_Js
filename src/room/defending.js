function defending(room) {
    var hostileParts = [MOVE, WORK, ATTACK, RANGED_ATTACK, HEAL, CLAIM];
    var enemy = _.find(room.find(FIND_HOSTILE_CREEPS), creep =>
        _.filter(creep.body, object => hostileParts.includes(object.type)).length > 0
    );

    if (enemy) {
        console.log(room, "Found Enemies!");

        var towers = _.filter(room.find(FIND_STRUCTURES), structure => (
            structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        ));
        
        _.forEach(towers, tower => {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: function(creep) { 
                    return _.filter(creep.body, object => hostileParts.includes(object.type)).length > 0;
                } 
            })
            
            tower.attack(target);
        })
    }
}

module.exports = defending;