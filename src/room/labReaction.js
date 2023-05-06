const { transferTask } = require("../models/taskModels");
const { reactionResources } = require("../constants")

module.exports = function(room) {
    runLab(room);
};


var runLab = function(room) {
    if(!room.memory.tasks) room.memory.tasks = {};
    if(!room.memory.tasks.labTasks) room.memory.tasks.labTasks = [];
    if(!room.memory.labs) room.memory.labs = {};
    if(!room.memory.labs.center) {
        room.memory.labs.center = [];
        return;
    }
    if(room.memory.labs.center.length != 2) return;
    let labTasks = room.memory.tasks.labTasks;
    if(!labTasks.length) {
        return;
    }

    let allLabs = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LAB});
    let outterLabs =  _.filter(allLabs, lab => !room.memory.labs.center.includes(lab.id));
    let centerLabs = _.map(room.memory.labs.center, id => Game.getObjectById(id));



    const task = room.memory.tasks.labTasks[0];
    
    // labStatis: 0 finished, 1 running, 2 center feed, 3 outter withdraw 
    // 0 finished
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
    //  1 running
    else if(room.memory.labStatus == 1) {
        // check if mineral type is correct for all labs
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
                //else (cooldown)
            }
        }
    }
    // 2 center feed
    else if(room.memory.labStatus == 2) {
        for (const i in centerLabs) {
            let lab = centerLabs[i];
            if(!lab.mineralType || lab.store[lab.mineralType] < 5) {
                return;
            }
        }

        room.memory.labStatus = 1;
    }
    // 3 outter withdraw 
    else if(room.memory.labStatus == 3) {
        for (const i in outterLabs) {
            if(outterLabs[i].store.getFreeCapacity(task.resourceType) < 5) {
                return;
            }
        }

        room.memory.labStatus = 1;
    }
}