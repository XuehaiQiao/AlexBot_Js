Room.prototype.needStorage2Terminal = function(managerCreep) {
    return _.find(Object.keys(this.storage.store), resourceType => this.storage.store[resourceType] > 100000 && resourceType != RESOURCE_ENERGY);
}