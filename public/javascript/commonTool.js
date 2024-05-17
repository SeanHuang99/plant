/**
 * @module commonTools
 */
function getNickName(){
    let nickName=window.localStorage.getItem("userNickName")
    return nickName;
}

function setNickName(nickname){
    window.localStorage.setItem("userNickName",nickname);
}

function setPlantId(plantId){
    window.localStorage.setItem("plantId",plantId)
    // console.log(plantId+'has saved to localStorage')
}

function getPlantId(){
    return window.localStorage.getItem("plantId")
}

function setPlantIsChange(){
    window.localStorage.setItem("plantIsChanged","0");
}

function setPlantNotChange(){
    window.localStorage.setItem("plantIsChanged","1");
}

function getPlantChangeStatus(){
    window.localStorage.getItem("plantIsChanged");
}