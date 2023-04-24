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