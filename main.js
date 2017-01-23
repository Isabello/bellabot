var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');
var roleConstructor = require('role.constructor');
var roleCarrier = require('role.carrier');
var roleStationaryHarvester = require('role.stationaryHarvester');
var cleaner = require('cleaner');
var areaInit = require('method.areaInit');
var initFlags = require('method.initFlags');
var _ = require('lodash');

Memory.flags = {};

module.exports.loop = function() {

    cleaner.tick();
    /* Spawns new creeps */
    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        if (spawn.memory.free_spaces_marked == true ) {
          //areaInit.initFlags();
        }
        roleSpawner.run(spawn);
        roleConstructor.run(spawn);
        areaInit.run(spawn);
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
        //var flags = creep.room.find(FIND_FLAGS)
      //  console.log(JSON.stringify(flags));

    }

}
