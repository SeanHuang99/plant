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


$(document).ready(function () {
    // console.log(111)
    // if (storage.get("lastURL") != null) {
    //     $('#content-iframe').attr('src', storage.get("lastURL"));
    // }

    // listen .nav-link event
    $('.nav-link').click(function (e) {
        console.log(222)
        // stop default page skip
        e.preventDefault();

        // get link
        var href = $(this).attr('href');

        // update iframe src to the link
        $('#content-iframe').attr('src', href);

        //add the url to the record
        storage.set("lastURL", href);
    });
});

// Register service worker to control making site work offline
window.onload = function () {
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
}