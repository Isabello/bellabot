var roleTower = {

    /** @param {Creep} creep **/
    run: function(tower) {
      try {
        if (tower) {
          var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
          if (closestHostile) {
              tower.attack(closestHostile);
          }

          if (tower.energy > 500){
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax / 10
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
          }

        }
      } catch (e){
        console.log(e);
      }



    }
};

module.exports = roleTower;
