let structureLogic = require("../structures/index");

var builder = {
    properties: {
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 6, wall: 1000},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 5, wall: 1000000},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 3, wall: 10000000},
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = 0;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = 1;
            creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
            creep.say('🚧 build');
        }

        // build
        if(creep.memory.building == 1) {
            var targets;
            
            // 1. build
            targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            // 2. repair
            // targets: short wall & rampart
            targets = _.filter(creep.room.find(FIND_STRUCTURES), structure => (
                (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < structureLogic.wall.getTargetHits(creep.room)
            ))

            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                return;
            }
            
            if(targets.length == 0) {
                // if no tasks
                if (roomInfo[creep.room.name]) {
                    creep.moveTo(roomInfo[creep.room.name].restPos);
                    return;
                }
            }

        }
        else {
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
            // find storage
            var storage = creep.room.storage;
            if (storage && storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                // var resourceType = _.find(Object.keys(sourceRuin.store), resource => sourceRuin.store[resource] > 0);
                if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if (typeof creep.memory.target === 'undefined' || sources.length <= creep.memory.target) {
                creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
            }
            var source = sources[creep.memory.target];
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    },

    spawn: function(room) {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
        console.log('Builder: ' + builders.length, room.name);

        // level 4
        if (room.energyCapacityAvailable >= this.properties.stages[4].maxEnergyCapacity) {
            if (builders.length < this.properties.stages[4].number) return true;
        }
        // level 2
        else if (room.energyCapacityAvailable >= this.properties.stages[2].maxEnergyCapacity) {
            if (builders.length < this.properties.stages[2].number) return true;
        }
        // level 1
        else if (builders.length < this.properties.stages[1].number) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Builder' + Game.time;
            let body;
            let memory = {role: 'builder', building: 1};

            // creep creating example:
            // Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], 'Builder' + Game.time, {memory: {role: 'builder', building: 1, targetRoom: 'W16S17'}});

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

module.exports = builder;