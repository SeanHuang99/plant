// sorted (at least) by date/time seen
function sortByDate(order) {
    return new Promise((resolve, reject) => {
        openPlantsIDB().then(IDB => {
            getAllPlants(IDB).then(plants => {
                // 使用排序函数对植物数组进行排序
                plants.sort((a, b) => {
                    // 根据排序方向决定排序顺序
                    if (order === 'asc') {
                        return new Date(a.datetime) - new Date(b.datetime); // 升序
                    } else {
                        return new Date(b.datetime) - new Date(a.datetime); // 降序
                    }
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
function sortPlants(plants,key,order) {
    plants.sort((a, b) => {
        if (order === 'asc') {
            return a[key]-b[key]
        } else {
            return b[key]-a[key]
        }
    })
    return plants
}

// whether identification is finished.
function filterPlants(key,value) {
    return new Promise((resolve, reject) => {
        openPlantsIDB().then(IDB => {
            getAllPlants(IDB).then(plants => {
                // 过滤出指定状态的植物
                const filteredPlants = plants.filter(plant => plant[key] === value);
                resolve(filteredPlants);
            }).catch(error => {
                reject(error); // 如果无法获取植物数组，则拒绝 Promise
            });
        }).catch(error => {
            reject(error); // 如果无法打开 IndexedDB，则拒绝 Promise
        });
    });
}
// Sorting by distance away is a ‘stretch’ goal (i.e. nice to have).
function sortByDistance(currentLoc,order){
    return new Promise((resolve, reject) => {
        openPlantsIDB().then(IDB => {
            getAllPlants(IDB).then(plants => {
                plants.forEach(plant => {
                    plant.distance=computeDistanceBetween(currentLoc, plant.location);
                })
                plants=sortPlants(plants,'distance',order)
                resolve(plants);
            }).catch(error => {
                reject(error); // 如果无法获取植物数组，则拒绝 Promise
            });
        }).catch(error => {
            reject(error); // 如果无法打开 IndexedDB，则拒绝 Promise
        });
    });

}

//球面上的距离不能直接用勾股定理
async function computeDistanceBetween(from, to){
    const {spherical} = await google.maps.importLibrary("geometry")
     const distance=spherical.computeDistanceBetween(from,to)
    console.log(distance)
}