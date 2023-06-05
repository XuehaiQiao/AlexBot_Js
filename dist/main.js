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
const test = __require(3,0);
const tools = __require(4,0);
__require(5,0);

module.exports.loop = function () {
    console.log("---------- " + Game.shard.name + ", Start Tick: " + Game.time + " ----------");

    if (Game.cpu.bucket < 20) {
        console.log('CPU bucket is low, skip this tick..');
        return;
    }

    test.sandbox.startOfTheTick();

    /**
     * ====================================
     *            MEMORY FREE
     * ====================================
     */
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    /**
     * ====================================
     *            ROOM LOGICS
     * ====================================
     */
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    let totalRoomCpu = -Game.cpu.getUsed();
    roomLogic.roomCensus();
    _.forEach(Game.myRooms, r => {
        roomLogic.roomInit(r);
        roomLogic.spawning(r);
        roomLogic.towerLogic(r);
        roomLogic.linkTransfer(r);
        roomLogic.labReaction(r);
        roomLogic.powerOperation(r);
        roomLogic.factorayLogic(r);
    });
    roomLogic.resourceBalancing(Game.myRooms);
    roomLogic.marketLogic();
    totalRoomCpu += Game.cpu.getUsed();

    
    
    /**
     * =====================================
     *            CREEP LOGICS
     * =====================================
     */
    let totalCreepCpu = -Game.cpu.getUsed();
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        let role = creep.memory.role;
        if (creepLogic[role]) creepLogic[role].run(creep);
    }

    totalCreepCpu += Game.cpu.getUsed();
    

    if (Game.shard.name === 'shard2' && Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel();
    }

    /**
     * ====================================
     *               LOGS
     * ====================================
     */
    roomLogic.exportStats();
    
    console.log('total room cpu: ', totalRoomCpu);
    console.log('total creep cpu: ', totalCreepCpu);
    console.log('CPU bucket: ', Game.cpu.bucket);

    test.sandbox.endOfTheTick();

    console.log("---------- End Tick, No Errors ----------");
}
return module.exports;
}
/********** End of module 0: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/main.js **********/
/********** Start module 1: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/index.js **********/
__modules[1] = function(module, exports) {
let creepLogic = {
    harvester:      __require(6,1),
    carrier:        __require(7,1),
    upgrader:       __require(8,1),
    builder:        __require(9,1),
    harvester2:     __require(10,1),
    carrier2:       __require(11,1),
    upgrader2:      __require(12,1),
    builder2:       __require(13,1),
    manager:        __require(14,1),
    miner:          __require(15,1),
    mineralCarrier: __require(16,1),
    claimer:        __require(17,1),
    outSourcer:     __require(18,1),
    remoteHarvester:__require(19,1),
    remoteHauler:   __require(20,1),
    keeperAttacker: __require(21,1),
    invaderAttacker:__require(22,1),
    transporter:    __require(23,1),
    defender:       __require(24,1),
    remoteMiner:    __require(25,1),
    wrecker:        __require(26,1),
    medic:          __require(27,1),
    scout:          __require(28,1),
    rangeAtker:     __require(29,1),
    
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 1: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/index.js **********/
/********** Start module 2: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/index.js **********/
__modules[2] = function(module, exports) {
const roomLogic = {
    spawning:           __require(30,2),
    linkTransfer:       __require(31,2),
    roomCensus:         __require(32,2),
    exportStats:        __require(33,2),
    labReaction:        __require(34,2),
    resourceBalancing:  __require(35,2),
    powerOperation:     __require(36,2),
    factorayLogic:      __require(37,2),
    marketLogic :       __require(38,2),
    towerLogic:         __require(39,2),
    roomInit:           __require(40,2),
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 2: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/index.js **********/
/********** Start module 3: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/test/index.js **********/
__modules[3] = function(module, exports) {
const test = {
    sandbox: __require(41,3),
}

module.exports = test;
return module.exports;
}
/********** End of module 3: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/test/index.js **********/
/********** Start module 4: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/index.js **********/
__modules[4] = function(module, exports) {
let tools = {
    roomPlanner:  __require(42,4),
    myRoomPlanner:  __require(43,4),
    traveler:       __require(44,4),
}

module.exports = tools;
return module.exports;
}
/********** End of module 4: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/index.js **********/
/********** Start module 5: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/index.js **********/
__modules[5] = function(module, exports) {
__require(45,5);
__require(46,5);
return module.exports;
}
/********** End of module 5: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/index.js **********/
/********** Start module 6: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/harvester.js **********/
__modules[6] = function(module, exports) {
const { roomInfo } = __require(47,6);

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
/********** End of module 6: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/harvester.js **********/
/********** Start module 7: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/carrier.js **********/
__modules[7] = function(module, exports) {
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
/********** End of module 7: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/carrier.js **********/
/********** Start module 8: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/upgrader.js **********/
__modules[8] = function(module, exports) {
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
/********** End of module 8: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/upgrader.js **********/
/********** Start module 9: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/builder.js **********/
__modules[9] = function(module, exports) {
const { roomInfo } = __require(47,9);
const structureLogic = __require(48,9);

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
/********** End of module 9: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/builder.js **********/
/********** Start module 10: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/harvester2.js **********/
__modules[10] = function(module, exports) {
module.exports = {
    properties: {
        role: 'harvester2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, WORK, MOVE, MOVE], number: 3},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 2},
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
            if(!source.energy) creep.memory.rest = source.ticksToRegeneration;
        }
    },
    spawn: function(room) {
        const sourceCount = room.find(FIND_SOURCES).length;
        const stage = this.getStage(room);

        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        let totalNeeds = 0;
        const rInfo = room.memory.roomInfo;
        if(rInfo) {
            for(const sourceObj of rInfo.sourceInfo) {
                totalNeeds += Math.min(this.properties.stages[stage].number, sourceObj.space);
            }
        }
        else {
            totalNeeds = sourceCount * this.properties.stages[stage].number
        }

        if (creepCount < totalNeeds) {
            return true;
        }
    },
    spawnData: function(room) {
        const stage = this.getStage(room);
        const rInfo = room.memory.roomInfo;

        const name = this.properties.role + Game.time; 
        const body = this.properties.stages[stage].bodyParts;

        const existingThisTypeCreeps = _.filter(Game.creeps, creep => (
            creep.memory.role == this.properties.role && 
            creep.memory.base == room.name &&
            !(creep.ticksToLive < creep.body.length * 3)
        ));
        
        let targetCount = {}
        existingThisTypeCreeps.forEach((creep) => {
            let targetId = creep.memory.target;
            if(targetCount[targetId]) targetCount[targetId] += 1;
            else targetCount[targetId] = 1;
        });

        let sourceTarget;
        let sources = room.find(FIND_SOURCES);
        for(const index in sources) {
            let creepNeed;
            if(rInfo) {
                creepNeed = Math.min(this.properties.stages[stage].number, rInfo.sourceInfo[index].space);
            }
            else creepNeed = this.properties.stages[stage].number;

            if (targetCount[index] >= creepNeed) continue;
            sourceTarget = index;
            break;
        }

        const memory = {role: this.properties.role, status: 0, target: sourceTarget, base: room.name};

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
/********** End of module 10: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/harvester2.js **********/
/********** Start module 11: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/carrier2.js **********/
__modules[11] = function(module, exports) {
const { roomInfo } = __require(47,11);

module.exports = {
    properties: {
        type: 'carrier2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[CARRY, MOVE, CARRY, MOVE], number: 3},
            2: {maxEnergyCapacity: 550, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            3: {maxEnergyCapacity: 800, bodyParts:[CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(16).fill(CARRY), ...new Array(8).fill(MOVE)], number: 2},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(20).fill(CARRY), ...new Array(10).fill(MOVE)], number: 2},
            6: {maxEnergyCapacity: 5600, bodyParts:[...new Array(20).fill(CARRY), ...new Array(10).fill(MOVE)], number: 1},
            8: {maxEnergyCapacity: 10000, bodyParts:[...new Array(32).fill(CARRY), ...new Array(16).fill(MOVE)], number: 1},
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
            let containers = creep.room.find(FIND_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_CONTAINER});
            
            if(containers.length) {
                if(roomInfo[creep.room.name] && roomInfo[creep.room.name].storagePos) {
                    storage = _.find(containers, con => (
                        con.pos.isEqualTo(roomInfo[creep.room.name].storagePos) &&
                        con.store.getFreeCapacity() > 0
                    ));
                }

                if(!storage) {
                    storage = _.find(containers, con => (
                        con.pos.inRangeTo(creep.room.controller.pos, 3) &&
                        con.store.getFreeCapacity() > 0
                    ));
                }
            };
        }
        if(creep.memory.status == 0) {
            if(!creep.collectEnergy()) {
                creep.toResPos();
            }
            return;
        }
        else {
            if (!storage || storage.store.getFreeCapacity() === 0) {
                if (creep.pos.inRangeTo(creep.room.controller.pos, 4)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveToNoCreepInRoom(creep.room.controller);
            }
            else if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
            let extensionSpawns = creep.room.find(FIND_MY_STRUCTURES, {
                filter: struct => (struct.structureType == STRUCTURE_EXTENSION || struct.structureType == STRUCTURE_SPAWN) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });

            if (extensionSpawns.length) {
                let nearestTarget = extensionSpawns.reduce((a, b) => {
                    return (creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b) > 0) ? b : a;
                });
                
                let result = creep.transfer(nearestTarget, RESOURCE_ENERGY);
                if(result === ERR_NOT_IN_RANGE) creep.moveToNoCreepInRoom(nearestTarget);
                else if(result === OK) {
                    if(extensionSpawns.length > 1) {
                        let nextTarget = extensionSpawns.reduce((a, b) => {
                            if(a == nearestTarget) return b;
                            else if(b == nearestTarget) return a;
                            return (creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b) > 0) ? b : a;
                        });
                        creep.moveToNoCreepInRoom(nextTarget);
                    }
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
        if(global.roomCensus[room.name] && global.roomCensus[room.name][this.properties.type] != null) creepCount = global.roomCensus[room.name][this.properties.type]
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
/********** End of module 11: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/carrier2.js **********/
/********** Start module 12: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/upgrader2.js **********/
__modules[12] = function(module, exports) {
const { roomInfo } = __require(47,12);

module.exports = {
    properties: {
        type: 'upgrader2',
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[WORK, CARRY, MOVE], number: 1},
            2: {maxEnergyCapacity: 550, bodyParts:[WORK, WORK, WORK, CARRY, MOVE, MOVE], number: 8},
            3: {maxEnergyCapacity: 800, bodyParts:[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], number: 8},
            4: {maxEnergyCapacity: 1300, bodyParts:[...new Array(8).fill(WORK), ...new Array(4).fill(CARRY), ...new Array(4).fill(MOVE)], number: 6},
            5: {maxEnergyCapacity: 1800, bodyParts:[...new Array(10).fill(WORK), ...new Array(3).fill(CARRY), ...new Array(5).fill(MOVE)], mBodyParts: [...new Array(12).fill(WORK), ...new Array(2).fill(CARRY), ...new Array(6).fill(MOVE)], number: 1},
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(14).fill(WORK), ...new Array(4).fill(CARRY), ...new Array(7).fill(MOVE)], mBodyParts: [...new Array(14).fill(WORK), ...new Array(2).fill(CARRY), ...new Array(7).fill(MOVE)], number: 1},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], mBodyParts: [...new Array(30).fill(WORK), ...new Array(2).fill(CARRY), ...new Array(15).fill(MOVE)], number: 0},
            8: {maxEnergyCapacity: 10000, bodyParts:[...new Array(15).fill(WORK), ...new Array(15).fill(CARRY), ...new Array(15).fill(MOVE)], mBodyParts: [...new Array(15).fill(WORK), ...new Array(2).fill(CARRY), ...new Array(8).fill(MOVE)], number: 1},
        },
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.getBoosts();
            return;
        }
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        if(
            creep.room.memory.linkInfo.controllerLink && 
            creep.room.memory.linkInfo.managerLink &&
            roomInfo[creep.room.name] &&
            roomInfo[creep.room.name].managerPos
        ) this.managerLogic(creep);
        else  this.noManagerLogic(creep);
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
            let constSites = creep.room.controller.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);
            if(constSites.length) {
                if(creep.build(constSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {reusePath: 10});
                }
            }
            else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {reusePath: 10});
            }
        }
        else {
            if(!creep.takeEnergyNeerController()) {
                if(!creep.pos.inRangeTo(creep.room.controller, 4)) {
                    creep.moveTo(creep.room.controller);
                }
            }
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
            num += Math.min(Math.ceil((2 * storage.store[RESOURCE_ENERGY] + 300000) / (1 + storage.store.getFreeCapacity())), 4);
        }
        return creepCount < num ? true : false;
    },
    spawnData: function(room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        let body;
        let storage = room.storage;
        
        if(
            room.memory.linkInfo.controllerLink && 
            room.memory.linkInfo.managerLink &&
            roomInfo[room.name] &&
            roomInfo[room.name].managerPos &&
            room.energyCapacityAvailable >= 1800
        ) body = this.properties.stages[stage].mBodyParts;
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
/********** End of module 12: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/upgrader2.js **********/
/********** Start module 13: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/builder2.js **********/
__modules[13] = function(module, exports) {
const structureLogic = __require(48,13);
const { roomInfo } = __require(47,13);

module.exports = {
    properties: {
        type: "builder2",
        stages: {
            1: { maxEnergyCapacity: 300, bodyParts: [WORK, CARRY, MOVE], number: 4 },
            2: { maxEnergyCapacity: 550, bodyParts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 3 },
            3: { maxEnergyCapacity: 800, bodyParts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], number: 2 },
            4: { maxEnergyCapacity: 1300, bodyParts: [...new Array(6).fill(WORK), ...new Array(6).fill(CARRY), ...new Array(6).fill(MOVE)], number: 1 },
            5: { maxEnergyCapacity: 1800, bodyParts: [...new Array(9).fill(WORK), ...new Array(9).fill(CARRY), ...new Array(9).fill(MOVE)], number: 1 },
            6: { maxEnergyCapacity: 2300, bodyParts: [...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], number: 1 },
            7: { maxEnergyCapacity: 5600, bodyParts: [...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], number: 1 },
            8: { maxEnergyCapacity: 10000, bodyParts: [...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], number: 1 },
        }
    },

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }

        creep.workerSetStatusWithAction(null, () => {
            creep.memory.targetId = null;
            this.assignTarget(creep);
        })
        if (creep.memory.status) {
            var target = this.assignTarget(creep);
            if (!target) {
                creep.say('!Target')
                creep.memory.role = 'upgrader2';
                return;
            }
            if (!target.hits) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return;
            }
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                let data = {};
                creep.travelTo(target, { returnData: data });
                if (data.path) { 
                    creep.say(`${data.path.length} more!`);
                    creep.room.visual.circle(data.nextPos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
                }
            }

        }
        else {
            if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] < 5000) {
                creep.toResPos();
            }
            else if (
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

    spawn: function (room) {
        let constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        let needRepairs = _.filter(room.find(FIND_STRUCTURES), structure => (
            (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < structureLogic.wall.getTargetHits(room)
        ))

        if (constructionSites.length == 0 && needRepairs.length == 0) {
            return false;
        }
        let creepCount;
        if (global.roomCensus[room.name][this.properties.type]) creepCount = global.roomCensus[room.name][this.properties.type]
        else creepCount = 0;

        var stage = this.getStage(room);
        return creepCount < this.properties.stages[stage].number ? true : false;
    },
    spawnData: function (room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        let body = this.properties.stages[stage].bodyParts;
        let memory = { role: this.properties.type, building: 1, base: room.name };

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

    assignTarget: function (creep) {
        let target = Game.getObjectById(creep.memory.targetId);
        if (target) {
            if (target.hits && target.hits >= structureLogic.wall.getTargetHits(creep.room)) {
                creep.memory.targetId = null;
                target = null;
            }
            else return target;
        }


        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            creep.memory.targetId = targets[0].id;
            return Game.getObjectById(targets[0].id);
        }

        targets = _.filter(creep.room.find(FIND_STRUCTURES), structure => (
            (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < structureLogic.wall.getTargetHits(creep.room)
        ))
        if (targets.length) {
            let target = targets.reduce((a, b) => {
                if (a.hits < b.hits) return a;
                else return b;
            });
            creep.memory.targetId = target.id;
            return Game.getObjectById(target.id);
        }

        return null;
    }
};
return module.exports;
}
/********** End of module 13: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/builder2.js **********/
/********** Start module 14: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/manager.js **********/
__modules[14] = function(module, exports) {
const { roomInfo, roomResourceConfig } = __require(47,14);
const { commodities } = __require(49,14);
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
        if(creep.memory.updated == undefined || Game.time % 30 === 17) {
            updateMemory(creep);
        }
        creep.workerSetStatus();
        if(creep.memory.status) {
            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            let target = Game.getObjectById(creep.memory.target);

            if(target && creep.transfer(target, resourceType) === OK) {
                return;
            }
            else if(creep.room.storage && creep.transfer(creep.room.storage, resourceType) === OK) { 
                return;
            }
            else {
                creep.drop(resourceType);
                return;
            }
            
        }
        else {
            if(creep.ticksToLive === 1) return;
            let managerWorks = [
                coreWork,
                terminalBalance,
                feedPowerSpawn,
                factoryWork,
                doTask,
                commodity2Terminal,
            ]

            for(i in managerWorks) {
                if(managerWorks[i](creep)) return;
            }
        }
    },
    spawn: function(room) {
        if(room.controller.level < 5) return false;
        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body = [MOVE, ...new Array(20).fill(CARRY)];
        let memory = {role: this.properties.role, status: 0, base: room.name};

        return {name, body, memory};
    },
};
function coreWork(creep) {
    let storage = Game.getObjectById(creep.memory[STRUCTURE_STORAGE]);
    let link = Game.getObjectById(creep.memory[STRUCTURE_LINK]);
    let controllerLink = Game.getObjectById(creep.memory.controllerLink);
    if(!controllerLink || !link || !storage) return false;
    if(storage.store[RESOURCE_ENERGY] >= 10000 && controllerLink.store[RESOURCE_ENERGY] < 100 && link.store[RESOURCE_ENERGY] < 700 && link.cooldown <= 2) {
        creep.say('S2L');
        fromA2B(creep, storage, link, RESOURCE_ENERGY, Math.min(link.store.getFreeCapacity(RESOURCE_ENERGY), controllerLink.store.getFreeCapacity(RESOURCE_ENERGY)));
        return true;
    }
    else if(link.store[RESOURCE_ENERGY] > 0 && controllerLink.store[RESOURCE_ENERGY] >= 100 && storage.store.getFreeCapacity() > creep.store.getCapacity()) {
        creep.say('L2S');
        fromA2B(creep, link, storage, RESOURCE_ENERGY);
        return true;
    }

    return false
};

function terminalBalance(creep) {
    let storage = Game.getObjectById(creep.memory[STRUCTURE_STORAGE]);
    let terminal = Game.getObjectById(creep.memory[STRUCTURE_TERMINAL]);
    if(!terminal || !storage) return false;

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

function feedPowerSpawn(creep) {
    let storage = Game.getObjectById(creep.memory[STRUCTURE_STORAGE]);
    let powerSpawn = Game.getObjectById(creep.memory[STRUCTURE_POWER_SPAWN]);
    if(!powerSpawn || !storage) return false;

    if(powerSpawn.store.getFreeCapacity(RESOURCE_ENERGY) > creep.store.getCapacity()) {
        creep.say('2PS');
        fromA2B(creep, storage, powerSpawn, RESOURCE_ENERGY);
        return true;
    }
    else if(powerSpawn.store[RESOURCE_POWER] == 0 && storage.store[RESOURCE_POWER] > 0) {
        creep.say('2PS');
        fromA2B(creep, storage, powerSpawn, RESOURCE_POWER, Math.min(100, storage.store[RESOURCE_POWER]));
        return true;
    }

    return false;
};

function factoryWork(creep) {
    let storage = Game.getObjectById(creep.memory[STRUCTURE_STORAGE]);
    let factory = Game.getObjectById(creep.memory[STRUCTURE_FACTORY]);
    if(!factory || !storage) return false;

    if(factory.store[RESOURCE_ENERGY] < 1000) {
        creep.say('S2F');
        fromA2B(creep, storage, factory, RESOURCE_ENERGY);
        return true;
    }

    return false;
}

function doTask(creep) {
    if(!creep.room.memory.tasks) creep.room.memory.tasks = {};
    if(!creep.room.memory.tasks.managerTasks) creep.room.memory.tasks.managerTasks = [];
    let managerTasks = creep.room.memory.tasks.managerTasks;
    if(managerTasks.length === 0) return false;

    let task = managerTasks[0];
    let transferVolume;
    if(task.volume <= creep.store.getFreeCapacity()) {
        transferVolume = task.volume;
        managerTasks.shift();
    }
    else {
        transferVolume = creep.store.getFreeCapacity();
        task.volume -= transferVolume;
    }
    let target = Game.getObjectById(creep.memory[task.from]);
    if(target && creep.withdraw(target, task.resourceType, transferVolume) == OK) {
        creep.say('DoTask');
        creep.memory.status = 1;
        creep.memory.target = creep.memory[task.to];
        return true;
    }

    return false;
};

function commodity2Terminal(creep) {

    let storage = Game.getObjectById(creep.memory[STRUCTURE_FACTORY]);
    let terminal = Game.getObjectById(creep.memory[STRUCTURE_TERMINAL]);
    if(!terminal || !storage) return false;

    for(const com of commodities) {
        if(storage.store[com] > 0) {
            creep.say('COM2T');
            fromA2B(creep, storage, terminal, com);
            return true;
        }
    }

    return false;
}

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
    _.forEach(structList, struct => {
        creep.memory[struct.structureType] = struct.id;
    })

    creep.memory.updated = 1;
};
return module.exports;
}
/********** End of module 14: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/manager.js **********/
/********** Start module 15: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/miner.js **********/
__modules[15] = function(module, exports) {

module.exports = {
    properties: {
        role: "miner",
        stages: {
            6: {maxEnergyCapacity: 2300, bodyParts:[...new Array(10).fill(WORK), ...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)], cBodyParts: [...new Array(16).fill(WORK), ...new Array(8).fill(MOVE)]},
            7: {maxEnergyCapacity: 5600, bodyParts:[...new Array(16).fill(WORK), ...new Array(16).fill(CARRY), ...new Array(16).fill(MOVE)], cBodyParts: [...new Array(32).fill(WORK), ...new Array(16).fill(MOVE)]},
        },
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.rest) {
            creep.memory.rest -= 1;
        }

        let extractor = creep.room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_EXTRACTOR})[0];
        if(!extractor) return;
        let mine = creep.room.find(FIND_MINERALS, {filter: mine => mine.pos.isEqualTo(extractor.pos)})[0];

        let container = Game.getObjectById(creep.memory.container);
        if(container) {
            haveContainerLogic(creep, mine, container);
        }
        else {
            noContainerLogic(creep, mine);
        }
    },
    spawn: function(room) {
        
        let extractor = _.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType == STRUCTURE_EXTRACTOR);
        if(!extractor) return false;
        let mineral = room.find(FIND_MINERALS, {filter: mineral => mineral.pos.isEqualTo(extractor.pos)})[0];
        if(mineral.mineralAmount == 0) return false;

        if(room.storage && room.storage.store[mineral.mineralType] >= 80000) return false;
        
        let creepCount;
        if(global.roomCensus[room.name][this.properties.role]) creepCount = global.roomCensus[room.name][this.properties.role]
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body;
        let memory = {role: this.properties.role, status: 0, base: room.name};
        let stage = this.getStage(room);

        if(!room.memory.mineContainerId) {
            let extractor = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_EXTRACTOR})[0];
            let containers = extractor.pos.findInRange(room.find(FIND_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_CONTAINER}), 1);
            if(containers.length > 0) {
                room.memory.mineContainerId = containers[0].id;
            }
        }
        
        if(Game.getObjectById(room.memory.mineContainerId)) {
            memory.container = room.memory.mineContainerId;
            body = this.properties.stages[stage].cBodyParts;
        }
        else {
            body = this.properties.stages[stage].bodyParts;
            delete room.memory.mineContainerId;
        }


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
};

var haveContainerLogic = function(creep, mine, container) {
    if(!creep.pos.isEqualTo(container.pos)) {
        creep.moveToNoCreepInRoom(container);
    }
    else {
        creep.harvest(mine);
        creep.memory.rest = 4;
    }
};

var noContainerLogic = function(creep, mine) {
    creep.workerSetStatus();
    if(creep.memory.status) {
        let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
        if(creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage);
        }
    }
    else {
        let result = creep.harvest(mine);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(mine);
            let dropedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if(dropedResources.length) creep.pickup(dropedResources[0]);
        }
        else {
            creep.memory.rest = 4;
        }
    }
};
return module.exports;
}
/********** End of module 15: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/miner.js **********/
/********** Start module 16: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/mineralCarrier.js **********/
__modules[16] = function(module, exports) {
const { min } = __require(50,16);
const { reactionResources } = __require(49,16);

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
        if(creep.memory.restTime) {
            creep.memory.restTime -= 1;
            return;
        }
        if(creep.ticksToLive < 30) {
            if(creep.store.getUsedCapacity() > 0) creep.memory.status = 1;
            else {
                creep.suicide();
                return;
            }
        }
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) return;
        creep.workerSetStatus();

        const labTasks = creep.room.memory.tasks.labTasks;
        const labStatus = creep.room.memory.labStatus;
        
        if(this.feedBoostLabs(creep)) {
            creep.say('Boost!');
        }
        else if(labTasks && labTasks.length > 0 && labStatus !== undefined && labStatus !== 1) {
            this.labReactionWork(creep);
        }
        else if(!mineralContainerWithdraw(creep)) {
            if(creep.store.getUsedCapacity() > 0) creep.memory.status = 1;

            if(creep.memory.status === 1) {
                const storage = creep.room.storage;
                if(storage) {
                    let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                    if(creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveToNoCreepInRoom(storage);
                    }
                }
            }
            else {
                creep.toResPos(10);
            }
        }
    },
    spawn: function(room) {
        if(room.controller.level < 6) return false;
        let miner = global.roomCensus[room.name]['miner'];
        if(miner) {
        }
        else if(room.memory.labs && room.memory.labs.boostLab && Object.keys(room.memory.labs.boostLab).length > 0) {
        }
        else if(!room.memory.tasks || !room.memory.tasks.labTasks || room.memory.tasks.labTasks.length == 0) {
            return false;
        }
        else if(!room.memory.labs || !room.memory.labs.center || room.memory.labs.center.length != 2) {
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
    },

    labReactionWork: function(creep) {
        const task = creep.room.memory.tasks.labTasks[0];
        let allLabs = creep.room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LAB});
        let outterLabs =  _.filter(allLabs, lab => lab.isActive() && !creep.room.memory.labs.center.includes(lab.id) && !creep.room.memory.labs.boostLab[lab.id] && lab.cooldown === 0);
        let centerLabs = _.map(creep.room.memory.labs.center, id => Game.getObjectById(id));
        if(!creep.room.memory.labStatus) {
            for(const lab of outterLabs) {
                if(lab.mineralType && lab.store.getUsedCapacity(lab.mineralType) > 0) {
                    labWithdraw(creep, lab);
                    return;
                }
            }
            for(const lab of centerLabs) {
                if(lab.mineralType && lab.store.getUsedCapacity(lab.mineralType) > 0) {
                    labWithdraw(creep, lab);
                    return;
                }
            }
        }
        else if(creep.room.memory.labStatus == 1) {
        }
        else if(creep.room.memory.labStatus == 2) {
            for (const i in centerLabs) {
                let lab = centerLabs[i];
                if(!lab || !lab.isActive()) return;
                if(!lab.mineralType || lab.store[lab.mineralType] < 5) {
                    let resourceType = reactionResources[task.resourceType][i];
                    labTransfer(creep, lab, resourceType);
                    return;
                }
            }
        }
        else if(creep.room.memory.labStatus == 3) {
            for(const lab of outterLabs) {
                if(lab.mineralType && lab.store.getUsedCapacity(lab.mineralType) >= 2000) {
                    labWithdraw(creep, lab);
                    return;
                }
                else if(lab.mineralType && lab.mineralType !== task.resourceType) {
                    labWithdraw(creep, lab);
                    return;
                }
            }
        }
    },

    feedBoostLabs: function(creep) {
        const boostLab = creep.room.memory.labs.boostLab;
        if(!boostLab) return false;

        for(const labId in boostLab) {
            const {resourceType, amount} = boostLab[labId];
            const lab = Game.getObjectById(labId);
            if(!lab || !lab.isActive()) {
                delete boostLab[labId];
                return false;
            }

            if(!lab.mineralType || (lab.mineralType === resourceType && lab.store[resourceType] < amount)) {
                console.log(lab.store[resourceType], amount)
                if(lab.store.getFreeCapacity(resourceType) === 0) continue;
                labTransfer(creep, lab, resourceType);
                return true;
            }
            else if(lab.mineralType !== resourceType){
                labWithdraw(creep, lab);
                return true;
            }
            else {
                continue;
            }
        }

        return false;
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
        let target;
        if(creep.room.terminal && creep.room.terminal.store[resourceType] > 0) target = creep.room.terminal;
        else if(creep.room.storage && creep.room.storage.store[resourceType] > 0) target = creep.room.storage;
        else {
            creep.room.memory.tasks.labTasks[0].amount = 0;
            console.log(creep.room, "mineral " + resourceType + " not enough");
            return;
        }

        let result = creep.withdraw(target, resourceType);
        if(result == ERR_NOT_IN_RANGE) creep.moveToNoCreepInRoom(target);
        else if(result == OK) creep.memory.status = 1;
        
    }
};

