const { roomInfo } = require("../config");
const { KEEPER } = require("../constants/roomTypes");
const { wall } = require("../structures");
const { boostCreep } = require("../structures/lab");
const { inRoomUtil, roomUtil } = require("../util");

Creep.prototype.sayHello = function sayHello(words = "Hello") {
    this.say(words, true);
}

Creep.prototype.damaged = function () {
    return this.hits < this.hitsMax;
}

Creep.prototype.moveToNoCreep = function (target) {
    this.travelTo(target, { allowHostile: true, allowSK: true });
    // if (this.isStuck()) {
    //     this.moveTo(target, { reusePath: 20 });
    // }
    // this.moveTo(target, { reusePath: 50, ignoreCreeps: true });
}

Creep.prototype.moveToNoCreepInRoom = function (target) {
    this.travelTo(target, { maxRooms: 1, allowHostile: true, allowSK: true });
    // if (this.isStuck()) {
    //     this.moveTo(target, { maxRooms: 1 });
    // }
    // this.moveTo(target, { reusePath: 50, ignoreCreeps: true, maxRooms: 1 });
}

Creep.prototype.moveToRoom = function (roomName) {
    return this.travelTo(new RoomPosition(25, 25, roomName), { allowHostile: true, allowSK: true, ensurePath: true, });
}

