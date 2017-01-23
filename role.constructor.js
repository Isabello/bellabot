var roleConstructor = {

    /** @param {}  **/
    run: function(spawn) {

        if (spawn.memory.container_1 == undefined) {
            var sources = spawn.pos.findClosestByPath(FIND_SOURCES);
            var pos = new RoomPosition(sources.pos.x, sources.pos.y + 1, spawn.room.name);
            pos.createConstructionSite(STRUCTURE_CONTAINER);
            spawn.memory.container_1 = 'complete';
        }

        if (spawn.memory.extensionCount == undefined) {
            spawn.memory.extensionCount = 0;
        }


        if (spawn.memory.road_status == undefined) {
            var sources = spawn.room.find(FIND_SOURCES);
            for (var n in sources) {
                var path_food = spawn.room.findPath(spawn.pos, sources[n].pos, {
                    ignoreCreeps: true
                });
                for (var i in path_food) {
                    if ((path_food[i].x == sources[n].pos.x) && (path_food[i].y == sources[n].pos.y)) {
                        break;
                    } else {
                        Game.rooms.sim.createFlag(path_food[i].x, path_food[i].y, 'road_' + n + '_' + i, COLOR_GREY);
                        //   pos.createConstructionSite(STRUCTURE_ROAD);
                    }
                }
            }
            spawn.memory.road_status = 'complete';
        }


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
    }
};

module.exports = roleConstructor;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {
