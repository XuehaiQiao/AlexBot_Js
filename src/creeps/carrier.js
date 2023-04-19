var carrier = {
    properties: {
        type: 'carrier'
    },

/** @param {Creep} creep **/
run: function(creep) {
    // set status: 0. harvest  1. transfer 
    if(creep.memory.status == 0 && creep.store.getFreeCapacity() == 0) {
        creep.memory.status = 1;
        creep.say('🚩 transfer');
    }
    else if (creep.memory.status != 0 && creep.store.getUsedCapacity() == 0) {
        creep.memory.status = 0;
        creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
        creep.say('🔄 harvest');
    }

    // harvest
    if(creep.memory.status == 0) {
        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        // first find droped recources
        var dropedRecource = _.find(creep.room.find(FIND_DROPPED_RESOURCES));
        if (dropedRecource) {
            if(creep.pickup(dropedRecource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropedRecource, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return;
        }

        // find ruins
        var sourceRuin = _.find(creep.room.find(FIND_RUINS), ruin => ruin.store.getUsedCapacity() > 0);
        if (sourceRuin) {
            var resourceType = _.find(Object.keys(sourceRuin.store), resource => sourceRuin.store[resource] > 0);
            if(creep.withdraw(sourceRuin, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sourceRuin, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return;
        }

        // find not my structures
        var notMyStructure = _.find(creep.room.find(FIND_HOSTILE_STRUCTURES), structure => structure.store && structure.store.getUsedCapacity() > 0);
        if (notMyStructure) {
            var resourceType = _.find(Object.keys(notMyStructure.store), resource => notMyStructure.store[resource] > 0);
            if(creep.withdraw(notMyStructure, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(notMyStructure, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return;
        }

        creep.moveTo(30, 2);
        return;
    }
    // transfer
    else {
        // move to its base room if not in
        if (creep.memory.base && creep.memory.base != creep.room.name) {
            creep.moveToRoom(creep.memory.base);
            return;
        }

        // list includes: avaliable storage
        var storage = creep.room.storage;

        if(!storage || storage.store.getFreeCapacity() == 0) {
            // if no transfer needs
            creep.moveTo(30, 2);
            return;
        }

        var resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
        if(creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
        }
    }
},

// checks if the room needs to spawn a creep
spawn: function(room) {
    var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.room.name == room.name);
    console.log('carriers: ' + carriers.length, room.name);

    // level 2
    if (room.storage && carriers.length < 1) {
        return true;
    }

    return false;
},

// returns an object with the data to spawn a new creep
spawnData: function(room) {
        let name = 'carrier' + Game.time;
        let body = [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE];
        let memory = {role: 'carrier', status: 1};

        return {name, body, memory};
}
};

module.exports = carrier;