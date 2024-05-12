// function synDataFromServer() {
//     if (navigator.onLine) {
//         // syn plant information indexed db
//         synPlantFromServer();
//         synChatRecordFromServer();
//     }
// }
function createPlantId(plantName) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${plantName}${year}${month}${day}${hours}${minutes}${seconds}`;
}

function synPlantFromServer() {
    if (navigator.onLine) {
        fetch('/requestHandler/getAllPlants')
            .then(function (res) {
                return res.json();
            })
            .then(function (newPlants) {
                openPlantIDB().then((db) => {
                    getAllPlants(db).then(plants => {
                        //如果是第一次连接（IDB没有数据：长度=0）
                        // if (plants.length === 0) {
                        //添加所有plant
                        deleteAllExistingPlantsFromIDB(db).then(() => {
                            addNewPlantsToIDB(db, newPlants).then(() => {
                                console.log("All new plants added to IDB")
                            })
                        })

                        // }
                        //如果不是，判断plant的长度是否相同
                        // else {//相同 则正确
                        //     //否则重新添加
                        //     if (plants.length !== newPlants.length) {
                        //         deleteAllExistingPlantsFromIDB(db).then(() => {
                        //             console.log('deleteAllExistingPlantsFromIDB')
                        //             addNewPlantsToIDB(db, newPlants).then(() => {
                        //                 console.log("All new plants added to IDB")
                        //             })
                        //         })
                        //     }
                        // }
                    })
                })
            })
    }
}

// Function to handle adding a new plant
const addNewPlantToSync = (syncPlantIDB, plant) => {
    // Retrieve plant text and add it to the IndexedDB
    if (plant !== null) {
        // const transaction = syncPlantIDB.transaction(["sync-plants"], "readwrite")
        // const plantStore = transaction.objectStore("sync-plants")
        const transaction = syncPlantIDB.transaction(["plants"], "readwrite")
        const plantStore = transaction.objectStore("plants")
        const addRequest = plantStore.add(plant)
        addRequest.addEventListener("success", () => {
            console.log("Added " + "#" + addRequest.result + ": " + plant.plantId)
            const getRequest = plantStore.get(addRequest.result)
            getRequest.addEventListener("success", () => {
                console.log("Found " + JSON.stringify(getRequest.result))
                // Send a sync message to the service worker
                navigator.serviceWorker.ready.then((sw) => {
                    console.log('sw.sync.register("sync-plant")')
                    sw.sync.register("sync-plant")
                }).then(() => {
                    console.log("Sync registered");
                }).catch((err) => {
                    console.log("Sync registration failed: " + JSON.stringify(err))
                })
            })
        })
    }
}

// Function to add new plants to IndexedDB and return a promise
const addNewPlantsToIDB = (plantIDB, plants) => {
    console.log('db名字：'+plantIDB.name)
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");

        const addPromises = plants.map(plant => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = plantStore.add(plant);
                addRequest.addEventListener("success", () => {
                    // console.log("Added " + "#" + addRequest.result + ": " + plant);
                    const getRequest = plantStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        // console.log("Found " + JSON.stringify(getRequest.result));
                        resolveAdd(getRequest.result); // Resolve the add promise
                    });
                    getRequest.addEventListener("error", (event) => {
                        rejectAdd(event.target.error); // Reject the add promise if there's an error
                    });
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

//todo: 能否复用getAll函数？
// Function to get the plant list from the IndexedDB
const getAllPlants = (plantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"]);
        const plantStore = transaction.objectStore("plants");
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
// Function to get the plant list from the sync-IndexedDB
// const getAllSyncPlants = (syncPlantIDB) => {
//     return new Promise((resolve, reject) => {
//         const transaction = syncPlantIDB.transaction(["sync-plants"]);
//         const plantStore = transaction.objectStore("sync-plants");
//         const getAllRequest = plantStore.getAll();
//
//         getAllRequest.addEventListener("success", () => {
//             resolve(getAllRequest.result);
//         });
//
//         getAllRequest.addEventListener("error", (event) => {
//             reject(event.target.error);
//         });
//     });
// }

//call when jump into detail page(online and offline)
const getDetailById = (IDB, id) => {
    // 返回一个 Promise 对象，以便在调用该函数的地方能够使用 then() 方法获取结果
    return new Promise((resolve, reject) => {
        // 调用 getAllPlants 函数获取所有植物数据
        getAllPlants(IDB).then(plants => {
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
const getAllChatObjs = (plantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["chats"]);
        const plantStore = transaction.objectStore("chats");
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
const clearSyncChatFromIDB=(db, plantId)=>{
    const transaction = db.transaction(["plants"], "readwrite");
    const plantStore = transaction.objectStore("plants");
    return new Promise((resolve, reject) => {
        const getRequest = plantStore.get(plantId);

        getRequest.addEventListener("success", () => {
            const chatObj = getRequest.result;
            chatObj.chatList=[]
            const updatePromises = updateWithClearedChatList(plantStore, chatObj)

            Promise.all(updatePromises)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });

        getRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

const deleteAllChatObjsFromIDB = (db) => {
    console.log('run deleteAllChatObjsFromIDB')
    const transaction = db.transaction(["chats"], "readwrite");
    const plantStore = transaction.objectStore("chats");
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
                    deleteAllChatObjsFromIDB(db).then(()=>{
                        const store=db.transaction(["chats"], "readwrite").objectStore("chats");
                        chatObjs.forEach(chatObj => {
                            addChatObj(store, chatObj);
                        })
                    })
                })
            })
    }
}

const addNewChatToIDB = (db,plantId, chat) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["chats","sync-chats"], "readwrite");
        const chatsStore = transaction.objectStore("chats");
        const syncChatsStore = transaction.objectStore("sync-chats");
        //先查找有无对应当前plantId的记录
        getChatRecordById(syncChatsStore,plantId).then(chatObj => {
            if (chatObj != null) {
                //如果有，插入到chatList
                chatObj.chatList.push(chat)
                //更新chatObj
                // const updateRequest2 = chatsStore.put(chatObj);
                const updateRequest1 = syncChatsStore.put(chatObj);
                updateRequest1.addEventListener("success", () => {
                    console.log("Updated chatObj to syncChatsStore" + plantId);
                    registerSync()
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
                addChatObj(syncChatsStore,newChatObj)
            }
        })
    });
};

// Send a sync message to the service worker
function registerSync(){
    navigator.serviceWorker.ready.then((sw) => {
        console.log('sw.sync.register("sync-chat")')
        sw.sync.register("sync-chat")
    }).then(() => {
        console.log("Sync chat registered");
    }).catch((err) => {
        console.log("Sync registration failed: " + JSON.stringify(err))
    })
}
const getChatRecordById = async (store, plantId) => {
    return new Promise((resolve, reject) => {
        const getRequest = store.get(plantId);

        getRequest.onsuccess = function (event) {
            const record = event.target.result;
            resolve(record); // 将记录存在与否转换为布尔值并返回
        };

        getRequest.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

function addChatObj(store,chatObj){
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