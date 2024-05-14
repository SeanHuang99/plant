if(window.localStorage.getItem("lastURL")!=='/detail' || window.localStorage.getItem("lastURL")===undefined) {
    window.localStorage.setItem('lastURL', '/detail');
}
// synPlantFromServer();
// console.log("wel to detail");
let updateTimer=5;
let getData=setInterval(generateDetailPage,1000);


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
                    detailRender(newPlant)
                    showMapInDetail(newPlant.location).then(r => console.log("Map loaded online"));
                }
                else {
                    if(updateTimer===0){
                        clearInterval(getData);
                    }
                    else{
                        updateTimer=updateTimer-1;
                    }
                }
            })
            .catch(function (e){
                console.log(e.message)
                clearInterval(getData)
            })
    }
    else {
        openPlantIDB().then(IDB => {
            getDetailById(IDB, plantId).then(plant => {
                if(plant) {
                    clearInterval(getData)
                    console.log('detail plant found in IDB ----- ' + JSON.stringify(plant))
                    console.log(plant.plantId + ' detail-------> ' + plant.description)
                    detailRender(plant);
                    document.getElementById("map").innerText = 'Cannot show map when offline'
                }
                else {
                    if(updateTimer===0){
                        clearInterval(getData);
                    }
                    else{
                        updateTimer=updateTimer-1;
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


    //render the page manully
function detailRender(plant){
    console
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

    if(plant.dbpedia.link!==undefined || plant.dbpedia.link!==""){
        document.getElementById('DBpediaLink').href = `${plant.dbpedia.link}`;
    }
    else{
        document.getElementById('DBpediaLink').href = 'http://dbpedia.org/resource/';
    }

    if(plant.dbpedia.name!==undefined || plant.dbpedia.name!==""){
        document.getElementById('DBpediaName').textContent = `Common Name: ${plant.dbpedia.name}`;
    }
    else{
        document.getElementById('DBpediaName').textContent = `Common Name: None`;
    }

    if(plant.dbpedia.description!==undefined || plant.dbpedia.description!==""){
        document.getElementById('DBpediaDescription').textContent = `Plant Description: ${plant.dbpedia.description}`;
    }
    else{
        document.getElementById('DBpediaDescription').textContent = `Plant Description: None`;
    }

    if(plant.dbpedia.genus!==undefined || plant.dbpedia.genus!==""){
        document.getElementById('DBpediaGunes').textContent = `Plant Genus: ${plant.dbpedia.genus}`;
    }
    else{
        document.getElementById('DBpediaGunes').textContent = `Plant Genus: None`;
    }
}


function openEditPopup() {
    if (navigator.onLine){
        document.getElementById('editPopupForName').style.display = 'flex';
    }else {
        alert(' You cannot update when offline')
    }
}

function closeEditPopup() {
    document.getElementById('editPopupForName').style.display = 'none';
}


// Function to submit a request to update the plant name
async function submitRequest() {

    const plantId = getPlantId();
    const nickName = getNickName();
    const preferredPlantName = document.getElementById('preferredPlantName').value;
    const creator = getNickNameOfPlant();
    const plantOriginalName = getPlantOriginalName();
    // Check if the preferred name is the same as the original name
    if (preferredPlantName === plantOriginalName) {
        alert("The same name as origin");
        closeEditPopup(); // Assume this function closes your modal or popup
        return; // Stop the function execution here
    }
    // Post the data to the backend via the "/updatePlants" route
    const response = await fetch('/requestHandler/updatePlantsRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantId, preferredPlantName, nickName, creator, plantOriginalName})
    });

    if (response.ok) {
        synPlantFromServer();
        generateDetailPage();
        alert('Request submitted successfully!');
    }  else {
        // General error handler for all other cases
        const errorData = await response.json();
        alert(`Error submitting request: ${errorData.message}`);
    }

    // Close the modal after submitting
    closeEditPopup()
}

function getNickNameOfPlant() {
    // Get the element by its ID
    try {
        const nickNameText = document.getElementById('nickName').textContent;
        const parts = nickNameText.split(': ');
        return parts.length > 1 ? parts[1].trim() : ''; // Trim any excess whitespace
    } catch (error) {
        console.error('Error retrieving nickname of plant:', error);
        return ''; // Return empty string in case of any error
    }
}

function getPlantOriginalName() {
    // Get the element by its ID
    try {
        const plantNameText = document.getElementById('plantName').textContent;
        const parts = plantNameText.split(': ');
        return parts.length > 1 ? parts[1].trim() : ''; // Trim any excess whitespace
    } catch (error) {
        console.error('Error retrieving plant original name:', error);
        return ''; // Return empty string in case of any error
    }
}
