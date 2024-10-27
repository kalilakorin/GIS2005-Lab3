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

map.addControl(new mapboxgl.NavigationControl());

map.on("load", function () {
  console.log("Map load function...");

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

  map.addLayer({
    id: "point",
    type: "circle",
    source: "point",
    paint: {
      "circle-radius": 5,
      "circle-color": "#F84C4C" // red color
    }
  });

  map.on("click", "denver-buildings", function (e) {
    const id = e.features[0].properties.id;
    const type = e.features[0].properties.type;
    const coords = e.lngLat;
    console.log("lng lat: " + coords);
    console.log("lat: " + coords.lat + " long: " + coords.lng);

    // popup = new mapboxgl.Popup()
    popup
      .setLngLat(coords)
      .setHTML(id + ": " + type)
      .addTo(map);

    //set the geojson point to be where click occurrs
    geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    map.getSource("point").setData(geojson);
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

function visibilityToggle(e) {
  var isChecked = e.target.checked;
  console.log("id: " + e.target.id);
  if (isChecked) {
    map.setLayoutProperty(e.target.id, "visibility", "visible");
  } else {
    map.setLayoutProperty(e.target.id, "visibility", "none");
  }
};
