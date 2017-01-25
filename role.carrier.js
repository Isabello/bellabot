var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.transit && creep.carry.energy == 0) {
            creep.memory.transit = false;
        }


        if (!creep.memory.transit && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transit = true;
        }

        if (!creep.memory.home) {
            for (var thisRoom in Game.rooms) {
                var home = Game.rooms[thisRoom].find(FIND_FLAGS, {
                    filter: {
                        color: COLOR_PURPLE
                    }
                });

                for (var i in home) {
                    if (Memory.flags[home[i].name].carrier < 2) {
                        creep.memory.home = home[i].name;
                        Memory.flags[home[i].name].carrier += 1;
                        break;
                    }
                }
            }
        }
        if (creep.pos.getRangeTo(Game.flags[creep.memory.home]) > 0  && !creep.memory.transit) {
            if (creep.room.name != Game.flags[creep.memory.home].pos.roomName) {
                creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(Game.flags[creep.memory.home].pos.roomName)));
            } else {
                creep.moveTo(Game.flags[creep.memory.home]);
            }
            return;
        }

        if (!creep.memory.transit) {
            var sources = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] != 0;
                }
            });

            var currentRoom = Game.rooms.E87S46;

            if ((creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
                creep.moveTo(sources, {
                    reusePath: 10
                });
            }

        }

        if (creep.memory.transit) {
            var sources = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy != structure.energyCapacity;
                }
            });
            console.log('transit: ' + sources);
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
                    creep.moveTo(sources[i], {
                        reusePath: 10
                    });
                }
            }

            if (!sources[0]) {
              creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(Game.rooms['E87S46'])));
            }
        }
    }
};

module.exports = roleCarrier;
