/**
 * Created by diesel on 11/18/16.
 */




var Announcement = function (announcement_type){

    //console.log("Announcement: ann_type = ", announcement_type);


    var Marker = function (){
        return {
            spin: true,
            shadowSize: [0, 0],
            //alt: self.id
        };
    };

    var Urgent_Marker = function(){
        var m = Marker();
        m.icon ='glyphicon glyphicon-exclamation-sign';
        m.markerColor = 'orange';
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
        m.markerColor = 'red';
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
                console.log('new Announcement: unrecognized category=',
                            category);
                return  Urgent_Marker();
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
    //alert(ann.category);
    var ann_marker = Announcement(ann.category);
    ann_marker.set_latlng(ann.latitude, ann.longitude);
    ann.latlng = ann_marker.latlng;
    ann.icon = ann_marker.icon;
    return ann;
};
