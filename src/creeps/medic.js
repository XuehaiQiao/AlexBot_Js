module.exports = {
    properties: {
        role: "medic"
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        // heal any creep
        if(creep.memory.status == 1) {
            if (creep.moveToRoomAdv(creep.memory.targetRoom)) {
                return;
            }    
            let target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: creep => creep.hits < creep.hitsMax})
            if (target) {
                creep.rangedHeal(target);
                creep.heal(target);
                creep.moveTo(target);
            }
        }
        // heal defender
        else {
            let targetId = creep.memory.target
            if(!targetId || !Game.getObjectById(targetId)) {
                let defender = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: creep => creep.memory.role == 'defender'});
                if (!defender) {
                    return;
                }
                creep.memory.target = defender.id;
            }
            
            let target = Game.getObjectById(creep.memory.target);
            if (target) {
                if (creep.hits < creep.hitsMax){
                    creep.heal(creep);
                    creep.moveTo(target);
                }
                else {
                    creep.heal(target);
                    if(creep.rangedHeal(target) == ERR_NOT_IN_RANGE) {
                        creep.heal(creep);
                    }
                }
                creep.moveTo(target);
                
            }
        }
    },

    // checks if the room needs to spawn a creep
    spawn: function(room) {
        // var thisTypeCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.properties.role && creep.room.name == room.name);
        // console.log(this.properties.role + ': ' + thisTypeCreeps.length, room.name);
    
        // // level 2
        // if (thisTypeCreeps.length < 1) {
        //     return true;
        // }
        return false;
    },

    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
        let name = this.properties.role + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {role: this.properties.role, status: 0};

        return {name, body, memory};
    },
};