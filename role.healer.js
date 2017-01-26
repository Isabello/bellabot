var roleHealer = {

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
                Memory.flags[home[i].name].healers += 1;
                return;
            }
          }
        }

        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        if(target) {
            if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath: 10});

            }
          creep.memory.healing = true;
        } else {
            creep.memory.healing = false;
        }

        if (!creep.memory.healing && creep.pos.getRangeTo(Game.flags[creep.memory.home]) > 2 ) {
          if (creep.room.name != Game.flags[creep.memory.home].pos.roomName) {
              creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(Game.flags[creep.memory.home].pos.roomName), {reusePath: 10}));
          } else {
              creep.moveTo(Game.flags[creep.memory.home]);
          }
          return;
        }
    }
};

module.exports = roleHealer;