var mineralContainerWithdraw = function(creep) {
    let storage = creep.room.storage;
    let extractor = creep.room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_EXTRACTOR})[0];
    if(!extractor || !storage) return false;
    if(creep.memory.status) {
        let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
        let result = creep.transfer(storage, resourceType);
        if(result === ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(storage);
        }
    }
    else {
        let dropedMineral = _.find(creep.room.find(FIND_DROPPED_RESOURCES), resource => resource.resourceType != RESOURCE_ENERGY && resource.amount >= 500);
        if (dropedMineral) {
            let result = creep.pickup(dropedMineral);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveToNoCreepInRoom(dropedMineral);
            }
            else if(result == OK) {
                creep.memory.status = 1;
            }
            return true;
        }
        let target = Game.getObjectById(creep.memory.minerContainerId);
        if(!target) {
            let containers = creep.room.find(FIND_STRUCTURES, {
                filter: struct => 
                (struct.structureType === STRUCTURE_CONTAINER && 
                struct.pos.inRangeTo(extractor.pos, 1))
            });
            if(containers.length === 0) return false;

            target = containers[0];
            creep.memory.minerContainerId = target.id;
        }

        if(target.store.getUsedCapacity() < creep.store.getFreeCapacity()) {
            return false;
        }
        
        let resourceType = _.find(Object.keys(target.store), resource => target.store[resource] > 0);
        let result = creep.withdraw(target, resourceType);
        if(result === ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(target);
        }
        else if(result === OK) {
            if(target.store.getUsedCapacity() === 0) creep.memory.status = 1;
        }
    }

    return true;
}
return module.exports;
}
/********** End of module 16: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/mineralCarrier.js **********/
/********** Start module 17: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/claimer.js **********/
__modules[17] = function(module, exports) {
module.exports = {
    properties: {
        role: "claimer",
        stages: {
            1: {maxEnergyCapacity: 300, bodyParts:[], number: 0},
            3: {maxEnergyCapacity: 800, bodyParts:[CLAIM, MOVE], number: 2},
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
            else {
                creep.signController(controller, "Keep Growing!!!");
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

        if(Memory.outSourceRooms[roomName] && Memory.outSourceRooms[roomName].neutral === true) {
            return false;
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
/********** End of module 17: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/claimer.js **********/
/********** Start module 18: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/outSourcer.js **********/
__modules[18] = function(module, exports) {
const { roomInfo } = __require(47,18);

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
/********** End of module 18: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/outSourcer.js **********/
/********** Start module 19: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/remoteHarvester.js **********/
__modules[19] = function(module, exports) {
module.exports = {
    properties: {
        role: "remoteHarvester",
        stages: {
            1: { maxEnergyCapacity: 300, bodyParts: [WORK, WORK, MOVE, MOVE], number: 2 },
            2: { maxEnergyCapacity: 550, bodyParts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 1 },
            3: { maxEnergyCapacity: 800, bodyParts: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], number: 1 },
            4: { maxEnergyCapacity: 1300, bodyParts: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], number: 1 },
            7: { maxEnergyCapacity: 5600, bodyParts: [...new Array(12).fill(WORK), CARRY, CARRY, ...new Array(6).fill(MOVE)], number: 1 },
        },
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            return;
        }
        if (Memory.outSourceRooms[creep.memory.targetRoom] && Memory.outSourceRooms[creep.memory.targetRoom].sourceKeeper === true) {
            if(creep.memory.target !== undefined) {
                let source = creep.room.find(FIND_SOURCES)[creep.memory.target];
                if(!creep.memory.keeperLairId) {
                    creep.memory.keeperLairId = source.pos.findInRange(FIND_STRUCTURES, 5, {filter: struct => struct.structureType === STRUCTURE_KEEPER_LAIR})[0].id;
                }
                let keeperLair = Game.getObjectById(creep.memory.keeperLairId);
                if(keeperLair.ticksToSpawn <= 12) {
                    creep.memory.rest = 0;
                    if(creep.store[RESOURCE_ENERGY] > 0) creep.drop(RESOURCE_ENERGY);
                    if(creep.pos.getRangeTo(keeperLair) <= 5) creep.moveToRoomAdv(creep.memory.base);
                    return;
                }
            }

            let hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (hostileCreep) {
                let distance = creep.pos.getRangeTo(hostileCreep);

                if (distance <= 4) {
                    creep.moveToRoomAdv(creep.memory.base);
                    return;
                }
                else if (distance <= 5) {
                    return;
                }
            }
        }
        
        if (creep.memory.rest) {
            creep.memory.rest -= 1;
            return;
        }
        let result = creep.harvestEnergy();
        if (creep.memory.target != undefined && result == ERR_NOT_ENOUGH_RESOURCES) {
            let source = creep.room.find(FIND_SOURCES)[creep.memory.target];
            creep.say('no e')
            if (!creep.memory.containerId) {
                let containerList = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: struct => struct.structureType == STRUCTURE_CONTAINER });
                if (containerList.length) creep.memory.containerId = containerList[0].id;
            }

            let container = Game.getObjectById(creep.memory.containerId);
            if (container && container.hits < container.hitsMax && container.store[RESOURCE_ENERGY] > 0) {
                if (creep.store[RESOURCE_ENERGY] == 0) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {reusePath: 20, maxRooms: 1});
                    }
                }
                creep.repair(container);
            }
            else {
                let constSites = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 3, {filter: site => site.structureType === STRUCTURE_CONTAINER});
                if(constSites.length) {
                    if(creep.store[RESOURCE_ENERGY] === 0) {
                        let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: droped => droped.resourceType === RESOURCE_ENERGY});
                        creep.pickup(drops[0]);
                    }
                    creep.build(constSites[0]);
                }
                else if(source.energy === 0) {
                    creep.memory.rest = source.ticksToRegeneration;
                    return;
                }
            }
        }


    },
    spawn: function (room, roomName) {
        const stage = this.getStage(room);
        let creepCount;
        if (global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        let sourceNum = 1;
        if (!Memory.outSourceRooms[roomName]) Memory.outSourceRooms[roomName] = {};
        if (Memory.outSourceRooms[roomName].sourceNum != undefined) {
            sourceNum = Memory.outSourceRooms[roomName].sourceNum;
        }
        else if (Game.rooms[roomName]) {
            Memory.outSourceRooms[roomName].sourceNum = Game.rooms[roomName].find(FIND_SOURCES).length;
        }

        let totalNeeds = 0;
        const rInfo = Memory.rooms[roomName] && Memory.rooms[roomName].roomInfo;
        if(rInfo) {
            for(const sourceObj of rInfo.sourceInfo) {
                totalNeeds += Math.min(this.properties.stages[stage].number, sourceObj.space);
            }
        }
        else {
            totalNeeds = sourceNum * this.properties.stages[stage].number
        }

        if (creepCount < totalNeeds) {
            return true;
        }
    },
    spawnData: function (room, outSourceRoomName) {
        const stage = this.getStage(room);
        const rInfo = room.memory.roomInfo;

        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts;

        const existingThisTypeCreeps = _.filter(Game.creeps, creep => (
            creep.memory.role == this.properties.role && 
            creep.memory.targetRoom == outSourceRoomName &&
            !(creep.ticksToLive < creep.body.length * 3)
        ));
        
        let targetCount = {}
        existingThisTypeCreeps.forEach((creep) => {
            let targetId = creep.memory.target;
            if(targetCount[targetId]) targetCount[targetId] += 1;
            else targetCount[targetId] = 1;
        });

        let sourceCount = 1;
        if (Memory.outSourceRooms[outSourceRoomName]) {
            sourceCount = Memory.outSourceRooms[outSourceRoomName].sourceNum;
        }

        console.log("remoteHarvester", outSourceRoomName, JSON.stringify(targetCount));

        let sourceTarget = 0;
        if(rInfo) {
            for(const index in rInfo.sourceInfo) {
                let creepNeed = Math.min(this.properties.stages[stage].number, rInfo.sourceInfo[index].space);
                if (targetCount[index] >= creepNeed) continue;
                sourceTarget = index;
                break;
            }
        }
        else {
            for (var i = 0; i < sourceCount; i++) {
                let creepNeed = this.properties.stages[stage].number;
                if (targetCount[index] >= creepNeed) continue;
                sourceTarget = index;
                break;
            }
        }

        let memory = { role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName, target: sourceTarget };

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
    }
};
return module.exports;
}
/********** End of module 19: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/remoteHarvester.js **********/
/********** Start module 20: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/remoteHauler.js **********/
__modules[20] = function(module, exports) {
const { roomInfo } = __require(47,20);

/*
    NOT FINISHED
    todo:
    1. calculate bodypart(WORK MOVE CARRY) / number needed for each room
    2. go directly to target if have vison of the room
*/
module.exports = {
    properties: {

    },
    properties: {
        role: 'remoteHauler',
        stages: {
            1: { maxEnergyCapacity: 300, bodyParts: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 4 },
            2: { maxEnergyCapacity: 550, bodyParts: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], number: 2 },
            3: { maxEnergyCapacity: 800, bodyParts: [...new Array(7).fill(CARRY), ...new Array(7).fill(MOVE)], number: 3 },
            4: { maxEnergyCapacity: 1300, bodyParts: [WORK, ...new Array(13).fill(CARRY), ...new Array(7).fill(MOVE)], number: 2 },
            6: { maxEnergyCapacity: 2300, bodyParts: [WORK, ...new Array(27).fill(CARRY), ...new Array(14).fill(MOVE)], number: 1 }, // 100 + 1350 + 700 = 2150
            7: { maxEnergyCapacity: 5600, bodyParts: [WORK, WORK, ...new Array(31).fill(CARRY), ...new Array(17).fill(MOVE)], number: 1 }, // 200 + 1650 + 850 = 2700
        },
    },

    /** @param {Creep} creep **/
    run: function (creep) {
        creep.workerSetStatus();
        if (creep.memory.status == 0) {
            if (creep.memory.rest) {
                creep.memory.rest -= 1;
                return;
            }

            if (takeNearResources(creep)) return;
            let tRoom = Game.rooms[creep.memory.targetRoom];
            if (tRoom && creep.room.name != creep.memory.targetRoom) {
                let closestSource = tRoom.find(FIND_SOURCES)[0];
                creep.moveToNoCreep(closestSource);
                return;
            }
            else if (creep.moveToRoomAdv(creep.memory.targetRoom)) return;
            if (Memory.outSourceRooms[creep.memory.targetRoom] && Memory.outSourceRooms[creep.memory.targetRoom].sourceKeeper === true) {
                if (aviodHostiles(creep)) return;
            }
            if (creep.memory.targetSource != null) withdrawBySouce(creep);
            else if (creep.memory.targetId != null) withdrawByTarget(creep);
            else {
                let targetId = findTarget(creep);
                if (targetId == null) {
                    if (creep.memory.targetSourc == null) creep.memory.targetSource = findTargetSourceIndex(creep);
                    withdrawBySouce(creep);
                    return;
                }
                else {
                    creep.memory.targetId = targetId;
                    withdrawByTarget(creep);
                }
            }
        }
        else {
            if (creep.memory.targetSource != null) creep.memory.targetSource = null;
            if (creep.memory.targetId != null) creep.memory.targetId = null;
            const myConstuct = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
            if (myConstuct.length > 0 && creep.room.name !== creep.memory.base) {
                if (creep.build(myConstuct[0]) == OK) return;
            }
            const needRepair = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: struct => (
                    (struct.structureType == STRUCTURE_ROAD || struct.structureType == STRUCTURE_CONTAINER) &&
                    struct.hits < struct.hitsMax
                )
            });
            if (needRepair.length > 0) {
                creep.repair(needRepair[0]);
            }
            const needTransfer = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
                filter: struct => (
                    (struct.structureType === STRUCTURE_SPAWN || struct.structureType === STRUCTURE_EXTENSION || struct.structureType === STRUCTURE_TOWER) &&
                    struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            });
            if (needTransfer.length > 0) {
                creep.say("tran");
                creep.transfer(needTransfer[0], RESOURCE_ENERGY);
            }
            let baseRoom = Game.rooms[creep.memory.base]
            if (baseRoom) {
                let target = baseRoom.getStorage(creep.store.getUsedCapacity());
                if (!target || target.store.getFreeCapacity() < creep.store.getUsedCapacity()) {
                    if (creep.pos.inRangeTo(baseRoom.controller.pos, 4)) {
                        let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                        creep.drop(resourceType);
                    }
                    else creep.moveToNoCreep(baseRoom.controller);
                }
                else {
                    let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
                    if (creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveToNoCreep(target);
                    }
                }
            }
            else {
                if (creep.memory.base && creep.memory.base != creep.room.name) {
                    creep.moveToRoom(creep.memory.base);
                    return;
                }
            }

        }
    },
    spawn: function (room, roomName) {
        let creepCount;
        if (global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;
        let sourceNum = 1;
        if (!Memory.outSourceRooms[roomName]) Memory.outSourceRooms[roomName] = {};
        if (Memory.outSourceRooms[roomName].sourceNum != undefined) {
            sourceNum = Memory.outSourceRooms[roomName].sourceNum;
        }
        else if (Game.rooms[roomName]) {
            Memory.outSourceRooms[roomName].sourceNum = Game.rooms[roomName].find(FIND_SOURCES).length;
        }
        let addednum = 0;
        if ((global.roomCensus[roomName] && global.roomCensus[roomName]['remoteMiner'])) {
            addednum += 1;
        }
        if (Memory.outSourceRooms[roomName] && Memory.outSourceRooms[roomName].addHauler) {
            addednum += Memory.outSourceRooms[roomName].addHauler;
        }
        if (creepCount < sourceNum * this.properties.stages[this.getStage(room)].number + addednum) {
            return true;
        }
    },
    spawnData: function (room, outSourceRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.stages[this.getStage(room)].bodyParts;
        let memory = { role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName };

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
    }
};

function findTarget(creep) {
    let targetQ = Memory.outSourceRooms[creep.room.name].haulerTargets;
    if (!targetQ || targetQ.length === 0) {
        let takenIds = _.map(creep.room.find(FIND_MY_CREEPS, { filter: creep => creep.role === 'remoteHauler' }), creep => creep.memory.targetId);
        let containers = creep.room.find(FIND_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_CONTAINER && !takenIds.includes(struct.id) && struct.store.getUsedCapacity() > creep.store.getCapacity() });
        let dropedResources = creep.room.find(FIND_DROPPED_RESOURCES, { filter: resource => !takenIds.includes(resource.id) && resource.amount > creep.store.getCapacity() });

        let targets = [...containers, ...dropedResources]
        Memory.outSourceRooms[creep.room.name].haulerTargets = _.map(targets, target => { return { id: target.id, amount: (target.store ? target.store.getUsedCapacity() : target.amount) } });
    }
    targetQ = Memory.outSourceRooms[creep.room.name].haulerTargets;

    while (targetQ.length > 0) {
        let { id, amount } = targetQ[targetQ.length - 1];
        if (Game.getObjectById(id) && amount > creep.store.getFreeCapacity()) {
            targetQ[targetQ.length - 1].amount -= creep.store.getFreeCapacity();
            return id;
        }
        else targetQ.pop();
    }

    return null;
}

function findTargetSourceIndex(creep) {
    let res = Memory.outSourceRooms[creep.room.name].targetSource;
    if (res == null) {
        Memory.outSourceRooms[creep.room.name].targetSource = 1;
        return 0;
    }
    else {
        let sourceNum = Memory.outSourceRooms[creep.room.name].sourceNum;
        for (var i = 0; i < sourceNum; i++) {
            let curIndex = (res + i) % sourceNum;
            if (creep.room.find(FIND_MY_CREEPS, { filter: c => c.memory.targetSource === curIndex }).length === 0) {
                Memory.outSourceRooms[creep.room.name].targetSource = (curIndex + 1) % sourceNum;
                return curIndex;
            }
        }

        Memory.outSourceRooms[creep.room.name].targetSource = (res + 1) % sourceNum;
        return res;
    }
}

function withdrawBySouce(creep) {
    let source = creep.room.find(FIND_SOURCES)[creep.memory.targetSource];
    let dropedResources = source.pos.findInRange(FIND_DROPPED_RESOURCES, 3, {
        filter: resource => (resource.amount > creep.store.getCapacity() / 2)
    });
    if (dropedResources.length) {
        if (creep.pickup(dropedResources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(dropedResources[0]);
        }
        return;
    }
    let containers = source.pos.findInRange(FIND_STRUCTURES, 2, {
        filter: structure => (
            structure.structureType === STRUCTURE_CONTAINER &&
            structure.store.getUsedCapacity() >= creep.store.getFreeCapacity()
        )
    });
    if (containers.length) {
        let container = containers[0];
        let resourceType = _.find(Object.keys(container.store), resource => container.store[resource] > 0);
        if (creep.withdraw(container, resourceType) === ERR_NOT_IN_RANGE) {
            creep.moveToNoCreepInRoom(container);
        }
        return;
    }

    if (!creep.pos.inRangeTo(source.pos, 4)) {
        creep.moveToNoCreepInRoom(source);
    }
    else {
        if (!Memory.outSourceRooms[creep.memory.targetRoom].sourceKeeper) creep.memory.rest = 3;
    }
}

function withdrawByTarget(creep) {
    let target = Game.getObjectById(creep.memory.targetId);
    if (!target) {
        creep.memory.targetId = null;
        return
    }
    else if (target.store && target.store.getUsedCapacity() <= creep.store.getFreeCapacity()) {
        creep.memory.targetId = null;
    }

    if (!creep.pos.inRangeTo(target.pos, 1)) {
        creep.moveToNoCreepInRoom(target);
        return;
    }

    if (target.amount) {
        creep.pickup(target);
    }
    else {
        let resourceType = _.find(Object.keys(target.store), resource => target.store[resource] > 0);
        creep.withdraw(target, resourceType);
    }
}


function takeNearResources(creep) {
    const nearResouce = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: droped => creep.room.name != creep.memory.base || !droped.pos.findInRange(creep.room.controller, 4) });
    if (nearResouce.length > 0) creep.pickup(nearResouce[0]);
    const nearRain = creep.pos.findInRange(FIND_RUINS, 1, { filter: ruin => ruin.store.getUsedCapacity() > 0 });
    if (nearRain.length > 0) {
        let resourceType = _.find(Object.keys(nearRain[0].store), resourceType => nearRain[0].store[resourceType] > 0);
        creep.withdraw(nearRain[0], resourceType);
        return true;
    }
    const nearTomstone = creep.pos.findInRange(FIND_TOMBSTONES, 1, { filter: ts => ts.store.getUsedCapacity() > 0 });
    if (nearTomstone.length > 0) {
        let resourceType = _.find(Object.keys(nearTomstone[0].store), resourceType => nearTomstone[0].store[resourceType] > 0);
        let result = creep.withdraw(nearTomstone[0], resourceType);
        if (result === OK && nearTomstone[0].store[RESOURCE_ENERGY] > creep.store.getCapacity() * 0.9) creep.memory.status = 1;
        return true;
    }

    return false;
}

function aviodHostiles(creep) {
    let hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostileCreep) {
        let distance = creep.pos.getRangeTo(hostileCreep);

        if (distance <= 5) {
            creep.moveToRoomAdv(creep.memory.base);
            return true;
        }
        else if (distance <= 6) {
            return true;
        }
    }

    return false;
}
return module.exports;
}
/********** End of module 20: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/remoteHauler.js **********/
/********** Start module 21: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/keeperAttacker.js **********/
__modules[21] = function(module, exports) {
// todo

module.exports = {
    properties: {
        role: 'keeperAttacker'
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        
        let targetKeeper = Game.getObjectById(creep.memory.enemyId);
        if(!targetKeeper) {
            targetKeeper = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: creep => creep.owner.username === 'Source Keeper'});
            if(targetKeeper) creep.memory.enemyId = targetKeeper.id;
        }
        if(targetKeeper) {
            if(targetKeeper.owner.username === 'Source Keeper' || creep.pos.getRangeTo(targetKeeper) > 1) {
                if(creep.hits < creep.hitsMax) creep.heal(creep);
            }
            creep.moveTo(targetKeeper);
            creep.say(creep.attack(targetKeeper));
            creep.rangedAttack(targetKeeper);
        }
        else {
            if(creep.hits < creep.hitsMax) creep.heal(creep);

            let targetLairs = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_KEEPER_LAIR});
            if(targetLairs.length === 0) {
                console.log(creep.room, 'NO KEEPER LAIR!');
                return;
            };

            targetLairs.sort((a,b) => a.ticksToSpawn - b.ticksToSpawn);

            if(!creep.pos.inRangeTo(targetLairs[0].pos, 1)) {
                creep.moveToNoCreepInRoom(targetLairs[0]);
            }
        }

    },
    spawn: function(room, targetRoomName) {
        if(!Memory.outSourceRooms[targetRoomName]) return false;
        if(Memory.outSourceRooms[targetRoomName].sourceKeeper !== true || Memory.outSourceRooms[targetRoomName].neutral !== true) return false;
        if(room.energyCapacityAvailable < 5600) return false;

        let creepCount;
        if(global.roomCensus[targetRoomName] && global.roomCensus[targetRoomName][this.properties.role]) {
            creepCount = global.roomCensus[targetRoomName][this.properties.role];
            if(global.roomCensus[targetRoomName]['invaderAttacker']) {
                creepCount += global.roomCensus[targetRoomName]['invaderAttacker'];
            }
        }
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },
    spawnData: function(room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = [...new Array(25).fill(MOVE), ...new Array(19).fill(ATTACK), ...new Array(6).fill(HEAL)]; // $4270
        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: targetRoomName};

        return {name, body, memory};
    },
};
return module.exports;
}
/********** End of module 21: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/keeperAttacker.js **********/
/********** Start module 22: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/invaderAttacker.js **********/
__modules[22] = function(module, exports) {
const { G } = __require(51,22);
const { T3_HEAL, T3_TOUGH, T3_RANGE_ATTACK } = __require(52,22);

module.exports = {
    properties: {
        role: 'invaderAttacker',
        option: {
            boost: {body: [...new Array(2).fill(TOUGH), ...new Array(16).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(4).fill(HEAL)], number: 1},
            nonBoost: {body: [...new Array(20).fill(MOVE), ...new Array(20).fill(RANGED_ATTACK), ...new Array(5).fill(MOVE), ...new Array(5).fill(HEAL)], number: 2},
        },
        boostInfo: {[T3_HEAL]: 4, [T3_TOUGH]: 2, [T3_RANGE_ATTACK]: 10},
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.getBoosts();
            return;
        }
        if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
            creep.moveToRoom(creep.memory.targetRoom);
            return;
        }
        
        let invaders = creep.room.find(FIND_HOSTILE_CREEPS, {filter: c => c.owner.username === 'Invader'});
        if(invaders.length) {
            let medic = _.find(invaders, invader => {
                for(const bodyPart of invader.body) {
                    if(bodyPart.type === HEAL) return true;
                }
                return false;
            })

            let invader;
            if(medic) invader = medic;
            else invader = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: c => c.owner.username === 'Invader'});

            
            if(creep.pos.getRangeTo(invader) > 2) {
                creep.rangedAttack(invader);
                creep.moveTo(invader);
            }
            else if(creep.pos.getRangeTo(invader) < 2) {
                creep.rangedMassAttack();
            }
            else {
                creep.rangedAttack(invader);
            }
            creep.heal(creep);
        }
        else {
            let damaged = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
            if(damaged) {
                if(creep.heal(damaged) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(damaged, {reusePath: 20});
                    creep.rangedHeal(damaged);
                }
                
            }
            else {
                creep.memory.role = 'keeperAttacker';
            }
        }
    },
    spawn: function(room, targetRoomName) {
        if(!Memory.outSourceRooms[targetRoomName]) return false;
        if(Memory.outSourceRooms[targetRoomName].neutral !== true) return false;
        if(room.energyCapacityAvailable < 5600) return false;
        if(!Game.rooms[targetRoomName]) return false;
        if(Game.rooms[targetRoomName].find(FIND_HOSTILE_CREEPS, {filter: c => c.owner.username === 'Invader'}).length === 0) return false;
        let targetRoom = Game.rooms[targetRoomName];
        if(targetRoom.find(FIND_HOSTILE_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_INVADER_CORE}).length > 0) return false;

        let creepCount;
        if(global.roomCensus[targetRoomName] && global.roomCensus[targetRoomName][this.properties.role]) {
            creepCount = global.roomCensus[targetRoomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < this.properties.option.boost.number) {
            return true;
        }
    },
    spawnData: function(room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.option.boost.body;
        let memory = {
            role: this.properties.role, 
            base: room.name, 
            targetRoom: targetRoomName,
            boost: true,
            boosted: false,
            boostInfo: this.properties.boostInfo
        };

        return {name, body, memory};
    },
};
return module.exports;
}
/********** End of module 22: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/invaderAttacker.js **********/
/********** Start module 23: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/transporter.js **********/
__modules[23] = function(module, exports) {
module.exports = {
    properties: {
        type: 'transporter',
        stages: {
            1: { maxEnergyCapacity: 300, bodyParts: [...new Array(3).fill(CARRY), ...new Array(3).fill(MOVE)] },
            2: { maxEnergyCapacity: 550, bodyParts: [...new Array(5).fill(CARRY), ...new Array(5).fill(MOVE)] },
            3: { maxEnergyCapacity: 800, bodyParts: [...new Array(7).fill(CARRY), ...new Array(7).fill(MOVE)] },
            4: { maxEnergyCapacity: 1300, bodyParts: [...new Array(10).fill(CARRY), ...new Array(10).fill(MOVE)] },
            5: { maxEnergyCapacity: 1800, bodyParts: [...new Array(15).fill(CARRY), ...new Array(15).fill(MOVE)] },
            6: { maxEnergyCapacity: 2300, bodyParts: [...new Array(20).fill(CARRY), ...new Array(20).fill(MOVE)] },
            7: { maxEnergyCapacity: 5600, bodyParts: [...new Array(25).fill(CARRY), ...new Array(25).fill(MOVE)] },
        },
    },

    /** @param {Creep} creep **/
    run: function (creep) {
        creep.workerSetStatus();

        switch (creep.memory.workType) {
            case 1:
                this.collectDropedResources(creep);
                break;
            case 2:
                this.collectInvaderCore(creep);
                break;
            default:
                this.tranEnergyBetweenMyRooms(creep);
        }
    },
    collectDropedResources: function (creep) {
        creep.say('cdr');
        if (!creep.memory.status) {
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.moveToRoomAdv(creep.memory.targetRoom);
                return;
            }
            let dropedRecource;
            if (creep.memory.targetResourceType) {
                dropedRecource = _.find(creep.room.find(FIND_DROPPED_RESOURCES), resource => resource.resourceType == creep.memory.targetResourceType);
            }
            else dropedRecource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

            if (dropedRecource) {
                if (creep.pickup(dropedRecource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropedRecource, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return;
            }
            let tomstone = _.find(creep.room.find(FIND_TOMBSTONES), ts => ts.store.getUsedCapacity() >= creep.store.getCapacity());
            if (tomstone) {
                resourceType = _.find(Object.keys(tomstone.store), resource => tomstone.store[resource] > 0);
                let result = creep.withdraw(tomstone, resourceType);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tomstone);
                }
                return;
            }

            if (creep.store.getUsedCapacity() > 0) creep.memory.status = 1;
        }
        else {
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }
            var storage = creep.room.storage;

            if (!storage || storage.store.getFreeCapacity() == 0) {
                creep.suicide();
                return;
            }

            var resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
    },
    tranEnergyBetweenMyRooms: function (creep) {
        if (!creep.memory.status) {
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
            if (!storage) {
                let containers = creep.room.find(FIND_STRUCTURES, {
                    filter: struct => (
                        struct.structureType == STRUCTURE_CONTAINER &&
                        struct.pos.inRangeTo(creep.room.controller.pos, 3) &&
                        struct.store.getFreeCapacity() > 0
                    )
                });
                if (containers.length) {
                    storage = containers[0];
                }
            }

            if (!storage) {
                if (creep.pos.inRangeTo(creep.room.controller.pos, 3)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveToNoCreepInRoom(creep.room.controller);
            }
            else if (storage.store.getFreeCapacity() == 0) {
                if (creep.pos.inRangeTo(storage.pos, 2)) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else creep.moveTo(storage);
            }
            else {
                if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        }
    },

    collectInvaderCore: function (creep) {
        if (!creep.memory.status) {
            let invaderPos = creep.memory.invaderPos;
            if (invaderPos) {
                let pos = new RoomPosition(invaderPos.x, invaderPos.y, invaderPos.roomName);
                if(!creep.pos.inRangeTo(pos, 5)) {
                    creep.say('approach')
                    creep.moveToNoCreep(pos);
                }
                else {

                    let ruins = pos.findInRange(FIND_RUINS, 4, {filter: ruin => ruin.store.getUsedCapacity() > 0});
                    let containers = pos.findInRange(FIND_STRUCTURES, 4, {filter: struct => struct.structureType === STRUCTURE_CONTAINER && struct.store.getUsedCapacity() > 0});
                    if (ruins.length) {
                        let target = ruins[0];
                        resourceType = _.find(Object.keys(target.store), resource => target.store[resource] > 0);
                        if (creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                    else if(containers.length) {
                        let target = containers[0];
                        resourceType = _.find(Object.keys(target.store), resource => target.store[resource] > 0);
                        if (creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                    else {
                        creep.memory.status = 1;
                    }
                }
            }
            else {
                if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                    creep.moveToRoomAdv(creep.memory.targetRoom);
                    return;
                }

                let invaderRain = _.find(creep.room.find(FIND_RUINS), ruin => ruin.structure.structureType === STRUCTURE_INVADER_CORE);
                if (invaderRain) {
                    creep.memory.invaderPos = { x: invaderRain.pos.x, y: invaderRain.pos.y, roomName: invaderRain.pos.roomName };
                }
                else {
                    creep.suicide();
                }
            }

        }
        else {
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.moveToRoom(creep.memory.base);
                return;
            }
            let storage = creep.room.storage;

            if (!storage || storage.store.getFreeCapacity() == 0) {
                creep.suicide();
                return;
            }

            let resourceType = _.find(Object.keys(creep.store), resource => creep.store[resource] > 0);
            if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
    },
    spawn: function (room) {
        return false;
    },
    spawnData: function (room) {
        var stage = this.getStage(room);
        let name = this.properties.type + Game.time;
        let body = this.properties.stages[stage].bodyParts;
        let memory = { role: this.properties.type, status: 1, base: room.name };

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
    }
};
return module.exports;
}
/********** End of module 23: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/transporter.js **********/
/********** Start module 24: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/defender.js **********/
__modules[24] = function(module, exports) {
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
            hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        } 
        if(!hostile) {
            hostile = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: struct => (struct.structureType != STRUCTURE_KEEPER_LAIR &&struct.structureType != STRUCTURE_CONTROLLER)});
        }

        if (hostile) {
            creep.rangedAttack(hostile);
            creep.attack(hostile);
            creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ff0000'}, maxRooms: 1});
            return;
        }
    },
    spawn: function(room, roomName) {
        if(Memory.outSourceRooms[roomName] && Memory.outSourceRooms[roomName].neutral === true) {
            return false;
        }
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
/********** End of module 24: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/defender.js **********/
/********** Start module 25: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/remoteMiner.js **********/
__modules[25] = function(module, exports) {
const { drop } = __require(50,25);
module.exports = {
    properties: {
        role: 'remoteMiner',
        body: [...new Array(32).fill(WORK), CARRY, CARRY, ...new Array(16).fill(MOVE)],
        boostInfo: {UHO2: 32},
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.getBoosts();
            return;
        }
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            return;
        }

        if(!creep.memory.targetId) creep.memory.targetId = creep.room.find(FIND_MINERALS)[0].id;
        let mineral = Game.getObjectById(creep.memory.targetId);

        if(keeperLairLogic(creep, mineral)) return;

        if(creep.memory.rest) {
            creep.memory.rest -= 1;
            return;
        }

        let container = Game.getObjectById(creep.memory.containerId);
        if(container) {
            haveContainerMineLogic(creep, mineral, container);
        }
        else {
            container = mineral.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => struct.structureType == STRUCTURE_CONTAINER})[0];
            if(container) {
                creep.memory.containerId = container.id;
                haveContainerMineLogic(creep, mineral, container);
            }
            else noContainerMineLogic(creep, mineral);
        }

        if(mineral.ticksToRegeneration > 0) {
            Memory.outSourceRooms[creep.room.name].mineralRegenTime = Game.time + mineral.ticksToRegeneration;
        }
    },
    spawn: function(room, roomName) {
        if(room.energyCapacityAvailable < 5600) return false;
        if(!Memory.outSourceRooms[roomName] || Memory.outSourceRooms[roomName].neutral !== true) return false;
        
        if(!Game.rooms[roomName]) return false;
        mine = Game.rooms[roomName].find(FIND_MINERALS)[0];
        if(mine.mineralAmount === 0) return false;
        if(room.storage && room.storage.store[mine.resourceType] > 80000) return false;
        let creepCount;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;
        
        if (creepCount < 1) {
            return true;
        }
    },
    spawnData: function(room, outSourceRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.body;
        let memory = {
            role: this.properties.role,
            base: room.name, 
            targetRoom: outSourceRoomName,
            boost: true,
            boostInfo: this.properties.boostInfo
        };

        return {name, body, memory};
    },
};

