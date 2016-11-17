/**
 * Created by Robert on 11/16/2016.
 */

map = L.map('mapid').setView([36.991, -122.060], 15);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click', create_announcement);

L.marker([36.991, -122.060]).addTo(map)
    .bindPopup('This is the center of Campus. <button> Hello </button>');

//This will prompt the user with a modal or something to create a announcement
function create_announcement(e){
    console.log("create_announcement was called");
    var popup = L.popup();

    popup
        .setLatLng(e.latlng)
        .setContent('<a data-toggle="modal" href="#CreatePositionModal" class="btn btn-primary">Create Announcement</a>')
        .openOn(map);


    //create_announcement_submit(e);
}

//this will be called by a button probably
function create_announcement_submit(e){
    console.log("create_annoucement_submit was called");
    create_marker(e);
}

//this will actually create the announcement
function create_marker(e) {
    console.log("createMarker was called");

    //console.log(e.latlng.toString());
    //console.log(e.latlng.lat.toString());
    //console.log(e.latlng.lng.toString());

    lat = e.latlng.lat;
    lng = e.latlng.lng;
    var announcement_title = "The announcement_title";

    L.marker([lat, lng], {
        title: announcement_title,  //when user hovers over marker display title
        riseOnHover: true   //rise to the front when hovered over
    }).addTo(map)
        .bindPopup('The coordinates are: ' + e.latlng);
}

//this re-sizes the window automattically. the 100 and 200 have to change to other variables.
$(window).on("resize", function() {
    $("#mapid").height($(window).height() * 0.87).width($(window).width() * 0.80);
    map.invalidateSize();
}).trigger("resize");