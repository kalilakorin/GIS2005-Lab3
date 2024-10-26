mapboxgl.accessToken =
  "pk.eyJ1Ijoiam1mcmltbWwiLCJhIjoiY20wZzdid3JyMTkweTJpb3J1YnJ6b3BkNiJ9.AIq8-_n3FX7v_45I0Ria3w";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/jmfrimml/cm2mpg0rz001601r6drnafwgr",
  center: [-104.88799, 39.78023],
  zoom: 13,
});

map.addControl(
  new mapboxgl.AttributionControl({
    customAttribution: "Icons from www.flaticon.com licensed by CC 3.0",
  })
);

map.addControl(new mapboxgl.NavigationControl());

map.on("load", function () {
  console.log("Let's load stamen next...");

  // stamen basemap
  //   map.addLayer({
  //     'id': 'stamen-basemap',
  //     'type': 'raster',
  //     'source': {
  //       'type': 'raster',
  //       'tiles': [
  //         //'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'
  //         'https://maps.stamen.com/watercolor/#{z}/{x}/{y}'
  //       ],
  //       'tileSize': 256
  //     }
  //   }, 'denver-food-stores');

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
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    "denver-buildings",
    "denver-food-stores"
  );
});

var chkBuildingsElement = document.getElementById("chkBuildings");
chkBuildingsElement.onclick = function (e) {
  console.log("Building layer checked");
  var isChecked = e.target.checked;
  if (isChecked) {
    map.setLayoutProperty("denver-buildings", "visibility", "visible");
  } else {
    map.setLayoutProperty("denver-buildings", "visibility", "none");
  }
};

var chkFoodStoresElement = document.getElementById("chkFoodStores");
chkFoodStoresElement.onclick = function (e) {
  console.log("Food Stores layer checked");
  var isChecked = e.target.checked;
  if (isChecked) {
    map.setLayoutProperty("denver-food-stores", "visibility", "visible");
  } else {
    map.setLayoutProperty("denver-food-stores", "visibility", "none");
  }
};