var haveContainerMineLogic = function(creep, mine, container) {
    if(!creep.pos.isEqualTo(container.pos)) {
        creep.moveToNoCreepInRoom(container);
        return;
    }

    let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: droped => droped.resourceType === RESOURCE_ENERGY});
    let tombs = creep.pos.findInRange(FIND_TOMBSTONES, 1, {filter: tomeb => tomeb.store[RESOURCE_ENERGY] > 0});
    if(container.hits < container.hitsMax && (drops.length > 0 || tombs.length > 0)) {
        creep.say("repair")
        let nonEnergy = _.find(Object.keys(creep.store), resourceType => creep.store[resourceType] > 0 && resourceType !== RESOURCE_ENERGY);
        if(nonEnergy) {
            creep.drop(nonEnergy);
            return;
        }

        if(creep.store[RESOURCE_ENERGY] === 0) {
            if(drops.length) creep.pickup(drops[0]);
            else if(tombs.length) creep.withdraw(tombs[0], RESOURCE_ENERGY);
            else if(container.store[RESOURCE_ENERGY] > 0) creep.withdraw(container, RESOURCE_ENERGY);
        }
        creep.repair(container);
    }
    else {
        creep.say('har')
        creep.harvest(mine);
        creep.memory.rest = 5;
    }
};

var noContainerMineLogic = function(creep, mine) {
    if(creep.pos.getRangeTo(mine) > 1) {
        creep.moveToNoCreepInRoom(mine);
    }

    let constSites = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 3, {filter: site => site.structureType === STRUCTURE_CONTAINER});
    if(constSites.length) {
        let nonEnergy = _.find(Object.keys(creep.store), resourceType => creep.store[resourceType] > 0 && resourceType !== RESOURCE_ENERGY);
        if(nonEnergy) {
            creep.drop(nonEnergy);
            return;
        }

        if(creep.store[RESOURCE_ENERGY] === 0) {
            let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {filter: droped => droped.resourceType === RESOURCE_ENERGY});
            let tombs = creep.pos.findInRange(FIND_TOMBSTONES, 1, {filter: tomeb => tomeb.store[RESOURCE_ENERGY] > 0});
            if(drops.length) creep.pickup(drops[0]);
            if(tombs.length) creep.withdraw(tombs[0], RESOURCE_ENERGY);
        }
        creep.build(constSites[0]);
    }
    else {
        let result = creep.harvest(mine);
        if(result === OK) {
            creep.memory.rest = 4;
        }
    }
};

function keeperLairLogic(creep, mineral) {
    if (Memory.outSourceRooms[creep.memory.targetRoom] && Memory.outSourceRooms[creep.memory.targetRoom].sourceKeeper === true) {
        if(!creep.memory.keeperLairId) {
            creep.memory.keeperLairId = mineral.pos.findInRange(FIND_STRUCTURES, 5, {filter: struct => struct.structureType === STRUCTURE_KEEPER_LAIR})[0].id;
        }
        let keeperLair = Game.getObjectById(creep.memory.keeperLairId);
        if(keeperLair.ticksToSpawn <= 12) {
            creep.memory.rest = 0;
            if(creep.store.getUsedCapacity() > 0) {
                let resourceType = _.find(Object.keys(creep.store), rt => creep.store[rt] > 0);
                creep.drop(resourceType);
            }
            if(creep.pos.getRangeTo(keeperLair) <= 4) creep.moveToRoomAdv(creep.memory.base);
            return true;
        }

        let hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostileCreep) {
            let distance = creep.pos.getRangeTo(hostileCreep);

            if (distance < 3) {
                creep.moveToRoomAdv(creep.memory.base);
                return true;
            }
            else if (distance <= 6) {
                return true;
            }
        }
    }

    return false;
}
return module.exports;
}
/********** End of module 25: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/remoteMiner.js **********/
/********** Start module 26: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/wrecker.js **********/
__modules[26] = function(module, exports) {
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
            hostileStruct = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
        }

        if(!hostileStruct && creep.memory.wall) {
            hostileStruct = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_WALL});
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
/********** End of module 26: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/wrecker.js **********/
/********** Start module 27: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/medic.js **********/
__modules[27] = function(module, exports) {
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
/********** End of module 27: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/medic.js **********/
/********** Start module 28: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/scout.js **********/
__modules[28] = function(module, exports) {
module.exports = {
    properties: {
        role: "scout"
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.targetPos) {
            let targetPos = creep.memory.targetPos;
            creep.moveTo(new RoomPosition(targetPos.x, targetPos.y, targetPos.roomName), { reusePath: 50 });
            return;
        }
        if (creep.memory.explorer) {
            this.explorerLogic(creep);
            return;
        }
        let targetRoomName = creep.memory.targetRoom
        if (creep.moveToRoomAdv(targetRoomName)) {
            return;
        }

        if (creep.memory.target) {
            let target = Game.getObjectById(creep.memory.target);
            if (target) creep.moveTo(creep.memory.target, { reusePath: 50 });

            return;
        }
    },

    explorerLogic: function (creep) {
        let targetRoomName;
        if (creep.memory.targetRooms && creep.memory.targetRooms.length) {
            targetRoomName = creep.memory.targetRooms[0];
        }
        else creep.suicide();

        if (creep.moveToRoomAdv(targetRoomName)) {
            return;
        }



        const newRoomInfo = roomUtil.getRoomInfo(creep.room);
        if (!creep.room.memory.roomInfo) {
            creep.room.memory.roomInfo = newRoomInfo;
        }

        if (!creep.room.find(FIND_HOSTILE_STRUCTURES).length) {
            if (!Memory.outSourceRooms[creep.room.name]) {
                Memory.outSourceRooms[creep.room.name] = { sourceNum: newRoomInfo.sourceInfo.length };
            }
        }
        creep.memory.targetRooms.shift();
    },
    spawn: function (room) {
        var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.room.name == room.name);
        console.log(this.properties.role + ': ' + thisTypeCreeps.length, room.name);
        if (thisTypeCreeps.length < 1) {
            return true;
        }
    },
    spawnData: function (room, targetRoomName) {
        let name = this.properties.role + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = { role: this.properties.role, status: 0, base: room.name, targetRoom: targetRoomName };

        return { name, body, memory };
    },
};
return module.exports;
}
/********** End of module 28: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/scout.js **********/
/********** Start module 29: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/rangeAtker.js **********/
__modules[29] = function(module, exports) {
const { T3_HEAL, T3_TOUGH, T3_RANGE_ATTACK } = __require(52,29);

module.exports = {
    properties: {
        role: 'rangeAtker',
        body: [...new Array(5).fill(TOUGH), ...new Array(25).fill(MOVE), ...new Array(10).fill(RANGED_ATTACK), ...new Array(10).fill(HEAL)],
        boostInfo: {[T3_HEAL]: 10, [T3_TOUGH]: 5, [T3_RANGE_ATTACK]: 10},
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.boost && !creep.memory.boosted && creep.memory.boostInfo) {
            creep.getBoosts();
            return;
        }
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            if(creep.hits < creep.hitsMax) creep.heal(creep);
            return;
        }

        let hostile;
        if (creep.memory.target) {
            hostile = Game.getObjectById(creep.memory.target);
            if (!hostile) creep.memory.target = null;
        }
        if (!hostile && creep.memory.invader) {
            hostile = _.find(creep.room.find(FIND_HOSTILE_STRUCTURES), struct => struct.structureType == STRUCTURE_INVADER_CORE);
            if (!hostile && Memory.outSourceRooms[creep.memory.targetRoom]) {
                Memory.outSourceRooms[creep.memory.targetRoom].invaderCoreLevel = -1;
            }
        }
        if (!hostile) {
            hostile = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                filter: struct => (
                    struct.structureType !== STRUCTURE_KEEPER_LAIR &&
                    struct.structureType !== STRUCTURE_CONTROLLER &&
                    struct.structureType !== STRUCTURE_RAMPART &&
                    struct.structureType !== STRUCTURE_STORAGE &&
                    struct.structureType !== STRUCTURE_TERMINAL
                )
            });
        }
        if (!hostile) {
            hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }

        if (hostile) {
            creep.heal(creep);
            if (hostile.structureType) {
                creep.say('struct')
                let atkers = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (!atkers.length) {
                    creep.moveTo(hostile);
                    if (hostile.owner && creep.pos.isNearTo(hostile)) creep.rangedMassAttack();
                    creep.rangedAttack(hostile);
                }
                else {
                    if (creep.pos.isNearTo(atkers[0])) creep.rangedMassAttack();
                    else creep.rangedAttack(atkers[0]);
                }
            }
            else {
                creep.say('creep')
                let haveAttack = false;
                for(const part of hostile.body) {
                    if(part.type === ATTACK) {
                        haveAttack = true;
                        break;
                    }
                }

                if(haveAttack) {
                    attackInDistance(creep, hostile, 3);
                }
                else {
                    attackInDistance(creep, hostile, 2);
                }

            }

        }
        else {
            if(creep.hits < creep.hitsMax) creep.heal(creep);
        }

    },
    spawn: function (room, roomName) {
        if (room.controller.level < 8) return false;
        let creepCount;
        if (global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },
    spawnData: function (room, targetRoomName, opt = {}) {
        opt.boost = true;

        let name = this.properties.role + Game.time;
        let body;
        if (opt.body) body = opt.body;
        else body = this.properties.body;

        let memory = { role: this.properties.role, status: 0, targetRoom: targetRoomName, base: room.name };

        if (opt.targetId) memory.target = opt.targetId;

        if (opt.boost) {
            memory.boost = true;
            memory.boosted = false;
            if (opt.boostInfo) memory.boostInfo = opt.boostInfo;
            else memory.boostInfo = this.properties.boostInfo;
        }
        if (opt.invader) {
            memory.invader = true;
        }

        return { name, body, memory };
    },
};

function attackInDistance(creep, hostile, range) {
    if (creep.pos.getRangeTo(hostile) > range) creep.moveTo(hostile);
    else if (creep.pos.getRangeTo(hostile) < range) creep.fleeFrom(hostile);

    creep.rangedAttack(hostile);
    if(creep.pos.isNearTo(hostile)) creep.rangedMassAttack();
}
return module.exports;
}
/********** End of module 29: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/creeps/rangeAtker.js **********/
/********** Start module 30: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/spawning.js **********/
__modules[30] = function(module, exports) {
const { roomInfo } = __require(47,30);
const creepLogic = __require(1,30);

module.exports = function (room) {
    if (room.name === 'E16S2' && Game.time % 1000 === 500) {
        Game.rooms['E16S2'].memory.tasks.spawnTasks.push({
            name: 'rangeAtker',
            body: [...new Array(9).fill(MOVE), ...new Array(5).fill(RANGED_ATTACK), ...new Array(4).fill(HEAL)],
            memory: {
                role: 'rangeAtker',
                targetRoom: 'E16N3',
            }
        });
    }
    let idleSpawn = _.find(room.find(FIND_MY_SPAWNS), spawn => spawn.spawning == null);
    if (!idleSpawn) return;
    if (createCoreCreep(room, idleSpawn)) return;
    if (createTaskCreep(room, idleSpawn)) return;
    if (roomDefenceCreeps(room, idleSpawn)) return;
    for (const remoteRoomName of room.memory.outSourceRooms) {
        const roomMemory = Memory.outSourceRooms[remoteRoomName];
        if (!roomMemory) return false;
        if(roomMemory.invaderCore) {
            if(roomMemory.invaderCore.endTime > Game.time) continue;
            else roomMemory.invaderCore = null;
        }
        
        if (remoteDefenceCreeps(room, idleSpawn, remoteRoomName, roomMemory)) return;
        if (remoteSourcingCreeps(room, idleSpawn, remoteRoomName, roomMemory)) return;
    }
}

function spawnCreep(room, spawn, creepSpawnData) {
    if (!creepSpawnData) return -100;

    const { name, body, memory } = creepSpawnData
    let result = spawn.spawnCreep(body, name, { memory: memory });

    if (result === OK && memory.boost && memory.boostInfo) {
        room.addToBoostLab(memory.boostInfo);
    }

    console.log(room, "Tried to Spawn:", creepSpawnData.memory.role, result);
    return result;
}

function createCoreCreep(room, spawn) {
    coreTypes = ['carrier2', 'harvester2', 'manager', 'upgrader2', 'builder2', 'miner', 'mineralCarrier'];
    let creepTypeNeeded = _.find(coreTypes, type => creepLogic[type].spawn(room));
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room);
    let result = spawnCreep(room, spawn, creepSpawnData);
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
    if (spawnTasks.length) {
        const task = spawnTasks[0];
        
        let spawnData = JSON.parse(JSON.stringify(task));
        spawnData.name += Game.time % 10000;
        
        if(!spawnData.memory.base) spawnData.memory.base = room.name;
        if (spawnCreep(room, spawn, spawnData) === OK) {
            spawnTasks.shift();
            return true;
        }
    }

    return false;
}

function roomDefenceCreeps(room, spawn) {
    let enemies = room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length) return true;

    return false;
}

function remoteDefenceCreeps(room, spawn, roomName, roomMemory) {
    const remoteRoom = Game.rooms[roomName];
    if (!remoteRoom) return false;
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
    if(Game.rooms[roomName] && Game.rooms[roomName].find(FIND_HOSTILE_CREEPS).length) return false;

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
return module.exports;
}
/********** End of module 30: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/spawning.js **********/
/********** Start module 31: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/linkTransfer.js **********/
__modules[31] = function(module, exports) {
const { roomInfo } = __require(47,31);

module.exports = function(room) {
    if (!roomInfo[room.name] || !roomInfo[room.name].managerPos) {
        return;
    }
    if(!room.memory.linkInfo) updateLinkInfo(room);
    if(Game.time % 100 === 69) updateLinkInfo(room);
    const linkInfo = room.memory.linkInfo;
    let managerLink = Game.getObjectById(linkInfo.managerLink);
    let sourceLinks = _.map(linkInfo.sourceLinks, linkId => Game.getObjectById(linkId));
    let controllerLink = Game.getObjectById(linkInfo.controllerLink);
    
    let update = false;
    if(linkInfo.managerLink && !managerLink) update = true;
    if(linkInfo.controllerLink && !controllerLink) update = true;
    for(const i in sourceLinks) {
        if(linkInfo.sourceLinks[i] && !sourceLinks[i]) update = true;
    }
    if(update) updateLinkInfo(room);
    if(sourceLinks.length && managerLink) source2manager(sourceLinks, managerLink);
    if(sourceLinks.length && controllerLink) source2controller(sourceLinks, controllerLink);
    if(managerLink && controllerLink) manager2controller(managerLink, controllerLink);
}

function source2manager(sourceLinks, managerLink) {
    if(managerLink.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        for(const link of sourceLinks) {
            if(link.store.getUsedCapacity(RESOURCE_ENERGY) > 750) {
                link.transferEnergy(managerLink);
                return;
            }
        }
    }
}

function source2controller(sourceLinks, controllerLink) {
    if(controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) <= 200) {
        for(const link of sourceLinks) {
            if(link.store.getUsedCapacity(RESOURCE_ENERGY) >= 600) {
                link.transferEnergy(controllerLink);
                return;
            }
        }
    }
}

function manager2controller(managerLink, controllerLink) {
    if(controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) < 100) {
        if(managerLink.store.getUsedCapacity(RESOURCE_ENERGY) > 700) {
            managerLink.transferEnergy(controllerLink);
        }
    }
}

function updateLinkInfo(room) {
    room.memory.linkInfo = {};
    const linkInfo = room.memory.linkInfo;
    linkInfo.sourceLinks = [];

    let links = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LINK});
    let sources = room.find(FIND_SOURCES);

    _.forEach(links, link => {
        if(link.pos.inRangeTo(roomInfo[room.name].managerPos, 1)) {
            linkInfo.managerLink = link.id;
        }
        _.forEach(sources, source => {
            if(link.pos.inRangeTo(source.pos, 2)) {
                linkInfo.sourceLinks.push(link.id);
                return;
            }
        })
        if(link.pos.inRangeTo(room.controller.pos, 2)) {
            linkInfo.controllerLink = link.id;
        }
    });
    room.memory.linkCompleteness = (linkInfo.sourceLinks.length === sources.length && linkInfo.managerLink) ? true : false;
};
return module.exports;
}
/********** End of module 31: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/linkTransfer.js **********/
/********** Start module 32: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/roomCensus.js **********/
__modules[32] = function(module, exports) {
module.exports = function() {
    global.roomCensus = {};
    _.forEach(Game.creeps, creep => {
        if(creep.ticksToLive < creep.body.length * 3) return;
        if(creep.memory.role === 'keeperAttacker' && creep.ticksToLive < creep.body.length * 3 + 50) return;

        let role = creep.memory.role;
        if(creep.memory.targetRoom) {
            let roomName = creep.memory.targetRoom;
            addInCensusObj(creep, roomName, role);
        }
        else if(creep.memory.base) {
            let roomName = creep.memory.base;
            addInCensusObj(creep, roomName, role);
        }
    })
    _.forEach(_.keys(global.roomCensus), roomName => {
        console.log(roomName, JSON.stringify(global.roomCensus[roomName]));
    })
}

function addInCensusObj(creep, roomName, role) {
    if(global.roomCensus[roomName] == undefined) {
        global.roomCensus[roomName] = {};
    }
    if (global.roomCensus[roomName][role] == undefined) {
        global.roomCensus[roomName][role] = 1;
    }
    else {
        global.roomCensus[roomName][role] += 1;
    }
}
return module.exports;
}
/********** End of module 32: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/roomCensus.js **********/
/********** Start module 33: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/exportStats.js **********/
__modules[33] = function(module, exports) {
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
/********** End of module 33: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/exportStats.js **********/
/********** Start module 34: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/labReaction.js **********/
__modules[34] = function(module, exports) {
const { transferTask, LabTask } = __require(53,34);
const { reactionResources } = __require(49,34);
const { compondsRequirements } = __require(47,34);


module.exports = function (room) {
    if (!room) return;
    if (room.controller.level < 6) return;
    if (!room.memory.tasks) room.memory.tasks = {};
    if (!room.memory.tasks.labTasks) room.memory.tasks.labTasks = [];
    if (!room.storage) return;
    if (!room.memory.labs) room.memory.labs = {};
    if (!room.memory.labs.center) {
        room.memory.labs.center = [];
        return;
    }
    if (room.memory.labs.center.length != 2) return;
    if (!room.memory.labs.boostLab) room.memory.labs.boostLab = {};
    if (Game.time % 1000 === 686) {
        let needBoostCreep = _.find(Game.creeps, creep => creep.memory.base === room.name && creep.memory.boost === true && creep.memory.boosted === false);
        if (!needBoostCreep) {
            room.memory.labs.boostLab = {};
        }
    }
    if (Game.time % 200 === 123 && room.memory.tasks.labTasks.length === 0) {
        if (!room.memory.compondLevel) {
            let compoundIsShort = createTask(room, 0);
            if (!compoundIsShort) room.memory.compondLevel = 1;
        }
        else if (room.memory.compondLevel === 1) {
            let compoundIsShort = createTask(room, 1);
            if (!compoundIsShort) room.memory.compondLevel = 2;
        }
    }
    if (Game.time % 5000 === 123 && room.memory.compondLevel === 2 && room.memory.tasks.labTasks.length === 0) {
        let compoundIsShort = createTask(room, 1);
        if (compoundIsShort) room.memory.compondLevel = 0;
    }
    runLab(room);
};
function createLabTasks(storage, resourceType, targetAmount, resourceTotal = {}) {
    if (!storage) return false;
    let short = (resourceTotal[resourceType] ? resourceTotal[resourceType] : 0) + targetAmount - storage.store[resourceType];
    if (short <= 0) {
        if (resourceTotal[resourceType]) resourceTotal[resourceType] += targetAmount;
        else resourceTotal[resourceType] = targetAmount;

        return [];
    }
    else if (!reactionResources[resourceType]) {
        return false;
    }
    else {
        if (short > 2000) short = 2000;
        else if (short < 1000) short = 1000;

        let taskList = [];
        for (const i in reactionResources[resourceType]) {
            let reactant = reactionResources[resourceType][i];
            let subTasks = createLabTasks(storage, reactant, short, resourceTotal);
            if (subTasks === false) return false;
            else taskList.push(...subTasks);
        }
        taskList.push(new LabTask(resourceType, short));
        return taskList;
    }
};


function runLab(room) {
    let labTasks = room.memory.tasks.labTasks;
    if (!labTasks.length) {
        return;
    }

    let allLabs = room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_LAB });
    let outterLabs = _.filter(allLabs, lab => lab.isActive() && !room.memory.labs.center.includes(lab.id) && !room.memory.labs.boostLab[lab.id]);
    let centerLabs = _.map(room.memory.labs.center, id => Game.getObjectById(id));



    const task = room.memory.tasks.labTasks[0];
    if (!room.memory.labStatus) {
        for (const lab of centerLabs) {
            if (lab.mineralType) return;
        }
        for (const lab of outterLabs) {
            if (lab.mineralType) return;
        }

        if (task.amount <= 0) {
            room.memory.tasks.labTasks.shift();
            return;
        }
        else {
            room.memory.labStatus = 1;
        }
    }
    else if (room.memory.labStatus == 1) {
        for (const i in centerLabs) {
            if (centerLabs[i].mineralType && centerLabs[i].mineralType != reactionResources[task.resourceType][i]) {
                room.memory.labStatus = 0;
                return;
            }
        }
        for (const i in outterLabs) {
            if (task.amount <= 0) {
                room.memory.labStatus = 0;
                return;
            }

            if (outterLabs[i].mineralType && outterLabs[i].mineralType != task.resourceType) {
                room.memory.labStatus = 3;
                return;
            }

            const result = outterLabs[i].runReaction(...centerLabs);
            if (result === ERR_FULL || result === ERR_INVALID_ARGS) {
                room.memory.labStatus = 3;
                return;
            }
            else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                room.memory.labStatus = 2;
                return;
            }
            else if (result == OK) {
                task.amount -= 5;
            }
            else {
            }
        }
    }
    else if (room.memory.labStatus == 2) {
        if (task.amount <= 0) {
            room.memory.labStatus = 0;
            return;
        }

        for (const i in centerLabs) {
            let lab = centerLabs[i];
            if (!lab.mineralType || lab.store[lab.mineralType] < 5) {
                return;
            }
        }

        room.memory.labStatus = 1;
    }
    else if (room.memory.labStatus == 3) {
        for (const lab of outterLabs) {
            if (lab.mineralType && lab.mineralType !== task.resourceType) return;
            if (lab.store.getFreeCapacity(task.resourceType) < 5) return;
        }

        room.memory.labStatus = 1;
    }
}

