var sources = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER);
    }
});
var maxAmount = -1;
var maxSource = null;
var maxRange = 100;
for (var i = 0; i < sources.length; i++) {
    if (sources[i].store[RESOURCE_ENERGY] <= maxAmount) {
        var range = creep.pos.getRangeTo(sources[i]);
        if (sources[i].store[RESOURCE_ENERGY] > maxAmount || range < maxRange) {
            maxAmount = sources[i].store[RESOURCE_ENERGY];
            maxSource = sources[i];
            maxRange = range;
        }
    }
}
console.log(maxAmount);
console.log(maxSource);
console.log(maxRange);
var currentRoom = Game.rooms.E87S46;
for (var i in sources) {
    if (currentRoom.energyAvailable >= currentRoom.energyCapacityAvailable - 200) {
        if ((creep.transfer(sources[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
            creep.moveTo(sources[i]);
        };
    }
}

for (var creep in Game.creeps) {
  console.log(creep);
  if (Game.creeps[creep].memory.transit == false || Game.creeps[creep].transit == true){
    console.log(Game.creeps[creep].memory.role);
  Game.creeps[creep].memory.role = 'carrier';
  }
}
