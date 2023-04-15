var taskModels = {
    ManagerTask: function(from, to, resourceType, volume, priority=0) {
        this.from = from;
        this.to = to;
        this.resourceType = resourceType;
        this.volume = volume;
        this.priority = priority;
    }
}

module.exports = taskModels;