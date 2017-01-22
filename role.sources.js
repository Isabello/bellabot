var roleSources = {

    /** @param {Creep} creep **/
    run: function(creep) {

        Game.room.['Spawn1'].lookAtArea(sources[i].pos.y - 1,sources[i].pos.x - 1, sources[i].pos.y + 1,sources[i].pos.y + 1, {asArray: true})
    }
};

module.exports = roleSources;