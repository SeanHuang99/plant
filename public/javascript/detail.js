if(window.localStorage.getItem("lastURL")!=='/detail' || window.localStorage.getItem("lastURL")===undefined) {
    window.localStorage.setItem('lastURL', '/detail');
}
// synPlantFromServer();
// console.log("wel to detail");
generateDetailPage();


function generateDetailPage(){
    const plantId=localStorage.getItem('plantId')
    // console.log('plantId: '+plantId)
    if (plantId==null){
        console.log('plantId==null')
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
                //todo: showMapInDetail is not defined?
                detailRender(newPlant)
                showMapInDetail(newPlant.location).then(r => console.log("Map loaded online"));
            })
            .catch(function (e){
                console.log(e.message)
            })
    }
    else {
        openPlantsIDB().then(IDB => {
            getDetailById(IDB, plantId).then(plant => {
                console.log('plant found in IDB ----- ' + JSON.stringify(plant))
                console.log(plant.plantId + '-------> ' + plant.description)
                detailRender(plant);
                // showMapInDetail(plant.location).then(r => console.log("Map load"));
            }).catch(err => {
                console.log(err)
                //todo: return to main page, and show alert of 'cannot find plant'
            })
        })
    }
}


    //render the page manully
function detailRender(plant){
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
        document.getElementById('editPopup').style.display = 'flex';
    }else {
        alert(' You cannot edit when offline')
    }
}

function closeEditPopup() {
    document.getElementById('editPopup').style.display = 'none';
}


// Function to submit a request to update the plant name
async function submitRequest() {
    const plantId = getPlantId();
    const nickName = getNickName();
    const preferredPlantName = document.getElementById('preferredPlantName').value;
    const creator = getNickNameOfPlant();
    // Post the data to the backend via the "/updatePlants" route
    const response = await fetch('/requestHandler/updatePlantsRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantId, preferredPlantName, nickName, creator})
    });

    if (response.ok) {
        synPlantFromServer();
        generateDetailPage();
        alert('Request submitted successfully!');
    } else {
        alert('Error submitting request');
    }
    // Close the modal after submitting
    // $('#editModal').modal('hide');
    closeEditPopup()
}

function getNickNameOfPlant() {
    // Get the element by its ID
    var nickNameElement = document.getElementById('nickName');

    // Extract the text content from the element
    var text = nickNameElement.textContent;

    // Assuming the format is "User Nickname: actual_nickname", split the text and retrieve the nickname
    var parts = text.split(': ');

    // Return the nickname part, if it exists, otherwise return an empty string
    return parts.length > 1 ? parts[1] : '';
}
