var roleConstructor = {

    /** @param {}  **/
    run: function(spawn) {

/*
        if (spawn.memory.container_1 == undefined) {
            var sources = spawn.pos.findClosestByPath(FIND_SOURCES);
            var pos = new RoomPosition(sources.pos.x, sources.pos.y + 1, spawn.room.name);
            pos.createConstructionSite(STRUCTURE_CONTAINER);
            spawn.memory.container_1 = 'complete';
        }
*/
        if (spawn.memory.extensionCount == undefined) {
            spawn.memory.extensionCount = 0;
        }


/*
var sites;
for (var i in Game.rooms){
  sites = Game.rooms[i].find(FIND_CONSTRUCTION_SITES);
  console.log(sites);
  if (sites[0] != (undefined || null)){
    var findFlags = _.filter(Game.flags, {color: COLOR_GREEN});
    for (var n in findFlags) {
      findFlags[n].setPosition(new RoomPosition(sites[0].pos.x, sites[0].pos.y, sites[0].pos.roomName));
    }
    break;
  }
}
*/

      if (Game.flags['road'] != undefined && Game.flags['road_target'] != undefined) {
       var flag = Game.flags['road'];
       var flag_target = Game.flags['road_target'];
                var path_food = flag.room.findPath(flag.pos, flag_target.pos, {
                    ignoreCreeps: true
                });
                console.log(path_food);
                for (var i in path_food) {
                    if ((path_food[i].x == flag_target.pos.x) && (path_food[i].y == flag_target.pos.y)) {
                        break;
                    } else {
                      //  Game.rooms[spawn.pos.roomName].createFlag(path_food[i].x, path_food[i].y, 'road_' + n + '_' + i, COLOR_GREY);
                        var pos = new RoomPosition(path_food[i].x, path_food[i].y, flag_target.pos.roomName);
                        pos.createConstructionSite(STRUCTURE_ROAD);
                    }
                }
            Game.flags['road_target'].remove();
            console.log('building road');
        }

/*
        if (spawn.room.controller.level == 2 && spawn.memory.extensionCount < 5) {

            var extensionCount = spawn.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION)
                }
            }).length;

            for (i = 0; i < 5; ++i) {
                var pos = new RoomPosition(spawn.pos.x + i, spawn.pos.y + i, spawn.room.name);
                var result = pos.createConstructionSite(STRUCTURE_EXTENSION);
                if (result == OK) {
                    return;
                } else {
                    var pos2 = new RoomPosition(spawn.pos.x - i, spawn.pos.y - i, spawn.room.name);
                    pos2.createConstructionSite(STRUCTURE_EXTENSION);
                }
                spawn.memory.extensionCount += 1;
            }

        }
*/
    }
};

module.exports = roleConstructor;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {
