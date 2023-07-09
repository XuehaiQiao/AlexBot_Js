const creepLogic = require("../creeps");

module.exports = {
    creepCounts: {
        energyTransporter: 13,
        thoriumTransporter: 30,
        upgrader2: 5,
        builder2: 2,
    },

    assignBoostRoom: function () {
        // todo
    },

    roomBoost: function (room) {
        // todo
    },

    creepDesigns: {
        // todo
    },

    spawn: function (room, spawn, spawnCreep) {
        const boostRoomName = room.memory.boostRoom;
        if (!boostRoomName) return false;
        const baseStorage = room.storage;
        const baseTerminal = room.terminal;
        if (!baseStorage || !baseTerminal) return false;

        const hostileParts = [ATTACK, RANGED_ATTACK, WORK, HEAL, CLAIM, CARRY];
        let hostileCreeps = room.find(FIND_HOSTILE_CREEPS, {
            filter: (
                c => _.find(hostileParts, partType => c.getActiveBodyparts(partType) > 0)
            )
        });
        if (hostileCreeps.length) return false;

        const boostRoom = Game.rooms[boostRoomName];
        // claimer
        if (!boostRoom || !boostRoom.controller.my) {
            let claimerCount;
            if (global.roomCensus[boostRoomName] && global.roomCensus[boostRoomName]['claimer']) claimerCount = global.roomCensus[boostRoomName]['claimer'];
            else claimerCount = 0;
            if (claimerCount === 0) {
                let creepSpawnData = {
                    name: 'claim' + Game.time % 10000,
                    body: [CLAIM, MOVE],
                    memory: { role: 'claimer', targetRoom: boostRoomName, base: room.name, claim: true }
                }
                let result = spawnCreep(room, spawn, creepSpawnData);
                if (result === OK) return true;
            }
            return false;
        }

        const thorium = boostRoom.find(FIND_MINERALS, { filter: mine => mine.mineralType === RESOURCE_THORIUM })[0];
        if (!thorium) {
            delete room.memory.boostRoom;
            return false;
        }

        // builder2
        let builderCount;
        if (global.roomCensus[boostRoomName] && global.roomCensus[boostRoomName]['builder2']) builderCount = global.roomCensus[boostRoomName]['builder2'];
        else builderCount = 0;
        if (builderCount < this.creepCounts.builder2 && boostRoom.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
            let creepSpawnData = {
                name: 'builder2' + Game.time % 10000,
                body: [...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)],
                memory: { role: 'builder2', base: room.name, targetRoom: boostRoomName }
            }

            let result = spawnCreep(room, spawn, creepSpawnData);
            if (result === OK) return true;
            else return false;
        }

        // carrier2
        let carrierCount;
        if (global.roomCensus[boostRoomName] && global.roomCensus[boostRoomName]['carrier2']) carrierCount = global.roomCensus[boostRoomName]['carrier2'];
        else carrierCount = 0;
        if (carrierCount < 1) {
            let creepSpawnData = {
                name: 'carrier2' + Game.time % 10000,
                body: [...new Array(20).fill(CARRY), ...new Array(20).fill(MOVE)],
                memory: { role: 'carrier2', base: room.name, targetRoom: boostRoomName }
            }

            let result = spawnCreep(room, spawn, creepSpawnData);
            if (result === OK) return true;
            else return false;
        }

        //remoteHarvester
        if (creepLogic.remoteHarvester.spawn(room, boostRoomName)) {
            let creepSpawnData = creepLogic.remoteHarvester.spawnData(room, boostRoomName);
            let result = spawnCreep(room, spawn, creepSpawnData);
            if (result === OK) return true;
            else return false;
        }

        const controller = boostRoom.controller;
        if (controller.level < 6) {
            // roadRepairer
            if (creepLogic.roadRepairer.spawn(room, boostRoomName)) {
                let creepSpawnData = creepLogic.roadRepairer.spawnData(room, boostRoomName);
                let result = spawnCreep(room, spawn, creepSpawnData);
                if (result === OK) return true;
                else return false;
            }

            // upgrader2
            let upgraderCount;
            if (global.roomCensus[boostRoomName] && global.roomCensus[boostRoomName]['upgrader2']) upgraderCount = global.roomCensus[boostRoomName]['upgrader2'];
            else upgraderCount = 0;
            if (upgraderCount < this.creepCounts.upgrader2) {
                let boostInfo = { GH: 30 };
                let totalGH2O = baseTerminal.store['GH2O'] + baseStorage.store['GH2O'];
                if (totalGH2O > 900) boostInfo = { GH2O: 30 };

                let creepSpawnData = {
                    name: 'upgrader2' + Game.time % 10000,
                    body: [...new Array(30).fill(WORK), ...new Array(5).fill(CARRY), ...new Array(15).fill(MOVE)],
                    memory: {
                        role: 'upgrader2',
                        targetRoom: boostRoomName,
                        base: room.name,
                        // boost: true,
                        // boostInfo: boostInfo,
                    }
                }

                let result = spawnCreep(room, spawn, creepSpawnData);
                if (result === OK) return true;
                else return false;
            }

            // transporter
            let transCount;
            if (global.roomCensus[boostRoomName] && global.roomCensus[boostRoomName]['transporter']) transCount = global.roomCensus[boostRoomName]['transporter'];
            else transCount = 0;
            if (transCount < this.creepCounts.energyTransporter && room.storage && room.storage.store[RESOURCE_ENERGY] > 100000) {
                let creepSpawnData = {
                    name: 'transporter' + Game.time % 10000,
                    body: [...new Array(32).fill(CARRY), ...new Array(16).fill(MOVE)],
                    memory: { role: 'transporter', targetRoom: boostRoomName, base: room.name, workType: 4 }
                }
                let result = spawnCreep(room, spawn, creepSpawnData);
                if (result === OK) return true;
                else return false;
            }
        }
        else {
            // miner
            let minerCount;
            if (global.roomCensus[boostRoomName] && global.roomCensus[boostRoomName]['miner']) minerCount = global.roomCensus[boostRoomName]['miner'];
            else minerCount = 0;
            if (minerCount < 1) {
                let creepSpawnData = {
                    name: 'miner' + Game.time % 10000,
                    body: [...new Array(33).fill(WORK), ...new Array(17).fill(MOVE)],
                    memory: {
                        role: 'miner',
                        targetRoom: boostRoomName,
                        base: room.name,
                        boost: true,
                        boostInfo: { UO: 33 },
                        stripMine: true,
                    }
                }

                let result = spawnCreep(room, spawn, creepSpawnData);
                if (result === OK) return true;
                else return false;
            }

            const extractor = boostRoom.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_EXTRACTOR })[0];
            if (extractor) {
                // transporter
                let transCount;
                if (global.roomCensus[boostRoomName] && global.roomCensus[boostRoomName]['transporter']) transCount = global.roomCensus[boostRoomName]['transporter'];
                else transCount = 0;
                if (transCount < this.creepCounts.thoriumTransporter && room.storage) {
                    let creepSpawnData = {
                        name: 'transporter' + Game.time % 10000,
                        body: [...new Array(2).fill(CARRY), ...new Array(2).fill(MOVE)],
                        memory: { role: 'transporter', targetRoom: boostRoomName, base: room.name, workType: 4 }
                    }
                    let result = spawnCreep(room, spawn, creepSpawnData);
                    if (result === OK) return true;
                    else return false;
                }
            }
            else {
                const extractorConstruct = boostRoom.find(FIND_MY_CONSTRUCTION_SITES, { filter: construct => construct.structureType === STRUCTURE_EXTRACTOR })[0];
                if(!extractorConstruct) {
                    boostRoom.createConstructionSite(thorium.pos, STRUCTURE_EXTRACTOR);
                }
            }
        }

        return false;
    }

}