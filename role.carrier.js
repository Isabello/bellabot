var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {

        /*
                if ((creep.memory.partner == '' || creep.memory.partner == null) &&
                    (_(Game.creeps).filter({
                        memory: {
                            role: 'stationary'
                        }
                    }) != undefined) || !Game.creeps[creep.memory.partner[0]]) {
                    creep.memory.partner = _(Game.creeps).filter({
                        memory: {
                            role: 'stationary'
                        }
                    }).value();
                }
                */

        if (Game.getObjectById(creep.memory.partner) == undefined && creep.memory.partner){
            creep.memory.partner = false;
            console.log('Yuuut');
        }

        
        if (!creep.memory.transit && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transit = true;
            creep.memory.partner = false;
            creep.say('Returning!');
        }

        if (creep.memory.transit) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            } else {
               creep.memory.transit = false;
               creep.memory.partner = false;
            }
        } else {
            if (creep.memory.partner) {
                creep.moveTo(Game.getObjectById(creep.memory.partner), {reusePath: 10});
            }
        }
    }
};

module.exports = roleCarrier;
