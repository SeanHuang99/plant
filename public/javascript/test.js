// const fetch = require("node-fetch");

async function loadAllPlants() {
    if (navigator.onLine) {
        fetch('http://localhost:3000/requestHandler/getAllPlants')
            .then(function (res) {
                console.log('fetch /getAllPlants')
                return res.json();
            }).then(function (newPlants) {
            openPlantsIDB().then((db) => {
                getAllPlants(db).then(plants => {
                    //如果是第一次连接（IDB没有数据：长度=0）
                    if (plants.length === 0) {
                        //添加所有plant
                        addNewPlantsToIDB(db, newPlants).then(() => {
                            console.log("All new plants added to IDB")
                        })
                    }
                    //如果不是，判断plant的长度是否相同
                    else {//相同 则正确
                        //否则重新添加
                        if (plants.length !== newPlants.length) {
                            deleteAllExistingPlantsFromIDB(db).then(() => {
                                console.log('deleteAllExistingPlantsFromIDB')
                                addNewPlantsToIDB(db, newPlants).then(() => {
                                    console.log("All new plants added to IDB")
                                })
                            });
                        }
                    }
                })
            });
            return newPlants
        })
    } else {
        console.log("Offline mode")
        openPlantsIDB().then((db) => {
            //直接从IDB获取所有plants（未同步的plant已在点击添加时加入IDB）
            getAllPlants(db).then(allPlants => {
                return allPlants
            });
        })
    }
}
