let creepLogic = {
    // core v1
    harvester:      require('./harvester'),
    carrier:        require('./carrier'),
    upgrader:       require('./upgrader'),
    builder:        require('./builder'),

    //core v2
    harvester2:     require('./harvester2'),
    carrier2:       require('./carrier2'),
    upgrader2:      require('./upgrader2'),
    builder2:       require('./builder2'),
    manager:        require('./manager'),
    miner:          require('./miner'),
    mineralCarrier: require('./mineralCarrier'),

    // base defenders
    baseMelee:      require('./baseMelee'),

    // outpost harvest
    claimer:        require('./claimer'),
    outSourcer:     require('./outSourcer'),
    remoteHarvester:require('./remoteHarvester'),
    remoteHauler:   require('./remoteHauler'),
    keeperAttacker: require('./keeperAttacker'),
    invaderAttacker:require('./invaderAttacker'),
    transporter:    require('./transporter'),
    defender:       require('./defender'),
    remoteMiner:    require('./remoteMiner'),
    // outpost harvest v2
    kAtkDuo:        require('./kAtkDuo'),

    // others
    wrecker:        require('./wrecker'),
    medic:          require('./medic'),
    scout:          require('./scout'),
    rangeAtker:     require('./rangeAtker'),

    // attackers
    atkMelee:       require('./atkMelee'),
    atkMedic:       require('./atkMedic'),

    // defenders
    defMelee:       require('./defMelee'),

    // season
    roadRepairer: require('./roadRepairer'),

    // power
    powerMiner: require('./powerMiner'),
    powerMedic: require('./powerMedic'),
}

module.exports = creepLogic;