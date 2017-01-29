var creepMethods = require('new.creep.methods');
var creepsMaster = {

    run: function(creep) {

            if (creep.spawning == true) {
                return;
            }
            if (creep.memory.home == false) {
              creepMethods.findEmpty(creep);
            }

                   if (creep.memory.role == 'harvester') {
                     //  creepMethods.creepMovement(creep);
                       creepMethods.harvest(creep);
                   }

                   if (creep.memory.role == 'carrier') {
                       creepMethods.carry(creep);
                   }
                   if (creep.memory.role == 'worker') {
                       creepMethods.worker(creep);
                   }

                   if (creep.memory.role == 'fighter') {
                       creepMethods.fighter(creep);
                   }

                   if (creep.memory.role == 'healer') {
                       creepMethods.healer(creep);
                   }

                   if (creep.memory.role == 'claimer') {
                       creepMethods.claim(creep);
                   }

    }
}
module.exports = creepsMaster;
