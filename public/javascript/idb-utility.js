// function synDataFromServer() {
//     if (navigator.onLine) {
//         // syn plant information indexed db
//         synPlantFromServer();
//         synChatRecordFromServer();
//     }
// }
function generateSixDigitNumber() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createPlantId() {
    const uid=generateSixDigitNumber();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${uid}${year}${month}${day}${hours}${minutes}${seconds}`;
}

function synPlantFromServer() {
    if (navigator.onLine) {
        fetch('/requestHandler/getAllPlants')
            .then(function (res) {
                return res.json();
            })
            .then(function (newPlants) {
                openPlantIDB().then((db) => {
                    // getAllPlants(db,"plants").then(plants => {

                    //double check service worker sync function
                    getAllPlants(db, "sync-plants").then(plants => {
                        if(plants.length!==0){
                            registerPlantSync();
                        }
                    }).catch(error => {
                        console.log(error.message);
                    });


                    deleteAllExistingPlantsFromIDB(db).then(() => {
                        addNewPlantsToIDB(db, newPlants).then(() => {
                            console.log("All new plants added to IDB")
                        })
                        // })
                    })
                })
            })
    }
}



// Function to handle adding a new plant
const addNewPlantToSync = (IDB, plant) => {
    console.log('run addNewPlantToSync()')
    if (plant !== null) {
        const transaction = IDB.transaction(["sync-plants"], "readwrite");
        const plantStore = transaction.objectStore("sync-plants");

        return new Promise((resolve, reject) => {
            const addRequest = plantStore.add(plant);
            addRequest.addEventListener("success", () => {
                console.log("Added plant with ID: " + addRequest.result);
                const getRequest = plantStore.get(addRequest.result);
                getRequest.addEventListener("success", () => {
                    console.log("Retrieved plant from IDB: " + JSON.stringify(getRequest.result));
                    // Send a sync message to the service worker if registerPlantSync() is defined
                    registerPlantSync();
                    resolve();
                });
                getRequest.addEventListener("error", (event) => {
                    console.error("Error retrieving plant from IDB: " + event.target.error);
                    reject(event.target.error);
                });
            });
            addRequest.addEventListener("error", (event) => {
                console.error("Error adding plant to IDB: " + event.target.error);
                reject(event.target.error);
            });
        });
    }
};


// Function to add new plants to IndexedDB and return a promise
const addNewPlantsToIDB = (plantIDB, plants) => {
    console.log('run addNewPlantsToIDB()')
    // console.log('db名字：'+plantIDB.name)
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");

        const addPromises = plants.map(plant => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = plantStore.add(plant);
                addRequest.addEventListener("success", () => {
                    console.log("plantIDB: Added " + "#" + addRequest.result + ": " + plant);
                    resolveAdd()
                    // const getRequest = plantStore.get(addRequest.result);
                    // getRequest.addEventListener("success", () => {
                    //     // console.log("Found " + JSON.stringify(getRequest.result));
                    //     resolveAdd(getRequest.result); // Resolve the add promise
                    // });
                    // getRequest.addEventListener("error", (event) => {
                    //     rejectAdd(event.target.error); // Reject the add promise if there's an error
                    // });
                });
                addRequest.addEventListener("error", (event) => {
                    rejectAdd(event.target.error); // Reject the add promise if there's an error
                });
            });
        });

        // Resolve the main promise when all add operations are completed
        Promise.all(addPromises).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
};


const addPlantToBothStores =  async (db, plant) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["plants", "sync-plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");
        const syncPlantStore = transaction.objectStore("sync-plants");

        const addRequest1 = plantStore.add(plant);
        const addRequest2 = syncPlantStore.add(plant);

        let addCount = 0; // 用于追踪添加操作是否完成

        function checkCompletion() {
            addCount++;
            if (addCount === 2) {
                console.log("addPlantToBothStores() complete")
                registerPlantSync();
                resolve();
            }
        }

        addRequest1.onsuccess = () => {
            console.log("Added plant to plants table with ID: " + addRequest1.result);
            checkCompletion();
        };
        addRequest1.onerror = (event) => {
            console.error("Error adding plant to plants table: " + event.target.error);
            reject(event.target.error);
        };

        addRequest2.onsuccess = () => {
            console.log("Added plant to sync-plants table with ID: " + addRequest2.result);
            checkCompletion();
        };
        addRequest2.onerror = (event) => {
            console.error("Error adding plant to sync-plants table: " + event.target.error);
            reject(event.target.error);
        };
    });
};

// Function to remove all plants from idb
const deleteAllExistingPlantsFromIDB = (plantIDB) => {
    const transaction = plantIDB.transaction(["plants"], "readwrite");
    const plantStore = transaction.objectStore("plants");
    const clearRequest = plantStore.clear();

    return new Promise((resolve, reject) => {
        clearRequest.addEventListener("success", () => {
            resolve();
        });

        clearRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
};


// Function to get the plant list from the IndexedDB
const getAllPlants = (plantIDB, store) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction([store]);
        const plantStore = transaction.objectStore(store);
        const getAllRequest = plantStore.getAll();

        // Handle success event
        getAllRequest.addEventListener("success", (event) => {
            resolve(event.target.result); // Use event.target.result to get the result
        });

        // Handle error event
        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

//call when jump into detail page(online and offline)
const getDetailById = (IDB, id) => {
    // 返回一个 Promise 对象，以便在调用该函数的地方能够使用 then() 方法获取结果
    return new Promise((resolve, reject) => {
        // 调用 getAllPlants 函数获取所有植物数据
        getAllPlants(IDB, "plants").then(plants => {
            // 根据 ID 查找对应的植物
            const foundPlant = plants.find(plant => plant.plantId === id);
            // 如果找到了对应的植物，则将其传递给 resolve 函数
            if (foundPlant) {
                resolve(foundPlant);
            } else {
                // 如果未找到对应的植物，则返回一个错误信息
                reject(new Error(`Plant with ID ${id} not found`));
            }
        }).catch(error => {
            // 如果在获取植物数据的过程中出现了错误，则将错误传递给 reject 函数
            reject(error);
        });
    });
};

// Function to delete a syn
const deleteSyncPlantFromIDB = (syncPlantIDB, id) => {
    const transaction = syncPlantIDB.transaction(["sync-plants"], "readwrite")
    const plantStore = transaction.objectStore("sync-plants")
    const deleteRequest = plantStore.delete(id)
    deleteRequest.addEventListener("success", () => {
        console.log("Deleted id:" + id)
    })
}


async function openPlantIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("Plant", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            // db.createObjectStore('sync-plants', {keyPath: 'id', autoIncrement: true});
            db.createObjectStore('plants', {keyPath: 'plantId'});
            db.createObjectStore('sync-plants', {keyPath: 'plantId'});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

async function openChatIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("Chat", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            // db.createObjectStore('sync-plants', {keyPath: 'id', autoIncrement: true});
            db.createObjectStore('chats', {keyPath: 'plantId'});
            db.createObjectStore('sync-chats', {keyPath: 'plantId'});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

//syncIDB同步server时调用
const getSyncChatObjs = (plantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["sync-chats"]);
        const plantStore = transaction.objectStore("sync-chats");
        const getAllRequest = plantStore.getAll();

        // Handle success event
        getAllRequest.addEventListener("success", (event) => {
            resolve(event.target.result); // Use event.target.result to get the result
        });

        // Handle error event
        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

//只删除chats（清空chatList），不删除记录（chatObj）
const updateWithClearedChatList = (store, chatObj) => {
    // 使用 put 方法将更新后的对象重新存储到 plantStore 中
    return new Promise((resolve, reject) => {
        const putRequest = store.put(chatObj);
        putRequest.addEventListener("success", () => {
            resolve();
        });
        putRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
};

//syncIDB每次同步之后都会清空，下次在add时必然没有记录，就会创建新的chatObj，更新就会把server的记录覆盖
//改为：同步后只清空chatList，保留当前记录
//todo: 改为后端判断，indexDB只需清除所有记录
//改为调用deleteAllChatObjsFromIDB
const clearSyncChatFromIDB = (db, chatObjs) => {
    const transaction = db.transaction(["sync-chats"], "readwrite");
    const plantStore = transaction.objectStore("sync-chats");
    return new Promise((resolve, reject) => {
        const getRequest = plantStore.get(plantId);
        console.log('getRequest: ' + getRequest)
        getRequest.addEventListener("success", () => {
            const chatObj = getRequest.result;
            console.log('chatObj: ' + chatObj)
            chatObj.chatList = []
            const updatePromises = updateWithClearedChatList(plantStore, chatObj)
            console.log('run updateWithClearedChatList()')
            Promise.all(updatePromises)
                .then(() => {
                    console.log('resolve')
                    resolve();
                })
                .catch((error) => {
                    console.log('reject')
                    reject(error);
                });
        });

        getRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

const deleteAllChatObjsFromIDB = (db, objectStore) => {
    console.log('run deleteAllChatObjsFromIDB')
    const transaction = db.transaction([objectStore], "readwrite");
    const plantStore = transaction.objectStore(objectStore);
    const clearRequest = plantStore.clear();

    return new Promise((resolve, reject) => {
        clearRequest.addEventListener("success", () => {
            resolve();
        });

        clearRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

function synAllChatObjsFromServer() {
    if (navigator.onLine) {
        fetch('/requestHandler/getAllChatRecord')
            .then(function (res) {
                return res.json();
            })
            .then(function (chatObjs) {
                openChatIDB().then((db) => {
                    console.log('openChatsIDB successfully')
                    console.log(db.name)
                    deleteAllChatObjsFromIDB(db, "chats").then(() => {
                        console.log('deleteAllChatObjsFrom chats successfully')
                        const store = db.transaction(["chats"], "readwrite").objectStore("chats");
                        chatObjs.forEach(chatObj => {
                            addChatObj(store, chatObj);
                        })
                    })
                })
            })
    }
}

const addNewChatToIDB = (db, plantId, chat) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["chats", "sync-chats"], "readwrite");
        const chatsStore = transaction.objectStore("chats");
        const syncChatsStore = transaction.objectStore("sync-chats");
        //先查找有无对应当前plantId的记录
        getChatRecordById(syncChatsStore, plantId).then(chatObj => {
            if (chatObj != null) {
                //如果有，插入到chatList
                chatObj.chatList.push(chat)
                //更新chatObj
                // const updateRequest2 = chatsStore.put(chatObj);
                const updateRequest1 = syncChatsStore.put(chatObj);
                updateRequest1.addEventListener("success", () => {
                    console.log("Updated chatObj to syncChatsStore. plantOd: " + plantId);
                    registerChatSync()
                    resolve();
                });
                updateRequest1.addEventListener("error", (event) => {
                    reject(event.target.error);
                });
            } else {
                //如果没有，新建chat记录
                const newChatObj = {
                    plantId: plantId,
                    chatList: [chat]
                }
                //插入IDB
                addChatObj(syncChatsStore, newChatObj).then(() => {
                    console.log('newChatObj to syncChatsStore. plantId: ' + plantId);
                    registerChatSync()
                    return resolve();
                })
            }
        })
    });
};

// Send a sync message to the service worker
function registerChatSync() {
    navigator.serviceWorker.ready.then((sw) => {
        console.log('sw.sync.register("sync-chat")')
        sw.sync.register("sync-chat")
    }).then(() => {
        console.log("Sync chat registered");
    }).catch((err) => {
        console.log("Sync registration failed: " + JSON.stringify(err))
    })
}

function registerPlantSync() {
    navigator.serviceWorker.ready.then((sw) => {
        console.log('sw.sync.register("sync-plant")')
        sw.sync.register("sync-plant")
    }).then(() => {
        console.log("Sync plant registered");
    }).catch((err) => {
        console.log("Sync registration failed: " + JSON.stringify(err))
    })
}

const getChatRecordById = async (store, plantId) => {
    return new Promise((resolve, reject) => {
        const getRequest = store.get(plantId);

        getRequest.onsuccess = function (event) {
            const record = event.target.result;
            resolve(record);
        };

        getRequest.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

function addChatObj(store, chatObj) {
    console.log('add ' + chatObj)
    return new Promise((resolve, reject) => {
        const addRequest = store.add(chatObj);
        addRequest.addEventListener("success", () => {
            console.log("Added new chat object with plantId " + chatObj.plantId);
            resolve();
        });
        addRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    })
}