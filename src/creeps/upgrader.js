module.exports = {
    properties: {
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 6},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 5},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 3},
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        // set status: 0. harvest  1. upgrade 
        if(creep.memory.status == 0 && creep.store.getFreeCapacity() == 0) {
            creep.memory.status = 1;
            creep.say('🚩 upgrade');
        }
        else if (creep.memory.status != 0 && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = 0;
            creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
            creep.say('🔄 harvest');
        }

        if(creep.memory.status == 0) {
            var dropedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount > creep.store.getCapacity() / 2});
            if (dropedResource) {
                if(creep.pickup(dropedResource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedResource);
                }
                return;
            }

            // find ruins
            var sourceRuin = _.find(creep.room.find(FIND_RUINS), ruin => ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
            if (sourceRuin) {
                // var resourceType = _.find(Object.keys(sourceRuin.store), resource => sourceRuin.store[resource] > 0);
                if(creep.withdraw(sourceRuin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sourceRuin, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if (typeof creep.memory.target === 'undefined' || sources.length <= creep.memory.target) {
                creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
            }
            var source = sources[creep.memory.target];
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);
        console.log('Upgraders: ' + upgraders.length, room.name);

        // level 2
        if (room.energyCapacityAvailable >= this.properties.stages[4].maxEnergyCapacity) {
            if (upgraders.length < this.properties.stages[4].number) return true;
        }
        else if (room.energyCapacityAvailable >= this.properties.stages[2].maxEnergyCapacity) {
            if (upgraders.length < this.properties.stages[2].number) return true;
        }
        // level 1
        else if (upgraders.length < this.properties.stages[1].number) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        
        let name = 'Upgrader' + Game.time;
        let body;
        let memory = {role: 'upgrader', status: 1, target: 0};

        // define body parts based on room energyCapacity
        // level 4
        if(room.energyCapacityAvailable >= this.properties.stages[4].maxEnergyCapacity) {
            body = this.properties.stages[4].bodyParts;
        }
        // level 2
        else if(room.energyCapacityAvailable >= this.properties.stages[2].maxEnergyCapacity) {
            body = this.properties.stages[2].bodyParts;
        }
        // level 1
        else {
            body = this.properties.stages[1].bodyParts;
        }
    
        return {name, body, memory};
    }
};