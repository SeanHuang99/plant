var storage = {
    set: function(key, value) {
        window.localStorage.setItem(key, value);
    },
    get: function(key) {
        return window.localStorage.getItem(key);
    },
    remove: function(key) {
        window.localStorage.removeItem(key);
    },
    clear: function() {
        window.localStorage.clear();
    }
};


$(document).ready(function(){
    console.log(111)
    if(storage.get("lastURL")!=null){
        $('#content-iframe').attr('src', storage.get("lastURL"));
    }

    // listen .nav-link event
    $('.nav-link').click(function(e){
        console.log(222)
        // stop default page skip
        e.preventDefault();

        // get link
        var href = $(this).attr('href');

        // update iframe src to the link
        $('#content-iframe').attr('src', href);

        //add the url to the record
        storage.set("lastURL",href);
    });
});