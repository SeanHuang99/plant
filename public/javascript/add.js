const addNewPlantButtonEventListener = () => {
    console.log('click submit button')
    //todo:修改表单提交方式，通过给按钮绑定click监听事件，使得离线时也能提交
    const txt_val = document.getElementById("txt_in").value
    const id=createPlantId(txt_val)
    const plant={text: txt_val,plantId:id}
    openSyncPlantsIDB().then((db) => {
        addNewPlantToSync(db, plant);
        console.log(111)
    })
        // .then(
        // openPlantsIDB().then(db=>{
        //     console.log(222)
        //     addNewPlantsToIDB(db,[plant])
        // })
    // )
    navigator.serviceWorker.ready
        .then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.showNotification("Plant App",
                {
                    body: "Plant added! - " + txt_val,
                    icon: '/images/icon.webp'})
                .then(r =>
                    console.log(r)
                );
        });
}

window.onload = function () {
    // Add event listeners to buttons
    const add_btn = document.getElementById("add_btn")
    add_btn.addEventListener("click", addNewPlantButtonEventListener)
}