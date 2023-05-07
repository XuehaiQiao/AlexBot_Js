const { roomResourceConfig } = require("../config");

module.exports = function(myRooms) {
    // check room resource
    if(Game.time % 200 == 45) {
        // check memory object, create task queue if don't have.
        console.log("assign terminal task")
        for(const i in myRooms) {
            if(!myRooms[i].memory.tasks) myRooms[i].memory.tasks = {};
            if(!myRooms[i].memory.tasks.terminalTasks) myRooms[i].memory.tasks.terminalTasks = [];
        }

        for(const resourceType in roomResourceConfig) {
            const abundantLine = roomResourceConfig[resourceType].storage[1];
            const lowerBoundLine = roomResourceConfig[resourceType].storage[0];
            let sender = _.filter(myRooms, room => room.storage && room.terminal && room.storage.store[resourceType] > abundantLine);
            let receiver = _.filter(myRooms, room => room.storage && room.terminal && room.storage.store[resourceType] < lowerBoundLine);
            receiver.sort((r1, r2) => r1.storage.store[resourceType] - r2.storage.store[resourceType]);
    
            for(const i in myRooms) {
                // todo: choose sender & receiver based on room distance
                if(sender[i] && receiver[i]) {
                    let task = {receiver: receiver[i].name, resourceType: resourceType};
                    if(resourceType == RESOURCE_ENERGY) {
                        task.amount = roomResourceConfig[resourceType].terminal / 2;
                    }
                    else {
                        task.amount = roomResourceConfig[resourceType].terminal;
                    }
                    sender[i].memory.tasks.terminalTasks.push(task);
                    
                }
            }
        }
    }

    //send resources
    if(Game.time % 10 == 0) {
        for(const i in myRooms) {
            let senderRoom = myRooms[i];
            if(!senderRoom.memory.tasks) continue;
            if(!senderRoom.memory.tasks.terminalTasks) continue;
            if(senderRoom.memory.tasks.terminalTasks.length == 0) continue;
            if(!senderRoom.terminal) continue;
            if(senderRoom.terminal.cooldown > 0) continue;
    
            const terminalTask = senderRoom.memory.tasks.terminalTasks.shift();
            let result = senderRoom.terminal.send(terminalTask.resourceType, terminalTask.amount, terminalTask.receiver, 'Resource Balancing');
            console.log(senderRoom, 'Try to send resource', JSON.stringify(terminalTask), result);
        }
    }


    // let energySender = _.filter(myRooms, room => room.storage && room.terminal && room.storage.store[RESOURCE_ENERGY] > ENERGY_SEND_BOUND);
    // let energyReceiver = _.filter(myRooms, room => room.storage && room.terminal && room.storage.store[RESOURCE_ENERGY] < ENERGY_RECEIVE_BOUND);
    // energyReceiver.sort((r1, r2) => r1.storage.store[RESOURCE_ENERGY] - r2.storage.store[RESOURCE_ENERGY]);

    // for(const i in myRooms) {
    //     // todo: choose sender & receiver based on room distance
    //     if(energySender[i] && energyReceiver[i]) {
    //         let result = energySender[i].terminal.send(RESOURCE_ENERGY, 25000, energyReceiver[i].name, 'energy');
    //         if(result == OK) console.log('Sent 25000 energy from', energySender[i], 'to', energyReceiver[i]);
    //     }
    // }

};