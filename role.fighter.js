var roleFighter = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (!creep.memory.home) {
          for (var thisRoom in Game.rooms) {
            var home = Game.rooms[thisRoom].find(FIND_FLAGS, {
                filter: {
                    color: COLOR_RED
                }
            });

            for (var i in home) {
                console.log(home);
                creep.memory.home = home[i].name;
                Memory.flags[home[i].name].fighters += 1;
                return;
            }
          }
        }

        if (!creep.memory.fighting && creep.pos.getRangeTo(Game.flags[creep.memory.home]) > 3 ) {
            creep.moveTo(Game.flags[creep.memory.home]);
        }

        var enemies= creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
       if (enemies) {
            creep.moveTo(enemies);
            creep.attack(enemies);
            creep.memory.fighting = true;
        }
        else {
              creep.memory.fighting = false;
        }

    }
};

module.exports = roleFighter;
