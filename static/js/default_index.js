// This is the js for the default/index.html view.


var Announcement_Circle = function (){
    var self = {};
    self.radius =  100;
    self.fillOpacity = 0.5;
    self.color = null;
    self.fillColor = null;
    return self;
};


var Urgent_Announcement = function(){
    var circle = Announcement_Circle();
    circle.color = "orange";
    circle.fillColor = "#d67800";
    return circle;
};


var Event_Announcement = function(){
    var circle = Announcement_Circle();
    circle.color = "blue";
    circle.fillColor = "#4466f";
    return circle;
};


var Shut_Down_Announcement = function(){
    var circle = Announcement_Circle();
    circle.color = "red";
    circle.fillColor = "#f03";
    return circle;
};



var Announcement = function (announcement_type){
    var self = null;

    switch (announcement_type){
        case "urgent":
            self = Urgent_Announcement();
            break;

        case "event":
            self = Event_Announcement();
            break;

        case "shut_down":
            self = Shut_Down_Announcement();
            break;

        default:
            self = Urgent_Announcement();
            break;
    }


    return self;
};



var _announcement_form = {
    description: null,
    name: null,
    active: false
};



var app = function() {

    var self = {};

    self.undfined_announcement = null;

    function clear_announcement_form (){
        self.vue.announcement_form.description = null;
        self.vue.announcement_form.description = null;
        self.toggle_add_announcement();
    }


    Vue.config.silent = false; // show all warnings
    


    self.add_announcement = function () {
        // The submit button to add a post has been pressed.
        console.log("add an announcement");


        // The submit button to add a post has been added.
        console.log('map=', self.campus_map.location);
        $.post(add_announcement_url,
            {
                name: self.vue.announcement_form.name,
                latitude: self.campus_map.lat,
                longitude: self.campus_map.lng
            },
            function (data) {
                //$.web2py.enableElement($("#add_announcement_submit"));
                //self.vue.posts.unshift(data.post);
                clear_announcement_form();
            });

    };


    self.map_click = function(){
        self.toggle_add_announcement();
    };


    self.set_announcement = function (new_announcemnt){
        self.campus_map.set_circle(
            Announcement(new_announcemnt)
        );
        // show the form
        //self.vue.announcement_form.active = true;

    };

    self.toggle_add_announcement = function (){
        self.vue.announcement_form.active = !self.vue.announcement_form.active;
    };


    self.campus_map = New_Map(self.map_click);

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],

        data: {
            logged_in: false,
            isCreatingAnnouncement: false,
            announcement_form: _announcement_form
        },

        methods: {

            urgent_cursor: self.urgent_cursor,
            set_announcement: self.set_announcement,
            add_announcement: self.add_announcement,
            toggle_add_announcement: self.toggle_add_announcement
        }

    });

    console.log("map_var:", map_var);
    $("#vue-div").show();
    return self;
};


var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});