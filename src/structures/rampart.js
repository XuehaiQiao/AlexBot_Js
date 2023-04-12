var rampart = {
    targetHits: {
        0: 0,
        1: 1000, 
        2: 100000, 
        3: 500000, 
        4: 1000000, 
        5: 2000000,
        6: 5000000,
        7: 10000000,
        8: 20000000,
    },

    getTargetHits: function(room) {
        return this.targetHits[room.controller.level];
    },

    getIdealHits: function(room) {
        return this.targetHits[room.controller.level] + 10000;
    },
}

module.exports = rampart;