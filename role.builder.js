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
            var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (targets) {
                if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                }
            } else {
                var roadToRepair = creep.pos.findClosest(FIND_STRUCTURES, {
                    filter: function(object) {
                        return object.structureType === STRUCTURE_ROAD && (object.hits > object.hitsMax / 3);
                    }
                });

                if (roadToRepair) {
                    creep.moveTo(roadToRepair);
                    creep.repair(roadToRepair);
                } else {
                  creep.memory.building = false;
                }
            }
        } else {
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
            };

        }
    }
};

module.exports = roleBuilder;
