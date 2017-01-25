var roleFiller = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (!creep.memory.transit) {
            var sources = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
                }
            });
            var maxAmount = -1;
            var maxSource = null;
            var maxRange = 100;
            for (var i = 0; i < sources.length; i++) {
                if (sources[i].store[RESOURCE_ENERGY] >= maxAmount) {
                    var range = creep.pos.getRangeTo(sources[i]);
                    if (sources[i].store[RESOURCE_ENERGY] > maxAmount || range < maxRange) {
                        maxAmount = sources[i].store[RESOURCE_ENERGY];
                        maxSource = sources[i];
                        maxRange = range;
                    }
                }
            }
            console.log(maxAmount);
            console.log(maxSource);
            console.log(maxRange);
            var currentRoom = Game.rooms.E87S46;
            for (var i in sources) {
                if ((creep.withdraw(sources[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
                    creep.moveTo(sources[i]);
                } else {
                    creep.memory.transit = true;
                };
            }
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
            } else if (creep.carry.energy > 0) {
              creep.transfer(targets[1], RESOURCE_ENERGY);
            } else {
                creep.memory.transit = false;
            }
        }
    }
};

module.exports = roleFiller;
