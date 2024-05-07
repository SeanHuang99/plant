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
                '/manifest.json',
                '/javascript/add.js',
                '/javascript/idb-utility.js',
                '/javascript/index.js',
                '/javascript/main.js',
                '/javascript/upload.js',
                '/stylesheets/style.css',
                // '/images/icon.webp',
                // '/html/main.html',
                // '/html/main.ejs'
            ]
            fileList.forEach(file => {
                cache.add(file).catch(_ => console.error(`can't load ${file} to cache`))
            })
            // await cache.addAll().then(()=>{
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
    if (!navigator.onLine){
        console.log('service Worker: Fetch ...');
        // 提取请求的 URL
        var url = new URL(event.request.url);
        // 如果是详情页面的请求
        // if (url.pathname.startsWith('/detail/')) {
        //     event.respondWith(
        //         fetch("/EJS-test.html")
        //         // 根据请求的 plantId 提供对应的响应内容
        //         // getPlantFromIDB(url.pathname.substring('/detail/'.length))
        //     );
        // }else {
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
        // }
    }
});


//Sync event to sync the plants
self.addEventListener('sync', event => {
    console.log('prepare to sync')
    if (event.tag === 'sync-plant') {
        console.log('Service Worker: Syncing new Plants');
        openSyncPlantsIDB().then((syncPostDB) => {
            getAllSyncPlants(syncPostDB).then((syncPlants) => {
                for (const syncPlant of syncPlants) {
                    console.log('Service Worker: Syncing new Plant: ', syncPlant);
                    console.log(syncPlant)
                    //todo:封装一个addPlant(newPlant)方法， 添加plant到后端
                    // Create a FormData object
                    // const formData = new URLSearchParams();

                    // Iterate over the properties of the JSON object and append them to FormData
                    // formData.append("text", syncPlant.text);
                    // formData.append("plantId", syncPlant.plantId);

                    // Fetch with FormData instead of JSON
                    fetch('http://localhost:3000/addPlants', {
                        method: 'POST',
                        body: syncPlant,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then(() => {
                        console.log('Service Worker: Syncing new Plant: ', syncPlant, ' done');
                        deleteSyncPlantFromIDB(syncPostDB,syncPlant.plantId);
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
});
