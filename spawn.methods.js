var spawnMethods = {

    /** @param {Creep} creep **/
    run: function(spawn) {

        var harvester = _.size(_.filter(Game.flags, {
            color: COLOR_BLUE
        }));
        var carrier = _.size(_.filter(Game.flags, {
            color: COLOR_PURPLE
        }));
        var builder = _.size(_.filter(Game.flags, {
            color: COLOR_GREEN
        }));
        var upgrader = _.size(_.filter(Game.flags, {
            color: COLOR_YELLOW
        }));
        var claimer = _.size(_.filter(Game.flags, {
            color: COLOR_BROWN
        }));
        var filler = _.size(_.filter(Game.flags, {
            color: COLOR_ORANGE
        }));


        var controllers = spawn.room.controller.level;



    },
    addCreepToQueue: function(spawn, type, memory, parts) {


    },
    queueCreep: function(spawn) {

    },

    creepParts: function(type, reserve) {
        if (type == 'harvester') {
          var slice = reserve / 75;
          var parts = [WORK, CARRY, MOVE, WORK, CARRY, MOVE,WORK, CARRY, MOVE,WORK, CARRY, MOVE, MOVE,MOVE];
          parts = parts.splice(-slice);
        }

        if (type == 'carrier') {
        var slice = reserve / 50;
            var parts = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY, MOVE, CARRY, MOVE];
            parts = parts.splice(-slice);
        }
        if (type == 'carrier_tiny') {
            var parts = [CARRY, MOVE];
        }
        if (type == 'worker') {
          var slice = reserve / 75;
            var parts = [MOVE, CARRY, WORK, WORK, CARRY, MOVE,MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK];
            parts = parts.splice(-slice);
        }
        if (type == 'repair') {
          var slice = reserve / 75;
            var parts = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK];
            parts = parts.splice(-slice);
        }
        return parts;
/*
        if (type == 'other') {
            var parts = [WORK, WORK, CARRY, MOVE];
            for (let i = 3; i <= qtyWork; ++i) {
                if (this.room.hasEnergyCapacitySave(i * BODYPART_COST[WORK] + BODYPART_COST[MOVE])) {
                    bodyParts.unshift(WORK); //unshift adds an element in the beginning of the array
                    qtyWork = i;
                } else {
                    break;
                }
            }
        }
*/
    },
    reservedEnergy: function(spawn, extensionCount){
      var reserve = Game.rooms[spawn.pos.roomName].energyCapacityAvailable - ((extensionCount / 3) * 50);
      console.log(reserve);
      return reserve;
    }


};


module.exports = spawnMethods;
