const mongoApi=require("./databaseController/mongodbController");
exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        // console.log("socket connected");
        try {
            /**
             * create or joins a room
             */
            socket.on('create or join', function (plantId, nickName) {
                console.log(`${nickName} join chat room ${plantId}`)
                socket.join(plantId);
                io.sockets.to(plantId).emit('joined', plantId, nickName);
            });

            socket.on('chat', function (plantId, nickName, chatText) {
                io.sockets.to(plantId).emit('chat', plantId, nickName, chatText);
                mongoApi.addChatRecord(plantId, nickName, chatText)
                    // .then(r  =>console.log(r));
                console.log(`in room ${plantId},  ${nickName} says: ${chatText}`);
            });

            socket.on('disconnect', function(){
                console.log('someone disconnected');
            });
        } catch (e) {
        }
    });
}