function createTask(room, amountIndex) {
    let shortage = 'NO Compound Shortage';
    let res = false;
    for (const compond in compondsRequirements) {
        let targetAmount = compondsRequirements[compond][amountIndex];
        let createdTasks = createLabTasks(room.storage, compond, targetAmount);
        if (createdTasks.length > 0) {
            room.memory.tasks.labTasks.push(...createdTasks);
            res = true;
            break;
        }
        else if (createdTasks === false) {
            shortage = compond;
            res = true;
            break;
        }
    }

    if (!Memory.resourceShortage) Memory.resourceShortage = {};
    else Memory.resourceShortage[room.name] = shortage;

    return res;
}
return module.exports;
}
/********** End of module 34: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/labReaction.js **********/
/********** Start module 35: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/resourceBalancing.js **********/
__modules[35] = function(module, exports) {
const { roomResourceConfig } = __require(47,35);

module.exports = function(myRooms) {
    if(Game.time % 200 == 45) {
        console.log("assign terminal task")
        for(const i in myRooms) {
            if(!myRooms[i].memory.tasks) myRooms[i].memory.tasks = {};
            if(!myRooms[i].memory.tasks.terminalTasks) myRooms[i].memory.tasks.terminalTasks = [];
        }

        for(const resourceType in roomResourceConfig) {
            const abundantLine = roomResourceConfig[resourceType].storage[1];
            const lowerBoundLine = roomResourceConfig[resourceType].storage[0];
            let sender = _.filter(myRooms, room => room.storage && room.terminal && room.storage.store[resourceType] > abundantLine);
            let receiver = _.filter(myRooms, room => room.storage && room.terminal && room.storage.store[resourceType] < lowerBoundLine);
            if(receiver.length === 0 && resourceType === RESOURCE_ENERGY) {
                receiver = _.filter(myRooms, room => (
                    room.storage && 
                    room.terminal && 
                    room.controller.level < 8 && 
                    room.storage.store[resourceType] < abundantLine)
                );
            }
            receiver.sort((r1, r2) => r1.storage.store[resourceType] - r2.storage.store[resourceType]);
    
            for(const i in sender) {
                if(receiver[i]) {
                    let task = {receiver: receiver[i].name, resourceType: resourceType};
                    task.amount = roomResourceConfig[resourceType].terminal / 2;
                    sender[i].memory.tasks.terminalTasks.push(task);
                    
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
/********** End of module 35: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/resourceBalancing.js **********/
/********** Start module 36: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/powerOperation.js **********/
__modules[36] = function(module, exports) {
module.exports = function(room) {

    if(room.controller.level == 8) {
        let pSpawns = room.find(FIND_MY_STRUCTURES, {filter: struct => (
            struct.structureType == STRUCTURE_POWER_SPAWN && 
            struct.store[RESOURCE_ENERGY] >= 50 &&
            struct.store[RESOURCE_POWER] > 0
        )});

        if(pSpawns.length > 0) {
            pSpawns[0].processPower();
        }
    }

};
return module.exports;
}
/********** End of module 36: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/powerOperation.js **********/
/********** Start module 37: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/factorayLogic.js **********/
__modules[37] = function(module, exports) {
module.exports = function(room) {
    if(room.level < 7) return;
    let factory = _.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType === STRUCTURE_FACTORY);

    if(factory && factory.store[RESOURCE_PURIFIER] >= 100 && factory.cooldown === 0) {
        factory.produce('X');
    }
}
return module.exports;
}
/********** End of module 37: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/factorayLogic.js **********/
/********** Start module 38: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/marketLogic.js **********/
__modules[38] = function(module, exports) {
module.exports = function() {
    if(Game.time % 10 !== 10) return;
    
    let w21s19 = Game.rooms['W21S19'];
    if(!w21s19 || !w21s19.terminal) return;

    let alloyAmount = w21s19.terminal.store[RESOURCE_ALLOY];

    if(alloyAmount === 0) {
        console.log("Alloy Soldout");
        return;
    }

    let orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ALLOY});
    if(orders.length === 0) {
        return;
        console.log("No order exist");
    }

    orders.sort((o1, o2) => (o2.price - o1.price));

    if(orders[0].price > 2450) {
        let result = Game.market.deal(orders[0].id, alloyAmount, "W21S19");
        if(result === OK) {
            console.log("Alloy sold " + orders[0].amount);
        }
        
    }
    else {
        console.log("Top Price is", orders[0].price);
    }


}
return module.exports;
}
/********** End of module 38: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/marketLogic.js **********/
/********** Start module 39: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/towerLogic.js **********/
__modules[39] = function(module, exports) {
const { wall, rampart } = __require(48,39);

module.exports = function (room) {
    const towers = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_TOWER && struct.store[RESOURCE_ENERGY] >= 10});
    if(!towers.length) return;
    let damagedCreeps = room.find(FIND_MY_CREEPS, { filter: creep => creep.hits < creep.hitsMax });
    if (damagedCreeps.length) {
        let tower = damagedCreeps[0].pos.findClosestByRange(towers);
        if (tower) tower.heal(damagedCreeps[0]);
    }
    let enemies = room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length) {
        console.log(room, "Found Enemies!");
        _.forEach(towers, tower => {
            let target = tower.pos.findClosestByRange(enemies);
            tower.attack(target);
        })
        return;
    }
    function isNeedRepair(structure) {
        return (
            (structure.structureType == STRUCTURE_WALL && structure.hits >= wall.getTargetHits(room) && structure.hits < wall.getIdealHits(room)) || 
            (structure.structureType == STRUCTURE_RAMPART && structure.hits < 10000) ||
            (structure.structureType == STRUCTURE_RAMPART && structure.hits >= rampart.getTargetHits(room) && structure.hits < rampart.getIdealHits(room)) || 
            (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART && structure.hits <= structure.hitsMax - 800)
        )
    }

    if (!room.memory.needRepairStructures) room.memory.needRepairStructures = [];
    if (Game.time % 10 === 0 && room.memory.needRepairStructures.length === 0) {
        let needRepairStructures = _.filter(room.find(FIND_STRUCTURES), isNeedRepair);
        room.memory.needRepairStructures = _.map(needRepairStructures, structure => structure.id);
    }

    let needRepairs = room.memory.needRepairStructures;
    while(needRepairs.length) {
        let target = Game.getObjectById(needRepairs[needRepairs.length - 1]);
        if(!target || !isNeedRepair(target)) {
            needRepairs.pop();
        }
        else {
            let tower = target.pos.findClosestByRange(towers);
            tower.repair(target);
            break;
        }
    }
}
return module.exports;
}
/********** End of module 39: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/towerLogic.js **********/
/********** Start module 40: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/roomInit.js **********/
__modules[40] = function(module, exports) {
const { roomInfo } = __require(47,40);
const { roomUtil } = __require(54,40);
const ifInit = true;
function roomInit(room) {
    if(room.memory.scout) {
        const targetRooms = roomUtil.getRoomsInRange(room.name, room.memory.scout);
        room.memory.tasks.spawnTasks.push({
            name: 'explorer',
            body: [MOVE], 
            memory: {
                role: 'scout',
                targetRooms: targetRooms,
                explorer: true
            }
        });

        room.memory.scout = 0;
    }

    if(!ifInit) return;
    if(!room || room.memory.init === false) return;
    if(!room.controller || room.controller.level === 0 || !room.controller.my) return;
    if(!Memory.outSourceRooms) Memory.outSourceRooms = {};
    if(!Memory.resourceShortage) Memory.resourceShortage = {};
    if(room.memory.init == null) {
        room.memory = {
            outSourceRooms: [],
            needRepairStructures: [],
            linkInfo: {
                sourceLinks: [],
                controllerLink: null,
                managerLink: null
            },
            linkCompleteness: false,
            tasks: {
                labTasks: [],
                terminalTasks: [],
                managerTasks: [],
                spawnTasks: []
            },
            labs: {
                center: [],
                boostLab: {},
                labStatus: 0,
            },
        }
    }


    const targetRooms = roomUtil.getRoomsInRange(room.name, 3);
    room.memory.roomInfo = roomUtil.getRoomInfo(room);
    room.memory.tasks.spawnTasks.push({
        name: 'explorer',
        body: [MOVE], 
        memory: {
            role: 'scout',
            targetRooms: targetRooms,
            explorer: true
        }
    });
    if(roomInfo[room.name].storagePos) {
        room.createConstructionSite(roomInfo[room.name].storagePos, STRUCTURE_CONTAINER);
    }
    else if(roomInfo[room.name].roomPlan) {
    }


    room.memory.init = false;
}

module.exports = roomInit;
return module.exports;
}
/********** End of module 40: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/room/roomInit.js **********/
/********** Start module 41: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/test/sandbox.js **********/
__modules[41] = function(module, exports) {
const { roomUtil } = __require(54,41);

const sandbox = {
    startOfTheTick: function() {
    },

    endOfTheTick: function() {
        
    },
}

module.exports = sandbox;
return module.exports;
}
/********** End of module 41: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/test/sandbox.js **********/
/********** Start module 42: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/roomPlanner.js **********/
__modules[42] = function(module, exports) {

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
    if (!flags.length) { 
        return null; 
    }
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
/********** End of module 42: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/roomPlanner.js **********/
/********** Start module 43: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/myRoomPlanner.js **********/
__modules[43] = function(module, exports) {

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
};



function getAnchor(roomName) {
    let room = Game.rooms[roomName];
    if (!room) { console.log('no room'); return null; }
    let flags = room.find(FIND_FLAGS, { filter: { color: COLOR_RED } });
    if (!flags.length) {
        return null;
    }
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
    return [
        [-1, -2, STRUCTURE_ROAD],
        [1, -2, STRUCTURE_ROAD],
        [-2, -1, STRUCTURE_ROAD],
        [-1, -1, STRUCTURE_FACTORY],
        [0, -1, STRUCTURE_ROAD],
        [1, -1, STRUCTURE_LINK],
        [2, -1, STRUCTURE_ROAD],
        [-1, 0, STRUCTURE_TERMINAL],
        [1, 0, STRUCTURE_STORAGE],
        [-2, 1, STRUCTURE_ROAD],
        [-1, 1, STRUCTURE_NUKER],
        [0, 1, STRUCTURE_ROAD],
        [1, 1, STRUCTURE_POWER_SPAWN],
        [2, 1, STRUCTURE_ROAD],
        [-1, 2, STRUCTURE_ROAD],
        [1, 2, STRUCTURE_ROAD],
        [0, 3, STRUCTURE_ROAD],
        [0, -3, STRUCTURE_ROAD],
        [3, 0, STRUCTURE_ROAD],
        [-3, 0, STRUCTURE_ROAD],
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
    let points = [[x - 3.4, y], [x , y - 3.4], [x + 3.4, y], [x, y + 3.4], [x - 3.4, y]];
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
/********** End of module 43: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/myRoomPlanner.js **********/
/********** Start module 44: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/traveler.js **********/
__modules[44] = function(module, exports) {
const traveler = {
    structureMatrixCache: {},
    creepMatrixCache: {},
    /**
     * move creep to destination
     * @param creep
     * @param destination
     * @param options
     * @returns {number}
     */
    travelTo(creep, destination, options = {}) {
        if (!destination) {
            return ERR_INVALID_ARGS;
        }
        if (creep.fatigue > 0) {
            this.circle(creep.pos, "aqua", .3);
            return ERR_TIRED;
        }
        destination = this.normalizePos(destination);
        let rangeToDestination = creep.pos.getRangeTo(destination);
        if (options.range && rangeToDestination <= options.range) {
            return OK;
        }
        else if (rangeToDestination <= 1) {
            if (rangeToDestination === 1 && !options.range) {
                let direction = creep.pos.getDirectionTo(destination);
                if (options.returnData) {
                    options.returnData.nextPos = destination;
                    options.returnData.path = direction.toString();
                }
                return creep.move(direction);
            }
            return OK;
        }
        if (!creep.memory._trav) {
            delete creep.memory._travel;
            creep.memory._trav = {};
        }
        let travelData = creep.memory._trav;
        let state = this.deserializeState(travelData, destination);
        if (this.isStuck(creep, state)) {
            state.stuckCount++;
            this.circle(creep.pos, "magenta", state.stuckCount * .2);
        }
        else {
            state.stuckCount = 0;
        }
        if (!options.stuckValue) {
            options.stuckValue = DEFAULT_STUCK_VALUE;
        }
        if (state.stuckCount >= options.stuckValue && Math.random() > .5) {
            options.ignoreCreeps = false;
            options.freshMatrix = true;
            delete travelData.path;
        }
        if (!this.samePos(state.destination, destination)) {
            if (options.movingTarget && state.destination.isNearTo(destination)) {
                travelData.path += state.destination.getDirectionTo(destination);
                state.destination = destination;
            }
            else {
                delete travelData.path;
            }
        }
        if (options.repath && Math.random() < options.repath) {
            delete travelData.path;
        }
        let newPath = false;
        if (!travelData.path) {
            newPath = true;
            if (creep.spawning) {
                return ERR_BUSY;
            }
            state.destination = destination;
            let cpu = Game.cpu.getUsed();
            let ret = this.findTravelPath(creep.pos, destination, options);
            let cpuUsed = Game.cpu.getUsed() - cpu;
            state.cpu = _.round(cpuUsed + state.cpu);
            if (state.cpu > REPORT_CPU_THRESHOLD) {
                console.log(`TRAVELER: heavy cpu use: ${creep.name}, cpu: ${state.cpu} origin: ${creep.pos}, dest: ${destination}`);
            }
            let color = "orange";
            if (ret.incomplete) {
                color = "red";
            }
            if (options.returnData) {
                options.returnData.pathfinderReturn = ret;
            }
            travelData.path = this.serializePath(creep.pos, ret.path, color);
            state.stuckCount = 0;
        }
        this.serializeState(creep, destination, state, travelData);
        if (!travelData.path || travelData.path.length === 0) {
            return ERR_NO_PATH;
        }
        if (state.stuckCount === 0 && !newPath) {
            travelData.path = travelData.path.substr(1);
        }
        let nextDirection = parseInt(travelData.path[0], 10);
        if (options.returnData) {
            if (nextDirection) {
                let nextPos = this.positionAtDirection(creep.pos, nextDirection);
                if (nextPos) {
                    options.returnData.nextPos = nextPos;
                }
            }
            options.returnData.state = state;
            options.returnData.path = travelData.path;
        }
        return creep.move(nextDirection);
    },
    /**
     * make position objects consistent so that either can be used as an argument
     * @param destination
     * @returns {any}
     */
    normalizePos(destination) {
        if (!(destination instanceof RoomPosition)) {
            return destination.pos;
        }
        return destination;
    },
    /**
     * check if room should be avoided by findRoute algorithm
     * @param roomName
     * @returns {RoomMemory|number}
     */
    checkAvoid(roomName) {
        return Memory.rooms && Memory.rooms[roomName] && Memory.rooms[roomName].avoid;
    },
    /**
     * check if a position is an exit
     * @param pos
     * @returns {boolean}
     */
    isExit(pos) {
        return pos.x === 0 || pos.y === 0 || pos.x === 49 || pos.y === 49;
    },
    /**
     * check two coordinates match
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    sameCoord(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    },
    /**
     * check if two positions match
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    samePos(pos1, pos2) {
        return this.sameCoord(pos1, pos2) && pos1.roomName === pos2.roomName;
    },
    /**
     * draw a circle at position
     * @param pos
     * @param color
     * @param opacity
     */
    circle(pos, color, opacity) {
        new RoomVisual(pos.roomName).circle(pos, {
            radius: .45, fill: "transparent", stroke: color, strokeWidth: .15, opacity: opacity
        });
    },
    /**
     * update memory on whether a room should be avoided based on controller owner
     * @param room
     */
    updateRoomStatus(room) {
        if (!room) {
            return;
        }
        if (room.controller) {
            if (room.controller.owner && !room.controller.my) {
                room.memory.avoid = 1;
            }
            else {
                delete room.memory.avoid;
            }
        }
    },
    /**
     * find a path from origin to destination
     * @param origin
     * @param destination
     * @param options
     * @returns {PathfinderReturn}
     */
    findTravelPath(origin, destination, options = {}) {
        _.defaults(options, {
            ignoreCreeps: true,
            maxOps: DEFAULT_MAXOPS,
            range: 1,
        });
        if (options.movingTarget) {
            options.range = 0;
        }
        origin = this.normalizePos(origin);
        destination = this.normalizePos(destination);
        let originRoomName = origin.roomName;
        let destRoomName = destination.roomName;
        let roomDistance = Game.map.getRoomLinearDistance(origin.roomName, destination.roomName);
        let allowedRooms = options.route;
        if (!allowedRooms && (options.useFindRoute || (options.useFindRoute === undefined && roomDistance > 2))) {
            let route = this.findRoute(origin.roomName, destination.roomName, options);
            if (route) {
                allowedRooms = route;
            }
        }
        let roomsSearched = 0;
        let callback = (roomName) => {
            if (allowedRooms) {
                if (!allowedRooms[roomName]) {
                    return false;
                }
            }
            else if (!options.allowHostile && this.checkAvoid(roomName)
                && roomName !== destRoomName && roomName !== originRoomName) {
                return false;
            }
            roomsSearched++;
            let matrix;
            let room = Game.rooms[roomName];
            if (room) {
                if (options.ignoreStructures) {
                    matrix = new PathFinder.CostMatrix();
                    if (!options.ignoreCreeps) {
                        this.addCreepsToMatrix(room, matrix);
                    }
                }
                else if (options.ignoreCreeps || roomName !== originRoomName) {
                    matrix = this.getStructureMatrix(room, options.freshMatrix);
                }
                else {
                    matrix = this.getCreepMatrix(room);
                }
                if (options.obstacles) {
                    matrix = matrix.clone();
                    for (let obstacle of options.obstacles) {
                        if (obstacle.pos.roomName !== roomName) {
                            continue;
                        }
                        matrix.set(obstacle.pos.x, obstacle.pos.y, 0xff);
                    }
                }
            }
            if (options.roomCallback) {
                if (!matrix) {
                    matrix = new PathFinder.CostMatrix();
                }
                let outcome = options.roomCallback(roomName, matrix.clone());
                if (outcome !== undefined) {
                    return outcome;
                }
            }
            return matrix;
        };
        let ret = PathFinder.search(origin, { pos: destination, range: options.range }, {
            maxOps: options.maxOps,
            maxRooms: options.maxRooms,
            plainCost: options.offRoad ? 1 : options.ignoreRoads ? 1 : 2,
            swampCost: options.offRoad ? 1 : options.ignoreRoads ? 5 : 10,
            roomCallback: callback,
        });
        if (ret.incomplete && options.ensurePath) {
            if (options.useFindRoute === undefined) {
                if (roomDistance <= 2) {
                    console.log(`TRAVELER: path failed without findroute, trying with options.useFindRoute = true`);
                    console.log(`from: ${origin}, destination: ${destination}`);
                    options.useFindRoute = true;
                    ret = this.findTravelPath(origin, destination, options);
                    console.log(`TRAVELER: second attempt was ${ret.incomplete ? "not " : ""}successful`);
                    return ret;
                }
            }
            else {
            }
        }
        return ret;
    },
    /**
     * find a viable sequence of rooms that can be used to narrow down pathfinder's search algorithm
     * @param origin
     * @param destination
     * @param options
     * @returns {{}}
     */
    findRoute(origin, destination, options = {}) {
        let restrictDistance = options.restrictDistance || Game.map.getRoomLinearDistance(origin, destination) + 10;
        let allowedRooms = { [origin]: true, [destination]: true };
        let highwayBias = 1;
        if (options.preferHighway) {
            highwayBias = 2.5;
            if (options.highwayBias) {
                highwayBias = options.highwayBias;
            }
        }
        let ret = Game.map.findRoute(origin, destination, {
            routeCallback: (roomName) => {
                if (options.routeCallback) {
                    let outcome = options.routeCallback(roomName);
                    if (outcome !== undefined) {
                        return outcome;
                    }
                }
                let rangeToRoom = Game.map.getRoomLinearDistance(origin, roomName);
                if (rangeToRoom > restrictDistance) {
                    return Number.POSITIVE_INFINITY;
                }
                if (!options.allowHostile && this.checkAvoid(roomName) &&
                    roomName !== destination && roomName !== origin) {
                    return Number.POSITIVE_INFINITY;
                }
                let parsed;
                if (options.preferHighway) {
                    parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    let isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
                    if (isHighway) {
                        return 1;
                    }
                }
                if (!options.allowSK && !Game.rooms[roomName]) {
                    if (!parsed) {
                        parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    }
                    let fMod = parsed[1] % 10;
                    let sMod = parsed[2] % 10;
                    let isSK = !(fMod === 5 && sMod === 5) &&
                        ((fMod >= 4) && (fMod <= 6)) &&
                        ((sMod >= 4) && (sMod <= 6));
                    if (isSK) {
                        return 10 * highwayBias;
                    }
                }
                return highwayBias;
            },
        });
        if (!_.isArray(ret)) {
            console.log(`couldn't findRoute to ${destination}`);
            return;
        }
        for (let value of ret) {
            allowedRooms[value.room] = true;
        }
        return allowedRooms;
    },
    /**
     * check how many rooms were included in a route returned by findRoute
     * @param origin
     * @param destination
     * @returns {number}
     */
    routeDistance(origin, destination) {
        let linearDistance = Game.map.getRoomLinearDistance(origin, destination);
        if (linearDistance >= 32) {
            return linearDistance;
        }
        let allowedRooms = this.findRoute(origin, destination);
        if (allowedRooms) {
            return Object.keys(allowedRooms).length;
        }
    },
    /**
     * build a cost matrix based on structures in the room. Will be cached for more than one tick. Requires vision.
     * @param room
     * @param freshMatrix
     * @returns {any}
     */
    getStructureMatrix(room, freshMatrix) {
        if (!this.structureMatrixCache[room.name] || (freshMatrix && Game.time !== this.structureMatrixTick)) {
            this.structureMatrixTick = Game.time;
            let matrix = new PathFinder.CostMatrix();
            this.structureMatrixCache[room.name] = this.addStructuresToMatrix(room, matrix, 1);
        }
        return this.structureMatrixCache[room.name];
    },
    /**
     * build a cost matrix based on creeps and structures in the room. Will be cached for one tick. Requires vision.
     * @param room
     * @returns {any}
     */
    getCreepMatrix(room) {
        if (!this.creepMatrixCache[room.name] || Game.time !== this.creepMatrixTick) {
            this.creepMatrixTick = Game.time;
            this.creepMatrixCache[room.name] = this.addCreepsToMatrix(room, this.getStructureMatrix(room, true).clone());
        }
        return this.creepMatrixCache[room.name];
    },
    /**
     * add structures to matrix so that impassible structures can be avoided and roads given a lower cost
     * @param room
     * @param matrix
     * @param roadCost
     * @returns {CostMatrix}
     */
    addStructuresToMatrix(room, matrix, roadCost) {
        let impassibleStructures = [];
        for (let structure of room.find(FIND_STRUCTURES)) {
            if (structure instanceof StructureRampart) {
                if (!structure.my && !structure.isPublic) {
                    impassibleStructures.push(structure);
                }
            }
            else if (structure instanceof StructureRoad) {
                matrix.set(structure.pos.x, structure.pos.y, roadCost);
            }
            else if (structure instanceof StructureContainer) {
                matrix.set(structure.pos.x, structure.pos.y, 5);
            }
            else {
                impassibleStructures.push(structure);
            }
        }
        for (let site of room.find(FIND_MY_CONSTRUCTION_SITES)) {
            if (site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_ROAD
                || site.structureType === STRUCTURE_RAMPART) {
                continue;
            }
            matrix.set(site.pos.x, site.pos.y, 0xff);
        }
        for (let structure of impassibleStructures) {
            matrix.set(structure.pos.x, structure.pos.y, 0xff);
        }
        return matrix;
    },
    /**
     * add creeps to matrix so that they will be avoided by other creeps
     * @param room
     * @param matrix
     * @returns {CostMatrix}
     */
    addCreepsToMatrix(room, matrix) {
        room.find(FIND_CREEPS).forEach((creep) => matrix.set(creep.pos.x, creep.pos.y, 0xff));
        return matrix;
    },
    /**
     * serialize a path, traveler style. Returns a string of directions.
     * @param startPos
     * @param path
     * @param color
     * @returns {string}
     */
    serializePath(startPos, path, color = "orange") {
        let serializedPath = "";
        let lastPosition = startPos;
        this.circle(startPos, color);
        for (let position of path) {
            if (position.roomName === lastPosition.roomName) {
                new RoomVisual(position.roomName)
                    .line(position, lastPosition, { color: color, lineStyle: "dashed" });
                serializedPath += lastPosition.getDirectionTo(position);
            }
            lastPosition = position;
        }
        return serializedPath;
    },
    /**
     * returns a position at a direction relative to origin
     * @param origin
     * @param direction
     * @returns {RoomPosition}
     */
    positionAtDirection(origin, direction) {
        let offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
        let offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
        let x = origin.x + offsetX[direction];
        let y = origin.y + offsetY[direction];
        if (x > 49 || x < 0 || y > 49 || y < 0) {
            return;
        }
        return new RoomPosition(x, y, origin.roomName);
    },
    /**
     * convert room avoidance memory from the old pattern to the one currently used
     * @param cleanup
     */
    patchMemory(cleanup = false) {
        if (!Memory.empire) {
            return;
        }
        if (!Memory.empire.hostileRooms) {
            return;
        }
        let count = 0;
        for (let roomName in Memory.empire.hostileRooms) {
            if (Memory.empire.hostileRooms[roomName]) {
                if (!Memory.rooms[roomName]) {
                    Memory.rooms[roomName] = {};
                }
                Memory.rooms[roomName].avoid = 1;
                count++;
            }
            if (cleanup) {
                delete Memory.empire.hostileRooms[roomName];
            }
        }
        if (cleanup) {
            delete Memory.empire.hostileRooms;
        }
        console.log(`TRAVELER: room avoidance data patched for ${count} rooms`);
    },
    deserializeState(travelData, destination) {
        let state = {};
        if (travelData.state) {
            state.lastCoord = { x: travelData.state[STATE_PREV_X], y: travelData.state[STATE_PREV_Y] };
            state.cpu = travelData.state[STATE_CPU];
            state.stuckCount = travelData.state[STATE_STUCK];
            state.destination = new RoomPosition(travelData.state[STATE_DEST_X], travelData.state[STATE_DEST_Y], travelData.state[STATE_DEST_ROOMNAME]);
        }
        else {
            state.cpu = 0;
            state.destination = destination;
        }
        return state;
    },
    serializeState(creep, destination, state, travelData) {
        travelData.state = [creep.pos.x, creep.pos.y, state.stuckCount, state.cpu, destination.x, destination.y,
            destination.roomName];
    },
    isStuck(creep, state) {
        let stuck = false;
        if (state.lastCoord !== undefined) {
            if (this.sameCoord(creep.pos, state.lastCoord)) {
                stuck = true;
            }
            else if (this.isExit(creep.pos) && this.isExit(state.lastCoord)) {
                stuck = true;
            }
        }
        return stuck;
    }
}
const REPORT_CPU_THRESHOLD = 1000;
const DEFAULT_MAXOPS = 20000;
const DEFAULT_STUCK_VALUE = 2;
const STATE_PREV_X = 0;
const STATE_PREV_Y = 1;
const STATE_STUCK = 2;
const STATE_CPU = 3;
const STATE_DEST_X = 4;
const STATE_DEST_Y = 5;
const STATE_DEST_ROOMNAME = 6;
Creep.prototype.travelTo = function (destination, options) {
    return traveler.travelTo(this, destination, options);
};


module.exports = traveler;
return module.exports;
}
/********** End of module 44: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/tools/traveler.js **********/
/********** Start module 45: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/creep.js **********/
__modules[45] = function(module, exports) {
const { roomInfo } = __require(47,45);
const { boostCreep } = __require(55,45);

Creep.prototype.sayHello = function sayHello(words = "Hello") {
    this.say(words, true);
}

Creep.prototype.damaged = function () {
    return this.hits < this.hitsMax;
}

Creep.prototype.moveToNoCreep = function (target) {
    this.travelTo(target, {allowHostile: true});
}

Creep.prototype.moveToNoCreepInRoom = function (target) {
    this.travelTo(target, { maxRooms: 1 });
}

Creep.prototype.moveToRoom = function (roomName) {
    if (this.isStuck()) {
        this.moveTo(new RoomPosition(25, 25, roomName));
    }
    return this.moveToNoCreep(new RoomPosition(25, 25, roomName));
}

Creep.prototype.moveToRoomAdv = function (roomName) {
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

Creep.prototype.workerSetStatus = function () {
    if (this.memory.status && this.store.getUsedCapacity() === 0 && this.store.getCapacity() > 0) {
        this.memory.status = 0;
    }
    if (!this.memory.status && this.store.getFreeCapacity() === 0) {
        this.memory.status = 1;
    }
}

Creep.prototype.workerSetStatusWithAction = function (onHarvest = null, onWork = null) {
    if (this.memory.status && this.store.getUsedCapacity() == 0) {
        this.memory.status = 0;
        if (onHarvest) onHarvest();
    }
    if (!this.memory.status && this.store.getFreeCapacity() == 0) {
        this.memory.status = 1;
        if (onWork) onWork();
    }
}
Creep.prototype.collectEnergy = function collectEnergy(changeStatus = false) {
    var dropedResource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: resource => 
        resource.resourceType == RESOURCE_ENERGY && 
        !resource.pos.inRangeTo(this.room.controller.pos, 4) &&
        resource.amount > this.store.getCapacity() / 2 });
    if (dropedResource) {
        let result = this.pickup(dropedResource);
        if (result == ERR_NOT_IN_RANGE) {
            this.moveTo(dropedResource);
        }
        else if (changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }
    if (this.room.memory.linkCompleteness == true) {
        return false;
    }
    var container = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => (
            structure.structureType == STRUCTURE_CONTAINER &&
            !structure.pos.inRangeTo(this.room.controller.pos, 3) &&
            !(roomInfo[this.room.name] && roomInfo[this.room.name].storagePos && structure.pos.isEqualTo(roomInfo[this.room.name].storagePos)) &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getCapacity() / 2
        )
    });

    if (container) {
        let resourceType = RESOURCE_ENERGY;
        let result = this.withdraw(container, resourceType);
        if (result == ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
        else if (changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }
    var tomstone = _.find(this.room.find(FIND_TOMBSTONES), ts => ts.store[RESOURCE_ENERGY] > this.store.getCapacity() / 2);
    if (tomstone) {
        let result = this.withdraw(tomstone, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            this.moveTo(tomstone);
        }
        else if (changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }

    return false;
}

Creep.prototype.harvestEnergy = function harvestEnergy() {
    let source;
    let result;
    if (this.memory.target != null) {
        source = this.room.find(FIND_SOURCES)[this.memory.target];
    }
    else {
        this.say('!target')
        source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    }

    if (!source) {
        console.log(this.name)
        return ERR_NOT_FOUND;
    }

    if (!this.pos.inRangeTo(source.pos, 1)) {
        this.moveToNoCreepInRoom(source);
        result = ERR_NOT_IN_RANGE;
    }
    else {
        let links = this.pos.findInRange(FIND_STRUCTURES, 1, { filter: struct => struct.structureType == STRUCTURE_LINK && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0 });
        if (links.length > 0) {
            result = this.harvest(source);
            if (links.length > 0 && (this.store.getFreeCapacity() < 20 || this.ticksToLive < 2 || result == ERR_NOT_ENOUGH_RESOURCES)) {
                this.transfer(links[0], RESOURCE_ENERGY);
            }
        }
        else {
            let contianer = this.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: struct => (
                    struct.structureType == STRUCTURE_CONTAINER &&
                    struct.pos.inRangeTo(source.pos, 1)
                )
            });
            if (contianer) {
                if (!contianer.pos.isEqualTo(this.pos)) this.moveTo(contianer);
                if (contianer.store.getFreeCapacity() > 0) result = this.harvest(source);
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
        if (this.withdraw(storage, resourceType) == ERR_NOT_IN_RANGE) {
            this.moveTo(storage);
        }
        return;
    }
}


Creep.prototype.takeEnergyFromClosest = function () {
    let dropedEnergys = this.room.find(FIND_DROPPED_RESOURCES, { filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount >= this.store.getCapacity() });
    let stores = this.room.find(FIND_STRUCTURES, {filter: structure => 
        (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity()});
    
    let targets = [...dropedEnergys, ...stores];
    let target = this.pos.findClosestByRange(targets);
    if(!target) {
        this.toResPos();
        return false;
    }
    else if(target.amount) {
        if (this.pickup(target) == ERR_NOT_IN_RANGE) {
            this.moveToNoCreepInRoom(target);
        }
        return true;
    }
    else {
        if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveToNoCreepInRoom(target);
        }
        return true;
    }
}

Creep.prototype.takeEnergyFromClosestStore = function () {
    let targets = _.filter(this.room.find(FIND_STRUCTURES), structure => (
        (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity() &&
        !structure.pos.findInRange(FIND_SOURCES, 1).length
    ));
        
    let target = this.pos.findClosestByRange(targets);
    if (target) {
        if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveToNoCreepInRoom(target);
        }
        return true;
    }
    this.toResPos();

    return false;
}

Creep.prototype.takeEnergyNeerController = function () {
    let dropedResource = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: resource => 
        resource.resourceType == RESOURCE_ENERGY && 
        resource.pos.inRangeTo(this.room.controller, 4)
    });
    if (dropedResource) {
        let result = this.pickup(dropedResource)
        if (result === ERR_NOT_IN_RANGE) {
            this.moveTo(dropedResource);
        }
        else if(result === OK) {
            this.memory.status = 1;
        }
        return true;
    }
    let container = this.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => 
        struct.structureType === STRUCTURE_CONTAINER &&
        struct.pos.inRangeTo(this.room.controller, 3) &&
        struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    })
    if(container) {
        let result = this.withdraw(container, RESOURCE_ENERGY);
        if (result === ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
        else if(result === OK) {
            this.memory.status = 1;
        }
        return true;
    }

    return false;
}

Creep.prototype.takeEnergyFromControllerLink = function () {
    if (this.memory.ControllerLinkId) {
        let target = Game.getObjectById(this.memory.ControllerLinkId);
        let result = this.withdraw(target, RESOURCE_ENERGY);

        if (result == ERR_NOT_IN_RANGE) this.moveTo(target);
        else if (result == OK) this.memory.status = 1;
    }
    else {
        let controllerLinkArray = this.room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_LINK && struct.pos.inRangeTo(this.room.controller.pos, 2) });
        if (controllerLinkArray.length) {
            this.memory.ControllerLinkId = controllerLinkArray[0].id;
        }
        else {
            this.takeEnergyFromClosest();
        }
    }
}

