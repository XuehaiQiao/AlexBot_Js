// no repair logic yet, no added to creeps yet
module.exports = {
    properties: {
        role: "remoteMiner",
        body: [...new Array(18).fill(WORK), CARRY, ...new Array(9).fill(MOVE), ...new Array(16).fill(ATTACK), MOVE, ...new Array(5).fill(HEAL)] // 18+1+9+16+1+5 cost: 18*100+16*80+5*250+11*50 = 4880
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // move to its target room if not in
        if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
            return;
        }

        if(creep.memory.rest) {
            creep.memory.rest -= 1;
            return;
        }

        let mineral = creep.room.find(FIND_MINERALS)[0];
        let container = Game.getObjectById(creep.memory.containerId);
        if(container) {
            haveContainerMineLogic(creep, mineral, container);
        }
        else {
            noContainerMineLogic(creep, mineral);
        }

        if(mineral.ticksToRegeneration > 0) {
            Memory.outSourceRooms[creep.room.name].mineralRegenTime = Game.time + mineral.ticksToRegeneration;
        }
    },

    // checks if the room needs to spawn a creep (logic differ from others)
    spawn: function(room, roomName) {
        // is base room controller level < 8
        if(room.controller.level < 8) return false;

        // if no mineral or dont mine mineral
        if(!Memory.outSourceRooms[roomName]) Memory.outSourceRooms[roomName] = {};
        if(Memory.outSourceRooms[roomName].mineMineral === false) return false;
        if(Memory.outSourceRooms[roomName].mineralRegenTime > Game.time) return false;

        // check if need spawn
        let creepCount;
        if(global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;
        
        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, outSourceRoomName) {
        let name = this.properties.role + Game.time;
        let body = this.properties.body;
        let memory = {role: this.properties.role, status: 0, base: room.name, targetRoom: outSourceRoomName};

        return {name, body, memory};
    },
};

var haveContainerMineLogic = function(creep, mine, container) {
    if(!creep.pos.isEqualTo(container.pos)) {
        creep.moveToNoCreepInRoom(container);
    }
    else if(container.hits < container.hitsMax) {
        // repair
    }
    else {
        creep.harvest(mine);
        creep.memory.rest = 4;
    }
};

var noContainerMineLogic = function(creep, mine) {
    let result = creep.harvest(mine);
    if(result === ERR_NOT_IN_RANGE) {
        creep.moveToNoCreepInRoom(mine);
    }
    else if(result === OK) {
        creep.memory.rest = 4;
    }
};