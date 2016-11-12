/**
 * Created by diesel on 11/11/16.
 */

    
var map_var = "hello from ourmap.js!";


var New_Map = function () {

    var map = L.map('mapid').setView([36.991, -122.060], 15);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);




    var self = {};
    self.map = map;
    self.circle = null;

    self.set_circle = function(circle){
        self.circle = circle
    };


    self.draw_circle = function (e) {
        L.circle(e.latlng, self.circle).addTo(self.map);

    };


    self.map.on('click', function(e) {
        if (self.circle != null) {
            self.draw_circle(e);
            self.circle = null;
        }
    });


    //        L.marker([36.991, -122.060]).addTo(map)
    //            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //            .openPopup();

    /*

    */

    return  self;
};

