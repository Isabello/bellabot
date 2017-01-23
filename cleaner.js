//test 2
module.exports = {

    tick: function() {
        // Always place this memory cleaning code at the very top of your main loop!
        try {
        for (var name in Memory.creeps) {

          // Required to free up previously used flags! Smart!!
          flags[Memory.creeps[name].assignment.name].memory = {'occupied': false};
          console.log(Memory.creeps[name].assignment.name);
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
      }
      catch (e) {
      }
    }

};
