let creepLogic = {
    harvester:      require('./harvester'),
    carrier:        require('./carrier'),
    upgrader:       require('./upgrader'),
    builder:        require('./builder'),
    miner:          require('./miner'),
    mineralCarrier: require('./mineralCarrier'),
    
    harvester2:     require('./harvester2'),
    carrier2:       require('./carrier2'),
    upgrader2:      require('./upgrader2'),
    builder2:       require('./builder2'),
    manager:        require('./manager'),

    claimer:        require('./claimer'),
    outSourcer:     require('./outSourcer'),
    remoteHarvester:require('./remoteHarvester'),
    remoteHauler:   require('./remoteHauler'),

    defender:       require('./defender'),
    wrecker:        require('./wrecker'),
    medic:          require('./medic'),
    scout:          require('./scout'),
    transporter:    require('./transporter'),
}

module.exports = creepLogic;