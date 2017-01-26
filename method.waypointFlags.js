var waypointFlags = {

    run: function(thisRoom) {


        var flags = _.filter(Game.flags, {
            color: COLOR_ORANGE
        });

        var flags_fighters = _.filter(Game.flags, {
            color: COLOR_YELLOW
        });

        var flags_builders = _.filter(Game.flags, {
            color: COLOR_BROWN
        });

        for (var i in flags) {
            flags[i].memory = {
                'home': false,
                'carrier': 0,
                'allowed': 0
            };
            console.log(flags[i].color);
            flags[i].setColor(COLOR_PURPLE, COLOR_PURPLE);
            console.log(' home flags done');
        }
        for (var i in flags_fighters) {
            flags_fighters[i].memory = {
                'home': false
            };
            flags_fighters[i].setColor(COLOR_RED, COLOR_RED);
        }
        for (var i in flags_builders) {
            flags_builders[i].memory = {
              'home': false,
              'builder': 0,
              'allowed': 2
            };
            flags_builders[i].setColor(COLOR_GREEN, COLOR_GREEN);
        }
    }
};

module.exports = waypointFlags;