Creep.prototype.moveToRoomAdv = function (roomName) {
    // return true if its moving to the target room
    if (roomName && roomName != this.room.name) {
        this.travelTo(new RoomPosition(25, 25, roomName), { allowSK: true, ensurePath: true, });
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

Creep.prototype.leaveEdge = function () {
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

Creep.prototype.workerSetStatus = function () {
    // set status: 0. harvest  1. work 
    if (this.memory.status && this.store.getUsedCapacity() === 0 && this.store.getCapacity() > 0) {
        this.memory.status = 0;
        // this.say('🔄 harvest');
    }
    if (!this.memory.status && this.store.getFreeCapacity() === 0) {
        this.memory.status = 1;
        // this.say('home');
    }
}

Creep.prototype.workerSetStatusWithAction = function (onHarvest = null, onWork = null) {
    // set status: 0. harvest  1. work 
    if (this.memory.status && this.store.getUsedCapacity() == 0) {
        this.memory.status = 0;
        if (onHarvest) onHarvest();
        // this.say('🔄 harvest');
    }
    if (!this.memory.status && this.store.getFreeCapacity() == 0) {
        this.memory.status = 1;
        if (onWork) onWork();
        // this.say('home');
    }
}

// same as takeEnergy but no storage (only used in carrier)
Creep.prototype.collectEnergy = function collectEnergy(changeStatus = false) {
    // first find droped resource
    var dropedResource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: resource =>
            resource.resourceType == RESOURCE_ENERGY &&
            !resource.pos.inRangeTo(this.room.controller.pos, 4) &&
            resource.amount > this.store.getCapacity() / 2
    });
    if (dropedResource) {
        let result = this.pickup(dropedResource);
        if (result == ERR_NOT_IN_RANGE) {
            this.moveTo(dropedResource);
        }
        else if (changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }

    // if every source have adjacent link, stop getting energy from container
    if (this.room.memory.linkCompleteness == true) {
        return false;
    }

    // find containers (exclude near controller containers && storage container)
    var container = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => (
            structure.structureType == STRUCTURE_CONTAINER &&
            !structure.pos.inRangeTo(this.room.controller.pos, 3) &&
            !(roomInfo[this.room.name] && roomInfo[this.room.name].storagePos && structure.pos.isEqualTo(roomInfo[this.room.name].storagePos)) &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getCapacity() / 2
        )
    });

    if (container) {
        // var resourceType = _.find(Object.keys(container.store), resource => container.store[resource] > 0);
        let resourceType = RESOURCE_ENERGY;
        let result = this.withdraw(container, resourceType);
        if (result == ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
        else if (changeStatus && result == OK) {
            this.memory.status = 1;
        }
        return true;
    }

    // find tomstone
    var tomstone = _.find(this.room.find(FIND_TOMBSTONES), ts => ts.store[RESOURCE_ENERGY] > this.store.getCapacity() / 2);
    if (tomstone) {
        let result = this.withdraw(tomstone, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            this.moveTo(tomstone);
        }
        else if (changeStatus && result == OK) {
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

Creep.prototype.harvestEnergy = function () {
    // todo:
    // add targetRoom option, to create harvest path before enter the target room.
    let source;
    let result;
    if (this.memory.target != null) {
        source = this.room.find(FIND_SOURCES)[this.memory.target];
    }
    else {
        this.say('!target')
        source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    }

    if (!source) {
        console.log(this.name)
        return ERR_NOT_FOUND;
    }

    let link = source.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: struct => (
            struct.structureType === STRUCTURE_LINK &&
            struct.pos.inRangeTo(source.pos, 2)
        )
    });
    let contianer = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: struct => (
            struct.structureType === STRUCTURE_CONTAINER &&
            struct.pos.inRangeTo(source.pos, 1)
        )
    });


    if (link) {
        result = this.harvest(source);
        let avaliablePoses = _.filter(inRoomUtil.getAdjPos(source.pos), pos => (
            pos.isNearTo(link) &&
            pos.lookFor(LOOK_TERRAIN)[0] !== 'wall' &&
            _.filter(pos.lookFor(LOOK_STRUCTURES), struct => (
                struct.structureType !== STRUCTURE_ROAD &&
                struct.structureType !== STRUCTURE_CONTAINER &&
                (struct.structureType !== STRUCTURE_RAMPART || !struct.my)
            )).length === 0
        ))

        let target = this.pos.findClosestByPath(avaliablePoses);
        if (!source.pos.isNearTo(this.pos)) this.moveToNoCreepInRoom(target);
        else if (this.store.getFreeCapacity() < 20 || this.ticksToLive < 2 || result == ERR_NOT_ENOUGH_RESOURCES) {
            if (this.transfer(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveToNoCreepInRoom(link);
            }
        }
    }
    else if (contianer) {
        if (!contianer.pos.isEqualTo(this.pos)) this.moveToNoCreepInRoom(contianer);
        if (contianer.store.getFreeCapacity() > 0) result = this.harvest(source);
        else result = ERR_NOT_ENOUGH_RESOURCES;
    }
    else {
        if (!this.pos.isNearTo(source)) {
            this.moveToNoCreepInRoom(source);
            result = ERR_NOT_IN_RANGE;
        }
        else {
            result = this.harvest(source);
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
        if (this.withdraw(storage, resourceType) == ERR_NOT_IN_RANGE) {
            this.moveTo(storage);
        }
        return;
    }
}


Creep.prototype.takeEnergyFromClosest = function () {
    // first find droped resource
    let dropedEnergys = this.room.find(FIND_DROPPED_RESOURCES, { filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount >= this.store.getCapacity() });
    let stores = this.room.find(FIND_STRUCTURES, {
        filter: structure =>
            (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity()
    });

    let targets = [...dropedEnergys, ...stores];
    let target = this.pos.findClosestByRange(targets);
    if (!target) {
        this.toResPos();
        return false;
    }
    else if (target.amount) {
        if (this.pickup(target) == ERR_NOT_IN_RANGE) {
            this.moveToNoCreepInRoom(target);
        }
        return true;
    }
    else {
        if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveToNoCreepInRoom(target);
        }
        return true;
    }

    // var dropedResource = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: resource => resource.resourceType == RESOURCE_ENERGY && resource.amount >= this.store.getCapacity() });
    // if (dropedResource) {
    //     if (this.pickup(dropedResource) == ERR_NOT_IN_RANGE) {
    //         this.moveToNoCreepInRoom(dropedResource);
    //     }
    //     return;
    // }

    // // container & storage
    // let targets = _.filter(this.room.find(FIND_STRUCTURES), structure => (
    //     (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
    //     structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity()));
    // let target = this.pos.findClosestByRange(targets);
    // if (target) {
    //     if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //         this.moveToNoCreepInRoom(target);
    //     }
    //     return;
    // }

    // // if no resources
    // this.toResPos();
}

Creep.prototype.takeEnergyFromClosestStore = function () {
    // container & storage
    let targets = _.filter(this.room.find(FIND_STRUCTURES), structure => (
        (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity() &&
        !structure.pos.findInRange(FIND_SOURCES, 1).length
    ));

    let target = this.pos.findClosestByRange(targets);
    if (target) {
        if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveToNoCreepInRoom(target);
        }
        return true;
    }

    // if no resources
    this.toResPos();

    return false;
}

Creep.prototype.takeEnergyNeerController = function () {
    // first find droped resource
    let dropedResource = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
        filter: resource =>
            resource.resourceType == RESOURCE_ENERGY &&
            resource.pos.inRangeTo(this.room.controller, 4)
    });
    if (dropedResource) {
        let result = this.pickup(dropedResource)
        if (result === ERR_NOT_IN_RANGE) {
            this.moveTo(dropedResource);
        }
        else if (result === OK) {
            this.memory.status = 1;
        }
        return true;
    }

    // container
    let container = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: struct =>
            struct.structureType === STRUCTURE_CONTAINER &&
            struct.pos.inRangeTo(this.room.controller, 3) &&
            struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    })
    if (container) {
        let result = this.withdraw(container, RESOURCE_ENERGY);
        if (result === ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
        else if (result === OK) {
            this.memory.status = 1;
        }
        return true;
    }

    return false;
}

