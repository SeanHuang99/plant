/**
 * @module GoogleMap
 */

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
//set global variable Glocation which will be set to form every time it changes
let map, infoWindow, Glocation = {lat: 53.3921, lng: -1.4898};
var lastMarker = null;

/**
 * Initialize the Google Map
 * @returns {Promise<{lng: number, lat: number}>}
 */
async function initMap() {
    //Initialization location(default one is Sheffield)
    setLocation()
    const {Map} = await google.maps.importLibrary("maps");
    const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
    const {SearchBox} = await google.maps.importLibrary("places");

    map = new Map(document.getElementById("map"), {
        center: Glocation,
        zoom: 11,
        mapId: "DEMO_MAP_ID",
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER,
        },
    });

    // Add a map click event listener
    map.addListener("click", (event) => {
        if (lastMarker != null) {
            lastMarker.setMap(null);
        }

        Glocation.lat = event.latLng.lat();
        Glocation.lng = event.latLng.lng();
        console.log("Clicked at:", Glocation.lat, Glocation.lng);
        // Mark the location on the map
        lastMarker = new AdvancedMarkerElement({
            map: map,
            position: event.latLng,
            title: "Clicked Location",
        });
        // Set the center of the map to the location of the marker
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
        // Displays the first place in the search results and adds a tag
        const place = places[0];
        if (lastMarker != null) {
            lastMarker.setMap(null);
        }
        lastMarker = new AdvancedMarkerElement({
            map: map,
            position: place.geometry.location,
            title: place.name,
        });
        console.log(place)
        Glocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
        setLocation()
        map.setCenter(place.geometry.location);
    });


    infoWindow = new google.maps.InfoWindow();
    const locationButton = document.getElementById("getCurrentLoc");

    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    Glocation.lat = position.coords.latitude;
                    Glocation.lng = position.coords.longitude;
                    console.log("pan to:", Glocation.lat, Glocation.lng);
                    setLocation()
                    if (lastMarker != null) {
                        lastMarker.setMap(null);
                    }
                    lastMarker = new AdvancedMarkerElement({
                        map: map,
                        position: Glocation,
                        title: "current Location",
                    });
                    map.setCenter(lastMarker.position);

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
    return Glocation
}

/**
 * handle error if the browser do not have GeoLocation
 * @param browserHasGeolocation
 * @param infoWindow
 * @param pos
 */
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
    if (navigator.onLine){
        console.log('initMap()')
        initMap()
    }
    else {//do not show map when offline
        console.log('hide map')
        const mapForm=document.getElementById('mapForm')
        mapForm.style.display = 'none'
    }
}
//Otherwise execute showMapInDetail() (called in the detail.js)

/**
 * set latitude and longitude data to the input form
 */
function setLocation() {
    document.getElementById("lat").value = Glocation.lat;
    document.getElementById("lng").value = Glocation.lng;
}

//The distance on the sphere cannot be directly used by the Pythagorean theorem,
//the function encapsulated by Google can be called directly
/**
 * compute the distance between two places on the sphere
 * @param {Loc} from
 * @param {Loc} to
 * @returns {Promise<*>}
 */
async function computeDistanceBetween(from, to) {
    const {spherical} = await google.maps.importLibrary("geometry")
    const distance = spherical.computeDistanceBetween(from, to)
    console.log('distance' + distance)
    return distance
}