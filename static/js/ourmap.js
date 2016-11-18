/**
 * Created by diesel on 11/11/16.
 */


var map_var = "hello from ourmap.js!";


var initial_map_position = [36.991, -122.060];
var Crown_position = [];


var New_Map = function (onClick) {

    var map = L.map('mapid').setView(initial_map_position, 15);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);




    var self = {};
    self.map = map;
    self.circle = null;
    self.lat = 0;
    self.lng = 0;

    self.set_circle = function(circle){
        self.circle = circle
    };


    self.draw_circle = function (e) {
        self.lat = e.latlng.lat;
        self.lng = e.latlng.lng;
        L.circle(e.latlng, self.circle).addTo(self.map);


    };


    self.map.on('click', function(e) {
        if (self.circle != null) {
            self.draw_circle(e);
            self.circle = null;
            onClick();
        }
    });


    //        L.marker([36.991, -122.060]).addTo(map)
    //            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //            .openPopup();

    /*

    */

    return  self;
};

