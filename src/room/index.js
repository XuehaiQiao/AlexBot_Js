let roomLogic = {
    spawning:           require('./spawning'),
    repairing:          require('./repairing'),
    mainLogic:          require('./mainLogic'),
    defending:          require('./defending'),
    healing:            require('./healing'),
    linkTransfer:       require('./linkTransfer'),
    roomCensus:         require('./roomCensus'),
    exportStats:        require('./exportStats'),
    labReaction:        require('./labReaction'),
    resourceBalancing:  require('./resourceBalancing'),
    powerOperation:     require('./powerOperation'),
    factorayLogic:      require('./factorayLogic'),
    marketLogic : require('./marketLogic'),
}

module.exports = roomLogic;