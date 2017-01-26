var findEmpty = require('method.findEmpty');
var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.transit && creep.carry.energy == 0) {
            creep.memory.transit = false;
        }

        if (!creep.memory.home && creep.spawning == false) {


            try {
                findEmpty.run(creep);
            } catch (e) {
              console.log(e);
          console.log('cant find a home?');
                creep.moveTo(Game.flags.Rally);
                return
            }
        }

        if (!creep.memory.transit && creep.carry.energy >= creep.carryCapacity - 50 ) {
            creep.memory.transit = true;
        }

        if (!creep.memory.transit) {
            if (creep.room.name != Game.flags[creep.memory.home].pos.roomName) {
                creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(Game.flags[creep.memory.home].pos.roomName), {
                    reusePath: 10
                }));
            } else if (creep.pos.getRangeTo(Game.flags[creep.memory.home]) >= 6) {
                creep.moveTo(Game.flags[creep.memory.home], {
                    reusePath: 10
                });
                return;
            } else {
                var sources = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] != 0;
                    }
                });
                console.log(sources);
                if ((creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
                    creep.moveTo(sources, {
                        reusePath: 10
                    });
                }
            }
        }

        if (creep.memory.transit) {
            if (creep.room.name != Game.spawns['Spawn1'].room.name) {
                creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(Game.spawns['Spawn1'].room.name), {
                    reusePath: 10
                }));
                return;
            } else {
                var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy != structure.energyCapacity;
                    }
                });
                var maxAmount = -1;
                var maxSource = null;
                var maxRange = 40;
                for (var i = 0; i < sources.length; i++) {
                    if (sources[i].energy <= maxAmount) {
                        var range = creep.pos.getRangeTo(sources[i]);
                        if (sources[i].energy > maxAmount || range < maxRange) {
                            maxAmount = sources[i].energy;
                            maxSource = sources[i];
                            maxRange = range;
                        }
                    }
                }
                for (var i in sources) {
                    if (creep.transfer(sources[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        if (creep.moveTo(sources[i], {
                                reusePath: 10
                            }) == OK) {
                            break;
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleCarrier;
