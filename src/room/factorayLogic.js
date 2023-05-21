module.exports = function(room) {
    if(room.level < 7) return;
    let factory = _.find(room.find(FIND_MY_STRUCTURES), struct => struct.structureType === STRUCTURE_FACTORY);
    if(!factory) return;

    if(factory.store[RESOURCE_PURIFIER] >= 100 && factory.cooldown === 0) {
        factory.produce('X');
    }
}