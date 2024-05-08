function getNickName(){
    let nickName=window.localStorage.getItem("userNickName")
    if(nickName===null){
        top.location.href="/";
    }
    else{
        return nickName;
    }
}

function setNickName(nickname){
    window.localStorage.setItem("userNickName",nickname);
}

function savePlantId(plantId){
    window.localStorage.setItem("plantId",plantId)
    // console.log(plantId+'has saved to localStorage')
}

function getpPlantId(){
    return window.localStorage.getItem("plantId")
}