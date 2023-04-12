    /*  record / free up hostile record memory if hostile creep dead (in outSourceRooms) 
        if we have vision in those rooms, update every tick,
        if we don't, delete recored after we ensure its dead.
    */
    for(var outSourceRoom in Memory.outSourceRooms) {
        // record hostile creeps
        if (Game.rooms[outSourceRoom]) {
            var curRoom = Game.rooms[outSourceRoom]
            var hostileCreeps = curRoom.find(FIND_HOSTILE_CREEPS);
            if (Memory.hostileCreeps[outSourceRoom]) {
                
            }
            if (hostileCreeps.length > 0) {
                _.forEach(hostileCreeps, hCreep => {
                    if (!Memory.hostileCreeps[outSourceRoom]) Memory.hostileCreeps[outSourceRoom] = {};

                    Memory.hostileCreeps[outSourceRoom][hCreep.id] = {
                        body: hCreep.body,
                        ticksToLive: hCreep.ticksToLive,
                        owner: hCreep.owner,
                        recordTime: Game.time,
                        room: outSourceRoom,
                    }
                })
            }

            // delete if not in room anymore
            _.forEach(_.keys(Memory.hostileCreeps[outSourceRoom]), hCreepId => {
                if (Memory.hostileCreeps[outSourceRoom][hCreepId].recordTime != Game.time) {
                    delete Memory.hostileCreeps[outSourceRoom][hCreepId];
                }
            })

            // record invader core
            var invaderCore = _.find(curRoom.find(FIND_HOSTILE_STRUCTURES), struct => struct.structureType == STRUCTURE_INVADER_CORE);
            if (invaderCore) {
                Memory.InvaderCores[outSourceRoom] = true;
            }
            else {
                Memory.InvaderCores[outSourceRoom] = false;
            }
        }

        // free up hostile creep memory if dead
        var hostileCreepdict = Memory.hostileCreeps;
        for (var hCreepId in hostileCreepdict) {
            var hCreep = hostileCreepdict[hCreepId];
            if (hCreep.ticksToLive + hCreep.recordTime < Game.time) {
                delete hostileCreepdict[hCreepId];
            }
        }
    }