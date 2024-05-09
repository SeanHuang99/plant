// sorted (at least) by date/time seen
function sortByDateUp() {
    return new Promise((resolve, reject) => {
        openPlantsIDB().then(IDB => {
            getAllPlants(IDB).then(plants => {
                // 使用排序函数对植物数组进行排序
                plants.sort((a, b) => {
                    // 从小到大排序
                    return new Date(a.datetime) - new Date(b.datetime);
                    // 如果是字符串格式的时间，你也可以使用以下方式进行排序
                    // return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
                });
                // 排序后的 plants 数组
                console.log("Sorted plants:", plants);
                // 解析排序后的植物数组
                resolve(plants);
            }).catch(error => {
                reject(error); // 如果无法获取植物数组，则拒绝 Promise
            });
        }).catch(error => {
            reject(error); // 如果无法打开 IndexedDB，则拒绝 Promise
        });
    });
}

function sortByDateDown() {
    return new Promise((resolve, reject) => {
        openPlantsIDB().then(IDB => {
            getAllPlants(IDB).then(plants => {
                // 使用排序函数对植物数组进行排序
                plants.sort((a, b) => {
                    // 从小到大排序
                    return new Date(b.datetime) - new Date(a.datetime);
                });
                // 排序后的 plants 数组
                console.log("Sorted plants:", plants);
                // 解析排序后的植物数组
                resolve(plants);
            }).catch(error => {
                reject(error); // 如果无法获取植物数组，则拒绝 Promise
            });
        }).catch(error => {
            reject(error); // 如果无法打开 IndexedDB，则拒绝 Promise
        });
    });
}

// whether identification is finished.
function completedPlants(){
    return new Promise((resolve, reject) => {
        openPlantsIDB().then(IDB => {
            getAllPlants(IDB).then(plants => {
                // 过滤出 status 为 'completed' 的植物
                const completedPlants = plants.filter(plant => plant.status === 'Completed');
                resolve(completedPlants);
            }).catch(error => {
                reject(error); // 如果无法获取植物数组，则拒绝 Promise
            });
        }).catch(error => {
            reject(error); // 如果无法打开 IndexedDB，则拒绝 Promise
        });
    });
}
function inProgressPlants(){
    return new Promise((resolve, reject) => {
        openPlantsIDB().then(IDB => {
            getAllPlants(IDB).then(plants => {
                // 过滤出 status 为 'completed' 的植物
                const completedPlants = plants.filter(plant => plant.status === 'In Progress');
                resolve(completedPlants);
            }).catch(error => {
                reject(error); // 如果无法获取植物数组，则拒绝 Promise
            });
        }).catch(error => {
            reject(error); // 如果无法打开 IndexedDB，则拒绝 Promise
        });
    });
}
// Sorting by distance away is a ‘stretch’ goal (i.e. nice to have).