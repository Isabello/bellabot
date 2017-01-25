var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');
var roleConstructor = require('role.constructor');
var roleCarrier = require('role.carrier');
var roleFighter = require('role.fighter');
var roleHealer = require('role.healer');
var cleaner = require('cleaner');
var areaInit = require('method.areaInit');
var initFlags = require('method.initFlags');
var waypointFlags = require('method.waypointFlags');
var _ = require('lodash');
require('screeps-perf')();
// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
const profiler = require('screeps-profiler');

// This line monkey patches the global prototypes.
profiler.enable();
module.exports.loop = function() {
    profiler.wrap(function() {

        var activeCreeps = {
            'roles': {
                harvester: 0,
                carrier: 0,
                builder: 0,
                upgrader: 0,
                fighter: 0,
                healer: 0,
            }
        }
        var role;

        for (var thisRoom in Game.rooms) {
            cleaner.tick(thisRoom);
            waypointFlags.run(thisRoom);
        }


        /*
            var tower = Game.getObjectById('TOWER_ID');
            if (tower) {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }

                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                }
            }
        */

        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.spawning == true) {
                return
            }

            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if (creep.memory.role == 'carrier') {
                roleCarrier.run(creep);
            }
            if (creep.memory.role == 'fighter') {
                roleFighter.run(creep);
            }
            if (creep.memory.role == 'healer') {
                roleHealer.run(creep);
            }
            role = Game.creeps[name].memory.role;
            activeCreeps.roles[role] += 1;
        }
        /* Spawns new creeps */
        for (var name in Game.spawns) {
            var spawn = Game.spawns[name];
            if (spawn.memory.marked == true) {
                if (spawn.memory.flags == false) {
                    initFlags.run(spawn);
                }
            }
            if (spawn.memory.init == undefined) {
                areaInit.run(spawn);
            }
            console.log(JSON.stringify(activeCreeps.roles));
            roleSpawner.run(spawn, activeCreeps);
            roleConstructor.run(spawn);

        }
        /*
        for (var name in Game.creeps) {          var creep = Game.creeps[name];  creep.memory.home = false;    }*/

    });
}
