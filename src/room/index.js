const roomLogic = {
    spawning:           require('./spawning'),
    linkTransfer:       require('./linkTransfer'),
    roomCensus:         require('./roomCensus'),
    exportStats:        require('./exportStats'),
    labReaction:        require('./labReaction'),
    resourceBalancing:  require('./resourceBalancing'),
    powerOperation:     require('./powerOperation'),
    factorayLogic:      require('./factorayLogic'),
    marketLogic :       require('./marketLogic'),
    towerLogic:         require('./towerLogic'),
    roomInit:           require('./roomInit'),
}

module.exports = roomLogic;