//this js file is to check and submit the form
//cancel form action
//submit button should check null value in the form
//if the values are not empty in the form ，then insert newPlant to syncIDB(indexed db) and IDB
//then wait for sync event in service worker,  and addPlantToServer
window.onload = function () {
    if (getNickName() !== undefined && getNickName() !== "") {
        document.getElementById('nickName').value = getNickName()
    }
}


/**
 * show add-plant notification
 */
function showAddPlantNotification() {
    navigator.serviceWorker.ready
        .then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.showNotification("Plant App",
                {
                    body: "Plant added!",
                    icon: '/images/icon.webp'
                })
        });
}

var photo, base64Image

/**
 * check the form before submitting
 * --all inputs should be filled
 * --all checkboxes should be chosen
 * --chosen image should not exceed 3MB
 * @param form
 * @returns {boolean}
 */
function checkForm(form) {
    // 检查是否至少有一个单选按钮被选中
    const flowersYes = document.getElementById('flowersYes');
    const flowersNo = document.getElementById('flowersNo');
    if (!(flowersYes.checked || flowersNo.checked)) {
        alert('Please select whether the plant has flowers.');
        flowersYes.focus()
        return false; // 防止表单提交
    }
    if (!selectSunExposure()) {
        alert('Please choose the Sun Exposure.');
        const sunExposure = document.getElementById("sunExposure")
        sunExposure.focus()
        return false; // 防止表单提交
    }
    const color = document.getElementById("flowerColor")
    if (color.value == null || color.value === "") {
        alert('Please choose the color.');
        color.focus()
        return false; // 防止表单提交
    }
    const complete = document.getElementById('statusComplete');
    const inProgress = document.getElementById('statusInProgress');
    if (!(complete.checked || inProgress.checked)) {
        alert('Please select the status of the identification.');
        complete.focus()
        return false; // 防止表单提交
    }
    // if (getMarker()==null){
    //     alert('Please select the location');
    //     const map=document.getElementById('map')
    //     map.focus()
    //     return; // 防止表单提交
    // }
    //限制图片大小
    photo = form.elements['photo'].files[0];
    var fileSize = photo.size;
    console.log("file size: " + fileSize / (1024 * 1024) + "MB");
    if ((fileSize / (1024 * 1024)) > 3) {
        alert("Plant Image cannot exceed 3MB");
        return false;
    }
    return true
}

/**
 * change form to object(Easy to submit to the backend)
 * @param form
 * @returns {Promise<{}>}
 */
async function changeFormToObj(form) {
    console.log('run changeFormToObj()')

    let formData = new FormData(form);

    formData.set('plantId', createPlantId())
    formData = await changeImageFormat(formData);

    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
        // console.log(`${key}: ${value}`)
    });
    //create location object
    formObject['location']={
        lat:formObject['lat'],
        lng:formObject['lng']
    }
    delete formObject['lat']
    delete formObject['lng']
    console.log(formData)
    return formObject;
}

/**
 * change image format to base64
 * @param formData
 * @returns {Promise<unknown>}
 */
async function changeImageFormat(formData) {
    console.log('run changeImageFormat()')
    return new Promise((resolve, reject) => {
        if (photo) {
            const reader = new FileReader();
            reader.onload = function (e) {
                base64Image = e.target.result;
                formData.delete("photo");
                formData.append("photo", base64Image);
                resolve(formData);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(photo);
        } else {
            // If there is no image, return formData
            resolve(formData);
        }
    });
}

/**
 * submit the form
 * @param form
 * @returns {Promise<boolean>}
 */
async function mySubmit(form) {
    console.log("ready to submit: " + form)
    //Do form validation (non-empty + limit image size)
    if (checkForm(form)) {
        console.log('handle form')
        changeFormToObj(form).then(async plantObj => {
            console.log(plantObj)
            if (plantObj != null) {
                console.log('plantObj!=null')
                console.log(plantObj)
                openPlantIDB().then(async IDB => {
                    // await addNewPlantToSync(IDB, plantObj)
                    //     .then(() => {
                    //         console.log('finish addNewPlantToSync');
                    //         return addNewPlantsToIDB(IDB, [plantObj]); // 在这里返回 addNewPlantsToIDB 的 Promise
                    //     })
                    //     .then(() => {
                    //         console.log('finish addNewPlantsToIDB');
                    //         console.log('finally');
                    //         alert('submit successfully');
                    //         showAddPlantNotification();
                    //         console.log("current plant id: " + plantObj.plantId);
                    //         setPlantId(plantObj.plantId);
                    //         window.location.href = "/detail";
                    //     })
                    console.log('start add new plant to IDB')
                    await addPlantToBothStores(IDB, plantObj).then(()=>{
                        // console.log('finally');
                        alert('submit successfully');
                    })
                    setTimeout(() => {
                        showAddPlantNotification();
                        console.log("current plant id: " + plantObj.plantId);
                        setPlantId(plantObj.plantId);
                        window.location.href = "/detail";
                    },1000);
                })
            } else {
                console.log('plantObj==null')
            }
        })
    } else {
        console.log('have null value')
        // return false
    }
    return false
}

/**
 * set drop down form
 * @returns {boolean}
 */
function selectSunExposure() {
    const select = document.querySelector('.sun');
    const reset = document.querySelector('.sun option:nth-child(2)');
    const select_index = select.selectedIndex;
    console.log("select_index: " + select_index)
    return select_index !== 0;
}

/**
 * Synchronize the text field with the color picker
 */
function updateFlowerColor() {
    const colorPicker = document.getElementById('flowerColorPicker');
    const colorText = document.getElementById('flowerColor');
    colorText.value = colorPicker.value;
}

document.getElementById('photo').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById('uploadedImage');
            img.src = e.target.result;
            img.style.display = 'block';  // Ensure the image is visible
        };
        reader.readAsDataURL(file);
    }
});