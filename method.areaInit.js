var areaInit = {

    /** @param {source} source **/
    /*Lets mark all the free spaces around sources! Runs on init */
    run: function(spawn) {

        if (spawn.memory.free_spaces_marked == undefined || spawn.memory.free_spaces_marked == false) {

            var sources = spawn.room.find(FIND_SOURCES);

            /*Iterates through each source in the sources array */
            for (var i in sources) {

                var source_free = spawn.room.lookAtArea(sources[i].pos.y - 1, sources[i].pos.x - 1, sources[i].pos.y + 1, sources[i].pos.x + 1, {
                    asArray: true
                });

                // DEBUG: console.log(JSON.stringify(source_free));
                /* Performs the actual marking for each source */
                for (var n in source_free) {
                    console.log(source_free[i].terrain);
                    if (source_free[n].terrain == ('plain' || 'swamp')) {
                        var flag =
                            Game.rooms.sim.createFlag(source_free[n].x, source_free[n].y, i + '_' + n, COLOR_BLUE);
                    }
                }
            }
            spawn.memory.free_spaces_marked = true; // All done!
        }
    }
};

module.exports = areaInit;