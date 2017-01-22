var roleConstructor = {

    /** @param {}  **/
    run: function(spawn) {
        

        

        if (spawn.memory.container_1 == undefined ) {
                var sources = spawn.pos.findClosestByPath(FIND_SOURCES);
                     var pos = new RoomPosition(sources.pos.x, sources.pos.y + 1, spawn.room.name);
                     pos.createConstructionSite(STRUCTURE_CONTAINER);
                     spawn.memory.container_1 = 'complete';
        }
        
        if (spawn.memory.road_status == undefined ){
            var sources = spawn.room.find(FIND_SOURCES);
            for (var n in sources ) {
            var path_food = spawn.room.findPath(spawn.pos, sources[n].pos , {ignoreCreeps: true});
                for(var i in path_food) {
                        var pos = new RoomPosition(path_food[i].x, path_food[i].y, spawn.room.name);
                         pos.createConstructionSite(STRUCTURE_ROAD);
                }
            }
            spawn.memory.road_status = 'complete';
        }
        
        if (spawn.memory.extension_1 == undefined && spawn.room.controller.level == 2) {
            var pos = new RoomPosition(spawn.pos.x - 1, spawn.pos.y, spawn.room.name);
            pos.createConstructionSite(STRUCTURE_EXTENSION);
            spawn.memory.extension_1 = 'complete';
        }
    }
};

module.exports = roleConstructor;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {