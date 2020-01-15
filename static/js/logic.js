link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(link, function (data) {
    createFeatures(data.features);
});
function createFeatures(earthquakeData) {

    // Define lightmap layer
    var lightMap = L.tileLayer(MAPBOX_URL, {
        attribution: ATTRIBUTION,
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    //Array to hold circle markers
    var myCircleArray = new Array();

    // Create circle for each earthquake and assign it a color corresponding to its magnitude
    for (var i = 0; i < earthquakeData.length; i++) {

        coordinates = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]]
        properties = earthquakeData[i].properties;

        var color = "#red";
        if (properties.mag < 1) {
            color = "greenyellow";
        }
        else if (properties.mag < 2) {
            color = "yellowgreen";
        }
        else if (properties.mag < 3) {
            color = "yellow";
        }
        else if (properties.mag < 4) {
            color = "gold";
        }
        else if (properties.mag < 5) {
            color = "orange";
        }

        // Add circles to map
        var circles = L.circle(coordinates, {
            fillOpacity: 0.5,
            color: color,
            fillColor: color,
            radius: (properties.mag * 12500)
        }).bindPopup("<h3>" + properties.place + "</h3><hr><p>" + new Date(properties.time) + "</p>");
        //Add cirlces to the array
        myCircleArray.push(circles);
    }

    var earthquakes = L.layerGroup(myCircleArray);

    var baseMap = {
        "Light Map": lightMap,
    };

    var overlayMap = {
        Earthquakes: earthquakes
    };

    // Add layer to the map
    var myMap = L.map("map", {
        center: [38.09, -95.71],
        zoom: 5,
        layers: [lightMap, earthquakes]
    });

    // Create a layer control, Pass in our baseMaps and overlayMaps, Add the layer control to the map
    L.control.layers(baseMap, overlayMap, {
        collapsed: false
    }).addTo(myMap);



    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var grades = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var colors = ["greenyellow", "yellowgreen", "yellow", "gold", "orange", "red"];
        legendInfo = "<h3>Magnitude</h3>";
        div.innerHTML = legendInfo
        // grab our label with the corresponding color to add to our legend
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<ul style-type=none>' + '<li style=\"background-color:' + colors[i] + ' "></li>' + ' ' + grades[i] + '</ul>';
        }

        return div;
    };
    legend.addTo(myMap);


};