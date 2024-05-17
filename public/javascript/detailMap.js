/**
 * @module detailMap
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

/**
 *  show Google Map in detail page
 * @param {Loc} loc location of current plant
 * @returns {Promise<void>} need to wait for Google API
 */
async function showMapInDetail(loc){
    if (loc?.lat!=null && loc?.lng !=null){
        console.log('render map')
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        map = new Map(document.getElementById("map"), {
            //default location: Sheffield
            center: loc,
            zoom: 11,
            mapId: "DEMO_MAP_ID",
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER,
            },
        });
        const marker =new AdvancedMarkerElement({
            map: map,
            position: loc,
            title: "chosen Location",
        });
        // 将地图中心设置为标记的位置
        map.setCenter(marker.position);
    }
    else {
        const map=document.getElementById("map")
        map.innerText='Location not set'
        map.style.textAlign='center'
        map.style.lineHeight='400px'
        map.style.backgroundColor='lightgray'
    }
}