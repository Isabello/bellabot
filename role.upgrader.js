var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('Brb ;)');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('Goin Up@@');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
          var targets = creep.room.find(FIND_STRUCTURES, {
              filter: (structure) => {
                  return (structure.structureType == STRUCTURE_SPAWN);
              }
          }); //Room is hardcoded
          if ((creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) && Game.rooms.E87S46.energyAvailable >= 200 ) {
            creep.moveTo(targets[0]);
          };

        }
    }
};

module.exports = roleUpgrader;
