var spawnMethods = require('spawn.methods');
var roleSpawner = {

    /** @param {}  **/
    run: function(spawn) {

        if (spawn.memory.init == undefined) {
            spawn.memory.MAX = {
                MAX_HARVESTERS: 3,
                MAX_UPGRADERS: 1,
                MAX_BUILDERS: 1,
                MAX_CARRIER: 4
            }
            spawn.memory.init = true;
        }
        var extensionCount = _.size(spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION
            }
        }));
        console.log('Room "' + spawn.pos.roomName + '" has ' + spawn.room.energyAvailable + ' energy ' + 'and extensions: ' + extensionCount);

        var harvester = {
            role: 'harvester',
            working: false,
            home: false,
            return: true
        }
        var carrier = {
            role: 'carrier'
        }
        var tiny_carrier = {
            role: 'tiny_carrier'
        }
        var worker = {
            role: 'worker',
            working: false
        }
        var repair = {
            role: 'repair',
            working: false
        }
        var fighter = {
            role: 'fighter',
            home: false
        }
        var ranger = {
            role: 'ranger',
            home: false
        }
        var healer = {
            role: 'healer',
            home: false
        }
        var upgrader = {
            role: 'upgrader',
            working: false,
            energy: true
        }
        var reserve = spawnMethods.reservedEnergy(spawn, extensionCount);

        if (Memory.atWar == true) {
            if (Memory.activeCreeps.roles.fighter < 5) {
                spawn.createCreep(spawnMethods.creepParts('fighter', reserve), undefined, fighter);
            } else if (Memory.activeCreeps.roles.ranger < Memory.activeCreeps.roles.fighter) {
                spawn.createCreep(spawnMethods.creepParts('ranger', reserve), undefined, ranger);
            } else if (Memory.activeCreeps.roles.healer < Memory.activeCreeps.roles.fighter) {
                spawn.createCreep(spawnMethods.creepParts('healer', reserve), undefined, healer);
            }
        }
        if (Memory.activeCreeps.roles.tiny_carrier < Memory.activeCreeps.roles.harvester / 3 ) {
            spawn.createCreep(spawnMethods.creepParts('tiny_carrier', reserve), undefined, tiny_carrier);
        }

        if (Memory.activeCreeps.roles.carrier < Memory.activeCreeps.roles.harvester *1.25) {
            spawn.createCreep(spawnMethods.creepParts('carrier', reserve), undefined, carrier);
        } else if (Memory.activeCreeps.roles.harvester < _.size(_.filter(Game.flags, {
                color: COLOR_BLUE
            }))) {
            spawn.createCreep(spawnMethods.creepParts('harvester', reserve), undefined, harvester);
        } else if (Memory.activeCreeps.roles.worker < 4) {
            spawn.createCreep(spawnMethods.creepParts('worker', reserve), undefined, worker);
        } else if (Memory.activeCreeps.roles.upgrader < 5) {
            spawn.createCreep(spawnMethods.creepParts('upgrader', reserve), undefined, upgrader);
        } else if (Memory.activeCreeps.roles.repair < 1) {
            spawn.createCreep(spawnMethods.creepParts('repair', reserve), undefined, repair);
        } else if (Memory.activeCreeps.roles.claimer < _.size(_.filter(Game.flags, {
                color: COLOR_BROWN
            }))) {
            var newName = spawn.createCreep([MOVE, CLAIM], undefined, {
                role: 'claimer',
                return: 'true',
                claiming:false,
                home: false
            });
        }
    }
}
module.exports = roleSpawner;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {
