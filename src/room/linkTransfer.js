function linkTransfer(room) {
    if (roomInfo[room.name] == undefined || roomInfo[room.name].managerPos == undefined) {
        return;
    }

    // find different links
    let links = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LINK});
    let sources = room.find(FIND_SOURCES);

    let managerLink;
    let sourceLinks = [];
    let controllerLink;
    _.forEach(links, link => {
        // managerLink
        if(link.pos.inRangeTo(roomInfo[room.name].managerPos, 1)) {
            managerLink = link;
        }

        // sourceLink
        _.forEach(sources, source => {
            if(link.pos.inRangeTo(source.pos, 2)) {
                sourceLinks.push(link);
                return;
            }
        })

        // controllerLink
        if(link.pos.inRangeTo(room.controller.pos, 2)) {
            controllerLink = link;
        }
    });

    //check source, manager links completeness
    room.memory.linkCompleteness = (sourceLinks.length == room.find(FIND_SOURCES).length && managerLink) ? true : false;

    
    // check link existence
    if(sourceLinks.length > 0 && controllerLink && managerLink) {
        // 1. source to controller
        if(controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) < 100) {
            for(let i in sourceLinks) {
                let link = sourceLinks[i];
                if(link.store.getUsedCapacity(RESOURCE_ENERGY) > 700) {
                    link.transferEnergy(controllerLink);
                    break;
                }
            }
        }
        // 2. source to manager
        else if(managerLink.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            for(let i in sourceLinks) {
                let link = sourceLinks[i];
                if(link.store.getUsedCapacity(RESOURCE_ENERGY) > 750) {
                    link.transferEnergy(managerLink);
                    break;
                }
            }
        }

        // 3. manager to controller
        if(controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            let link = managerLink;
            if(link.store.getUsedCapacity(RESOURCE_ENERGY) > 700) {
                link.transferEnergy(controllerLink);
            }
        }
    }
    else if(sourceLinks.length > 0 && managerLink) {
        // source to manager
        if(managerLink.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            for(let i in sourceLinks) {
                let link = sourceLinks[i];
                if(link.store.getUsedCapacity(RESOURCE_ENERGY) > 750) {
                    link.transferEnergy(managerLink);
                    break;
                }
            }
        }
    }
    else if(managerLink && controllerLink) {
        // 3. manager to controller
        if(controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            let link = managerLink;
            if(link.store.getUsedCapacity(RESOURCE_ENERGY) > 700) {
                link.transferEnergy(controllerLink);
            }
        }
    }

}

function updateMemory(room) {
    // find different links
    room.memory.linkInfo = {}
    let links = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LINK});
    room.memory.linkInfo.sourceLinks = [];
    let sources = room.find(FIND_SOURCES);

    _.forEach(links, link => {
        // managerLink
        if(link.pos.inRangeTo(roomInfo[room.name].managerPos, 1)) {
            room.memory.linkInfo.managerLink = link.id;
        }

        // sourceLink
        _.forEach(sources, source => {
            if(link.pos.inRangeTo(source.pos, 2)) {
                room.memory.linkInfo.sourceLinks.push(link.id);
                return;
            }
        })

        // controllerLink
        if(link.pos.inRangeTo(room.controller.pos, 2)) {
            room.memory.linkInfo.controllerLink = link.id;
        }
    });

    console.log('room link memory updated');
}

module.exports = linkTransfer;