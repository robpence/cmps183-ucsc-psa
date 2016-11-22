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
                    lat: data.latitude,
                    long: data.longitude,
                    };

                    self.vue.coordinates.unshift(coords);

                $.web2py.enableElement($("#add_announcement_submit"));
                //self.vue.posts.unshift(data.post);
                clear_announcement_form();
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

        /*
        self.get_announcements();
        console.log('ans[0]=', self.vue.all_announcements[0])
        var a = self.vue.all_announcements;
        console.log('a.length=', self.vue.all_announcements.length);

        for(var i=0; i < a.length; i++){
            console.log('a[i]=',a);
        }
        */
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

    self.view_announcement = function(coordinates) {
        view_coordinates_of_announcement(coordinates.lat,coordinates.long);
    }

    self.campus_map = New_Map(self.map_click);

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
            coordinates: []
        },

        methods: {
            set_next_announcement: self.set_next_announcement,
            add_announcement: self.add_announcement,
            toggle_add_announcement: self.toggle_add_announcement,
            change_view: self.change_view,
            view_announcement: self.view_announcement
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