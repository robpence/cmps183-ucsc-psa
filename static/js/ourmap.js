/**
 * Created by diesel on 11/11/16.
 */


var map_var = "hello from ourmap.js!";
var central_campus = [36.9999, -122.060];
var kresge_college = [36.999207, -122.064339];
var stevenson_college = [36.997498, -122.055061];
var crown_college = [36.999008, -122.055176];
var merrill_college = [36.999944, -122.053345];
var cowell_college = [36.999677, -122.054740];
var college_9 = [37.001969, -122.057908];
var college_10 = [37.001575, -122.058938];
var porter_college = [36.994357, -122.065471];
var oakes_college = [36.989364, -122.063981];
var rachel_carson = [36.991788, -122.064764];
var bounds = [
            //south west
            [37.007606, -122.037206],
            //north east
            [36.971819, -122.081151]];



var New_Map = function (onMapClick, onIconClick) {


    var map = L.map('mapid', {
        maxZoom: 18,
        minZoom: 14,
        maxBounds: bounds
    }).setView(central_campus, 16);


    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //this re-sizes the window automattically. Just change the numbers after height and width.
    //If you want to reserve part of the screen for a menu, like the vertical menu we have on the left,
    //You have to change the padding in the css file.
    /*$(window).on("resize", function() {
        $("#mapid").height($(window).height() * 1.00).width($(window).width() * 1.00 - 420);
        //New_Map.map.invalidateSize();
    }).trigger("resize");
    */

    var self = {};
    self.map = map;
    self.next_marker = null;
    self.most_recent = null;
    self.all_markers = [];


   /* These layers are toggled to filter the display of icons */
    var search_layer = new L.FeatureGroup();

    /*on-click view of div showing announcement */
    view_coordinates_of_announcement = function(lat, long) {
        self.map.setView([lat,long], 22, {animation: true});
    };


    self.change_map_view = function(location){
        switch (location) {
            case "kresge":
                self.set_coordinates(kresge_college);
                break;
            case "merrill":
                self.set_coordinates(merrill_college);
                break;
            case "rachel_carson":
                self.set_coordinates(rachel_carson);
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
                self.map.setView(central_campus, 15, {animation: true});
                break;
        }
    };

    self.set_coordinates = function(coordinates){
        self.map.setView(coordinates, 22, {animation: true});
    };

    self.set_next_marker = function(marker){
        self.next_marker = marker;
    };


    self.update_most_recent = function(new_marker){

        console.log('update_most_recent, most_recent=', self.most_recent);

        self.set_next_marker(new_marker);
        if(self.most_recent != null) {
            self.next_marker.latlng = self.most_recent.latlng;
            self.delete_most_recent();
            self.draw_marker(self.next_marker.latlng, new_marker.icon);
        }

    };


    self.draw_marker = function (location, icon) {
        // create a marker to be drawn on the map

        self.most_recent = new L.marker(
            location,
            {icon: icon}
        ).on('click', onIconClick);
        self.most_recent.addTo(self.map);

        self.most_recent.latlng = self.most_recent._latlng;
        if(self.next_marker) self.next_marker.drawn = true;
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
    
    self.find_marker = function (target){
        for(var i = 0; i < self.all_markers.length; i++){
            var m = self.all_markers[i];
            if(m._leaflet_id == target._leaflet_id){
                return m;
            }
        }
        // could not find marker
        console.log('ourmap.find_marker: could not find target');
        return null;
    };


    self.delete_marker = function(target){
         for(var i = 0; i < self.all_markers.length; i++){
            var m = self.all_markers[i];
            if(m._leaflet_id == target._leaflet_id){
                self.map.removeLayer(m);
                self.all_markers.splice(i, 1);
            }
        }
        // could not find marker
        console.log('ourmap.delete_marker: could not find target');
        return null;
    };


    self.clear_map = function(){
        for(var i = 0; i < self.all_markers.length; i++){
            self.map.removeLayer(self.all_markers[i]);
        }
    };

    self.clear_marker = function(index) {
        self.map.removeLayer(self.all_markers[index]);

    };


    self.finalize_marker = function(id){
        self.most_recent._ann_id = id;
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
        if(onMapClick(e.latlng.lat, e.latlng.lng, e) &&
            !self.next_marker.drawn){
            self.draw_marker(e.latlng, self.next_marker.icon);

            //APP.toggle_announcement_form();
            //$('#CreateAnnouncementModal').modal('show');
        }
    });


    self.map.on('drag', function() {
        self.map.panInsideBounds(bounds, { animate: false });
    });


    return  self;
};

