const { transferTask, LabTask } = require("../models/taskModels");
const { reactionResources } = require("../constants");
const { compondsRequirements } = require("../config");


module.exports = function(room) {
    // check avalibility 
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

    // test on W19S17
    //if(room.name != 'W19S17') return;

    // For every 500 ticks, check & assign tasks if no tasks
    if(Game.time % 200 === 123) {
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
            else {
                Memory.resourceShortage[room.name] = 'NO Compond Shortage'
            }
        }
    }

    // lab reaction
    runLab(room);
};

var checkRequiredComponds = function(room) {
    let storage = room.storage;
    for (const compond in compondsRequirements) {
        //check amount
        let amount = compondsRequirements[compond][1] - storage.store[compond];
        if(amount < 100) {
            continue;
        }

        return {compond, amount};
    }

    return {};
};

// create labTasks if there are enough resources in the storage (recursive dfs-POT)
// return value: false/array
var createLabTasks = function(storage, resourceType, amount, reactantAmount = {}) {
    if(amount > 5000) amount = 5000;
    if(amount < 5) amount = 5;

    // for base reactants, check if enough
    if(!reactionResources[resourceType]) {
        let short = (reactantAmount[resourceType]? reactantAmount[resourceType] : 0) + amount - storage.store[resourceType];
        if(short <= 0) return [];
        else return false;
    }

    let taskList = [];
    for(const i in reactionResources[resourceType]) {
        let reactant = reactionResources[resourceType][i];
        let short = (reactantAmount[reactant]? reactantAmount[reactant] : 0) + amount - storage.store[reactant];
        // need sub reaction
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

    if(task.amount <= 0) {
        room.memory.tasks.labTasks.shift();
        room.memory.labStatus = 0;
        return;
    }
    
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