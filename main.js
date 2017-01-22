var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');
var roleConstructor = require('role.constructor');
var roleCarrier = require('role.carrier');
var roleStationaryHarvester = require('role.stationaryHarvester');
var cleaner = require('cleaner');

var _ = require('lodash');

module.exports.loop = function() {


    cleaner.tick();
    /* Spawns new creeps */

    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        roleSpawner.run(spawn);
        roleConstructor.run(spawn);
    }

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

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
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
        if (creep.memory.role == 'stationary') {
            roleStationaryHarvester.run(creep);
        }

    }

}
