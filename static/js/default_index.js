// This is the js for the default/index.html view.


var _announcement_form = {
    description: null,
    name: null,
    active: false
};

var app = function() {

    var self = {};


    function clear_announcement_form() {
        self.vue.announcement_form.description = null;
        self.vue.announcement_form.name = null;
        self.toggle_add_announcement();
    }


    Vue.config.silent = false; // show all warnings
    /*
    self.get_announcements = function() {
        $.getJSON(get_announcements_url,
            function (data) {
                console.log(data.posts[0]);
                self.vue.all_announcements = data.announcements;
                console.log(self.vue.all_announcements);
                self.vue.has_more = data.has_more;
                self.vue.logged_in = data.logged_in;
                console.log('anns.length=', self.vue.all_announcements.length);
                console.log('data=', data);
        })
    };
    */

    self.add_announcement = function () {
        // The submit button to add a post has been pressed.
        console.log("add an announcement=", self.next_announcement);
        console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");

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
                    self.update_history();


                $.web2py.enableElement($("#add_announcement_submit"));
                clear_announcement_form();
                self.vue.map_clickable = false;
                $('#CreateAnnouncementModal').modal('hide');
            });

    };

    /*
    history sidebar will be updated upon submission of any event regardless of what filter
   */
    self.update_history = function() {

         $.getJSON(get_my_announcements_url, function(data) {
             self.vue.my_announcements = data.my_announcements;
         });

         $.getJSON(get_only_urgent_url, function(data) {
            self.vue.urgent_announcements = data.urgent_announcements;
        });

        $.getJSON(get_only_event_url, function(data) {
           self.vue.event_announcements = data.event_announcements;
        });

        $.getJSON(get_only_shutdown_url, function(data) {
        self.vue.shutdown_announcements = data.shutdown_announcements;
        });
    };


    self.populate_map = function (){

        $.getJSON(get_announcements_url,
            function (data) {
                //console.log('callback: populate_map');
                self.vue.all_announcements = data.announcements;
                /*
                console.log('anns.length=', self.vue.all_announcements.length);
                console.log('data=', data);
                */
                var a = self.vue.all_announcements;
                //console.log('a[0]=',a[0]);

                for(var i=0; i < a.length; i++){

                    var ann = self.vue.all_announcements[i];

                    /* Used for the history bar */

                    self.vue.names.push(ann.name);
                    self.vue.description.push(ann.description);
                    self.vue.category.push(ann.category);

                    var coords = {
                    lat: ann.latitude,
                    long: ann.longitude,
                    active: false
                    };

                    self.vue.coordinates.push(coords);

                    str = JSON.stringify(ann);

                    console.log('ann' + str);

                    /* something funny is happening here, is data being lost? */

                    self.vue.all_announcements[i] = Announcement_from_db(ann);

                    str = JSON.stringify(self.vue.all_announcements[i]);

                    console.log('self.vue.all_announcements[i]' + str);

                    console.log(self.vue.all_announcements[i]);
                    self.campus_map.set_marker(
                        self.vue.all_announcements[i]
                    );

                    self.campus_map.add_marker(
                        self.vue.all_announcements[i]
                    );
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


    self.change_view = function(location) {

        switch (location) {
            case "kresge":
                set_coordinates(kresge_college);
                break;
            case "merrill":
                set_coordinates(merrill_college);
                break;
            case "rachael_carson":
                set_coordinates(college_8);
                break;
            case "oakes":
                set_coordinates(oakes_college);
                break;
            case "college_9":
                set_coordinates(college_9);
                break;
            case "college_10":
                set_coordinates(college_10);
                break;
            case "crown":
                set_coordinates(crown_college);
                break;
            case "porter":
                set_coordinates(porter_college);
                break;
            case "cowell":
                set_coordinates(cowell_college);
                break;

            case "stevenson":
                set_coordinates(stevenson_college);
                break;
            default:
                set_coordinates(kresge_college);
                break;
        }
    };

    self.view_announcement = function(coordinates) {
        view_coordinates_of_announcement(coordinates.lat,coordinates.long);
    };

    self.view_announcement_in_history = function(latitude, longitude) {
        view_coordinates_of_announcement(latitude,longitude);
    };

    self.get_my_announcements = function() {

        /* this is the toggle for the history in the sidebar */
         self.vue.show_all_announcements = false;
         self.vue.show_only_urgent = false;
         self.vue.show_my_announcements = true;
         self.vue.show_only_shutdown = false;
         self.vue.show_only_event = false;

        $.getJSON(get_my_announcements_url, function(data) {

            self.vue.my_announcements = data.my_announcements;
            console.log("leeeel" + JSON.stringify(self.vue.my_announcements));
            self.draw_my_announcements();

        });
    };

    self.draw_my_announcements = function() {

        for(var i=0; i < self.vue.my_announcements.length; i++) {

            var ann = self.vue.my_announcements[i];

            self.vue.my_announcements[i] = Announcement_from_db(ann);

            self.campus_map.set_marker(
                self.vue.my_announcements[i]
            );

            self.campus_map.create_my_announcement_layer(
                self.vue.my_announcements[i]
            );
        }

        self.campus_map.clear_for_my_announcements();

    };

    self.get_urgent_announcements = function() {

         self.vue.show_all_announcements = false;
         self.vue.show_only_urgent = true;
         self.vue.show_my_announcements = false;
         self.vue.show_only_shutdown = false;
         self.vue.show_only_event = false;


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
        self.vue.show_my_announcements = false;
        self.vue.show_only_shutdown = false;
        self.vue.show_only_event = true;


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
        self.vue.show_my_announcements = false;
        self.vue.show_only_shutdown = true;
        self.vue.show_only_event = false;


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
        self.vue.show_my_announcements = false;
        self.vue.show_only_shutdown = false;
        self.vue.show_only_event = false;

        self.campus_map.clear_for_all_announcements();
    };

    self.announcement_Detail = function(index) {
        announcement = self.vue.all_announcements[index];
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
        self.toggle_add_announcement();
    });

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],

        data: {
            logged_in: false,
            isCreatingAnnouncement: false,
            announcement_form: _announcement_form,
            all_announcements: [],
            names: [],
            description: [],
            category: [],
            coordinates: [],
            my_announcements: [],
            urgent_announcements: [],
            event_announcements: [],
            shutdown_announcements:[],
            show_all_announcements: true,
            show_my_announcements: false,
            show_only_urgent: false,
            show_only_event: false,
            show_only_shutdown: false,
            map_clickable: false
        },

        methods: {
            set_next_announcement: self.set_next_announcement,
            add_announcement: self.add_announcement,
            toggle_add_announcement: self.toggle_add_announcement,
            change_view: self.change_view,
            view_announcement: self.view_announcement,
            get_my_announcements: self.get_my_announcements,
            get_urgent_announcements: self.get_urgent_announcements,
            get_shutdown_announcements: self.get_shutdown_announcements,
            get_event_announcements: self.get_event_announcements,
            show_every_announcement: self.show_every_announcement,
            draw_my_announcements: self.draw_my_announcements,
            draw_urgent_announcements: self.draw_urgent_announcements,
            draw_event_announcements: self.draw_event_announcements,
            draw_shutdown_announcements: self.draw_shutdown_announcements,
            update_history: self.update_history,
            view_announcement_in_history: self.view_announcement_in_history,
            announcement_Detail: self.announcement_Detail,
        }

    });

    self.populate_map();

    console.log("map_var:", map_var);
    $("#vue-div").show();
    return self;
};


var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});