/**
 * @module socketController
 * @description the websocket which used in chat room
 */
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

            /**
             * receive message, and synchronize the message to mongoDB
             */
            socket.on('chat', function (plantId, nickName, chatText) {
                io.sockets.to(plantId).emit('chat', plantId, nickName, chatText);
                // synchronize the chat record to mongoDB
                mongoApi.addChatRecord(plantId, nickName, chatText,new Date())
                    .then(r  =>console.log(r));
                console.log(`in room ${plantId},  ${nickName} says: ${chatText}`);
            });

            /**
             * disconnect event
             */
            socket.on('disconnect', function(){
                console.log('someone disconnected');
            });
        } catch (e) {
        }
    });
}