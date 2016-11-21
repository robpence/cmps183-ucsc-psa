/**
 * Created by diesel on 11/11/16.
 */


var map_var = "hello from ourmap.js!";
var central_campus = [36.991, -122.060];
var kresge_college = [36.999207, -122.064339];
var stevenson_college = [36.997498, -122.055061];
var crown_college = [36.999008, -122.055176];
var merrill_college = [36.999944, -122.053345];
var cowell_college = [36.999677, -122.054740];
var college_9 = [37.001969, -122.057908];
var college_10 = [37.001575, -122.058938];
var porter_college = [36.994357, -122.065471];
var college_8 = [36.991049, -122.064856];
var oakes_college = [36.989364, -122.063981];
var bounds = [
            //south west
            [37.007606, -122.037206],
            //north east
            [36.971819, -122.081151]];


var New_Map = function (onClick) {

    var map = L.map('mapid', {
        maxZoom: 18,
        minZoom: 14,
        maxBounds: bounds
    }).setView(central_campus, 15);


    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    var self = {};
    self.map = map;
    //self.circle = null;
    self.lat = 0;
    self.lng = 0;

    self.set_circle = function(circle){
        self.circle = circle
    };


    self.draw_circle = function (e) {
        //self.lat = e.latlng.lat;
        //self.lng = e.latlng.lng;
        if (!self.circle.drawn) {
            L.circle(e.latlng, self.circle).addTo(self.map);
            self.circle.drawn = true;
        }
    };


    self.map.on('click', function(e) {
        self.draw_circle(e);
        onClick(e.latlng.lat, e.latlng.lng);
    });

    self.map.on('drag', function() {
        self.map.panInsideBounds(bounds, { animate: false });
    });


    //        L.marker([36.991, -122.060]).addTo(map)
    //            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //            .openPopup();

    /*

    */

    return  self;
};

