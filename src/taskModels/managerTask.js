class managerTask {
    constructor(from, to, resourceType, volume, priority=0) {
        this.from = from;
        this.to = to;
        this.resourceType = resourceType;
        this.volume = volume;
        this.priority = priority;
    }
}