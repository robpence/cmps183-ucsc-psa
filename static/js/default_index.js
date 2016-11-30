// This is the js for the default/index.html view.


var _announcement_form = {
    description: null,
    name: null,
    active: false,
    category: null
};

var app = function() {

    var self = {};


    function clear_announcement_form() {
        self.vue.announcement_form.description = null;
        self.vue.announcement_form.name = null;
        self.vue.announcement_form.active = false;
        self.toggle_add_announcement();
    }


    Vue.config.silent = false; // show all warnings


    self.add_announcement = function () {
        // The submit button to add a post has been pressed.
        console.log("add an announcement=", self.next_announcement);
        // The submit button to add a post has been added.

        /* There is something wrong with this post request!!!!! */

        $.post(add_announcement_url,
            {
                name: self.vue.announcement_form.name,
                description: self.vue.announcement_form.description,
                 latitude: self.next_announcement.lat,
                longitude: self.next_announcement.lng,
                category: self.next_announcement.category
            },
            function (data) {
                    self.vue.names.unshift(data.announcement.name);
                    self.vue.description.unshift(data.announcement.description);
                    self.vue.category.unshift(data.announcement.category);

                    var coords = {
                    lat: data.announcement.latitude,
                    long: data.announcement.longitude,
                    };

                    self.vue.coordinates.unshift(coords);

                    //Allows for history to update automatically
                    //self.update_history();


                $.web2py.enableElement($("#add_announcement_submit"));
                $('#CreateAnnouncementModal').modal('hide');
                self.vue.isCreatingAnnouncement = false;
                clear_announcement_form();
                
                //self.campus_map.finalize_mark();

                //its dumb to have to re populate the entire map after only adding 1 announcement but we can
                //fix that later
                self.vue.initial_populate_map();
                self.vue.map_clickable = false;
            });

    };


    $.getJSON(get_users_announcements_url, function(data) {
        self.vue.users_announcements = data.users_announcements;
    });

    self.populate_map = function(marker_list, requirments){
        for(var i=0; i < marker_list.length; i++){
            var ann = marker_list[i];
            for (req in requirments){

                if (req in ann && ann[req] == requirments[req]){
                    self.campus_map.set_marker(ann);
                    self.campus_map.add_marker(ann);
                    self.vue.announcements_to_show.push(ann);
                    self.campus_map.finalize_marker();
                    break;
                }
            }
        }
    };

    self.re_populate_map = function(){
        self.campus_map.clear_map();
        self.populate_map(self.vue.all_announcements, {
            category: 'urgent'
        });
    };


    self.initial_populate_map = function (){

        $.getJSON(get_announcements_url,
            function (data) {

                self.vue.logged_in = data.logged_in;
                //console.log('callback: populate_map');

                self.vue.all_announcements = data.announcements;
                var a = self.vue.all_announcements;
                for(var i=0; i < a.length; i++){
                    var ann = self.vue.all_announcements[i];
                    self.vue.all_announcements[i] = Announcement_from_db(ann);
                    self.campus_map.set_marker(
                        self.vue.all_announcements[i]
                    );

                    self.campus_map.add_marker(
                        self.vue.all_announcements[i]
                    );
                    self.campus_map.finalize_marker();
                }

            });
    };

    self.map_click = function(lat, lng){
        self.next_announcement.lat = lat;
        self.next_announcement.lng = lng;
        self.toggle_add_announcement();
    };


    /*     Maybe its here???????? */

    self.set_next_announcement = function (new_announcement){

        self.next_announcement = Announcement(new_announcement);
        self.campus_map.set_marker(
            self.next_announcement
        );

        //lets you click on the map after selecting which type of announcement you want to make
        self.vue.map_clickable = true;
       // console.log('next_announcement=', self.next_announcement);
        // show the form
        //self.vue.announcement_form.active = true;

    };

    self.toggle_add_announcement = function (){
        self.vue.announcement_form.active = !self.vue.announcement_form.active;
        self.vue.map_clickable = !self.vue.map_clickable;
    };
    
    self.update_marker = function(cat){
        self.next_announcement = Announcement(cat);
        self.campus_map.update_marker(self.next_announcement);
    };


    self.change_view = function(location) {

    };

    self.view_announcement = function(coordinates) {
        //alert(coordinates.lat);
        self.camputs_map.view_coordinates_of_announcement(
            coordinates.lat,
            coordinates.long
        );
    };

    self.view_announcement_in_history = function(latitude, longitude) {
        view_coordinates_of_announcement(latitude,longitude);
    };

    self.get_users_announcements = function() {

        /* this is the toggle for the history in the sidebar */
         self.vue.show_all_announcements = false;
         self.vue.show_only_urgent = false;
         self.vue.show_users_announcements = true;
         self.vue.show_only_shutdown = false;
         self.vue.show_only_event = false;
         self.vue.show_search = false;

        $.getJSON(get_users_announcements_url, function(data) {

            self.vue.users_announcements = data.users_announcements;
            console.log("leeeel" + JSON.stringify(self.vue.users_announcements));
            self.draw_users_announcements();

        });
    };

    self.draw_users_announcements = function() {

        for(var i=0; i < self.vue.users_announcements.length; i++) {

            var ann = self.vue.users_announcements[i];

            self.vue.users_announcements[i] = Announcement_from_db(ann);

            self.campus_map.set_marker(
                self.vue.users_announcements[i]
            );

            self.campus_map.create_users_announcement_layer(
                self.vue.users_announcements[i]
            );
        }

        self.campus_map.clear_for_users_announcements();

    };

    self.get_urgent_announcements = function() {

         self.vue.show_all_announcements = false;
         self.vue.show_only_urgent = true;
         self.vue.show_users_announcements = false;
         self.vue.show_only_shutdown = false;
         self.vue.show_only_event = false;
         self.vue.show_search = false;


        $.getJSON(get_only_urgent_url, function(data) {
            self.vue.urgent_announcements = data.urgent_announcements;
            self.draw_urgent_announcements();
        });
    };

    self.draw_urgent_announcements = function() {

        for(var i=0; i <  self.vue.urgent_announcements.length; i++) {

            var ann =  self.vue.urgent_announcements[i];

            self.vue.urgent_announcements[i] = Announcement_from_db(ann);

            self.campus_map.set_marker(
                self.vue.urgent_announcements[i]
            );

            //adding to urgent layer
            self.campus_map.create(
                self.vue.urgent_announcements[i]
            );
        }

        self.campus_map.clear_for_urgent();
    };

      self.get_event_announcements = function() {

        self.vue.show_all_announcements = false;
        self.vue.show_only_urgent = false;
        self.vue.show_users_announcements = false;
        self.vue.show_only_shutdown = false;
        self.vue.show_only_event = true;
        self.vue.show_search = false;


        $.getJSON(get_only_event_url, function(data) {
            self.vue.event_announcements = data.event_announcements;
            self.draw_event_announcements();
        });
    };

    self.draw_event_announcements = function() {

        for(var i=0; i <  self.vue.event_announcements.length; i++) {

            var ann =  self.vue.event_announcements[i];

            self.vue.event_announcements[i] = Announcement_from_db(ann);

            self.campus_map.set_marker(
                self.vue.event_announcements[i]
            );

            //adding to event layer
            self.campus_map.create(
                self.vue.event_announcements[i]
            );
        }

        self.campus_map.clear_for_event();
    };

    self.get_shutdown_announcements = function() {

        self.vue.show_all_announcements = false;
        self.vue.show_only_urgent = false;
        self.vue.show_users_announcements = false;
        self.vue.show_only_shutdown = true;
        self.vue.show_only_event = false;
        self.vue.show_search = false;


        $.getJSON(get_only_shutdown_url, function(data) {
        self.vue.shutdown_announcements = data.shutdown_announcements;

        console.log('shutdown: ' + JSON.stringify(self.vue.shutdown_announcements));
        self.draw_shutdown_announcements();
        });

    };

       self.draw_shutdown_announcements = function() {

           for(var i=0; i <  self.vue.shutdown_announcements.length; i++) {


            var ann = self.vue.shutdown_announcements[i];

            console.log('shutdown: ' + JSON.stringify(self.vue.shutdown_announcements[i]));

            self.vue.shutdown_announcements[i] = Announcement_from_db(ann);

            self.campus_map.set_marker(
                self.vue.shutdown_announcements[i]
            );

            //adding to shutdown layer
            self.campus_map.create(
                self.vue.shutdown_announcements[i]
            );
        }

            self.campus_map.clear_for_shutdown();
    };

    self.show_every_announcement = function() {

        self.vue.show_all_announcements = true;
        self.vue.show_only_urgent = false;
        self.vue.show_users_announcements = false;
        self.vue.show_only_shutdown = false;
        self.vue.show_only_event = false;
        self.vue.show_search = false;

        self.campus_map.clear_for_all_announcements();

    };

    self.announcement_Detail = function(index) {
        announcement = self.vue.all_announcements[index];
        //announcement = self.vue.names[index];
        $('#announcementDetailTitle').html(announcement.name);
        $('#announcementDetailDescription').html(announcement.description);
        $('#announcementDetailAuthor').html(announcement.author);
        $('#announcementDetailCreatedon').html(announcement.created_on);
        $('#announcementDetailCategory').html(announcement.category);
        $('#announcementDetailScore').html(announcement.score);

        $('#AnnouncementModal').modal('show');
    };


    self.campus_map = New_Map(function(lat, lng){
        // this function gets called when the map is clicked
        self.next_announcement.lat = lat;
        self.next_announcement.lng = lng;
        self.vue.announcement_form.active = false;
        //return self.vue.isCreatingAnnouncement;
    });


    self.cancel_announcement_button = function (){
        self.campus_map.delete_most_recent();
        self.vue.map_clickable = false;
        console.log(self.vue.map_clickable);
        self.toggle_add_announcement();
        console.log(self.vue.map_clickable);
        clear_announcement_form();
    };


    self.create_announcement_button = function(){
        self.vue.map_clickable = true;
        self.set_next_announcement('default');
    };


    self.search = function() {

        self.vue.show_all_announcements = false;
         self.vue.show_only_urgent = false;
         self.vue.show_users_announcements = false;
         self.vue.show_only_shutdown = false;
         self.vue.show_only_event = false;
         self.vue.show_search = true;

        $.post(get_search_url,
            {
                search_content: self.vue.search_content
            },
            function (data) {
                self.vue.search_announcements = data.search_announcements;
                self.draw_search_announcements();
            });
    };

     self.draw_search_announcements = function() {

         for(var i=0; i <  self.vue.search_announcements.length; i++) {

            var ann = self.vue.search_announcements[i];

             self.vue.search_announcements[i] = Announcement_from_db(ann);

            self.campus_map.set_marker(
                self.vue.search_announcements[i]
            );

            //adding to search layer
            self.campus_map.create_search_layer(
                self.vue.search_announcements[i]
            );
        }

    };

    self.call = function() {
        self.campus_map.clear_for_search_announcements();
    };

    self.hide_history = function() {

        $(".divIDClass").hide();
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],

        data: {
            search_content: null,
            logged_in: false,
            isCreatingAnnouncement: false,
            announcement_form: _announcement_form,
            all_announcements: [],
            announcements_to_show: [],
            names: [],
            description: [],
            category: [],
            coordinates: [],
            users_announcements: [],
            urgent_announcements: [],
            event_announcements: [],
            shutdown_announcements:[],
            search_announcements: [],
            show_all_announcements: true,
            show_users_announcements: false,
            show_only_urgent: false,
            show_only_event: false,
            show_only_shutdown: false,
            map_clickable: false,
            show_search: false,
            call:self.call,
            hide_history: self.hide_history
        },

        methods: {
            cancel_announcement_button: self.cancel_announcement_button,
            set_next_announcement: self.set_next_announcement,
            add_announcement: self.add_announcement,
            toggle_add_announcement: self.toggle_add_announcement,
            change_view: self.change_view,
            view_announcement: self.view_announcement,
            get_users_announcements: self.get_users_announcements,
            create_announcement_button: self.create_announcement_button,
            update_marker: self.update_marker,
            re_populate_map: self.re_populate_map,
            initial_populate_map: self.initial_populate_map,
            populate_map: self.populate_map,
            get_my_announcements: self.get_my_announcements,
            get_urgent_announcements: self.get_urgent_announcements,
            get_shutdown_announcements: self.get_shutdown_announcements,
            get_event_announcements: self.get_event_announcements,
            show_every_announcement: self.show_every_announcement,
            draw_users_announcements: self.draw_users_announcements,
            draw_urgent_announcements: self.draw_urgent_announcements,
            draw_event_announcements: self.draw_event_announcements,
            draw_shutdown_announcements: self.draw_shutdown_announcements,
            update_history: self.update_history,
            view_announcement_in_history: self.view_announcement_in_history,
            search: self.search,
            draw_search_announcements: self.draw_search_announcements,
            announcement_Detail: self.announcement_Detail,
        }

    });

    self.initial_populate_map();

    console.log("map_var:", map_var);
    $("#vue-div").show();
    return self;
};


var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});