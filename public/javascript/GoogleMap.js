(g => {
    var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__",
    m = document, b = window;
    b = b[c] || (b[c] = {});
    var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
    u = () => h || (h = new Promise(async (f, n) => {
    await (a = m.createElement("script"));
    e.set("libraries", [...r] + "");
    for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
    e.set("callback", c + ".maps." + q);
    a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
    d[q] = f;
    a.onerror = () => h = n(Error(p + " could not load."));
    a.nonce = m.querySelector("script[nonce]")?.nonce || "";
    m.head.append(a)
}));
    d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
})({
    key: "AIzaSyB3kTOEPoJxIMqR_fU1VHr9CozUXxQvA7s",
    // Add other bootstrap parameters as needed, using camel case.
    // Use the 'v' parameter to indicate the version to load (alpha, beta, weekly, etc.)
    v: 'weekly'
})
// // Note: This example requires that you consent to location sharing when
// // prompted by your browser. If you see the error "The Geolocation service
// // failed.", it means you probably did not give permission for the browser to
// // locate you.
let map, infoWindow, location = {lat: 53.3921, lng: -1.4898};
var lastMarker = null;
//初始化位置
setLocation()

async function initMap() {
    const {Map} = await google.maps.importLibrary("maps");
    const {AdvancedMarkerView} = await google.maps.importLibrary("marker")
    const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
    const {SearchBox} = await google.maps.importLibrary("places");


    // var Sheffield = new google.maps.LatLng(53.3921, -1.4898);
    map = new Map(document.getElementById("map"), {
        //default location: Sheffield
        center: location,
        zoom: 11,
        mapId: "DEMO_MAP_ID",
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER,
        },
    });


    // let lastMarker = null; // 用于存储最后一个标记
    // 添加地图点击事件监听器
    map.addListener("click", (event) => {
        if (lastMarker != null) {
            lastMarker.setMap(null);
        }
        // 获取点击位置的经纬度信息
        location.lat = event.latLng.lat();
        location.lng = event.latLng.lng();
        console.log("Clicked at:", location.lat, location.lng);
        // 在地图上标记点击位置
        lastMarker = new AdvancedMarkerElement({
            map: map,
            position: event.latLng,
            title: "Clicked Location",
        });
        // 将地图中心设置为标记的位置
        map.setCenter(lastMarker.position);
        setLocation()
    });


    const searchBox = new SearchBox(document.getElementById("search-box"));
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("search-box"));

    searchBox.addListener("places_changed", () => {
        console.log('places_changed')
        const places = searchBox.getPlaces();
        if (places.length === 0) {
            return;
        }
        // 显示搜索结果中的第一个地点，并添加标记
        const place = places[0];
        if (lastMarker != null) {
            lastMarker.setMap(null);
        }
        lastMarker = new AdvancedMarkerElement({
            map: map,
            position: place.geometry.location,
            title: place.name,
        });
        map.setCenter(place.geometry.location);
        setLocation()
    });


    infoWindow = new google.maps.InfoWindow();
    //todo: 莫名其妙focus
    const locationButton = document.getElementById("getCurrentLoc");

    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    // map.controls[google.maps.ControlPosition.LEFT_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    location.lat = position.coords.latitude;
                    location.lng = position.coords.longitude;
                    console.log("pan to:", location.lat, location.lng);

                    if (lastMarker != null) {
                        lastMarker.setMap(null);
                    }
                    lastMarker = new AdvancedMarkerElement({
                        map: map,
                        position: location,
                        title: "current Location",
                    });
                    // 将地图中心设置为标记的位置
                    map.setCenter(lastMarker.position);
                    setLocation()
                    //todo: store location to MongoDB
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                },
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
    console.log(location)
    return location
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation.",
    );
    infoWindow.open(map);
}

const path = window.location.pathname
if (path === '/upload') {
    initMap()
}//否则执行showMapInDetail() （在detail.js中调用）

function setLocation() {
    document.getElementById("lat").value = location.lat;
    document.getElementById("lng").value = location.lng;
}

//球面上的距离不能直接用勾股定理，直接调用Google封装的函数即可
async function computeDistanceBetween(from, to) {
    const {spherical} = await google.maps.importLibrary("geometry")
    const distance = spherical.computeDistanceBetween(from, to)
    console.log('distance' + distance)
}