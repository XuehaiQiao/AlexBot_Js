const { roomInfo } = require("../config");

module.exports = function(room) {
    if (!roomInfo[room.name] || !roomInfo[room.name].managerPos) {
        return;
    }

    // updateLinkInfo
    if(!room.memory.linkInfo) updateLinkInfo(room);
    if(Game.time % 100 === 69) updateLinkInfo(room);

    // check memory 
    const linkInfo = room.memory.linkInfo;
    let managerLink = Game.getObjectById(linkInfo.managerLink);
    let sourceLinks = _.map(linkInfo.sourceLinks, linkId => Game.getObjectById(linkId));
    let controllerLink = Game.getObjectById(linkInfo.controllerLink);
    
    let update = false;
    if(linkInfo.managerLink && !managerLink) update = true;
    if(linkInfo.controllerLink && !controllerLink) update = true;
    for(const i in sourceLinks) {
        if(linkInfo.sourceLinks[i] && !sourceLinks[i]) update = true;
    }
    if(update) updateLinkInfo(room);

    // check memory's integrity
    if(sourceLinks.length && managerLink) source2manager(sourceLinks, managerLink);
    if(sourceLinks.length && controllerLink) source2controller(sourceLinks, controllerLink);
    if(managerLink && controllerLink) manager2controller(managerLink, controllerLink);
}

function source2manager(sourceLinks, managerLink) {
    if(managerLink.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        for(const link of sourceLinks) {
            if(link.store.getUsedCapacity(RESOURCE_ENERGY) > 750) {
                link.transferEnergy(managerLink);
                return;
            }
        }
    }
}

function source2controller(sourceLinks, controllerLink) {
    if(controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) <= 200) {
        for(const link of sourceLinks) {
            if(link.store.getUsedCapacity(RESOURCE_ENERGY) >= 600) {
                link.transferEnergy(controllerLink);
                return;
            }
        }
    }
}

function manager2controller(managerLink, controllerLink) {
    if(controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) < 100) {
        if(managerLink.store.getUsedCapacity(RESOURCE_ENERGY) > 700) {
            managerLink.transferEnergy(controllerLink);
        }
    }
}

function updateLinkInfo(room) {
    // reset linkInfo
    room.memory.linkInfo = {};
    const linkInfo = room.memory.linkInfo;
    linkInfo.sourceLinks = [];

    let links = room.find(FIND_MY_STRUCTURES, {filter: struct => struct.structureType == STRUCTURE_LINK});
    let sources = room.find(FIND_SOURCES);

    _.forEach(links, link => {
        // managerLink
        if(link.pos.inRangeTo(roomInfo[room.name].managerPos, 1)) {
            linkInfo.managerLink = link.id;
        }

        // sourceLink
        _.forEach(sources, source => {
            if(link.pos.inRangeTo(source.pos, 2)) {
                linkInfo.sourceLinks.push(link.id);
                return;
            }
        })

        // controllerLink
        if(link.pos.inRangeTo(room.controller.pos, 2)) {
            linkInfo.controllerLink = link.id;
        }
    });

    //check source, manager links completeness
    room.memory.linkCompleteness = (linkInfo.sourceLinks.length === sources.length && linkInfo.managerLink) ? true : false;
};