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
    self.marker = null;

   /* These layers are toggled to filter the display of icons */
    var all_markers = new L.FeatureGroup();
    var urgent_marker_layer = new L.FeatureGroup();
    var event_marker_layer = new L.FeatureGroup();
    var shutdown_marker_layer = new L.FeatureGroup();
    var my_announcement_layer = new L.FeatureGroup();

    /*on-click view of div showing announcement */
    view_coordinates_of_announcement = function(lat, long) {
        self.map.setView([lat,long], 22, {animation: true});
    };

    set_coordinates = function(coordinates){
        self.map.setView(coordinates, 17, {animation: true});
    };

    self.set_marker = function(marker){
        //console.log(marker);
        self.marker = marker;
    };


    self.add_marker = function (e) {
        if (!self.marker.drawn) {
            // if this marker came from our db then it
            if (self.marker.latlng == null){
                self.marker.latlng = e.latlng;
            }

            store_marker = L.marker(self.marker.latlng, {icon:self.marker.icon}).addTo(self.map).on('click', openwindow);

            console.log("self.marker.id" + " " + self.marker.id);
            store_marker._icon.id = self.marker.id;
            store_marker.addTo(all_markers);
            all_markers.addTo(self.map);
        }

    };

    function openwindow(e) {
        console.log("e.target._icon.id" + " " + e.target._icon.id);
        console.log(APP.vue.all_announcements[e.target._icon.id]);
        APP.announcement_Detail(e.target._icon.id);
    }

    /* This function creates a layer of either urgent,shutdown, or event when the user clicks on a filter option */
    self.create = function(e) {

        var store_marker = L.marker(self.marker.latlng, {icon:self.marker.icon}).addTo(self.map);

        switch (self.marker.category) {
            case "urgent":
                store_marker.addTo(urgent_marker_layer);
                urgent_marker_layer.addTo(self.map);
                break;
            case "shutdown":
                store_marker.addTo(shutdown_marker_layer);
                shutdown_marker_layer.addTo(self.map);
                break;
            case "event":
                store_marker.addTo(event_marker_layer);
                event_marker_layer.addTo(self.map);
                break;
            default:
                break;
        }
    };


    self.create_my_announcement_layer = function() {
        var store_marker = L.marker(self.marker.latlng, {icon:self.marker.icon}).addTo(self.map);
        store_marker.addTo(my_announcement_layer);
        my_announcement_layer.addTo(self.map);
    };

    self.map.on('click', function(e) {
        self.add_marker(e);
        onClick(e.latlng.lat, e.latlng.lng);

    });


    self.map.on('drag', function() {
        self.map.panInsideBounds(bounds, { animate: false });
    });

    /* Icons will be toggled according to which function is called */

    self.clear_map = function() {
        self.map.removeLayer(event_marker_layer);
        self.map.removeLayer(shutdown_marker_layer);
        self.map.removeLayer(urgent_marker_layer);
        self.map.removeLayer(all_markers);
        self.map.removeLayer(my_announcement_layer);
    };

    self.clear_for_all_announcements = function() {
        self.clear_map();
        self.map.addLayer(all_markers);
    };

    self.clear_for_my_announcements = function() {
        self.clear_map();
        self.map.addLayer(my_announcement_layer);
    };

    self.clear_for_urgent = function() {
        self.clear_map();
        self.map.addLayer(urgent_marker_layer);
    };

    self.clear_for_shutdown = function() {
        self.clear_map();
        self.map.addLayer(shutdown_marker_layer);
    };

    self.clear_for_event = function() {self.clear_map();
       self.map.addLayer(event_marker_layer);
    };


    return  self;
};

