/**
 * Created by diesel on 11/18/16.
 */


var Categories = ['urgent', 'event', "shutdown"];

var Announcement = function (announcement_type){

    //console.log("Announcement: ann_type = ", announcement_type);

    var Marker = function (){
        return {
            spin: false,
            shadowSize: [0, 0],
            //alt: self.id
        };
    };

    var default_marker = function(){
        var m = Marker();
        return L.AwesomeMarkers.icon(m);
    };

    //marker colors, red, darkred, blue, orange, green, purple, cadetblue?
    var Urgent_Marker = function(){
        var m = Marker();
        m.icon ='glyphicon glyphicon-exclamation-sign';
        m.markerColor = 'blue';
        return L.AwesomeMarkers.icon(m);
    };


    var Event_Marker = function(){
        var m = Marker();
        m.icon ='glyphicon glyphicon-user';
        m.markerColor = 'green';
        return L.AwesomeMarkers.icon(m);
    };


    var Shutdown_Marker = function(){
        var m = Marker();
        m.icon ='glyphicon glyphicon-remove';
        m.markerColor = 'darkred';
        return L.AwesomeMarkers.icon(m);
    };


    function new_marker(category){

        switch (category){
            case "urgent":
                return  Urgent_Marker();
                break;

            case "event":
                return  Event_Marker();
                break;

            case "shutdown":
                return  Shutdown_Marker();
                break;

            default:
                return  default_marker();
                break;
        }
    }


    var self = {
        id: null,
        author: null,
        drawn: false,
        category: announcement_type,
        name: null,
        description: null,
        created_on: null,
        latlng: null,
        set_latlng: null,
        score: 1,
        icon: new_marker(announcement_type)
    };

    self.set_latlng = function(lat, lng){
        if (self.latlng == null)
            self.latlng = {};
        self.latlng.lat = lat;
        self.latlng.lng = lng;
    };

    return self;
};


var Announcement_from_db = function (ann){
    //console.log('Announcement_from_db', ann);
    var ann_marker = Announcement(ann.category);
    ann_marker.set_latlng(ann.latitude, ann.longitude);
    ann.latlng = ann_marker.latlng;
    ann.icon = ann_marker.icon;
    return ann;
};
