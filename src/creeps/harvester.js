const { roomInfo } = require("../config");

module.exports = {
        properties: {
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 4},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 4},
            2: {maxEnergyCapacity: 850, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 2},
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

        // set status: 0. harvest  1. transfer 
        if(creep.memory.status == 0 && creep.store.getFreeCapacity() == 0) {
            creep.memory.status = 1;
            creep.say('🚩 transfer');
        }
        else if (creep.memory.status != 0 && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = 0;
            creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
            creep.say('🔄 harvest');
        }

        // harvest
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
        // transfer
        else {
            // extension && spwan
            var extensionSpawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function(object) {
                    return (object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN) && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (extensionSpawn) {
                if(creep.transfer(extensionSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extensionSpawn);
                }
                return;
            }

            //tower
            var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function(object) {
                    return object.structureType == STRUCTURE_TOWER && object.store.getFreeCapacity(RESOURCE_ENERGY) > 300
                }
            });
            if (tower) {
                if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
                return;
            }

            // if no transfer needs
            if (roomInfo[creep.room.name]) {
                creep.moveTo(roomInfo[creep.room.name].restPos);
                return;
            }

            return;
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
        console.log('Harvesters: ' + harvesters.length, room.name);

        // level 4
        if (room.energyCapacityAvailable >= this.properties.stages[4].maxEnergyCapacity) {
            if (harvesters.length < this.properties.stages[4].number) return true;
        }
        // level 2
        else if (room.energyCapacityAvailable >= this.properties.stages[2].maxEnergyCapacity) {
            if (harvesters.length < this.properties.stages[2].number) return true;
        }
        // level 1
        else if (harvesters.length < this.properties.stages[1].number) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Harvester' + Game.time;
            let body;
            let memory = {role: 'harvester', status: 1};

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
                body = [WORK, CARRY, MOVE]
            }

            return {name, body, memory};
    }
};