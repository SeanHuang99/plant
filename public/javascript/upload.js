document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    var base64Image;
    //不论mySubmit返回什么，事件都会执行，放弃
    form.addEventListener("submit", (event) => {

        // console.log("location: "+infoWindowlocation);
        //transfer image/file to base64
    });
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
    //todo:修改表单提交方式，通过给按钮绑定click监听事件，使得离线时也能提交
    const form = document.getElementById("myForm");
    console.log(form)
    let formData = new FormData(form);
    <!--利用fromData对象的get方法获取表单数据-->
    let description = formData.get('description');

    console.log(description)
    // const formObject = {};
    // form.forEach((value, key) => {
    //     formObject[key] = value;
    // });
    // console.log(formObject);

    // const txt_val = document.getElementById("txt_in").value
    // const id=createPlantId(txt_val)
    // const plant={
    //     plantId: createPlantId(form.)
    // }

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