//var roleConstants = require('role.constants');

var roleSpawner = {

    /** @param {}  **/
    run: function(spawn, activeCreeps) {

        if (spawn.memory.init == undefined) {
            spawn.memory.MAX = {
                MAX_HARVESTERS: 3,
                MAX_UPGRADERS: 1,
                MAX_BUILDERS: 1,
                MAX_CARRIER: 4
            }
            spawn.memory.init = true;
        }

        for (var name in Game.rooms) {
            console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
            if (Game.rooms[name].energyAvailable >= 200 && spawn.room.controller.level < 2) {
                if (activeCreeps.roles.harvester < spawn.memory.MAX.MAX_HARVESTERS) {
                    var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                        role: 'harvester'
                    });
                } else if (activeCreeps.roles.carrier < spawn.memory.MAX.MAX_CARRIER) {
                    var newName = spawn.createCreep([CARRY, MOVE, MOVE], undefined, {
                        role: 'carrier',
                        partner: false,
                        transit: false
                    });
                } else if (activeCreeps.roles.upgrader < spawn.memory.MAX.MAX_UPGRADERS) {
                    var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                        role: 'upgrader'
                    });
                } else if (activeCreeps.roles.builder < spawn.memory.MAX.MAX_BUILDERS) {
                    var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                        role: 'builder'
                    });
                }
            } else if (Game.rooms[name].energyAvailable >= 350 && spawn.room.controller.level == 2) {

                if (activeCreeps.roles.harvester < spawn.memory.MAX.MAX_HARVESTERS) {
                    var newName = spawn.createCreep([WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY, MOVE], undefined, {
                        role: 'harvester'
                    });
                } else if (activeCreeps.roles.carrier < spawn.memory.MAX.MAX_CARRIER) {
                    var newName = spawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {
                        role: 'carrier',
                        partner: false,
                        transit: false
                    });
                } else if (activeCreeps.roles.upgrader < spawn.memory.MAX.MAX_UPGRADERS) {
                    var newName = spawn.createCreep([WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {
                        role: 'upgrader'
                    });
                } else if (activeCreeps.roles.builder < spawn.memory.MAX.MAX_BUILDERS) {
                    var newName = spawn.createCreep([WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], undefined, {
                        role: 'builder'
                    });
                } else if (activeCreeps.roles.fighter <= activeCreeps.roles.healer) {
                    var newName = spawn.createCreep([ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE], undefined, {
                        role: 'fighter',
                        fighting: false
                    });
                } else {
                    var newName = spawn.createCreep([HEAL, MOVE, MOVE, MOVE, MOVE], undefined, {
                        role: 'healer',
                        healing: false
                    });
                }
            }
        }
    }
}
module.exports = roleSpawner;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {
