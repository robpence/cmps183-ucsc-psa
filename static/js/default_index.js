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



var app = function() {

    var self = {};

    self.undfined_announcement = null;

    Vue.config.silent = false; // show all warnings
    


    self.set_announcement = function (new_announcemnt){
        self.campus_map.set_circle(
            Announcement(new_announcemnt)
        );
    };

    /*
    self.view_stevenson = function() {
        set_coordinates(stevenson_college);
    }
    */

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
    }


    self.campus_map = New_Map();

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],

        data: {
            logged_in: false,
            isCreatingAnnouncement: false
        },

        methods: {
            change_view:self.change_view,
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