const structureLogic = require("../structures");
const { roomInfo } = require("../config");

module.exports = {
    properties: {
        type: "builder2",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 4},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 3},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 2},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(6).fill(WORK), ...new Array(6).fill(CARRY), ...new Array(6).fill(MOVE)], number: 1},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(9).fill(WORK), ...new Array(9).fill(CARRY), ...new Array(9).fill(MOVE)], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], number: 1},
            8: {maxEnergyCapacity: 10000, bodyParts:[...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], number: 1},
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        creep.workerSetStatusWithAction(null, () => {
            creep.memory.targetId = null;
            this.assignTarget(creep);
        })

        // build
        if(creep.memory.status) {
            var target = this.assignTarget(creep);
            //no tasks
            if (!target) {
                creep.say('!Target')
                creep.memory.role = 'upgrader2';
                return;
            }
            // constructionsite (build)
            if (!target.hits) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            // wall & rampart (repair)
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            
        }
        // harvest
        else {
            if(creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] < 5000) {
                creep.toResPos();
                // creep.takeEnergyFromClosestStore();
            }
            else if(
                roomInfo[creep.room.name] && 
                roomInfo[creep.room.name].storagePos && 
                _.find(roomInfo[creep.room.name].storagePos.lookFor(LOOK_STRUCTURES), struct => struct.structureType === STRUCTURE_CONTAINER)
                ) {
                creep.takeEnergyFromClosestStore();
            }
            else creep.takeEnergyFromClosest();
            
            return;
        }
    },

    spawn: function(room) {
        let constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        let needRepairs = _.filter(room.find(FIND_STRUCTURES), structure => (
            (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < structureLogic.wall.getTargetHits(room)
        ))
        
        if (constructionSites.length == 0 && needRepairs.length == 0) {
            return false;
        }

        // var builder2s = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.type && creep.room.name == room.name);
        // console.log(this.properties.type + ': ' + builder2s.length, room.name);
        let creepCount;
        if(global.roomCensus[room.name][this.properties.type]) creepCount = global.roomCensus[room.name][this.properties.type]
        else creepCount = 0;
        
        var stage = this.getStage(room);
        return creepCount < this.properties.stages[stage].number? true : false;
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            var stage = this.getStage(room);
            let name = this.properties.type + Game.time;
            let body = this.properties.stages[stage].bodyParts;
            let memory = {role: this.properties.type, building: 1, base: room.name};

            return {name, body, memory};
    },

    getStage: function(room) {
        var stage = 1;
        let capacity = room.energyCapacityAvailable;
        for(var level in this.properties.stages) {
            if(capacity >= this.properties.stages[level].maxEnergyCapacity) {
                stage = level;
            }
        }

        return stage;
    },

    assignTarget: function(creep) {
        let target = Game.getObjectById(creep.memory.targetId);
        if(target) {
            if(target.hits && target.hits >= structureLogic.wall.getTargetHits(creep.room)) {
                creep.memory.targetId = null;
                target = null;
            }
            else return target;
        }


        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            creep.memory.targetId = targets[0].id;
            return Game.getObjectById(targets[0].id);
        }
        
        targets = _.filter(creep.room.find(FIND_STRUCTURES), structure => (
            (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < structureLogic.wall.getTargetHits(creep.room)
        ))
        if(targets.length) {
            let target = targets.reduce((a,b) => {
                if (a.hits < b.hits) return a;
                else return b;
            });
            //targets.sort((a,b) => a.hits > b.hits);
            creep.memory.targetId = target.id;
            return Game.getObjectById(target.id);
        }

        return null;
    }
};