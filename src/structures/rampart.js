var rampart = {
    targetHits: {
        0: 0,
        1: 1000, 
        2: 100000, 
        3: 200000, 
        4: 500000, 
        5: 1000000,
        6: 2000000,
        7: 5000000,
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