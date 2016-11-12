/**
 * Created by diesel on 11/11/16.
 */



var map = L.map('mapid').setView([36.991, -122.060], 15);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//        L.marker([36.991, -122.060]).addTo(map)
//            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//            .openPopup();


