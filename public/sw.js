importScripts('/public/javascript/idb-utility.js');


// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');
    event.waitUntil((async () => {

        console.log('Service Worker: Caching App Shell at the moment......');
        try {
            const cache = await caches.open("static");
            cache.addAll([
                '/',
                '/insert',
                '/upload',
                '/manifest.json',
                '/public/javascript/insert.js',
                '/public/javascript/index.js',
                '/public/javascript/idb-utility.js',
                '/public/stylesheet/style.css',
                '/public/images/icon.webp',
            ]);
            console.log('Service Worker: App Shell Cached');
        }
        catch{
            console.log("error occured while caching...")
        }

    })());
});

//clear cache on reload
self.addEventListener('activate', event => {
// Remove old caches
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if(cache !== "static") {
                    console.log('Service Worker: Removing old cache: '+cache);
                    return await caches.delete(cache);
                }
            })
        })()
    )
})

// Fetch event to fetch from cache first
self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open("static");
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            console.log('Service Worker: Fetching from Cache: ', event.request.url);
            return cachedResponse;
        }
        console.log('Service Worker: Fetching from URL: ', event.request.url);
        return fetch(event.request);
    })());
});


//Sync event to sync the todos
self.addEventListener('sync', event => {
    console.log('prepare to sync')
    if (event.tag === 'sync-todo') {
        console.log('Service Worker: Syncing new Todos');
        openSyncTodosIDB().then((syncPostDB) => {
            getAllSyncTodos(syncPostDB).then((syncTodos) => {
                //把sync-todo表的todo更新到todo表
                //不应该在触发sync事件之后再更新，而是点击add之后立即更新
                // openTodosIDB().then(todoIDB=>{
                //     // syncNewTodosToIDB(todoIDB,syncTodos)
                //     addNewTodosToIDB(todoIDB,syncTodos).then(()=>{
                //             console.log('all todos in sync-todo synchronized to todos')
                //         })
                // })
                for (const syncTodo of syncTodos) {
                    console.log('Service Worker: Syncing new Todo: ', syncTodo);
                    console.log(syncTodo.text)
                    // Create a FormData object
                    const formData = new URLSearchParams();
                    // const formData = new FormData();

                    // Iterate over the properties of the JSON object and append them to FormData
                    formData.append("text", syncTodo.text);
                    formData.append("todoId", syncTodo.todoId);

                    // Fetch with FormData instead of JSON
                    fetch('http://localhost:3000/add-todo', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then(() => {
                        console.log('Service Worker: Syncing new Todo: ', syncTodo, ' done');
                        deleteSyncTodoFromIDB(syncPostDB,syncTodo.todoId);
                        // Send a notification
                        self.registration.showNotification('Todo Synced', {
                            body: 'Todo synced successfully!',
                            icon: '/images/icon.webp'
                        });
                    }).catch((err) => {
                        console.error('Service Worker: Syncing new Todo: ', syncTodo, ' failed');
                    });
                }
            });
        });
    }
});
