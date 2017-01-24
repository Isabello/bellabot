//test 2
module.exports = {

    tick: function() {
        // Always place this memory cleaning code at the very top of your main loop!

        for (var name in Memory.creeps) {

          // Required to free up previously used flags! Smart!!

            if (!Game.creeps[name]) {
                Memory.flags[Memory.creeps[name].assignment.name] = {'occupied': false};
                delete Memory.creeps[name];
            }
        }
}

};
