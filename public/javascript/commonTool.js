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

function getpPlantId(){
    return window.localStorage.getItem("plantId")
}