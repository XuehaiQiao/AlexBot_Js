const { roomInfo } = require("../config");
const { roomUtil } = require("../util");
const ifInit = true;

// Do not use this in the MMO
function roomInit(room) {
    // create scout sperately
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

    //set up Memory
    if(!Memory.outSourceRooms) Memory.outSourceRooms = {};
    if(!Memory.resourceShortage) Memory.resourceShortage = {};
    


    //set up room memory
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

    // set roomInfo
    room.memory.roomInfo = roomUtil.getRoomInfo(room);
    // assign scout
    room.memory.tasks.spawnTasks.push({
        name: 'explorer',
        body: [MOVE], 
        memory: {
            role: 'scout',
            targetRooms: targetRooms,
            explorer: true
        }
    });
    
    // create basic structs
    if(roomInfo[room.name].storagePos) {
        room.createConstructionSite(roomInfo[room.name].storagePos, STRUCTURE_CONTAINER);
    }
    else if(roomInfo[room.name].roomPlan) {
        // todo
    }


    room.memory.init = false;
}

module.exports = roomInit;