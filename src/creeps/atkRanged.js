module.exports = {
    properties: {
        role: 'atkRanged',
    },

    /** @param {Creep} creep **/
    run: function(creep) {

    },

    // checks if the room needs to spawn a creep
    spawn: function(room, targetRoomName, opt) {
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room, targetRoomName) {
        let name = this.properties.role + Game.time % 10000;
        let body = []
        let memory = {
            role: this.properties.role, 
            targetRoom: targetRoomName,
        };

        return {name, body, memory};
    },
};