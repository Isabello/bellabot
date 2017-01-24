var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('Reqing!');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('Buildin^_^');
        }

      if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
              creep.memory.building = false;
          }
        }
        else {
          var targets = creep.room.find(FIND_STRUCTURES, {
              filter: (structure) => {
                  return (structure.structureType == STRUCTURE_SPAWN);
              }
          }); //Room is hardcoded
          var currentRoom = Game.rooms.E87S46;
            if (currentRoom.energyAvailable >= currentRoom.energyCapacityAvailable ) {
              if ((creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) ) {
                creep.moveTo(targets[0]);
              };
            }
        }
    }
};

module.exports = roleBuilder;
