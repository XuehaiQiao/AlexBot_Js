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

Room.prototype.addToBoostLab = function(boostInfo) {
    if(this.controller.level < 6) return;
    if(!this.memory.labs || !this.memory.labs.center) return;
    
    let boostLab = this.memory.labs.boostLab;
    if(!boostLab) this.memory.labs.boostLab = {};

    let addSet = {};
    for(const resourceType in boostInfo) {
        // check resource amount;
        let totalResourceAmount = 0
        if(this.storage) totalResourceAmount += this.storage.store[resourceType];
        if(this.terminal) totalResourceAmount += this.terminal.store[resourceType];
        if(totalResourceAmount < boostInfo[resourceType] * 30) return;
        
        // check available labs 
        const resourceInfo = {resourceType: resourceType, amount: boostInfo[resourceType] * 30};

        const boostLabId = _.find(Object.keys(boostLab), labId => boostLab[labId].resourceType === resourceType);
        let lab = Game.getObjectById(boostLabId);
        if(lab && lab.isActive()) {
            addSet[boostLabId] = resourceInfo;
        }
        else {
            avaliableLabs = this.find(FIND_MY_STRUCTURES, {filter: struct => (
                struct.structureType === STRUCTURE_LAB &&
                struct.isActive() &&
                !this.memory.labs.center.includes(struct.id) &&
                !this.memory.labs.boostLab[struct.id] &&
                !addSet[struct.id]
            )});

            if(avaliableLabs.length) {
                addSet[avaliableLabs[0].id] = resourceInfo;
            }
            else return;
        }
    }

    // add to boostLab object
    for(const labId in addSet) {
        if(boostLab[labId]) boostLab[labId].amount += addSet[labId].amount;
        else boostLab[labId] = addSet[labId];
    }
}

Room.prototype.reduceFromBoostLab = function(labId, resourceType, amount) {
    if(!this.memory.labs || !this.memory.labs.boostLab) return false;

    const resourceInfo = this.memory.labs.boostLab[labId]
    if(!resourceInfo) return false;
    if(resourceInfo.resourceType !== resourceType) return false;

    if(resourceInfo.amount <= amount) delete this.memory.labs.boostLab[labId];
    else resourceInfo.amount -= amount;

    return true;
}