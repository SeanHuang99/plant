/**
 * @module socketController
 * @description the websocket which used in chat room
 * @type {{getAllUpdateRequestsByNickName: function(string): Promise<Object>, updateRequestFromUrPage: function(string, string, string, string, string): Promise<Object>, addUpdateRequest: function(string, string, string, string, string): Promise<Object>, changePlantNameOfPlantForCreator: function(string, Object): Promise<Object>, getUpdateRequestById: function(string): Promise<Object>, changePlantNameOfPlant: function(string, string, string, string, string, string): Promise<Object>, getAllPlants: function(): Promise<type:string, content:Plant[]>, getNickNameOfPlant: function(string): Promise<Object>, getPlant: function(*): Promise<{type: string, content: exports[]}>, findPlantByObjId: function(string): Promise<Object>, addPlant: function(string, string, string, string, Date, number, number, string, string, string, string, string, string, string, string, string, string): Promise<{type: string, content: Object}>, getChatRecord: function(string): Promise<{type: string, content: Object}>, getAllChatRecord: function(): Promise<{type: string, content: Object[]}>, addChatRecord: function(string, string, string, Date): Promise<{type: string, content: string}>}|{addPlant?: function(string, string, string, string, Date, number, number, string, string, string, string, string, string, string, string, string, string): Promise<{type: string, content: Object}>, getPlant?: function(*): Promise<{type: string, content: exports[]}>, getAllPlants?: function(): Promise<type:string, content:Plant[]>, getNickNameOfPlant?: function(string): Promise<Object>, changePlantNameOfPlant?: function(string, string, string, string, string, string): Promise<Object>, addChatRecord?: function(string, string, string, Date): Promise<{type: string, content: string}>, getChatRecord?: function(string): Promise<{type: string, content: Object}>, getAllChatRecord?: function(): Promise<{type: string, content: Object[]}>, addUpdateRequest?: function(string, string, string, string, string): Promise<Object>, getUpdateRequestById?: function(string): Promise<Object>, getAllUpdateRequestsByNickName?: function(string): Promise<Object>, updateRequestFromUrPage?: function(string, string, string, string, string): Promise<Object>, changePlantNameOfPlantForCreator?: function(string, Object): Promise<Object>, findPlantByObjId?: function(string): Promise<Object>}}
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