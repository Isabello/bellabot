//test 2

module.exports = {

    tick: function(thisRoom) {
      // Always place this memory cleaning code at the very top of your main loop!

        var flags = Game.rooms[thisRoom].find(FIND_FLAGS, {
            filter: {
                color: COLOR_PURPLE
            }
        });

        for (var flag in flags) {
            var carriers = _.size(_.filter(Game.creeps, {
                memory: {
                    role: 'carrier',
                    home: flags[flag].name
                }
            }));


            flags[flag].memory.carrier = carriers;
        }

        var miner_flags = Game.rooms[thisRoom].find(FIND_FLAGS, {
            filter: (flag) => {
                return (flag.color == COLOR_BLUE) && Game.getObjectById(flag.memory.owner) == undefined && flag.memory.occupied == true;
            }
        });
        for (var flag in miner_flags) {
          console.log(miner_flags[flag].memory.owner);
            miner_flags[flag].memory = {occupied: false};
        }
    }
};
