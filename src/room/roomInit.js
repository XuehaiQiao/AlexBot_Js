const { roomUtil } = require("../util");
const ifInit = true;

// Do not use this in the MMO
function roomInit(room) {
    if(!ifInit) return;
    if(!room || room.memory.init === false) return;
    if(!room.controller || room.controller.level === 0 || !room.controller.my) return;

    //set up memory
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

    // set roomInfo
    room.memory.roomInfo = roomUtil.getRoomInfo(room);
    // assign scout
    room.memory.tasks.spawnTasks.push({
        name: 'explorer', 
        body: [MOVE], 
        memory: {
            role: 'scout',
            targetRooms: roomUtil.getRoomsInRange(room.name, 3),
            explorer: true
        }
    });
    
    



    room.memory.init = false;
}

module.exports = roomInit;