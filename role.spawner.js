//var roleConstants = require('role.constants');

var roleSpawner = {

    /** @param {}  **/
    run: function(spawn) {
        
   for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
        
    var harvesters = _.filter(Game.creeps, {memory: { role : 'harvester'} });
    var upgraders = _.filter(Game.creeps, {memory: { role : 'upgrader'} });
    var builders = _.filter(Game.creeps, {memory: { role : 'builder'} });
    var stationary  = _.filter(Game.creeps, {memory: { role : 'stationary'} });
    var carrier = _.filter(Game.creeps, {memory: { role : 'carrier'} });
    var  MAX_HARVESTERS = 1;
    var  MAX_UPGRADERS = 1;
    var  MAX_BUILDERS = 1;
    var MAX_STATIONARY = 1;
    var MAX_CARRIER = 1;
        for(var name in Game.rooms) {
            console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
            if ( Game.rooms[name].energyAvailable >= 200 && _.size(harvesters) < MAX_HARVESTERS ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], 'Harvester'+(_.size(harvesters)), {role: 'harvester'});
                console.log('Spawning new harvester: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(stationary) < MAX_STATIONARY ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], 'Stationary'+(_.size(stationary)), {role: 'stationary'});
                console.log('Spawning new stationary: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(carrier) < MAX_CARRIER ) {
                var newName = spawn.createCreep([CARRY,MOVE,MOVE], 'Carrier'+(_.size(carrier)), {role: 'carrier'});
                console.log('Spawning new Carrier: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(upgraders) <  MAX_UPGRADERS ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], 'Upgrader'+(_.size(upgraders)), {role: 'upgrader'});
                console.log('Spawning new upgrader: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(builders) <  MAX_BUILDERS ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], 'Builder'+(_.size(builders)), {role: 'builder'});
                console.log('Spawning new builder: ' + newName);
            } 
            
        }
    }
    
    
};

module.exports = roleSpawner;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {