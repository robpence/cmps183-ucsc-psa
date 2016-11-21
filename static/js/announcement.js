/**
 * Created by diesel on 11/18/16.
 */


var Announcement_from_db = function (ann){

    var Announcement_Circle = function (){
        var self = {};
        self.radius =  100;
        self.fillOpacity = 0.5;
        self.drawn = false;
        self.color = null;
        self.fillColor = null;
        self.category = null;
        self.latlng = {
            'lat': ann.latitude,
            'lng': ann.longitude
        };
        return self;
    };


    var Urgent_Announcement = function(){
        var circle = Announcement_Circle();
        circle.color = "orange";
        circle.fillColor = "#d67800";
        circle.category = 'urgent';
        return circle;
    };


    var Event_Announcement = function(){
        var circle = Announcement_Circle();
        circle.color = "blue";
        circle.fillColor = "#4466f";
        circle.category = 'event';
        return circle;
    };


    var Shutdown_Announcement = function(){
        var circle = Announcement_Circle();
        circle.color = "red";
        circle.fillColor = "#f03";
        circle.category = 'shutdown';
        return circle;
    };



    var self = null;



    switch (ann.category){
        case "urgent":
            self = Urgent_Announcement();
            break;

        case "event":
            self = Event_Announcement();
            break;

        case "shutdown":
            self = Shutdown_Announcement();
            break;

        default:
            self = Urgent_Announcement();
            break;
    }


    self.me_copy = function(){
        return {
        'radius' : self.radius,
        'fillOpacity': self.fillOpacity,
        'drawn': self.drawn,
        'color': self.color,
        'fillColor': self.fillColor,
        'category': self.category
        };
    };



    return self;
};


var Announcement = function (announcement_type){

    var Announcement_Circle = function (){
        var self = {};
        self.radius =  100;
        self.fillOpacity = 0.5;
        self.drawn = false;
        self.color = null;
        self.fillColor = null;
        self.category = null;
        self.latlng = {
            'lat': null,
            'lng': null
        };
        return self;
    };


    var Urgent_Announcement = function(){
        var circle = Announcement_Circle();
        circle.color = "orange";
        circle.fillColor = "#d67800";
        circle.category = 'urgent';
        return circle;
    };


    var Event_Announcement = function(){
        var circle = Announcement_Circle();
        circle.color = "blue";
        circle.fillColor = "#4466f";
        circle.category = 'event';
        return circle;
    };


    var Shutdown_Announcement = function(){
        var circle = Announcement_Circle();
        circle.color = "red";
        circle.fillColor = "#f03";
        circle.category = 'shutdown';
        return circle;
    };



    var self = null;



    switch (announcement_type){
        case "urgent":
            self = Urgent_Announcement();
            break;

        case "event":
            self = Event_Announcement();
            break;

        case "shutdown":
            self = Shutdown_Announcement();
            break;

        default:
            self = Urgent_Announcement();
            break;
    }


    self.me_copy = function(){
        return {
        'radius' : self.radius,
        'fillOpacity': self.fillOpacity,
        'drawn': self.drawn,
        'color': self.color,
        'fillColor': self.fillColor,
        'category': self.category
        };
    };



    return self;
};