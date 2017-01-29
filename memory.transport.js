var memoryTransport = {

    /** @param {Creep} creep **/
    run: function(spawn) {


        this.initCreeps();
        this.initStructures();
    },
    checkFreeStructures: function(structures) {
        for (var i in Game.rooms) {
            var findStructures = Game.rooms[i].find(FIND_STRUCTURES, {
                filter: function(object) {
                    return object.structureType != STRUCTURE_ROAD && object.structureType != STRUCTURE_CONTROLLER
                }
            });

            for (var structure in findStructures) {
                var exit;
                for (var creep in Memory.targeter.assigned) {
                    if (findStructures[structure].id == Memory.targeter.assigned[creep].target) {
                        switch (findStructures[structure].structureType) {
                            case STRUCTURE_SPAWN:
                                structures.inUse.STRUCTURE_SPAWN.push(findStructures[structure].id);
                                break;
                            case STRUCTURE_EXTENSION:
                                structures.inUse.STRUCTURE_EXTENSION.push(findStructures[structure].id);
                                break;
                            case STRUCTURE_TOWER:
                                structures.inUse.STRUCTURE_TOWER.push(findStructures[structure].id);
                                break;
                        }
                        exit = true;
                        break;
                    } else {
                        exit = false;
                    }
                }
                try {
                    if (findStructures[structure].energy != undefined ) {
                       if (findStructures[structure].energy == findStructures[structure].energyCapacity) {
                        switch (findStructures[structure].structureType) {
                            case STRUCTURE_SPAWN:
                                structures.full.STRUCTURE_SPAWN.push(findStructures[structure].id);
                                break;
                            case STRUCTURE_EXTENSION:
                                structures.full.STRUCTURE_EXTENSION.push(findStructures[structure].id);
                                break;
                            case STRUCTURE_TOWER:
                                structures.full.STRUCTURE_TOWER.push(findStructures[structure].id);
                                break;
                        }
                        continue;
                      }
                    } else if (findStructures[structure].store[RESOURCE_ENERGY] >= 1500) {
                        switch (findStructures[structure].structureType) {
                          case STRUCTURE_STORAGE:
                              structures.full.STRUCTURE_STORAGE.push(findStructures[structure].id);
                              break;
                          case STRUCTURE_CONTAINER:
                              structures.full.STRUCTURE_CONTAINER.push(findStructures[structure].id);
                              break;

                        }
                      continue;
                    }
                } catch (e) {
          

                }

                if (exit == true) {
                    continue;
                }

                switch (findStructures[structure].structureType) {
                    case STRUCTURE_SPAWN:
                        structures.store.STRUCTURE_SPAWN.push(findStructures[structure].id);
                        break;
                    case STRUCTURE_EXTENSION:
                        structures.store.STRUCTURE_EXTENSION.push(findStructures[structure].id);
                        break;
                    case STRUCTURE_TOWER:
                        structures.store.STRUCTURE_TOWER.push(findStructures[structure].id);
                        break;
                    case STRUCTURE_STORAGE:
                        structures.store.STRUCTURE_STORAGE.push(findStructures[structure].id);
                        break;
                    case STRUCTURE_CONTAINER:
                        structures.store.STRUCTURE_CONTAINER.push(findStructures[structure].id);
                        break;
                }
            }
        }
        Memory.structures = structures;
    },
    checkFreeEnergy: function(structures) {
        for (var i in Game.rooms) {
        var energy = Game.rooms[i].find(FIND_DROPPED_ENERGY, {
          filter: function(energy) {
              return energy.amount > 100
            }
        });
          for (var n in energy){
            structures.energy.AVAILABLE.push(energy[n].id);
          }
      }
    },
    checkFreeCreeps: function(creeps) {
        for (var i in Game.rooms) {
            var findCreeps = Game.rooms[i].find(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.memory.role != 'harvester';
                }
            });
            Object.keys(findCreeps).forEach(creep => {
                if (findCreeps[creep].memory.target) {
                    creeps.assigned.push({
                        id: findCreeps[creep].id,
                        name: findCreeps[creep].name,
                        target: findCreeps[creep].memory.target
                    });
                } else {
                    creeps.free.push({
                        id: findCreeps[creep].id,
                        name: findCreeps[creep].name,
                        target: null
                    });
                }

            });
        }
        Memory.targeter = creeps;
    },

    initStructures: function() {
        var structures = {
            store: {
                STRUCTURE_CONTAINER: [],
                STRUCTURE_EXTENSION: [],
                STRUCTURE_SPAWN: [],
                STRUCTURE_STORAGE: [],
                STRUCTURE_TOWER: []
            },
            inUse: {
                STRUCTURE_CONTAINER: [],
                STRUCTURE_EXTENSION: [],
                STRUCTURE_SPAWN: [],
                STRUCTURE_STORAGE: [],
                STRUCTURE_TOWER: []
            },
            full: {
                STRUCTURE_CONTAINER: [],
                STRUCTURE_EXTENSION: [],
                STRUCTURE_SPAWN: [],
                STRUCTURE_STORAGE: [],
                STRUCTURE_TOWER: []
            },
            energy: {
              AVAILABLE: []
            }
        };
        this.checkFreeStructures(structures);
    },
    initTargeter: function() {
        var creeps = {
            assigned: [],
            free: []
        };
        this.checkFreeCreeps(creeps);
    }
};


module.exports = memoryTransport;
