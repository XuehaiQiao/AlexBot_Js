const { roomInfo } = require("../config");
const { energy } = require("../config/roomResourceConfig");

/*
outSourcer1 - first generation out sourcer

description:
have equal amount of [WORK, MOVE, CARRY],
harvest energy source from other room and bring energy back.
*/
module.exports = {
    properties: {
        role: "roadRepairer",
        body: [...new Array(5).fill(WORK), ...new Array(15).fill(CARRY), ...new Array(10).fill(MOVE)],
        amount: 1,
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        // pick up near energy
        const nearEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: resource => resource.resourceType == RESOURCE_ENERGY })[0];
        if (nearEnergy) creep.pickup(nearEnergy);

        // build near road and container
        const myConstuct = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
        if (myConstuct.length > 0 && creep.room.name !== creep.memory.base) {
            if (creep.build(myConstuct[0]) == OK) return;
        }

        // repair near road and container
        const needRepair = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: struct => (
                (struct.structureType == STRUCTURE_ROAD || struct.structureType == STRUCTURE_CONTAINER) &&
                struct.hits < struct.hitsMax
            )
        });
        if (needRepair.length > 0) {
            creep.repair(needRepair[0]);
        }


        if (!creep.memory.status) {
            // move to its base room if not in
            if (creep.memory.targetRoom && creep.memory.targetRoom != creep.room.name) {
                creep.travelTo(new RoomPosition(25, 25, creep.memory.targetRoom));
                return;
            }

            let result = creep.takeEnergyFromClosest();
            if(!result || creep.store[RESOURCE_ENERGY] > creep.store.getCapacity() - 50) {
                creep.memory.status = 1
            }
        }
        else {
            // move to its base room if not in
            if (creep.memory.base && creep.memory.base != creep.room.name) {
                creep.travelTo(new RoomPosition(25, 25, creep.memory.base));
                return;
            }

            creep.takeEnergyFromClosest();
            if(creep.store[RESOURCE_ENERGY] > creep.store.getCapacity() - 50) {
                creep.memory.status = 0
            }
        }
    },

    // checks if the room needs to spawn a creep (logic differ from others)
    spawn: function (room, roomName) {
        // var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.memory.targetRoom == roomName);
        // console.log(this.properties.role + ': ' + thisTypeCreeps.length, roomName);

        // check if need spawn
        let creepCount;
        if (global.roomCensus[roomName] && global.roomCensus[roomName][this.properties.role]) {
            creepCount = global.roomCensus[roomName][this.properties.role]
        }
        else creepCount = 0;

        if (creepCount < 1) {
            return true;
        }
    },

    // returns an object with the data to spawn a new creep
    spawnData: function (room, outSourceRoomName) {
        let name = this.properties.role + Game.time % 10000;
        let body = this.properties.body;
        let memory = { role: this.properties.role, status: 1, base: room.name, targetRoom: outSourceRoomName };

        return { name, body, memory };
    },

};