Creep.prototype.toResPos = function toResPos(restTime = 5) {
    if (roomInfo[this.room.name]) {
        if (this.pos.isNearTo(roomInfo[this.room.name].restPos)) {
            this.memory.restTime = restTime;
        }
        else {
            this.moveTo(roomInfo[this.room.name].restPos);
        }
    }
}
Creep.prototype.isStuck = function () {
    let stuck = false;

    if (this.memory.lastPos === undefined || this.memory.lastPos.x != this.pos.x && this.memory.lastPos.x != this.pos.x) {
        this.memory.lastPos = { x: this.pos.x, y: this.pos.y, t: 0 };
    }
    else {
        if (this.memory.lastPos.t > 1) { // stuck for 1 tick
            stuck = true;
        }
        if (this.fatigue == 0) {
            this.memory.lastPos.t += 1;
        }

    }
    return stuck;
}

Creep.prototype.isAtEdge = function () {
    let pos = this.pos;
    return pos.x == 0 || pos.y == 0 || pos.x == 49 || pos.y == 49;
}

Creep.prototype.generateBody = function (bodyDesign) {
    let body = [];
    for (const bodyType of bodyDesign) {
        body.push(...new Array(bodyType[1]).fill(bodyType[0]));
    }

    return body;
}

Creep.prototype.getBoosts = function () {
    if (this.spawning) return;
    const boostInfo = this.memory.boostInfo;
    const room = Game.rooms[this.memory.base];
    if (!room.memory.labs || !room.memory.labs.boostLab) return;
    const boostLabs = room.memory.labs.boostLab;
    for (const resourceType in boostInfo) {
        let amount = boostInfo[resourceType] * 30;
        let labId = _.find(Object.keys(boostLabs), labId => boostLabs[labId].resourceType === resourceType && boostLabs[labId].amount >= amount);
        let lab = Game.getObjectById(labId);
        if (!lab || !lab.isActive()) {
            this.memory.boost = false;
            return;
        }
    }
    for (const resourceType in boostInfo) {
        let lab = Game.getObjectById(_.find(Object.keys(boostLabs), labId => boostLabs[labId].resourceType === resourceType));
        if (!lab || !lab.isActive()) {
            this.memory.boost = false;
            return;
        }

        let result = boostCreep(lab, this, resourceType, boostInfo[resourceType]);

        if (result === ERR_NOT_IN_RANGE) this.moveTo(lab);
        else if (result === OK) {
            delete boostInfo[resourceType];
        }
        return;
    }

    console.log(4);

    this.memory.boosted = true;
}

