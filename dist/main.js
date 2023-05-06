/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid].call(this, __modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/main.js **********/
__modules[0] = function(module, exports) {
const creepLogic = __require(1,0);
const roomLogic = __require(2,0);
const tools = __require(3,0);
__require(4,0);

module.exports.loop = function () {
    if (Game.cpu.bucket < 20) {
        console.log('CPU bucket is low, skip this tick..');
        return;
    }

    console.log("---------- Start Tick: " + Game.time + " ----------");
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    let totalRoomCpu = -Game.cpu.getUsed();
    roomLogic.roomCensus();
    _.forEach(Game.myRooms, r => {
        roomLogic.spawning(r);
        roomLogic.repairing(r);
        roomLogic.defending(r);
        roomLogic.healing(r);
        roomLogic.linkTransfer(r);
        roomLogic.labReaction(r);

        if(r.controller.level == 8) {
            let pSpawns = r.find(FIND_MY_STRUCTURES, {filter: struct => (
                struct.structureType == STRUCTURE_POWER_SPAWN && 
                struct.store[RESOURCE_ENERGY] >= 50 &&
                struct.store[RESOURCE_POWER] > 0
            )});

            if(pSpawns.length > 0) {
                pSpawns[0].processPower();
            }
        }
    });

    roomLogic.resourceBalancing(Game.myRooms);

    totalRoomCpu += Game.cpu.getUsed();
    console.log('total room cpu: ', totalRoomCpu);
    let totalCreepCpu = -Game.cpu.getUsed();
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        let role = creep.memory.role;
        if (creepLogic[role]) creepLogic[role].run(creep);
    }

    totalCreepCpu += Game.cpu.getUsed();
    console.log('total creep cpu: ', totalCreepCpu);

    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }

    roomLogic.exportStats();
    console.log('CPU bucket: ', Game.cpu.bucket);
    console.log("---------- End Tick, No Errors ----------");
}
return module.exports;
}
/********** End of module 0: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/main.js **********/
/********** Start module 1: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/index.js **********/
__modules[1] = function(module, exports) {
let creepLogic = {
    harvester:      __require(5,1),
    carrier:        __require(6,1),
    upgrader:       __require(7,1),
    builder:        __require(8,1),
    miner:          __require(9,1),
    mineralCarrier: __require(10,1),
    
    harvester2:     __require(11,1),
    carrier2:       __require(12,1),
    upgrader2:      __require(13,1),
    builder2:       __require(14,1),
    manager:        __require(15,1),

    claimer:        __require(16,1),
    outSourcer:     __require(17,1),
    remoteHarvester:__require(18,1),
    remoteHauler:   __require(19,1),

    defender:       __require(20,1),
    wrecker:        __require(21,1),
    medic:          __require(22,1),
    scout:          __require(23,1),
    transporter:    __require(24,1),
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 1: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/index.js **********/
/********** Start module 2: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/index.js **********/
__modules[2] = function(module, exports) {
let roomLogic = {
    spawning:     __require(25,2),
    repairing:    __require(26,2),
    mainLogic:    __require(27,2),
    defending:    __require(28,2),
    healing:      __require(29,2),
    linkTransfer: __require(30,2),
    roomCensus:   __require(31,2),
    exportStats:  __require(32,2),
    labReaction:  __require(33,2),
    resourceBalancing: __require(34,2),
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 2: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/index.js **********/
/********** Start module 3: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/index.js **********/
__modules[3] = function(module, exports) {
let tools = {
    roomPlanner:  __require(35,3),
}

module.exports = tools;
return module.exports;
}
/********** End of module 3: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/index.js **********/
/********** Start module 4: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/index.js **********/
__modules[4] = function(module, exports) {
let files = {
    creep: __require(36,4),
    room: __require(37,4),
}
return module.exports;
}
/********** End of module 4: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/index.js **********/
/********** Start module 5: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/harvester.js **********/
__modules[5] = function(module, exports) {
const { roomInfo } = __require(38,5);

module.exports = {
        properties: {
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 4},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 4},
            2: {maxEnergyCapacity: 850, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 2},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 3},
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        if(creep.memory.status == 0 && creep.store.getFreeCapacity() == 0) {
            creep.memory.status = 1;
            creep.say('🚩 transfer');
        }
        else if (creep.memory.status != 0 && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = 0;
            creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
            creep.say('🔄 harvest');
        }
        if(creep.memory.status == 0) {
            var dropedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount > creep.store.getCapacity() / 2});
            if (dropedResource) {
                if(creep.pickup(dropedResource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedResource);
                }
                return;
            }
            var sourceRuin = _.find(creep.room.find(FIND_RUINS), ruin => ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
            if (sourceRuin) {
                if(creep.withdraw(sourceRuin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sourceRuin, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if (typeof creep.memory.target === 'undefined' || sources.length <= creep.memory.target) {
                creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
            }
            var source = sources[creep.memory.target];
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            var extensionSpawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function(object) {
                    return (object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN) && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (extensionSpawn) {
                if(creep.transfer(extensionSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extensionSpawn);
                }
                return;
            }
            var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function(object) {
                    return object.structureType == STRUCTURE_TOWER && object.store.getFreeCapacity(RESOURCE_ENERGY) > 300
                }
            });
            if (tower) {
                if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
                return;
            }
            if (roomInfo[creep.room.name]) {
                creep.moveTo(roomInfo[creep.room.name].restPos);
                return;
            }

            return;
        }
    },
    spawn: function(room) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
        console.log('Harvesters: ' + harvesters.length, room.name);
        if (room.energyCapacityAvailable >= this.properties.stages[4].maxEnergyCapacity) {
            if (harvesters.length < this.properties.stages[4].number) return true;
        }
        else if (room.energyCapacityAvailable >= this.properties.stages[2].maxEnergyCapacity) {
            if (harvesters.length < this.properties.stages[2].number) return true;
        }
        else if (harvesters.length < this.properties.stages[1].number) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Harvester' + Game.time;
            let body;
            let memory = {role: 'harvester', status: 1};
            if(room.energyCapacityAvailable >= this.properties.stages[4].maxEnergyCapacity) {
                body = this.properties.stages[4].bodyParts;
            }
            else if(room.energyCapacityAvailable >= this.properties.stages[2].maxEnergyCapacity) {
                body = this.properties.stages[2].bodyParts;
            }
            else {
                body = [WORK, CARRY, MOVE]
            }

            return {name, body, memory};
    }
};
return module.exports;
}
/********** End of module 5: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/harvester.js **********/
/********** Start module 6: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/carrier.js **********/
__modules[6] = function(module, exports) {
module.exports = {
    properties: {
        type: 'carrier'
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.status == 0 && creep.store.getFreeCapacity() == 0) {
            creep.memory.status = 1;
            creep.say('🚩 transfer');
        }
        else if (creep.memory.status != 0 && creep.store.getUsedCapacity() == 0) {
            creep.memory.status = 0;
            creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
            creep.say('🔄 harvest');
        }
        if(creep.memory.status == 0) {
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoom(creep.memory.targetRoom);
                return;
            }
            var dropedRecource = _.find(creep.room.find(FIND_DROPPED_RESOURCES));
            if (dropedRecource) {
                if(creep.pickup(dropedRecource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedRecource, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            var sourceRuin = _.find(creep.room.find(FIND_RUINS), ruin => ruin.store.getUsedCapacity() > 0);
            if (sourceRuin) {
                var resourceType = _.find(Object.keys(sourceRuin.store), resource => sourceRuin.store[resource] > 0);
                if(creep.withdraw(sourceRuin, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sourceRuin, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            var notMyStructure = _.find(creep.room.find(FIND_HOSTILE_STRUCTURES), structure => structure.store && structure.store.getUsedCapacity() > 0);
            if (notMyStructure) {
                var resourceType = _.find(Object.keys(notMyStructure.store), resource => notMyStructure.store[resource] > 0);
                if(creep.withdraw(notMyStructure, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(notMyStructure, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            creep.moveTo(30, 2);
            return;
        }
        else {
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }
            var storage = creep.room.storage;

            if(!storage || storage.store.getFreeCapacity() == 0) {
                creep.moveTo(30, 2);
                return;
            }

            var resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if(creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
    },
    spawn: function(room) {
        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.room.name == room.name);
        console.log('carriers: ' + carriers.length, room.name);
        if (room.storage && carriers.length < 1) {
            return true;
        }

        return false;
    },
    spawnData: function(room) {
            let name = 'carrier' + Game.time;
            let body = [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE];
            let memory = {role: 'carrier', status: 1};

            return {name, body, memory};
    }
};
return module.exports;
}
/********** End of module 6: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/carrier.js **********/
/********** Start module 7: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/upgrader.js **********/
__modules[7] = function(module, exports) {
module.exports = {
    properties: {
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 6},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 5},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 3},
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        if(creep.memory.status == 0 && creep.store.getFreeCapacity() == 0) {
            creep.memory.status = 1;
            creep.say('🚩 upgrade');
        }
        else if (creep.memory.status != 0 && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = 0;
            creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
            creep.say('🔄 harvest');
        }

        if(creep.memory.status == 0) {
            var dropedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount > creep.store.getCapacity() / 2});
            if (dropedResource) {
                if(creep.pickup(dropedResource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedResource);
                }
                return;
            }
            var sourceRuin = _.find(creep.room.find(FIND_RUINS), ruin => ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
            if (sourceRuin) {
                if(creep.withdraw(sourceRuin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sourceRuin, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if (typeof creep.memory.target === 'undefined' || sources.length <= creep.memory.target) {
                creep.memory.target = Math.floor(Math.random() * creep.room.find(FIND_SOURCES_ACTIVE).length);
            }
            var source = sources[creep.memory.target];
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    },
    spawn: function(room) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);
        console.log('Upgraders: ' + upgraders.length, room.name);
        if (room.energyCapacityAvailable >= this.properties.stages[4].maxEnergyCapacity) {
            if (upgraders.length < this.properties.stages[4].number) return true;
        }
        else if (room.energyCapacityAvailable >= this.properties.stages[2].maxEnergyCapacity) {
            if (upgraders.length < this.properties.stages[2].number) return true;
        }
        else if (upgraders.length < this.properties.stages[1].number) {
            return true;
        }
    },
    spawnData: function(room) {
        
        let name = 'Upgrader' + Game.time;
        let body;
        let memory = {role: 'upgrader', status: 1, target: 0};
        if(room.energyCapacityAvailable >= this.properties.stages[4].maxEnergyCapacity) {
            body = this.properties.stages[4].bodyParts;
        }
        else if(room.energyCapacityAvailable >= this.properties.stages[2].maxEnergyCapacity) {
            body = this.properties.stages[2].bodyParts;
        }
        else {
            body = this.properties.stages[1].bodyParts;
        }
    
        return {name, body, memory};
    }
};
return module.exports;
}
/********** End of module 7: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/upgrader.js **********/
/********** Start module 8: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/builder.js **********/
__modules[8] = function(module, exports) {
const { roomInfo } = __require(38,8);
const structureLogic = __require(39,8);

module.exports = {
    properties: {
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 6, wall: 1000},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 5, wall: 1000000},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 3, wall: 10000000},
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
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
        if(creep.memory.building == 1) {
            var targets;
            targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
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
            var sourceRuin = creep.pos.findClosestByRange(FIND_RUINS, {filter: ruin => ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0});
            if (sourceRuin) {
                if(creep.withdraw(sourceRuin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sourceRuin, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            var storage = creep.room.storage;
            if (storage && storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
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
        if (room.energyCapacityAvailable >= this.properties.stages[4].maxEnergyCapacity) {
            if (builders.length < this.properties.stages[4].number) return true;
        }
        else if (room.energyCapacityAvailable >= this.properties.stages[2].maxEnergyCapacity) {
            if (builders.length < this.properties.stages[2].number) return true;
        }
        else if (builders.length < this.properties.stages[1].number) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Builder' + Game.time;
            let body;
            let memory = {role: 'builder', building: 1};
            if(room.energyCapacityAvailable >= this.properties.stages[4].maxEnergyCapacity) {
                body = this.properties.stages[4].bodyParts;
            }
            else if(room.energyCapacityAvailable >= this.properties.stages[2].maxEnergyCapacity) {
                body = this.properties.stages[2].bodyParts;
            }
            else {
                body = [WORK, CARRY, MOVE]
            }

            return {name, body, memory};
    }
};
return module.exports;
}
/********** End of module 8: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/builder.js **********/
/********** Start module 9: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/miner.js **********/
__modules[9] = function(module, exports) {

module.exports = {
    properties: {
        role: "miner"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.rest) {
            creep.memory.rest -= 1;
        }

        creep.workerSetStatus();
        if(creep.memory.status) {
            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if(creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
        else {
            let mine = creep.room.find(FIND_MINERALS)[0];
            let result = creep.harvest(mine)
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(mine);
                let dropedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
                if(dropedResources.length) creep.pickup(dropedResources[0]);
            }
            else {
                creep.memory.rest = 5;
            }
        }
    },
    spawn: function(room) {
        let mineral = room.find(FIND_MINERALS)[0];
        let extractor = _.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType == STRUCTURE_EXTRACTOR);
        if(mineral.mineralAmount == 0) return false;
        if(!extractor) return false;
        if(room.storage && room.storage.store[mineral.mineralType] > 50000) return false;
        
        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body = [...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)];
        let memory = {role: this.properties.role, status: 0, base: room.name};

        return {name, body, memory};
    },
};
return module.exports;
}
/********** End of module 9: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/miner.js **********/
/********** Start module 10: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/mineralCarrier.js **********/
__modules[10] = function(module, exports) {
const { reactionResources } = __require(40,10);

module.exports = {
    properties: {
        type: 'mineralCarrier',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[CARRY, MOVE, CARRY, MOVE], number: 0},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(20).fill(CARRY), ...new Array(10).fill(MOVE)], number: 1},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.ticksToLive < 30) {
            if(creep.store.getUsedCapacity() > 0) creep.memory.status = 1;
            else creep.suicide();
            return;
        }
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        creep.workerSetStatus();

        const task = creep.room.memory.tasks.labTasks[0];

        let allLabs = creep.room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LAB});
        let outterLabs =  _.filter(allLabs, lab => !creep.room.memory.labs.center.includes(lab.id));
        let centerLabs = _.map(creep.room.memory.labs.center, id => Game.getObjectById(id));
        if(!creep.room.memory.labStatus) {
            for(const i in allLabs) {
                let lab = allLabs[i];
                if(lab.mineralType && lab.store.getUsedCapacity(lab.mineralType) > 0) {
                    labWithdraw(creep, lab);
                    return;
                }
            }

            if(creep.store.getUsedCapacity() > 0) {
                let storage = creep.room.storage;
                if(storage) {
                    let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                    if(creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveToNoCreepInRoom(storage);
                    }
                    
                }
            }
            else {
                creep.toResPos();
            }
        }
        else if(creep.room.memory.labStatus == 1) {
            if(creep.store.getUsedCapacity() > 0) {
                let storage = creep.room.storage;
                if(storage) {
                    let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                    if(creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveToNoCreepInRoom(storage);
                    }
                    
                }
            }
            else {
                creep.toResPos();
            }
        }
        else if(creep.room.memory.labStatus == 2) {
            for (const i in centerLabs) {
                let lab = centerLabs[i];
                if(!lab.mineralType || lab.store[lab.mineralType] < 5) {
                    let resourceType = reactionResources[task.resourceType][i]
                    if(creep.store[resourceType] === 0 && creep.room.storage.store[resourceType] === 0) {
                        creep.room.memory.tasks.labTasks[0].amount = 0;
                    }
                    labTransfer(creep, lab, resourceType);
                    return;
                }
            }
        }
        else if(creep.room.memory.labStatus == 3) {
            for(const i in outterLabs) {
                let lab = outterLabs[i];
                if(lab.mineralType && lab.store.getUsedCapacity(lab.mineralType) > 0) {
                    labWithdraw(creep, lab);
                    return;
                }
            }
        }

    },
    spawn: function(room) {
        if(!room.memory.tasks || !room.memory.tasks.labTasks || room.memory.tasks.labTasks.length == 0) {
            return false;
        }
        if(!room.memory.labs || !room.memory.labs.center || room.memory.labs.center.length != 2) {
            return false;
        }

        let stage = this.getStage(room);

        let creepCount;
        if(global.roomCensus[room.name][this.properties.type]) creepCount = global.roomCensus[room.name][this.properties.type]
        else creepCount = 0;

        return creepCount < this.properties.stages[stage].number? true : false;
    },
    spawnData: function(room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        let body = this.properties.stages[stage].bodyParts;
        let memory = {role: this.properties.type, status: 1, base: room.name};

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
    }
};
var labWithdraw = function(creep, targetLab) {
    if(creep.memory.status) {
        let storage = creep.room.storage;
        if(storage) {
            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if(creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(storage);
            }
            
        }
    }
    else {
        if(targetLab) {
            if(creep.withdraw(targetLab, targetLab.mineralType) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(targetLab);
            }
        }
    }
};

var labTransfer = function(creep, targetLab, resourceType) {
    if(targetLab.mineralType && targetLab.mineralType != resourceType) {
        console.log(creep.room, "Lab transfer error, mineral type not correct");
    }
    if(creep.store.getUsedCapacity() > 0) {
        let creepResourceTypes = _.filter(Object.keys(creep.store), resource => creep.store[resource] > 0);
        if(creepResourceTypes.length > 1 || creepResourceTypes[0] != resourceType) {
            if(creep.transfer(creep.room.storage, creepResourceTypes[0]) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(creep.room.storage);
            }
            return;
        }
    }
    if(creep.memory.status) {
        if((!targetLab.mineralType || targetLab.store.getFreeCapacity(targetLab.mineralType) > 0) && creep.store[resourceType] > 0) {
            if(creep.transfer(targetLab, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(targetLab);
            }
        }
        else {
            let storage = creep.room.storage;
            if(storage) {
                let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                if(creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(storage);
                }
                
            }
        }
    }
    else {
        let storage = creep.room.storage;
        if(storage) {
            if(storage.store[resourceType] == 0) {
                console.log(creep.room, "mineral " + resourceType + " not enough");
                return;
            }
            let result = creep.withdraw(storage, resourceType);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(storage);
            }
            else if(result == OK) {
                creep.memory.status = 1;
            }
        }
    }
};
return module.exports;
}
/********** End of module 10: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/mineralCarrier.js **********/
/********** Start module 11: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/harvester2.js **********/
__modules[11] = function(module, exports) {
module.exports = {
    properties: {
        role: 'harvester2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, WORK, CARRY, MOVE], number: 1},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], number: 1},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 1},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], number: 1},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.rest) {
            creep.memory.rest -= 1;
            return;
        }
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        let result = creep.harvestEnergy();

        if(result == ERR_NOT_ENOUGH_RESOURCES) {
            let source = creep.room.find(FIND_SOURCES)[creep.memory.target];
            if(source) creep.memory.rest = source.ticksToRegeneration;
        }
    },
    spawn: function(room) {
        var sourceCount = Math.min(2, room.find(FIND_SOURCES).length);

        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        if (creepCount < sourceCount) {
            return true;
        }
    },
    spawnData: function(room) {
        let stage = this.getStage(room);
        let name = this.properties.role + Game.time; 
        let body = this.properties.stages[stage].bodyParts;

        const existingThisTypeCreeps = _.filter(Game.creeps, creep => (
            creep.memory.role == this.properties.role && 
            creep.memory.base == room.name &&
            !(creep.ticksToLive < creep.body.length * 3)
        ));
        var existingTargets = _.map(existingThisTypeCreeps, creep => creep.memory.target)

        let sourceCount = room.find(FIND_SOURCES).length;
        var sourceTarget;
        for(var i = 0; i < sourceCount; i++) {
            if (!existingTargets.includes(i)) {
                sourceTarget = i;
                break;
            }
        }

        let memory = {role: this.properties.role, status: 0, target: sourceTarget, base: room.name};

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
    }
};
return module.exports;
}
/********** End of module 11: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/harvester2.js **********/
/********** Start module 12: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/carrier2.js **********/
__modules[12] = function(module, exports) {
module.exports = {
    properties: {
        type: 'carrier2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[CARRY, MOVE, CARRY, MOVE], number: 2},
            2: {maxEnergyCapacity: 550, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            3: {maxEnergyCapacity: 800, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(16).fill(CARRY), ...new Array(8).fill(MOVE)], number: 2},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(20).fill(CARRY), ...new Array(10).fill(MOVE)], number: 2},
            8: {maxEnergyCapacity: 10000, bodyParts:[...new Array(24).fill(CARRY), ...new Array(12).fill(MOVE)], number: 2},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        if (creep.memory.restTime > 0) {
            creep.memory.restTime -= 1;
            return;
        }
        creep.workerSetStatus();
        var needFeedStructure = _.find(creep.room.find(FIND_MY_STRUCTURES), (structure) => (
            ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
            (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 300) ||
            (structure.structureType == STRUCTURE_LAB && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        ))
        if(needFeedStructure) {
            this.toNeedFeed(creep);
        }
        else {
            this.toStorage(creep);
        }
    },
    toStorage: function(creep) {
        var storage = creep.room.storage;
        if(!storage) {
            let containers = creep.room.find(FIND_STRUCTURES, {filter: struct => (
                struct.structureType == STRUCTURE_CONTAINER &&
                struct.pos.inRangeTo(creep.room.controller.pos, 3) &&
                struct.store.getFreeCapacity() > 0
            )});
            if(containers.length) {
                storage = containers[0];
            }
        }

        if (!storage || storage.store.getFreeCapacity() == 0) {
            creep.toResPos(10);
        }
        if(creep.memory.status == 0) {
            if(!creep.collectEnergy()) {
                creep.toResPos();
            }
            return;
        }
        else {
            if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(storage);
            }
            return;
        }
    },
    toNeedFeed: function(creep) {
        if(creep.memory.status == 0) {
            creep.takeEnergyFromClosest();

            return;
        }
        else {
            var extensionSpawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function(object) {
                    return (object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN) && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (extensionSpawn) {
                if(creep.transfer(extensionSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(extensionSpawn);
                }
                return;
            }
            var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function(object) {
                    return object.structureType == STRUCTURE_TOWER && object.store.getFreeCapacity(RESOURCE_ENERGY) > 300
                }
            });
            if (tower) {
                if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(tower);
                }
                return;
            }
            var lab = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function(object) {
                    return object.structureType == STRUCTURE_LAB && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            });
            if (lab) {
                if(creep.transfer(lab, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(lab);
                }
                return;
            }
            creep.toResPos();
            return;
        }
    },
    spawn: function(room) {

        var stage = this.getStage(room);

        let creepCount;
        if(global.roomCensus[room.name][this.properties.type]) creepCount = global.roomCensus[room.name][this.properties.type]
        else creepCount = 0;

        return creepCount < this.properties.stages[stage].number? true : false;
    },
    spawnData: function(room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        let body = this.properties.stages[stage].bodyParts;
        let memory = {role: this.properties.type, status: 1, base: room.name};

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
    }
};
return module.exports;
}
/********** End of module 12: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/carrier2.js **********/
/********** Start module 13: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/upgrader2.js **********/
__modules[13] = function(module, exports) {
const { roomInfo } = __require(38,13);

module.exports = {
    properties: {
        type: 'upgrader2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, CARRY, MOVE], number: 1},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, CARRY, CARRY, MOVE, MOVE], number: 3},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, WORK, CARRY, CARRY, MOVE, MOVE, WORK, WORK, CARRY, CARRY, MOVE, MOVE], number: 3},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(6).fill(WORK), ...new Array(6).fill(CARRY), ...new Array(6).fill(MOVE)], number: 1},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(8).fill(WORK), ...new Array(8).fill(CARRY), ...new Array(8).fill(MOVE)], mBodyParts: [...new Array(12).fill(WORK), ...new Array(3).fill(CARRY), ...new Array(6).fill(MOVE)], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], mBodyParts: [...new Array(14).fill(WORK), ...new Array(4).fill(CARRY), ...new Array(7).fill(MOVE)], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], mBodyParts: [...new Array(30).fill(WORK), ...new Array(5).fill(CARRY), ...new Array(15).fill(MOVE)], number: 0},
            8: {maxEnergyCapacity: 10000, bodyParts:[...new Array(15).fill(WORK), ...new Array(15).fill(CARRY), ...new Array(15).fill(MOVE)], mBodyParts: [...new Array(15).fill(WORK), ...new Array(4).fill(CARRY), ...new Array(8).fill(MOVE)], number: 1},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        if(roomInfo[creep.room.name] && roomInfo[creep.room.name].managerPos) {
            this.managerLogic(creep);
        }
        else {
            this.noManagerLogic(creep);
        }
    },

    managerLogic: function(creep) {
        creep.workerSetStatus();
        if(!creep.memory.status) {
            creep.takeEnergyFromControllerLink();
            creep.upgradeController(creep.room.controller);
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {reusePath: 10});
            }
            if(creep.store[RESOURCE_ENERGY] <= 40) creep.memory.status = 0;
        }
    },

    noManagerLogic: function(creep) {
        creep.workerSetStatus();
        if(creep.memory.status) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {reusePath: 10});
            }
        }
        else {
            creep.takeEnergyFromClosest();
        }
    },
    spawn: function(room) {
        let creepCount;
        if(global.roomCensus[room.name][this.properties.type]) creepCount = global.roomCensus[room.name][this.properties.type]
        else creepCount = 0;

        let storage = room.storage;
        let num = this.properties.stages[this.getStage(room)].number;
        if(room.controller.level == 8){
            if(creepCount >= 1) return false
            else if ((storage && storage.store[RESOURCE_ENERGY] > 400000) || room.controller.ticksToDowngrade < 50000) {
                return true
            }
            else return false;
        }
        if (storage && storage.store[RESOURCE_ENERGY] > 200000) {
            num += Math.min(Math.ceil((storage.store[RESOURCE_ENERGY] + 300000) / (1 + storage.store.getFreeCapacity())), 4);
        }
        return creepCount < num ? true : false;
    },
    spawnData: function(room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        let body;
        let storage = room.storage;
        if(storage && storage.store[RESOURCE_ENERGY] < 50000) body = [WORK, CARRY, CARRY, MOVE];
        else if(roomInfo[room.name] && roomInfo[room.name].managerPos) body = this.properties.stages[stage].mBodyParts;
        else body = this.properties.stages[stage].bodyParts;

        let memory = {role: this.properties.type, status: 1, target: 0, base: room.name};
    
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
    }
};
return module.exports;
}
/********** End of module 13: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/upgrader2.js **********/
/********** Start module 14: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/builder2.js **********/
__modules[14] = function(module, exports) {
const structureLogic = __require(39,14);
const { roomInfo } = __require(38,14);

module.exports = {
    properties: {
        type: "builder2",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 3},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 3},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 1},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(6).fill(WORK), ...new Array(6).fill(CARRY), ...new Array(6).fill(MOVE)], number: 1},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(9).fill(WORK), ...new Array(9).fill(CARRY), ...new Array(9).fill(MOVE)], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], number: 1},
            8: {maxEnergyCapacity: 10000, bodyParts:[...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], number: 1},
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        creep.workerSetStatusWithAction(null, () => {
            creep.memory.targetId = null;
            this.assignTarget(creep);
        })
        if(creep.memory.status) {
            var target = this.assignTarget(creep);
            if (!target) {
                if (roomInfo[creep.room.name]) {
                    creep.moveTo(roomInfo[creep.room.name].restPos);
                }
                return;
            }
            if (!target.hits) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            
        }
        else {
            creep.takeEnergyFromClosest();
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
        let creepCount;
        if(global.roomCensus[room.name][this.properties.type]) creepCount = global.roomCensus[room.name][this.properties.type]
        else creepCount = 0;
        
        var stage = this.getStage(room);
        return creepCount < this.properties.stages[stage].number? true : false;
    },
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
        if (!creep.memory.targetId || !Game.getObjectById(creep.memory.targetId)) {
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
                creep.memory.targetId = target.id;
                return Game.getObjectById(target.id);
            }
        }
        else {
            let target = Game.getObjectById(creep.memory.targetId);
            if(target.hits && target.hits >= structureLogic.wall.getTargetHits(creep.room)) {
                creep.memory.targetId = null;
                return null;
            }

            return target;
        }
    }
};
return module.exports;
}
/********** End of module 14: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/builder2.js **********/
/********** Start module 15: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/manager.js **********/
__modules[15] = function(module, exports) {
const { roomInfo, roomResourceConfig } = __require(38,15);
/*
    manager manage: link, storage, terminal, factory, power spawn, nuke.
    logic:
        for status == 0: find withdraw target, withdraw and set transfer target.
        for status == 1: transfer whatever resource to target.
*/
module.exports = {
    properties: {
        role: "manager",
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if (roomInfo[creep.room.name] && roomInfo[creep.room.name].managerPos) {
            let pos = roomInfo[creep.room.name].managerPos;
            if(!creep.pos.isEqualTo(pos)) {
                creep.moveTo(pos);
                return;
            }
        }
        if(creep.memory.updated == undefined || Game.time % 100 == 67) {
            updateMemory(creep);
        }
        creep.workerSetStatus();
        if(creep.memory.status) {
            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            let target = Game.getObjectById(creep.memory.target);

            if(target && creep.transfer(target, resourceType) == OK) {
                return;
            }
            else if(creep.room.storage && creep.transfer(creep.room.storage, resourceType) == OK) { 
                return;
            }
            else {
                creep.drop(resourceType);
                return;
            }
            
        }
        else {
            let storage = Game.getObjectById(creep.memory[STRUCTURE_STORAGE]);
            if(coreWork(creep, storage)) return;
            else if(terminalBalance(creep, storage)) return;
            else if(feedPowerSpawn(creep, storage)) return;
            else {
                let managerTasks = creep.room.memory.managerTasks;
                if(managerTasks && managerTasks.length > 0) {
                    doTask(creep);
                }
            }
        }
    },
    spawn: function(room) {
        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body = [MOVE, ...new Array(16).fill(CARRY)];
        let memory = {role: this.properties.role, status: 0, base: room.name};

        return {name, body, memory};
    },
};
var coreWork = function(creep, storage) {
    let link = Game.getObjectById(creep.memory[STRUCTURE_LINK]);
    let controllerLink = Game.getObjectById(creep.memory.controllerLink);
    if(controllerLink && link && controllerLink.store[RESOURCE_ENERGY] < 100 && link.store[RESOURCE_ENERGY] < 700 && link.cooldown <= 3) {
        creep.say('S2L');
        fromA2B(creep, storage, link, RESOURCE_ENERGY, Math.min(link.store.getFreeCapacity(RESOURCE_ENERGY), controllerLink.store.getFreeCapacity(RESOURCE_ENERGY)));
        return true;
    }
    else if(link && link.store[RESOURCE_ENERGY] > 0 && controllerLink.store[RESOURCE_ENERGY] >= 100 && storage.store.getFreeCapacity() > creep.store.getCapacity()) {
        creep.say('L2S');
        fromA2B(creep, link, storage, RESOURCE_ENERGY);
        return true;
    }

    return false
};

var terminalBalance = function(creep, storage) {
    let terminal = Game.getObjectById(creep.memory[STRUCTURE_TERMINAL]);
    if(!terminal) return false;

    for(const resourceType in roomResourceConfig) {
        let targetAmount = roomResourceConfig[resourceType].terminal;
        if(terminal.store[resourceType] < targetAmount && storage.store[resourceType] > 0 && terminal.store.getFreeCapacity() > 0) {
            creep.say('S2T');
            let amount = targetAmount - terminal.store[resourceType];
            fromA2B(creep, storage, terminal, resourceType, amount);
            return true;
        }
        else if(terminal.store[resourceType] > targetAmount && terminal.store[resourceType] > 0 && storage.store.getFreeCapacity() > 0) {
            creep.say('T2S');
            let amount = terminal.store[resourceType] - targetAmount;
            fromA2B(creep, terminal, storage, resourceType, amount);
            return true;
        }
    }

    return false;
};

var feedPowerSpawn = function(creep, storage) {
    let powerSpawn = Game.getObjectById(creep.memory[STRUCTURE_POWER_SPAWN]);
    if(!powerSpawn) return false;

    if(storage && powerSpawn.store.getFreeCapacity(RESOURCE_ENERGY) > creep.store.getCapacity()) {
        creep.say('2PS');
        fromA2B(creep, storage, powerSpawn, RESOURCE_ENERGY);
        return true;
    }
    else if(storage && powerSpawn.store[RESOURCE_POWER] == 0 && storage.store[RESOURCE_POWER] > 0) {
        creep.say('2PS');
        fromA2B(creep, storage, powerSpawn, RESOURCE_POWER, Math.min(100, storage.store[RESOURCE_POWER]));
        return true;
    }

    return false;
};

var fromA2B = function(creep, fromStruct, toStruct, resourceType, amount = null) {
    if(!fromStruct || !toStruct) {
        console.log("some struct is missing");
        return;
    }
    
    if(fromStruct.store[resourceType] > 0) {
        if(amount == null) creep.withdraw(fromStruct, resourceType);
        else {
            amount = _.min([creep.store.getCapacity(), fromStruct.store[resourceType], amount]);
            creep.withdraw(fromStruct, resourceType, amount);
        }
        creep.memory.status = 1;
    }
    creep.memory.target = toStruct.id;
};

var doTask = function(creep) {
    let task = creep.room.memory.managerTasks[creep.room.memory.managerTasks.length - 1];
    let transferVolume;
    if(task.volume <= creep.store.getFreeCapacity()) {
        transferVolume = task.volume;
        creep.room.memory.managerTasks.pop();
    }
    else {
        transferVolume = creep.store.getFreeCapacity();
        creep.room.memory.managerTasks[creep.room.memory.managerTasks.length - 1].volume -= transferVolume;
    }
    let target = Game.getObjectById(creep.memory[task.from]);
    if(target && creep.withdraw(target, task.resourceType, transferVolume) == OK) {
        creep.memory.status = 1;
    }
    creep.memory.target = creep.memory[task.to];
};

var updateMemory = function(creep) {
    let controllerLink = _.find(creep.room.find(FIND_MY_STRUCTURES), struct => (
        struct.structureType == STRUCTURE_LINK &&
        struct.pos.inRangeTo(creep.room.controller.pos, 2)
    ));

    if(controllerLink) {
        creep.memory.controllerLink = controllerLink.id;
    }
    else {
        creep.memory.controllerLink = null;
    }
    let structList = creep.pos.findInRange(FIND_MY_STRUCTURES, 1);
    creep.say(structList.length);
    _.forEach(structList, struct => {
        creep.memory[struct.structureType] = struct.id;
    })

    creep.memory.updated = 1
    creep.say("Updated")
};
return module.exports;
}
/********** End of module 15: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/manager.js **********/
/********** Start module 16: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/claimer.js **********/
__modules[16] = function(module, exports) {
module.exports = {
    properties: {
        role: "claimer",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[], number: 0},
            4: {maxEnergyCapacity: 1300, bodyParts:[CLAIM, MOVE, CLAIM, MOVE], number: 1},
            5: {maxEnergyCapacity: 1800, bodyParts:[CLAIM, MOVE, CLAIM, MOVE], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], number: 1},
            8: {maxEnergyCapacity: 10000, bodyParts:[CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], number: 1},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            return;
        }

        let controller = creep.room.controller;
        if (!controller) {
            return;
        }
        else if (creep.memory.claim) {
            if(creep.claimController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(controller);
            }
        }
        else if ((controller.reservation && controller.reservation.username != 'LeTsCrEEp') || (controller.owner && !controller.my)) {
            if(creep.attackController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(controller);
            }
        }
        else {
            if(creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(controller);
            }
        }
        
    },
    spawn: function(room, roomName) {
        if(Game.rooms[roomName]) {
            if(!Game.rooms[roomName].controller) return false; // sourceKeeper rooms

            let controller = Game.rooms[roomName].controller;
            if(controller.reservation && controller.reservation.username == room.controller.owner.username && controller.reservation.ticksToEnd > 2000) {
                return false
            }
        }

        let creepCount = 0;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role];
        }

        if (creepCount < this.properties.stages[this.getStage(room)].number) return true;

        return false;

    },
    spawnData: function(room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts;
        let memory = {role: this.properties.role, status: 1, base: room.name, targetRoom: targetRoomName}; // example

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
    }
}
return module.exports;
}
/********** End of module 16: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/claimer.js **********/
/********** Start module 17: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/outSourcer.js **********/
__modules[17] = function(module, exports) {
const { roomInfo } = __require(38,17);

/*
outSourcer1 - first generation out sourcer

description:
have equal amount of [WORK, MOVE, CARRY],
harvest energy source from other room and bring energy back.
*/
module.exports = {
    properties: {
        role: "outSourcer",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, CARRY, MOVE, MOVE], number: 3},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, CARRY, CARRY, CARRY, CARRY,  MOVE, MOVE, MOVE], number: 3}, // 550
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], number: 3}, // 700
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(3).fill(WORK), ...new Array(9).fill(CARRY), ...new Array(6).fill(MOVE)], number: 2}, // 1050
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(4).fill(WORK), ...new Array(12).fill(CARRY), ...new Array(8).fill(MOVE)], number: 2},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(5).fill(WORK), ...new Array(15).fill(CARRY), ...new Array(10).fill(MOVE)], number: 2},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(5).fill(WORK), ...new Array(20).fill(CARRY), ...new Array(13).fill(MOVE)], number: 2}, // 500 + 1000 + 650 = 2150, total: 8600
        },
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.workerSetStatus();

        if(creep.memory.status == 0) {
            const nearEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: resource => resource.resourceType == RESOURCE_ENERGY});
            if(nearEnergy.length > 0) {
                creep.pickup(nearEnergy[0]);
            }
            if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
                return;
            }

            creep.harvestEnergy()
        }
        else {
            const needRepair = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => (
                (struct.structureType == STRUCTURE_ROAD || struct.structureType == STRUCTURE_CONTAINER) &&
                struct.hits < struct.hitsMax
                )});
            if(needRepair.length > 0) {
                creep.repair(needRepair[0]);
            }
            const myConstuct = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
            if(myConstuct.length > 0) {
                creep.build(myConstuct[0]);
                return;
            }
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }

            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: struct => (
                (struct.structureType == STRUCTURE_STORAGE || struct.structureType == STRUCTURE_CONTAINER) && struct.store.getFreeCapacity() > 0
            )});
            if (target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }

            let constructSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(constructSites.length > 0) {
                if(creep.build(constructSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructSites[0]);
                }
                return;
            }
            if (roomInfo[creep.room.name]) {
                creep.moveTo(roomInfo[creep.room.name].restPos);
                return;
            };
        }
    },
    spawn: function(room, roomName) {
        let creepCount;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < Memory.outSourceRooms[roomName].sourceNum * this.properties.stages[this.getStage(room)].number) {
            return true;
        }
    },
    spawnData: function(room, outSourceRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts; // cost: 400 + 600 + 400 = 1400 or 500 + 750 + 500 = 1750
        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName};

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
    }
};
return module.exports;
}
/********** End of module 17: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/outSourcer.js **********/
/********** Start module 18: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/remoteHarvester.js **********/
__modules[18] = function(module, exports) {
module.exports = {
    properties: {
        role: "remoteHarvester",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, WORK, CARRY, MOVE], number: 2},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, WORK, CARRY, MOVE, MOVE], number: 1},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 1},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], number: 1},
        },
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.rest) {
            creep.memory.rest -= 1;
            return;
        }
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            return;
        }
        let result = creep.harvestEnergy();
        if(creep.memory.target != undefined && result == ERR_NOT_ENOUGH_RESOURCES) {
            let source = creep.room.find(FIND_SOURCES)[creep.memory.target];
            creep.say('no e')
            if(!creep.memory.containerId) {
                let containerList = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => struct.structureType == STRUCTURE_CONTAINER});
                if(containerList.length) creep.memory.containerId = containerList[0].id;
            }
            
            let container = Game.getObjectById(creep.memory.containerId);
            if (container && container.hits < container.hitsMax && container.store[RESOURCE_ENERGY] > 0) {
                if(creep.store[RESOURCE_ENERGY] == 0) {
                    if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
                creep.repair(container);
            }
            else if(source.energy == 0) {
                creep.memory.rest = source.ticksToRegeneration;
            }
            return;
        }
        
        
    },
    spawn: function(room, roomName) {
        let creepCount;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;
        
        let sourceNum = 1;
        if(Memory.outSourceRooms[roomName] && Memory.outSourceRooms[roomName].sourceNum) {
            sourceNum = Memory.outSourceRooms[roomName].sourceNum;
        }
        else if(Game.rooms[roomName]) {
            Memory.outSourceRooms[roomName] = {sourceNum: Game.rooms[roomName].find(FIND_SOURCES).length};
        }
        if (creepCount < sourceNum * this.properties.stages[this.getStage(room)].number) {
            return true;
        }
    },
    spawnData: function(room, outSourceRoomName) {


        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts;

        const existingThisTypeCreeps = _.filter(Game.creeps, creep => (
            creep.memory.role == this.properties.role && 
            creep.memory.targetRoom == outSourceRoomName &&
            !(creep.ticksToLive < creep.body.length * 3)
        ));
        var existingTargets = _.map(existingThisTypeCreeps, creep => creep.memory.target)

        let sourceCount = 1;
        if(Memory.outSourceRooms[outSourceRoomName]) {
            sourceCount = Memory.outSourceRooms[outSourceRoomName].sourceNum;
        }
        var sourceTarget;
        for(var i = 0; i < sourceCount; i++) {
            if (!existingTargets.includes(i)) {
                sourceTarget = i;
                break;
            }
        }

        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName, target: sourceTarget};

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
    }
};
return module.exports;
}
/********** End of module 18: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/remoteHarvester.js **********/
/********** Start module 19: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/remoteHauler.js **********/
__modules[19] = function(module, exports) {
const { roomInfo } = __require(38,19);

/*
    NOT FINISHED
    todo:
    1. calculate bodypart(WORK MOVE CARRY) / number needed for each room
    2. advance strategys.
*/
module.exports = {
    properties: {
        
    },
    properties: {
        role: 'remoteHauler',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            2: {maxEnergyCapacity: 550, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, ...new Array(9).fill(CARRY), ...new Array(5).fill(MOVE)], number: 1},
            4: {maxEnergyCapacity: 1300, bodyParts:[WORK, ...new Array(13).fill(CARRY), ...new Array(7).fill(MOVE)], number: 2},
            5: {maxEnergyCapacity: 1800, bodyParts:[WORK, ...new Array(15).fill(CARRY), ...new Array(8).fill(MOVE)], number: 2},
            6: {maxEnergyCapacity: 2300, bodyParts:[WORK, ...new Array(27).fill(CARRY), ...new Array(14).fill(MOVE)], number: 1}, // 100 + 1350 + 700 = 2150
            7: {maxEnergyCapacity: 5600, bodyParts:[WORK, WORK, ...new Array(31).fill(CARRY), ...new Array(17).fill(MOVE)], number: 1}, // 200 + 1650 + 850 = 2700
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.workerSetStatus();
        if(creep.memory.status == 0) {
            if(creep.memory.rest) {
                creep.memory.rest -= 1;
                return;
            }
            const nearEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: resource => resource.resourceType == RESOURCE_ENERGY});
            if(nearEnergy.length > 0) {
                creep.pickup(nearEnergy[0]);
            }
            const nearTomstone = creep.pos.findInRange(FIND_TOMBSTONES, 1, {filter: ts => ts.store[RESOURCE_ENERGY] > 0});
            if(nearTomstone.length > 0) {
                creep.withdraw(nearTomstone[0], RESOURCE_ENERGY);
                return;
            }
            if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
                return;
            }
            let targetSource = creep.memory.targetSource;
            if(targetSource == undefined || targetSource == null) {
                targetSource = Memory.outSourceRooms[creep.room.name].targetSource;
                if(targetSource === undefined) {
                    Memory.outSourceRooms[creep.room.name].targetSource = 1 % Memory.outSourceRooms[creep.room.name].sourceNum;
                    targetSource = 0;
                }
                else {
                    Memory.outSourceRooms[creep.room.name].targetSource = (targetSource + 1) % Memory.outSourceRooms[creep.room.name].sourceNum;
                }
                
                creep.memory.targetSource = targetSource;
            }
            

            let source = creep.room.find(FIND_SOURCES)[targetSource];
            let dropedResources = source.pos.findInRange(FIND_DROPPED_RESOURCES, 3, {filter: resource => (
                resource.amount > Math.min(creep.store.getFreeCapacity(), creep.store.getCapacity() / 3)
            )});
            if (dropedResources.length) {
                let result = creep.pickup(dropedResources[0]);
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(dropedResources[0]);
                }
                return;
            }
            let containers = source.pos.findInRange(FIND_STRUCTURES, 3, {filter: structure => (
                structure.structureType == STRUCTURE_CONTAINER && 
                structure.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity()
            )});
            if (containers.length) {
                let result = creep.withdraw(containers[0], RESOURCE_ENERGY);
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveToNoCreepInRoom(containers[0]);
                }
                return;
            }

            if(!creep.pos.inRangeTo(source.pos, 3)) {
                creep.moveToNoCreepInRoom(source);
            }
            else {
                creep.memory.rest = 20;
            }
            return;
        }
        else {
            if(creep.memory.targetSource != null) {
                creep.memory.targetSource = null;
            }
            const needRepair = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => (
                (struct.structureType == STRUCTURE_ROAD || struct.structureType == STRUCTURE_CONTAINER) &&
                struct.hits < struct.hitsMax
                )});
            if(needRepair.length > 0) {
                creep.repair(needRepair[0]);
            }
            const myConstuct = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
            if(myConstuct.length > 0) {
                if(creep.build(myConstuct[0]) == OK) return;
            }
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: struct => (
                (struct.structureType == STRUCTURE_STORAGE || struct.structureType == STRUCTURE_CONTAINER) && struct.store.getFreeCapacity() > 0
            )});
            if (!target) {
                if (roomInfo[creep.room.name]) {
                    creep.moveToNoCreep(roomInfo[creep.room.name].restPos);
                    return;
                };
            }
            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if(creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreep(target);
            }
        }
    },
    spawn: function(room, roomName) {
        let creepCount;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        let sourceNum = 1;
        if(Memory.outSourceRooms[roomName] && Memory.outSourceRooms[roomName].sourceNum) {
            sourceNum = Memory.outSourceRooms[roomName].sourceNum;
        }
        else if(Game.rooms[roomName]) {
            Memory.outSourceRooms[roomName] = {sourceNum: Game.rooms[roomName].find(FIND_SOURCES).length};
        }

        if (creepCount < sourceNum * this.properties.stages[this.getStage(room)].number) {
            return true;
        }
    },
    spawnData: function(room, outSourceRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts;
        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName};

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
    }
};
return module.exports;
}
/********** End of module 19: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/remoteHauler.js **********/
/********** Start module 20: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/defender.js **********/
__modules[20] = function(module, exports) {
module.exports = {
    properties: {
        role: "defender",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[MOVE, ATTACK, MOVE, ATTACK], number: 1},
            2: {maxEnergyCapacity: 550, bodyParts:[MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK], number: 1},
            3: {maxEnergyCapacity: 800, bodyParts:[MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], number: 1},
        },
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoomAdv(creep.memory.targetRoom);
            return;
        }

        let hostile;
        if (creep.memory.target) {
            hostile = Game.getObjectById(creep.memory.target);
        } 
        if(!hostile) {
            hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        } 
        if(!hostile) {
            hostile = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: struct => (struct.structureType != STRUCTURE_KEEPER_LAIR &&struct.structureType != STRUCTURE_CONTROLLER)});
        }

        if (hostile) {
            creep.rangedAttack(hostile);
            creep.attack(hostile);
            creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ff0000'}, maxRooms: 1});
            return;
        }
    },
    spawn: function(room, roomName) {
        let creepCount;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },
    spawnData: function(room, targetRoomName, targetId = null) {
        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts;
        let memory = {role: this.properties.role, status: 0, targetRoom: targetRoomName, target: targetId, base: room.name};

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
    }
};
return module.exports;
}
/********** End of module 20: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/defender.js **********/
/********** Start module 21: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/wrecker.js **********/
__modules[21] = function(module, exports) {
module.exports = {
    properties: {
        role: "wrecker"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        let hostileStruct;
        if (creep.memory.target) {
            hostileStruct = Game.getObjectById(creep.memory.target);
        } else {
            hostileStruct = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        }

        

        if (hostileStruct) {
            creep.say(creep.dismantle(hostileStruct));
            if(creep.dismantle(hostileStruct) == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostileStruct, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            return;
        }
    
    },
    spawn: function(room) {
        var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.room.name == room.name);
        console.log(this.properties.role + ': ' + thisTypeCreeps.length, room.name);
        if (thisTypeCreeps.length < 0) {
            return true;
        }
    },
    spawnData: function(room, targetRoomName, targetId = null) {
        let name = this.properties.role + Game.time;
        let body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE];
        let memory = {role: this.properties.role, status: 0, targetRoom: targetRoomName, target: targetId};

        return {name, body, memory};
    },
};
return module.exports;
}
/********** End of module 21: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/wrecker.js **********/
/********** Start module 22: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/medic.js **********/
__modules[22] = function(module, exports) {
module.exports = {
    properties: {
        role: "medic"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.status == 1) {
            if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
                return;
            }    
            let target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: creep => creep.hits < creep.hitsMax})
            if (target) {
                creep.rangedHeal(target);
                creep.heal(target);
                creep.moveTo(target);
            }
        }
        else {
            let targetId = creep.memory.target
            if(!targetId || !Game.getObjectById(targetId)) {
                let defender = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: creep => creep.memory.role == 'defender'});
                if (!defender) {
                    return;
                }
                creep.memory.target = defender.id;
            }
            
            let target = Game.getObjectById(creep.memory.target);
            if (target) {
                if (creep.hits < creep.hitsMax){
                    creep.heal(creep);
                    creep.moveTo(target);
                }
                else {
                    creep.heal(target);
                    if(creep.rangedHeal(target) == ERR_NOT_IN_RANGE) {
                        creep.heal(creep);
                    }
                }
                creep.moveTo(target);
                
            }
        }
    },
    spawn: function(room) {
        return false;
    },
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {role: this.properties.role, status: 0};

        return {name, body, memory};
    },
};
return module.exports;
}
/********** End of module 22: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/medic.js **********/
/********** Start module 23: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/scout.js **********/
__modules[23] = function(module, exports) {
module.exports = {
    properties: {
        role: "scout"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.moveToRoom(creep.memory.targetRoom);
    },
    spawn: function(room) {
        var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.room.name == room.name);
        console.log(this.properties.role + ': ' + thisTypeCreeps.length, room.name);
        if (thisTypeCreeps.length < 1) {
            return true;
        }
    },
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {role: this.properties.role, status: 0};

        return {name, body, memory};
    },
};
return module.exports;
}
/********** End of module 23: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/scout.js **********/
/********** Start module 24: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/transporter.js **********/
__modules[24] = function(module, exports) {
module.exports = {
    properties: {
        type: 'transporter',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[...new Array(3).fill(CARRY), ...new Array(3).fill(MOVE)]},
            2: {maxEnergyCapacity: 550, bodyParts:[...new Array(5).fill(CARRY), ...new Array(5).fill(MOVE)]},
            3: {maxEnergyCapacity: 800, bodyParts:[...new Array(7).fill(CARRY), ...new Array(7).fill(MOVE)]},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)]},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(15).fill(CARRY), ...new Array(15).fill(MOVE)]},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(20).fill(CARRY), ...new Array(20).fill(MOVE)]},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(25).fill(CARRY), ...new Array(25).fill(MOVE)]},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.workerSetStatus();

        switch(creep.memory.workType) {
            case 1:
                this.collectDropedResources(creep, creep.memory.targetResourceType);
                break;
            default:
                this.tranEnergyBetweenMyRooms(creep);
        }
    },
    collectDropedResources: function(creep, resourceType) {
        creep.say('cdr');
        if(!creep.memory.status) {
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoomAdv(creep.memory.targetRoom);
                return;
            }
            let dropedRecource;
            if(resourceType) {
                dropedRecource = _.find(creep.room.find(FIND_DROPPED_RESOURCES), resource => resource.resourceType == resourceType);
            }
            else dropedRecource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

            if (dropedRecource) {
                if(creep.pickup(dropedRecource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedRecource, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            let tomstone = _.find(creep.room.find(FIND_TOMBSTONES), ts => ts.store.getUsedCapacity() >= creep.store.getCapacity());
            if (tomstone) {
                resourceType = _.find(Object.keys(tomstone.store), resource => tomstone.store[resource] > 0);
                let result = creep.withdraw(tomstone, resourceType);
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tomstone);
                }
                return;
            }

            if(creep.store.getUsedCapacity() > 0) creep.memory.status = 1;
        }
        else {
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }
            var storage = creep.room.storage;

            if(!storage || storage.store.getFreeCapacity() == 0) {
                creep.suicide();
                return;
            }

            var resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if(creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
    },
    tranEnergyBetweenMyRooms: function(creep) {
        creep.say('tebr');
        if(!creep.memory.status) {
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoom(creep.memory.targetRoom);
                return;
            }

            creep.takeEnergyFromClosest();
        }
        else {
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }
            let storage = creep.room.storage;
            if(!storage) {
                let containers = creep.room.find(FIND_STRUCTURES, {filter: struct => (
                    struct.structureType == STRUCTURE_CONTAINER &&
                    struct.pos.inRangeTo(creep.room.controller.pos, 3) &&
                    struct.store.getFreeCapacity() > 0
                )});
                if(containers.length) {
                    storage = containers[0];
                }
            }

            if(!storage) {
                if(creep.pos.inRangeTo(creep.room.controller.pos, 2)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveTo(storage);
            }
            else if(storage.store.getFreeCapacity() == 0) {
                if(creep.pos.inRangeTo(storage.pos, 2)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveTo(storage);
            }
            else { 
                if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        }
    },
    spawn: function(room) {
        return false;
    },
    spawnData: function(room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        let body = this.properties.stages[stage].bodyParts;
        let memory = {role: this.properties.type, status: 1, base: room.name};

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
    }
};
return module.exports;
}
/********** End of module 24: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/transporter.js **********/
/********** Start module 25: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/spawning.js **********/
__modules[25] = function(module, exports) {
const { roomInfo } = __require(38,25);
const creepLogic = __require(1,25);
const creepTypes2 = ['carrier2', 'harvester2', 'upgrader2', 'builder2']; // 'mineralCarrier'

function spawnCreeps(room) {
    var availableSpawns = room.find(FIND_MY_SPAWNS, {filter: function(spawn) {
        return spawn.spawning == null;
    }});
    if (availableSpawns.length == 0){
        return;
    }

    function spawnCreepUsingSpawnData(creepSpawnData) {
        if (!creepSpawnData) return -100;
        var spawn = availableSpawns[0];
        let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory});
    
        console.log(room, "Tried to Spawn:", creepSpawnData.memory.role, result);
        return result;
    }
    var types = creepTypes2;
    if(roomInfo[room.name] && roomInfo[room.name].managerPos) {
        types = ['carrier2', 'harvester2', 'manager', 'upgrader2', 'builder2', 'mineralCarrier']; // 
    }

    if(_.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType == STRUCTURE_EXTRACTOR)) {
        types.push('miner')
    }
    let creepTypeNeeded = _.find(types, function(type) {
        return creepLogic[type].spawn(room);
    });
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room);
    spawnCreepUsingSpawnData(creepSpawnData);
    if(creepTypeNeeded) return;
    let creeps = room.find(FIND_MY_CREEPS);
    if (creeps.length < 2 && result == ERR_NOT_ENOUGH_ENERGY) {
        var spawn = availableSpawns[0];
        spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'Servivor001-' + Game.time, {memory: {role: 'harvester', status: 1}});
        console.log("Spawning backup tiny Servivor001");
        return;
    }
    if(creepTypeNeeded) {

    }
    var hostileParts = [WORK, ATTACK, RANGED_ATTACK, HEAL, CLAIM];
    var enemy = _.find(room.find(FIND_HOSTILE_CREEPS), creep =>
        _.filter(creep.body, object => hostileParts.includes(object.type)).length > 0
    );
    if (enemy) {
        return;
    }

    
    if(room.memory.outSourceRooms) {
        for (let index in room.memory.outSourceRooms) {
            var roomName = room.memory.outSourceRooms[index];
            if (Game.rooms[roomName]) {
                var hostileCreeps = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
                var invaderCore = _.find(Game.rooms[roomName].find(FIND_HOSTILE_STRUCTURES), struct => struct.structureType == STRUCTURE_INVADER_CORE);
                
                if (hostileCreeps.length > 0) {
                    let creepSpawnData = creepLogic.defender.spawn(room, roomName) && creepLogic.defender.spawnData(room, roomName);
                    if(creepSpawnData) {
                        spawnCreepUsingSpawnData(creepSpawnData);
                        return;
                    }
                }
                if (invaderCore) {
                    let creepSpawnData = creepLogic.defender.spawn(room, roomName) && creepLogic.defender.spawnData(room, roomName, invaderCore.id);
                    if(creepSpawnData) {
                        spawnCreepUsingSpawnData(creepSpawnData);
                        return;
                    }
                }
            }
        }
        let outSourceTypes;
        if(room.energyCapacityAvailable < 550) {
            outSourceTypes = []
        }
        else if(room.energyCapacityAvailable < 1300) {
            outSourceTypes = ['remoteHarvester', 'remoteHauler'];
        }
        else {
            outSourceTypes = ['claimer', 'remoteHarvester', 'remoteHauler'];
        }
        for(let index in outSourceTypes) {
            let cType = outSourceTypes[index];
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
return module.exports;
}
/********** End of module 25: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/spawning.js **********/
/********** Start module 26: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/repairing.js **********/
__modules[26] = function(module, exports) {
let structureLogic = __require(39,26);

function repairing(room) {
    function needRepair(structure) {
        return (
            (structure.structureType == STRUCTURE_WALL && structure.hits >= structureLogic.wall.getTargetHits(room) && structure.hits < structureLogic.wall.getIdealHits(room)) || 
            (structure.structureType == STRUCTURE_RAMPART && structure.hits < 10000) ||
            (structure.structureType == STRUCTURE_RAMPART && structure.hits >= structureLogic.rampart.getTargetHits(room) && structure.hits < structureLogic.rampart.getIdealHits(room)) || 
            (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART && structure.hits < structure.hitsMax - 600)
        )
    }

    var hostileParts = [MOVE, WORK, ATTACK, RANGED_ATTACK, HEAL, CLAIM];
    var enemy = _.find(room.find(FIND_HOSTILE_CREEPS), creep =>
        _.filter(creep.body, object => hostileParts.includes(object.type)).length > 0
    );

    if (enemy) {
        return;
    }
    
    if(!room.memory.needRepairStructures || (Game.time % 50 == 0 && room.memory.needRepairStructures.length == 0)) {
        var needRepairStructures = _.filter(room.find(FIND_STRUCTURES), needRepair);
        room.memory.needRepairStructures = _.map(needRepairStructures, structure => structure.id);
    }
    if (room.memory.needRepairStructures.length > 0 && (!Game.getObjectById(room.memory.needRepairStructures[room.memory.needRepairStructures.length - 1]) || !needRepair(Game.getObjectById(room.memory.needRepairStructures[room.memory.needRepairStructures.length - 1])))) {
        room.memory.needRepairStructures.pop();
    }

    if (room.memory.needRepairStructures.length > 0) {
        var target = Game.getObjectById(room.memory.needRepairStructures[room.memory.needRepairStructures.length - 1]);
        var tower = _.find(room.find(FIND_STRUCTURES), structure => (
            structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 500
        ))
        
        if (tower) {
            tower.repair(target)
        }
        else {
            console.log("NO Tower Repairing Now! (room.repairing)")
        }
        
    }
}

module.exports = repairing;
return module.exports;
}
/********** End of module 26: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/repairing.js **********/
/********** Start module 27: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/mainLogic.js **********/
__modules[27] = function(module, exports) {
let structureLogic = __require(39,27);

function mainLogic(room) {
}

module.exports = mainLogic;
return module.exports;
}
/********** End of module 27: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/mainLogic.js **********/
/********** Start module 28: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/defending.js **********/
__modules[28] = function(module, exports) {
function defending(room) {
    var hostileParts = [MOVE, WORK, ATTACK, RANGED_ATTACK, HEAL, CLAIM];
    var enemy = _.find(room.find(FIND_HOSTILE_CREEPS), creep =>
        _.filter(creep.body, object => hostileParts.includes(object.type)).length > 0
    );

    if (enemy) {
        console.log(room, "Found Enemies!");

        var towers = _.filter(room.find(FIND_STRUCTURES), structure => (
            structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        ));
        
        _.forEach(towers, tower => {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: function(creep) { 
                    return _.filter(creep.body, object => hostileParts.includes(object.type)).length > 0;
                } 
            })
            
            tower.attack(target);
        })
    }
}

