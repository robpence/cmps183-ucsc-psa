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
    self.most_recent = null;
    self.all_markers = [];


   /* These layers are toggled to filter the display of icons */
    var search_layer = new L.FeatureGroup();

    /*on-click view of div showing announcement */
    view_coordinates_of_announcement = function(lat, long) {
        self.map.setView([lat,long], 22, {animation: true});
    };


    self.change_map_view = function(){
        switch (location) {
            case "kresge":
                self.set_coordinates(kresge_college);
                break;
            case "merrill":
                self.set_coordinates(merrill_college);
                break;
            case "rachael_carson":
                self.set_coordinates(college_8);
                break;
            case "oakes":
                self.set_coordinates(oakes_college);
                break;
            case "college_9":
                self.set_coordinates(college_9);
                break;
            case "college_10":
                self.set_coordinates(college_10);
                break;
            case "crown":
                self.set_coordinates(crown_college);
                break;
            case "porter":
                self.set_coordinates(porter_college);
                break;
            case "cowell":
                self.set_coordinates(cowell_college);
                break;

            case "stevenson":
                self.set_coordinates(stevenson_college);
                break;
            default:
                self.set_coordinates(central_campus);
                break;
        }
    };

    self.set_coordinates = function(coordinates){
        self.map.setView(coordinates, 17, {animation: true});
    };

    self.set_marker = function(marker){
        self.marker = marker;
    };


    self.update_marker = function(new_marker){
        self.delete_most_recent();
        //var latlng = self.marker.latlng;
        //self.marker = new_marker;
        //self.marker.latlng = latlng;
        self.marker.icon = new_marker.icon;
        self.marker.category = new_marker.category;
        self.marker.drawn = false;
        console.log(new_marker);
        console.log(self.marker);

        self.add_marker(self.marker);

        console.log(self.most_recent);
        console.log(self.all_markers);

    };


    self.add_marker = function (e) {

        // if from clicking on map
        if (self.marker.latlng == null) {
            console.log("it was null");
            if(e.latlng != null){
                self.marker.latlng = e.latlng;
            }
            return;
        }
        self.most_recent = new L.marker(self.marker.latlng, {icon: self.marker.icon}).addTo(self.map).on('click', openwindow);
        self.most_recent._icon.id = self.marker.id;
        //self.map.addLayer(self.most_recent);
        self.marker.drawn = true;
    };


    //Opens the popup for the announcements information.
    function openwindow(e) {
        console.log(e);
        console.log(e.target._icon.id);
        //gets the correct id for the announcement in the vue list.
        for (var i = 0; i < APP.vue.all_announcements.length; i++){
            if (e.target._icon.id == APP.vue.all_announcements[i].id){
                APP.announcement_Detail(i);
            }
        }
    }

    
    /* this layer is created when a user enters a search query. They can be of all categories, so switch statement is no good */
    self.create_search_layer = function() {
        var store_marker = L.marker(self.marker.latlng, {icon:self.marker.icon}).addTo(self.map).on('click', openwindow);

        //this isn't doing anything for some reason
        store_marker._icon.id = self.marker.id;
        store_marker.addTo(search_layer);
        search_layer.addTo(self.map);
    };


    self.clear_map = function(){
        for(var i = 0; i < self.all_markers.length; i++){
            self.map.removeLayer(self.all_markers[i]);
        }
    };


    self.finalize_marker = function(){
        self.all_markers.push(self.most_recent);
        self.most_recent = null;
    };


    self.delete_most_recent = function(){
        if(self.most_recent != null) {
            self.map.removeLayer(self.most_recent);
            self.most_recent = null;
        }
    };


    self.map.on('click', function(e) {
        if(APP.vue.map_clickable == true){
            self.add_marker(e);
            onClick(e.latlng.lat, e.latlng.lng);
            $('#CreateAnnouncementModal').modal('show');
        }
    });


    self.map.on('drag', function() {
        self.map.panInsideBounds(bounds, { animate: false });
    });


    self.clear_map2 = function() {
        self.map.removeLayer(search_layer);
        start_fresh_layer = new L.FeatureGroup(); //this is needed, since search_layer would just continue to add on itself
        search_layer = start_fresh_layer;
    };


    self.clear_for_search_announcements = function() {
        self.clear_map2(); //clear the map, and the old search layer
        APP.search(); //get a new series of icons which match search query, and update layer
        search_layer.addTo(self.map); //add new layer
    };

    return  self;
};

