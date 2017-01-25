var waypointFlags = {

    run: function(thisRoom) {


        var flags = Game.rooms[thisRoom].find(FIND_FLAGS, {
            filter: {
                color: COLOR_ORANGE
            }
        });
        var flags_fighters = Game.rooms[thisRoom].find(FIND_FLAGS, {
            filter: {
                color: COLOR_YELLOW
            }
        });
        for (var i in flags) {
            flags[i].memory = {
                'home': false,
                'carrier': 0,
                'storage': 0
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
    }
};

module.exports = waypointFlags;
