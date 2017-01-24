var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.transit == undefined) {
            creep.memory.transit = false;
        }

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

        if (creep.memory.transit && creep.carry.energy == 0) {
            creep.memory.transit = false;
            creep.say('Acquiring!');
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
            }
        } else {
            if (!creep.memory.partner) {
                var transferPartner = _.filter(Game.creeps, {
                    memory: {
                        working: false
                    }
                });
                console.log(transferPartner);
                try {
                                  creep.memory.partner = transferPartner[_.random(0, transferPartner.length)].id;
                } catch (e) {
                  console.log('no id avails');
                }

            }
            if (creep.memory.partner) {
                creep.moveTo(Game.getObjectById(creep.memory.partner), {reusePath: 10});
            }
        }
    }
};

module.exports = roleCarrier;
