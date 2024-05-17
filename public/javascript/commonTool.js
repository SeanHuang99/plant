/**
 * @module commonTools
 * this tool is to set/get user setting.
 */

/**
 * get user nickname in local storage
 * @return {string}
 */
function getNickName(){
    let nickName=window.localStorage.getItem("userNickName")
    return nickName;
}

/**
 * set the user nickname in local storage
 * @param nickname
 */
function setNickName(nickname){
    window.localStorage.setItem("userNickName",nickname);
}

/**
 * set the plant id in local storage
 * @param plantId
 */
function setPlantId(plantId){
    window.localStorage.setItem("plantId",plantId)
    // console.log(plantId+'has saved to localStorage')
}

/**
 * get the current plant id that user is viewing
 * @return {string}
 */
function getPlantId(){
    return window.localStorage.getItem("plantId")
}

// function setPlantIsChange(){
//     window.localStorage.setItem("plantIsChanged","0");
// }
//
// function setPlantNotChange(){
//     window.localStorage.setItem("plantIsChanged","1");
// }
//
// function getPlantChangeStatus(){
//     window.localStorage.getItem("plantIsChanged");
// }