/**
 * @module detail
 */

// store user browser history
if(window.localStorage.getItem("lastURL")!=='/detail' || window.localStorage.getItem("lastURL")===undefined) {
    window.localStorage.setItem('lastURL', '/detail');
}

// synPlantFromServer();
// console.log("wel to detail");
let updateTimer=5;
let getData=setInterval(generateDetailPage,1000);
generateDetailPage();
// before user leave the detail page, clean the refresh interval
window.addEventListener('beforeunload', function (event) {
    // can set up a confirmation dialog that asks if the user really wants to leave the page
    if (updateTimer>0){
        clearInterval(getData);
    }
});

// Define global variables currentPlant
let currentPlant = null;
let isCreator = null;
// var uniqueId="<%=uniqueId%>"

// let objId = null;
/**
 * generate detail page
 */
function generateDetailPage(){
    const plantId=localStorage.getItem('plantId')
    // console.log('plantId: '+plantId)
    if (plantId==null){
        // console.log('plantId==null')
        //todo: return to main page, and show alert of 'cannot find plant'
        alert("cannot find plant")
        window.localStorage.setItem('lastURL', '/main');
        window.location.href="/main";
    }
    if(navigator.onLine){
        fetch('/requestHandler/getPlants/'+plantId)
            .then(function (res) {
                return res.json();
            })
            .then(function (newPlant) {
                if(newPlant){
                    clearInterval(getData)
                    currentPlant = newPlant  //Update the global variable
                    detailRender(newPlant)
                    showMapInDetail(newPlant.location).then(r => console.log("Map loaded online"));
                }
                else {
                    if (--updateTimer <= 0) {
                        clearInterval(getData);
                        // alert('Failed to load data after several attempts.');
                    }
                }
            })
            .catch(function (e){
                console.log(e.message)
                clearInterval(getData)
            })
    }
    else {//offline
        openPlantIDB().then(IDB => {
            getDetailById(IDB, plantId).then(plant => {
                if(plant) {
                    clearInterval(getData)
                    console.log('detail plant found in IDB ----- ' + JSON.stringify(plant))
                    console.log(plant.plantId + ' detail-------> ' + plant.description)
                    const map=document.getElementById("map")
                    console.log('离线时获取map DOM')
                    map.innerText='Cannot show map when offline'
                    map.style.textAlign='center'
                    map.style.lineHeight='400px'
                    map.style.backgroundColor='lightgray'
                    //todo: 地图区域为空？
                    detailRender(plant);
                }
                else {
                    if (--updateTimer <= 0) {
                        clearInterval(getData);
                        // alert('Failed to load data after several attempts.');
                    }
                }
            }).catch(err => {
                console.log(err)
                clearInterval(getData)
                //todo: return to main page, and show alert of 'cannot find plant'
            })
        })
    }
}



/**
 * render the detail page manually
 * @param {Plant} plant
 */
function detailRender(plant){
    if(navigator.onLine) {
        const objId = plant._id; // Make sure you get _id correctly
        // console.log("objid:  "+objId)
        // Use closures to store objId
        ObjIdManager.setObjId(objId);
    }

    document.getElementById('plantName').textContent = `Plant Name: ${plant.plantName}`;
    document.getElementById('plantDescription').textContent = `Description: ${plant.description}`;
    document.getElementById('plantDetail').textContent = `Detail: ${plant.details}`;
    document.getElementById('plantDate').textContent = `Date/Time: ${plant.datetime}`;
    document.getElementById('flowerColorBox').style.backgroundColor = `${plant.flowerColor}`;
    document.getElementById('flowerColor').textContent = `${plant.flowerColor}`;
    document.getElementById('nickName').textContent = `Nick Name: ${plant.nickName}`;
    document.getElementById('flowers').textContent = `Flowers: ${plant.flowers}`;
    document.getElementById('sunExposure').textContent = `Sun Exposure: ${plant.sunExposure}`;
    document.getElementById('status').textContent = `Status: ${plant.status}`;


    document.getElementById('photo').src = plant.photo;
    document.getElementById('who_you_are').textContent = `You are in room: ${plant.plantId}`;

    if(plant.dbpedia.link!==undefined && plant.dbpedia.link!==""){
        document.getElementById('DBpediaLink').href = `${plant.dbpedia.link}`;
    }
    else{
        document.getElementById('DBpediaLink').href = 'http://dbpedia.org/resource/';
    }

    if(plant.dbpedia.name!==undefined && plant.dbpedia.name!==""){
        document.getElementById('DBpediaName').textContent = `Common Name: ${plant.dbpedia.name}`;
    }
    else{
        document.getElementById('DBpediaName').textContent = `Common Name: None`;
    }

    if(plant.dbpedia.description!==undefined && plant.dbpedia.description!==""){
        document.getElementById('DBpediaDescription').textContent = `Plant Description: ${plant.dbpedia.description}`;
    }
    else{
        document.getElementById('DBpediaDescription').textContent = `Plant Description: None`;
    }

    if(plant.dbpedia.genus!==undefined && plant.dbpedia.genus!==""){
        document.getElementById('DBpediaGunes').textContent = `Plant Genus: ${plant.dbpedia.genus}`;
    }
    else{
        document.getElementById('DBpediaGunes').textContent = `Plant Genus: None`;
    }
}

/**
 * Opens the edit popup for updating the plant name and status.
 * If the user is online and the current plant's nickname differs from the user's nickname, the edit popup is displayed.
 */
