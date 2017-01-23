//var roleConstants = require('role.constants');

var roleSpawner = {

    /** @param {}  **/
    run: function(spawn) {

        if (spawn.memory.init == undefined) {
            spawn.memory.MAX = {
                MAX_HARVESTERS: 2,
                MAX_UPGRADERS: 1,
                MAX_BUILDERS: 1,
                MAX_STATIONARY: 1,
                MAX_CARRIER: 2
            }
            spawn.memory.init = true;
        }

        for (var name in Game.rooms) {
            console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
            if (Game.rooms[name].energyAvailable >= 150) {
                if (_.size(_.filter(Game.creeps, {
                        memory: {
                            role: 'harvester'
                        }
                    })) < spawn.memory.MAX.MAX_HARVESTERS) {
                    var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                        role: 'harvester'
                    });
                    /*} else if ( _.size(_.filter(Game.creeps, {memory: { role : 'stationary'} })) < spawn.memory.MAX_STATIONARY ) {
                        var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'stationary'});

                        */
                } else if (_.size(_.filter(Game.creeps, {
                        memory: {
                            role: 'carrier'
                        }
                    })) < spawn.memory.MAX.MAX_CARRIER) {
                    var newName = spawn.createCreep([CARRY, MOVE, MOVE], undefined, {
                        role: 'carrier'
                    });
                } else if (_.size(_.filter(Game.creeps, {
                        memory: {
                            role: 'upgrader'
                        }
                    })) < spawn.memory.MAX.MAX_UPGRADERS) {
                    var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                        role: 'upgrader'
                    });
                } else if (_.size(_.filter(Game.creeps, {
                        memory: {
                            role: 'builder'
                        }
                    })) < spawn.memory.MAX.MAX_BUILDERS) {
                    var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                        role: 'builder'
                    });
                }
            }
        }
    }
};

module.exports = roleSpawner;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {
