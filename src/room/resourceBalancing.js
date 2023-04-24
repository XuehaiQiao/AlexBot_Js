var resourceBalancing = function(myRooms) {
    if(Game.time % 500 != 5) return;

    const ENERGY_SEND_BOUND = 500000;
    const ENERGY_RECEIVE_BOUND = 300000;
    let energySender = _.filter(myRooms, room => room.storage && room.terminal && room.storage.store[RESOURCE_ENERGY] > ENERGY_SEND_BOUND);
    let energyReceiver = _.filter(myRooms, room => room.storage && room.terminal && room.storage.store[RESOURCE_ENERGY] < ENERGY_RECEIVE_BOUND);
    energyReceiver.sort((r1, r2) => r1.storage.store[RESOURCE_ENERGY] - r2.storage.store[RESOURCE_ENERGY]);

    for(const i in myRooms) {
        // todo: choose sender & receiver based on room distance
        if(energySender[i] && energyReceiver[i]) {
            let result = energySender[i].terminal.send(RESOURCE_ENERGY, 25000, energyReceiver[i].name, 'energy');
            if(result == OK) console.log('Sent 25000 energy from', energySender[i], 'to', energyReceiver[i]);
        }
    }

}

module.exports = resourceBalancing;