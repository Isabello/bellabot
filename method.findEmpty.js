var findEmpty = {

    /** @param {Creep} creep **/
    run: function(creep) {

      //PRIORITIZE CLOSEST FLAGS

      var findEmptyFlags = _.filter(Game.flags, { memory: { 'occupied' : false }} );
/*
      var flags = creep.room.find(FIND_FLAGS, {
        filter: function (flag) {
          return flag.memory.occupied == false;
        }}
      );
*/
      var assign_flag = findEmptyFlags[0];
      creep.memory.assignment = assign_flag;
      assign_flag.memory = {'occupied': true, 'owner':  creep.id};
    //  flags[0].memory.occupied = true;
      //flags[0].memory.owner = creep.id;

    }
};

module.exports = findEmpty;
