
//Simulate submission data to make the test much easier
var testData = {
    datetime: "2024-05-13T20:24",
    description: "testDescription",
    details: "testDetail",
    flowerColor: "#dd1313",
    flowerColorPicker: "#dd1313",
    flowers: "yes",
    lat: "53.3921",
    lng: "-1.4898",
    nickName: "gyTest",
    plantId: null,
    plantName: "testName",
    status: "In Progress",
    sunExposure: "partialShade",
    photo: "data:image/webp;base64,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",
};
function mockSubmit(){
    openPlantIDB().then(IDB => {
        console.log('add new plant to IDB')
        testData.plantId=Math.random() * 10000 + 1
        console.log(testData)
        addNewPlantsToIDB(IDB, [testData]).then(() => {
            console.log('finish addNewPlantsToIDB')
        })
        addNewPlantToSync(IDB, testData).then(() => {
            console.log('finish addNewPlantToSync')
        })
    }).catch(err => {
        console.log('err: ' + err)
    }).finally(() => {
        console.log('finally')
        alert('submit successfully')
        showAddPlantNotification()
        // console.log("current plant id: "+plantObj.plantId);
        // setPlantId(plantObj.plantId)
        // window.location.href = "/detail";
        return true
    })
}
function showAddPlantNotification() {
    navigator.serviceWorker.ready
        .then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.showNotification("Plant App",
                {
                    body: "Plant added!",
                    icon: '/images/icon.webp'
                })
                .then(r =>
                    console.log(r)
                );
        });
}