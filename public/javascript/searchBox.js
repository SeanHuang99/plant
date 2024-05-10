async function initMap() {
    const {Map} = await google.maps.importLibrary("maps");
    const {SearchBox} = await google.maps.importLibrary("places");

    const map = new Map(document.getElementById("map"), {
        center: {lat: 40.7128, lng: -74.0060}, // 设置地图中心点为纽约
        zoom: 12, // 设置缩放级别
    });

    const searchBox = new SearchBox(document.getElementById("search-box"));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById("search-box"));

    // map.addListener("bounds_changed", () => {
    //     console.log('bounds_changed')
    //     searchBox.setBounds(map.getBounds());
    // });

    let markers = [];

    searchBox.addListener("places_changed", () => {
        console.log('places_changed')
        const places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }

        markers.forEach((marker) => {
            marker.setMap(null);
        });
        markers = [];

        // 显示搜索结果中的第一个地点，并添加标记
        const place = places[0];
        const marker = new google.maps.Marker({
            map:map,
            position: place.geometry.location,
            title: place.name,
        });
        console.log(place.name)
        map.setCenter(place.geometry.location);
        markers.push(marker);

        // const bounds = new google.maps.LatLngBounds();
        // places.forEach((place) => {
        //     if (!place.geometry) {
        //         console.log("Returned place contains no geometry");
        //         return;
        //     }
        //     markers.push(
        //         new google.maps.Marker({
        //             map,
        //             title: place.name,
        //             position: place.geometry.location,
        //         })
        //     );
        //
        //     if (place.geometry.viewport) {
        //         bounds.union(place.geometry.viewport);
        //     } else {
        //         bounds.extend(place.geometry.location);
        //     }
        // });
        // map.fitBounds(bounds);
    });
}
initMap()