var findEmpty = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //PRIORITIZE CLOSEST FLAGS

        if (creep.memory.role == 'harvester') {
            var findEmptyFlags = _.filter(Game.flags, {
                color: COLOR_BLUE
            });
        }

        if (creep.memory.role == 'builder') {
            var findEmptyFlags = _.filter(Game.flags, {
                color: COLOR_GREEN,

            });
        }

        if (creep.memory.role == 'carrier') {
            var findEmptyFlags = _.filter(Game.flags, {
                color: COLOR_PURPLE,

            });
        }

        if (creep.memory.role == 'claimer') {
            var findEmptyFlags = _.filter(Game.flags, {
                color: COLOR_RED,
            });
        }

        creep.say(creep.name);
        for (var i in findEmptyFlags) {

            if (findEmptyFlags[i].memory.occupied == false || findEmptyFlags[i].memory.occupied == undefined) {
                creep.memory.home = findEmptyFlags[i].name;
                findEmptyFlags[i].memory = {
                    'occupied': true,
                    'owner': creep.id

                };
                return;
            }
        }
    }
};

module.exports = findEmpty;