module.exports = defending;
return module.exports;
}
/********** End of module 28: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/defending.js **********/
/********** Start module 29: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/healing.js **********/
__modules[29] = function(module, exports) {

function repairing(room) {
    function needHeal(creep) {
        return creep.hits < creep.hitsMax;
    }

    var damagedCreep = _.find(room.find(FIND_MY_CREEPS), needHeal);
    
    if (damagedCreep) {
        var target = damagedCreep;
        var tower = _.find(room.find(FIND_STRUCTURES), structure => (
            structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        ));
        
        if (tower) {
            tower.heal(target)
        }
    }
}

module.exports = repairing;
return module.exports;
}
/********** End of module 29: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/healing.js **********/
/********** Start module 30: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/linkTransfer.js **********/
__modules[30] = function(module, exports) {
const { roomInfo } = __require(38,30);

module.exports = function(room) {
    if (roomInfo[room.name] == undefined || roomInfo[room.name].managerPos == undefined) {
        return;
    }
    let links = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LINK});
    let sources = room.find(FIND_SOURCES);

    let managerLink;
    let sourceLinks = [];
    let controllerLink;
    _.forEach(links, link => {
        if(link.pos.inRangeTo(roomInfo[room.name].managerPos, 1)) {
            managerLink = link;
        }
        _.forEach(sources, source => {
            if(link.pos.inRangeTo(source.pos, 2)) {
                sourceLinks.push(link);
                return;
            }
        })
        if(link.pos.inRangeTo(room.controller.pos, 2)) {
            controllerLink = link;
        }
    });
    room.memory.linkCompleteness = (sourceLinks.length == room.find(FIND_SOURCES).length && managerLink) ? true : false;
    if(sourceLinks.length > 0 && controllerLink && managerLink) {
        if(controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) <= 200) {
            for(let i in sourceLinks) {
                let link = sourceLinks[i];
                if(link.store.getUsedCapacity(RESOURCE_ENERGY) >= 600) {
                    link.transferEnergy(controllerLink);
                    break;
                }
            }
        }
        else if(managerLink.store.getUsedCapacity(RESOURCE_ENERGY) <= 100) {
            for(let i in sourceLinks) {
                let link = sourceLinks[i];
                if(link.store.getUsedCapacity(RESOURCE_ENERGY) >= 700) {
                    link.transferEnergy(managerLink);
                    break;
                }
            }
        }
        if(controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) <= 100) {
            let link = managerLink;
            if(link.store.getUsedCapacity(RESOURCE_ENERGY) >= 700) {
                link.transferEnergy(controllerLink);
            }
        }
    }
    else if(sourceLinks.length > 0 && managerLink) {
        if(managerLink.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            for(let i in sourceLinks) {
                let link = sourceLinks[i];
                if(link.store.getUsedCapacity(RESOURCE_ENERGY) > 750) {
                    link.transferEnergy(managerLink);
                    break;
                }
            }
        }
    }
    else if(managerLink && controllerLink) {
        if(controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            let link = managerLink;
            if(link.store.getUsedCapacity(RESOURCE_ENERGY) > 700) {
                link.transferEnergy(controllerLink);
            }
        }
    }

}

