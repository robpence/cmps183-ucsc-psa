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
    
    self.get_announcements = function() {
        $.getJSON(get_announcements_url,
            function (data) {
                console.log(data.posts[0]);
                self.vue.all_announcements = data.announcements;
                self.vue.has_more = data.has_more;
                self.vue.logged_in = data.logged_in;
                console.log('anns.length=', self.vue.all_announcements.length);
                console.log('data=', data);
        })
    };

    self.add_announcement = function () {
        // The submit button to add a post has been pressed.
        console.log("add an announcement=", self.next_announcement);

        // The submit button to add a post has been added.
        $.post(add_announcement_url,
            {
                name: self.vue.announcement_form.name,
                description: self.vue.announcement_form.description,
                 latitude: self.next_announcement.lat,
                longitude: self.next_announcement.lng,
                category: self.next_announcement.category
            },
            function (data) {
                $.web2py.enableElement($("#add_announcement_submit"));
                //self.vue.posts.unshift(data.post);
                clear_announcement_form();
            });

    };


    self.populate_map = function (){
        $.getJSON(get_announcements_url,
            function (data) {
                console.log('callback: populate_map');
                self.vue.all_announcements = data.announcements;
                self.vue.has_more = data.has_more;
                self.vue.logged_in = data.logged_in;
                //console.log('anns.length=', self.vue.all_announcements.length);
                //console.log('data=', data);

                var a = self.vue.all_announcements;
                //console.log('a[0]=',a[0]);
                for(var i=0; i < a.length; i++){
                    var ann = self.vue.all_announcements[i];

                    self.vue.all_announcements[i] = Announcement_from_db(ann);

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


    self.set_next_announcement = function (new_announcemnt){
        self.next_announcement = Announcement(new_announcemnt);
        self.campus_map.set_marker(
            self.next_announcement
        );
        console.log('next_announcement=', self.next_announcement);
        // show the form
        //self.vue.announcement_form.active = true;

    };

    self.toggle_add_announcement = function (){
        self.vue.announcement_form.active = !self.vue.announcement_form.active;
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
            all_announcements: []
        },

        methods: {
            urgent_cursor: self.urgent_cursor,
            set_next_announcement: self.set_next_announcement,
            add_announcement: self.add_announcement,
            toggle_add_announcement: self.toggle_add_announcement,
            change_view: self.change_view
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