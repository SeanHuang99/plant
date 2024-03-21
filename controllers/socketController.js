exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        console.log("socket connected");
        try {
            /**
             * create or joins a room
             */
            socket.on('create or join', function (plantId, nickName) {
                socket.join(plantId);
                io.sockets.to(plantId).emit('joined', plantId, nickName);
            });

            socket.on('chat', function (plantId, nickName, chatText) {
                io.sockets.to(plantId).emit('chat', plantId, nickName, chatText);

            });

            socket.on('disconnect', function(){
                console.log('someone disconnected');
            });
        } catch (e) {
        }
    });
}