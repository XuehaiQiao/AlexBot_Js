const { KEEPER } = require("../constants/roomTypes");
const { roomUtil, inRoomUtil } = require("../util");

module.exports = {
    properties: {
        role: "reactorFiller"
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        // record roomMatrix
        let ifRepath;
        if (roomUtil.getRoomType(creep.room.name) === KEEPER) {
            if(!creep.room.memory.skMatrix ) {
                inRoomUtil.getSKMatrix(creep.room.name);
                ifRepath = 1;
            }

            let invaderCore = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_INVADER_CORE})[0];
            if(invaderCore) {
                creep.room.memory.invaderCore = {level: invaderCore.level, endTime: Game.time + 75000};
            }
        }



        creep.workerSetStatus();

        if (creep.memory.status) {
            if(!creep.memory.targetRoom) {
                creep.say('!tR');
                return;
            }

            // Directly move targetRoom if have vision
            let targetRoom = Game.rooms[creep.memory.targetRoom];
            if(targetRoom) {
                let reactor = targetRoom.find(FIND_REACTORS)[0];
                if (reactor) {
                    if(creep.transfer(reactor, RESOURCE_THORIUM) === ERR_NOT_IN_RANGE) {
                        creep.travelTo(reactor, {
                            allowSK: true,
                            roomCallback: (roomName, costMatrix) => {
                                if (roomUtil.getRoomType(roomName) === KEEPER) {
                                    let roomMemory = Memory.rooms[roomName];
                                    if(roomMemory && roomMemory.invaderCore && roomMemory.invaderCore.endTime > Game.time) {
                                        return false;
                                    }
                                    else return inRoomUtil.getSKMatrix(roomName);
                                }
                                
                                return undefined;
                            },
                            repath: ifRepath,
                            ensurePath: true,
                            ignoreCreeps: false,
                        });
                    }
                }

                return;
            }

            // move to target room if not in
            if (creep.room.name !== creep.memory.targetRoom) {
                creep.travelTo(new RoomPosition(25, 25, creep.memory.targetRoom), {
                    allowSK: true,
                    roomCallback: (roomName, costMatrix) => {
                        if (roomUtil.getRoomType(roomName) === KEEPER) {
                            let roomMemory = Memory.rooms[roomName];
                            if(roomMemory && roomMemory.invaderCore && roomMemory.invaderCore.endTime > Game.time) {
                                return false;
                            }
                            else return inRoomUtil.getSKMatrix(roomName);
                        }
                        
                        return undefined;
                    },
                    repath: ifRepath,
                    ensurePath: true,
                });
                return;
            }

            let reactor = creep.room.find(FIND_REACTORS)[0];
            if (reactor) {
                if(creep.transfer(reactor, RESOURCE_THORIUM) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(reactor);
                }
            }
        }
        else {
            if(creep.room.name === creep.memory.targetRoom) {
                let dropedThorium = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType === RESOURCE_THORIUM});
                if(dropedThorium) {
                    if(creep.pickup(dropedThorium) === ERR_NOT_IN_RANGE) creep.travelTo(dropedThorium);
                    return;
                }
            }            

            if(creep.ticksToLive < 1400) {
                creep.suicide();
                return;
            }

            if (creep.room.name !== creep.memory.base) {
                creep.travelTo(new RoomPosition(25, 25, creep.memory.base), {
                    allowSK: true,
                    roomCallback: (roomName, costMatrix) => {
                        if (roomUtil.getRoomType(roomName) === KEEPER) {
                            let roomMemory = Memory.rooms[roomName];
                            if(roomMemory && roomMemory.invaderCore && roomMemory.invaderCore.endTime > Game.time) {
                                return false;
                            }
                            else return inRoomUtil.getSKMatrix(roomName);
                        }
                        
                        return undefined;
                    },
                    repath: ifRepath,
                    ensurePath: true,
                });
                return;
            }

            let storage = creep.room.storage;
            let terminal = creep.room.terminal;
            if(storage && storage.store[RESOURCE_THORIUM] > 99) {
                let result = creep.withdraw(storage, RESOURCE_THORIUM, 99);
                if(result === ERR_NOT_IN_RANGE) {
                    creep.travelTo(storage);
                }
                else if(result === OK || creep.store[RESOURCE_THORIUM] >= 10) creep.memory.status = 1;
            }
            else if(terminal && terminal.store[RESOURCE_THORIUM] > 99) {
                let result = creep.withdraw(terminal, RESOURCE_THORIUM, 99);
                if(result === ERR_NOT_IN_RANGE) {
                    creep.travelTo(terminal);
                }
                else if(result === OK || creep.store[RESOURCE_THORIUM] >= 10) creep.memory.status = 1;
            } 
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function (room, targetRoomName) {
        if(!room.storage || !room.terminal) return false
        if(room.terminal.store[RESOURCE_THORIUM] < 500) return false;

        const thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role === this.properties.role && creep.memory.targetRoom === targetRoomName);

        let carryAmount = thisTypeCreeps.reduce((accu, creep) => accu + creep.store.getUsedCapacity(), 0);

        let targetRoom = Game.rooms[targetRoomName];
        if (targetRoom) {
            let reactor = targetRoom.find(FIND_REACTORS)[0];
            if (reactor && reactor.store[RESOURCE_THORIUM] >= 900) return false;
        }

        if (carryAmount <= 300 && thisTypeCreeps.length < 6) {
            return true
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = [CARRY, CARRY, MOVE, MOVE];
        let memory = { role: this.properties.role, status: 0, base: room.name, targetRoom: targetRoomName };

        return { name, body, memory };
    },
};