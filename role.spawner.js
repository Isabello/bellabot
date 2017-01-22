//var roleConstants = require('role.constants');

var roleSpawner = {

    /** @param {}  **/
    run: function(spawn) {



    if (spawn.memory.init == undefined)
    {
      spawn.memory.MAX_HARVESTERS = 1;
      spawn.memory.MAX_UPGRADERS = 1;
      spawn.memory.MAX_BUILDERS = 8;
      spawn.memory.MAX_STATIONARY = 1;
      spawn.memory.MAX_CARRIER = 1;
      spawn.memory.init = true;
    }


    for(var name in Game.rooms) {
            console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
            if ( Game.rooms[name].energyAvailable >= 200 && _.size(_.filter(Game.creeps, {memory: { role : 'harvester'} })) < spawn.memory.MAX_HARVESTERS ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
                console.log('Spawning new harvester: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(_.filter(Game.creeps, {memory: { role : 'stationary'} })) < spawn.memory.MAX_STATIONARY ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'stationary'});
                console.log('Spawning new stationary: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(_.filter(Game.creeps, {memory: { role : 'carrier'} })) < spawn.memory.MAX_CARRIER ) {
                var newName = spawn.createCreep([CARRY,MOVE,MOVE], undefined, {role: 'carrier'});
                console.log('Spawning new Carrier: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(_.filter(Game.creeps, {memory: { role : 'upgrader'} })) <  spawn.memory.MAX_UPGRADERS ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
                console.log('Spawning new upgrader: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(_.filter(Game.creeps, {memory: { role : 'builder'} })) < spawn.memory.MAX_BUILDERS ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
                console.log('Spawning new builder: ' + newName);
            }

        }
    }


};

module.exports = roleSpawner;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {
