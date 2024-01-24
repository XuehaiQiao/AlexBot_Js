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
            7: { maxEnergyCapacity: 5600, bodyParts: [...new Array(32).fill(ATTACK), ...new Array(16).fill(MOVE)], number: 1 }, // 3460
        },
        boostTypes: ['XUH2O', 'UH2O', 'UH'],
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

        let target;
        if (creep.memory.target) {
            this.haveTargetLogic(creep);
        }
        else {
            this.findTarget(creep);
            this.noTargetLogic(creep);
        }
    },

    // checks if the room needs to spawn a creep
    /** @param {Room} room **/
    spawn: function (room) {
        if (!room || room.energyCapacityAvailable < 1300) return false;

        const enemies = room.find(FIND_HOSTILE_CREEPS, {
            filter: c => (
                c.owner.username !== 'Invader' &&
                c.body.length >= 30 &&
                c.pos.findInRange(FIND_MY_STRUCTURES, 1, struct => struct.structureType === STRUCTURE_RAMPART).length > 0
            )
        });
        console.log("eeeeeee",enemies);
        if(!enemies.length) return false;

        // check if need spawn
        let creepCount;
        if (global.roomCensus[room.name] && global.roomCensus[room.name][this.properties.role]) {
            creepCount = global.roomCensus[room.name][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < this.properties.stages[this.getStage(room)].number) {
            room.memory.lastDefMeleeST = Game.time;
            return true;
        }
        // else {
        //     if (room.memory.lastDefMeleeST < Game.time - 250) {
        //         room.memory.lastDefMeleeST = Game.time;
        //         return true;
        //     }
        // }

        return false;
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room) {
        let name = this.properties.role + Game.time % 10000;
        let body = this.properties.stages[this.getStage(room)].bodyParts;
        let memory = { role: this.properties.role, base: room.name };

        // todo: check boost type
        let attackPartsCount = body.reduce((prev, curr) => (curr === ATTACK ? prev + 1 : prev), 0);
        const boostTypes = this.properties.boostTypes;
        for (let compound of boostTypes) {
            let compoundAmount = room.getResourceAmount(compound);
            if (compoundAmount >= attackPartsCount * 30) {
                memory.boost = true;
                memory.boostInfo = { [compound]: attackPartsCount };
                break;
            }
        }

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

    haveTargetLogic: function (creep) {
        let target;
        if (creep.memory.target) {
            target = Game.getObjectById(creep.memory.target);
        }
        else {
            this.noTargetLogic(creep);
        }

        if (!target) {
            this.noTargetLogic(creep);

            // remove target if didn't see it for long time
            if (creep.memory.targetBuffer > 0) {
                creep.memory.targetBuffer--;
            }
            else {
                creep.memory.target = null;
            }

            return;
        }

        const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (hostile) {
            if (creep.pos.isNearTo(target)) {
                creep.attack(target);
            }
            else {
                creep.attack(hostile);
            }


            let nearestRampart = target.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_RAMPART });
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

                if (data.nextPos) {
                    let nextPosCreep = data.nextPos.lookFor(LOOK_CREEPS)[0];
                    if (nextPosCreep && nextPosCreep.my && nextPosCreep.memory.role !== creep.memory.role) {
                        nextPosCreep.moveTo(creep);
                    }
                }

            }
            else {
                creep.travelTo(target);
            }

        }
        else {
            creep.toResPos();
        }

        this.resetTargetBuffer(creep);
    },

    noTargetLogic: function (creep) {
        const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            creep.attack(hostile)

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

                if (data.nextPos) {
                    let nextPosCreep = data.nextPos.lookFor(LOOK_CREEPS)[0];
                    if (nextPosCreep && nextPosCreep.my && nextPosCreep.memory.role !== creep.memory.role) {
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



    findTarget: function (creep) {
        // find target
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: creep => {
                let nearestRampart = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_RAMPART });
                if (creep.pos.isNearTo(nearestRampart)) return true;
                else return false;
            }
        });

        if (hostiles.length) {
            let target = hostiles[Math.floor(Math.random() * hostiles.length)];
            creep.memory.target = target.id;
            this.resetTargetBuffer(creep);
        }
    },

    resetTargetBuffer: (creep) => {
        creep.memory.targetBuffer = 100;
    }
};