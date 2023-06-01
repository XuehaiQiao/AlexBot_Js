const { roomInfo } = require("../config");
const creepLogic = require("../creeps");
const { event } = require("../util");
// const creepTypes2 = ['carrier2', 'harvester2', 'upgrader2', 'builder2']; // 'mineralCarrier'

module.exports = function (room) {
    // pixel generator
    if (room.name === 'W12S21' && Game.time % 1500 === 0) {
        Game.rooms['W12S21'].memory.tasks.spawnTasks.push({ name: 'scout', body: [MOVE], memory: { role: 'scout', targetPos: { x: 42, y: 35, roomName: 'W10S20' } } });
    }

    if (!room.memory.outSourceRooms) room.memory.outSourceRooms = [];
    
    if(!checkEvent(room) && Game.time % 15 !== 0 && room.controller.level > 3) {
        if(room.name === 'W13S15') console.log('passed!', Game.time % 15);
        return;
    }

    // return if no idle spawn
    let idleSpawn = _.find(room.find(FIND_MY_SPAWNS), spawn => spawn.spawning == null);
    if (!idleSpawn) return;

    // base creeps
    if (createCoreCreep(room, idleSpawn)) return;
    if (createTaskCreep(room, idleSpawn)) return;
    if (roomDefenceCreeps(room, idleSpawn)) return;

    // remote room creeps
    for (const remoteRoomName of room.memory.outSourceRooms) {
        const roomMemory = Memory.outSourceRooms[remoteRoomName];
        if (!roomMemory) return false;

        // if have invader core, wait to its end to respawn creeps to this room
        if(roomMemory.invaderCore) {
            if(roomMemory.invaderCore.endTime > Game.time) continue;
            else roomMemory.invaderCore = null;
        }
        
        if (remoteDefenceCreeps(room, idleSpawn, remoteRoomName, roomMemory)) return;
        
        if(event.checkEnemy(remoteRoomName)) continue;
        if (remoteSourcingCreeps(room, idleSpawn, remoteRoomName, roomMemory)) return;
    }
}

// ========================================= functions =======================================

function spawnCreep(room, spawn, creepSpawnData) {
    if (!creepSpawnData) return -100;

    const { name, body, memory } = creepSpawnData
    // find the first available spawn in the room
    let result = spawn.spawnCreep(body, name, { memory: memory });

    if (result === OK && memory.boost && memory.boostInfo) {
        room.addToBoostLab(memory.boostInfo);
    }

    console.log(room, "Tried to Spawn:", creepSpawnData.memory.role, result);
    return result;
}

function createCoreCreep(room, spawn) {
    coreTypes = ['carrier2', 'harvester2', 'manager', 'upgrader2', 'builder2', 'miner', 'mineralCarrier'];
    // find a creep type that returns true for the .spawn() function
    let creepTypeNeeded = _.find(coreTypes, type => creepLogic[type].spawn(room));

    // get the data for spawning a new creep of creepTypeNeeded
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room);
    let result = spawnCreep(room, spawn, creepSpawnData);

    // serviver creeps
    let creeps = room.find(FIND_MY_CREEPS);
    if (creeps.length < 2 && result == ERR_NOT_ENOUGH_ENERGY) {
        spawnCreep(room, spawn, { name: 'Servivor' + Game.time, body: [WORK, CARRY, CARRY, MOVE], memory: { role: 'harvester', status: 1 } });
        console.log("Spawning backup tiny Servivor001");
    }
    if (creepTypeNeeded) return true;

    return false;
}

function createTaskCreep(room, spawn) {
    if (!room.memory.tasks.spawnTasks) room.memory.tasks.spawnTasks = [];
    let spawnTasks = room.memory.tasks.spawnTasks;
    // todo: check cost
    if (spawnTasks.length) {
        // task = [{name, body, memory}, ...]
        const task = spawnTasks[0];
        task.name += Game.time % 10000;
        if (spawnCreep(room, spawn, task) === OK) {
            spawnTasks.shift();
            return true;
        }
    }

    return false;
}

function roomDefenceCreeps(room, spawn) {
    // stop sending outSourcer if base room found enemy
    // todo: create active defence creeps
    let enemies = room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length) return true;

    return false;
}

