mapboxgl.accessToken =
  "pk.eyJ1Ijoiam1mcmltbWwiLCJhIjoiY20wZzdid3JyMTkweTJpb3J1YnJ6b3BkNiJ9.AIq8-_n3FX7v_45I0Ria3w";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/jmfrimml/cm2mpg0rz001601r6drnafwgr",
  center: [-104.88799, 39.78023],
  zoom: 13
});

map.addControl(
  new mapboxgl.AttributionControl({
    customAttribution: "Icons from www.flaticon.com licensed by CC 3.0"
  })
);

// map zoom and rotation
map.addControl(new mapboxgl.NavigationControl());

// global variable for food stores
var denverFoodStoreFeatures = [];

map.on("load", function () {
  console.log("Map load function...");
    // wait a half second befo executing loadFeatures
  setTimeout(loadFeatures, 500);

  // create a popup, but don't add it to the map yet
  const popup = new mapboxgl.Popup({
    closeOnClick: false
  });

  // a point to see what the coordinates are for a feature
  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-104.88799, 39.78023]
        }
      }
    ]
  };
  map.addSource("point", {
    type: "geojson",
    data: geojson
  });

  // a point to see what the coordinates are for a food feature
  const foodGeojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-104.88799, 39.78023]
        }
      }
    ]
  };
  map.addSource("foodPoint", {
    type: "geojson",
    data: foodGeojson
  });

  // open street layer
  map.addLayer(
    {
      id: "openstreetmap-basemap",
      type: "raster",
      source: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    },
    "denver-buildings",
    "denver-food-stores"
  );

  // for troubleshooting, setup for a point that will appear once a user clicks a building on the map
  map.addLayer({
    id: "point",
    type: "circle",
    source: "point",
    paint: {
      "circle-radius": 5,
      "circle-color": "#F84C4C" // red color
    }
  });

  // for troubleshooting, setup for a point that will appear to the nearest food store
  map.addLayer({
    id: "foodPoint",
    type: "circle",
    source: "foodPoint",
    paint: {
      "circle-radius": 7,
      "circle-color": "#000000" //black
    }
  });

  // map click on a building
  map.on("click", "denver-buildings", function (e) {
    const id = e.features[0].properties.id; // building id number
    const type = e.features[0].properties.type; // building type i.e. commercial
    const clickCoords = e.lngLat;  // this is the first set of coordinates that is found for the click specific
    console.log("click coords: " + clickCoords);
    // console.log("lat: " + clickCoords.lat + " long: " + clickCoords.lng);

    // building polygon -> centroid -> coordinates of centroid
    let buildingCoords = e.features[0].geometry.coordinates.slice();  // get all coordinates of the building
    let buildingPolygon = turf.polygon(buildingCoords); // turf polygon of building footprint
    let buildingCentroid = turf.centroid(buildingPolygon);  // find center of building
    let centroidCoords = buildingCentroid.geometry.coordinates;  // coordinates for the center of the building

    let foodStoreFeatureCollection = turf.featureCollection(denverFoodStoreFeatures);  // feature collection for the food stores
    let targetPoint = turf.point(centroidCoords);
    let nearestPoint = turf.nearestPoint(targetPoint, foodStoreFeatureCollection);  // find the nearest food store from collection
    let distance = turf.distance(targetPoint, nearestPoint, {units: 'feet'}).toFixed(2);
   
    // troubleshooting outputs
    console.log("Centroid coords: " + centroidCoords);
    console.log("Nearest point: " + nearestPoint.geometry.coordinates);
    console.log("Distance to closest food store: " + distance + " ft");

    // add building info to the popup
    popup
      // .setLngLat(clickCoords)
      .setLngLat(centroidCoords)
      .setHTML(id + ": " + type + "<br>Nearest food store: " + distance + " ft")
      .addTo(map);

    // set the geojson point to be where click occurrs
    // geojson.features[0].geometry.coordinates = [clickCoords.lng, clickCoords.lat]; 
    geojson.features[0].geometry.coordinates = [centroidCoords[0], centroidCoords[1]];
    map.getSource("point").setData(geojson);
    foodCoords = nearestPoint.geometry.coordinates;
    foodGeojson.features[0].geometry.coordinates = [foodCoords[0], foodCoords[1]];
    map.getSource("foodPoint").setData(foodGeojson);
  });

  // change mouse pointer when it enters a building
  map.on("mouseenter", "denver-buildings", function (e) {
    map.getCanvas().style.cursor = "crosshair";
  });

  // change mouse pointer when it leaves a building
  map.on("mouseleave", "denver-buildings", function (e) {
    map.getCanvas().style.cursor = "";
    // popup.remove();
  });
});

function loadFeatures() {
  denverFoodStoreFeatures = map.queryRenderedFeatures({ layers: ["denver-food-stores"] });
  console.log("loadFeatures function: " + denverFoodStoreFeatures.length);
}

var chkBuildingsElement = document.getElementById("denver-buildings");
chkBuildingsElement.onclick = function (e) {
  console.log("Building layer checked");
  visibilityToggle(e);
};

var chkFoodStoresElement = document.getElementById("denver-food-stores");
chkFoodStoresElement.onclick = function (e) {
  console.log("Food Stores layer checked");
  visibilityToggle(e);
};

// turn layer on or
function visibilityToggle(e) {
  var isChecked = e.target.checked;
  console.log("id: " + e.target.id);
  if (isChecked) {
    map.setLayoutProperty(e.target.id, "visibility", "visible");
  } else {
    map.setLayoutProperty(e.target.id, "visibility", "none");
  }
};
