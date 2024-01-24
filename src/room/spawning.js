const { roomInfo } = require("../config");
const creepLogic = require("../creeps");
// const creepTypes2 = ['carrier2', 'harvester2', 'upgrader2', 'builder2']; // 'mineralCarrier'

module.exports = function (room) {
    // if(room.name === 'E11S2' && Game.time % 1200 === 800) {
    //     Game.rooms['E11S2'].memory.tasks.spawnTasks.push({
    //         name: 'rangeAtker',
    //         body: [...new Array(2).fill(TOUGH), ...new Array(14).fill(MOVE), ...new Array(8).fill(RANGED_ATTACK), ...new Array(4).fill(HEAL)],
    //         memory: {
    //             role: 'rangeAtker',
    //             targetRoom: 'E7N1',
    //             boost: true,
    //             boostInfo: { XLHO2: 4, XGHO2: 2, XKHO2: 8 }
    //         }
    //     });
    // }

    // if(room.name === 'E6S2' && Game.time % 200 === 120) {
    //     Game.rooms['E6S2'].memory.tasks.spawnTasks.push({ 
    //         name: 't', 
    //         body: [...new Array(25).fill(CARRY), ...new Array(25).fill(MOVE)], 
    //         memory: { role: 'transporter', targetRoom: 'E7N1' } 
    //     });
    // }

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
        if (roomMemory.invaderCore) {
            if (roomMemory.invaderCore.endTime > Game.time) continue;
            else roomMemory.invaderCore = null;
        }
        
        if (remoteDefenceCreeps(room, idleSpawn, remoteRoomName, roomMemory)) return;
    }

    for (const remoteRoomName of room.memory.outSourceRooms) {
        const roomMemory = Memory.outSourceRooms[remoteRoomName];
        if (!roomMemory) return false;

        // if have invader core, wait to its end to respawn creeps to this room
        if (roomMemory.invaderCore) {
            if (roomMemory.invaderCore.endTime > Game.time) continue;
            else roomMemory.invaderCore = null;
        }

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
    if (room.energyCapacityAvailable < 550) {
        coreTypes = ['harvester2', 'carrier2', 'upgrader2', 'builder2'];
    }
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

        let spawnData = JSON.parse(JSON.stringify(task));
        spawnData.name += Game.time % 10000;

        if (!spawnData.memory.base) spawnData.memory.base = room.name;
        if (spawnCreep(room, spawn, spawnData) === OK) {
            spawnTasks.shift();
            return true;
        }
    }

    return false;
}

function roomDefenceCreeps(room, spawn) {
    // todo: measure threaten level
    let enemies = room.find(FIND_HOSTILE_CREEPS, { filter: c => c.owner.username !== 'Invader' && c.body.length > 30 });

    if (enemies.length > 1) {
        defTypes = ['defMelee'];
        if (room.energyCapacityAvailable < 1300) defTypes = [];
        let creepTypeNeeded = _.find(defTypes, type => creepLogic[type].spawn(room));
        if (creepTypeNeeded) {
            // get the data for spawning a new creep of creepTypeNeeded
            let creepSpawnData = creepLogic[creepTypeNeeded].spawnData(room);
            spawnCreep(room, spawn, creepSpawnData);
        }
        // stop sending outSourcer if base room found enemy
        return true;
    }

    return false;
}

function remoteDefenceCreeps(room, spawn, roomName, roomMemory) {
    // return false if no vision
    const remoteRoom = Game.rooms[roomName];
    if (!remoteRoom) return false;

    // invader defence
    const invaderCore = _.find(remoteRoom.find(FIND_HOSTILE_STRUCTURES), struct => struct.structureType == STRUCTURE_INVADER_CORE);
    if (invaderCore) {
        if (invaderCore.level === 0) {
            if (creepLogic['defender'].spawn(room, roomName)) {
                spawnCreep(room, spawn, creepLogic['defender'].spawnData(room, roomName, invaderCore.id));
                return true;
            }
        }
        else if (invaderCore.ticksToDeploy < 1500 || invaderCore.ticksToDeploy === undefined) {
            roomMemory.invaderCore = { level: invaderCore.level, endTime: Game.time + 80000 + invaderCore.ticksToDeploy };
            return false;
        }
        else if (invaderCore.ticksToDecay) {
            roomMemory.invaderCore = { level: invaderCore.level, endTime: Game.time + invaderCore.ticksToDecay };
            return false;
        }
    }


    const hostileParts = [ATTACK, RANGED_ATTACK, WORK, HEAL, CLAIM, CARRY]

    const enemies = remoteRoom.find(FIND_HOSTILE_CREEPS, {
        filter: c =>
            c.owner.username !== 'Source Keeper' &&
            c.owner.username !== 'Invader' &&
            _.find(hostileParts, partType => c.getActiveBodyparts(partType) > 0)
    });

    const hostileCreeps = remoteRoom.find(FIND_HOSTILE_CREEPS, {
        filter: c =>
            c.owner.username === 'Invader' &&
            _.find(hostileParts, partType => c.getActiveBodyparts(partType) > 0)
    });

    if(enemies.length && room.controller.level >= 7) {
        console.log(roomName, 'found enemy!');
        if (creepLogic['rangeAtker'].spawn(room, roomName)) {
            let creepSpawnData = {
                name: 'rangeAtker' + Game.time % 10000,
                body: [...new Array(5).fill(RANGED_ATTACK), ...new Array(12).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(13).fill(MOVE), ...new Array(10).fill(HEAL)],
                memory: {
                    role: 'rangeAtker',
                    targetRoom: roomName,
                    base: room.name,
                }
            }
            //spawnCreep(room, spawn, creepLogic['rangeAtker'].spawnData(room, roomName));
            spawnCreep(room, spawn, creepSpawnData);
            return true;
        }
    }
    else if (hostileCreeps.length) {
        if (!roomMemory.neutral) {
            console.log(roomName, 'found hostile!');
            if (creepLogic['defender'].spawn(room, roomName)) {
                spawnCreep(room, spawn, creepLogic['defender'].spawnData(room, roomName));
                return true;
            }
        }
        else {
            // if (creepLogic['invaderAttacker'].spawn(room, roomName)) {
            //     spawnCreep(room, spawn, creepLogic['invaderAttacker'].spawnData(room, roomName));
            //     console.log('invaderAtker')
            //     return true;
            // }
        }
    }

    return false;
}

function remoteSourcingCreeps(room, spawn, roomName, roomMemory) {
    const remoteRoom = Game.rooms[roomName];
    if(remoteRoom) {
        const hostileParts = [ATTACK, RANGED_ATTACK, WORK, HEAL, CLAIM, CARRY]

        const enemies = remoteRoom.find(FIND_HOSTILE_CREEPS, {
            filter: c =>
                c.owner.username !== 'Source Keeper' &&
                c.owner.username !== 'Invader' &&
                _.find(hostileParts, partType => c.getActiveBodyparts(partType) > 0)
        });
        if(enemies.length) return false;
    }

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
        let outSourceTypes = ['kAtkDuo', 'remoteHarvester', 'remoteHauler', 'remoteMiner'];
        for (const cType of outSourceTypes) {
            if (creepLogic[cType].spawn(room, roomName)) {
                spawnCreep(room, spawn, creepLogic[cType].spawnData(room, roomName));
                return true;
            }
        }
    }

    return false;
}