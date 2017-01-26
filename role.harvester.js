var findEmpty = require('method.findEmpty');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // This finds the first empty mining flag for live at
        if (creep.memory.assignment == undefined && creep.spawning == false) {
            try {
                findEmpty.run(creep);
            } catch (e) {

                creep.moveTo(Game.flags.Rally);
                return
            }
        }


        // Here we tell the creep to move to its new home
        if ((creep.pos.x != creep.memory.assignment.pos.x) || (creep.pos.y != creep.memory.assignment.pos.y || creep.pos.roomName != creep.memory.assignment.pos.roomName)) {
            if (creep.room.name != creep.memory.assignment.pos.roomName) {
                creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.assignment.pos.roomName)));
            } else {
                creep.moveTo(creep.memory.assignment.pos.x, creep.memory.assignment.pos.y);
            }
        } else if (creep.memory.source == undefined) {
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            creep.memory.source = sources.id;
        }

        if (creep.carry.energy < creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('Mining!~~');
            if (creep.harvest(Game.getObjectById(creep.memory.source)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.source), {reUsePath: 0});
            }
        } else {
            creep.memory.working = false;
            var sources = creep.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] != structure.storeCapacity;
                }
            });

            if (!sources[0]) {
                var creeps = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                    filter: (newCreeps) => {
                        return (newCreeps.memory.role != 'harvester');
                    }
                });
                for (var i in creeps) {
                    if ((creep.transfer(creeps[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
                        if (creep.moveTo(creeps[i], {
                                reusePath: 10
                            }) == OK) {
                            break;
                        }
                    }
                }
            }

            if ((creeps == undefined || _.size(creeps) == 0) && !sources[0]) {
                var targets = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, 5);
                if (targets) {
                    if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets);
                    }
                }
            }

            for (var i in sources) {
                if ((creep.transfer(sources[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
                    if (creep.moveTo(sources[i], {
                            reusePath: 10
                        }) == OK) {
                        return;
                    } else {
                        return;
                    }
                }
            }
        }
    }
}

module.exports = roleHarvester;
