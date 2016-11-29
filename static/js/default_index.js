// This is the js for the default/index.html view.


var _announcement_form = {
    description: null,
    name: null,
    active: false,
    category: null
};

var _filter_form = {
    category: null,
    username: null,
    age: null,
    show:false
};

var app = function() {

    var self = {};


    function clear_announcement_form() {
        self.vue.announcement_form.description = null;
        self.vue.announcement_form.name = null;
        self.vue.announcement_form.active = false;
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

                $.web2py.enableElement($("#add_announcement_submit"));
                self.vue.isCreatingAnnouncement = false;
                clear_announcement_form();
                self.campus_map.finalize_marker();
            });

    };


    self.populate_map = function(marker_list, requirments){

        console.log('requrments=', requirments);

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
        self.populate_map(
            self.vue.all_announcements,
            self.vue.filter_form);
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



    /*     Maybe its here???????? */
    self.set_next_announcement = function (new_announcement){
        self.next_announcement = Announcement(new_announcement);
        self.campus_map.set_marker(
            self.next_announcement
        );
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

    self.get_my_announcements = function() {

         self.vue.show_all_announcements = false;
         self.vue.show_only_urgent = false;
         self.vue.show_my_announcements = true;
         self.vue.show_only_shutdown = false;
         self.vue.show_only_event = false;

        $.getJSON(get_my_announcements_url, function(data) {

            self.vue.my_announcements = data.my_announcements;

        });
    };

    self.get_urgent_announcements = function() {

         self.vue.show_all_announcements = false;
         self.vue.show_only_urgent = true;
         self.vue.show_my_announcements = false;
         self.vue.show_only_shutdown = false;
         self.vue.show_only_event = false;


        $.getJSON(get_only_urgent_url, function(data) {

            self.vue.urgent_announcements = data.urgent_announcements;
        });
    };

      self.get_event_announcements = function() {

        self.vue.show_all_announcements = false;
        self.vue.show_only_urgent = false;
        self.vue.show_my_announcements = false;
        self.vue.show_only_shutdown = false;
        self.vue.show_only_event = true;


        $.getJSON(get_only_event_url, function(data) {
            self.vue.event_announcements = data.event_announcements;
        });
    };

    self.get_shutdown_announcements = function() {

        self.vue.show_all_announcements = false;
        self.vue.show_only_urgent = false;
        self.vue.show_my_announcements = false;
        self.vue.show_only_shutdown = true;
        self.vue.show_only_event = false;


        $.getJSON(get_only_shutdown_url, function(data) {
        self.vue.shutdown_announcements = data.shutdown_announcements;
        });
    };


    self.show_every_announcement = function() {

        self.vue.show_all_announcements = true;
        self.vue.show_only_urgent = false;
        self.vue.show_my_announcements = false;
        self.vue.show_only_shutdown = false;
        self.vue.show_only_event = false;
    };


    self.campus_map = New_Map(function(lat, lng){
        // this function gets called when the map is clicked
        self.next_announcement.lat = lat;
        self.next_announcement.lng = lng;
        self.vue.announcement_form.active = false;
        return self.vue.isCreatingAnnouncement;
    });


    self.cancel_announcement_button = function (){
        self.campus_map.delete_most_recent();
        self.vue.isCreatingAnnouncement = false;
        clear_announcement_form();
    };


    self.create_announcement_button = function(){
        self.vue.isCreatingAnnouncement = true;
        self.set_next_announcement('default');
    };


    self.toggle_filter_show = function(){
        self.vue.filter_form.show = !self.vue.filter_form.show;
    };


    self.filter_submit_button = function(){
        self.re_populate_map();
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],

        data: {
            logged_in: false,
            isCreatingAnnouncement: false,
            announcement_form: _announcement_form,
            filter_form: _filter_form,

            all_announcements: [],
            announcements_to_show: [],



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
        },



        methods: {
            toggle_filter_show: self.toggle_filter_show,
            cancel_announcement_button: self.cancel_announcement_button,
            set_next_announcement: self.set_next_announcement,
            add_announcement: self.add_announcement,
            change_view: self.change_view,
            view_announcement: self.view_announcement,
            create_announcement_button: self.create_announcement_button,
            update_marker: self.update_marker,
            re_populate_map: self.re_populate_map,
            filter_submit_button: self.filter_submit_button,


            get_my_announcements: self.get_my_announcements,
            get_urgent_announcements: self.get_urgent_announcements,
            get_shutdown_announcements: self.get_shutdown_announcements,
            get_event_announcements: self.get_event_announcements,
            show_every_announcement: self.show_every_announcement
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