document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

});
//todo
//取消form的action跳转
//submit按钮先进行表单验证
//表单全部非空之后，将newPlant插入syncIDB与IDB
//之后在sw中的sync事件 实现addPlantToServer
const addNewPlantButtonEventListener = () => {
    // console.log('click submit button')
    //先判空
    //全部非空后，封装对象
    const form = document.getElementById("myForm");
    openSyncPlantsIDB().then((db) => {
        addNewPlantToSync(db, plant);
        console.log(111)
    })

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

// window.onload = function () {
//     // Add event listeners to buttons
//     const submit_btn = document.getElementById("submit_btn")
//     submit_btn.addEventListener("click", addNewPlantButtonEventListener)
// }