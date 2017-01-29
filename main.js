var creepMaster = require('creeps.master');
var roleConstructor = require('role.constructor');
var roleSpawner = require('role.spawner');
var roleTower = require('role.tower');
var memoryTransport = require('memory.transport');
var _ = require('lodash');
require('screeps-perf')();
// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
const profiler = require('screeps-profiler');

// This line monkey patches the global prototypes.
profiler.enable();
module.exports.loop = function() {
    profiler.wrap(function() {
        var tower = Game.getObjectById('faaf2b5ff0294f7');
        roleTower.run(tower);

        var activeCreeps = {
            'roles': {
                harvester: 0,
                carrier: 0,
                worker: 0,
                repair: 0,
                fighter: 0,
                ranger: 0,
                healer: 0,
                claimer: 0,
                filler: 0
            }
        };
                Memory.activeCreeps = activeCreeps;
        var targeter = memoryTransport.initTargeter();
        var structures = memoryTransport.initStructures();
        var energy = memoryTransport.checkFreeEnergy(Memory.structures);
      //  console.log(JSON.stringify(Memory.structures));

        var role;
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            creepMaster.run(creep);
            role = creep.memory.role;
            Memory.activeCreeps.roles[role] += 1;
        }


        // Spawns new creeps
        for (var name in Game.spawns) {
            var spawn = Game.spawns[name];
            roleSpawner.run(spawn);
            roleConstructor.run(spawn);
        }
        console.log(JSON.stringify(Memory.activeCreeps.roles));
        Memory.activeCreeps = activeCreeps;
        //  for (var name in Game.creeps) {          var creep = Game.creeps[name];  creep.memory.home = false;    }
    });

}
