/**
 * Created by diesel on 11/18/16.
 */



var Announcement_from_db = function (ann){
    console.log('Announcement_from_db');
    var Announcement_Icon = function (){
        var self = {};

        self.drawn = false;
        self.spin = true;
        self.shadowSize= [0, 0];
        self.latlng = {
            'lat': ann.latitude,
            'lng': ann.longitude
        };
        return self;
    };


    var Urgent_Announcement = function(){
        var icon = Announcement_Icon();
        icon.icon ='glyphicon glyphicon-exclamation-sign';
        icon.markerColor = 'orange';
        icon.category = 'urgent';
        return L.AwesomeMarkers.icon(icon);
    };


    var Event_Announcement = function(){
        var icon = Announcement_Icon();
        icon.icon ='glyphicon glyphicon-user';
        icon.markerColor = 'treen';
        icon.category = 'even';
        return icon;
    };


    var Shutdown_Announcement = function(){
        var icon = Announcement_Icon();
        icon.icon ='glyphicon glyphicon-remove';
        icon.markerColor = 'red';
        icon.category = 'shutdown';
        return icon;
    };


    var self = null;

    //console.log('ann.category=', ann.category);

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


    return self;
};


var Announcement = function (announcement_type){

    var Announcement_Icon = function (){
        var self = {};

        self.drawn = false;
        self.spin = true;
        self.shadowSize= [0, 0];
        self.latlng = {
            'lat': null,
            'lng': null
        };
        return self;
    };


    var Urgent_Announcement = function(){
        var icon = Announcement_Icon();
        icon.icon ='glyphicon glyphicon-exclamation-sign';
        icon.markerColor = 'orange';
        icon.category = 'urgent';
        return L.AwesomeMarkers.icon(icon);
    };


    var Event_Announcement = function(){
        var icon = Announcement_Icon();
        icon.icon ='glyphicon glyphicon-user';
        icon.markerColor = 'treen';
        icon.category = 'even';
        return icon;
    };


    var Shutdown_Announcement = function(){
        var icon = Announcement_Icon();
        icon.icon ='glyphicon glyphicon-remove';
        icon.markerColor = 'red';
        icon.category = 'shutdown';
        return icon;
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