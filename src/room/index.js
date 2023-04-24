let roomLogic = {
    spawning:     require('./spawning'),
    repairing:    require('./repairing'),
    mainLogic:    require('./mainLogic'),
    defending:    require('./defending'),
    healing:      require('./healing'),
    linkTransfer: require('./linkTransfer'),
    roomCensus:   require('./roomCensus'),
    exportStats:  require('./exportStats'),
    labReaction:  require('./labReaction'),
}

module.exports = roomLogic;