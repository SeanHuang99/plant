/**
 * @module index
 */

// const fetch = require("node-fetch");
// const {getAllPlants} = require("../../controllers/apiController/databaseController/mongodbController");
var storage = {
    set: function (key, value) {
        window.localStorage.setItem(key, value);
    },
    get: function (key) {
        return window.localStorage.getItem(key);
    },
    remove: function (key) {
        window.localStorage.removeItem(key);
    },
    clear: function () {
        window.localStorage.clear();
    }
};




// Register service worker to control making site work offline
window.onload = function () {
    //insert nickname to index page
    if(getNickName()!==null && getNickName()!==undefined && getNickName()!=='') {
        updateNickname()
    }
    // showWelcomeOrIndex();
    showWelcome()
    synPlantFromServer();
    synAllChatObjsFromServer();

    //from local storage, to load the last url record.
    if (storage.get("lastURL") !== undefined && storage.get("lastURL") !== null && storage.get("lastURL") !== "") {
        $('#content-iframe').attr('src', storage.get("lastURL"));
        // console.log("jump to "+storage.get("lastURL"))
    }
    else{
        $('#content-iframe').attr('src', '/main');
    }
    // listen .nav-link event
    $('.nav-link').click(function (e) {
        // console.log(222)
        // stop default page skip
        e.preventDefault();

        // get link
        var href = $(this).attr('href');
        //plant update page unavailable in offline
        if(href==="/getAllUpdateRequests" && !navigator.onLine){
            alert("Update request page is unavailable in offline");
        }else{
            // update iframe src to the link
            $('#content-iframe').attr('src', href);
        }
        //add the url to the record
        storage.set("lastURL", href);
    });



    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
            .then(function (reg) {
                console.log('Service Worker Registered!', reg);
            })
            .catch(function (err) {
                console.log('Service Worker registration failed: ', err);
            });
    }

    // Check if the browser supports the Notification API
    if ("Notification" in window) {
        // Check if the user has granted permission to receive notifications
        if (Notification.permission === "granted") {
            console.log('granted')
            // Notifications are allowed, you can proceed to create notifications
            // Or do whatever you need to do with notifications
        } else if (Notification.permission !== "denied") {
            console.log('permission !== "denied')
            // If the user hasn't been asked yet or has previously denied permission,
            // you can request permission from the user
            Notification.requestPermission().then(function (permission) {
                // If the user grants permission, you can proceed to create notifications
                if (permission === "granted") {
                    navigator.serviceWorker.ready
                        .then(function (serviceWorkerRegistration) {
                            serviceWorkerRegistration.showNotification("Plant App",
                                {
                                    body: "Notifications are enabled!",
                                    icon: '/images/icon.webp'
                                }) // 指定图标的 URL
                                .then(r =>
                                    console.log(r)
                                );
                        });
                }
            });
        } else
            console.log('permission denied')
    } else
        console.log('no notification in window');


    //sync chat records
    if(!navigator.onLine){

    }
}

// function handleNickname() {
//     var nickname = document.getElementById('nickname').value;
//     console.log("Nickname entered:", nickname);
//     setNickName(nickname);
//     console.log("Nickname from storage:", getNickName());
//     location.href="/";
// }
//this function is to check the input nickname
function handleNickname() {
    var nicknameInput = document.getElementById('nickname');
    var errorMessage = document.getElementById('error-message');
    var nickname = nicknameInput.value.trim();

    if (nickname === "") {
        // Show error message if nickname is empty
        errorMessage.style.display = 'block';
        errorMessage.textContent = "Please enter a nickname."; // Update the text content of the error message
    } else {
        // Hide the error message if it was previously displayed
        setNickName(nickname);
        errorMessage.style.display = 'none';
        console.log("Nickname entered:", nickname);
        updateNickname()
        showWelcome()
        // showWelcomeOrIndex();
        // Continue with any additional logic such as AJAX requests, local storage, etc.
    }
}

//show the index page, user can see all uploaded plant
function showWelcome(){
    var welcomePage = document.getElementById('welcomePage');
    var indexPage = document.getElementById('indexPage');
    //if the username is null, then reset the username to new user
    if(getNickName()===null || getNickName()===undefined || getNickName()===''){
        setNickName("new user");
        updateNickname();
    }
    welcomePage.style.display = 'none';
    indexPage.style.display='block';
}

// function showIndex(){
//     welcomePage.style.display = 'none';
//     indexPage.style.display='block';
// }

//when user change username on welcome page, this function can update the frontend to sync the username
function updateNickname(){
    const username = getNickName();  // This function is assumed to be defined in your commonTool.js
    const userGreeting = document.getElementById('userGreeting');
    if (username) {
        userGreeting.textContent = `Welcome, ${username}`;
    } else {
        userGreeting.textContent = 'Welcome, Guest';  // Fallback text if no username is found
    }
}

//show the welcome page, user can change their username on this page
function changeUserName(){
    var welcomePage = document.getElementById('welcomePage');
    var indexPage = document.getElementById('indexPage');
    welcomePage.style.display = 'block';
    indexPage.style.display='none';
}

