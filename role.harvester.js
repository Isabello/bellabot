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
            var transferPartner = _.filter(Game.creeps, {
                memory: {
                    role: 'carrier',
                    transit: false
                }
            })
            var trans = transferPartner[_.random(0, transferPartner.length)];
            try {
                          creep.say(trans.name);
            } catch (e) {

            };
            creep.transfer(trans, RESOURCE_ENERGY);
        }




        // Now we want to mine the closest source!
        /*    if (creep.memory.source.id == undefined) {
                var sources = creep.pos.findClosestByPath(FIND_SOURCES);
                creep.memory.source.id = sources.id;
            }*/
        /*
                if (creep.memory.sources == undefined || creep.memory.sources == null) {
                   creep.memory.sources = creep.pos.findClosestByPath(FIND_SOURCES);
                  // creep.memory.sources = creep.room.find(FIND_SOURCES)[_.random(0,3)];
                }

                if(creep.carry.energy < creep.carryCapacity) {
                    var result = creep.harvest(Game.getObjectById(creep.memory.sources.id));
                    if (result == OK){
                    return
                    } else if(creep.harvest(Game.getObjectById(creep.memory.sources.id) == ERR_NOT_IN_RANGE )) {
                        creep.moveTo(Game.getObjectById(creep.memory.sources.id));
                    } else {
                        creep.say(result);
                    }
                    //creep.harvest(Game.getObjectById(creep.memory.sources.id));
                }
                else {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION ||
                                        structure.structureType == STRUCTURE_SPAWN ||
                                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                            }
                    });
                    if(targets.length > 0) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
                }
        */
    }
};

module.exports = roleHarvester;