function updateMemory(room) {
    room.memory.linkInfo = {}
    let links = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LINK});
    room.memory.linkInfo.sourceLinks = [];
    let sources = room.find(FIND_SOURCES);

    _.forEach(links, link => {
        if(link.pos.inRangeTo(roomInfo[room.name].managerPos, 1)) {
            room.memory.linkInfo.managerLink = link.id;
        }
        _.forEach(sources, source => {
            if(link.pos.inRangeTo(source.pos, 2)) {
                room.memory.linkInfo.sourceLinks.push(link.id);
                return;
            }
        })
        if(link.pos.inRangeTo(room.controller.pos, 2)) {
            room.memory.linkInfo.controllerLink = link.id;
        }
    });

    console.log('room link memory updated');
};
return module.exports;
}
/********** End of module 30: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/linkTransfer.js **********/
/********** Start module 31: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/roomCensus.js **********/
__modules[31] = function(module, exports) {

function roomCensus() {
    global.roomCensus = {};
    _.forEach(Game.rooms, room => {
        global.roomCensus[room.name] = {}
    });
    _.forEach(Game.creeps, creep => {
        if(creep.body.length * 3 > creep.ticksToLive) return;
        if(creep.memory.targetRoom) {
            if(global.roomCensus[creep.memory.targetRoom] == undefined) {
                global.roomCensus[creep.memory.targetRoom] = {}
            }
            if (global.roomCensus[creep.memory.targetRoom][creep.memory.role] == undefined) {
                global.roomCensus[creep.memory.targetRoom][creep.memory.role] = 1;
            }
            else {
                global.roomCensus[creep.memory.targetRoom][creep.memory.role] += 1;
            }
        }
        else if(creep.memory.base) {
            if(global.roomCensus[creep.memory.base] == undefined) {
                global.roomCensus[creep.memory.base] = {}
            }
            if (global.roomCensus[creep.memory.base][creep.memory.role] == undefined) {
                global.roomCensus[creep.memory.base][creep.memory.role] = 1;
            }
            else {
                global.roomCensus[creep.memory.base][creep.memory.role] += 1;
            }
        }
    })
    _.forEach(_.keys(global.roomCensus), roomName => {
        console.log(roomName, JSON.stringify(global.roomCensus[roomName]));
    })
}

module.exports = roomCensus;
return module.exports;
}
/********** End of module 31: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/roomCensus.js **********/
/********** Start module 32: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/exportStats.js **********/
__modules[32] = function(module, exports) {
// Call this function at the end of your main loop
function exportStats() {
    Memory.stats = {
      gcl: {},
      rooms: {},
      cpu: {},
    };
  
    Memory.stats.time = Game.time;
    for (let roomName in Game.rooms) {
      let room = Game.rooms[roomName];
      let isMyRoom = (room.controller ? room.controller.my : false);
      if (isMyRoom) {
        let roomStats = Memory.stats.rooms[roomName] = {};
        roomStats.storageEnergy           = (room.storage ? room.storage.store.energy : 0);
        roomStats.terminalEnergy          = (room.terminal ? room.terminal.store.energy : 0);
        roomStats.energyAvailable         = room.energyAvailable;
        roomStats.energyCapacityAvailable = room.energyCapacityAvailable;
        roomStats.controllerProgress      = room.controller.progress;
        roomStats.controllerProgressTotal = room.controller.progressTotal;
        roomStats.controllerLevel         = room.controller.level;
      }
    }
    Memory.stats.gcl.progress      = Game.gcl.progress;
    Memory.stats.gcl.progressTotal = Game.gcl.progressTotal;
    Memory.stats.gcl.level         = Game.gcl.level;
    Memory.stats.cpu.bucket        = Game.cpu.bucket;
    Memory.stats.cpu.limit         = Game.cpu.limit;
    Memory.stats.cpu.used          = Game.cpu.getUsed();
}

module.exports = exportStats;
return module.exports;
}
/********** End of module 32: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/exportStats.js **********/
/********** Start module 33: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/labReaction.js **********/
__modules[33] = function(module, exports) {
const { transferTask, LabTask } = __require(41,33);
const { reactionResources } = __require(40,33);
const { compondsRequirements } = __require(38,33);


module.exports = function(room) {
    if(!room) return;
    if(room.controller.level < 6) return;
    if(!room.memory.tasks) room.memory.tasks = {};
    if(!room.memory.tasks.labTasks) room.memory.tasks.labTasks = [];
    if(!room.storage) return;
    if(!room.memory.labs) room.memory.labs = {};
    if(!room.memory.labs.center) {
        room.memory.labs.center = [];
        return;
    }
    if(room.memory.labs.center.length != 2) return;
    if(room.name != 'W19S17') return;
    if(Game.time % 5 === 3) {
        if(room.memory.tasks.labTasks.length === 0) {
            let {compond, amount} = checkRequiredComponds(room);
            if(compond && amount) {
                let createdTasks = createLabTasks(room.storage, compond, amount);
                if(createdTasks) room.memory.tasks.labTasks.push(...createdTasks);
                else {
                    if(!Memory.resourceShortage) Memory.resourceShortage = {};
                    else Memory.resourceShortage[room.name] = compond;
                }
            }
        }
    }
    runLab(room);
};

var checkRequiredComponds = function(room) {
    let storage = room.storage;
    for (const compond in compondsRequirements) {
        let amount = compondsRequirements[compond][1] - storage.store[compond];
        if(amount < 100) {
            continue;
        }

        return {compond, amount};
    }

    return {};
};
var createLabTasks = function(storage, resourceType, amount, reactantAmount = {}) {
    if(amount > 5000) amount = 5000;
    if(amount < 5) amount = 5;
    if(!reactionResources[resourceType]) {
        let short = (reactantAmount[resourceType]? reactantAmount[resourceType] : 0) + amount - storage.store[resourceType];
        if(short <= 0) return [];
        else return false;
    }

    let taskList = [];
    for(const reactant in reactionResources[resourceType]) {
        let short = (reactantAmount[reactant]? reactantAmount[reactant] : 0) + amount - storage.store[reactant];
        if(short > 0) {
            if(reactantAmount[reactant]) reactantAmount[reactant] += amount - short;
            else reactantAmount[reactant] = amount - short;

            let subTasks = createLabTasks(storage, reactant, short, reactantAmount);
            if (subTasks === false) return false;
            else taskList.push(...subTasks);
        }
        else {
            if(reactantAmount[reactant]) reactantAmount[reactant] += amount;
            else reactantAmount[reactant] = amount;
        }
    }

    taskList.push(new LabTask(resourceType, amount));

    return taskList;
};


var runLab = function(room) {
    let labTasks = room.memory.tasks.labTasks;
    if(!labTasks.length) {
        return;
    }

    let allLabs = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LAB});
    let outterLabs =  _.filter(allLabs, lab => !room.memory.labs.center.includes(lab.id));
    let centerLabs = _.map(room.memory.labs.center, id => Game.getObjectById(id));



    const task = room.memory.tasks.labTasks[0];
    if(!room.memory.labStatus) {
        for(const i in allLabs) {
            if(allLabs[i].mineralType) return;
        }

        if(task.amount <= 0) {
            room.memory.tasks.labTasks.shift();
            return;
        }
        else {
            room.memory.labStatus = 1;
        }
    }
    else if(room.memory.labStatus == 1) {
        for(const i in centerLabs) {
            if(centerLabs[i].mineralType && centerLabs[i].mineralType != reactionResources[task.resourceType][i]) {
                room.memory.labStatus = 0;
                return;
            }
        }
        for(const i in outterLabs) {
            if((outterLabs[i].mineralType && outterLabs[i].mineralType != task.resourceType) || task.amount <= 0) {
                room.memory.labStatus = 0;
                return;
            }

            const result = outterLabs[i].runReaction(...centerLabs);
            if(result == ERR_FULL) {
                room.memory.labStatus = 3;
                return;
            }
            else if(result == ERR_NOT_ENOUGH_RESOURCES) {
                room.memory.labStatus = 2;
                return;
            }
            else if(result == OK) {
                task.amount -= 5;
            }
            else {
            }
        }
    }
    else if(room.memory.labStatus == 2) {
        for (const i in centerLabs) {
            let lab = centerLabs[i];
            if(!lab.mineralType || lab.store[lab.mineralType] < 5) {
                return;
            }
        }

        room.memory.labStatus = 1;
    }
    else if(room.memory.labStatus == 3) {
        for (const i in outterLabs) {
            if(outterLabs[i].store.getFreeCapacity(task.resourceType) < 5) {
                return;
            }
        }

        room.memory.labStatus = 1;
    }
}
return module.exports;
}
/********** End of module 33: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/labReaction.js **********/
/********** Start module 34: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/resourceBalancing.js **********/
__modules[34] = function(module, exports) {
const { roomResourceConfig } = __require(38,34);

module.exports = function(myRooms) {
    if(Game.time % 500 == 5) {
        for(const i in myRooms) {
            if(!myRooms[i].memory.tasks) myRooms[i].memory.tasks = {};
            if(!myRooms[i].memory.tasks.terminalTasks) myRooms[i].memory.tasks.terminalTasks = [];
        }

        for(const resourceType in roomResourceConfig) {
            const abundantLine = roomResourceConfig[resourceType].storage[1];
            const lowerBoundLine = roomResourceConfig[resourceType].storage[0];
            let sender = _.filter(myRooms, room => room.storage && room.terminal && room.storage.store[resourceType] > abundantLine);
            let receiver = _.filter(myRooms, room => room.storage && room.terminal && room.storage.store[resourceType] < lowerBoundLine);
            receiver.sort((r1, r2) => r1.storage.store[resourceType] - r2.storage.store[resourceType]);
    
            for(const i in myRooms) {
                if(sender[i] && receiver[i]) {
                    if(resourceType == RESOURCE_ENERGY) amount /= 2;
                    sender[i].memory.tasks.terminalTasks.push({receiver: receiver[i].name, resourceType: resourceType, amount: roomResourceConfig[resourceType].terminal});
                }
            }
        }
    }
    if(Game.time % 10 == 0) {
        for(const i in myRooms) {
            let senderRoom = myRooms[i];
            if(!senderRoom.memory.tasks) continue;
            if(!senderRoom.memory.tasks.terminalTasks) continue;
            if(senderRoom.memory.tasks.terminalTasks.length == 0) continue;
            if(!senderRoom.terminal) continue;
            if(senderRoom.terminal.cooldown > 0) continue;
    
            const terminalTask = senderRoom.memory.tasks.terminalTasks.shift();
            let result = senderRoom.terminal.send(terminalTask.resourceType, terminalTask.amount, terminalTask.receiver, 'Resource Balancing');
            console.log(senderRoom, 'Try to send resource', JSON.stringify(terminalTask), result);
        }
    }

};
return module.exports;
}
/********** End of module 34: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/resourceBalancing.js **********/
/********** Start module 35: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/roomPlanner.js **********/
__modules[35] = function(module, exports) {

function planner_loop(roomName, opts = {}) {
    let _this = {};
    _this.visual = new RoomVisual(roomName);
    _this.anchor = getAnchor(roomName);
    _this.terrain = new Room.Terrain(roomName);

    if (!_this.anchor) return;

    let s = 1;

    /**
     * 0 = empty
     * 1 = road
     * 10 = wall
     * 20 = struct
     * 100 = border
     */
    let structuresMatrix = new Uint8Array(2500);
    structuresMatrix_updateTerrain(_this, structuresMatrix);

    let minimalStructs = generateMinimalBase(_this, structuresMatrix);
    if (!minimalStructs) return;
/**/if (opts.render) renderStructs(_this, minimalStructs); if (opts.step < ++s) return;
/**/if (opts.render) renderMinimal(_this);

    let labs = generateLabs(_this, structuresMatrix);
    if (!labs) return;
/**/if (opts.render) renderStructs(_this, labs); if (opts.step < ++s) return;

    let exts = generateExtensions(_this, structuresMatrix);
    if (!exts) return;
/**/if (opts.render) renderStructs(_this, exts); if (opts.step < ++s) return;
};



function getAnchor(roomName) {
    let room = Game.rooms[roomName];
    if (!room) { console.log('no room'); return null; }
    let flags = room.find(FIND_FLAGS, { filter: { color: COLOR_RED } });
    if (!flags.length) { console.log(`getAnchor: no (red) flag!`); return null; }
    if (flags.length > 1) { console.log(`getAnchor: too many (red) flags!`); return null; }
    return flags[0].pos;
};

function generateMinimalBase(_this, structuresMatrix) {
    let minimal = getMinimalBase();
    for (let elem of minimal) {
        let x = elem[0] + _this.anchor.x;
        let y = elem[1] + _this.anchor.y;
        let type = elem[2];
        if (type == STRUCTURE_ROAD) structuresMatrix[x * 50 + y] = 1;
        else structuresMatrix[x * 50 + y] = 20 + structToNumber(elem[2]);
    }
    return minimal;
};

function getMinimalBase() {
    return [[- 2, -2, STRUCTURE_EXTENSION],
    [-1, -2, STRUCTURE_EXTENSION],
    [0, -2, STRUCTURE_SPAWN],
    [1, -2, STRUCTURE_ROAD],
    [2, -2, STRUCTURE_EXTENSION],
    [-2, -1, STRUCTURE_ROAD],
    [0, -1, STRUCTURE_ROAD],
    [1, -1, STRUCTURE_SPAWN],
    [2, -1, STRUCTURE_EXTENSION],
    [-2, 0, STRUCTURE_EXTENSION],
    [-1, 0, STRUCTURE_ROAD],
    [1, 0, STRUCTURE_POWER_SPAWN],
    [2, 0, STRUCTURE_SPAWN],
    [-2, 1, STRUCTURE_ROAD],
    [0, 1, STRUCTURE_ROAD],
    [2, 1, STRUCTURE_ROAD],
    [-2, 2, STRUCTURE_LINK],
    [-1, 2, STRUCTURE_STORAGE],
    [0, 2, STRUCTURE_TERMINAL],
    [1, 2, STRUCTURE_ROAD],
    [2, 2, STRUCTURE_EXTENSION],
    ];
};

function renderStructs(_this, structs) {
    for (let elem of structs) {
        renderElem(_this, elem);
    }
};


function renderMinimal(_this) {
    let x = _this.anchor.x;
    let y = _this.anchor.y;
    let points = [[x - 2.4, y - 2.4], [x + 2.4, y - 2.4], [x + 2.4, y + 2.4], [x - 2.4, y + 2.4], [x - 2.4, y - 2.4]];
    _this.visual.poly(points, { stroke: '#ff4444', lineStyle: 'dashed' });
}


function renderElem(_this, elem) {
    if (!elem) return;
    let type = elem[2];
    if (!type) return;

    let x = _this.anchor.x + elem[0];
    let y = _this.anchor.y + elem[1];
    _this.visual.structure(x, y, type);
};

function structuresMatrix_updateTerrain(_this, structuresMatrix) {
    for (var x = 0; x < 50; ++x) {
        for (var y = 0; y < 50; ++y) {
            if (_this.terrain.get(x, y) & TERRAIN_MASK_WALL) {
                structuresMatrix[x * 50 + y] = 10;
            } else {
                structuresMatrix[x * 50 + y] = 0;
            }
        }
    }
    for (var i = 0; i < 50; ++i) {
        let x, y;
        x = 0; y = i; structuresMatrix[x * 50 + y] = 100;
        x = 49; y = i; structuresMatrix[x * 50 + y] = 100;
        x = i; y = 0; structuresMatrix[x * 50 + y] = 100;
        x = i; y = 49; structuresMatrix[x * 50 + y] = 100;
    }
};

function generateLabs(_this, structuresMatrix) {
    let labs = getLabs();
    if (!canPlaceStructs(_this.anchor, structuresMatrix, labs)) {
        console.log('cant place labs');
        return null;
    }
    structuresMatrix_updateStructures(_this, structuresMatrix, labs);
    return labs;
};

function getLabs() {
    return [[-1, 3, STRUCTURE_LAB],
    [-2, 3, STRUCTURE_LAB],
    [-2, 4, STRUCTURE_LAB],
    [-3, 4, STRUCTURE_LAB],
    [-3, 5, STRUCTURE_LAB],
    [0, 4, STRUCTURE_LAB],
    [0, 5, STRUCTURE_LAB],
    [-1, 5, STRUCTURE_LAB],
    [-1, 6, STRUCTURE_LAB],
    [-2, 6, STRUCTURE_LAB]
    ];
};

function canPlaceStructs(anchor, structuresMatrix, array) {
    for (let elem of array) {
        let x = anchor.x + elem[0];
        let y = anchor.y + elem[1];
        if (!isEmptySpot(structuresMatrix, x, y)) return false;
    }
    return true;
};

function isEmptySpot(structuresMatrix, x, y) {
    return structuresMatrix[x * 50 + y] < 1;
};

function isNotWall(anchor, structuresMatrix, elem) {
    let x = anchor.x + elem[0];
    let y = anchor.y + elem[1];
    let val = structuresMatrix[x * 50 + y];
    if (val == 10 || val == 100) {
        return false;
    }
    return true;
};

function structuresMatrix_updateStructures(_this, structuresMatrix, structs) {
    for (let elem of structs) {
        let x = _this.anchor.x + elem[0];
        let y = _this.anchor.y + elem[1];
        if (structuresMatrix[x * 50 + y] > 1) { console.log(x + ' ' + y + ' bad ' + structuresMatrix[x * 50 + y]); }
        structuresMatrix[x * 50 + y] = 20 + structToNumber(elem[2]);
    }
};

function structuresMatrix_updateStructures_revert(_this, structuresMatrix, structs) {
    for (let elem of structs) {
        let x = _this.anchor.x + elem[0];
        let y = _this.anchor.y + elem[1];
        structuresMatrix[x * 50 + y] = 0;
    }
};



function generateExtensions(_this, structuresMatrix) {
    let consider_points = getMinimalBaseExitPoints();

    let diagonals = [[-2, -2], [2, -2], [-2, 2], [2, 2]];
    let result = [];

    let ext_no = 0;

    while (consider_points.length) {
        let consider_start = consider_points.shift();

        for (let d of diagonals) {
            let new_point = addPoints(consider_start, d);
            let exts = tryBuildExtAroundPoint(_this.anchor, structuresMatrix, new_point);
            if (!exts) continue;

            structuresMatrix_updateStructures(_this, structuresMatrix, exts);

            let res = generateRoadsBetween(structuresMatrix, exts, consider_start, new_point, _this.anchor, result);
            if (res === null) {
                structuresMatrix_updateStructures_revert(_this, structuresMatrix, exts);
                continue;
            }

            structuresMatrix_updateStructures(_this, structuresMatrix, res);
            exts = exts.concat(res);

            result = result.concat(exts);
            ext_no += exts.filter(x => x[2] == STRUCTURE_EXTENSION).length;

            for (let dx = -1; dx <= 1; ++dx) {
                if (dx == 0) continue;
                for (let dy = -1; dy <= 1; ++dy) {
                    if (dy == 0) continue;
                    consider_points.push(addPoints(new_point, [dx, dy]));
                }
            }
        }

        if (ext_no >= 80) break;
    }
    return result;
};


function getMinimalBaseExitPoints() {
    return [
        [-2, -1],
        [-2, 1],
        [1, -2],
        [1, 2],
        [2, 1],
    ];
};

function addPoints(p1, p2) {
    return [p1[0] + p2[0], p1[1] + p2[1]];
}

function tryBuildExtAroundPoint(anchor, structuresMatrix, new_point) {
    let exts = [];
    for (let dx = -1; dx <= 1; ++dx) {
        for (let dy = -1; dy <= 1; ++dy) {
            let x = new_point[0] + dx;
            let y = new_point[1] + dy;

            if (dx == 0 && dy == 0)
                exts.push([x, y, STRUCTURE_ROAD]);
            else
                exts.push([x, y, STRUCTURE_EXTENSION]);
        }
    }

    let matching_ext = 0;
    for (let i = exts.length - 1; i >= 0; --i) {
        let elem = exts[i];
        let x = anchor.x + elem[0];
        let y = anchor.y + elem[1];
        if (structuresMatrix[x * 50 + y] == (20 + structToNumber(STRUCTURE_EXTENSION))) matching_ext++;
        if (structuresMatrix[x * 50 + y] > 0) {
            exts.splice(i, 1);
        }
    }
    if (matching_ext > 2 || exts.length < 6) return null;
    return exts;
};

function generateRoadsBetween(structuresMatrix, exts, p1, p2, anchor, structs) {
    let dx = 0;
    let dy = 0;
    if (p1[0] < p2[0]) dx = 1;
    if (p1[0] > p2[0]) dx = -1;
    if (p1[1] < p2[1]) dy = 1;
    if (p1[1] > p2[1]) dy = -1;

    let bonusExt = [];
    const placeRoadAndBonusExt = (x, y, s) => {
        s[2] = STRUCTURE_ROAD;
        let e = generateBonusExtsBetween(x, y, structuresMatrix, anchor, exts);
        for (let it_e of e) {
            let duplicate = false;
            for (let elem of bonusExt) {
                if (elem[0] == it_e[0] && elem[1] == it_e[1]) { duplicate = true; break; }
            }
            if (!duplicate) bonusExt.push(it_e);
        }
    };

    let x = p1[0];
    let y = p1[1];
    let _limit = 0;
    while (_limit++ < 1000) {

        if (!isNotWall(anchor, structuresMatrix, [x, y, STRUCTURE_ROAD])) {
            return null;
        }

        for (let s of exts) {
            if (s[0] == x && s[1] == y) {
                if (s[2] == STRUCTURE_EXTENSION) {
                    placeRoadAndBonusExt(x, y, s);
                } else if (s[2] != STRUCTURE_ROAD) {
                    return null;
                }
                break;
            }
        }

        for (let s of structs) {
            if (s[0] == x && s[1] == y) {
                if (s[2] == STRUCTURE_EXTENSION) {
                    placeRoadAndBonusExt(x, y, s);
                } else if (s[2] != STRUCTURE_ROAD) {
                    return null;
                }
                break;
            }
        }
        if (x == p2[0] && y == p2[1]) break;
        x += dx;
        y += dy;
    }

    return bonusExt;
};

function generateBonusExtsBetween(mx, my, structuresMatrix, anchor, exts) {
    let result = [];
    for (let dx = -1; dx <= 1; ++dx) {
        for (let dy = -1; dy <= 1; ++dy) {
            if (dx == 0 && dy == 0) continue;
            let x = anchor.x + mx + dx;
            let y = anchor.y + my + dy;

            if (!isEmptySpot(structuresMatrix, x, y)) continue;
            let stop = false;
            for (let s of exts) {
                if (s[0] == (mx + dx) && s[1] == (my + dy)) stop = true;
            }
            if (stop) continue;
            result.push([mx + dx, my + dy, STRUCTURE_EXTENSION]);
        }
    }

    return result;
};





function structToNumber(s) {
    switch (s) {
        case STRUCTURE_SPAWN: return 1;
        case STRUCTURE_EXTENSION: return 2;
        case STRUCTURE_ROAD: return 3;
        case STRUCTURE_WALL: return 4;
        case STRUCTURE_RAMPART: return 5;
        case STRUCTURE_KEEPER_LAIR: return 6;
        case STRUCTURE_PORTAL: return 7;
        case STRUCTURE_CONTROLLER: return 8;
        case STRUCTURE_LINK: return 9;
        case STRUCTURE_STORAGE: return 10;
        case STRUCTURE_TOWER: return 11;
        case STRUCTURE_OBSERVER: return 12;
        case STRUCTURE_POWER_BANK: return 13;
        case STRUCTURE_POWER_SPAWN: return 14;
        case STRUCTURE_EXTRACTOR: return 15;
        case STRUCTURE_LAB: return 16;
        case STRUCTURE_TERMINAL: return 17;
        case STRUCTURE_CONTAINER: return 18;
        case STRUCTURE_NUKER: return 19;
        case STRUCTURE_FACTORY: return 20;
        case STRUCTURE_INVADER_CORE: return 21;
        default: return 30;
    }
}








const colors = {
    gray: '#9c9c9c',
    light: '#cfcfcf',
    road: '#969696',
    energy: '#fff1a8',
    power: '#f98591',
    dark: '#5e5e5e',
    outline: '#c3dac5',
}

const speechSize = 0.5
const speechFont = 'Times New Roman'
function calculateFactoryLevelGapsPoly() {
    let x = -0.08;
    let y = -0.52;
    let result = [];

    let gapAngle = 16 * (Math.PI / 180);
    let c1 = Math.cos(gapAngle);
    let s1 = Math.sin(gapAngle);

    let angle = 72 * (Math.PI / 180);
    let c2 = Math.cos(angle);
    let s2 = Math.sin(angle);

    for (let i = 0; i < 5; ++i) {
        result.push([0.0, 0.0]);
        result.push([x, y]);
        result.push([x * c1 - y * s1, x * s1 + y * c1]);
        let tmpX = x * c2 - y * s2;
        y = x * s2 + y * c2;
        x = tmpX;
    }
    return result;
}
const factoryLevelGaps = calculateFactoryLevelGapsPoly();

RoomVisual.prototype.structure = function (x, y, type, opts = {}) {
    if (!opts.opacity) opts.opacity = 1;
    switch (type) {
        case STRUCTURE_FACTORY: {
            const outline = [
                [-0.68, -0.11],
                [-0.84, -0.18],
                [-0.84, -0.32],
                [-0.44, -0.44],
                [-0.32, -0.84],
                [-0.18, -0.84],
                [-0.11, -0.68],

                [0.11, -0.68],
                [0.18, -0.84],
                [0.32, -0.84],
                [0.44, -0.44],
                [0.84, -0.32],
                [0.84, -0.18],
                [0.68, -0.11],

                [0.68, 0.11],
                [0.84, 0.18],
                [0.84, 0.32],
                [0.44, 0.44],
                [0.32, 0.84],
                [0.18, 0.84],
                [0.11, 0.68],

                [-0.11, 0.68],
                [-0.18, 0.84],
                [-0.32, 0.84],
                [-0.44, 0.44],
                [-0.84, 0.32],
                [-0.84, 0.18],
                [-0.68, 0.11]
            ];
            this.poly(outline.map(p => [p[0] + x, p[1] + y]), {
                fill: null,
                stroke: colors.outline,
                strokeWidth: 0.05,
                opacity: opts.opacity
            });
            this.circle(x, y, {
                radius: 0.65,
                fill: '#232323',
                strokeWidth: 0.035,
                stroke: '#140a0a',
                opacity: opts.opacity
            });
            const spikes = [
                [-0.4, -0.1],
                [-0.8, -0.2],
                [-0.8, -0.3],
                [-0.4, -0.4],
                [-0.3, -0.8],
                [-0.2, -0.8],
                [-0.1, -0.4],

                [0.1, -0.4],
                [0.2, -0.8],
                [0.3, -0.8],
                [0.4, -0.4],
                [0.8, -0.3],
                [0.8, -0.2],
                [0.4, -0.1],

                [0.4, 0.1],
                [0.8, 0.2],
                [0.8, 0.3],
                [0.4, 0.4],
                [0.3, 0.8],
                [0.2, 0.8],
                [0.1, 0.4],

                [-0.1, 0.4],
                [-0.2, 0.8],
                [-0.3, 0.8],
                [-0.4, 0.4],
                [-0.8, 0.3],
                [-0.8, 0.2],
                [-0.4, 0.1]
            ];
            this.poly(spikes.map(p => [p[0] + x, p[1] + y]), {
                fill: colors.gray,
                stroke: '#140a0a',
                strokeWidth: 0.04,
                opacity: opts.opacity
            });
            this.circle(x, y, {
                radius: 0.54,
                fill: '#302a2a',
                strokeWidth: 0.04,
                stroke: '#140a0a',
                opacity: opts.opacity
            });
            this.poly(factoryLevelGaps.map(p => [p[0] + x, p[1] + y]), {
                fill: '#140a0a',
                stroke: null,
                opacity: opts.opacity
            });
            this.circle(x, y, {
                radius: 0.42,
                fill: '#140a0a',
                opacity: opts.opacity
            });
            this.rect(x - 0.24, y - 0.24, 0.48, 0.48, {
                fill: '#3f3f3f',
                opacity: opts.opacity
            });
            break;
        }
        case STRUCTURE_EXTENSION:
            this.circle(x, y, {
                radius: 0.5,
                fill: colors.dark,
                stroke: colors.outline,
                strokeWidth: 0.05,
                opacity: opts.opacity
            })
            this.circle(x, y, {
                radius: 0.35,
                fill: colors.gray,
                opacity: opts.opacity
            })
            break
        case STRUCTURE_SPAWN:
            this.circle(x, y, {
                radius: 0.65,
                fill: colors.dark,
                stroke: '#CCCCCC',
                strokeWidth: 0.10,
                opacity: opts.opacity
            })
            this.circle(x, y, {
                radius: 0.40,
                fill: colors.energy,
                opacity: opts.opacity
            })

            break;
        case STRUCTURE_POWER_SPAWN:
            this.circle(x, y, {
                radius: 0.65,
                fill: colors.dark,
                stroke: colors.power,
                strokeWidth: 0.10,
                opacity: opts.opacity
            })
            this.circle(x, y, {
                radius: 0.40,
                fill: colors.energy,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_LINK:
            {
                let osize = 0.3
                let isize = 0.2
                let outer = [
                    [0.0, -0.5],
                    [0.4, 0.0],
                    [0.0, 0.5],
                    [-0.4, 0.0]
                ]
                let inner = [
                    [0.0, -0.3],
                    [0.25, 0.0],
                    [0.0, 0.3],
                    [-0.25, 0.0]
                ]
                outer = relPoly(x, y, outer)
                inner = relPoly(x, y, inner)
                outer.push(outer[0])
                inner.push(inner[0])
                this.poly(outer, {
                    fill: colors.dark,
                    stroke: colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                })
                this.poly(inner, {
                    fill: colors.gray,
                    stroke: false,
                    opacity: opts.opacity
                })
                break;
            }
        case STRUCTURE_TERMINAL:
            {
                let outer = [
                    [0.0, -0.8],
                    [0.55, -0.55],
                    [0.8, 0.0],
                    [0.55, 0.55],
                    [0.0, 0.8],
                    [-0.55, 0.55],
                    [-0.8, 0.0],
                    [-0.55, -0.55],
                ]
                let inner = [
                    [0.0, -0.65],
                    [0.45, -0.45],
                    [0.65, 0.0],
                    [0.45, 0.45],
                    [0.0, 0.65],
                    [-0.45, 0.45],
                    [-0.65, 0.0],
                    [-0.45, -0.45],
                ]
                outer = relPoly(x, y, outer)
                inner = relPoly(x, y, inner)
                outer.push(outer[0])
                inner.push(inner[0])
                this.poly(outer, {
                    fill: colors.dark,
                    stroke: colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                })
                this.poly(inner, {
                    fill: colors.light,
                    stroke: false,
                    opacity: opts.opacity
                })
                this.rect(x - 0.45, y - 0.45, 0.9, 0.9, {
                    fill: colors.gray,
                    stroke: colors.dark,
                    strokeWidth: 0.1,
                    opacity: opts.opacity
                })
                break;
            }
        case STRUCTURE_LAB:
            this.circle(x, y - 0.025, {
                radius: 0.55,
                fill: colors.dark,
                stroke: colors.outline,
                strokeWidth: 0.05,
                opacity: opts.opacity
            })
            this.circle(x, y - 0.025, {
                radius: 0.40,
                fill: colors.gray,
                opacity: opts.opacity
            })
            this.rect(x - 0.45, y + 0.3, 0.9, 0.25, {
                fill: colors.dark,
                stroke: false,
                opacity: opts.opacity
            })
            {
                let box = [
                    [-0.45, 0.3],
                    [-0.45, 0.55],
                    [0.45, 0.55],
                    [0.45, 0.3],
                ]
                box = relPoly(x, y, box)
                this.poly(box, {
                    stroke: colors.outline,
                    strokeWidth: 0.05,
                    opacity: opts.opacity
                })
            }
            break
        case STRUCTURE_TOWER:
            this.circle(x, y, {
                radius: 0.6,
                fill: colors.dark,
                stroke: colors.outline,
                strokeWidth: 0.05,
                opacity: opts.opacity
            })
            this.rect(x - 0.4, y - 0.3, 0.8, 0.6, {
                fill: colors.gray,
                opacity: opts.opacity
            })
            this.rect(x - 0.2, y - 0.9, 0.4, 0.5, {
                fill: colors.light,
                stroke: colors.dark,
                strokeWidth: 0.07,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_ROAD:
            this.circle(x, y, {
                radius: 0.175,
                fill: colors.road,
                stroke: false,
                opacity: opts.opacity
            })
            if (!this.roads) this.roads = []
            this.roads.push([x, y])
            break;
        case STRUCTURE_RAMPART:
            this.circle(x, y, {
                radius: 0.65,
                fill: '#434C43',
                stroke: '#5D735F',
                strokeWidth: 0.10,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_WALL:
            this.circle(x, y, {
                radius: 0.40,
                fill: colors.dark,
                stroke: colors.light,
                strokeWidth: 0.05,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_STORAGE:
            let outline1 = relPoly(x, y, [
                [-0.45, -0.55],
                [0, -0.65],
                [0.45, -0.55],
                [0.55, 0],
                [0.45, 0.55],
                [0, 0.65],
                [-0.45, 0.55],
                [-0.55, 0],
                [-0.45, -0.55],
            ])
            this.poly(outline1, {
                stroke: colors.outline,
                strokeWidth: 0.05,
                fill: colors.dark,
                opacity: opts.opacity
            })
            this.rect(x - 0.35, y - 0.45, 0.7, 0.9, {
                fill: colors.energy,
                opacity: opts.opacity,
            })
            break;
        case STRUCTURE_OBSERVER:
            this.circle(x, y, {
                fill: colors.dark,
                radius: 0.45,
                stroke: colors.outline,
                strokeWidth: 0.05,
                opacity: opts.opacity
            })
            this.circle(x + 0.225, y, {
                fill: colors.outline,
                radius: 0.20,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_NUKER:
            let outline = [
                [0, -1],
                [-0.47, 0.2],
                [-0.5, 0.5],
                [0.5, 0.5],
                [0.47, 0.2],
                [0, -1],
            ];
            outline = relPoly(x, y, outline)
            this.poly(outline, {
                stroke: colors.outline,
                strokeWidth: 0.05,
                fill: colors.dark,
                opacity: opts.opacity
            })
            let inline = [
                [0, -.80],
                [-0.40, 0.2],
                [0.40, 0.2],
                [0, -.80],
            ]
            inline = relPoly(x, y, inline)
            this.poly(inline, {
                stroke: colors.outline,
                strokeWidth: 0.01,
                fill: colors.gray,
                opacity: opts.opacity
            })
            break;
        case STRUCTURE_CONTAINER:
            this.rect(x - 0.225, y - 0.3, 0.45, 0.6, {
                fill: colors.gray,
                opacity: opts.opacity,
                stroke: colors.dark,
                strokeWidth: 0.09,
            })
            this.rect(x - 0.17, y + 0.07, 0.34, 0.2, {
                fill: colors.energy,
                opacity: opts.opacity,
            })
            break;
        default:
            this.circle(x, y, {
                fill: colors.light,
                radius: 0.35,
                stroke: colors.dark,
                strokeWidth: 0.20,
                opacity: opts.opacity
            })
            break;
    }

    return this;
}

const dirs = [
    [],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1]
]

function relPoly(x, y, poly) {
    return poly.map(p => {
        p[0] += x
        p[1] += y
        return p
    })
}

module.exports = planner_loop;
return module.exports;
}
/********** End of module 35: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/roomPlanner.js **********/
/********** Start module 36: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/creep.js **********/
__modules[36] = function(module, exports) {
const { roomInfo } = __require(38,36);

Creep.prototype.sayHello = function sayHello(words="Hello") {
    this.say(words, true);
}

Creep.prototype.damaged = function() {
    return this.hits < this.hitsMax;
}

Creep.prototype.moveToNoCreep = function(target) {
    if(this.isStuck()) {
        this.moveTo(target);
    }
    this.moveTo(target, {reusePath: 50, ignoreCreeps: true});
}

Creep.prototype.moveToNoCreepInRoom = function(target) {
    if(this.isStuck()) {
        this.moveTo(target, {maxRooms: 1});
    }
    this.moveTo(target, {reusePath: 50, ignoreCreeps: true, maxRooms: 1});
}

Creep.prototype.moveToRoom = function(roomName) {
    if(this.isStuck()) {
        this.moveTo(new RoomPosition(25, 25, roomName));
    }
    return this.moveToNoCreep(new RoomPosition(25, 25, roomName));
}

Creep.prototype.moveToRoomAdv = function(roomName) {
    if (roomName && roomName != this.room.name) {
        this.moveToNoCreep(new RoomPosition(25, 25, roomName));
        return true;
    }
    if (this.pos.x == 0) {
        this.move(RIGHT);
        return true;
    }
    if (this.pos.x == 49) {
        this.move(LEFT);
        return true;
    }
    if (this.pos.y == 0) {
        this.move(BOTTOM);
        return true;
    }
    if (this.pos.y == 49) {
        this.move(TOP);
        return true;
    }

    return false;
}

Creep.prototype.workerSetStatus = function() {
    if(this.memory.status && this.store.getUsedCapacity() == 0) {
        this.memory.status = 0;
    }
    if(!this.memory.status && this.store.getFreeCapacity() == 0) {
        this.memory.status = 1;
    }
}

Creep.prototype.workerSetStatusWithAction = function(onHarvest=null, onWork=null) {
    if(this.memory.status && this.store.getUsedCapacity() == 0) {
        this.memory.status = 0;
        if(onHarvest) onHarvest();
    }
    if(!this.memory.status && this.store.getFreeCapacity() == 0) {
        this.memory.status = 1;
        if(onWork) onWork();
    }
}
Creep.prototype.collectEnergy = function collectEnergy(changeStatus=false) {
    var dropedResource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount > this.store.getCapacity() / 2});
    if (dropedResource) {
        let result = this.pickup(dropedResource);
        if(result == ERR_NOT_IN_RANGE) {
            this.moveTo(dropedResource);
        }
        else if(changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }
    if(this.room.memory.linkCompleteness == true) {
        return false;
    }
    var container = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: structure => (
        structure.structureType == STRUCTURE_CONTAINER && 
        !structure.pos.inRangeTo(this.room.controller.pos, 3) &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getCapacity() / 2
        )});

    if (container) {
        let resourceType = RESOURCE_ENERGY;
        let result = this.withdraw(container, resourceType);
        if(result == ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
        else if(changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }
    var tomstone = _.find(this.room.find(FIND_TOMBSTONES), ts => ts.store[RESOURCE_ENERGY] > this.store.getCapacity() / 2);
    if (tomstone) {
        let result = this.withdraw(tomstone, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            this.moveTo(tomstone);
        }
        else if(changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }

    return false;
}

Creep.prototype.harvestEnergy = function harvestEnergy() {
    let source;
    let result;
    if (this.memory.target != undefined) {
        source = this.room.find(FIND_SOURCES)[this.memory.target];
    }
    else {
        this.say('!target')
        source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    }

    if(!source) {
        console.log(this.name)
        return ERR_NOT_FOUND;
    }

    if(!this.pos.inRangeTo(source.pos, 1)) {
        this.moveTo(source, {reusePath: 10});
        result = ERR_NOT_IN_RANGE;
    }
    else {
        let links = this.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => struct.structureType == STRUCTURE_LINK && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
        if(links.length > 0) {
            result = this.harvest(source);
            if(links.length > 0 && (this.store.getFreeCapacity() < 20 || this.ticksToLive < 2 || result == ERR_NOT_ENOUGH_RESOURCES)) {
                this.transfer(links[0], RESOURCE_ENERGY);
            }
        }
        else {
            let contianer = this.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => (
                struct.structureType == STRUCTURE_CONTAINER &&
                struct.pos.inRangeTo(source.pos, 1)
            )});
            if(contianer) {
                if(!contianer.pos.isEqualTo(this.pos)) this.moveTo(contianer);
                if(contianer.store.getFreeCapacity() > 0) result = this.harvest(source);
                else result = ERR_NOT_ENOUGH_RESOURCES;
            }
            else {
                result = this.harvest(source);
            }
        }
    }

    return result;
}

Creep.prototype.takeEnergyFromStorage = function takeEnergyFromStorage() {
    var storage = this.room.storage;
    if (storage && storage.store.getUsedCapacity() > this.store.getFreeCapacity()) {
        var resourceType = RESOURCE_ENERGY;
        if(this.withdraw(storage, resourceType) == ERR_NOT_IN_RANGE) {
            this.moveTo(storage);
        }
        return;
    }
}


Creep.prototype.takeEnergyFromClosest = function takeEnergyFromClosest() {
    var dropedResource = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount >= this.store.getCapacity()});
    if (dropedResource) {
        if(this.pickup(dropedResource) == ERR_NOT_IN_RANGE) {
            this.moveToNoCreepInRoom(dropedResource);
        }
        return;
    }
    let targets = _.filter(this.room.find(FIND_STRUCTURES), structure => (
        (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && 
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity()));
    let target = this.pos.findClosestByRange(targets);
    if (target) {
        if(this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveToNoCreepInRoom(target);
        }
        return;
    }
    this.toResPos();
}

Creep.prototype.takeEnergyFromControllerLink = function() {
    if(this.memory.ControllerLinkId) {
        let target = Game.getObjectById(this.memory.ControllerLinkId);
        let result = this.withdraw(target, RESOURCE_ENERGY);
        
        if(result == ERR_NOT_IN_RANGE) this.moveTo(target);
        else if(result == OK) this.memory.status = 1;
    }
    else {
        let controllerLinkArray = this.room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LINK && struct.pos.inRangeTo(this.room.controller.pos, 2)});
        if(controllerLinkArray.length) {
            this.memory.ControllerLinkId = controllerLinkArray[0].id;
        }
        else {
            this.takeEnergyFromClosest();
        }
    }
}

Creep.prototype.toResPos = function toResPos(restTime=5) {
    if (roomInfo[this.room.name]) {
        if (this.pos.isNearTo(roomInfo[this.room.name].restPos)) {
            this.memory.restTime = restTime;
        }
        else {
            this.moveTo(roomInfo[this.room.name].restPos);
        }   
    }
}
Creep.prototype.isStuck = function() {
    let stuck = false;

    if(this.memory.lastPos === undefined || this.memory.lastPos.x != this.pos.x && this.memory.lastPos.x != this.pos.x) {
        this.memory.lastPos = {x: this.pos.x, y: this.pos.y, t: 0};
    }
    else {
        if(this.memory.lastPos.t > 1) { // stuck for 1 tick
            stuck = true;   
        }
        if(this.fatigue == 0) {
            this.memory.lastPos.t += 1;
        }

    }
    return stuck;
}

Creep.prototype.isAtEdge = function() {
    let pos = this.pos;
	return pos.x == 0 || pos.y == 0 || pos.x == 49 || pos.y == 49;
}

return module.exports;
}
/********** End of module 36: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/creep.js **********/
/********** Start module 37: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/room.js **********/
__modules[37] = function(module, exports) {
Room.prototype.needStorage2Terminal = function(managerCreep) {
    return _.find(Object.keys(this.storage.store), resourceType => this.storage.store[resourceType] > 100000 && resourceType != RESOURCE_ENERGY);
}

Room.prototype.addTransferTask = function(task) {
    if(!this.memory.tasks) this.memory.tasks = {};
    if(!this.memory.tasks.transferTask) this.memory.tasks.transferTask = [];
    this.memory.tasks.transferTask.push(task);
}

Room.prototype.getTransferTasks = function() {
    if(!this.memory.tasks) this.memory.tasks = {};
    if(!this.memory.tasks.transferTask) this.memory.tasks.transferTask = [];
    
    return this.memory.tasks.transferTask;
}
return module.exports;
}
/********** End of module 37: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/room.js **********/
/********** Start module 38: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/index.js **********/
__modules[38] = function(module, exports) {
const config = {
    roomInfo:               __require(42,38),
    roomResourceConfig:     __require(43,38),
    compondsRequirements:   __require(44,38),
}

module.exports = config;
return module.exports;
}
/********** End of module 38: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/index.js **********/
/********** Start module 39: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/index.js **********/
__modules[39] = function(module, exports) {
let structureLogic = {
    rampart:  __require(45,39),
    wall:     __require(46,39),
}

module.exports = structureLogic;
return module.exports;
}
/********** End of module 39: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/index.js **********/
/********** Start module 40: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/index.js **********/
__modules[40] = function(module, exports) {
let constants = {
    reactionResources:  __require(47,40),
}

module.exports = constants;
return module.exports;
}
/********** End of module 40: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/index.js **********/
/********** Start module 41: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/models/taskModels.js **********/
__modules[41] = function(module, exports) {
var ManagerTask = function(from, to, resourceType, amount, priority = 0) {
    return {
        from: from,
        to: to,
        resourceType: resourceType,
        amount: amount,
        priority: priority,
    }
};

var TowerRepairTask = function(structId, targethits = null) {
    return {structId: structId, targethits: targethits}
};

var LabTask = function(resourceType, amount) {
    return {resourceType: resourceType, amount: amount}
};

var transferTask = function(withdrawTarget, transferTarget, resourceType, amount) {
    return {
        withdrawTarget: withdrawTarget,
        transferTarget: transferTarget,
        resourceType: resourceType,
        amount: amount,
    }
};

module.exports = {ManagerTask, TowerRepairTask, LabTask, transferTask};
return module.exports;
}
/********** End of module 41: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/models/taskModels.js **********/
/********** Start module 42: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/roomConfig.js **********/
__modules[42] = function(module, exports) {
module.exports = {
    W19S17: {
        restPos: new RoomPosition(24, 9, "W19S17"),
        managerPos: new RoomPosition(31, 9, "W19S17"),
    },
    W21S19: {
        restPos: new RoomPosition(24, 31, "W21S19"),
        managerPos: new RoomPosition(21, 36, "W21S19"),
    },
    W16S17: {
        restPos: new RoomPosition(15, 12, "W16S17"),
        managerPos: new RoomPosition(18, 20, "W16S17"),
    },
    W13S21: {
        restPos: new RoomPosition(38, 44, "W13S21"),
        managerPos: new RoomPosition(37, 38, "W13S21"),
    },
    W18S15: {
        restPos: new RoomPosition(37, 11, "W18S15"),
        managerPos: new RoomPosition(34, 16, "W18S15"),
    },
    W15S13: {
        restPos: new RoomPosition(42, 11, "W15S13"),
        managerPos: new RoomPosition(38, 11, "W15S13"),
    },
    W12S21: {
        restPos: new RoomPosition(11, 21, "W12S21"),
        managerPos: new RoomPosition(6, 19, "W12S21"),
    },
    W22S15: {
        restPos: new RoomPosition(16, 13, "W22S15"),
        managerPos: new RoomPosition(15, 16, "W22S15"),
    },
    W13S15: {
        restPos: new RoomPosition(18, 20, "W13S15"),
        managerPos: new RoomPosition(22, 18, "W13S15"),
    },
    sim: {
        restPos: new RoomPosition(19, 21, "sim"),
        managerPos: new RoomPosition(23, 26, "sim"),
    },
}
return module.exports;
}
/********** End of module 42: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/roomConfig.js **********/
/********** Start module 43: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/roomResourceConfig.js **********/
__modules[43] = function(module, exports) {
// resourceType: {terminal: amount, storage: [ShortageLine, AbundantLine, ExceededLine]}
module.exports = {
    energy: {terminal: 50000, storage: [200000, 500000, 600000]},

    O: {terminal: 5000, storage: [10000, 20000, 30000]},
    H: {terminal: 5000, storage: [10000, 20000, 30000]},
    U: {terminal: 5000, storage: [5000, 10000, 20000]},
    K: {terminal: 5000, storage: [5000, 10000, 20000]},
    L: {terminal: 5000, storage: [5000, 10000, 20000]},
    Z: {terminal: 5000, storage: [5000, 10000, 20000]},
    X: {terminal: 5000, storage: [5000, 10000, 20000]},
    G: {terminal: 5000, storage: [5000, 10000, 20000]},

    XUH2O: {terminal: 5000, storage: [10000, 20000, 30000]}, // attack
    XUHO2: {terminal: 5000, storage: [5000, 10000, 15000]}, // harvest
    XKH2O: {terminal: 5000, storage: [10000, 20000, 30000]}, // carry
    XKHO2: {terminal: 5000, storage: [10000, 20000, 30000]}, // ranged_attack
    XLH2O: {terminal: 5000, storage: [10000, 20000, 30000]}, // repair & build
    XLHO2: {terminal: 5000, storage: [10000, 20000, 30000]}, // heal
    XZH2O: {terminal: 5000, storage: [10000, 20000, 30000]}, // dismantle
    XZHO2: {terminal: 5000, storage: [10000, 20000, 30000]}, // move
    XGH2O: {terminal: 5000, storage: [10000, 20000, 30000]}, // upgradeController
    XGHO2: {terminal: 5000, storage: [5000, 10000, 15000]}, // tough
    
    power: {terminal: 1000, storage: [1000, 5000, 20000]},
    ops: {terminal: 1000, storage: [1000, 5000, 20000]},
    battery: {terminal: 2000, storage: [2000, 5000, 10000]},
};
return module.exports;
}
/********** End of module 43: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/roomResourceConfig.js **********/
/********** Start module 44: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/labProductConfig.js **********/
__modules[44] = function(module, exports) {
// order based on creation priority
module.exports = {
    XUH2O: [10000, 20000], // attack
    XLH2O: [10000, 20000],  // repair & build
    XKH2O: [10000, 20000],  // carry
    XZHO2: [10000, 20000], // move
    
    XGH2O: [10000, 20000],  // upgradeController
    
    XKHO2: [10000, 20000], // ranged_attack
    XLHO2: [10000, 20000],  // heal
    XZH2O: [10000, 20000],  // dismantle
    XGHO2: [5000, 10000], // tough

    XUHO2: [5000, 10000], // harvest
}
return module.exports;
}
/********** End of module 44: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/labProductConfig.js **********/
/********** Start module 45: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/rampart.js **********/
__modules[45] = function(module, exports) {
var rampart = {
    targetHits: {
        0: 0,
        1: 1000, 
        2: 100000, 
        3: 500000, 
        4: 1000000, 
        5: 2000000,
        6: 5000000,
        7: 10000000,
        8: 20000000,
    },

    getTargetHits: function(room) {
        return this.targetHits[room.controller.level];
    },

    getIdealHits: function(room) {
        return this.targetHits[room.controller.level] + 10000;
    },
}

module.exports = rampart;
return module.exports;
}
/********** End of module 45: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/rampart.js **********/
/********** Start module 46: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/wall.js **********/
__modules[46] = function(module, exports) {
var wall = {
    targetHits: {
        0: 0,
        1: 1000, 
        2: 100000, 
        3: 500000, 
        4: 1000000, 
        5: 2000000,
        6: 5000000,
        7: 10000000,
        8: 20000000,
    },

    getTargetHits: function(room) {
        return this.targetHits[room.controller.level]
    },

    getIdealHits: function(room) {
        return this.targetHits[room.controller.level] + 10000;
    },
}

module.exports = wall;
return module.exports;
}
/********** End of module 46: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/wall.js **********/
/********** Start module 47: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/reactionResources.js **********/
__modules[47] = function(module, exports) {
module.exports = {
    OH: [ 'H', 'O' ],
    LH: [ 'H', 'L' ],
    KH: [ 'H', 'K' ],
    UH: [ 'H', 'U' ],
    ZH: [ 'H', 'Z' ],
    GH: [ 'H', 'G' ],
    LO: [ 'O', 'L' ],
    KO: [ 'O', 'K' ],
    UO: [ 'O', 'U' ],
    ZO: [ 'O', 'Z' ],
    GO: [ 'O', 'G' ],
    ZK: [ 'Z', 'K' ],
    UL: [ 'L', 'U' ],
    UH2O: [ 'OH', 'UH' ],
    UHO2: [ 'OH', 'UO' ],
    ZH2O: [ 'OH', 'ZH' ],
    ZHO2: [ 'OH', 'ZO' ],
    KH2O: [ 'OH', 'KH' ],
    KHO2: [ 'OH', 'KO' ],
    LH2O: [ 'OH', 'LH' ],
    LHO2: [ 'OH', 'LO' ],
    GH2O: [ 'OH', 'GH' ],
    GHO2: [ 'OH', 'GO' ],
    XUH2O: [ 'X', 'UH2O' ],
    XUHO2: [ 'X', 'UHO2' ],
    XLH2O: [ 'X', 'LH2O' ],
    XLHO2: [ 'X', 'LHO2' ],
    XKH2O: [ 'X', 'KH2O' ],
    XKHO2: [ 'X', 'KHO2' ],
    XZH2O: [ 'X', 'ZH2O' ],
    XZHO2: [ 'X', 'ZHO2' ],
    XGH2O: [ 'X', 'GH2O' ],
    XGHO2: [ 'X', 'GHO2' ],
    G: [ 'ZK', 'UL' ]
};
return module.exports;
}
/********** End of module 47: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/reactionResources.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
