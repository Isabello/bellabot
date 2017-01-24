var findEmpty = require('method.findEmpty');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.spawning == true) {
            return
        }


        // This finds the first empty mining flag for live at
        if (creep.memory.assignment == undefined && creep.spawning == false) {
            findEmpty.run(creep);
        }

        // Here we tell the creep to move to its new home
        if ((creep.pos.x != creep.memory.assignment.pos.x) || (creep.pos.y != creep.memory.assignment.pos.y)) {
            creep.moveTo(creep.memory.assignment.pos.x, creep.memory.assignment.pos.y);
        } else if (creep.memory.source == undefined) {
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            console.log(sources.id);
            creep.memory.source = sources.id;
        }

        if (creep.carry.energy < creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('Mining!~~');
            creep.harvest(Game.getObjectById(creep.memory.source));
        } else {
            creep.memory.working = false;

            if (!creep.memory.partner || Game.getObjectById(creep.memory.partner) == undefined || Memory.creeps[Game.getObjectById(creep.memory.partner)] == false ) {
                creep.memory.partner = false;
                var transferPartner = _.filter(Game.creeps, {
                    memory: {
                        role: 'carrier',
                        transit: false,
                        partner: false
                    }
                });

                try {
                    var trans = transferPartner[0];
                    creep.memory.partner = trans.id;
                    trans.memory.partner = creep.id;
                } catch (e) {
                    console.log('No carriers available: ' + e);
                }

            } else {
                try {
                    if (creep.transfer(Game.getObjectById(creep.memory.partner), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                    } else {
                        creep.memory.partner = false;
                    }

                } catch (e) {
                    console.log('Partner Not close enough or not found: ' + e);
                }
            }
        }
    }
};

module.exports = roleHarvester;
