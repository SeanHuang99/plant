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
                '/stylesheets/style.css',
                '/images/icon.webp',
                '/manifest.json',
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
//sw会拦截所有请求，因此做一个判断，只在offline时拦截
self.addEventListener('fetch', event => {
    //如果offline，拦截请求并从缓存中查找资源
    //todo: offline时刷新主页，状态显示为online？
    if (!navigator.onLine) {
        console.log('offline 拦截 ----- ' + event)
        // 提取请求的 URL
        var url = new URL(event.request.url);
        // 如果是详情页面的请求
        if (url.pathname==='/detail') {
            console.log('bbb')
            event.request.url = 'http://localhost:3000/detail'//截去后面的id
            findCache(event)
            //todo:如何截取路径并查找缓存？（报错：an object that was not a Response was passed to respondWith().）
            // event.respondWith(findCache(url)); // 修改这里

        }
        else findCache(event)
    }
    //如果online则正常服务器请求
    else {
        console.log('online 不拦截')
    }
});

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

//Sync event to sync the plants
self.addEventListener('sync', event => {
    console.log('prepare to sync')
    if (event.tag === 'sync-plant') {
        syncPlantToServer()
    }
    else if(event.tag === 'sync-chat'){
        syncChatToServer()
    }
});

function syncPlantToServer(){
    console.log('Service Worker: Syncing new Plants');
    openSyncPlantsIDB().then((syncPostDB) => {
        getAllPlants(syncPostDB).then((syncPlants) => {
            for (const syncPlant of syncPlants) {
                console.log('Service Worker: Syncing new Plant: ', syncPlant);

                // Fetch with FormData instead of JSON
                fetch('http://localhost:3000/requestHandler/addPlants', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(syncPlant)
                }).then(() => {
                    console.log('Service Worker: Syncing new Plant: ', syncPlant, ' done');
                    deleteSyncPlantFromIDB(syncPostDB, syncPlant.plantId);
                    // Send a notification
                    self.registration.showNotification('Plant Synced', {
                        body: 'Plant synced successfully!',
                        icon: '/images/icon.webp'
                    });
                }).catch((err) => {
                    console.error('Service Worker: Syncing new Plant: ', syncPlant, ' failed');
                });
            }
        });
    });
}

function syncChatToServer(){
    console.log('Service Worker: Syncing new chat');
    openChatIDB().then((syncPostDB) => {
        getSyncChatObjs(syncPostDB).then((chatObj) => {
            // for (const chatObj of chatObjs) {
                console.log('Service Worker: Syncing new Chat: ', chatObj);

                // Fetch with FormData instead of JSON
                //todo:添加addChat接口
                fetch('http://localhost:3000/requestHandler/updateOfflineChatRecordToServer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(chatObj)
                }).then((response) => {
                    console.log("syncChatToServer response: "+response)
                    console.log('Service Worker: Syncing new Chat: ', chatObj, ' done');
                    //todo: clean the sync-chats indexdb

                    // clearSyncChatFromIDB(syncPostDB, chatObj.plantId);
                    // Send a notification
                    self.registration.showNotification('Chat Synced', {
                        body: 'Chat synced successfully!',
                        icon: '/images/icon.webp'
                    });
                }).catch((err) => {
                    console.error('Service Worker: Syncing new Plant: ', syncChat, ' failed');
                });
            // }
        });
    });
}