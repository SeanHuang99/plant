// Initialize socket.io connection and setup chat room
let name = getNickName();
let roomNo = getPlantId();
let socket = io();

window.onload = function () {
    cleanChatPanel()
    if (navigator.onLine) {
        init()
    }
    getChatRecord(roomNo);
}

window.addEventListener('offline', function() {
    // console.log("You are offline");
    if (socket) {
        socket.close();
        console.log("WebSocket has been closed due to offline status.");
    }
});

function init() {
    // Event listener for joining a room
    socket.on('joined', function (room, userId) {
        console.log("socket on")
        if (userId === name) {
            document.getElementById('who_you_are').innerHTML = `${userId}, you are in room: ${room}`;
        } else {
            writeOnHistory(`<b>${userId}</b> joined room ${room}`);
        }
        //todo update indexdb from server
        console.log("do synChatRecordFromServer")
        synAllChatObjsFromServer()
    });

    // Event listener for receiving chat messages
    socket.on('chat', function (room, userId, chatText) {
        console.log(`${getNickName()} say: ${chatText}`)
        let who = userId === name ? 'Me' : userId;
        // writeOnHistory(`<b>${who}:</b> ${chatText}`);
        if (getNickName() === userId) {
            writeOnHistory(`<b><span style="color: green;">${who}:</span></b> ${chatText}`);
        } else {
            writeOnHistory(`<b><span style="color: blue;">${who}:</span></b> ${chatText}`);
        }
        //todo update indexdb from server
        console.log("do synChatRecordFromServer")
        synAllChatObjsFromServer()
    });

    connectToRoom();
    enableResizer(); // Enable resizable panel feature
}

// Send the chat message to the server
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    if (!chatText.trim()) return;
    if (navigator.onLine) {
        socket.emit('chat', roomNo, name, chatText);
    } else {
        //todo upload chat to indexdb
        const chat = {
            nickName: getNickName(),
            content: chatText,
            date: Date.now(),
        }
        const plantId = roomNo
        openChatIDB().then(IDB => {
            //只插入sync-chats
            addNewChatToIDB(IDB, plantId, chat).then(_ => {
                console.log('add chat to IDB')
                showAddChatNotification()
            })
        })

        writeOnHistory(`<b><span style="color: red;">Me (Offline):</span></b> ${chatText}`);
    }
    document.getElementById('chat_input').value = ''; // Clear input
}

function showAddChatNotification(){
    navigator.serviceWorker.ready
        .then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.showNotification("Plant App",
                {
                    body: "Chat added!",
                    icon: '/images/icon.webp'})
        });
}

// Append new chat history entries to the container
function writeOnHistory(text) {
    let history = document.getElementById('chat_history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // Scroll down to show the latest message
    history.scrollTop = history.scrollHeight;
}

function cleanChatPanel() {

    let history = document.getElementById('chat_history');
    let children = Array.from(history.children); // 将HTMLCollection转换为数组以便使用数组方法

    // 遍历子元素并删除除了id="who_you_are"的所有子元素
    children.forEach(child => {
        if (child.id !== "who_you_are") {
            history.removeChild(child);
        }
    });
}

// Fetch the entire chat history for a particular room
function getChatRecord(roomNo) {
    if (navigator.onLine) {
        fetch(`/requestHandler/getChatRecordById/${roomNo}`)
            .then(response => response.json())
            .then(data => {
                for (let eachRecord of data.chatList) {
                    let who = getNickName() === eachRecord.nickName ? "Me" : eachRecord.nickName;
                    if (getNickName() === eachRecord.nickName) {
                        writeOnHistory(`<b><span style="color: green;">${who}:</span></b> ${eachRecord.content}`);
                    } else {
                        writeOnHistory(`<b><span style="color: blue;">${who}:</span></b> ${eachRecord.content}`);
                    }
                }
            })
            .catch(error => {
                console.error('Error occurred:', error);
            });
    } else {
        //todo get chat record from indexed db
        openChatIDB().then(IDB => {
            const transaction = IDB.transaction(["chats","sync-chats"], "readonly");
            const chatsStore = transaction.objectStore("chats");
            const syncChatsStore = transaction.objectStore("sync-chats");
            //get server-side chat record
            getChatRecordById(chatsStore, roomNo).then(chatRecord => {
                console.log('server-side chat record found in IDB ----- ' + JSON.stringify(chatRecord))
                for (let eachRecord of chatRecord.chatList) {
                    let who = getNickName() === eachRecord.nickName ? "Me" : eachRecord.nickName;
                    if (getNickName() === eachRecord.nickName) {
                        writeOnHistory(`<b><span style="color: green;">${who}:</span></b> ${eachRecord.content}`);
                    } else {
                        writeOnHistory(`<b><span style="color: blue;">${who}:</span></b> ${eachRecord.content}`);
                    }
                }
            }).catch(err => {
                console.log(err)
            })

            //get offline-side chat record
            getChatRecordById(syncChatsStore, roomNo).then(chatRecord => {
                console.log('offline-side chat record found in IDB ----- ' + JSON.stringify(chatRecord))
                for (let eachRecord of chatRecord.chatList) {
                    let who = getNickName() === eachRecord.nickName ? "Me" : eachRecord.nickName;
                    if (getNickName() === eachRecord.nickName) {
                        writeOnHistory(`<b><span style="color: red;">${who} (offline):</span></b> ${eachRecord.content}`);
                    } else {
                        writeOnHistory(`<b><span style="color: blue;">${who} (offline):</span></b> ${eachRecord.content}`);
                    }
                }
            }).catch(err => {
                console.log(err)

            })
        })


    }
}

// Request to join or create a new chat room
function connectToRoom() {
    socket.emit('create or join', roomNo, name);
}

// Enable resizing of plant and chat panels
function enableResizer() {
    const resizer = document.querySelector('.resizer');
    const plantDetails = document.getElementById('plant-details');
    const chat = document.getElementById('chat');

    let startX = 0;
    let startWidth = 0;

    resizer.addEventListener('mousedown', function (event) {
        startX = event.clientX;
        startWidth = plantDetails.offsetWidth;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(event) {
        const newWidth = startWidth + (event.clientX - startX);
        const totalWidth = plantDetails.parentNode.offsetWidth;
        plantDetails.style.width = `${(newWidth / totalWidth) * 100}%`;
        chat.style.width = `${((totalWidth - newWidth) / totalWidth) * 100}%`;
    }

    function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
}

// Handle key down event for chat input
function handleKeyDown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendChatText();
    }
}
