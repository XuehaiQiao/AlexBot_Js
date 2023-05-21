module.exports = {
    boostCreep: function(lab, creep, resourceType, bodyPartCount) {
        if(!lab.store[resourceType] || lab.store[resourceType] < bodyPartCount * 30) return ERR_NOT_ENOUGH_RESOURCES;
        if(lab.store[RESOURCE_ENERGY] < bodyPartCount * 20) return ERR_NOT_ENOUGH_ENERGY
        const result = lab.boostCreep(creep, bodyPartCount);

        if(result === OK) {
            lab.room.reduceFromBoostLab(lab.id, resourceType, bodyPartCount * 30);
        }

        return result;
    },

}