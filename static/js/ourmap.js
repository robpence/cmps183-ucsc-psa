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
    var all_markers = new L.FeatureGroup();
    var urgent_marker_layer = new L.FeatureGroup();
    var event_marker_layer = new L.FeatureGroup();
    var shutdown_marker_layer = new L.FeatureGroup();
    var users_announcement_layer = new L.FeatureGroup();
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
        self.add_marker(self.marker);
    };


    self.add_marker = function (e) {
        if (true){ //(!self.marker.drawn) {
            // if this marker came from our db then it
            if (self.marker.latlng == null){
                self.marker.latlng = e.latlng;
            }
            self.most_recent = new L.marker(self.marker.latlng, {icon:self.marker.icon});
            self.map.addLayer(self.most_recent);
            //self.most_recent.addTo(self.map);
            self.marker.drawn = true;
            
            store_marker = L.marker(self.marker.latlng, {icon:self.marker.icon}).addTo(self.map).on('click', openwindow);
            console.log(store_marker);
            console.log("self.marker.id" + " " + self.marker.id);

            store_marker = L.marker(self.marker.latlng, {icon:self.marker.icon}).addTo(self.map);
            store_marker._icon.id = self.marker.id;
            store_marker.addTo(all_markers);
            all_markers.addTo(self.map);
        
            
        }

    };

    //Opens the popup for the announcements information.
    function openwindow(e) {

        console.log(e);
        console.log("e.target._icon.id" + " " + e.target._icon.id);
        console.log(APP.vue.all_announcements[e.target._icon.id]);

        //there is probably a better way of doing this, also it might not work if theres a odd amount but idk.
        var vuearrayid = (e.target._icon.id - APP.vue.all_announcements.length) * -1;

       APP.announcement_Detail(vuearrayid);
        //APP.announcement_Detail(e.target._icon.id);

    }

    /* This function creates a layer of either urgent,shutdown, or event when the user clicks on a filter option */
    self.create = function(e) {

        var store_marker = L.marker(self.marker.latlng, {icon:self.marker.icon}).addTo(self.map).on('click', openwindow);
        console.log("marker id" + " " + self.marker.id);
        //this isnt adding the correct value to the stored marker and i dont know why.
        store_marker._icon.id = self.marker.id;
        console.log("store_marker icon id " + store_marker._icon.id);
        console.log(store_marker);


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
    
    /* this layer is created when a user enters a search query. They can be of all categories, so switch statement is no good */
    self.create_search_layer = function() {
        var store_marker = L.marker(self.marker.latlng, {icon:self.marker.icon}).addTo(self.map);
        store_marker.addTo(search_layer);
        search_layer.addTo(self.map);
    };

    self.create_users_announcement_layer = function() {
        var store_marker = L.marker(self.marker.latlng, {icon:self.marker.icon}).addTo(self.map);
        store_marker.addTo(users_announcement_layer);
        users_announcement_layer.addTo(self.map);
    };


    self.create_my_announcement_layer = function() {
        var store_marker = L.marker(self.marker.latlng, {icon:self.marker.icon}).addTo(self.map).on('click', openwindow);

        //this isn't doing anything for some reason
        store_marker._icon.id = self.marker.id;

        store_marker.addTo(my_announcement_layer);
        my_announcement_layer.addTo(self.map);
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
        console.log('delete_most_recent');
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

    /* Icons will be toggled according to which function is called */

    self.clear_map = function() {
        self.map.removeLayer(event_marker_layer);
        self.map.removeLayer(shutdown_marker_layer);
        self.map.removeLayer(urgent_marker_layer);
        self.map.removeLayer(all_markers);
        self.map.removeLayer(users_announcement_layer);
        self.map.removeLayer(search_layer);
        start_fresh_layer = new L.FeatureGroup(); //this is needed, since search_layer would just continue to add on itself
        search_layer = start_fresh_layer;
    };

    self.clear_for_all_announcements = function() {
        self.clear_map();
        self.map.addLayer(all_markers);
    };

    self.clear_for_users_announcements = function() {
        self.clear_map();
        self.map.addLayer(users_announcement_layer);
    };

    self.clear_for_urgent = function() {
        self.clear_map();
        self.map.addLayer(urgent_marker_layer);
    };

    self.clear_for_shutdown = function() {
        self.clear_map();
        self.map.addLayer(shutdown_marker_layer);
    };

    self.clear_for_event = function() {
       self.clear_map();
       self.map.addLayer(event_marker_layer);
    };

    self.clear_for_search_announcements = function() {
        self.clear_map(); //clear the map, and the old search layer
        APP.search(); //get a new series of icons which match search query, and update layer
        search_layer.addTo(self.map); //add new layer
    };

    return  self;
};

