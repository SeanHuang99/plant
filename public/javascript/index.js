var storage = {
    set: function(key, value) {
        window.localStorage.setItem(key, value);
    },
    get: function(key) {
        return window.localStorage.getItem(key);
    },
    remove: function(key) {
        window.localStorage.removeItem(key);
    },
    clear: function() {
        window.localStorage.clear();
    }
};


$(document).ready(function(){
    console.log(111)
    if(storage.get("lastURL")!=null){
        $('#content-iframe').attr('src', storage.get("lastURL"));
    }

    // listen .nav-link event
    $('.nav-link').click(function(e){
        console.log(222)
        // stop default page skip
        e.preventDefault();

        // get link
        var href = $(this).attr('href');

        // update iframe src to the link
        $('#content-iframe').attr('src', href);

        //add the url to the record
        storage.set("lastURL",href);
    });
});

// Register service worker to control making site work offline
window.onload = function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/public'})
            .then(function (reg) {
                console.log('Service Worker Registered!', reg);
            })
            .catch(function (err) {
                console.log('Service Worker registration failed: ', err);
            });
    }

    // Check if the browser supports the Notification API
    if ("Notification" in window) {
        // Check if the user has granted permission to receive notifications
        if (Notification.permission === "granted") {
            console.log('granted')
            // Notifications are allowed, you can proceed to create notifications
            // Or do whatever you need to do with notifications
        } else if (Notification.permission !== "denied") {
            console.log('permission !== "denied')
            // If the user hasn't been asked yet or has previously denied permission,
            // you can request permission from the user
            Notification.requestPermission().then(function (permission) {
                // If the user grants permission, you can proceed to create notifications
                if (permission === "granted") {
                    navigator.serviceWorker.ready
                        .then(function (serviceWorkerRegistration) {
                            serviceWorkerRegistration.showNotification("Todo App",
                                {
                                    body: "Notifications are enabled!",
                                    icon: '/images/icon.webp'
                                }) // 指定图标的 URL
                                .then(r =>
                                    console.log(r)
                                );
                        });
                }
            });
        } else
            console.log('permission denied')
    } else
        console.log('no notification in window');

    //todo:在把insertTodoInList()从addNewTodosToIDB()中剥离之后，主页就无法显示所有todo了
    //函数执行顺序？回调返回值？
    //为什么要剥离：insertTodoInList由于要通过getElementById获取index页面的标签，因此只能在index.ejs页面上执行（否则会报错说找不到函数）
    //是否可以不剥离？我只要保证addNewTodosToIDB()只在index.ejs页面执行就好了
    //已解决，可以不剥离
    // if (navigator.onLine) {
    //     fetch('http://localhost:3000/todos')
    //         .then(function (res) {
    //             console.log('fetch(http://localhost:3000/todos)')
    //             return res.json();
    //         }).then(function (newTodos) {
    //         openTodosIDB().then((db) => {
    //             insertTodoInList(db, newTodos)
    //             getAllTodos(db).then(todos => {
    //                 //如果是第一次连接（IDB没有数据：长度=0）
    //                 if (todos.length === 0) {
    //                     //添加所有todo
    //                     addNewTodosToIDB(db, newTodos).then(() => {
    //                         console.log("All new todos added to IDB")
    //                     })
    //                     // .then(()=>insertTodoInList(db,newTodos))
    //                 }
    //                 //如果不是，判断todo的长度是否相同
    //                 else {//相同 则正确
    //                     //否则重新添加
    //                     if (todos.length !== newTodos.length) {
    //                         deleteAllExistingTodosFromIDB(db).then(() => {
    //                             console.log('deleteAllExistingTodosFromIDB')
    //                             addNewTodosToIDB(db, newTodos).then(() => {
    //                                 console.log("All new todos added to IDB")
    //                             })
    //                             // .then(()=>insertTodoInList(db,newTodos))
    //                         });
    //                     }
    //                 }
    //             })
    //         });
    //     });
    //
    // } else {
    //     console.log("Offline mode")
    //     openTodosIDB().then((db) => {
    //         //先把已有的todo加入
    //         getAllTodos(db).then((todos) => {
    //             for (const todo of todos) {
    //                 insertTodoInList(todo)
    //             }
    //         });
    //         //再判断sync-todo中是否有未同步的todo
    //         openSyncTodosIDB().then(syncDB => {
    //             getAllSyncTodos(syncDB).then(syncTodos => {
    //                 //如果有，加入todo表
    //                 if (syncTodos.length !== 0) {
    //                     console.log('syncTodos.length !== 0')
    //                     addNewTodosToIDB(db, syncTodos)
    //                 }
    //             });
    //         })
    //     })
    // }
}