function remoteDefenceCreeps(room, spawn, roomName, roomMemory) {
    // return false if no vision
    const remoteRoom = Game.rooms[roomName];
    if (!remoteRoom) return false;

    // invader defence
    const invaderCore = _.find(remoteRoom.find(FIND_HOSTILE_STRUCTURES), struct => struct.structureType == STRUCTURE_INVADER_CORE);
    if (invaderCore) {
        switch (invaderCore.level) {
            case 0:
                if (creepLogic['defender'].spawn(room, roomName)) {
                    spawnCreep(room, spawn, creepLogic['defender'].spawnData(room, roomName, invaderCore.id));
                    return true;
                }
                break;
            case 1:
                if (creepLogic['rangeAtker'].spawn(room, roomName) && (invaderCore.ticksToDeploy < 250 || invaderCore.ticksToDeploy === undefined)) {
                    spawnCreep(room, spawn, creepLogic['rangeAtker'].spawnData(room, roomName, { invader: true }));
                    return true;
                }
                break;
            case 2:
                if (creepLogic['rangeAtker'].spawn(room, roomName) && (invaderCore.ticksToDeploy < 250 || invaderCore.ticksToDeploy === undefined)) {
                    spawnCreep(room, spawn, creepLogic['rangeAtker'].spawnData(room, roomName, { invader: true }));
                    return true;
                }
                break;
            case 3:
                if (invaderCore.ticksToDeploy < 1500 || invaderCore.ticksToDeploy === undefined) {
                    roomMemory.invaderCore = {level: invaderCore.level, endTime: Game.time + 70000 + invaderCore.ticksToDeploy};
                    return false;
                }
                break;
            case 4:
                if (invaderCore.ticksToDeploy < 1500 || invaderCore.ticksToDeploy === undefined) {
                    roomMemory.invaderCore = {level: invaderCore.level, endTime: Game.time + 70000 + invaderCore.ticksToDeploy};
                    return false;
                }
                break;
            case 5:
                if (invaderCore.ticksToDeploy < 1500 || invaderCore.ticksToDeploy === undefined) {
                    roomMemory.invaderCore = {level: invaderCore.level, endTime: Game.time + 70000 + invaderCore.ticksToDeploy};
                    return false;
                }
                break;
            default:
                console.log(roomName, 'invaderCore level:', invaderCore.level);
        }
    }

    const hostileCreeps = remoteRoom.find(FIND_HOSTILE_CREEPS, { filter: c => c.owner.username !== 'Source Keeper' });
    if (hostileCreeps.length) {
        if (!roomMemory.neutral) {
            if (creepLogic['defender'].spawn(room, roomName)) {
                spawnCreep(room, spawn, creepLogic['defender'].spawnData(room, roomName));
                return true;
            }
        }
        else {
            if (creepLogic['invaderAttacker'].spawn(room, roomName)) {
                spawnCreep(room, spawn, creepLogic['invaderAttacker'].spawnData(room, roomName));
                console.log('invaderAtker')
                return true;
            }
        }
    }

    return false;
}

function remoteSourcingCreeps(room, spawn, roomName, roomMemory) {
    if (room.energyCapacityAvailable < 550) return false;

    if (!roomMemory.neutral) {
        let outSourceTypes = ['claimer', 'remoteHarvester', 'remoteHauler'];
        for (const cType of outSourceTypes) {
            if (creepLogic[cType].spawn(room, roomName)) {
                spawnCreep(room, spawn, creepLogic[cType].spawnData(room, roomName));
                return true;
            }
        }
    }
    else {
        if (room.energyCapacityAvailable < 5600) return false;
        let outSourceTypes = ['keeperAttacker', 'remoteHarvester', 'remoteHauler', 'remoteMiner'];
        for (const cType of outSourceTypes) {
            if (creepLogic[cType].spawn(room, roomName)) {
                spawnCreep(room, spawn, creepLogic[cType].spawnData(room, roomName));
                return true;
            }
        }
    }

    return false;
}

function checkEvent(room) {
    // check spawn related events
    if(event.checkCreepDying(room.name)) return true;
    if(event.checkEnemy(room.name)) return true;
    
    for(var roomName of room.memory.outSourceRooms) {
        if(event.checkCreepDying(roomName)) return true;
        if(event.checkEnemy(roomName)) return true;
    }

    return false;
}