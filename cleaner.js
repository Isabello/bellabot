//test 2
module.exports = {

    tick: function(thisRoom) {
        // Always place this memory cleaning code at the very top of your main loop!

        for (var name in Memory.creeps) {

            // Required to free up previously used flags! Smart!!
            if (!Game.creeps[name]) {
                try {
                    Memory.flags[Memory.creeps[name].assignment.name] = {
                        'occupied': false
                    };
                } catch (e) {
                    console.log('clean up failed ' + e);
                }

                delete Memory.creeps[name];

            }
        }

        var flags = Game.rooms[thisRoom].find(FIND_FLAGS, {
            filter: {
                color: COLOR_PURPLE
            }
        });
            console.log(flags);

        for (var flag in flags) {
            var carriers = _.size(_.filter(Game.creeps, {
                memory: {
                    role: 'carrier',
                    home: flags[flag].name
                }
            }));


            flags[flag].memory.carrier = carriers;
        }
    }
};
