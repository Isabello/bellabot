var roleConstructor = {

    /** @param {}  **/
    run: function(spawn) {
        
        var sources = spawn.room.find(FIND_SOURCES);
        var MAX_CONTAINERS = _.size(sources);
        var containers_inprogress = spawn.room.find(FIND_CONSTRUCTION_SITES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER);
                        }
                });
    
        if (_.size(containers_inprogress) <= MAX_CONTAINERS || containers_inprogress == '' ) {
                 console.log('build container!')
                 for(var i in sources) {
                     var pos = new RoomPosition(sources[i].pos.x, sources[i].pos.y + 1, spawn.room.name);
                     pos.createConstructionSite(STRUCTURE_CONTAINER);
                 }
        }
        
        if (spawn.memory.road_status == undefined ){
            var path_food = spawn.room.findPath(spawn.pos, sources[0].pos , {ignoreCreeps: true});
            for(var i in path_food) {
                             console.log('build road!')
                    var pos = new RoomPosition(path_food[i].x, path_food[i].y, spawn.room.name);
                     pos.createConstructionSite(STRUCTURE_ROAD);
            }
            spawn.memory.road_status = 'complete';
        }
    }
};

module.exports = roleConstructor;

//             if ( Game.rooms[name].energyAvailable >= 200 && creepsTotal.length < MAX_BASIC_CREEPS || creepsTotal.length == undefined ) {