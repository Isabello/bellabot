//var roleConstants = require('role.constants');

var roleSpawner = {

        /** @param {}  **/
        run: function(spawn) {

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
              var extensionCount = _.size(spawn.room.find(FIND_STRUCTURES, {  filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION  } }));
                console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy '+ 'and extensions: '+ extensionCount);

                    if (Game.rooms[name].energyAvailable >= 200 && spawn.room.controller.level <= 2 && extensionCount < 5) {
                        if (Memory.activeCreeps.roles.harvester < _.size(_.filter(Game.flags, {
                                color: COLOR_BLUE
                            }))) {
                            var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                                role: 'harvester',
                                working: false
                            });
                        } else if (Memory.activeCreeps.roles.carrier < _.size(_.filter(Game.flags, {
                                color: COLOR_PURPLE
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE], undefined, {
                                role: 'carrier',
                                working: false,
                                transit: false
                            });
                        } else if (Memory.activeCreeps.roles.upgrader < _.size(_.filter(Game.flags, {
                                color: COLOR_YELLOW
                            }))) {
                            var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                                role: 'upgrader',
                                working: false
                            });
                        } else if (Memory.activeCreeps.roles.builder < _.size(_.filter(Game.flags, {
                                color: COLOR_GREEN
                            }))) {
                            var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                                role: 'builder',
                                working: false
                            });
                        }
                    } else if (Game.rooms[name].energyAvailable >= 350 && spawn.room.controller.level <= 3 && extensionCount < 10 && extensionCount >= 5) {

                        if (Memory.activeCreeps.roles.harvester < _.size(_.filter(Game.flags, {
                                color: COLOR_BLUE
                            }))) {
                            var newName = spawn.createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], undefined, {
                                role: 'harvester'
                            });
                        } else if (Memory.activeCreeps.roles.carrier < _.size(_.filter(Game.flags, {
                                color: COLOR_PURPLE
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, MOVE, CARRY, MOVE], undefined, {
                                role: 'carrier',
                                transit: false
                            });
                        } else if (Memory.activeCreeps.roles.upgrader < _.size(_.filter(Game.flags, {
                                color: COLOR_YELLOW
                            }))) {
                            var newName = spawn.createCreep([WORK, CARRY, CARRY, WORK, MOVE, MOVE, MOVE], undefined, {
                                role: 'upgrader'
                            });
                        } else if (Memory.activeCreeps.roles.builder < _.size(_.filter(Game.flags, {
                                color: COLOR_GREEN
                            }))) {
                            var newName = spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, {
                                role: 'builder'
                            });
                        } else if (Memory.activeCreeps.roles.fighter <= Memory.activeCreeps.roles.healer && Memory.activeCreeps.roles.fighter <= 2) {
                            var newName = spawn.createCreep([ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE], undefined, {
                                role: 'fighter',
                                fighting: false
                            });
                        } else if (Memory.activeCreeps.roles.healer <= 2) {
                            var newName = spawn.createCreep([HEAL, MOVE, MOVE, MOVE, MOVE], undefined, {
                                role: 'healer',
                                healing: false
                            });
                        }
                    } else if (Game.rooms[name].energyAvailable >= 750 && spawn.room.controller.level == 3) {
                        if (Memory.activeCreeps.roles.harvester < _.size(_.filter(Game.flags, {
                                color: COLOR_BLUE
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK], undefined, {
                                role: 'harvester'
                            });
                        } else if (Memory.activeCreeps.roles.carrier < _.size(_.filter(Game.flags, {
                                color: COLOR_PURPLE
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, MOVE], undefined, {
                                role: 'carrier',
                                transit: false
                            });
                        } else if (Memory.activeCreeps.roles.upgrader < _.size(_.filter(Game.flags, {
                                color: COLOR_YELLOW
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK], undefined, {
                                role: 'builder'
                            });
                        } else if (Memory.activeCreeps.roles.builder < _.size(_.filter(Game.flags, {
                                color: COLOR_GREEN
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK], undefined, {
                                role: 'upgrader'
                            });
                        } else if (Memory.activeCreeps.roles.claimer < _.size(_.filter(Game.flags, {
                                color: COLOR_RED
                            }))) {
                            var newName = spawn.createCreep([MOVE, MOVE, CLAIM], undefined, {
                                role: 'claimer'
                            });
                        }
                        /*else if (Memory.activeCreeps.roles.fighter <= Memory.activeCreeps.roles.healer && Memory.activeCreeps.roles.fighter <= 2) {
                                            var newName = spawn.createCreep([ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE], undefined, {
                                                role: 'fighter',
                                                fighting: false
                                            });
                                        } else if (Memory.activeCreeps.roles.healer <= 2) {
                                            var newName = spawn.createCreep([HEAL, MOVE, MOVE, MOVE, MOVE], undefined, {
                                                role: 'healer',
                                                healing: false
                                            });
                                        }*/
                    }
                }
            }
        }
        module.exports = roleSpawner;

        //             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {
