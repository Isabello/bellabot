var creepMethods = {

    /////////////////////////////////////////////////////////////////////////////////////
    // Helper methods for creep init
    assignSource: function(creep) {
        try {
            if (creep.memory.source == undefined) {
                var sources = Game.flags[creep.memory.home].pos.findClosestByPath(FIND_SOURCES);
                creep.memory.source = sources.id;
                creep.memory.return = true;
            }
        } catch (e) {
            this.creepMovement(creep);
        }
    },
    creepFindHome: function(creep) {
        // This finds the first empty mining flag for live at
        try {
            this.findEmpty(creep);
        } catch (e) {
            console.log('creepFindHome: ' + e)
            return
        }
    },

    findEmpty: function(creep) {
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

        if (creep.memory.role == 'upgrader') {
            var findEmptyFlags = _.filter(Game.flags, {
                color: COLOR_YELLOW,

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


        for (var i in findEmptyFlags) {
            if (findEmptyFlags[i].memory.occupied == false || findEmptyFlags[i].memory.occupied == undefined) {
                creep.memory.home = findEmptyFlags[i].name;
                findEmptyFlags[i].memory = {
                    'occupied': true,
                    'owner': creep.id,
                    'owner_name': creep.name
                };
                return;
            }
        }
    },

    /////////////////////////////////////////////////////////////////////////////////////
    // Creep tasks by roles
    harvest: function(creep) {
        this.assignSource(creep);
        if (creep.memory.return == true) {
            this.creepMovement(creep);
        }
        this.checkWorkingHarvester(creep);
        this.mine(creep);
        if (creep.memory.working == false) {
            this.storeEnergy(creep);
            this.repairStructure(creep);
            this.buildStructure(creep);
        }
    },

    carry: function(creep) {
        this.checkTransit(creep);
        if (creep.memory.return == true) {
            this.creepMovement(creep);
            return;
        }
        this.checkWorkingCarrier(creep);
        this.findStorage(creep);
        this.storeEnergy(creep);
    },

    upgrade: function(creep) {
        this.checkWorking(creep);
        this.findStorage(creep);
        this.upgradeRoom(creep);
    },

    build: function(creep) {
        this.checkWorking(creep);
        this.findStorage(creep);
        this.buildStructure(creep);
    },

    claim: function(creep) {
        this.claimRoom(creep);
    },
    healer: function(creep) {
        this.heal(creep);
    },
    fighter: function(creep) {
        this.fight(creep);
    },

    //////////////////////////////////////////////////////////////////////////////////////
    // Begin creep actions

    //Combat Actions
    fight: function(creep) {
        var enemies = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemies) {
            creep.moveTo(enemies);
            creep.attack(enemies);
            creep.memory.fighting = true;
        } else {
            creep.memory.fighting = false;
        }
    },
    heal: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        if (target) {
            if (creep.heal(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {
                    reusePath: 10
                });

            }
            creep.memory.healing = true;
        } else {
            creep.memory.healing = false;
        }
    },

    // Expansion Actions
    claimRoom: function(creep) {
        if (!creep.memory.claiming && creep.pos.getRangeTo(Game.flags[creep.memory.home]) > 3) {
            creep.moveTo(Game.flags[creep.memory.home]);
        } else {
            if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    reusePath: 10
                });
            }
            creep.memory.claiming = true;
        }
    },


    buildStructure: function(creep) {
        var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (targets) {
            if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets);
            }
        }
    },
    repairStructure: function(creep) {
        var containerToRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object) {
                return object.structureType === STRUCTURE_CONTAINER && (object.hits > object.hitsMax / 3);
            }
        });
        if (containerToRepair) {
            creep.moveTo(containerToRepair);
            creep.repair(containerToRepair);
        } else {
            var roadToRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object) {
                    return (object.structureContainer) && (object.hits > object.hitsMax / 3);
                }
            });
            if (roadToRepair) {
                creep.moveTo(roadToRepair);
                creep.repair(roadToRepair);
            }
        }
    },

    upgradeRoom: function(creep) {
        if (creep.memory.working == true) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    reusePath: 10
                });
                creep.say('Upgrading');
            }
        }
    },

    ////////////////////////////////////////////////////////////////
    // Creep activity checks
    checkWorking: function(creep) {
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('Reqing!');
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('Buildin^_^');
        }
    },

    checkWorkingHarvester: function(creep) {
        if (!creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = true;
            creep.say('Mining');
        }
        if (creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = false;
            creep.say('Dumping');
        }
    },
    checkWorkingCarrier: function(creep) {
        if (!creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = true;
            creep.say('Searching');
        }
        if (creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = false;
            creep.say('Storing');
        }
    },

    checkTransit: function(creep) {
        if (creep.memory.transit && creep.carry.energy == 0) {
            creep.memory.return = true;
            creep.memory.transit = false;
        }

        if (!creep.memory.transit && creep.carry.energy >= creep.carryCapacity - 49) {
            creep.memory.transit = true;
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    // Directed movement

    creepMovement: function(creep) {
        try {
            creep.say('Returning');
            if (creep.room.name != Game.flags[creep.memory.home].pos.roomName) {
                creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(Game.flags[creep.memory.home].pos.roomName), {
                    reusePath: 10
                }));

            } else if (creep.pos.getRangeTo(Game.flags[creep.memory.home]) >= 3) {

                creep.moveTo(Game.flags[creep.memory.home], {
                    reusePath: 10
                });

            } else {
                creep.memory.return = false;
            }
        } catch (e) {
            console.log('failed to return');
        }
    },

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Energy related actions
    mine: function(creep) {
        if (creep.memory.working) {
            if (creep.harvest(Game.getObjectById(creep.memory.source)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.source), {
                    reUsePath: 0
                });
            }
        }
    },

    findStorage: function(creep) {
        if (creep.carry.energy < creep.carryCapacity && creep.memory.working == false && creep.memory.role != 'carrier') {
            var sources = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] != 0;
                }
            });
            console.log('findStorage: ' + sources);
            if (!sources) {
                sources = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy > structure.energyCapacity / 2;
                    }
                });
            }
            if ((creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
                creep.moveTo(sources, {
                    reusePath: 10
                });
            }
        } else if (creep.carry.energy < creep.carryCapacity && creep.memory.transit == false) {
            var sources = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return (creep.memory.role == 'harvester') && creep.carry.energy == creep.carryCapacity;
                }
            });
            console.log('findStorage: ' + sources);
            creep.moveTo(sources, {
                reusePath: 10
            });

        }
    },

    storeEnergy: function(creep) {
        if (creep.memory.transit == true && creep.memory.role != 'harvester') {
            var sources = this.getBuildingsList(creep);
            this.storeSourcesList(creep, sources);
        } else if (creep.memory.role != 'carrier') {
            var sources = this.getMyCarriers(creep);
            if (sources[0] == undefined) {
                sources = this.getBuildingsList(creep);
                this.storeSourcesList(creep, sources);
            } else {
                this.storeSourcesList(creep, sources);
            }
        }
    },

    withdrawEnergy: function(creep) {
        var sources = this.getContainerList(creep);
        for (var i in sources) {
            if (creep.withdraw(sources[i]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[i], {
                    reusePath: 10
                });
                break;
            }
        }
    },

    //////////////////////////////////////////////////
    // information gathering actions
    storeSourcesList: function(creep, sources) {
        for (var i in sources) {
            if (creep.transfer(sources[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if (creep.moveTo(sources[i], {
                        reusePath: 10
                    }) == OK) {
                    break;
                }
            }
        }
    },

    getBuildingsList: function(creep) {
        var sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy != structure.energyCapacity;
            }
        });
        if (!sources[0]) {
          for (var i in Game.spawns) {
            sources = Game.spawns[i].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy != structure.energyCapacity;
                }
            });
          }
        }
        return sources;
    },

    getContainerList: function(creep) {
        var sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] != 0;
            }
        });
        return sources;
    },

    getMyCarriers: function(creep) {
        try {
            var sources = creep.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return (creep.memory.role == 'carrier') && creep.carry.energy != creep.carryCapacity;
                }
            });
            return sources;
        } catch (e) {

        }
    }

};



module.exports = creepMethods;
