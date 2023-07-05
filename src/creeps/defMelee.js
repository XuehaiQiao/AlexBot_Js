const { inRoomUtil } = require("../util");

module.exports = {
    properties: {
        role: "defMelee",
        stages: {
            //1: {maxEnergyCapacity: 300, bodyParts:[MOVE, ATTACK, MOVE, ATTACK], number: 2},
            //3: {maxEnergyCapacity: 800, bodyParts:[...new Array(6).fill(ATTACK), ...new Array(3).fill(MOVE)], number: 2}, // 630
            4: { maxEnergyCapacity: 1300, bodyParts: [...new Array(12).fill(ATTACK), ...new Array(6).fill(MOVE)], number: 4 }, // 1260
            5: { maxEnergyCapacity: 1800, bodyParts: [...new Array(16).fill(ATTACK), ...new Array(8).fill(MOVE)], number: 4 }, // 1680
            6: { maxEnergyCapacity: 2300, bodyParts: [...new Array(20).fill(ATTACK), ...new Array(10).fill(MOVE)], number: 2 }, // 2100
            7: { maxEnergyCapacity: 5600, bodyParts: [...new Array(36).fill(ATTACK), ...new Array(18).fill(MOVE)], number: 2 }, // 3460
        },
        boostTypes: ['UH', 'UH2O', 'XUH2O'],
    },
    /** @param {Creep} creep **/
    run: function (creep) {

        // boost
        if (creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.say('boost');
            creep.getBoosts();
            return;
        }

        let room = Game.rooms[creep.memory.base];
        if (!room) {
            console.log('lost room', creep.memory.base);
            return
        }

        let hostile;
        if (creep.memory.target) {
            hostile = Game.getObjectById(creep.memory.target);
        }
        if (!hostile) {
            hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }

        if (hostile) {
            creep.rangedAttack(hostile);
            creep.attack(hostile);

            let nearestRampart = hostile.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_RAMPART });
            if (nearestRampart) {
                let data = {};
                creep.travelTo(nearestRampart, {
                    roomCallback: (roomName, costMatrix) => {
                        if (Memory.rooms[roomName] && Game.rooms[roomName]) {
                            return inRoomUtil.getEnclosureMatrix(Game.rooms[roomName]);
                        }
                        else return undefined;
                    },
                    returnData: data,
                });

                if(data.nextPos) {
                    let nextPosCreep = data.nextPos.lookFor(LOOK_CREEPS)[0];
                    if(nextPosCreep && nextPosCreep.my && nextPosCreep.memory.role !== this.properties.type) {
                        nextPosCreep.moveTo(creep);
                    }
                }

            }
            else {
                creep.travelTo(hostile);
            }

        }
        else {
            creep.toResPos();
        }
    },

    // checks if the room needs to spawn a creep
    /** @param {Room} room **/
    spawn: function (room) {
        if (!room || room.energyCapacityAvailable < 1300) return false;

        // check if need spawn
        let creepCount;
        if (global.roomCensus[room.name] && global.roomCensus[room.name][this.properties.role]) {
            creepCount = global.roomCensus[room.name][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < this.properties.stages[this.getStage(room)].number) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room) {
        // todo: check boost type

        let name = this.properties.role + Game.time % 10000;
        let body = this.properties.stages[this.getStage(room)].bodyParts;
        let memory = { role: this.properties.role, base: room.name };

        return { name, body, memory };
    },

    getStage: function (room) {
        var stage = 1;
        let capacity = room.energyCapacityAvailable;
        for (var level in this.properties.stages) {
            if (capacity >= this.properties.stages[level].maxEnergyCapacity) {
                stage = level;
            }
        }
        return stage;
    },
};