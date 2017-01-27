var waypointFlags = {

    run: function() {

        var flags = _.filter(Game.flags, {
          memory: undefined

        });

        for (var i in flags) {
            flags[i].memory = {
                'occupied': false,
            };

        }
    }
};

module.exports = waypointFlags;
