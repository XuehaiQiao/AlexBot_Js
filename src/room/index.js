let roomLogic = {
    spawning:     require('./spawning'),
    repairing:    require('./repairing'),
    mainLogic:    require('./mainLogic'),
    defending:    require('./defending'),
    healing:      require('./healing'),
    linkTransfer: require('./linkTransfer'),
    roomCensus:   require('./roomCensus'),
}

module.exports = roomLogic;