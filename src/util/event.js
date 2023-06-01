module.exports = {
    init: function () {
        Memory.events = {
            foundEnemyRooms: [],
            dyingCreepRooms: [],
        };
        
        _.forEach(Game.rooms, r => {
            const hostileCreeps = r.find(FIND_HOSTILE_CREEPS, { filter: c => c.owner.username !== 'Source Keeper' });
            if(hostileCreeps.length) {
                console.log(r, "Found Enemies!");
                this.roomFoundEnemy(r);
            }
        });
    },

    roomFoundEnemy: function (room) {
        Memory.events.foundEnemyRooms.push(room.name);
    },

    roomCreepDying: function (roomName) {
        Memory.events.dyingCreepRooms.push(roomName);
    },

    checkEnemy: function (roomName) {
        return Memory.events.foundEnemyRooms.includes(roomName)
    },

    checkCreepDying: function (roomName) {
        return Memory.events.dyingCreepRooms.includes(roomName)
    },
}