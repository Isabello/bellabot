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
    var remote_harvesters = _.filter(Game.creeps, {memory: { role : 'remote_harvester'} });
    var  MAX_HARVESTERS = 3;
    var  MAX_UPGRADERS = 1;
    var  MAX_BUILDERS = 1;
    var  MAX_REMOTE_HARVESTER = 20;
        for(var name in Game.rooms) {
            console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
            if ( Game.rooms[name].energyAvailable >= 200 && _.size(harvesters) < MAX_HARVESTERS ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], 'Harvester'+(_.size(harvesters)), {role: 'harvester'});
                console.log('Spawning new harvester: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(upgraders) <  MAX_UPGRADERS ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], 'Upgrader'+(_.size(upgraders)), {role: 'upgrader'});
                console.log('Spawning new upgrader: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(builders) <  MAX_BUILDERS ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], 'Builder'+(_.size(builders)), {role: 'builder'});
                console.log('Spawning new builder: ' + newName);
            } else if ( Game.rooms[name].energyAvailable >= 200 && _.size(remote_harvesters) <  MAX_REMOTE_HARVESTER ) {
                var newName = spawn.createCreep([WORK,CARRY,MOVE], 'Remote_Harvester'+(_.size(remote_harvesters)), {role: 'remote_harvester'});
                console.log('Spawning new builder: ' + newName);
            }
        }
    }
    
    
};

module.exports = roleSpawner;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {