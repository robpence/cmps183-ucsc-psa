/**
 * Created by Robert on 11/16/2016.
 */

map = L.map('mapid').setView([36.991, -122.060], 15);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        //.setContent("You clicked the map at " + e.latlng.toString())
        .setContent('<p> Would you like to create a event?</p>')
        .openOn(map);

    console.log(e.latlng.toString());
    console.log(e.latlng.lat.toString());
    console.log(e.latlng.lng.toString());
    lat = e.latlng.lat;
    lng = e.latlng.lng;

    L.marker([lat, lng]).addTo(map)
        .bindPopup('The coordinates are: ' + e.latlng);
}

map.on('click', onMapClick);

L.marker([36.991, -122.060]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.<button> Hello </button>');