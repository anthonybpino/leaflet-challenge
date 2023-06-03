// Grab dataset url 


const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Create map and map's tile


var myMap = L.map("map", {
    center: [37.09, -105.555],
    zoom: 4
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmaps.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)


// Use d3 to build map using data from json url


d3.json(url).then(function(data) {

    // Establish circle color based on depth
    function mapColors(depth) {
        if (depth < 10) {
            return "lightgreen"
        } else if (depth < 30) {
            return "gold"
        } else if (depth < 50) {
            return "yellow"
        } else if (depth < 70) {
            return "orange"
        } else if (depth < 90) {
            return "orangered"
        } else {
            return "red"
        }
    }

    // Establish radius based on magnitude
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 2;
    }

    // Establish other properties of map
    function mapStyles(feature) {
        return {
            color: "black",
            fillColor: mapColors(feature.geometry.coordinates[2]),
            radius: mapRadius(feature.properties.mag),
            opacity: 0.7,
            fillOpacity: 0.7,
            stroke: true,
            weight: 0.5
        }
    }

    // Add earthquake data to map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyles,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<strMagnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Quake Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

    // Add legend to map

    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];
  
      div.innerHTML += "<h3 style='text-align: center'>Quake Depth</h3>"
  
      for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + mapColors(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(myMap);
});