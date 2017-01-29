var spawnMethods = require('spawn.methods');
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
        var extensionCount = _.size(spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION
            }
        }));
        console.log('Room "' + spawn.pos.roomName + '" has ' + spawn.room.energyAvailable + ' energy ' + 'and extensions: ' + extensionCount);

        var harvester = {
            role: 'harvester',
            working: false,
            home: false
        }
        var carrier = {
            role: 'carrier'
        }
        var worker = {
            role: 'worker',
            working: false
        }
        var repair = {
            role: 'repair',
            working: false
        }
        var reserve = spawnMethods.reservedEnergy(spawn, extensionCount);
        if (Memory.activeCreeps.roles.carrier < Memory.activeCreeps.roles.harvester * 1.5) {
            spawn.createCreep(spawnMethods.creepParts('carrier',reserve), undefined, carrier);
        } else if (Memory.activeCreeps.roles.harvester < _.size(_.filter(Game.flags, {
                color: COLOR_BLUE
            }))) {
            spawn.createCreep(spawnMethods.creepParts('harvester',reserve), undefined, harvester);
        } else if (Memory.activeCreeps.roles.worker < Memory.activeCreeps.roles.carrier / 1.5) {
            spawn.createCreep(spawnMethods.creepParts('worker',reserve), undefined, worker);
        }
        else if (Memory.activeCreeps.roles.repair < Memory.activeCreeps.roles.carrier / 5) {
            spawn.createCreep(spawnMethods.creepParts('repair',reserve), undefined, repair);
        }

        /*
                    if (Game.rooms[name].energyAvailable >= 200 && spawn.room.controller.level <= 2 && extensionCount < 5) {
                        if (Memory.activeCreeps.roles.harvester < _.size(_.filter(Game.flags, {
                                color: COLOR_BLUE
                            }))) {
                            var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                                role: 'harvester',
                                working: false,
                                home: false
                            });
                        } else if (Memory.activeCreeps.roles.carrier < _.size(_.filter(Game.flags, {
                                color: COLOR_PURPLE
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE], undefined, {
                                role: 'carrier',
                                working: false,
                                transit: false,
                                return: true
                            });
                        } else if (Memory.activeCreeps.roles.worker < _.size(_.filter(Game.flags, {
                                color: COLOR_GREEN
                            }))) {
                            var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, {
                                role: 'worker',
                                working: false
                            });
                        }
                    } else if (Game.rooms[name].energyAvailable >= 350 && spawn.room.controller.level <= 3 && extensionCount < 11 && extensionCount >= 5) {
                      if (Memory.activeCreeps.roles.filler < Memory.activeCreeps.roles.harvester && Memory.activeCreeps.roles.filler < filler ) {
                         var newName = spawn.createCreep([CARRY, MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, MOVE], undefined, {
                             role: 'filler',
                             working: false,
                             transit: false,
                             return: true
                         });
                       }else if (Memory.activeCreeps.roles.carrier < Memory.activeCreeps.roles.harvester /2 ) {
                             var newName = spawn.createCreep([CARRY, MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, MOVE], undefined, {
                                 role: 'carrier',
                                 working: false,
                                 transit: false,
                                 return: true
                             });
                         }  else if (Memory.activeCreeps.roles.harvester < _.size(_.filter(Game.flags, {
                                color: COLOR_BLUE
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK], undefined, {
                                role: 'harvester',
                                working: false,
                            });
                        }  else if (Memory.activeCreeps.roles.worker < _.size(_.filter(Game.flags, {
                                color: COLOR_GREEN
                            }))) {
                            var newName = spawn.createCreep([WORK, CARRY, CARRY, WORK, MOVE, MOVE, MOVE], undefined, {
                                role: 'worker',
                                working: false
                            });
                        } else if (Memory.activeCreeps.roles.filler < Memory.activeCreeps.roles.harvester && Memory.activeCreeps.roles.filler < filler ) {
                                         var newName = spawn.createCreep([CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE], undefined, {
                                             role: 'filler',
                                             working: false,
                                             transit: false,
                                             return: true
                                         });
                                       }

                         if (Memory.activeCreeps.roles.fighter <= Memory.activeCreeps.roles.healer && Memory.activeCreeps.roles.fighter <= 2) {
                                                    var newName = spawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK], undefined, {
                                                        role: 'fighter',
                                                        fighting: false
                                                    });
                                                } else if (Memory.activeCreeps.roles.healer <= 2) {
                                                    var newName = spawn.createCreep([MOVE, MOVE, MOVE, MOVE, HEAL], undefined, {
                                                        role: 'healer',
                                                        healing: false
                                                    });
                                                }

                    } else if (Game.rooms[name].energyAvailable >= 600 && spawn.room.controller.level == 3) {
                        if (Memory.activeCreeps.roles.harvester < _.size(_.filter(Game.flags, {
                                color: COLOR_BLUE
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, WORK,WORK, WORK, WORK, WORK], undefined, {
                                role: 'harvester',
                                working: false,
                            });
                        } else if (Memory.activeCreeps.roles.carrier < _.size(_.filter(Game.flags, {
                                color: COLOR_PURPLE
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, MOVE], undefined, {
                                role: 'carrier',
                                working: false,
                                transit: false,
                                return: true
                            });
                        } else if (Memory.activeCreeps.roles.builder < _.size(_.filter(Game.flags, {
                                color: COLOR_GREEN
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK], undefined, {
                                role: 'builder',
                                working: false
                            });
                        } else if (Memory.activeCreeps.roles.upgrader < _.size(_.filter(Game.flags, {
                                color: COLOR_YELLOW
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK], undefined, {
                                role: 'upgrader',
                                working: false
                            });
                        } else if (Memory.activeCreeps.roles.claimer < _.size(_.filter(Game.flags, {
                                color: COLOR_BROWN
                            }))) {
                            var newName = spawn.createCreep([MOVE, MOVE, CLAIM], undefined, {
                                role: 'claimer',
                                return: 'true'
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
                    } else if (Game.rooms[name].energyAvailable >= 800 && spawn.room.controller.level == 4) {
                      if (Memory.activeCreeps.roles.filler < Memory.activeCreeps.roles.harvester && Memory.activeCreeps.roles.filler < filler ) {
                         var newName = spawn.createCreep([CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE], undefined, {
                             role: 'filler',
                             working: false,
                             transit: false,
                             return: true
                         });
                       }else if (Memory.activeCreeps.roles.carrier < Memory.activeCreeps.roles.harvester ) {
                             var newName = spawn.createCreep([CARRY, MOVE, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, MOVE], undefined, {
                                 role: 'carrier',
                                 working: false,
                                 transit: false,
                                 return: true
                             });
                         }  else if (Memory.activeCreeps.roles.harvester < _.size(_.filter(Game.flags, {
                                color: COLOR_BLUE
                            })) ) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK], undefined, {
                                role: 'harvester',
                                working: false,
                            });
                        }  else if (Memory.activeCreeps.roles.upgrader < _.size(_.filter(Game.flags, {
                                color: COLOR_YELLOW
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY,CARRY, CARRY,CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK ], undefined, {
                                role: 'upgrader',
                                working: false
                            });
                        } else if (Memory.activeCreeps.roles.builder < _.size(_.filter(Game.flags, {
                                color: COLOR_GREEN
                            }))) {
                            var newName = spawn.createCreep([CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY,CARRY, CARRY,CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK ], undefined, {
                                role: 'builder',
                                working: false
                            });
                        }else if (Memory.activeCreeps.roles.claimer < _.size(_.filter(Game.flags, {
                                color: COLOR_BROWN
                            }))) {
                            var newName = spawn.createCreep([MOVE, MOVE, CLAIM], undefined, {
                                role: 'claimer',
                                return: 'true'
                            });
                        }  if (Memory.activeCreeps.roles.fighter <= Memory.activeCreeps.roles.healer && Memory.activeCreeps.roles.fighter <= 3) {
                            var newName = spawn.createCreep([ TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], undefined, {
                                role: 'fighter',
                                fighting: false
                            });
                        } else if (Memory.activeCreeps.roles.ranger <= Memory.activeCreeps.roles.healer && Memory.activeCreeps.roles.ranger < 3) {
                            var newName = spawn.createCreep([MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, ], undefined, {
                                role: 'ranger',
                                fighting: false
                            });
                        } else if (Memory.activeCreeps.roles.healer <= 2) {
                            var newName = spawn.createCreep([HEAL,HEAL,HEAL, MOVE, MOVE, MOVE, MOVE,MOVE,MOVE], undefined, {
                                role: 'healer',
                                healing: false
                            });
                        }
                    }
                }*/
    }
}
module.exports = roleSpawner;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {
