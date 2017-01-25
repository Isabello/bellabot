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
                Memory.flags[home[i].name].fighters += 1;
                return;
            }
          }
        }

        if (!creep.memory.healing) {
          if (creep.room.name != Game.flags[creep.memory.home].pos.roomName) {
              creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(Game.flags[creep.memory.home].pos.roomName)));
          } else {
              creep.moveTo(Game.flags[creep.memory.home]);
          }
          return;
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
        }
    }
};

module.exports = roleHealer;
