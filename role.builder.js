var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('Reqing!');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('Buildin^_^');
        }

        if (creep.memory.building) {
            var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            console.log(targets);
            if (targets) {
                if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                } 
            } else {
                creep.memory.building = false;
            }
        } else {
            var sources = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] != 0;
                }
            });

            var currentRoom = Game.rooms.E87S46;
            if ((creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
                creep.moveTo(sources, {
                    reusePath: 10
                });
            };

        }
    }
};

module.exports = roleBuilder;
