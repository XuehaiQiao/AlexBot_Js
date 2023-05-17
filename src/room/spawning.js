const { roomInfo } = require("../config");
const creepLogic = require("../creeps");
// const creepTypes2 = ['carrier2', 'harvester2', 'upgrader2', 'builder2']; // 'mineralCarrier'

function spawnCreeps(room) {
    // return if no idle spawn
    var availableSpawns = room.find(FIND_MY_SPAWNS, {filter: function(spawn) {
        return spawn.spawning == null;
    }});
    if (availableSpawns.length == 0){
        return;
    }

    function spawnCreepUsingSpawnData(creepSpawnData) {
        if (!creepSpawnData) return -100;
        
        // find the first available spawn in the room
        var spawn = availableSpawns[0];
        let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory});
    
        console.log(room, "Tried to Spawn:", creepSpawnData.memory.role, result);
        return result;
    }

    let types = ['carrier2', 'harvester2', 'upgrader2', 'builder2'];
    if(roomInfo[room.name] && roomInfo[room.name].managerPos) {
        // added 'manager' and 'mineralCarrier'
        types = ['carrier2', 'harvester2', 'manager', 'upgrader2', 'builder2', 'mineralCarrier']; // 
    }
    if(_.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType == STRUCTURE_EXTRACTOR)) {
        types.push('miner')
    }

    // find a creep type that returns true for the .spawn() function
    let creepTypeNeeded = _.find(types, function(type) {
        return creepLogic[type].spawn(room);
    });

    // get the data for spawning a new creep of creepTypeNeeded
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room);
    spawnCreepUsingSpawnData(creepSpawnData);
    if(creepTypeNeeded) return;
    
    // ---------------------------------------------------------------------------------------------------

    // serviver creeps
    let creeps = room.find(FIND_MY_CREEPS);
    if (creeps.length < 2 && result == ERR_NOT_ENOUGH_ENERGY) {
        var spawn = availableSpawns[0];
        spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'Servivor001-' + Game.time, {memory: {role: 'harvester', status: 1}});
        console.log("Spawning backup tiny Servivor001");
        return;
    }

    // stop sending outSourcer if base room found enemy
    var hostileParts = [WORK, ATTACK, RANGED_ATTACK, HEAL, CLAIM];
    var enemy = _.find(room.find(FIND_HOSTILE_CREEPS), creep =>
        _.filter(creep.body, object => hostileParts.includes(object.type)).length > 0
    );
    if (enemy) return
    
    if(room.memory.outSourceRooms) {
        // create defencer
        for (roomName of room.memory.outSourceRooms) {
            if (Game.rooms[roomName]) {
                var hostileCreeps = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
                var invaderCore = _.find(Game.rooms[roomName].find(FIND_HOSTILE_STRUCTURES), struct => struct.structureType == STRUCTURE_INVADER_CORE);
                
                if (hostileCreeps.length > 0) {
                    // create defender
                    let creepSpawnData = creepLogic.defender.spawn(room, roomName) && creepLogic.defender.spawnData(room, roomName);
                    if(creepSpawnData) {
                        spawnCreepUsingSpawnData(creepSpawnData);
                        return;
                    }
                }
                if (invaderCore) {
                    // create defender
                    let creepSpawnData = creepLogic.defender.spawn(room, roomName) && creepLogic.defender.spawnData(room, roomName, invaderCore.id);
                    if(creepSpawnData) {
                        spawnCreepUsingSpawnData(creepSpawnData);
                        return;
                    }
                }
            }
        }

        // remote harvest
        let outSourceTypes;
        // level 6 to use remoteHarvester/remoteHauler
        if(room.energyCapacityAvailable < 550) {
            outSourceTypes = []
        }
        else if(room.energyCapacityAvailable < 1300) {
            outSourceTypes = ['remoteHarvester', 'remoteHauler'];
        }
        else if(room.energyCapacityAvailable >= 5600) {
            outSourceTypes = ['keeperAttacker', 'claimer', 'remoteHarvester', 'remoteHauler', 'remoteMiner'];
        }
        else {
            outSourceTypes = ['claimer', 'remoteHarvester', 'remoteHauler'];
        }

        // create outsource creeps / claim creeps (copy of about spawn logic)
        for(const cType of outSourceTypes) {
            let needCreepRoomName = _.find(room.memory.outSourceRooms, roomName => creepLogic[cType].spawn(room, roomName));
            if(needCreepRoomName) {
                let creepSpawnData = creepLogic[cType].spawnData(room, needCreepRoomName);
                spawnCreepUsingSpawnData(creepSpawnData);
                return;
            }
        }
    }
}

module.exports = spawnCreeps;