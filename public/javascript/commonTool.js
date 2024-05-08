function getNickName(){
    return window.localStorage.getItem("userNickName");
}
function setNickName(nickname){
    window.localStorage.setItem("userNickName",nickname);
}