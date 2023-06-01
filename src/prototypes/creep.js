const { roomInfo } = require("../config");
const { L } = require("../config/roomResourceConfig");
const { boostCreep } = require("../structures/lab");

Creep.prototype.sayHello = function sayHello(words="Hello") {
    this.say(words, true);
}

Creep.prototype.damaged = function() {
    return this.hits < this.hitsMax;
}

Creep.prototype.moveToNoCreep = function(target) {
    if(this.isStuck()) {
        this.moveTo(target, {reusePath: 20});
    }
    this.moveTo(target, {reusePath: 50, ignoreCreeps: true});
}

Creep.prototype.moveToNoCreepInRoom = function(target) {
    if(this.isStuck()) {
        this.moveTo(target, {maxRooms: 1});
    }
    this.moveTo(target, {reusePath: 50, ignoreCreeps: true, maxRooms: 1});
}

Creep.prototype.moveToRoom = function(roomName) {
    if(this.isStuck()) {
        this.moveTo(new RoomPosition(25, 25, roomName));
    }
    return this.moveToNoCreep(new RoomPosition(25, 25, roomName));
}

Creep.prototype.moveToRoomAdv = function(roomName) {
    // return true if its moving to the target room
    if (roomName && roomName != this.room.name) {
        this.moveToNoCreep(new RoomPosition(25, 25, roomName));
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
    if(this.memory.status && this.store.getUsedCapacity() === 0 && this.store.getCapacity() > 0) {
        this.memory.status = 0;
        // this.say('🔄 harvest');
    }
    if(!this.memory.status && this.store.getFreeCapacity() === 0) {
        this.memory.status = 1;
        // this.say('home');
    }
}

Creep.prototype.workerSetStatusWithAction = function(onHarvest=null, onWork=null) {
    // set status: 0. harvest  1. work 
    if(this.memory.status && this.store.getUsedCapacity() == 0) {
        this.memory.status = 0;
        if(onHarvest) onHarvest();
        // this.say('🔄 harvest');
    }
    if(!this.memory.status && this.store.getFreeCapacity() == 0) {
        this.memory.status = 1;
        if(onWork) onWork();
        // this.say('home');
    }
}

// same as takeEnergy but no storage (only used in carrier)
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

    // find containers (exclude near controller containers)
    var container = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: structure => (
        structure.structureType == STRUCTURE_CONTAINER && 
        !structure.pos.inRangeTo(this.room.controller.pos, 3) &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getCapacity() / 2
        )});

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

    return false;
}

Creep.prototype.harvestEnergy = function harvestEnergy() {
    // todo:
    // add targetRoom option, to create harvest path before enter the target room.
    let source;
    let result;
    if (this.memory.target != undefined) {
        source = this.room.find(FIND_SOURCES)[this.memory.target];
    }
    else {
        this.say('!target')
        source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    }

    if(!source) {
        console.log(this.name)
        return ERR_NOT_FOUND;
    }

    if(!this.pos.inRangeTo(source.pos, 1)) {
        this.moveToNoCreepInRoom(source);
        result = ERR_NOT_IN_RANGE;
    }
    else {
        let links = this.pos.findInRange(FIND_STRUCTURES, 1, {filter: struct => struct.structureType == STRUCTURE_LINK && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
        if(links.length > 0) {
            result = this.harvest(source);
            if(links.length > 0 && (this.store.getFreeCapacity() < 20 || this.ticksToLive < 2 || result == ERR_NOT_ENOUGH_RESOURCES)) {
                this.transfer(links[0], RESOURCE_ENERGY);
            }
        }
        // if not near link, move to container / check if container is full
        else {
            let contianer = this.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => (
                struct.structureType == STRUCTURE_CONTAINER &&
                struct.pos.inRangeTo(source.pos, 1)
            )});
            if(contianer) {
                if(!contianer.pos.isEqualTo(this.pos)) this.moveTo(contianer);
                if(contianer.store.getFreeCapacity() > 0) result = this.harvest(source);
                else result = ERR_NOT_ENOUGH_RESOURCES;
            }
            else {
                result = this.harvest(source);
            }
        }
    }

    return result;
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
    var dropedResource = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount >= this.store.getCapacity()});
    if (dropedResource) {
        if(this.pickup(dropedResource) == ERR_NOT_IN_RANGE) {
            this.moveToNoCreepInRoom(dropedResource);
        }
        return;
    }

    // container & storage
    let targets = _.filter(this.room.find(FIND_STRUCTURES), structure => (
        (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && 
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity()));
    let target = this.pos.findClosestByRange(targets);
    if (target) {
        if(this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveToNoCreepInRoom(target);
        }
        return;
    }

    // if no resources
    this.toResPos();
}

