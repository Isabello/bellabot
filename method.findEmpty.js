var findEmpty = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //PRIORITIZE CLOSEST FLAGS

        if (creep.memory.role == 'harvester') {
            var findEmptyFlags = _.filter(Game.flags, {
                memory: {
                    'occupied': false
                }
            });

            var assign_flag = findEmptyFlags[0];
            creep.memory.assignment = assign_flag;
            assign_flag.memory = {
                'occupied': true,
                'owner': creep.id
            };

        }

        if (creep.memory.role == 'builder') {
            var findEmptyFlags = _.filter(Game.flags, {
                color: COLOR_GREEN
            });

            for (var i in findEmptyFlags) {
                if (Memory.flags[findEmptyFlags[i].name].builder < Memory.flags[findEmptyFlags[i].name].allowed) {
                    creep.memory.home = findEmptyFlags[i].name;
                    Memory.flags[findEmptyFlags[i].name].builder += 1;
                    break;
                }
            }
        }

        if (creep.memory.role == 'carrier') {
            var findEmptyFlags = _.filter(Game.flags, {
                color: COLOR_PURPLE
            });

            for (var i in findEmptyFlags) {
                if (Memory.flags[findEmptyFlags[i].name].carrier < Memory.flags[findEmptyFlags[i].name].allowed) {
                    creep.memory.home = findEmptyFlags[i].name;
                    Memory.flags[findEmptyFlags[i].name].carrier += 1;
                    break;
                }
            }
        }
    }
};

module.exports = findEmpty;