Creep.prototype.takeEnergyFromControllerLink = function () {
    if (this.memory.ControllerLinkId) {
        let target = Game.getObjectById(this.memory.ControllerLinkId);
        let result = this.withdraw(target, RESOURCE_ENERGY);

        if (result == ERR_NOT_IN_RANGE) this.moveTo(target);
        else if (result == OK) this.memory.status = 1;
    }
    else {
        let controllerLinkArray = this.room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_LINK && struct.pos.inRangeTo(this.room.controller.pos, 2) });
        if (controllerLinkArray.length) {
            this.memory.ControllerLinkId = controllerLinkArray[0].id;
        }
        else {
            this.takeEnergyFromClosest();
        }
    }
}

Creep.prototype.toResPos = function (restTime = 5) {
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
Creep.prototype.isStuck = function () {
    let stuck = false;

    if (this.memory.lastPos === undefined || this.memory.lastPos.x != this.pos.x && this.memory.lastPos.x != this.pos.x) {
        this.memory.lastPos = { x: this.pos.x, y: this.pos.y, t: 0 };
    }
    else {
        if (this.memory.lastPos.t > 1) { // stuck for 1 tick
            stuck = true;
        }
        if (this.fatigue == 0) {
            this.memory.lastPos.t += 1;
        }

    }
    return stuck;
}

Creep.prototype.isAtEdge = function () {
    let pos = this.pos;
    return pos.x == 0 || pos.y == 0 || pos.x == 49 || pos.y == 49;
}

Creep.prototype.generateBody = function (bodyDesign) {
    let body = [];
    for (const bodyType of bodyDesign) {
        body.push(...new Array(bodyType[1]).fill(bodyType[0]));
    }

    return body;
}

Creep.prototype.getBoosts = function () {
    // check spawning
    if (this.spawning) return;

    // boostInfo = {resourceType: bodyPartCount, ...}
    const boostInfo = this.memory.boostInfo;
    const room = Game.rooms[this.memory.base];
    if (!room.memory.labs || !room.memory.labs.boostLab) return;
    const boostLabs = room.memory.labs.boostLab;
    // check lab & compund amount
    for (const resourceType in boostInfo) {
        let amount = boostInfo[resourceType] * 30;
        let labId = _.find(Object.keys(boostLabs), labId => boostLabs[labId].resourceType === resourceType && boostLabs[labId].amount >= amount);
        let lab = Game.getObjectById(labId);
        if (!lab || !lab.isActive()) {
            this.memory.boost = false;
            return;
        }
    }

    this.say('boost!!');

    // getBoost
    for (const resourceType in boostInfo) {
        let lab = Game.getObjectById(_.find(Object.keys(boostLabs), labId => boostLabs[labId].resourceType === resourceType));
        if (!lab || !lab.isActive()) {
            this.memory.boost = false;
            return;
        }

        let result = boostCreep(lab, this, resourceType, boostInfo[resourceType]);
        console.log(result, resourceType, lab.pos);
        if (result === ERR_NOT_IN_RANGE) this.moveTo(lab);
        else if (result === OK) {
            delete boostInfo[resourceType];
        }
        return;
    }

    this.memory.boosted = true;
}

Creep.prototype.fleeFrom = function (target) {
    let targetPos;
    if (!target) return false;
    if (!target.pos) targetPos = target;
    else targetPos = target.pos;


    this.say('flee');

    const xDis = this.pos.x - targetPos.x;
    const yDis = this.pos.y - targetPos.y;

    if (xDis > 0) {
        if (yDis > 0) {
            this.move(BOTTOM_RIGHT);
        }
        else if (yDis === 0) {
            this.move(RIGHT);
        }
        else {
            this.move(TOP_RIGHT);
        }
    }
    else if (xDis === 0) {
        if (yDis > 0) {
            this.move(BOTTOM);
        }
        else {
            this.move(TOP);
        }
    }
    else {
        if (yDis > 0) {
            this.move(BOTTOM_LEFT);
        }
        else if (yDis === 0) {
            this.move(RIGHT);
        }
        else {
            this.move(TOP_LEFT);
        }
    }

    return true;
}

Creep.prototype.fleeFromAdv = function (goal, range) {
    let ret = PathFinder.search(this.pos, { pos: goal.pos, range: range }, {
        flee: true,
        maxRooms: 1,
    });

    let pos = ret.path[0];
    this.move(this.pos.getDirectionTo(pos));
}

Creep.prototype.travelToRoom = function (targetRoomName, allowSK = false) {
    if (!targetRoomName) return false;

    if (targetRoomName != this.room.name) {
        // check if next to the targetRoom
        let isNextTo = false;
        _.forEach(Game.map.describeExits(this.room.name), rN => {
            if (rN === targetRoomName) isNextTo = true;
        });

        if (isNextTo) {
            this.travelTo(new RoomPosition(25, 25, targetRoomName), { allowHostile: true, allowSK: allowSK });
        }
        else {
            this.travelTo(new RoomPosition(25, 25, targetRoomName), { allowSK: allowSK });
        }

        return true;
    }

    return false;
}

Creep.prototype.moveToRoomPassSK = function (targetRoomName) {
    if(!targetRoomName) return false;

    let ifRepath;
    if (roomUtil.getRoomType(this.room.name) === KEEPER) {
        if (!this.room.memory.skMatrix) {
            inRoomUtil.getSKMatrix(this.room.name);
            ifRepath = 1;
        }

        let invaderCore = this.room.find(FIND_HOSTILE_STRUCTURES, { filter: struct => struct.structureType === STRUCTURE_INVADER_CORE })[0];
        if (invaderCore) {
            this.room.memory.invaderCore = { level: invaderCore.level, endTime: Game.time + 75000 };
        }
    }

    if (this.room.name !== targetRoomName) {
        this.travelTo(new RoomPosition(25, 25, targetRoomName), {
            allowSK: true,
            roomCallback: (roomName, costMatrix) => {
                if (roomUtil.getRoomType(roomName) === KEEPER) {
                    let roomMemory = Memory.rooms[roomName];
                    if(roomMemory && roomMemory.invaderCore && roomMemory.invaderCore.endTime > Game.time) {
                        return false;
                    }
                    else return inRoomUtil.getSKMatrix(roomName);
                }
                
                return undefined;
            },
            repath: ifRepath,
            ensurePath: true,
        });
        
        return true;
    }

    return false;
}