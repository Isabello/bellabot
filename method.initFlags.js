var initFlags = {

    run: function(spawn) {

        var flags = spawn.room.find(FIND_FLAGS);
        for (var i in flags) {
            flags[i].memory = {'occupied': false};
        }
                console.log('flagsdone');
                spawn.memory.flags = true;
    }
};

module.exports = initFlags;
