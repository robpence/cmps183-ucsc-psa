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
                //console.log(data.posts[0]);
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
                //console.log(data.posts[0]);
                self.vue.all_announcements = data.announcements;
                self.vue.has_more = data.has_more;
                self.vue.logged_in = data.logged_in;
                console.log('anns.length=', self.vue.all_announcements.length);
                console.log('data=', data);

                var a = self.vue.all_announcements;
                console.log('a[0]=',a[0]);
                for(var i=0; i < a.length; i++){
                    var ann = self.vue.all_announcements[i];
                    self.vue.all_announcements[i] = Announcement_from_db(ann);
                    self.campus_map.set_circle(
                        self.vue.all_announcements[i]
                    );
                    self.campus_map.draw_circle(
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


    self.set_next_announcement = function (new_announcemnt){
        self.next_announcement = Announcement(new_announcemnt);
        self.campus_map.set_circle(
            self.next_announcement.me_copy()
        );
        console.log('next_announcement=', self.next_announcement);
        // show the form
        //self.vue.announcement_form.active = true;

    };

    self.toggle_add_announcement = function (){
        self.vue.announcement_form.active = !self.vue.announcement_form.active;
    };


    self.campus_map = New_Map(self.map_click);

    self.my_announcements = function(){
        $.getJSON(my_announcements_url, function(data){
            self.vue.users_announcements = data.announcements;
             alert(self.vue.users_announcements);
        });

        self.vue.view_my_announcements = true;

    };

    self.toggle_my_announcements = function(){

        self.vue.view_my_announcements = false;


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
            all_announcements: [],
            users_announcements: [],
            view_my_announcements: false,
        },

        methods: {
            set_next_announcement: self.set_next_announcement,
            add_announcement: self.add_announcement,
            toggle_add_announcement: self.toggle_add_announcement,
            my_announcements: self.my_announcements,
            toggle_my_announcements:self.toggle_my_announcements
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