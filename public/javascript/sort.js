/**
 * @module sort
 */

/**
 * sort the plant by date
 * @param {String} order asc/desc
 * @returns {Promise<unknown>}
 */
function sortByDate(order) {
    return new Promise((resolve, reject) => {
        openPlantIDB().then(IDB => {
            getAllPlants(IDB,"plants").then(plants => {
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

/**
 * sort plants by specified attribute and order
 * @param plants
 * @param {String} key specified attribute
 * @param {String} order asc/desc
 * @returns {*}
 */
function sortPlants(plants, key, order) {
    plants.sort((a, b) => {
        if (order === 'asc') {
            return a[key] - b[key]
        } else {
            return b[key] - a[key]
        }
    })
    return plants
}

/**
 * filter plants by specified key and value
 * e.g. whether identification is finished.
 * @param key attribute
 * @param value value
 * @returns {Promise<unknown>}
 */
function filterPlants(key, value) {
    return new Promise((resolve, reject) => {
        openPlantIDB().then(IDB => {
            getAllPlants(IDB,"plants").then(plants => {
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

/**
 * whether the plant has location
 * @param {Plant} plant
 * @returns {boolean}
 */
function haveLoc(plant) {
    return plant.location.lat != null && plant.location.lng != null
}

// Sorting by distance away is a ‘stretch’ goal (i.e. nice to have).
/**
 * calculate distances of the plant using current location
 * @param plants
 * @param {Loc} currentLoc current location
 * @returns {Promise<*>}
 */
async function calculateDistances(plants, currentLoc) {
    for (const plant of plants) {
        try {
            const distance = await computeDistanceBetween(currentLoc, plant.location);
            plant.distance = distance;
            console.log('computeDistance完毕');
        } catch (error) {
            console.error('计算距离时出错：', error);
        }
    }
    return plants
}

/**
 * sort plants by distance()
 * (Plants that do not have location information will not be displayed)
 * @param currentLoc
 * @param order asc/desc
 * @returns {Promise<unknown>}
 */
function sortByDistance(currentLoc, order) {
    return new Promise((resolve, reject) => {
        openPlantIDB().then(IDB => {
            getAllPlants(IDB,"plants").then(plants => {
                //delete plant without location
                plants = plants.filter(plant => haveLoc(plant));
                //calculate distance
                calculateDistances(plants,currentLoc).then(plants=>{
                    console.log('sortPlants by distance')
                    plants = sortPlants(plants, 'distance', order)
                    resolve(plants);
                })
            }).catch(error => {
                reject(error); // 如果无法获取植物数组，则拒绝 Promise
            });
        }).catch(error => {
            reject(error); // 如果无法打开 IndexedDB，则拒绝 Promise
        });
    });

}

