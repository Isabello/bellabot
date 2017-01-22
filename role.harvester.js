var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {


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

    }
};

module.exports = roleHarvester;
