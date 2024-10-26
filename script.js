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
    customAttribution: "Icons from www.flaticon.com licensed by CC 3.0"
  })
);

map.addControl(new mapboxgl.NavigationControl());

map.on("load", function () {
  console.log("Map load function...");

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
  // map.addLayer(
  //   {
  //     id: "openstreetmap-basemap",
  //     type: "raster",
  //     source: {
  //       type: "raster",
  //       tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
  //       tileSize: 256,
  //       attribution:
  //         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //     },
  //   },
  //   "denver-buildings",
  //   "denver-food-stores"
  // );

  // create a popup, but don't add it to the map yet
  const popup = new mapboxgl.Popup({
    closeOnClick: false
  });

  map.on("click", "denver-buildings", function (e) {
    const id = e.features[0].properties.id;
    const type = e.features[0].properties.type;
    // const coordinates = e.features[0].geometry.coordinates.slice();
    // console.log("coordinates\n" + coordinates);
    console.log("lng lat\n" + e.lngLat);


    // popup = new mapboxgl.Popup()
    popup.setLngLat(e.lngLat)
      .setHTML(id + ": " + type)
      .addTo(map);
    // new mapboxgl.Popup()
    //   .setLngLat(coordinates)
    //   .setHTML(id + ": " + type)
    //   .addTo(map);

    // map.on('mouseleave', 'denver-buildings', function (e) {
    //   map.getCanvas().style.cursor= '';
    //   popup.remove();
    // });
  });

  map.on('mouseenter', 'denver-buildings', function (e) {
    map.getCanvas().style.cursor = 'crosshair';
  });

  map.on('mouseleave', 'denver-buildings', function (e) {
    map.getCanvas().style.cursor= '';
    popup.remove();
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
}
