var initFlags = {

    run: function() {

        var flags = Game.flags;
        for (var i in flags) {
            if (flags[i].memory.occupied == undefined) {
                flags[i].memory = {
                    'occupied': false
                };
            }
        }
        console.log('flagsdone');

    }
}

module.exports = initFlags;