function openEditPopup() {
    const nickName = getNickName();  // Get the current user's nickname
    if (navigator.onLine) {
        if (currentPlant && currentPlant.nickName !== nickName) {
            document.getElementById('editPopupForName').style.display = 'flex';
            isCreator = 'False';
        } else {
            document.getElementById('editPopupForNameAndStatus').style.display = 'flex';
            isCreator = 'True';
        }
    } else {
        alert('You cannot update plant when offline');
    }
}

/**
 * Closes the edit popup for updating the plant name.
 */
function closeEditPopup() {
    document.getElementById('editPopupForName').style.display = 'none';
}

/**
 * Closes the edit popup for updating the plant name and status.
 */
function closeEditPopupForCreator() {
    document.getElementById('editPopupForNameAndStatus').style.display = 'none';

}

/**
 * Submits a request to update the plant name.
 * The request is sent to the backend via the "/updatePlants" route.
 */
async function submitRequestForUser() {
    const plantId = getPlantId();
    const nickName = getNickName();
    const plantOriginalName = getPlantOriginalName();
    let preferredPlantName = document.getElementById('preferredPlantName').value;
    const creator = getNickNameOfPlant();

    // Check if the new plant name is the same as the original name
    if (preferredPlantName === plantOriginalName) {
        alert("The same name as origin");
        closeEditPopup();  // Close the edit popup
        return;
    }

    // Send update request to the backend
    const response = await fetch('/requestHandler/updatePlantsRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantId, preferredPlantName, nickName, creator, plantOriginalName })
    });

    // Handle the response
    if (response.ok) {
        synPlantFromServer();
        generateDetailPage();
        alert('Request submitted successfully!');
    } else {
        const errorData = await response.json();
        alert(`Error submitting request: ${errorData.message}`);
    }

    closeEditPopup();  // Close the edit popup after submitting
}

/**
 * Submits a request to update the plant name and status.
 * The request is sent to the backend via the "/updatePlantsRequestForCreator" route.
 */
async function submitRequestForCreator() {
    const plantOriginalName = getPlantOriginalName();
    const preferredPlantName = document.getElementById('preferredPlantNameForCreator').value;
    const creator = getNickNameOfPlant();
    const objId = ObjIdManager.getObjId();  // Get objId from closure
    const statusComplete = document.querySelector(`input[name="status"][id*="Complete"]`);
    const statusInProgress = document.querySelector(`input[name="status"][id*="InProgress"]`);
    let status = null;

    // Get the selected status
    if (statusComplete && statusComplete.checked) {
        status = statusComplete.value;
    } else if (statusInProgress && statusInProgress.checked) {
        status = statusInProgress.value;
    }

    // Check if the form is empty
    if (!preferredPlantName && !status) {
        alert("Cannot submit empty form!");
        return;
    }

    // Check if the new plant name is the same as the original name
    if (preferredPlantName === plantOriginalName) {
        alert("The same name as origin");
        return;
    }

    const currentStatus = getStatusOfDetailPage();
    // Check if the new status is the same as the current status
    if (status === currentStatus) {
        alert("The selected status is the same as the current status.");
        return;
    }

    const requestBody = { objId, plantOriginalName, status };
    if (preferredPlantName) {
        requestBody.preferredPlantName = preferredPlantName;
    }

    // Send update request to the backend
    const response = await fetch('/requestHandler/updatePlantsRequestForCreator', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    // Handle the response
    if (response.ok) {
        synPlantFromServer();
        generateDetailPage();
        alert('Request submitted successfully!');
        closeEditPopupForCreator();
    } else {
        const errorData = await response.json();
        alert(`Error submitting request: ${errorData.message}`);
    }
}


/**
 * Gets the nickname of the plant.
 * @returns {string} The nickname of the plant or an empty string if an error occurs.
 */
function getNickNameOfPlant() {
    try {
        const nickNameText = document.getElementById('nickName').textContent;
        const parts = nickNameText.split(': ');
        return parts.length > 1 ? parts[1].trim() : '';  // Get the nickname and trim excess whitespace
    } catch (error) {
        console.error('Error retrieving nickname of plant:', error);
        return '';  // Return an empty string in case of an error
    }
}

/**
 * Gets the original name of the plant.
 * @returns {string} The original name of the plant or an empty string if an error occurs.
 */
function getPlantOriginalName() {
    try {
        const plantNameText = document.getElementById('plantName').textContent;
        const parts = plantNameText.split(': ');
        return parts.length > 1 ? parts[1].trim() : '';  // Get the plant original name and trim excess whitespace
    } catch (error) {
        console.error('Error retrieving plant original name:', error);
        return '';  // Return an empty string in case of an error
    }
}

/**
 * Gets the status of the detail page.
 * @returns {string} The status of the detail page or an empty string if an error occurs.
 */
function getStatusOfDetailPage() {
    try {
        const statusOfDPText = document.getElementById('status').textContent;
        const parts = statusOfDPText.split(': ');
        return parts.length > 1 ? parts[1].trim() : '';  // Get the status of the detail page and trim excess whitespace
    } catch (error) {
        console.error('Error retrieving plant original name:', error);
        return '';  // Return an empty string in case of an error
    }
}


/**
 * Object ID Manager for handling object IDs using a closure.
 * @namespace
 */
const ObjIdManager = (function() {
    let objId = null;

    return {
        getObjId: function() {
            return objId;
        },
        setObjId: function(id) {
            objId = id;
        }
    };
})();

