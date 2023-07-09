const roomUtil = require("../util/roomUtil");

module.exports = function (room) {
    if (!room) return;
    if (room.controller.level !== 8) return;

    minePower(room);
    //
    usePower(room);
    findPower(room);
};

function usePower(room) {
    let storage = room.storage;
    if (!storage || storage.store[RESOURCE_ENERGY] < 420000) return;

    let pSpawn = room.find(FIND_MY_STRUCTURES, {
        filter: struct => (
            struct.structureType == STRUCTURE_POWER_SPAWN &&
            struct.store[RESOURCE_ENERGY] >= 50 &&
            struct.store[RESOURCE_POWER] > 0
        )
    })[0];

    if (pSpawn) {
        pSpawn.processPower();
    }
}

function minePower(room) {
    if (!room.memory.tasks) return;

    const powerTasks = room.memory.tasks.powerTasks;
    if (!powerTasks) {
        room.memory.tasks.powerTasks = [];
        return;
    }

    //powerTask: {roomName, status, space, decayTime, amount}, more:  distance
    // status:
    //  0. not assigned
    //  1. create mining Creeps
    //  2. start attacking pb
    //  3. create transporters
    //  4. no power left/ no vison to targetRoom (remove from tasks)
    if (!powerTasks.length) return;

    const pTask = powerTasks[0];

    if (pTask.decayTime < Game.time) {
        powerTasks.shift();
        return;
    }

    switch (pTask.status) {
        case 1:
            createMiners(room, pTask);
            pTask.status = 2;
            break;
        case 2:
            let changeStatus = ckeckPowerBankHits(room, pTask);
            if (changeStatus) pTask.status = 3;
            break;
        case 3:
            createTransporters(room, pTask);
            pTask.status = 4;
            break;
        case 4:
            let isFinished = checkCollect(room, pTask);
            if (isFinished) {
                powerTasks.shift();
            }
            break;
        default:
            powerTasks.shift();
    }

    return;
}

function createMiners(room, pTask) {
    console.log('create powerMiners');

    if (pTask.space >= 3) {
        for (let i = 0; i < 3; i++) {
            room.memory.tasks.spawnTasks.push({
                name: 'PMe',
                body: [...new Array(25).fill(MOVE), ...new Array(25).fill(HEAL)],
                memory: {
                    role: 'powerMedic',
                    targetRoom: pTask.roomName,
                    base: room.name
                }
            });

            room.memory.tasks.spawnTasks.push({
                name: 'PM',
                body: [...new Array(20).fill(MOVE), ...new Array(20).fill(ATTACK)],
                memory: {
                    role: 'powerMiner',
                    targetRoom: pTask.roomName,
                    base: room.name
                }
            });
        }
    }
    else {
        room.memory.tasks.spawnTasks.push({
            name: 'powerMedic',
            body: [...new Array(25).fill(MOVE), ...new Array(25).fill(HEAL)],
            memory: {
                role: 'powerMedic',
                targetRoom: pTask.roomName,
                base: room.name
            }
        });

        room.memory.tasks.spawnTasks.push({
            name: 'powerMiner',
            body: [...new Array(3).fill(TOUGH), ...new Array(19).fill(MOVE), ...new Array(16).fill(ATTACK)],
            memory: {
                role: 'powerMiner',
                targetRoom: pTask.roomName,
                base: room.name,
                boost: true,
                boostInfo: { XGHO2: 3, XUH2O: 16 }
            }
        });
    }

    return true;
}

function ckeckPowerBankHits(room, pTask) {
    let targetRoom = Game.rooms[pTask.roomName];
    if (!targetRoom) {
        return false;
    }

    let pb = targetRoom.find(FIND_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_POWER_BANK })[0];
    if (!pb) return false;

    if (pb.hits < 1200000) return true;

    return false;
}

function createTransporters(room, pTask) {
    console.log('create power transporters');

    let amount = pTask.amount;
    while (amount > 0) {
        if (amount >= 1250) {
            room.memory.tasks.spawnTasks.push({
                name: 'transporter',
                body: [...new Array(25).fill(MOVE), ...new Array(25).fill(CARRY)],
                memory: {
                    role: 'transporter',
                    workType: 3,
                    targetRoom: pTask.roomName,
                    base: room.name,
                }
            });

            amount -= 1250;
        }
        else {
            let carryCount = Math.ceil(amount / 50);
            room.memory.tasks.spawnTasks.push({
                name: 'transporter',
                body: [...new Array(carryCount).fill(MOVE), ...new Array(carryCount).fill(CARRY)],
                memory: {
                    role: 'transporter',
                    workType: 3,
                    targetRoom: pTask.roomName,
                    base: room.name,
                }
            });

            amount -= carryCount * 50;
        }
    }

    return true;
}

function checkCollect(room, pTask) {
    let targetRoom = Game.rooms[pTask.roomName];
    if (!targetRoom) {
        return false;
    }

    let target = targetRoom.find(FIND_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_POWER_BANK })[0];
    if (target) return false;

    target = targetRoom.find(FIND_RUINS, { filter: ruin => ruin.store[RESOURCE_POWER] > 0 })[0];
    if (target) return false;

    target = targetRoom.find(FIND_DROPPED_RESOURCES, { filter: droped => droped.resourceType === RESOURCE_POWER })[0];
    if (target) return false;

    return true;
}

function findPower(room) {
    const observer = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_OBSERVER})[0];
    if(!observer) return;
    const storage = room.storage;
    if(storage && storage.store[RESOURCE_POWER] > 50000) return;

    const powerTasks = room.memory.tasks.powerTasks;
    if (!powerTasks) {
        room.memory.tasks.powerTasks = [];
        return;
    }
    if (powerTasks.length) return;

    const powerRooms = room.memory.powerRooms;
    if (!room.memory.powerRooms) {
        room.memory.powerRooms = {
            rooms: [],
            obIndex: 0,
            haveVision: null,
        }
        return;
    }

    if (!powerRooms.rooms.length) return;

    if (powerRooms.haveVision) {
        let powerTask = checkRoomPB(powerRooms.haveVision);
        if (powerTask) {
            powerTasks.push(powerTask);
            console.log(`found powerBank: ${powerRooms.haveVision}`);
        }

        powerRooms.haveVision = null;
    }


    if(Game.time % 50 === 0) {
        observerRoom(observer, powerRooms);
    }
}

function checkRoomPB(haveVisionName) {
    const haveVisionRoom = Game.rooms[haveVisionName];
    if (!haveVisionRoom) {
        return null;
    }
    const powerBank = haveVisionRoom.find(FIND_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_POWER_BANK })[0];

    if (powerBank && powerBank.power >= 3000 && powerBank.ticksToDecay >= 2500) {
        let powerTask = {
            roomName: haveVisionName,
            status: 1,
            space: roomUtil.getPosAccessSpace(haveVisionRoom, powerBank.pos),
            decayTime: Game.time + powerBank.ticksToDecay,
            amount: powerBank.power,
        }

        return powerTask;
    }

    return null;
}

function observerRoom(observer, powerRooms) {
    const obRoomName = powerRooms.rooms[powerRooms.obIndex];
    let result = observer.observeRoom(obRoomName);
    if(result === OK) {
        powerRooms.haveVision = obRoomName;
        powerRooms.obIndex = (powerRooms.obIndex + 1) % powerRooms.rooms.length;
    }

    console.log(`ob room ${obRoomName}: ${result}`);
}