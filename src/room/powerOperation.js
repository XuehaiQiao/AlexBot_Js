module.exports = function(room) {

    if(room.controller.level == 8) {
        let pSpawns = room.find(FIND_MY_STRUCTURES, {filter: struct => (
            struct.structureType == STRUCTURE_POWER_SPAWN && 
            struct.store[RESOURCE_ENERGY] >= 50 &&
            struct.store[RESOURCE_POWER] > 0
        )});

        if(pSpawns.length > 0) {
            pSpawns[0].processPower();
        }
    }

};