Creep.prototype.fleeFrom = function(target) {
    let targetPos;
    if(!target) return false;
    if(!target.pos) targetPos = target;
    else targetPos = target.pos;


    this.say('flee');

    const xDis = this.pos.x - targetPos.x;
    const yDis = this.pos.y - targetPos.y;
    
    if(xDis > 0) {
        if(yDis > 0) {
            this.move(BOTTOM_RIGHT);
        }
        else if(yDis === 0) {
            this.move(RIGHT);
        }
        else {
            this.move(TOP_RIGHT);
        }
    }
    else if(xDis === 0) {
        if(yDis > 0) {
            this.move(BOTTOM);
        }
        else {
            this.move(TOP);
        }
    }
    else {
        if(yDis > 0) {
            this.move(BOTTOM_LEFT);
        }
        else if(yDis === 0) {
            this.move(RIGHT);
        }
        else {
            this.move(TOP_LEFT);
        }
    }

    return true;
}
return module.exports;
}
/********** End of module 45: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/creep.js **********/
/********** Start module 46: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/room.js **********/
__modules[46] = function(module, exports) {
const { roomInfo } = __require(47,46);

Room.prototype.addTransferTask = function (task) {
    if (!this.memory.tasks) this.memory.tasks = {};
    if (!this.memory.tasks.transferTask) this.memory.tasks.transferTask = [];
    this.memory.tasks.transferTask.push(task);
}

Room.prototype.getTransferTasks = function () {
    if (!this.memory.tasks) this.memory.tasks = {};
    if (!this.memory.tasks.transferTask) this.memory.tasks.transferTask = [];

    return this.memory.tasks.transferTask;
}

Room.prototype.addToBoostLab = function (boostInfo) {
    if (this.controller.level < 6) return;
    if (!this.memory.labs || !this.memory.labs.center) return;

    let boostLab = this.memory.labs.boostLab;
    if (!boostLab) this.memory.labs.boostLab = {};

    let addSet = {};
    for (const resourceType in boostInfo) {
        let totalResourceAmount = 0
        if (this.storage) totalResourceAmount += this.storage.store[resourceType];
        if (this.terminal) totalResourceAmount += this.terminal.store[resourceType];
        if (totalResourceAmount < boostInfo[resourceType] * 30) return;
        const resourceInfo = { resourceType: resourceType, amount: boostInfo[resourceType] * 30 };

        const boostLabId = _.find(Object.keys(boostLab), labId => boostLab[labId].resourceType === resourceType);
        let lab = Game.getObjectById(boostLabId);
        if (lab && lab.isActive()) {
            addSet[boostLabId] = resourceInfo;
        }
        else {
            avaliableLabs = this.find(FIND_MY_STRUCTURES, {
                filter: struct => (
                    struct.structureType === STRUCTURE_LAB &&
                    struct.isActive() &&
                    !this.memory.labs.center.includes(struct.id) &&
                    !this.memory.labs.boostLab[struct.id] &&
                    !addSet[struct.id]
                )
            });

            if (avaliableLabs.length) {
                addSet[avaliableLabs[0].id] = resourceInfo;
            }
            else return;
        }
    }
    for (const labId in addSet) {
        if (boostLab[labId]) boostLab[labId].amount += addSet[labId].amount;
        else boostLab[labId] = addSet[labId];
    }
}

Room.prototype.reduceFromBoostLab = function (labId, resourceType, amount) {
    if (!this.memory.labs || !this.memory.labs.boostLab) return false;

    const resourceInfo = this.memory.labs.boostLab[labId]
    if (!resourceInfo) return false;
    if (resourceInfo.resourceType !== resourceType) return false;

    if (resourceInfo.amount <= amount) delete this.memory.labs.boostLab[labId];
    else resourceInfo.amount -= amount;

    return true;
}
Room.prototype.getStorage = function (amount) {
    var storage = this.storage;
    if (!storage) {
        let containers = this.find(FIND_STRUCTURES, { filter: struct => 
            struct.structureType === STRUCTURE_CONTAINER &&
            struct.store.getFreeCapacity() >= amount
        });

        if (containers.length) {
            if (roomInfo[this.name] && roomInfo[this.name].storagePos) {
                storage = _.find(containers, con => con.pos.isEqualTo(roomInfo[this.name].storagePos));
            }

            if (!storage) {
                storage = _.find(containers, con => con.pos.inRangeTo(this.controller.pos, 3));
            }
        };
    }

    return storage;
}
return module.exports;
}
/********** End of module 46: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/prototypes/room.js **********/
/********** Start module 47: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/index.js **********/
__modules[47] = function(module, exports) {
const config = {
    roomInfo:               __require(56,47),
    roomResourceConfig:     __require(51,47),
    compondsRequirements:   __require(57,47),
}

module.exports = config;
return module.exports;
}
/********** End of module 47: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/index.js **********/
/********** Start module 48: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/index.js **********/
__modules[48] = function(module, exports) {
let structureLogic = {
    rampart:  __require(58,48),
    wall:     __require(59,48),
    lab:      __require(55,48),
}

module.exports = structureLogic;
return module.exports;
}
/********** End of module 48: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/index.js **********/
/********** Start module 49: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/index.js **********/
__modules[49] = function(module, exports) {
let constants = {
    reactionResources:  __require(60,49),
    creepRoles:         __require(61,49),
    boostName:          __require(52,49),
    commodities:        __require(62,49),
    roomTypes:          __require(63,49),
}

module.exports = constants;
return module.exports;
}
/********** End of module 49: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/index.js **********/
/********** Start module 50: /Users/piece/Desktop/Me/screeps/AlexBot_Js/node_modules/lodash/index.js **********/
__modules[50] = function(module, exports) {
/**
 * @license
 * lodash 3.10.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern -d -o ./index.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.10.1';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256;

  /** Used as default options for `_.trunc`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect when a function becomes hot. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml = /[&<>"'`]/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

  /**
   * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
   * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
   */
  var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  /** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */
  var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect hexadecimal string values. */
  var reHasHexPrefix = /^0[xX]/;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^\d+$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to match words to create compound words. */
  var reWords = (function() {
    var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
        lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

    return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
  }());

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number',
    'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'isFinite',
    'parseFloat', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled regexes. */
  var regexpEscapes = {
    '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
    '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
    'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
    'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
    'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function baseCompareAscending(value, other) {
    if (value !== other) {
      var valIsNull = value === null,
          valIsUndef = value === undefined,
          valIsReflexive = value === value;

      var othIsNull = other === null,
          othIsUndef = other === undefined,
          othIsReflexive = other === other;

      if ((value > other && !othIsNull) || !valIsReflexive ||
          (valIsNull && !othIsUndef && othIsReflexive) ||
          (valIsUndef && othIsReflexive)) {
        return 1;
      }
      if ((value < other && !valIsNull) || !othIsReflexive ||
          (othIsNull && !valIsUndef && valIsReflexive) ||
          (othIsUndef && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isFunction` without support for environments
   * with incorrect `typeof` results.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   */
  function baseIsFunction(value) {
    return typeof value == 'function' || false;
  }

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the first character not found in `chars`.
   */
  function charsLeftIndex(string, chars) {
    var index = -1,
        length = string.length;

    while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the last character not found in `chars`.
   */
  function charsRightIndex(string, chars) {
    var index = string.length;

    while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareAscending(object, other) {
    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
  }

  /**
   * Used by `_.sortByOrder` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all valuess are sorted in ascending order. Otherwise,
   * a value is sorted in ascending order if its corresponding order is "asc", and
   * descending if "desc".
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultiple(object, other, orders) {
    var index = -1,
        objCriteria = object.criteria,
        othCriteria = other.criteria,
        length = objCriteria.length,
        ordersLength = orders.length;

    while (++index < length) {
      var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * ((order === 'asc' || order === true) ? 1 : -1);
      }
    }
    return object.index - other.index;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @param {string} leadingChar The capture group for a leading character.
   * @param {string} whitespaceChar The capture group for a whitespace character.
   * @returns {string} Returns the escaped character.
   */
  function escapeRegExpChar(chr, leadingChar, whitespaceChar) {
    if (leadingChar) {
      chr = regexpEscapes[chr];
    } else if (whitespaceChar) {
      chr = stringEscapes[chr];
    }
    return '\\' + chr;
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
   * character code is whitespace.
   *
   * @private
   * @param {number} charCode The character code to inspect.
   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
   */
  function isSpace(charCode) {
    return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 ||
      (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      if (array[index] === placeholder) {
        array[index] = PLACEHOLDER;
        result[++resIndex] = index;
      }
    }
    return result;
  }

  /**
   * An implementation of `_.uniq` optimized for sorted arrays without support
   * for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate-value-free array.
   */
  function sortedUniq(array, iteratee) {
    var seen,
        index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value, index, array) : value;

      if (!index || seen !== computed) {
        seen = computed;
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */
  function trimmedLeftIndex(string) {
    var index = -1,
        length = string.length;

    while (++index < length && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedRightIndex(string) {
    var index = string.length;

    while (index-- && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the given `context` object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // using `context` to mock `Date#getTime` use in `_.now`
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // or creating a suped-up `defer` in Node.js
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext(context) {
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for native method references. */
    var arrayProto = Array.prototype,
        objectProto = Object.prototype,
        stringProto = String.prototype;

    /** Used to resolve the decompiled source of functions. */
    var fnToString = Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Native method references. */
    var ArrayBuffer = context.ArrayBuffer,
        clearTimeout = context.clearTimeout,
        parseFloat = context.parseFloat,
        pow = Math.pow,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        Set = getNative(context, 'Set'),
        setTimeout = context.setTimeout,
        splice = arrayProto.splice,
        Uint8Array = context.Uint8Array,
        WeakMap = getNative(context, 'WeakMap');

    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeCreate = getNative(Object, 'create'),
        nativeFloor = Math.floor,
        nativeIsArray = getNative(Array, 'isArray'),
        nativeIsFinite = context.isFinite,
        nativeKeys = getNative(Object, 'keys'),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = getNative(Date, 'now'),
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used as references for `-Infinity` and `Infinity`. */
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
        POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

    /** Used as references for the maximum length and index of an array. */
    var MAX_ARRAY_LENGTH = 4294967295,
        MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

    /**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit chaining.
     * Methods that operate on and return arrays, collections, and functions can
     * be chained together. Methods that retrieve a single value or may return a
     * primitive value will automatically end the chain returning the unwrapped
     * value. Explicit chaining may be enabled using `_.chain`. The execution of
     * chained methods is lazy, that is, execution is deferred until `_#value`
     * is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization strategy which merge iteratee calls; this can help
     * to avoid the creation of intermediate data structures and greatly reduce the
     * number of iteratee executions.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
     * `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
     * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
     * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
     * and `where`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
     * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
     * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
     * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
     * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
     * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
     * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
     * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
     * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
     * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
     * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
     * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
     * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
     * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
     * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
     * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
     * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
     * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
     * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
     * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
     * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
     * `unescape`, `uniqueId`, `value`, and `words`
     *
     * The wrapper method `sample` will return a wrapped value when `n` is provided,
     * otherwise an unwrapped value is returned.
     *
     * @name _
     * @constructor
     * @category Chain
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(total, n) {
     *   return total + n;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(n) {
     *   return n * n;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
     */
    function LodashWrapper(value, chainAll, actions) {
      this.__wrapped__ = value;
      this.__actions__ = actions || [];
      this.__chain__ = !!chainAll;
    }

    /**
     * An object environment feature flags.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = POSITIVE_INFINITY;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = arrayCopy(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = arrayCopy(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = arrayCopy(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || arrLength < LARGE_ARRAY_SIZE || (arrLength == length && takeCount == length)) {
        return baseWrapperValue((isRight && isArr) ? array.reverse() : array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a cache object to store key/value pairs.
     *
     * @private
     * @static
     * @name Cache
     * @memberOf _.memoize
     */
    function MapCache() {
      this.__data__ = {};
    }

    /**
     * Removes `key` and its value from the cache.
     *
     * @private
     * @name delete
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
     */
    function mapDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the cached value for `key`.
     *
     * @private
     * @name get
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the cached value.
     */
    function mapGet(key) {
      return key == '__proto__' ? undefined : this.__data__[key];
    }

    /**
     * Checks if a cached value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapHas(key) {
      return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
    }

    /**
     * Sets `value` to `key` of the cache.
     *
     * @private
     * @name set
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to cache.
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache object.
     */
    function mapSet(key, value) {
      if (key != '__proto__') {
        this.__data__[key] = value;
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates a cache object to store unique values.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var length = values ? values.length : 0;

      this.data = { 'hash': nativeCreate(null), 'set': new Set };
      while (length--) {
        this.push(values[length]);
      }
    }

    /**
     * Checks if `value` is in `cache` mimicking the return signature of
     * `_.indexOf` by returning `0` if the value is found, else `-1`.
     *
     * @private
     * @param {Object} cache The cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `0` if `value` is found, else `-1`.
     */
    function cacheIndexOf(cache, value) {
      var data = cache.data,
          result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

      return result ? 0 : -1;
    }

    /**
     * Adds `value` to the cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush(value) {
      var data = this.data;
      if (typeof value == 'string' || isObject(value)) {
        data.set.add(value);
      } else {
        data.hash[value] = true;
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a new array joining `array` with `other`.
     *
     * @private
     * @param {Array} array The array to join.
     * @param {Array} other The other array to join.
     * @returns {Array} Returns the new concatenated array.
     */
    function arrayConcat(array, other) {
      var index = -1,
          length = array.length,
          othIndex = -1,
          othLength = other.length,
          result = Array(length + othLength);

      while (++index < length) {
        result[index] = array[index];
      }
      while (++othIndex < othLength) {
        result[index++] = other[othIndex];
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function arrayCopy(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.forEachRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEachRight(array, iteratee) {
      var length = array.length;

      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.every` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */
    function arrayEvery(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseExtremum` for arrays which invokes `iteratee`
     * with one argument: (value).
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function arrayExtremum(array, iteratee, comparator, exValue) {
      var index = -1,
          length = array.length,
          computed = exValue,
          result = computed;

      while (++index < length) {
        var value = array[index],
            current = +iteratee(value);

        if (comparator(current, computed)) {
          computed = current;
          result = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.filter` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.map` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the first element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initFromArray) {
      var index = -1,
          length = array.length;

      if (initFromArray && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.reduceRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the last element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
      var length = array.length;
      if (initFromArray && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.some` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * A specialized version of `_.sum` for arrays without support for callback
     * shorthands and `this` binding..
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function arraySum(array, iteratee) {
      var length = array.length,
          result = 0;

      while (length--) {
        result += +iteratee(array[length]) || 0;
      }
      return result;
    }

    /**
     * Used by `_.defaults` to customize its `_.assign` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : objectValue;
    }

    /**
     * Used by `_.template` to customize its `_.assign` use.
     *
     * **Note:** This function is like `assignDefaults` except that it ignores
     * inherited property values when checking if a property is `undefined`.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @param {string} key The key associated with the object and source values.
     * @param {Object} object The destination object.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignOwnDefaults(objectValue, sourceValue, key, object) {
      return (objectValue === undefined || !hasOwnProperty.call(object, key))
        ? sourceValue
        : objectValue;
    }

    /**
     * A specialized version of `_.assign` for customizing assigned values without
     * support for argument juggling, multiple sources, and `this` binding `customizer`
     * functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     */
    function assignWith(object, source, customizer) {
      var index = -1,
          props = keys(source),
          length = props.length;

      while (++index < length) {
        var key = props[index],
            value = object[key],
            result = customizer(value, source[key], key, object, source);

        if ((result === result ? (result !== value) : (value === value)) ||
            (value === undefined && !(key in object))) {
          object[key] = result;
        }
      }
      return object;
    }

    /**
     * The base implementation of `_.assign` without support for argument juggling,
     * multiple sources, and `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return source == null
        ? object
        : baseCopy(source, keys(source), object);
    }

    /**
     * The base implementation of `_.at` without support for string collections
     * and individual key arguments.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {number[]|string[]} props The property names or indexes of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    function baseAt(collection, props) {
      var index = -1,
          isNil = collection == null,
          isArr = !isNil && isArrayLike(collection),
          length = isArr ? collection.length : 0,
          propsLength = props.length,
          result = Array(propsLength);

      while(++index < propsLength) {
        var key = props[index];
        if (isArr) {
          result[index] = isIndex(key, length) ? collection[key] : undefined;
        } else {
          result[index] = isNil ? undefined : collection[key];
        }
      }
      return result;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */
    function baseCopy(source, props, object) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];
        object[key] = source[key];
      }
      return object;
    }

    /**
     * The base implementation of `_.callback` which supports specifying the
     * number of arguments to provide to `func`.
     *
     * @private
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function baseCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (type == 'function') {
        return thisArg === undefined
          ? func
          : bindCallback(func, thisArg, argCount);
      }
      if (func == null) {
        return identity;
      }
      if (type == 'object') {
        return baseMatches(func);
      }
      return thisArg === undefined
        ? property(func)
        : baseMatchesProperty(func, thisArg);
    }

    /**
     * The base implementation of `_.clone` without support for argument juggling
     * and `this` binding `customizer` functions.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The object `value` belongs to.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return arrayCopy(value, result);
        }
      } else {
        var tag = objToString.call(value),
            isFunc = tag == funcTag;

        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return baseAssign(result, value);
          }
        } else {
          return cloneableTags[tag]
            ? initCloneByTag(value, tag, isDeep)
            : (object ? value : {});
        }
      }
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == value) {
          return stackB[length];
        }
      }
      stackA.push(value);
      stackB.push(result);
      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
        result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
      });
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          object.prototype = prototype;
          var result = new object;
          object.prototype = undefined;
        }
        return result || {};
      };
    }());

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an index
     * of where to slice the arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of `_.difference` which accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values) {
      var length = array ? array.length : 0,
          result = [];

      if (!length) {
        return result;
      }
      var index = -1,
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
          valuesLength = values.length;

      if (cache) {
        indexOf = cacheIndexOf;
        isCommon = false;
        values = cache;
      }
      outer:
      while (++index < length) {
        var value = array[index];

        if (isCommon && value === value) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === value) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (indexOf(values, value, 0) < 0) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * Gets the extremum value of `collection` invoking `iteratee` for each value
     * in `collection` to generate the criterion by which the value is ranked.
     * The `iteratee` is invoked with three arguments: (value, index|key, collection).
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(collection, iteratee, comparator, exValue) {
      var computed = exValue,
          result = computed;

      baseEach(collection, function(value, index, collection) {
        var current = +iteratee(value, index, collection);
        if (comparator(current, computed) || (current === exValue && current === result)) {
          computed = current;
          result = value;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : (end >>> 0);
      start >>>= 0;

      while (start < length) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
     * without support for callback shorthands and `this` binding, which iterates
     * over `collection` using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @param {boolean} [retKey] Specify returning the key of the found element
     *  instead of the element itself.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */
    function baseFind(collection, predicate, eachFunc, retKey) {
      var result;
      eachFunc(collection, function(value, key, collection) {
        if (predicate(value, key, collection)) {
          result = retKey ? key : value;
          return false;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with added support for restricting
     * flattening and specifying the start index.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, isDeep, isStrict, result) {
      result || (result = []);

      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index];
        if (isObjectLike(value) && isArrayLike(value) &&
            (isStrict || isArray(value) || isArguments(value))) {
          if (isDeep) {
            baseFlatten(value, isDeep, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forIn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, iteratee) {
      return baseFor(object, iteratee, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from those provided.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */
    function baseFunctions(object, props) {
      var index = -1,
          length = props.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var key = props[index];
        if (isFunction(object[key])) {
          result[++resIndex] = key;
        }
      }
      return result;
    }

    /**
     * The base implementation of `get` without support for string paths
     * and default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path of the property to get.
     * @param {string} [pathKey] The key representation of path.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path, pathKey) {
      if (object == null) {
        return;
      }
      if (pathKey !== undefined && pathKey in toObject(object)) {
        path = [pathKey];
      }
      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[path[index++]];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.isEqual` without support for `this` binding
     * `customizer` functions.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = arrayTag,
          othTag = arrayTag;

      if (!objIsArr) {
        objTag = objToString.call(object);
        if (objTag == argsTag) {
          objTag = objectTag;
        } else if (objTag != objectTag) {
          objIsArr = isTypedArray(object);
        }
      }
      if (!othIsArr) {
        othTag = objToString.call(other);
        if (othTag == argsTag) {
          othTag = objectTag;
        } else if (othTag != objectTag) {
          othIsArr = isTypedArray(other);
        }
      }
      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && !(objIsArr || objIsObj)) {
        return equalByTag(object, other, objTag);
      }
      if (!isLoose) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == object) {
          return stackB[length] == other;
        }
      }
      stackA.push(object);
      stackB.push(other);

      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

      stackA.pop();
      stackB.pop();

      return result;
    }

    /**
     * The base implementation of `_.isMatch` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} matchData The propery names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = toObject(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var result = customizer ? customizer(objValue, srcValue, key) : undefined;
          if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.map` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which does not clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        var key = matchData[0][0],
            value = matchData[0][1];

        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === value && (value !== undefined || (key in toObject(object)));
        };
      }
      return function(object) {
        return baseIsMatch(object, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to compare.
     * @returns {Function} Returns the new function.
     */
    function baseMatchesProperty(path, srcValue) {
      var isArr = isArray(path),
          isCommon = isKey(path) && isStrictComparable(srcValue),
          pathKey = (path + '');

      path = toPath(path);
      return function(object) {
        if (object == null) {
          return false;
        }
        var key = pathKey;
        object = toObject(object);
        if ((isArr || !isCommon) && !(key in object)) {
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          if (object == null) {
            return false;
          }
          key = last(path);
          object = toObject(object);
        }
        return object[key] === srcValue
          ? (srcValue !== undefined || (key in object))
          : baseIsEqual(srcValue, object[key], undefined, true);
      };
    }

    /**
     * The base implementation of `_.merge` without support for argument juggling,
     * multiple sources, and `this` binding `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {Object} Returns `object`.
     */
    function baseMerge(object, source, customizer, stackA, stackB) {
      if (!isObject(object)) {
        return object;
      }
      var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
          props = isSrcArr ? undefined : keys(source);

      arrayEach(props || source, function(srcValue, key) {
        if (props) {
          key = srcValue;
          srcValue = source[key];
        }
        if (isObjectLike(srcValue)) {
          stackA || (stackA = []);
          stackB || (stackB = []);
          baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
        }
        else {
          var value = object[key],
              result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
              isCommon = result === undefined;

          if (isCommon) {
            result = srcValue;
          }
          if ((result !== undefined || (isSrcArr && !(key in object))) &&
              (isCommon || (result === result ? (result !== value) : (value === value)))) {
            object[key] = result;
          }
        }
      });
      return object;
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
      var length = stackA.length,
          srcValue = source[key];

      while (length--) {
        if (stackA[length] == srcValue) {
          object[key] = stackB[length];
          return;
        }
      }
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = result === undefined;

      if (isCommon) {
        result = srcValue;
        if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
          result = isArray(value)
            ? value
            : (isArrayLike(value) ? arrayCopy(value) : []);
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          result = isArguments(value)
            ? toPlainObject(value)
            : (isPlainObject(value) ? value : {});
        }
        else {
          isCommon = false;
        }
      }
      stackA.push(srcValue);
      stackB.push(result);

      if (isCommon) {
        object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
      } else if (result === result ? (result !== value) : (value === value)) {
        object[key] = result;
      }
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */
    function basePropertyDeep(path) {
      var pathKey = (path + '');
      path = toPath(path);
      return function(object) {
        return baseGet(object, path, pathKey);
      };
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * index arguments and capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0;
      while (length--) {
        var index = indexes[length];
        if (index != previous && isIndex(index)) {
          var previous = index;
          splice.call(array, index, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for argument juggling
     * and returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */
    function baseRandom(min, max) {
      return min + nativeFloor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.reduce` and `_.reduceRight` without support
     * for callback shorthands and `this` binding, which iterates over `collection`
     * using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initFromCollection Specify using the first or last element
     *  of `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */
    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
      eachFunc(collection, function(value, index, collection) {
        accumulator = initFromCollection
          ? (initFromCollection = false, value)
          : iteratee(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define
     * the sort order of `array` and replaces criteria objects with their
     * corresponding values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */
    function baseSortBy(array, comparer) {
      var length = array.length;

      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }

    /**
     * The base implementation of `_.sortByOrder` without param guards.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseSortByOrder(collection, iteratees, orders) {
      var callback = getCallback(),
          index = -1;

      iteratees = arrayMap(iteratees, function(iteratee) { return callback(iteratee); });

      var result = baseMap(collection, function(value) {
        var criteria = arrayMap(iteratees, function(iteratee) { return iteratee(value); });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.sum` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function baseSum(collection, iteratee) {
      var result = 0;
      baseEach(collection, function(value, index, collection) {
        result += +iteratee(value, index, collection) || 0;
      });
      return result;
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */
    function baseUniq(array, iteratee) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array.length,
          isCommon = indexOf == baseIndexOf,
          isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
          seen = isLarge ? createCache() : null,
          result = [];

      if (seen) {
        indexOf = cacheIndexOf;
        isCommon = false;
      } else {
        isLarge = false;
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value, index, array) : value;

        if (isCommon && value === value) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (indexOf(seen, computed, 0) < 0) {
          if (iteratee || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * of `props`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the array of property values.
     */
    function baseValues(object, props) {
      var index = -1,
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /**
     * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
     * and `_.takeWhile` without support for callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to peform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      var index = -1,
          length = actions.length;

      while (++index < length) {
        var action = actions[index];
        result = action.func.apply(action.thisArg, arrayPush([result], action.args));
      }
      return result;
    }

    /**
     * Performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndex(array, value, retHighest) {
      var low = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return binaryIndexBy(array, value, identity, retHighest);
    }

    /**
     * This function is like `binaryIndex` except that it invokes `iteratee` for
     * `value` and each element of `array` to compute their sort ranking. The
     * iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array ? array.length : 0,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsUndef = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            isDef = computed !== undefined,
            isReflexive = computed === computed;

        if (valIsNaN) {
          var setLow = isReflexive || retHighest;
        } else if (valIsNull) {
          setLow = isReflexive && isDef && (retHighest || computed != null);
        } else if (valIsUndef) {
          setLow = isReflexive && (retHighest || isDef);
        } else if (computed == null) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * A specialized version of `baseCallback` which only supports `this` binding
     * and specifying the number of arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function bindCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      if (thisArg === undefined) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
        case 5: return function(value, other, key, object, source) {
          return func.call(thisArg, value, other, key, object, source);
        };
      }
      return function() {
        return func.apply(thisArg, arguments);
      };
    }

    /**
     * Creates a clone of the given array buffer.
     *
     * @private
     * @param {ArrayBuffer} buffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function bufferClone(buffer) {
      var result = new ArrayBuffer(buffer.byteLength),
          view = new Uint8Array(result);

      view.set(new Uint8Array(buffer));
      return result;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders) {
      var holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          leftIndex = -1,
          leftLength = partials.length,
          result = Array(leftLength + argsLength);

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
      while (argsLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders) {
      var holdersIndex = -1,
          holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          rightIndex = -1,
          rightLength = partials.length,
          result = Array(argsLength + rightLength);

      while (++argsIndex < argsLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        result[offset + holders[holdersIndex]] = args[argsIndex++];
      }
      return result;
    }

    /**
     * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
     *
     * @private
     * @param {Function} setter The function to set keys and values of the accumulator object.
     * @param {Function} [initializer] The function to initialize the accumulator object.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee, thisArg) {
        var result = initializer ? initializer() : {};
        iteratee = getCallback(iteratee, thisArg, 3);

        if (isArray(collection)) {
          var index = -1,
              length = collection.length;

          while (++index < length) {
            var value = collection[index];
            setter(result, value, iteratee(value, index, collection), collection);
          }
        } else {
          baseEach(collection, function(value, key, collection) {
            setter(result, value, iteratee(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return restParam(function(object, sources) {
        var index = -1,
            length = object == null ? 0 : sources.length,
            customizer = length > 2 ? sources[length - 2] : undefined,
            guard = length > 2 ? sources[2] : undefined,
            thisArg = length > 1 ? sources[length - 1] : undefined;

        if (typeof customizer == 'function') {
          customizer = bindCallback(customizer, thisArg, 5);
          length -= 2;
        } else {
          customizer = typeof thisArg == 'function' ? thisArg : undefined;
          length -= (customizer ? 1 : 0);
        }
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        var length = collection ? getLength(collection) : 0;
        if (!isLength(length)) {
          return eachFunc(collection, iteratee);
        }
        var index = fromRight ? length : -1,
            iterable = toObject(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var iterable = toObject(object),
            props = keysFunc(object),
            length = props.length,
            index = fromRight ? length : -1;

        while ((fromRight ? index-- : ++index < length)) {
          var key = props[index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with the `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new bound function.
     */
    function createBindWrapper(func, thisArg) {
      var Ctor = createCtorWrapper(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(thisArg, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a `Set` cache object to optimize linear searches of large arrays.
     *
     * @private
     * @param {Array} [values] The values to cache.
     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
     */
    function createCache(values) {
      return (nativeCreate && Set) ? new SetCache(values) : null;
    }

    /**
     * Creates a function that produces compound words out of the words in a
     * given string.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        var index = -1,
            array = words(deburr(string)),
            length = array.length,
            result = '';

        while (++index < length) {
          result = callback(result, array[index], index);
        }
        return result;
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper(Ctor) {
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a `_.curry` or `_.curryRight` function.
     *
     * @private
     * @param {boolean} flag The curry bit flag.
     * @returns {Function} Returns the new curry function.
     */
    function createCurry(flag) {
      function curryFunc(func, arity, guard) {
        if (guard && isIterateeCall(func, arity, guard)) {
          arity = undefined;
        }
        var result = createWrapper(func, flag, undefined, undefined, undefined, undefined, undefined, arity);
        result.placeholder = curryFunc.placeholder;
        return result;
      }
      return curryFunc;
    }

    /**
     * Creates a `_.defaults` or `_.defaultsDeep` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Function} Returns the new defaults function.
     */
    function createDefaults(assigner, customizer) {
      return restParam(function(args) {
        var object = args[0];
        if (object == null) {
          return object;
        }
        args.push(customizer);
        return assigner.apply(undefined, args);
      });
    }

    /**
     * Creates a `_.max` or `_.min` function.
     *
     * @private
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {Function} Returns the new extremum function.
     */
    function createExtremum(comparator, exValue) {
      return function(collection, iteratee, thisArg) {
        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
          iteratee = undefined;
        }
        iteratee = getCallback(iteratee, thisArg, 3);
        if (iteratee.length == 1) {
          collection = isArray(collection) ? collection : toIterable(collection);
          var result = arrayExtremum(collection, iteratee, comparator, exValue);
          if (!(collection.length && result === exValue)) {
            return result;
          }
        }
        return baseExtremum(collection, iteratee, comparator, exValue);
      };
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFind(eachFunc, fromRight) {
      return function(collection, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        if (isArray(collection)) {
          var index = baseFindIndex(collection, predicate, fromRight);
          return index > -1 ? collection[index] : undefined;
        }
        return baseFind(collection, predicate, eachFunc);
      };
    }

    /**
     * Creates a `_.findIndex` or `_.findLastIndex` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFindIndex(fromRight) {
      return function(array, predicate, thisArg) {
        if (!(array && array.length)) {
          return -1;
        }
        predicate = getCallback(predicate, thisArg, 3);
        return baseFindIndex(array, predicate, fromRight);
      };
    }

    /**
     * Creates a `_.findKey` or `_.findLastKey` function.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new find function.
     */
    function createFindKey(objectFunc) {
      return function(object, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        return baseFind(object, predicate, objectFunc, true);
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return function() {
        var wrapper,
            length = arguments.length,
            index = fromRight ? length : -1,
            leftIndex = 0,
            funcs = Array(length);

        while ((fromRight ? index-- : ++index < length)) {
          var func = funcs[leftIndex++] = arguments[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (!wrapper && LodashWrapper.prototype.thru && getFuncName(func) == 'wrapper') {
            wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? -1 : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      };
    }

    /**
     * Creates a function for `_.forEach` or `_.forEachRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createForEach(arrayFunc, eachFunc) {
      return function(collection, iteratee, thisArg) {
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee)
          : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
      };
    }

    /**
     * Creates a function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForIn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee, keysIn);
      };
    }

    /**
     * Creates a function for `_.forOwn` or `_.forOwnRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForOwn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee);
      };
    }

    /**
     * Creates a function for `_.mapKeys` or `_.mapValues`.
     *
     * @private
     * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
     * @returns {Function} Returns the new map function.
     */
    function createObjectMapper(isMapKeys) {
      return function(object, iteratee, thisArg) {
        var result = {};
        iteratee = getCallback(iteratee, thisArg, 3);

        baseForOwn(object, function(value, key, object) {
          var mapped = iteratee(value, key, object);
          key = isMapKeys ? mapped : key;
          value = isMapKeys ? value : mapped;
          result[key] = value;
        });
        return result;
      };
    }

    /**
     * Creates a function for `_.padLeft` or `_.padRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify padding from the right.
     * @returns {Function} Returns the new pad function.
     */
    function createPadDir(fromRight) {
      return function(string, length, chars) {
        string = baseToString(string);
        return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
      };
    }

    /**
     * Creates a `_.partial` or `_.partialRight` function.
     *
     * @private
     * @param {boolean} flag The partial bit flag.
     * @returns {Function} Returns the new partial function.
     */
    function createPartial(flag) {
      var partialFunc = restParam(function(func, partials) {
        var holders = replaceHolders(partials, partialFunc.placeholder);
        return createWrapper(func, flag, undefined, partials, holders);
      });
      return partialFunc;
    }

    /**
     * Creates a function for `_.reduce` or `_.reduceRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createReduce(arrayFunc, eachFunc) {
      return function(collection, iteratee, accumulator, thisArg) {
        var initFromArray = arguments.length < 3;
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee, accumulator, initFromArray)
          : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with optional `this`
     * binding of, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & ARY_FLAG,
          isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurry = bitmask & CURRY_FLAG,
          isCurryBound = bitmask & CURRY_BOUND_FLAG,
          isCurryRight = bitmask & CURRY_RIGHT_FLAG,
          Ctor = isBindKey ? undefined : createCtorWrapper(func);

      function wrapper() {
        var length = arguments.length,
            index = length,
            args = Array(length);

        while (index--) {
          args[index] = arguments[index];
        }
        if (partials) {
          args = composeArgs(args, partials, holders);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight);
        }
        if (isCurry || isCurryRight) {
          var placeholder = wrapper.placeholder,
              argsHolders = replaceHolders(args, placeholder);

          length -= argsHolders.length;
          if (length < arity) {
            var newArgPos = argPos ? arrayCopy(argPos) : undefined,
                newArity = nativeMax(arity - length, 0),
                newsHolders = isCurry ? argsHolders : undefined,
                newHoldersRight = isCurry ? undefined : argsHolders,
                newPartials = isCurry ? args : undefined,
                newPartialsRight = isCurry ? undefined : args;

            bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
            bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

            if (!isCurryBound) {
              bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
            }
            var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
                result = createHybridWrapper.apply(undefined, newData);

            if (isLaziable(func)) {
              setData(result, newData);
            }
            result.placeholder = placeholder;
            return result;
          }
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        if (argPos) {
          args = reorder(args, argPos);
        }
        if (isAry && ary < args.length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtorWrapper(func);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates the padding required for `string` based on the given `length`.
     * The `chars` string is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the pad for `string`.
     */
    function createPadding(string, length, chars) {
      var strLength = string.length;
      length = +length;

      if (strLength >= length || !nativeIsFinite(length)) {
        return '';
      }
      var padLength = length - strLength;
      chars = chars == null ? ' ' : (chars + '');
      return repeat(chars, nativeCeil(padLength / chars.length)).slice(0, padLength);
    }

    /**
     * Creates a function that wraps `func` and invokes it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to partially apply arguments to.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new bound function.
     */
    function createPartialWrapper(func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength);

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.ceil`, `_.floor`, or `_.round` function.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        precision = precision === undefined ? 0 : (+precision || 0);
        if (precision) {
          precision = pow(10, precision);
          return func(number * precision) / precision;
        }
        return func(number);
      };
    }

    /**
     * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
     *
     * @private
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {Function} Returns the new index function.
     */
    function createSortedIndex(retHighest) {
      return function(array, value, iteratee, thisArg) {
        var callback = getCallback(iteratee);
        return (iteratee == null && callback === baseCallback)
          ? binaryIndex(array, value, retHighest)
          : binaryIndexBy(array, value, callback(iteratee, thisArg, 1), retHighest);
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      length -= (holders ? holders.length : 0);
      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func),
          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

      if (data) {
        mergeData(newData, data);
        bitmask = newData[1];
        arity = newData[9];
      }
      newData[9] = arity == null
        ? (isBindKey ? 0 : func.length)
        : (nativeMax(arity - length, 0) || 0);

      if (bitmask == BIND_FLAG) {
        var result = createBindWrapper(newData[0], newData[2]);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
        result = createPartialWrapper.apply(undefined, newData);
      } else {
        result = createHybridWrapper.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing arrays.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var index = -1,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
        return false;
      }
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index],
            result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

        if (result !== undefined) {
          if (result) {
            continue;
          }
          return false;
        }
        if (isLoose) {
          if (!arraySome(other, function(othValue) {
                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
              })) {
            return false;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag) {
      switch (tag) {
        case boolTag:
        case dateTag:
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          return (object != +object)
            ? other != +other
            : object == +other;

        case regexpTag:
        case stringTag:
          return object == (other + '');
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objProps = keys(object),
          objLength = objProps.length,
          othProps = keys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isLoose) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var skipCtor = isLoose;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key],
            result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;
        if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
          return false;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (!skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Gets the appropriate "callback" function. If the `_.callback` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseCallback` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function} Returns the chosen function or its result.
     */
    function getCallback(func, thisArg, argCount) {
      var result = lodash.callback || callback;
      result = result === callback ? baseCallback : result;
      return argCount ? result(func, thisArg, argCount) : result;
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = func.name,
          array = realNames[result],
          length = array ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseIndexOf` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function|number} Returns the chosen function or its result.
     */
    function getIndexOf(collection, target, fromIndex) {
      var result = lodash.indexOf || indexOf;
      result = result === indexOf ? baseIndexOf : result;
      return collection ? result(collection, target, fromIndex) : result;
    }

    /**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    /**
     * Gets the propery names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = pairs(object),
          length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = object == null ? undefined : object[key];
      return isNative(value) ? value : undefined;
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      var Ctor = object.constructor;
      if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
        Ctor = Object;
      }
      return new Ctor;
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return bufferClone(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          var buffer = object.buffer;
          return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          var result = new Ctor(object.source, reFlags.exec(object));
          result.lastIndex = object.lastIndex;
      }
      return result;
    }

    /**
     * Invokes the method at `path` on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function invokePath(object, path, args) {
      if (object != null && !isKey(path, object)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        path = last(path);
      }
      var func = object == null ? object : object[path];
      return func == null ? undefined : func.apply(object, args);
    }

    /**
     * Checks if `value` is array-like.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     */
    function isArrayLike(value) {
      return value != null && isLength(getLength(value));
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return value > -1 && value % 1 == 0 && value < length;
    }

    /**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        var other = object[index];
        return value === value ? (value === other) : (other !== other);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      var type = typeof value;
      if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
        return true;
      }
      if (isArray(value)) {
        return false;
      }
      var result = !reIsDeepProp.test(value);
      return result || (object != null && value in toObject(object));
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func);
      if (!(funcName in LazyWrapper.prototype)) {
        return false;
      }
      var other = lodash[funcName];
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     */
    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers required to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * augment function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * common case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < ARY_FLAG;

      var isCombo =
        (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
        (srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8]) ||
        (srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG);
      if (!(isCommon || isCombo)) {
        return data;
      }
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
      }
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
      }
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
      }
      value = source[7];
      if (value) {
        data[7] = arrayCopy(value);
      }
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      if (data[9] == null) {
        data[9] = source[9];
      }
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function mergeDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults);
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties specified
     * by `props`.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */
    function pickByArray(object, props) {
      object = toObject(object);

      var index = -1,
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        if (key in object) {
          result[key] = object[key];
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties `predicate`
     * returns truthy for.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Object} Returns the new object.
     */
    function pickByCallback(object, predicate) {
      var result = {};
      baseForIn(object, function(value, key, object) {
        if (predicate(value, key, object)) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = arrayCopy(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function() {
      var count = 0,
          lastCalled = 0;

      return function(key, value) {
        var stamp = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function shimKeys(object) {
      var props = keysIn(object),
          propsLength = props.length,
          length = propsLength && object.length;

      var allowIndexes = !!length && isLength(length) &&
        (isArray(object) || isArguments(object));

      var index = -1,
          result = [];

      while (++index < propsLength) {
        var key = props[index];
        if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to an array-like object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array|Object} Returns the array-like object.
     */
    function toIterable(value) {
      if (value == null) {
        return [];
      }
      if (!isArrayLike(value)) {
        return values(value);
      }
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to an object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Object} Returns the object.
     */
    function toObject(value) {
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to property path array if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the property path array.
     */
    function toPath(value) {
      if (isArray(value)) {
        return value;
      }
      var result = [];
      baseToString(value).replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      return wrapper instanceof LazyWrapper
        ? wrapper.clone()
        : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `collection` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if (guard ? isIterateeCall(array, size, guard) : size == null) {
        size = 1;
      } else {
        size = nativeMax(nativeFloor(size) || 1, 1);
      }
      var index = 0,
          length = array ? array.length : 0,
          resIndex = -1,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[++resIndex] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * Creates an array of unique `array` values not included in the other
     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3], [4, 2]);
     * // => [1, 3]
     */
    var difference = restParam(function(array, values) {
      return (isObjectLike(array) && isArrayLike(array))
        ? baseDifference(array, baseFlatten(values, false, true))
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that match the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [1]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
     * // => ['barney']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropWhile(users, 'active', false), 'user');
     * // => ['pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8], '*', 1, 2);
     * // => [4, '*', 8]
     */
    function fill(array, value, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(chr) {
     *   return chr.user == 'barney';
     * });
     * // => 0
     *
     * // using the `_.matches` callback shorthand
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findIndex(users, 'active', false);
     * // => 0
     *
     * // using the `_.property` callback shorthand
     * _.findIndex(users, 'active');
     * // => 2
     */
    var findIndex = createFindIndex();

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(chr) {
     *   return chr.user == 'pebbles';
     * });
     * // => 2
     *
     * // using the `_.matches` callback shorthand
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastIndex(users, 'active', false);
     * // => 2
     *
     * // using the `_.property` callback shorthand
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    var findLastIndex = createFindIndex(true);

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias head
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([]);
     * // => undefined
     */
    function first(array) {
      return array ? array[0] : undefined;
    }

    /**
     * Flattens a nested array. If `isDeep` is `true` the array is recursively
     * flattened, otherwise it is only flattened a single level.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, 3, [4]]]);
     * // => [1, 2, 3, [4]]
     *
     * // using `isDeep`
     * _.flatten([1, [2, 3, [4]]], true);
     * // => [1, 2, 3, 4]
     */
    function flatten(array, isDeep, guard) {
      var length = array ? array.length : 0;
      if (guard && isIterateeCall(array, isDeep, guard)) {
        isDeep = false;
      }
      return length ? baseFlatten(array, isDeep) : [];
    }

    /**
     * Recursively flattens a nested array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to recursively flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, 3, [4]]]);
     * // => [1, 2, 3, 4]
     */
    function flattenDeep(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, true) : [];
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
     * performs a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // using `fromIndex`
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     *
     * // performing a binary search
     * _.indexOf([1, 1, 2, 2], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      if (typeof fromIndex == 'number') {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
      } else if (fromIndex) {
        var index = binaryIndex(array, value);
        if (index < length &&
            (value === value ? (value === array[index]) : (array[index] !== array[index]))) {
          return index;
        }
        return -1;
      }
      return baseIndexOf(array, value, fromIndex || 0);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      return dropRight(array, 1);
    }

    /**
     * Creates an array of unique values that are included in all of the provided
     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @example
     * _.intersection([1, 2], [4, 2], [2, 1]);
     * // => [2]
     */
    var intersection = restParam(function(arrays) {
      var othLength = arrays.length,
          othIndex = othLength,
          caches = Array(length),
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          result = [];

      while (othIndex--) {
        var value = arrays[othIndex] = isArrayLike(value = arrays[othIndex]) ? value : [];
        caches[othIndex] = (isCommon && value.length >= 120) ? createCache(othIndex && value) : null;
      }
      var array = arrays[0],
          index = -1,
          length = array ? array.length : 0,
          seen = caches[0];

      outer:
      while (++index < length) {
        value = array[index];
        if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
          var othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(arrays[othIndex], value, 0)) < 0) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(value);
          }
          result.push(value);
        }
      }
      return result;
    });

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
     *  or `true` to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // using `fromIndex`
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     *
     * // performing a binary search
     * _.lastIndexOf([1, 1, 2, 2], 2, true);
     * // => 3
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
      } else if (fromIndex) {
        index = binaryIndex(array, value, true) - 1;
        var other = array[index];
        if (value === value ? (value === other) : (other !== other)) {
          return index;
        }
        return -1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull() {
      var args = arguments,
          array = args[0];

      if (!(array && array.length)) {
        return array;
      }
      var index = 0,
          indexOf = getIndexOf(),
          length = args.length;

      while (++index < length) {
        var fromIndex = 0,
            value = args[index];

        while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * Removes elements from `array` corresponding to the given indexes and returns
     * an array of the removed elements. Indexes may be specified as an array of
     * indexes or as individual arguments.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    var pullAt = restParam(function(array, indexes) {
      indexes = baseFlatten(indexes);

      var result = baseAt(array, indexes);
      basePullAt(array, indexes.sort(baseCompareAscending));
      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate, thisArg) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getCallback(predicate, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias tail
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     */
    function rest(array) {
      return drop(array, 1);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of `Array#slice` to support node
     * lists in IE < 9 and to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order. If an iteratee
     * function is provided it is invoked for `value` and each element of `array`
     * to compute their sort ranking. The iteratee is bound to `thisArg` and
     * invoked with one argument; (value).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 4, 5, 5], 5);
     * // => 2
     *
     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
     *
     * // using an iteratee function
     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
     *   return this.data[word];
     * }, dict);
     * // => 1
     *
     * // using the `_.property` callback shorthand
     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 1
     */
    var sortedIndex = createSortedIndex();

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 4, 5, 5], 5);
     * // => 4
     */
    var sortedLastIndex = createSortedIndex(true);

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
     * and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [2, 3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
     * // => []
     */
    function takeRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [1, 2]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeWhile(users, 'active', false), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeWhile(users, 'active'), 'user');
     * // => []
     */
    function takeWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all of the provided arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([1, 2], [4, 2], [2, 1]);
     * // => [1, 2, 4]
     */
    var union = restParam(function(arrays) {
      return baseUniq(baseFlatten(arrays, false, true));
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurence of each element
     * is kept. Providing `true` for `isSorted` performs a faster search algorithm
     * for sorted arrays. If an iteratee function is provided it is invoked for
     * each element in the array to generate the criterion by which uniqueness
     * is computed. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, array).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {boolean} [isSorted] Specify the array is sorted.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2], true);
     * // => [1, 2]
     *
     * // using an iteratee function
     * _.uniq([1, 2.5, 1.5, 2], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => [1, 2.5]
     *
     * // using the `_.property` callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (isSorted != null && typeof isSorted != 'boolean') {
        thisArg = iteratee;
        iteratee = isIterateeCall(array, isSorted, thisArg) ? undefined : isSorted;
        isSorted = false;
      }
      var callback = getCallback();
      if (!(iteratee == null && callback === baseCallback)) {
        iteratee = callback(iteratee, thisArg, 3);
      }
      return (isSorted && getIndexOf() == baseIndexOf)
        ? sortedUniq(array, iteratee)
        : baseUniq(array, iteratee);
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var index = -1,
          length = 0;

      array = arrayFilter(array, function(group) {
        if (isArrayLike(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      var result = Array(length);
      while (++index < length) {
        result[index] = arrayMap(array, baseProperty(index));
      }
      return result;
    }

    /**
     * This method is like `_.unzip` except that it accepts an iteratee to specify
     * how regrouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee] The function to combine regrouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      iteratee = bindCallback(iteratee, thisArg, 4);
      return arrayMap(result, function(group) {
        return arrayReduce(group, iteratee, undefined, true);
      });
    }

    /**
     * Creates an array excluding all provided values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */
    var without = restParam(function(array, values) {
      return isArrayLike(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the provided arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([1, 2], [4, 2]);
     * // => [1, 4]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArrayLike(array)) {
          var result = result
            ? arrayPush(baseDifference(result, array), baseDifference(array, result))
            : array;
        }
      }
      return result ? baseUniq(result) : [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    var zip = restParam(unzip);

    /**
     * The inverse of `_.pairs`; this method returns an object composed from arrays
     * of property names and values. Provide either a single two dimensional array,
     * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
     * and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Array
     * @param {Array} props The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(props, values) {
      var index = -1,
          length = props ? props.length : 0,
          result = {};

      if (length && !values && !isArray(props[0])) {
        values = [];
      }
      while (++index < length) {
        var key = props[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /**
     * This method is like `_.zip` except that it accepts an iteratee to specify
     * how grouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee] The function to combine grouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
     * // => [111, 222]
     */
    var zipWith = restParam(function(arrays) {
      var length = arrays.length,
          iteratee = length > 2 ? arrays[length - 2] : undefined,
          thisArg = length > 1 ? arrays[length - 1] : undefined;

      if (length > 2 && typeof iteratee == 'function') {
        length -= 2;
      } else {
        iteratee = (length > 1 && typeof thisArg == 'function') ? (--length, thisArg) : undefined;
        thisArg = undefined;
      }
      arrays.length = length;
      return unzipWith(arrays, iteratee, thisArg);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps `value` with explicit method
     * chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(users)
     *   .sortBy('age')
     *   .map(function(chr) {
     *     return chr.user + ' is ' + chr.age;
     *   })
     *   .first()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor is
     * bound to `thisArg` and invoked with one argument; (value). The purpose of
     * this method is to "tap into" a method chain in order to perform operations
     * on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor, thisArg) {
      interceptor.call(thisArg, value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor, thisArg) {
      return interceptor.call(thisArg, value);
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(users).first();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(users).chain()
     *   .first()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chained sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Creates a new array joining a wrapped array with any additional arrays
     * and/or values.
     *
     * @name concat
     * @memberOf _
     * @category Chain
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var wrapped = _(array).concat(2, [3], [[4]]);
     *
     * console.log(wrapped.value());
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    var wrapperConcat = restParam(function(values) {
      values = baseFlatten(values);
      return this.thru(function(array) {
        return arrayConcat(isArray(array) ? array : [toObject(array)], values);
      });
    });

    /**
     * Creates a clone of the chained sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).map(function(value) {
     *   return Math.pow(value, 2);
     * });
     *
     * var other = [3, 4];
     * var otherWrapped = wrapped.plant(other);
     *
     * otherWrapped.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * Reverses the wrapped array so the first element becomes the last, the
     * second element becomes the second to last, and so on.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new reversed `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;

      var interceptor = function(value) {
        return (wrapped && wrapped.__dir__ < 0) ? value : value.reverse();
      };
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(interceptor);
    }

    /**
     * Produces the result of coercing the unwrapped value to a string.
     *
     * @name toString
     * @memberOf _
     * @category Chain
     * @returns {string} Returns the coerced string value.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return (this.value() + '');
    }

    /**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias run, toJSON, valueOf
     * @category Chain
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements corresponding to the given keys, or indexes,
     * of `collection`. Keys may be specified as individual arguments or as arrays
     * of keys.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [props] The property names
     *  or indexes of elements to pick, specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * _.at(['a', 'b', 'c'], [0, 2]);
     * // => ['a', 'c']
     *
     * _.at(['barney', 'fred', 'pebbles'], 0, 2);
     * // => ['barney', 'pebbles']
     */
    var at = restParam(function(collection, props) {
      return baseAt(collection, baseFlatten(props));
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.every(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.filter([4, 5, 6], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [4, 6]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.filter(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.filter(users, 'active'), 'user');
     * // => ['barney']
     */
    function filter(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.result(_.find(users, function(chr) {
     *   return chr.age < 40;
     * }), 'user');
     * // => 'barney'
     *
     * // using the `_.matches` callback shorthand
     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.result(_.find(users, 'active', false), 'user');
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.result(_.find(users, 'active'), 'user');
     * // => 'barney'
     */
    var find = createFind(baseEach);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(baseEachRight, true);

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning the first element that has equivalent property
     * values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
     * // => 'barney'
     *
     * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
     * // => 'fred'
     */
    function findWhere(collection, source) {
      return find(collection, baseMatches(source));
    }

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection). Iteratee functions may exit iteration early
     * by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from left to right and returns the array
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
     *   console.log(n, key);
     * });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     */
    var forEach = createForEach(arrayEach, baseEach);

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEachRight(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from right to left and returns the array
     */
    var forEachRight = createForEach(arrayEachRight, baseEachRight);

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using the `_.property` callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Checks if `value` is in `collection` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @alias contains, include
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} target The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes(collection, target, fromIndex, guard) {
      var length = collection ? getLength(collection) : 0;
      if (!isLength(length)) {
        collection = values(collection);
        length = collection.length;
      }
      if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
        fromIndex = 0;
      } else {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
      }
      return (typeof collection == 'string' || !isArray(collection) && isString(collection))
        ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
        : (!!length && getIndexOf(collection, target, fromIndex) > -1);
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return String.fromCharCode(object.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return this.fromCharCode(object.code);
     * }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function it is
     * invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invoke = restParam(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          isProp = isKey(path),
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
        result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
      });
      return result;
    });

    /**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
     * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
     * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
     * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
     * `sum`, `uniq`, and `words`
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function timesThree(n) {
     *   return n * 3;
     * }
     *
     * _.map([1, 2], timesThree);
     * // => [3, 6]
     *
     * _.map({ 'a': 1, 'b': 2 }, timesThree);
     * // => [3, 6] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee, thisArg) {
      var func = isArray(collection) ? arrayMap : baseMap;
      iteratee = getCallback(iteratee, thisArg, 3);
      return func(collection, iteratee);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, while the second of which
     * contains elements `predicate` returns falsey for. The predicate is bound
     * to `thisArg` and invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.partition([1, 2, 3], function(n) {
     *   return n % 2;
     * });
     * // => [[1, 3], [2]]
     *
     * _.partition([1.2, 2.3, 3.4], function(n) {
     *   return this.floor(n) % 2;
     * }, Math);
     * // => [[1.2, 3.4], [2.3]]
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * var mapper = function(array) {
     *   return _.pluck(array, 'user');
     * };
     *
     * // using the `_.matches` callback shorthand
     * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.map(_.partition(users, 'active', false), mapper);
     * // => [['barney', 'pebbles'], ['fred']]
     *
     * // using the `_.property` callback shorthand
     * _.map(_.partition(users, 'active'), mapper);
     * // => [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Gets the property value of `path` from all elements in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|string} path The path of the property to pluck.
     * @returns {Array} Returns the property values.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(users, 'user');
     * // => ['barney', 'fred']
     *
     * var userIndex = _.indexBy(users, 'user');
     * _.pluck(userIndex, 'age');
     * // => [36, 40] (iteration order is not guaranteed)
     */
    function pluck(collection, path) {
      return map(collection, property(path));
    }

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not provided the first element of `collection` is used as the initial
     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
     * and `sortByOrder`
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(total, n) {
     *   return total + n;
     * });
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
     */
    var reduce = createReduce(arrayReduce, baseEach);

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    var reduceRight = createReduce(arrayReduceRight, baseEachRight);

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.reject([1, 2, 3, 4], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [1, 3]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.reject(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.reject(users, 'active'), 'user');
     * // => ['barney']
     */
    function reject(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, function(value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * Gets a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {*} Returns the random sample(s).
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (guard ? isIterateeCall(collection, n, guard) : n == null) {
        collection = toIterable(collection);
        var length = collection.length;
        return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
      }
      var index = -1,
          result = toArray(collection),
          length = result.length,
          lastIndex = length - 1;

      n = nativeMin(n < 0 ? 0 : (+n || 0), length);
      while (++index < n) {
        var rand = baseRandom(index, lastIndex),
            value = result[rand];

        result[rand] = result[index];
        result[index] = value;
      }
      result.length = n;
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      return sample(collection, POSITIVE_INFINITY);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the size of `collection`.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? getLength(collection) : 0;
      return isLength(length) ? length : keys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * The function returns as soon as it finds a passing value and does not iterate
     * over the entire collection. The predicate is bound to `thisArg` and invoked
     * with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.some(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, thisArg) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through `iteratee`. This method performs
     * a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return Math.sin(n);
     * });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return this.sin(n);
     * }, Math);
     * // => [3, 1, 2]
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'pebbles' },
     *   { 'user': 'barney' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function sortBy(collection, iteratee, thisArg) {
      if (collection == null) {
        return [];
      }
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      var index = -1;
      iteratee = getCallback(iteratee, thisArg, 3);

      var result = baseMap(collection, function(value, key, collection) {
        return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
      });
      return baseSortBy(result, compareAscending);
    }

    /**
     * This method is like `_.sortBy` except that it can sort by multiple iteratees
     * or property names.
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} iteratees
     *  The iteratees to sort by, specified as individual values or arrays of values.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
     * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * _.map(_.sortByAll(users, 'user', function(chr) {
     *   return Math.floor(chr.age / 10);
     * }), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    var sortByAll = restParam(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var guard = iteratees[2];
      if (guard && isIterateeCall(iteratees[0], iteratees[1], guard)) {
        iteratees.length = 1;
      }
      return baseSortByOrder(collection, baseFlatten(iteratees), []);
    });

    /**
     * This method is like `_.sortByAll` except that it allows specifying the
     * sort orders of the iteratees to sort by. If `orders` is unspecified, all
     * values are sorted in ascending order. Otherwise, a value is sorted in
     * ascending order if its corresponding order is "asc", and descending if "desc".
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // sort by `user` in ascending order and by `age` in descending order
     * _.map(_.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    function sortByOrder(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (guard && isIterateeCall(iteratees, orders, guard)) {
        orders = undefined;
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseSortByOrder(collection, iteratees, orders);
    }

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning an array of all elements that have equivalent
     * property values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
     *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
     * // => ['barney']
     *
     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
     * // => ['fred']
     */
    function where(collection, source) {
      return filter(collection, baseMatches(source));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Date
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */
    var now = nativeNow || function() {
      return new Date().getTime();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it is called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */
    function after(n, func) {
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      n = nativeIsFinite(n = +n) ? n : 0;
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that accepts up to `n` arguments ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      if (guard && isIterateeCall(func, n, guard)) {
        n = undefined;
      }
      n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it is called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery('#add').on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method does not set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // using placeholders
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = restParam(function(func, thisArg, partials) {
      var bitmask = BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bind.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all enumerable function
     * properties, own and inherited, of `object` are bound.
     *
     * **Note:** This method does not set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} [methodNames] The object method names to bind,
     *  specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs' when the element is clicked
     */
    var bindAll = restParam(function(object, methodNames) {
      methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);

      var index = -1,
          length = methodNames.length;

      while (++index < length) {
        var key = methodNames[index];
        object[key] = createWrapper(object[key], BIND_FLAG, object);
      }
      return object;
    });

    /**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // using placeholders
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = restParam(function(object, key, partials) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bindKey.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts one or more arguments of `func` that when
     * called either invokes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` may be specified
     * if `func.length` is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    var curry = createCurry(CURRY_FLAG);

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    var curryRight = createCurry(CURRY_RIGHT_FLAG);

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed invocations. Provide an options object to indicate that `func`
     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the debounced function return the result of the last
     * `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it is invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // ensure `batchLog` is invoked once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }));
     *
     * // cancel a debounced call
     * var todoChanges = _.debounce(batchLog, 1000);
     * Object.observe(models.todo, todoChanges);
     *
     * Object.observe(models, function(changes) {
     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
     *     todoChanges.cancel();
     *   }
     * }, ['delete']);
     *
     * // ...at some point `models.todo` is changed
     * models.todo.completed = true;
     *
     * // ...before 1 second has passed `models.todo` is deleted
     * // which cancels the debounced `todoChanges` call
     * delete models.todo;
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = wait < 0 ? 0 : (+wait || 0);
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        maxTimeoutId = timeoutId = trailingCall = undefined;
      }

      function complete(isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function maxDelayed() {
        complete(trailing, timeoutId);
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0 || remaining > maxWait;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }
      debounced.cancel = cancel;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    var defer = restParam(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second
     */
    var delay = restParam(function(func, wait, args) {
      return baseDelay(func, wait, args);
    });

    /**
     * Creates a function that returns the result of invoking the provided
     * functions with the `this` binding of the created function, where each
     * successive invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the provided functions from right to left.
     *
     * @static
     * @memberOf _
     * @alias backflow, compose
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is coerced to a string and used as the
     * cache key. The `func` is invoked with the `this` binding of the memoized
     * function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var upperCase = _.memoize(function(string) {
     *   return string.toUpperCase();
     * });
     *
     * upperCase('fred');
     * // => 'FRED'
     *
     * // modifying the result cache
     * upperCase.cache.set('fred', 'BARNEY');
     * upperCase('fred');
     * // => 'BARNEY'
     *
     * // replacing `_.memoize.Cache`
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'barney' };
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'fred' }
     *
     * _.memoize.Cache = WeakMap;
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'barney' }
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new memoize.Cache;
      return memoized;
    }

    /**
     * Creates a function that runs each argument through a corresponding
     * transform function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms] The functions to transform
     * arguments, specified as individual functions or arrays of functions.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var modded = _.modArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * modded(1, 2);
     * // => [1, 4]
     *
     * modded(5, 10);
     * // => [25, 20]
     */
    var modArgs = restParam(function(func, transforms) {
      transforms = baseFlatten(transforms);
      if (typeof func != 'function' || !arrayEvery(transforms, baseIsFunction)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = transforms.length;
      return restParam(function(args) {
        var index = nativeMin(args.length, length);
        while (index--) {
          args[index] = transforms[index](args[index]);
        }
        return func.apply(this, args);
      });
    });

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first call. The `func` is invoked
     * with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // using placeholders
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = createPartial(PARTIAL_FLAG);

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // using placeholders
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = createPartial(PARTIAL_RIGHT_FLAG);

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     *
     * var map = _.rearg(_.map, [1, 0]);
     * map(function(n) {
     *   return n * 3;
     * }, [1, 2, 3]);
     * // => [3, 6, 9]
     */
    var rearg = restParam(function(func, indexes) {
      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.restParam(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function restParam(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            rest = Array(length);

        while (++index < length) {
          rest[index] = args[start + index];
        }
        switch (start) {
          case 0: return func.call(this, rest);
          case 1: return func.call(this, args[0], rest);
          case 2: return func.call(this, args[0], args[1], rest);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = rest;
        return func.apply(this, otherArgs);
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the created
     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
     *
     * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * // with a Promise
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function(array) {
        return func.apply(this, array);
      };
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed invocations. Provide an options object to indicate
     * that `func` should be invoked on the leading and/or trailing edge of the
     * `wait` timeout. Subsequent calls to the throttled function return the
     * result of the last `func` call.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     *
     * // cancel a trailing throttled call
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return createWrapper(wrapper, PARTIAL_FLAG, undefined, [value], []);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
     * otherwise they are assigned by reference. If `customizer` is provided it is
     * invoked to produce the cloned values. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is bound to
     * `thisArg` and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var shallow = _.clone(users);
     * shallow[0] === users[0];
     * // => true
     *
     * var deep = _.clone(users, true);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.clone(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, customizer, thisArg) {
      if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
        isDeep = false;
      }
      else if (typeof isDeep == 'function') {
        thisArg = customizer;
        customizer = isDeep;
        isDeep = false;
      }
      return typeof customizer == 'function'
        ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 1))
        : baseClone(value, isDeep);
    }

    /**
     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
     * to produce the cloned values. If `customizer` returns `undefined` cloning
     * is handled by the method instead. The `customizer` is bound to `thisArg`
     * and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var deep = _.cloneDeep(users);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.cloneDeep(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 20
     */
    function cloneDeep(value, customizer, thisArg) {
      return typeof customizer == 'function'
        ? baseClone(value, true, bindCallback(customizer, thisArg, 1))
        : baseClone(value, true);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    function gt(value, other) {
      return value > other;
    }

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    function gte(value, other) {
      return value >= other;
    }

    /**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return isObjectLike(value) && isArrayLike(value) &&
        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(function() { return arguments; }());
     * // => false
     */
    var isArray = nativeIsArray || function(value) {
      return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
    };

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
    }

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate(value) {
      return isObjectLike(value) && objToString.call(value) == dateTag;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    }

    /**
     * Checks if `value` is empty. A value is considered empty unless it is an
     * `arguments` object, array, string, or jQuery-like collection with a length
     * greater than `0` or an object with own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
          (isObjectLike(value) && isFunction(value.splice)))) {
        return !value.length;
      }
      return !keys(value).length;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent. If `customizer` is provided it is invoked to compare values.
     * If `customizer` returns `undefined` comparisons are handled by the method
     * instead. The `customizer` is bound to `thisArg` and invoked with three
     * arguments: (value, other [, index|key]).
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. Functions and DOM nodes
     * are **not** supported. Provide a customizer function to extend support
     * for comparing other values.
     *
     * @static
     * @memberOf _
     * @alias eq
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * object == other;
     * // => false
     *
     * _.isEqual(object, other);
     * // => true
     *
     * // using a customizer callback
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqual(array, other, function(value, other) {
     *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
     *     return true;
     *   }
     * });
     * // => true
     */
    function isEqual(value, other, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return  result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on [`Number.isFinite`](http://ecma-international.org/ecma-262/6.0/#sec-number.isfinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(10);
     * // => true
     *
     * _.isFinite('10');
     * // => false
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite(Object(10));
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      return isObject(value) && objToString.call(value) == funcTag;
    }

    /**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Performs a deep comparison between `object` and `source` to determine if
     * `object` contains equivalent property values. If `customizer` is provided
     * it is invoked to compare values. If `customizer` returns `undefined`
     * comparisons are handled by the method instead. The `customizer` is bound
     * to `thisArg` and invoked with three arguments: (value, other, index|key).
     *
     * **Note:** This method supports comparing properties of arrays, booleans,
     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
     * and DOM nodes are **not** supported. Provide a customizer function to extend
     * support for comparing other values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     *
     * // using a customizer callback
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatch(object, source, function(value, other) {
     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
     * });
     * // => true
     */
    function isMatch(object, source, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      return baseIsMatch(object, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * which returns `true` for `undefined` and other non-numeric values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (value == null) {
        return false;
      }
      if (isFunction(value)) {
        return reIsNative.test(fnToString.call(value));
      }
      return isObjectLike(value) && reIsHostCtor.test(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * **Note:** This method assumes objects created by the `Object` constructor
     * have no inherited enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      var Ctor;
      if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
          (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
        return false;
      }
      var result;
      baseForIn(value, function(subValue, key) {
        result = key;
      });
      return result === undefined || hasOwnProperty.call(value, result);
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return isObject(value) && objToString.call(value) == regexpTag;
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    function lt(value, other) {
      return value < other;
    }

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    function lte(value, other) {
      return value <= other;
    }

    /**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * (function() {
     *   return _.toArray(arguments).slice(1);
     * }(1, 2, 3));
     * // => [2, 3]
     */
    function toArray(value) {
      var length = value ? getLength(value) : 0;
      if (!isLength(length)) {
        return values(value);
      }
      if (!length) {
        return [];
      }
      return arrayCopy(value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return baseCopy(value, keysIn(value));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * overwrite property assignments of previous sources. If `customizer` is
     * provided it is invoked to produce the merged values of the destination and
     * source properties. If `customizer` returns `undefined` merging is handled
     * by the method instead. The `customizer` is bound to `thisArg` and invoked
     * with five arguments: (objectValue, sourceValue, key, object, source).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     *
     * // using a customizer callback
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(object, other, function(a, b) {
     *   if (_.isArray(a)) {
     *     return a.concat(b);
     *   }
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var merge = createAssigner(baseMerge);

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources overwrite property assignments of previous sources.
     * If `customizer` is provided it is invoked to produce the assigned values.
     * The `customizer` is bound to `thisArg` and invoked with five arguments:
     * (objectValue, sourceValue, key, object, source).
     *
     * **Note:** This method mutates `object` and is based on
     * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using a customizer callback
     * var defaults = _.partialRight(_.assign, function(value, other) {
     *   return _.isUndefined(value) ? other : value;
     * });
     *
     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var assign = createAssigner(function(object, source, customizer) {
      return customizer
        ? assignWith(object, source, customizer)
        : baseAssign(object, source);
    });

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties, guard) {
      var result = baseCreate(prototype);
      if (guard && isIterateeCall(prototype, properties, guard)) {
        properties = undefined;
      }
      return properties ? baseAssign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var defaults = createDefaults(assign, assignDefaults);

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */
    var defaultsDeep = createDefaults(merge, mergeDefaults);

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // using the `_.matches` callback shorthand
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    var findKey = createFindKey(baseForOwn);

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles` assuming `_.findKey` returns `barney`
     *
     * // using the `_.matches` callback shorthand
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    var findLastKey = createFindKey(baseForOwnRight);

    /**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
     */
    var forIn = createForIn(baseFor);

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
     */
    var forInRight = createForIn(baseForRight);

    /**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The `iteratee` is bound to `thisArg` and invoked with
     * three arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' and 'b' (iteration order is not guaranteed)
     */
    var forOwn = createForOwn(baseForOwn);

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' and 'a' assuming `_.forOwn` logs 'a' and 'b'
     */
    var forOwnRight = createForOwn(baseForOwnRight);

    /**
     * Creates an array of function property names from all enumerable properties,
     * own and inherited, of `object`.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * _.functions(_);
     * // => ['after', 'ary', 'assign', ...]
     */
    function functions(object) {
      return baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the property value at `path` of `object`. If the resolved value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, toPath(path), path + '');
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     */
    function has(object, path) {
      if (object == null) {
        return false;
      }
      var result = hasOwnProperty.call(object, path);
      if (!result && !isKey(path)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        if (object == null) {
          return false;
        }
        path = last(path);
        result = hasOwnProperty.call(object, path);
      }
      return result || (isLength(object.length) && isIndex(path, object.length) &&
        (isArray(object) || isArguments(object)));
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values unless `multiValue` is `true`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue] Allow multiple values per key.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     *
     * // with `multiValue`
     * _.invert(object, true);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function invert(object, multiValue, guard) {
      if (guard && isIterateeCall(object, multiValue, guard)) {
        multiValue = undefined;
      }
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index],
            value = object[key];

        if (multiValue) {
          if (hasOwnProperty.call(result, value)) {
            result[value].push(key);
          } else {
            result[value] = [key];
          }
        }
        else {
          result[value] = key;
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      var Ctor = object == null ? undefined : object.constructor;
      if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
          (typeof object != 'function' && isArrayLike(object))) {
        return shimKeys(object);
      }
      return isObject(object) ? nativeKeys(object) : [];
    };

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      if (object == null) {
        return [];
      }
      if (!isObject(object)) {
        object = Object(object);
      }
      var length = object.length;
      length = (length && isLength(length) &&
        (isArray(object) || isArguments(object)) && length) || 0;

      var Ctor = object.constructor,
          index = -1,
          isProto = typeof Ctor == 'function' && Ctor.prototype === object,
          result = Array(length),
          skipIndexes = length > 0;

      while (++index < length) {
        result[index] = (index + '');
      }
      for (var key in object) {
        if (!(skipIndexes && isIndex(key, length)) &&
            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * property of `object` through `iteratee`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    var mapKeys = createObjectMapper(true);

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, key, object).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
     *   return n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * // using the `_.property` callback shorthand
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    var mapValues = createObjectMapper();

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'age');
     * // => { 'user': 'fred' }
     *
     * _.omit(object, _.isNumber);
     * // => { 'user': 'fred' }
     */
    var omit = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      if (typeof props[0] != 'function') {
        var props = arrayMap(baseFlatten(props), String);
        return pickByArray(object, baseDifference(keysIn(object), props));
      }
      var predicate = bindCallback(props[0], props[1], 3);
      return pickByCallback(object, function(value, key, object) {
        return !predicate(value, key, object);
      });
    });

    /**
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     */
    function pairs(object) {
      object = toObject(object);

      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates an object composed of the picked `object` properties. Property
     * names may be specified as individual arguments or as arrays of property
     * names. If `predicate` is provided it is invoked for each property of `object`
     * picking the properties `predicate` returns truthy for. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     *
     * _.pick(object, _.isString);
     * // => { 'user': 'fred' }
     */
    var pick = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      return typeof props[0] == 'function'
        ? pickByCallback(object, bindCallback(props[0], props[1], 3))
        : pickByArray(object, baseFlatten(props));
    });

    /**
     * This method is like `_.get` except that if the resolved value is a function
     * it is invoked with the `this` binding of its parent object and its result
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a.b.c', 'default');
     * // => 'default'
     *
     * _.result(object, 'a.b.c', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      var result = object == null ? undefined : object[path];
      if (result === undefined) {
        if (object != null && !isKey(path, object)) {
          path = toPath(path);
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          result = object == null ? undefined : object[last(path)];
        }
        result = result === undefined ? defaultValue : result;
      }
      return isFunction(result) ? result.call(object) : result;
    }

    /**
     * Sets the property value of `path` on `object`. If a portion of `path`
     * does not exist it is created.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to augment.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      if (object == null) {
        return object;
      }
      var pathKey = (path + '');
      path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : toPath(path);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = path[index];
        if (isObject(nested)) {
          if (index == lastIndex) {
            nested[key] = value;
          } else if (nested[key] == null) {
            nested[key] = isIndex(path[index + 1]) ? [] : {};
          }
        }
        nested = nested[key];
      }
      return object;
    }

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
     * with four arguments: (accumulator, value, key, object). Iteratee functions
     * may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * });
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     */
    function transform(object, iteratee, accumulator, thisArg) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee = getCallback(iteratee, thisArg, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable property values
     * of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Checks if `n` is between `start` and up to but not including, `end`. If
     * `end` is not specified it is set to `start` with `start` then set to `0`.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} n The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     */
    function inRange(value, start, end) {
      start = +start || 0;
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      return value >= nativeMin(start, end) && value < nativeMax(start, end);
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number is returned.
     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
     * number is returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      if (floating && isIterateeCall(min, max, floating)) {
        max = floating = undefined;
      }
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (noMax && typeof min == 'boolean') {
          floating = min;
          min = 1;
        }
        else if (typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
        noMax = false;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
    });

    /**
     * Capitalizes the first character of `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'Fred'
     */
    function capitalize(string) {
      string = baseToString(string);
      return string && (string.charAt(0).toUpperCase() + string.slice(1));
    }

    /**
     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = baseToString(string);
      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = baseToString(string);
      target = (target + '');

      var length = string.length;
      position = position === undefined
        ? length
        : nativeMin(position < 0 ? 0 : (+position || 0), length);

      position -= target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional characters
     * use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in Internet Explorer < 9, they can break out
     * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
     * for more details.
     *
     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
     * to reduce XSS vectors.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = baseToString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
     * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
     */
    function escapeRegExp(string) {
      string = baseToString(string);
      return (string && reHasRegExpChars.test(string))
        ? string.replace(reRegExpChars, escapeRegExpChar)
        : (string || '(?:)');
    }

    /**
     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = baseToString(string);
      length = +length;

      var strLength = string.length;
      if (strLength >= length || !nativeIsFinite(length)) {
        return string;
      }
      var mid = (length - strLength) / 2,
          leftLength = nativeFloor(mid),
          rightLength = nativeCeil(mid);

      chars = createPadding('', rightLength, chars);
      return chars.slice(0, leftLength) + string + chars;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padLeft('abc', 6);
     * // => '   abc'
     *
     * _.padLeft('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padLeft('abc', 3);
     * // => 'abc'
     */
    var padLeft = createPadDir();

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padRight('abc', 6);
     * // => 'abc   '
     *
     * _.padRight('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padRight('abc', 3);
     * // => 'abc'
     */
    var padRight = createPadDir(true);

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      string = trim(string);
      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n) {
      var result = '';
      string = baseToString(string);
      n = +n;
      if (n < 1 || !string || !nativeIsFinite(n)) {
        return result;
      }
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        string += string;
      } while (n);

      return result;
    }

    /**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = baseToString(string);
      position = position == null
        ? 0
        : nativeMin(position < 0 ? 0 : (+position || 0), string.length);

      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is provided it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // using custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using backslashes to treat delimiters as plain text
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // using the `imports` option to import `jQuery` as `jq`
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, otherOptions) {
      var settings = lodash.templateSettings;

      if (otherOptions && isIterateeCall(string, options, otherOptions)) {
        options = otherOptions = undefined;
      }
      string = baseToString(string);
      options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);

      var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;
        return match;
      });

      source += "';\n";
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
      });
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
      }
      chars = (chars + '');
      return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimLeft('  abc  ');
     * // => 'abc  '
     *
     * _.trimLeft('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimLeft(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string));
      }
      return string.slice(charsLeftIndex(string, (chars + '')));
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimRight('  abc  ');
     * // => '  abc'
     *
     * _.trimRight('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimRight(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(0, trimmedRightIndex(string) + 1);
      }
      return string.slice(0, charsRightIndex(string, (chars + '')) + 1);
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object|number} [options] The options object or maximum string length.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.trunc('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function trunc(string, options, guard) {
      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (options != null) {
        if (isObject(options)) {
          var separator = 'separator' in options ? options.separator : separator;
          length = 'length' in options ? (+options.length || 0) : length;
          omission = 'omission' in options ? baseToString(options.omission) : omission;
        } else {
          length = +options || 0;
        }
      }
      string = baseToString(string);
      if (length >= string.length) {
        return string;
      }
      var end = length - omission.length;
      if (end < 1) {
        return omission;
      }
      var result = string.slice(0, end);
      if (separator == null) {
        return result + omission;
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              newEnd,
              substring = string.slice(0, end);

          if (!separator.global) {
            separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            newEnd = match.index;
          }
          result = result.slice(0, newEnd == null ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = baseToString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      if (guard && isIterateeCall(string, pattern, guard)) {
        pattern = undefined;
      }
      string = baseToString(string);
      return string.match(pattern || reWords) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = restParam(function(func, args) {
      try {
        return func.apply(undefined, args);
      } catch(e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and arguments of the created function. If `func` is a property name the
     * created callback returns the property value for a given element. If `func`
     * is an object the created callback returns `true` for elements that contain
     * the equivalent object properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @alias iteratee
     * @category Utility
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
     *   if (!match) {
     *     return callback(func, thisArg);
     *   }
     *   return function(object) {
     *     return match[2] == 'gt'
     *       ? object[match[1]] > match[3]
     *       : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(users, 'age__gt36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function callback(func, thisArg, guard) {
      if (guard && isIterateeCall(func, thisArg, guard)) {
        thisArg = undefined;
      }
      return isObjectLike(func)
        ? matches(func)
        : baseCallback(func, thisArg);
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that performs a deep comparison between a given object
     * and `source`, returning `true` if the given object has equivalent property
     * values, else `false`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Creates a function that compares the property value of `path` on a given
     * object to `value`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, true));
    }

    /**
     * Creates a function that invokes the method at `path` on a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invoke(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    var method = restParam(function(path, args) {
      return function(object) {
        return invokePath(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path on `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = restParam(function(object, args) {
      return function(path) {
        return invokePath(object, path, args);
      };
    });

    /**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      if (options == null) {
        var isObj = isObject(source),
            props = isObj ? keys(source) : undefined,
            methodNames = (props && props.length) ? baseFunctions(source, props) : undefined;

        if (!(methodNames ? methodNames.length : isObj)) {
          methodNames = false;
          options = source;
          source = object;
          object = this;
        }
      }
      if (!methodNames) {
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = true,
          index = -1,
          isFunc = isFunction(object),
          length = methodNames.length;

      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      while (++index < length) {
        var methodName = methodNames[index],
            func = source[methodName];

        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = (function(func) {
            return function() {
              var chainAll = this.__chain__;
              if (chain || chainAll) {
                var result = object(this.__wrapped__),
                    actions = result.__actions__ = arrayCopy(this.__actions__);

                actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
                result.__chain__ = chainAll;
                return result;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }(func));
        }
      }
      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      root._ = oldDash;
      return this;
    }

    /**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
    }

    /**
     * Creates a function that returns the property value at `path` on a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the property value at a given path on `object`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return baseGet(object, toPath(path), path + '');
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. If `end` is not specified it is
     * set to `start` with `start` then set to `0`. If `end` is less than `start`
     * a zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      if (step && isIterateeCall(start, end, step)) {
        end = step = undefined;
      }
      start = +start || 0;
      step = step == null ? 1 : (+step || 0);

      if (end == null) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Invokes the iteratee function `n` times, returning an array of the results
     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
     * one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) {
     *   mage.castSpell(n);
     * });
     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2`
     *
     * _.times(3, function(n) {
     *   this.cast(n);
     * }, mage);
     * // => also invokes `mage.castSpell(n)` three times
     */
    function times(n, iteratee, thisArg) {
      n = nativeFloor(n);
      if (n < 1 || !nativeIsFinite(n)) {
        return [];
      }
      var index = -1,
          result = Array(nativeMin(n, MAX_ARRAY_LENGTH));

      iteratee = bindCallback(iteratee, thisArg, 1);
      while (++index < n) {
        if (index < MAX_ARRAY_LENGTH) {
          result[index] = iteratee(index);
        } else {
          iteratee(index);
        }
      }
      return result;
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return baseToString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend The first number to add.
     * @param {number} addend The second number to add.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    function add(augend, addend) {
      return (+augend || 0) + (+addend || 0);
    }

    /**
     * Calculates `n` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Calculates `n` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Gets the maximum value of `collection`. If `collection` is empty or falsey
     * `-Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => -Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.max(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using the `_.property` callback shorthand
     * _.max(users, 'age');
     * // => { 'user': 'fred', 'age': 40 }
     */
    var max = createExtremum(gt, NEGATIVE_INFINITY);

    /**
     * Gets the minimum value of `collection`. If `collection` is empty or falsey
     * `Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.min(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // using the `_.property` callback shorthand
     * _.min(users, 'age');
     * // => { 'user': 'barney', 'age': 36 }
     */
    var min = createExtremum(lt, POSITIVE_INFINITY);

    /**
     * Calculates `n` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Gets the sum of the values in `collection`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 6]);
     * // => 10
     *
     * _.sum({ 'a': 4, 'b': 6 });
     * // => 10
     *
     * var objects = [
     *   { 'n': 4 },
     *   { 'n': 6 }
     * ];
     *
     * _.sum(objects, function(object) {
     *   return object.n;
     * });
     * // => 10
     *
     * // using the `_.property` callback shorthand
     * _.sum(objects, 'n');
     * // => 10
     */
    function sum(collection, iteratee, thisArg) {
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      iteratee = getCallback(iteratee, thisArg, 3);
      return iteratee.length == 1
        ? arraySum(isArray(collection) ? collection : toIterable(collection), iteratee)
        : baseSum(collection, iteratee);
    }

    /*------------------------------------------------------------------------*/
    lodash.prototype = baseLodash.prototype;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get = mapGet;
    MapCache.prototype.has = mapHas;
    MapCache.prototype.set = mapSet;
    SetCache.prototype.push = cachePush;
    memoize.Cache = MapCache;
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.callback = callback;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.modArgs = modArgs;
    lodash.negate = negate;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.restParam = restParam;
    lodash.set = set;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortByAll = sortByAll;
    lodash.sortByOrder = sortByOrder;
    lodash.spread = spread;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipWith = zipWith;
    lodash.backflow = flowRight;
    lodash.collect = map;
    lodash.compose = flowRight;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.iteratee = callback;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.deburr = deburr;
    lodash.endsWith = endsWith;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.findWhere = findWhere;
    lodash.first = first;
    lodash.floor = floor;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isMatch = isMatch;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.min = min;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padLeft = padLeft;
    lodash.padRight = padRight;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.sum = sum;
    lodash.template = template;
    lodash.trim = trim;
    lodash.trimLeft = trimLeft;
    lodash.trimRight = trimRight;
    lodash.trunc = trunc;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.words = words;
    lodash.all = every;
    lodash.any = some;
    lodash.contains = includes;
    lodash.eq = isEqual;
    lodash.detect = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.head = first;
    lodash.include = includes;
    lodash.inject = reduce;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }()), false);

    /*------------------------------------------------------------------------*/
    lodash.sample = sample;

    lodash.prototype.sample = function(n) {
      if (!this.__chain__ && n == null) {
        return sample(this.value());
      }
      return this.thru(function(value) {
        return sample(value, n);
      });
    };

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = VERSION;
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        var filtered = this.__filtered__;
        if (filtered && !index) {
          return new LazyWrapper(this);
        }
        n = n == null ? 1 : nativeMax(nativeFloor(n) || 0, 0);

        var result = this.clone();
        if (filtered) {
          result.__takeCount__ = nativeMin(result.__takeCount__, n);
        } else {
          result.__views__.push({ 'size': n, 'type': methodName + (result.__dir__ < 0 ? 'Right' : '') });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type != LAZY_MAP_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
        var result = this.clone();
        result.__iteratees__.push({ 'iteratee': getCallback(iteratee, thisArg, 1), 'type': type });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });
    arrayEach(['first', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });
    arrayEach(['initial', 'rest'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });
    arrayEach(['pluck', 'where'], function(methodName, index) {
      var operationName = index ? 'filter' : 'map',
          createCallback = index ? baseMatches : property;

      LazyWrapper.prototype[methodName] = function(value) {
        return this[operationName](createCallback(value));
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.reject = function(predicate, thisArg) {
      predicate = getCallback(predicate, thisArg, 1);
      return this.filter(function(value) {
        return !predicate(value);
      });
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = start == null ? 0 : (+start || 0);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = (+end || 0);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate, thisArg) {
      return this.reverse().takeWhile(predicate, thisArg).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(POSITIVE_INFINITY);
    };
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName),
          retUnwrapped = /^(?:first|last)$/.test(methodName),
          lodashFunc = lodash[retUnwrapped ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName];

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var args = retUnwrapped ? [1] : arguments,
            chainAll = this.__chain__,
            value = this.__wrapped__,
            isHybrid = !!this.__actions__.length,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          isLazy = useLazy = false;
        }
        var interceptor = function(value) {
          return (retUnwrapped && chainAll)
            ? lodashFunc(value, 1)[0]
            : lodashFunc.apply(undefined, arrayPush([value], args));
        };

        var action = { 'func': thru, 'args': [interceptor], 'thisArg': undefined },
            onlyLazy = isLazy && !isHybrid;

        if (retUnwrapped && !chainAll) {
          if (onlyLazy) {
            value = value.clone();
            value.__actions__.push(action);
            return func.call(value);
          }
          return lodashFunc.call(undefined, this.value())[0];
        }
        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push(action);
          return new LodashWrapper(result, chainAll);
        }
        return this.thru(interceptor);
      };
    });
    arrayEach(['join', 'pop', 'push', 'replace', 'shift', 'sort', 'splice', 'split', 'unshift'], function(methodName) {
      var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          return func.apply(this.value(), args);
        }
        return this[chainName](function(value) {
          return func.apply(value, args);
        });
      };
    });
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name,
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{ 'name': 'wrapper', 'func': undefined }];
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.concat = wrapperConcat;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
    lodash.prototype.collect = lodash.prototype.map;
    lodash.prototype.head = lodash.prototype.first;
    lodash.prototype.select = lodash.prototype.filter;
    lodash.prototype.tail = lodash.prototype.rest;

    return lodash;
  }

  /*--------------------------------------------------------------------------*/
  var _ = runInContext();
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    root._ = _;
    define(function() {
      return _;
    });
  }
  else if (freeExports && freeModule) {
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    else {
      freeExports._ = _;
    }
  }
  else {
    root._ = _;
  }
}.call(this));

return module.exports;
}
/********** End of module 50: /Users/piece/Desktop/Me/screeps/AlexBot_Js/node_modules/lodash/index.js **********/
/********** Start module 51: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/roomResourceConfig.js **********/
__modules[51] = function(module, exports) {
// resourceType: {terminal: amount, storage: [ShortageLine, AbundantLine, ExceededLine]}
module.exports = {
    energy: {terminal: 50000, storage: [200000, 500000, 600000]},

    O: {terminal: 4000, storage: [10000, 20000, 30000]},
    H: {terminal: 4000, storage: [10000, 20000, 30000]},
    U: {terminal: 4000, storage: [5000, 10000, 20000]},
    K: {terminal: 4000, storage: [5000, 10000, 20000]},
    L: {terminal: 4000, storage: [5000, 10000, 20000]},
    Z: {terminal: 4000, storage: [5000, 10000, 20000]},
    X: {terminal: 4000, storage: [10000, 20000, 30000]},
    G: {terminal: 4000, storage: [5000, 10000, 20000]},

    XUH2O: {terminal: 4000, storage: [5000, 10000, 20000]}, // attack
    XUHO2: {terminal: 4000, storage: [5000, 10000, 20000]}, // harvest
    XKH2O: {terminal: 4000, storage: [5000, 10000, 20000]}, // carry
    XKHO2: {terminal: 4000, storage: [5000, 10000, 20000]}, // ranged_attack
    XLH2O: {terminal: 4000, storage: [5000, 10000, 20000]}, // repair & build
    XLHO2: {terminal: 4000, storage: [5000, 10000, 20000]}, // heal
    XZH2O: {terminal: 4000, storage: [5000, 10000, 20000]}, // dismantle
    XZHO2: {terminal: 4000, storage: [5000, 10000, 20000]}, // move
    XGH2O: {terminal: 4000, storage: [5000, 10000, 20000]}, // upgradeController
    XGHO2: {terminal: 4000, storage: [5000, 10000, 20000]}, // tough
    
    power: {terminal: 1000, storage: [1000, 5000, 20000]},
    ops: {terminal: 1000, storage: [1000, 5000, 20000]},
    battery: {terminal: 2000, storage: [2000, 5000, 10000]},
};
return module.exports;
}
/********** End of module 51: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/roomResourceConfig.js **********/
/********** Start module 52: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/boostName.js **********/
__modules[52] = function(module, exports) {
// order based on creation priority
module.exports = {
    T3_ATTACK: 'XUH2O', // x4
    T3_RANGE_ATTACK: 'XKHO2', // x4
    T3_HEAL: 'XLHO2',  // x4
    T3_TOUGH: 'XGHO2', // -70%
    T3_DISMANTLE: 'XZH2O',  // x4
    
    T3_HARVEST: 'XUHO2', // +600%
    T3_CARRY: 'XKH2O', // x4
    T3_MOVE: 'XZHO2', // x4

    T3_BUILD: 'XLH2O', // +100%
    T3_UPGRADE: 'XGH2O',  // +100%
    T2_UPGRADE: 'GH2O', // +80%
    T2_HARVEST: 'UHO2', // +400%
}
return module.exports;
}
/********** End of module 52: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/boostName.js **********/
/********** Start module 53: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/models/taskModels.js **********/
__modules[53] = function(module, exports) {
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
/********** End of module 53: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/models/taskModels.js **********/
/********** Start module 54: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/util/index.js **********/
__modules[54] = function(module, exports) {
const util = {
    roomUtil: __require(64,54),
}

module.exports = util;
return module.exports;
}
/********** End of module 54: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/util/index.js **********/
/********** Start module 55: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/lab.js **********/
__modules[55] = function(module, exports) {
module.exports = {
    boostCreep: function(lab, creep, resourceType, bodyPartCount) {
        if(!lab.store[resourceType] || lab.store[resourceType] < bodyPartCount * 30) return ERR_NOT_ENOUGH_RESOURCES;
        if(lab.store[RESOURCE_ENERGY] < bodyPartCount * 20) return ERR_NOT_ENOUGH_ENERGY
        const result = lab.boostCreep(creep, bodyPartCount);

        if(result === OK) {
            lab.room.reduceFromBoostLab(lab.id, resourceType, bodyPartCount * 30);
        }

        return result;
    },

}
return module.exports;
}
/********** End of module 55: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/lab.js **********/
/********** Start module 56: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/roomConfig.js **********/
__modules[56] = function(module, exports) {
module.exports = {
    E16S2: {
        restPos: new RoomPosition(27, 29, "E16S2"),
        managerPos: new RoomPosition(25, 33, "E16S2"),
        storagePos: new RoomPosition(24, 32, "E16S2"),
    },
    E6S2: {
        restPos: new RoomPosition(15, 21, "E6S2"),
        managerPos: new RoomPosition(14, 27, "E6S2"),
        storagePos: new RoomPosition(14, 27, "E6S2"),
    },
    E17N2: {
        restPos: new RoomPosition(17, 28, "E17N2"),
        managerPos: new RoomPosition(22, 28, "E17N2"),
        storagePos: new RoomPosition(22, 28, "E17N2"),
    },
}
return module.exports;
}
/********** End of module 56: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/roomConfig.js **********/
/********** Start module 57: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/labProductConfig.js **********/
__modules[57] = function(module, exports) {
// order based on creation priority
module.exports = {
    XUH2O: [5000, 12000], // attack
    XLH2O: [5000, 12000],  // repair & build

    XKHO2: [5000, 12000], // ranged_attack
    XLHO2: [5000, 12000],  // heal
    XGHO2: [5000, 12000], // tough
    
    XKH2O: [5000, 12000],  // carry
    XZHO2: [5000, 12000], // move
    XGH2O: [5000, 12000],  // upgradeController
    XZH2O: [5000, 12000],  // dismantle
    XUHO2: [5000, 12000], // harvest

    G: [5000, 12000],

    GH: [5000, 12000], // +50% upgrade
    UO: [5000, 12000], // +200% harvest

    OH: [5000, 12000],
}
return module.exports;
}
/********** End of module 57: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/config/labProductConfig.js **********/
/********** Start module 58: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/rampart.js **********/
__modules[58] = function(module, exports) {
var rampart = {
    targetHits: {
        0: 0,
        1: 1000, 
        2: 100000, 
        3: 200000, 
        4: 500000, 
        5: 1000000,
        6: 2000000,
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
/********** End of module 58: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/rampart.js **********/
/********** Start module 59: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/wall.js **********/
__modules[59] = function(module, exports) {
var wall = {
    targetHits: {
        0: 0,
        1: 1000, 
        2: 100000, 
        3: 200000, 
        4: 500000, 
        5: 1000000,
        6: 2000000,
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
/********** End of module 59: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/structures/wall.js **********/
/********** Start module 60: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/reactionResources.js **********/
__modules[60] = function(module, exports) {
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
/********** End of module 60: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/reactionResources.js **********/
/********** Start module 61: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/creepRoles.js **********/
__modules[61] = function(module, exports) {
const roles = {
    HARVESTER:      'harvester2',
    CARRIER:        'carrier2',
    UPGRADER:       'upgrader2',
    BUILDER:        'builder2',
    MANAGER:        'manager',
    MINER:          'miner',
    SCIENTIST:      'mineralCarrier',
    CLAIMER:        'claimer',
    R_HARVESTER:    'remoteHarvester',
    R_HAULER:       'remoteHauler',
    KEEPER_ATKER:   'keeperAttacker',
    INVADER_ATKER:  'invaderAttacker',
    TRANSPORTER:    'transporter',
    DEFENDER:       'defender',
    R_MINER:        'remoteMiner',
    DISMANTLER:     'wrecker',
    MEDIC:          'medic',
    SCOUT:          'scout',
};

module.exports = roles;
return module.exports;
}
/********** End of module 61: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/creepRoles.js **********/
/********** Start module 62: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/commodities.js **********/
__modules[62] = function(module, exports) {
module.exports = [
    RESOURCE_COMPOSITE,
    RESOURCE_CRYSTAL,
    RESOURCE_LIQUID,

    RESOURCE_WIRE,
    RESOURCE_SWITCH,
    RESOURCE_TRANSISTOR,
    RESOURCE_MICROCHIP,
    RESOURCE_CIRCUIT,
    RESOURCE_DEVICE,

    RESOURCE_CELL,
    RESOURCE_PHLEGM,
    RESOURCE_TISSUE,
    RESOURCE_MUSCLE,
    RESOURCE_ORGANOID,
    RESOURCE_ORGANISM,

    RESOURCE_ALLOY,
    RESOURCE_TUBE,
    RESOURCE_FIXTURES,
    RESOURCE_FRAME,
    RESOURCE_HYDRAULICS,
    RESOURCE_MACHINE,

    RESOURCE_CONDENSATE,
    RESOURCE_CONCENTRATE,
    RESOURCE_EXTRACT,
    RESOURCE_SPIRIT,
    RESOURCE_EMANATION,
    RESOURCE_ESSENCE
]
return module.exports;
}
/********** End of module 62: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/commodities.js **********/
/********** Start module 63: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/roomTypes.js **********/
__modules[63] = function(module, exports) {
const roomTypes = {
    HIGHWAY: 0,
    NORMAL: 1,
    KEEPER: 2,
    CENTER: 3
}

module.exports = roomTypes;
return module.exports;
}
/********** End of module 63: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/constants/roomTypes.js **********/
/********** Start module 64: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/util/roomUtil.js **********/
__modules[64] = function(module, exports) {
const { roomTypes } = __require(49,64);

roomUtil = {
    getRoomCoord: function (roomName) {
        if (roomName.includes('N')) {
            return roomName.substring(1).split('N').map(pos => Number(pos));
        } else {
            return roomName.substring(1).split('S').map(pos => Number(pos));
        }
    },

    getRoomType: function (roomName) {
        const roomPos = this.getRoomCoord(roomName);
        if (roomPos[0] % 10 === 0 || roomPos[1] % 10 === 0) return roomTypes.HIGHWAY;
        else if (roomPos[0] % 10 === 5 && roomPos[1] % 10 === 5) return roomTypes.CENTER;
        else if (
            (roomPos[0] % 10 === 4 || roomPos[0] % 10 === 6) &&
            (roomPos[1] % 10 === 4 || roomPos[1] % 10 === 6)
        ) return roomTypes.KEEPER;
        else return roomTypes.NORMAL;
    },
    getRoomsInRange: function (roomName, range, curret = null) {
        if (!range) return [];

        if (!curret) curret = [roomName];
        _.forEach(Game.map.describeExits(roomName), rN => {
            if (!curret.includes(rN) && this.getRoomType(rN) === roomTypes.NORMAL) {
                curret.push(rN);
                this.getRoomsInRange(rN, range - 1, curret);
            }
        })

        return curret;
    },

    getRoomsInRangeBFS: function (roomName, range) {
        const inRangeRooms = [roomName];
        let p = 0;

        while (range > 0) {
            let roomCount = inRangeRooms.length - p;
            for (let i = 0; i < roomCount; i++) {
                const neerRooms = Game.map.describeExits(inRangeRooms[p++]);
                _.forEach(neerRooms, rN => {
                    if (!inRangeRooms.includes(rN)) {
                        inRangeRooms.push(rN);
                    }
                })
            }
            range -= 1;
        }

        return inRangeRooms;
    },

    getRoomInfo: function (room) {
        if (!room) return;
        
        const roomInfo = {};
        roomInfo.roomType = this.getRoomType(room.name);
        roomInfo.sourceInfo = room.find(FIND_SOURCES).map(source => {
            return {
                pos: source.pos,
                space: this.getPosAccessSpace(room, source.pos)
            };
        });
        if (roomInfo.roomType !== roomTypes.HIGHWAY) {
            let mineral = room.find(FIND_MINERALS)[0];
            roomInfo.mineralPos = mineral.pos;
            roomInfo.mineralType = mineral.mineralType;
        }

        return roomInfo;
    },

    getPosAccessSpace: function (room, pos) {
        if (!room || !pos) return null;

        let res = 0;

        let directions = [
            [1, 1],
            [1, 0],
            [1, -1],
            [0, 1],
            [0, -1],
            [-1, 1],
            [-1, 0],
            [-1, -1],
        ]

        let terrain = new Room.Terrain(room.name);
        for (const d of directions) {
            if(terrain.get(pos.x + d[0], pos.y + d[1]) !== TERRAIN_MASK_WALL) {
                res += 1;
            }
        }

        return res;

    }
};

module.exports = roomUtil;
return module.exports;
}
/********** End of module 64: /Users/piece/Desktop/Me/screeps/AlexBot_Js/src/util/roomUtil.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
