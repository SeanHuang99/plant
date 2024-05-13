//取消form的action跳转
//submit按钮先进行表单验证
//表单全部非空之后，将newPlant插入syncIDB与IDB
//之后在sw中的sync事件 实现addPlantToServer
function showAddPlantNotification(){
    navigator.serviceWorker.ready
        .then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.showNotification("Plant App",
                {
                    body: "Plant added!",
                    icon: '/images/icon.webp'})
                .then(r =>
                    console.log(r)
                );
        });
}


