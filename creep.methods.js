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
                color: COLOR_BROWN,
            });
        }

        if (creep.memory.role == 'fighter' || creep.memory.role == 'healer') {
            var findEmptyFlags = _.filter(Game.flags, {
                color: COLOR_RED,
            });
            creep.memory.home = findEmptyFlags[0].name;
            return;
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
            return;
        }
        this.checkWorkingHarvester(creep);
        this.mine(creep);
        if (creep.memory.working == false) {
            if (Game.rooms[creep.room.name].energyAvailable == Game.rooms[creep.room.name].energyCapacityAvailable) {
                this.repairStructure(creep);
                this.buildStructure(creep);
                this.storeEnergyHarvester(creep);
            } else {
                this.storeEnergyHarvester(creep);
            }
        }
    },
    carry: function(creep) {
        this.checkTransit(creep);
        if (creep.memory.return == true) {
            this.creepMovement(creep);
            return;
        }
        this.checkWorkingCarrier(creep);
        if (creep.memory.working == true) {
            this.withdrawEnergy(creep);
        } else {
            this.storeEnergyCarrier(creep);
        }
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
        if (creep.memory.healing == false) {
            this.combatMovement(creep);
        }
    },
    fighter: function(creep) {
        this.fight(creep);
        if (creep.memory.fighting == false) {
            this.combatMovement(creep);
        }
    },

    //////////////////////////////////////////////////////////////////////////////////////
    // Begin creep actions

    //Combat Actions
    fight: function(creep) {
        var enemies = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(creep) {
                return creep.getActiveBodyparts(HEAL) > 0
            }
        });
        if (enemies == undefined || null) {
            enemies = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: function(creep) {
                    return creep.getActiveBodyparts(ATTACK) > 0
                }
            });
        }
        if (enemies) {
            creep.moveTo(enemies);
            console.log('fightin' + enemies);
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
        if (targets == undefined) {
            for (var roomName in Game.rooms) {
                targets = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);
                if (targets[0] != (undefined || null)) {
                    targets = targets[0];
                    break;
                }
            }
        }
        if (targets) {
            if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets);
            }
        }

    },
    repairStructure: function(creep) {
        var containerToRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object) {
                return object.structureType === STRUCTURE_CONTAINER && (object.hits < object.hitsMax * .75);
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
        }
        if (creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = false;
            creep.memory.return = false;
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
            creep.memory.return = false;
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    // Directed movement

    creepMovement: function(creep) {
        try {
            creep.say('Returning');
            if (creep.room.name != Game.flags[creep.memory.home].pos.roomName) {
                var exitDir = Game.map.findExit(creep.room, Game.flags[creep.memory.home].pos.roomName);
                var exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit);
            } else if (creep.pos.getRangeTo(Game.flags[creep.memory.home]) >= 1) {
                var nextStep = this.nextStepIntoRoom(creep.pos, Game.flags[creep.memory.home].pos.roomName);
                if (nextStep == undefined) {
                    creep.moveTo(Game.flags[creep.memory.home], {
                        reusePath: 10
                    });
                } else {
                    creep.moveTo(nextStep);
                }
            } else {
                creep.memory.return = false;
            }
        } catch (e) {
            console.log('failed to return: name: ' + creep.name);
        }
    },
    combatMovement: function(creep) {
        try {
            creep.say('Rallying');
            if (creep.room.name != Game.flags[creep.memory.home].pos.roomName) {
                creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(Game.flags[creep.memory.home].pos.roomName)));
            } else if (creep.pos.getRangeTo(Game.flags[creep.memory.home]) >= 1) {
                var nextStep = this.nextStepIntoRoom(creep.pos, Game.flags[creep.memory.home].pos.roomName);
                if (nextStep == undefined) {
                    creep.moveTo(Game.flags[creep.memory.home], {
                        reusePath: 10
                    });
                } else {
                    creep.moveTo(nextStep);
                }
            } else {
                creep.memory.return = false;
            }
        } catch (e) {
            console.log('failed to return: ' + e);
        }
    },
    nextStepIntoRoom: function(pos, nextRoom) {
        var x = pos.x;
        var y = pos.y;
        if (pos.x == 0) {
            x = 48;
        }
        if (pos.x == 49) {
            x = 1;
        }
        if (pos.y == 0) {
            y = 48;
        }
        if (pos.y == 49) {
            y = 1;
        }
        if (pos.x == x && pos.y == y) {
            return undefined;
        }
        return new RoomPosition(x, y, nextRoom);
    },


    ///////////////////////////////////////////////////////////////////////////////////////////
    // Energy related actions
    mine: function(creep) {
        if (creep.memory.working) {
            if (creep.harvest(Game.getObjectById(creep.memory.source)) == ERR_NOT_IN_RANGE) {
                this.creepMovement(creep);
            } else if (Game.getObjectById(creep.memory.source) == null) {
                this.creepMovement(creep);
            }
        }
    },
    findStorage: function(creep) {
        if (creep.carry.energy < creep.carryCapacity && creep.memory.working == false) {
            if (Game.rooms[creep.pos.roomName].energyAvailable >= Game.rooms[creep.pos.roomName].energyCapacityAvailable - 50) {
                console.log('spawn is full, take from there!');
                var sources = this.getBuildingsListEmpty(creep);
            } else {
                var sources = this.getContainerList(creep);
                if (sources == (null || undefined)) {
                    sources = this.getBuildingsList(creep);
                }
            }

            if ((creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
                creep.moveTo(sources, {
                    reusePath: 10
                });
            }
        }
    },

    storeEnergyHarvester: function(creep) {
        var sources = this.getContainerListEmpty(creep);
        if (sources == (null || undefined)) {
            sources = this.getMyCarriers(creep);
        }
        if (sources == (undefined || null)) {
            sources = this.getBuildingsList(creep);
        }
        if (sources == (undefined || null)) {
            creep.moveTo(Game.spawns['Spawn1']);
            return;
        }
        this.storeSource(creep, sources);
    },
    storeEnergyCarrier: function(creep) {
        var sources = this.getMyWorkers(creep);
        if (sources == (undefined || null)) {
            sources = this.getBuildingsList(creep);
        }
        if (sources == (undefined || null)) {
            if (Game.rooms[creep.pos.roomName].energyAvailable >= Game.rooms[creep.pos.roomName].energyCapacityAvailable - 50 && creep.pos.roomName == Game.spawns['Spawn1'].pos.roomName) {
                sources = this.getContainerListEmpty(creep);
                creep.say('Storing in a container instead!');
            } else {
                          creep.moveTo(Game.spawns['Spawn1']);
                          return;
            }

        }
        this.storeSource(creep, sources);
    },
    withdrawEnergy: function(creep) {
        var sources = this.getContainerList(creep);
        if (sources == (null || undefined)) {
            sources = this.getMyHarvesters(creep);
            creep.moveTo(sources);
        }
        if (creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources, {
                reusePath: 10
            });
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
    storeSource: function(creep, sources) {
        if (creep.transfer(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            if (creep.moveTo(sources, {
                    reusePath: 10
                }) == OK) {

            }
        }

    },

    getBuildingsList: function(creep) {
        sources = creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy != structure.energyCapacity;
            }
        }));
        if (sources != (undefined || null)) {
            return sources;
        }

        for (var i in Game.spawns) {
            sources = Game.spawns[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy != structure.energyCapacity;
                }
            });
        }
        return sources;
    },

    getBuildingsListEmpty: function(creep) {
        sources = creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy == structure.energyCapacity;
            }
        }));
        if (sources != (undefined || null)) {
            return sources;
        }

        for (var i in Game.spawns) {
            sources = Game.spawns[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) && structure.energy == structure.energyCapacity;
                }
            });
        }
        return sources;
    },

    getContainerList: function(creep) {
        var sources = creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 200;
            }
        }));
        return sources;
    },
    getContainerListEmpty: function(creep) {
        var sources = creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] != structure.storeCapacity;
            }
        }));
        console.log(sources);
        return sources;
    },

    getMyCarriers: function(creep) {
        var sources = creep.pos.findClosestByRange(creep.room.find(FIND_MY_CREEPS, {
            filter: (creeps) => {
                return (creeps.memory.role == 'carrier') && creeps.carry.energy != creeps.carryCapacity && creep.pos.getRangeTo(creeps) < 5;
            }
        }));
        return sources;
    },
    getMyWorkers: function(creep) {
        var sources = creep.pos.findClosestByRange(creep.room.find(FIND_MY_CREEPS, {
            filter: (creeps) => {
                return (creeps.memory.role !== 'carrier') && (creeps.memory.role !== 'harvester') && creeps.carry.energy != creeps.carryCapacity && creep.pos.getRangeTo(creeps) < 2;
            }
        }));
        return sources;
    },

    getMyHarvesters: function(creep) {
        var sources = creep.pos.findClosestByRange(creep.room.find(FIND_MY_CREEPS, {
            filter: (creeps) => {
                return (creeps.memory.role == 'harvester') && creeps.carry.energy == creeps.carryCapacity;
            }
        }));
        return sources;
    }
};



module.exports = creepMethods;
