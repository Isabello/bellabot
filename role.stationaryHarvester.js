var roleStationaryHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
                    
        if (creep.memory.sources == undefined || creep.memory.sources == null) {
           creep.memory.sources = creep.pos.findClosestByPath(FIND_SOURCES);
          // creep.memory.sources = creep.room.find(FIND_SOURCES)[_.random(0,3)];
        }

        if (creep.memory.partner == undefined && _(Game.creeps).filter({ memory: { role: 'carrier' }}) != undefined ) {
            creep.memory.partner = _(Game.creeps).filter({ memory: { role: 'carrier' }}).value();
        }

        if(creep.carry.energy < creep.carryCapacity) {
            if(creep.harvest(Game.getObjectById(creep.memory.sources.id) == ERR_NOT_IN_RANGE )) {
                creep.moveTo(Game.getObjectById(creep.memory.sources.id));
            }
            creep.harvest(Game.getObjectById(creep.memory.sources.id));
        }
        else {
               creep.transfer(Game.getObjectById(creep.memory.partner[0].id), RESOURCE_ENERGY)
        }
    }
};

module.exports = roleStationaryHarvester;