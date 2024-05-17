importScripts('/javascript/idb-utility.js');

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');
    event.waitUntil((async () => {

        console.log('Service Worker: Caching App Shell at the moment......');
        try {
            const cache = await caches.open("static");
            const fileList = [
                '/',
                '/main',
                '/upload',
                '/about',
                '/detail',
                '/import/bootstrap.min.css',
                '/import/bootstrap.min.js',
                '/import/jquery-3.7.1.min.js',
                '/javascript/idb-utility.js',
                '/javascript/index.js',
                '/javascript/main.js',
                '/javascript/upload.js',
                '/javascript/commonTool.js',
                '/javascript/detail.js',
                '/javascript/sort.js',
                '/javascript/plantChatRoom.js',
                '/javascript/GoogleMap.js',
                '/javascript/detailMap.js',
                '/stylesheets/style.css',
                '/stylesheets/map.css',
                '/images/icon.webp',
                '/images/opencamera.svg',
                '/manifest.json',
                '/fonts/poetsenone-regular-sub.ttf',
                '/fonts/roboto-medium-Nav.ttf',
                '/fonts/roboto-medium-Nav.woff2',
                '/fonts/sedansc-regular-sub.ttf',
                '/fonts/sedansc-regular-sub.woff2'
            ]
            fileList.forEach(file => {
                cache.add(file).catch(_ => console.error(`can't load ${file} to cache`))
            })
            // await cache.addAll(fileList).then(()=>{
            //     console.log('addAll finish')
            // }).catch(err=>{
            //     console.log(err)
            // })
            // console.log('Service Worker: App Shell Cached');
        } catch {
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
                if (cache !== "static") {
                    console.log('Service Worker: Removing old cache: ' + cache);
                    return await caches.delete(cache);
                }
            })
        })()
    )
})

// Fetch event to fetch from cache first
//SW will intercept all requests, so make a judgment and only intercept when offline
self.addEventListener('fetch', event => {
    //If offline, intercept the request and find the resource from the cache
    if (!navigator.onLine) {
        console.log('offline intercept ----- ' + event)
        findCache(event)
    }
    //If online, the server request is normal
    else {
        console.log('online: do not intercept')
    }
});

/**
 * find cache by specified event
 * @param event
 */
function findCache(event){
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
}

/**
 * synchronize plant/chat by the tag
 */
self.addEventListener('sync', event => {
    console.log('prepare to sync')
    if (event.tag === 'sync-plant') {
        console.log("ready to sync the plants")
        syncPlantToServer()
    }
    else if(event.tag === 'sync-chat'){
        console.log("ready to sync the chat")
        syncChatToServer()
    }
});

/**
 * synchronize plant to server
 */
function syncPlantToServer(){
    console.log('Service Worker: Syncing new Plants');
    openPlantIDB().then((db) => {
        getAllPlants(db,"sync-plants").then((syncPlants) => {
            for (const syncPlant of syncPlants) {
                console.log('Service Worker: Syncing new Plant: ', syncPlant);

                // Fetch with FormData instead of JSON
                fetch('/requestHandler/addPlants', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(syncPlant)
                }).then(res => {
                    if (res.ok){
                        console.log('Service Worker: Syncing new Plant: ', syncPlant, ' done');
                        deleteSyncPlantFromIDB(db, syncPlant.plantId);
                        // Send a notification
                        self.registration.showNotification('Plant Synced', {
                            body: 'Plant synced successfully!',
                            icon: '/images/icon.webp'
                        });
                    }else {
                        console.log(`sync failed, reason: ${JSON.stringify(res.body)}`)
                        self.registration.showNotification('Plant Synced ', {
                            body: 'Plant synced failed!',
                            icon: '/images/icon.webp'
                        });
                    }

                }).catch((err) => {
                    console.error('Service Worker: Syncing new Plant: ', syncPlant, ' failed');
                });
            }
        });
    });
}

/**
 * synchronize chat to server
 */
function syncChatToServer(){
    console.log('Service Worker: Syncing new chat');
    openChatIDB().then((syncPostDB) => {
        getSyncChatObjs(syncPostDB).then((chatObjs) => {
            // for (const chatObj of chatObjs) {
                console.log('Service Worker: Syncing new Chats: ', chatObjs);

                // Fetch with FormData instead of JSON, to upload the offline chat record
                fetch('/requestHandler/updateOfflineChatRecordToServer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(chatObjs)
                }).then((response) => {
                    console.log("syncChatToServer response: "+response)
                    console.log('Service Worker: Syncing new Chats: ', chatObjs, ' done');
                    //clean the sync-chats indexdb
                    deleteAllChatObjsFromIDB(syncPostDB,'sync-chats').then(()=>{
                        console.log('deleteAllChatObjsFrom sync-chats successfully')
                        // Send a notification
                        self.registration.showNotification('Chat Synced', {
                            body: 'Chat synced successfully!',
                            icon: '/images/icon.webp'
                        });
                    })
                    // clearSyncChatFromIDB(syncPostDB, chatObjs);
                }).catch((err) => {
                    console.error('Service Worker: Syncing new Plant: ', chatObj, ' failed');
                });
            // }
        });
    });
}