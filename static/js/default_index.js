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
            description: null
};



var app = function() {

    var self = {};

    self.undfined_announcement = null;

    Vue.config.silent = false; // show all warnings
    


    self.set_announcement = function (new_announcemnt){
        self.campus_map.set_circle(
            Announcement(new_announcemnt)
        );
    };


    self.campus_map = New_Map();

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

            show: self.show,
            set_announcement: self.set_announcement

        }

    });

    console.log("map_var:", map_var);

    return self;
};

$("#vue-div").show();
var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});