Creep.prototype.takeEnergyFromControllerLink = function() {
    if(this.memory.ControllerLinkId) {
        let target = Game.getObjectById(this.memory.ControllerLinkId);
        let result = this.withdraw(target, RESOURCE_ENERGY);
        
        if(result == ERR_NOT_IN_RANGE) this.moveTo(target);
        else if(result == OK) this.memory.status = 1;
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

// call every time
Creep.prototype.isStuck = function() {
    let stuck = false;

    if(this.memory.lastPos === undefined || this.memory.lastPos.x != this.pos.x && this.memory.lastPos.x != this.pos.x) {
        this.memory.lastPos = {x: this.pos.x, y: this.pos.y, t: 0};
    }
    else {
        if(this.memory.lastPos.t > 1) { // stuck for 1 tick
            stuck = true;   
        }
        if(this.fatigue == 0) {
            this.memory.lastPos.t += 1;
        }

    }
    return stuck;
}

Creep.prototype.isAtEdge = function() {
    let pos = this.pos;
	return pos.x == 0 || pos.y == 0 || pos.x == 49 || pos.y == 49;
}

Creep.prototype.generateBody = function(bodyDesign) {
    let body = [];
    for(const bodyType of bodyDesign) {
        body.push(...new Array(bodyType[1]).fill(bodyType[0]));
    }

    return body;
}

Creep.prototype.getBoosts = function() {
    // check spawning
    if(this.spawning) return;

    // boostInfo = {resourceType: bodyPartCount, ...}
    const boostInfo = this.memory.boostInfo;
    const room = Game.rooms[this.memory.base];
    const boostLabs = room.memory.labs.boostLab;
    // check lab & compund amount
    for(const resourceType in boostInfo) {
        let amount = boostInfo[resourceType] * 30;
        let labId = _.find(Object.keys(boostLabs), labId => boostLabs[labId].resourceType === resourceType && boostLabs[labId].amount >= amount);
        let lab = Game.getObjectById(labId);
        if(!lab || !lab.isActive()) {
            this.memory.boost = false;
            return;
        }
    }

    // getBoost
    for(const resourceType in boostInfo) {
        let lab = Game.getObjectById(_.find(Object.keys(boostLabs), labId => boostLabs[labId].resourceType === resourceType));
        if(!lab || !lab.isActive()) {
            this.memory.boost = false;
            return;
        }
        
        let result = boostCreep(lab, this, resourceType, boostInfo[resourceType]);
        if (result === ERR_NOT_IN_RANGE) this.moveTo(lab);
        else if(result === OK) {
            delete boostInfo[resourceType];
        }
        return;
    }

    this.memory.boosted = true;
}

Creep.prototype.unBoost = function() {
    let labContainer = Game.getObjectById(this.room.memory.labContainer);
    if(!labContainer) {
        let lab = this.room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType === STRUCTURE_LAB})[0];
        if(lab) {
            let labContainer = lab.pos.findInRange(FIND_STRUCTURES, 3, {filter: struct => struct.structureType === STRUCTURE_CONTAINER})[0];
            if(labContainer) this.room.memory.labContainer = labContainer.id;
        }

        return false;
    }
    else {
        if(this.memory.unboosted === true) {
            this.suicide();
            return true;
        }

        if(this.pos.isEqualTo(labContainer)) {
            let nearLabs = this.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: struct => struct.structureType === STRUCTURE_LAB && struct.cooldown <= this.ticksToLive});
            if(nearLabs.length) {
                nearLabs.sort((a, b) => a.cooldown - b.cooldown);
                if(nearLabs[0].unboostCreep(this) === OK) this.memory.unboosted = true;
            }
            else this.suicide();
        }
        else {
            this.moveToNoCreepInRoom(labContainer);
        }

        return true;
    }
}

Creep.prototype.fleeFrom = function(target) {
    let targetPos;
    if(!target) return false;
    if(!target.pos) targetPos = target;
    else targetPos = target.pos;


    this.say('flee');

    const xDis = this.pos.x - targetPos.x;
    const yDis = this.pos.y - targetPos.y;
    
    if(xDis > 0) {
        if(yDis > 0) {
            this.move(BOTTOM_RIGHT);
        }
        else if(yDis === 0) {
            this.move(RIGHT);
        }
        else {
            this.move(TOP_RIGHT);
        }
    }
    else if(xDis === 0) {
        if(yDis > 0) {
            this.move(BOTTOM);
        }
        else {
            this.move(TOP);
        }
    }
    else {
        if(yDis > 0) {
            this.move(BOTTOM_LEFT);
        }
        else if(yDis === 0) {
            this.move(RIGHT);
        }
        else {
            this.move(TOP_LEFT);
        }
    }

    return true;
}