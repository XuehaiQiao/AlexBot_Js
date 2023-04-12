Creep.prototype.sayHello = function sayHello(words="Hello") {
    this.say(words, true);
}

Creep.prototype.damaged = function() {
    return this.hits < this.hitsMax;
}

Creep.prototype.moveToRoom = function(roomName) {
    return this.moveTo(new RoomPosition(25, 25, roomName), {reusePath: 20});
}

Creep.prototype.moveToRoomAdv = function(roomName) {
    // return true if its moving to the target room
    if (roomName && roomName != this.room.name) {
        this.moveTo(new RoomPosition(25, 25, roomName), {reusePath: 20});
        return true;
    }
    // move 1 more step to leave the room edge
    if (this.pos.x == 0) {
        this.move(RIGHT);
        return true;
    }
    if (this.pos.x == 49) {
        this.move(LEFT);
        return true;
    }
    if (this.pos.y == 0) {
        this.move(BOTTOM);
        return true;
    }
    if (this.pos.y == 49) {
        this.move(TOP);
        return true;
    }

    return false;
}

Creep.prototype.workerSetStatus = function() {
    // set status: 0. harvest  1. work 
    if(this.memory.status && this.store.getUsedCapacity() == 0) {
        this.memory.status = 0;
        // this.say('🔄 harvest');
    }
    if(!this.memory.status && this.store.getFreeCapacity() == 0) {
        this.memory.status = 1;
        // this.say('home');
    }
}

// same as takeEnergy but no storage
Creep.prototype.collectEnergy = function collectEnergy(changeStatus=false) {
    // first find droped resource
    var dropedResource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount > this.store.getCapacity() / 2});
    if (dropedResource) {
        let result = this.pickup(dropedResource);
        if(result == ERR_NOT_IN_RANGE) {
            this.moveTo(dropedResource);
        }
        else if(changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }

    // if every source have adjacent link, stop getting energy from container
    if(this.room.memory.linkCompleteness == true) {
        return false;
    }

    // find containers
    var container = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getCapacity() / 2});
    if (container) {
        // var resourceType = _.find(Object.keys(container.store), resource => container.store[resource] > 0);
        let resourceType = RESOURCE_ENERGY;
        let result = this.withdraw(container, resourceType);
        if(result == ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
        else if(changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }

    // find tomstone
    var tomstone = _.find(this.room.find(FIND_TOMBSTONES), ts => ts.store[RESOURCE_ENERGY] > this.store.getCapacity() / 2);
    if (tomstone) {
        let result = this.withdraw(tomstone, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            this.moveTo(tomstone);
        }
        else if(changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }

    // temperarily dismissed to save a little cpu
    // // find ruins
    // var sourceRuin = _.find(this.room.find(FIND_RUINS), ruin => ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
    // if (sourceRuin) {
    //     // var resourceType = _.find(Object.keys(sourceRuin.store), resource => sourceRuin.store[resource] > 0);
    //     if(this.withdraw(sourceRuin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //         this.moveTo(sourceRuin, {visualizePathStyle: {stroke: '#ffffff'}});
    //     }
    //     return;
    // }

    // if no resources
    // this.toResPos();

    return false;
}

Creep.prototype.harvestEnergy = function harvestEnergy(remote=false) {
    var source;
    if (this.memory.target != undefined) {
        source = this.room.find(FIND_SOURCES)[this.memory.target];
    }
    else {
        source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    }

    if(this.harvest(source) == ERR_NOT_IN_RANGE) {
        this.moveTo(source, {reusePath: 10});
    }
    else {
        let link = this.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => struct.structureType == STRUCTURE_LINK && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
        if (link.length > 0) {
            this.transfer(link[0], RESOURCE_ENERGY);
            return;
        }
        let container = this.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => struct.structureType == STRUCTURE_CONTAINER && struct.store.getFreeCapacity() > 0});
        if (container.length > 0) {
            this.transfer(container[0], RESOURCE_ENERGY);
            return;
        }
    }
}

Creep.prototype.takeEnergyFromStorage = function takeEnergyFromStorage() {
    // find storage
    var storage = this.room.storage;
    if (storage && storage.store.getUsedCapacity() > this.store.getFreeCapacity()) {
        // var resourceType = _.find(Object.keys(container.store), resource => container.store[resource] > 0);
        var resourceType = RESOURCE_ENERGY;
        if(this.withdraw(storage, resourceType) == ERR_NOT_IN_RANGE) {
            this.moveTo(storage);
        }
        return;
    }
}


Creep.prototype.takeEnergyFromClosest = function takeEnergyFromClosest() {
    // first find droped resource
    var dropedResource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount > this.store.getCapacity() / 2});
    if (dropedResource) {
        if(this.pickup(dropedResource) == ERR_NOT_IN_RANGE) {
            this.moveTo(dropedResource);
        }
        return;
    }

    // container & storage
    let targets = _.filter(this.room.find(FIND_STRUCTURES), structure => (
        (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && 
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity()));
    let target = this.pos.findClosestByPath(targets);
    if (target) {
        if(this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
        return;
    }

    // if no resources
    this.toResPos();
}

Creep.prototype.takeEnergyFromControllerLink = function takeEnergyFromControllerLink() {
    if(this.memory.ControllerLinkId) {
        let target = Game.getObjectById(this.memory.ControllerLinkId);
        if(this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }
    else {
        let controllerLinkArray = this.room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LINK && struct.pos.inRangeTo(this.room.controller.pos, 2)});
        if(controllerLinkArray.length) {
            this.memory.ControllerLinkId = controllerLinkArray[0].id;
        }
        else {
            this.takeEnergyFromClosest();
        }
    }
}

Creep.prototype.toResPos = function toResPos(restTime=5) {
    if (roomInfo[this.room.name]) {
        if (this.pos.isNearTo(roomInfo[this.room.name].restPos)) {
            this.memory.restTime = restTime;
        }
        else {
            this.moveTo(roomInfo[this.room.name].restPos);
        }
        
    }
    
}