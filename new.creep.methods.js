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
    assignTarget: function(creep) {
        if (creep.memory.target == undefined && creep.carry.energy != 0) {
            var maxRange = 100;
            var structure = null;
            var number = null;
            if (Memory.structures.store.STRUCTURE_EXTENSION.length > 0) {
                for (var i in Memory.structures.store.STRUCTURE_EXTENSION) {
                    var range = creep.pos.getRangeTo(Game.getObjectById(Memory.structures.store.STRUCTURE_EXTENSION[i]));
                    if (range < maxRange) {
                        maxRange = range;
                        number = i;
                        structure = Game.getObjectById(Memory.structures.store.STRUCTURE_EXTENSION[i]);
                    }
                }
                creep.memory.target = Memory.structures.store.STRUCTURE_EXTENSION[number];
                Memory.structures.store.STRUCTURE_EXTENSION.splice(number, 1);
            } else if (Memory.structures.store.STRUCTURE_SPAWN.length > 0) {
                for (var i in Memory.structures.store.STRUCTURE_SPAWN) {
                    var range = creep.pos.getRangeTo(Game.getObjectById(Memory.structures.store.STRUCTURE_SPAWN[i]));
                    if (range < maxRange) {
                        maxRange = range;
                        number = i;
                        structure = Game.getObjectById(Memory.structures.store.STRUCTURE_SPAWN[i]);
                    }
                }
                creep.memory.target = Memory.structures.store.STRUCTURE_SPAWN[number];
                Memory.structures.store.STRUCTURE_SPAWN.splice(number, 1);
            } else if (Memory.structures.store.STRUCTURE_CONTAINER.length > 0) {
                for (var i in Memory.structures.store.STRUCTURE_CONTAINER) {
                    var range = creep.pos.getRangeTo(Game.getObjectById(Memory.structures.store.STRUCTURE_CONTAINER[i]));
                    if (range < maxRange) {
                        maxRange = range;
                        number = i;
                        structure = Game.getObjectById(Memory.structures.store.STRUCTURE_CONTAINER[i]);
                    }
                }
                creep.memory.target = Memory.structures.store.STRUCTURE_CONTAINER[number];
                Memory.structures.store.STRUCTURE_CONTAINER.splice(number, 1);
            } else if (Memory.structures.store.STRUCTURE_TOWER.length > 0) {
                creep.memory.target = Memory.structures.store.STRUCTURE_TOWER.pop();
            }
        }
    },
    getEnergy: function(creep) {
        if (creep.carry.energy < creep.carryCapacity * .67 ) {
            this.findEnergy(creep);
            switch (creep.pickup(this.getTarget(creep))) {
                case ERR_FULL:
                    creep.memory.target = undefined;
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(this.getTarget(creep));
                    return;
                    break;
                case ERR_INVALID_TARGET:
                  creep.memory.target = undefined;
                  break;
            }
            switch (creep.withdraw(this.getNearestBuilding(creep), RESOURCE_ENERGY)) {
                case OK:
                    creep.memory.target = undefined;
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(this.getNearestBuilding(creep));
                    break;
                case ERR_FULL:
                    creep.memory.target = undefined;
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.memory.target = undefined;
                    break;
            }
            return true;
        }
    },
    storeEnergy: function(creep) {
        if (creep.memory.target && creep.carry.energy > 0) {
            try {
                if (Game.getObjectById(creep.memory.target).resourceType == 'energy' || Game.getObjectById(creep.memory.target) == undefined || creep.memory.target == null ) {
                    creep.memory.target = undefined;
                    this.assignTarget(creep);
                }
            } catch (e) {

            }
            console.log(this.getTarget(creep));
            switch (creep.transfer(this.getTarget(creep), RESOURCE_ENERGY)) {
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.memory.target = undefined;
                    break;
                case ERR_FULL:
                    creep.memory.target = undefined;
                    this.assignTarget(creep);
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(this.getTarget(creep));
                    creep.transfer(this.getTarget(creep), RESOURCE_ENERGY);
                    break;
                case ERR_INVALID_TARGET:
                      creep.moveTo(Game.spawns['Spawn1'].pos);
                      creep.memory.target = undefined;
                      this.assignTarget(creep);
                    break;
                case ERR_INVALID_ARGS:
                    creep.memory.target = undefined;
                    break;
            }
        } else if (creep.carry.energy == creep.carryCapacity && creep.memory.target == undefined){
            creep.moveTo(Game.spawns['Spawn1'].pos);
            this.assignTarget(creep);
        }
    },
    getTarget: function(creep) {
        return Game.getObjectById(creep.memory.target);
    },
    getNearestBuilding: function(creep) {
        var building = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structures) {
                return (structures.structureType == STRUCTURE_STORAGE || structures.structureType == STRUCTURE_CONTAINER) && structures.store[RESOURCE_ENERGY] > 100;
            }
        });
        return building;
    },

    findEmpty: function(creep) {
        //PRIORITIZE CLOSEST FLAGS
        if (creep.memory.role == 'harvester') {
            var findEmptyFlags = _.filter(Game.flags, {
                color: COLOR_BLUE
            });
        }
        if (creep.memory.role == 'claimer') {
            var findEmptyFlags = _.filter(Game.flags, {
                color: COLOR_BROWN,
            });
        }
        if (creep.memory.role == 'fighter' || creep.memory.role == 'healer' || creep.memory.role == 'ranger') {
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

    findEnergy: function(creep) {
        var energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
            filter: function(energy) {
                return energy.amount > 300
            }
        });
        var maxRange = 100;
        var structure = null;
        var number = null;
        if (energy == undefined) {
            if (Memory.structures.energy.AVAILABLE.length > 0) {
              if (Game.getObjectById(creep.memory.target) == undefined || Game.getObjectById(creep.memory.target).resourceType == undefined ){
                creep.memory.target = undefined;
                console.log(Memory.structures.energy.AVAILABLE);
              }
              if (creep.memory.target == undefined){
                creep.memory.target = Memory.structures.energy.AVAILABLE[_.random(0, _.size(Memory.structures.energy.AVAILABLE))];
              }
            }
            return;
        } else {
            creep.memory.target = energy.id;
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
        this.mine(creep);
        this.storeEnergyHarvester(creep)
        if (creep.carry.energy == creep.carryCapacity) {
          creep.build(creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES));
            creep.drop(RESOURCE_ENERGY);
        }
        //this.detectEnemies(creep);
    },
    carry: function(creep) {
        if (this.getEnergy(creep)){
          return;
        }
        this.storeEnergy(creep)
        this.assignTarget(creep);
    },
    worker: function(creep) {
        this.checkWorking(creep);
        if (creep.memory.working == true) {
            this.buildStructure(creep);
            if (creep.memory.building == false) {
                this.upgradeRoom(creep);
            }
        } else {
            this.getEnergy(creep);
        }
    },
    repair: function(creep) {
        this.checkWorking(creep);
        if (creep.memory.working == true) {
            this.repairStructure(creep);
        } else {
            this.getEnergy(creep);
        }
    },
    claim: function(creep) {
        if (creep.memory.return == true) {
            this.creepMovement(creep);
            return;
        }
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
    ranger: function(creep) {
        this.fight(creep);
        if (creep.memory.fighting == false) {
            this.combatMovement(creep);
        }
    },
    //////////////////////////////////////////////////////////////////////////////////////
    // Begin creep actions

    //Combat Actions

    detectEnemies: function(creep) {
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies[0] != (undefined || null)) {
            var redFlag = _.filter(Game.flags, {
                color: COLOR_RED,
            });
            redFlag[0].setPosition(enemies[0].pos.x, enemies[0].pos.y);
            if (Game.flags['escape'] == undefined) {
                var flag = Game.rooms.W6N1.createFlag(enemies[0].pos.x, enemies[0].pos.y, escape, COLOR_GREY);
            }

        } else {
            try {
                Game.flags['escape'].remove();
            } catch (e) {
                console.log('no flag?' + e);

            }
        }
    },
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
            creep.attack(enemies);
            creep.rangedAttack(enemies);
            creep.memory.fighting = true;
            creep.moveTo(enemies);
            console.log('fightin' + enemies);
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
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    reusePath: 10
                });
            } else if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
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
        if (targets != '') {
            if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets);
            }
            creep.memory.building = true;
        } else {
            creep.memory.building = false;
            //  this.repairStructure(creep);
        }

    },
    repairStructure: function(creep) {
        var roadToRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object) {
                return (object.structureType == STRUCTURE_ROAD || object.structureType == STRUCTURE_WALL) && (object.hits < object.hitsMax / 3);
            }
        });
        if (roadToRepair) {
            creep.moveTo(roadToRepair);
            creep.repair(roadToRepair);
        } else {
            var containerToRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object) {
                    return (object.structureType == STRUCTURE_CONTAINER) && (object.hits < object.hitsMax / 4);
                }
            });

            if (containerToRepair) {
                creep.moveTo(containerToRepair);
                creep.repair(containerToRepair);
            }
        }
    },
    upgradeRoom: function(creep) {
        if (creep.memory.working == true) {
            if (creep.room.controller.level == 0) {
                creep.moveTo(Game.spawns['Spawn1']);
                return;
            }
            if (creep.room.controller)
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {
                        reusePath: 10
                    });
                    creep.say('Upgrading');
                }
            creep.moveTo(creep.room.controller, {
                reusePath: 10
            });
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
            creep.memory.return = false;
            creep.memory.transit = false;
        }

        if (!creep.memory.transit && creep.carry.energy >= creep.carryCapacity - 49) {
            creep.memory.working = false;
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
        } catch (e) {}
    },
    combatMovement: function(creep) {
        try {
            creep.say('Rallying');
            if (creep.room.name != Game.flags[creep.memory.home].pos.roomName) {
                creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(Game.flags[creep.memory.home].pos.roomName)));
            } else if (creep.pos.getRangeTo(Game.flags[creep.memory.home]) >= 3) {
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
        } catch (e) {}
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
        if (creep.harvest(Game.getObjectById(creep.memory.source)) == ERR_NOT_IN_RANGE) {
            this.creepMovement(creep);
        } else if (Game.getObjectById(creep.memory.source) == null) {
            this.creepMovement(creep);
        }


    },

    storeEnergyHarvester: function(creep) {
        var sources = this.getContainerEmptyHarvester(creep);
        this.storeSource(creep, sources);
    },
    storeEnergyCarrier: function(creep) {
        var sources = this.getBuildings(creep);
        if (sources == (undefined || null)) {
            sources = this.getTowers(creep);
        }
        if (sources == (undefined || null)) {
            sources = this.getStorageEmpty(creep);
        }
        if (sources == (undefined || null)) {
            sources = this.getMyWorkers(creep);
        }
        this.storeSource(creep, sources);
    },
    storeEnergyFiller: function(creep) {
        var sources = this.getMyWorkers(creep);
        if (sources == (undefined || null)) {
            sources = this.getStorageEmpty(creep);
        }
        if (sources == (undefined || null)) {
            sources = this.getContainerEmpty(creep);
        }
        this.storeSource(creep, sources);
    },
    withdrawEnergy: function(creep) {
        var sources = this.getContainer(creep);
        if (sources == (null || undefined)) {
            sources = this.getStorage(creep);
        }
        if (sources == (null || undefined)) {
            sources = this.getBuildingsFull(creep);
        }
        if (sources == (null || undefined)) {
            creep.memory.return = true;
        }
        if (creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources, {
                reusePath: 10
            });
        }
    },

    //////////////////////////////////////////////////
    // information gathering actions
    storeSource: function(creep, sources) {
        if (creep.transfer(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            if (creep.moveTo(sources, {
                    reusePath: 10
                }) == OK) {}
        }
    },
    getBuildings: function(creep) {
        sources = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy != structure.energyCapacity;
            }
        }));
        if (sources != (undefined || null)) {
            return sources;
        }

        for (var i in Game.spawns) {
            sources = Game.spawns[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) && structure.energy != structure.energyCapacity;
                }
            });
        }
        return sources;
    },
    getBuildingsFull: function(creep) {
        sources = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN) && structure.energy == structure.energyCapacity;
            }
        }));
        if (sources != (undefined || null)) {
            return sources;
        }

        for (var i in Game.spawns) {
            sources = Game.spawns[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN) && structure.energy == structure.energyCapacity;
                }
            });
        }
        return sources;
    },
    getContainer: function(creep) {
        var sources = creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 200;
            }
        }));
        if (sources != (undefined || null)) {
            return sources;
        }
        for (var i in Game.spawns) {
            sources = Game.spawns[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >= 200;
                }
            });
        }
        return sources;
    },
    getTowers: function(creep) {
        var sources = creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) && structure.energy != structure.energyCapacity;
            }
        }));
        return sources;
    },
    getContainerEmpty: function(creep) {
        for (var i in Game.spawns) {
            sources = Game.spawns[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] != structure.storeCapacity;
                }
            });
        }
        return sources;
    },
    getContainerEmptyHarvester: function(creep) {
        var sources = creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] != structure.storeCapacity && creep.pos.getRangeTo(structure) < 3;
            }
        }));
        return sources;
    },
    getStorage: function(creep) {
        var sources = creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= 100;
            }
        }));

        if (sources != (undefined || null)) {
            return sources;
        }
        for (var i in Game.spawns) {
            sources = Game.spawns[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= 5000;
                }
            });
        }
        return sources;
    },
    getStorageEmpty: function(creep) {
        for (var i in Game.spawns) {
            sources = Game.spawns[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] != structure.storeCapacity;
                }
            });
        }
        return sources;
    },
    getMyWorkers: function(creep) {
        for (var i in Game.rooms) {
            var sources = Game.rooms[i].find(FIND_MY_CREEPS, {
                filter: (creeps) => {
                    return (creeps.memory.role == 'worker') && creeps.carry.energy < creeps.carryCapacity;
                }
            });
            if (sources[0] != ('' || undefined || null)) {
                sources = sources[_.random(0, _.size(sources))];
                break;
            }
        };

        return sources;
    }
};



module.exports = creepMethods;
