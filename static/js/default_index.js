// This is the js for the default/index.html view.


var _announcement_form = {
    description: null,
    name: null,
    active: false,
    category: null
};


var _filter_form = {
    category: null,
    username: null,
    age: null,
    show:false
};


var app = function() {

    var self = {};



    function clear_announcement_form() {
        self.vue.announcement_form.description = null;
        self.vue.announcement_form.name = null;
        self.vue.announcement_form.active = false;
    }


    Vue.config.silent = false; // show all warnings


    self.add_announcement = function () {
        // The submit button to add a post has been pressed.
        $.post(add_announcement_url,
            {
                name: self.vue.announcement_form.name,
                description: self.vue.announcement_form.description,
                 latitude: self.next_announcement.lat,
                longitude: self.next_announcement.lng,
                category: self.next_announcement.category
            },
            function (data) {
                //self.vue.names.unshift(data.announcement.name);
                //self.vue.description.unshift(data.announcement.description);
                //self.vue.category.unshift(data.announcement.category);
                $.web2py.enableElement($("#add_announcement_submit"));
                $('#CreateAnnouncementModal').modal('hide');

                //need to update front-end all_announcements somehow

                self.vue.isCreatingAnnouncement = false;
                clear_announcement_form();
                self.campus_map.finalize_marker();
                self.vue.map_clickable = false;
            });

    };

    /*
    $.getJSON(get_users_announcements_url, function(data) {
        self.vue.users_announcements = data.users_announcements;
    });
    */

    self.populate_map = function(marker_list, requirments){

        for(var i=0; i < marker_list.length; i++){
            var ann = marker_list[i];


            if (ann.category == requirments.category || requirments.category == 'all'){
                self.campus_map.set_marker(ann);
                self.campus_map.add_marker(ann);
                self.vue.announcements_to_show.push(ann);
                self.campus_map.finalize_marker();
            }
        }
    };


    self.re_populate_map = function(){
        self.campus_map.clear_map();
        self.populate_map(
            self.vue.all_announcements,
            self.vue.filter_form);
    };


    self.initial_populate_map = function (){

        //alert('populating map again');

        $.getJSON(get_announcements_url,
            function (data) {

                self.vue.logged_in = data.logged_in;
                //console.log('callback: populate_map');

                self.vue.all_announcements = data.announcements;
                var a = self.vue.all_announcements;
                for(var i=0; i < a.length; i++){
                    var ann = self.vue.all_announcements[i];
                    self.vue.all_announcements[i] = Announcement_from_db(ann);

                    self.campus_map.set_marker(
                        self.vue.all_announcements[i]
                    );

                    self.campus_map.add_marker(
                        self.vue.all_announcements[i]
                    );
                    self.campus_map.finalize_marker();
                }

            });
    };



    self.set_next_announcement = function (new_announcement){
        self.next_announcement = Announcement(new_announcement);
        self.campus_map.set_marker(
            self.next_announcement
        );

        //lets you click on the map after selecting which type of announcement you want to make
        self.vue.map_clickable = true;
    };


    self.update_marker = function(cat){
        self.next_announcement = Announcement(cat);
        self.campus_map.update_marker(self.next_announcement);
    };


    self.change_view = function(location) {

    };


    self.view_announcement = function(coordinates) {
        //alert(coordinates.lat);
        self.camputs_map.view_coordinates_of_announcement(
            coordinates.lat,
            coordinates.long
        );
    };


    self.view_announcement_in_history = function(latitude, longitude) {
        view_coordinates_of_announcement(latitude,longitude);
    };


     /************************ Can be improved ****************************/
    self.announcement_Detail = function(ann_id) {

        //Announcements are queried in order of their id (refer to API.py)

        //lets find the corresponding icon in the list
        for (var i = 0; i < self.vue.all_announcements.length; i++)
        {
            if (ann_id == self.vue.all_announcements[i].id) {

                //alert('id number for ' + i + ' th element:' + self.vue.all_announcements[i].id);
                var announcement = self.vue.all_announcements[i];
                self.vue.id_for_deleted_announcement = announcement.id;
                self.vue.index_to_be_deleted = i;
                break;
            }
        }

        //var announcement = self.vue.all_announcements[index];
        $('#announcementDetailTitle').html(announcement.name);
        $('#announcementDetailDescription').html(announcement.description);
        $('#announcementDetailAuthor').html(announcement.author);
        $('#announcementDetailCreatedon').html(announcement.created_on);
        $('#announcementDetailCategory').html(announcement.category);
        $('#announcementDetailScore').html(announcement.score);

        $('#AnnouncementModal').modal('show');
    };


    self.campus_map = New_Map(function(lat, lng){
        // this function gets called when the map is clicked
        self.next_announcement.lat = lat;
        self.next_announcement.lng = lng;
        self.vue.announcement_form.active = false;
        return self.vue.isCreatingAnnouncement;
    });


    self.cancel_announcement_button = function (){
        self.campus_map.delete_most_recent();
        self.vue.map_clickable = false;
        self.vue.isCreatingAnnouncement = false;
        clear_announcement_form();
    };


    self.create_announcement_button = function(){
        self.vue.map_clickable = true;
        self.set_next_announcement('default');
    };


    self.search = function() {

         self.vue.show_search = true;

        $.post(get_search_url,
            {
                search_content: self.vue.search_content
            },
            function (data) {
                self.vue.search_announcements = data.search_announcements;
                self.draw_search_announcements();
            });
    };

     self.draw_search_announcements = function() {

         for(var i=0; i <  self.vue.search_announcements.length; i++) {
            var ann = self.vue.search_announcements[i];
             self.vue.search_announcements[i] = Announcement_from_db(ann);

            self.campus_map.set_marker(
                self.vue.search_announcements[i]
            );

            //adding to search layer
            self.campus_map.create_search_layer(
                self.vue.search_announcements[i]
            );
        }
    };

    self.hide_history = function() {

        $(".divIDClass").hide();
         if (self.vue.is_history_showing == true) {
             self.vue.is_history_showing = !self.vue.is_history_showing;
             console.log(self.vue.is_history_showing);
             $("#history").hide();
         }
         else{
             self.vue.is_history_showing = !self.vue.is_history_showing;
             console.log(self.vue.is_history_showing);
             $("#history").show();
         }
    };

    self.call = function() {
        self.campus_map.clear_for_search_announcements();
    };


    self.toggle_filter_show = function(){
        self.vue.filter_form.show = !self.vue.filter_form.show;
    };


    self.filter_submit_button = function(){
        self.re_populate_map();
    };

 /************************ Can be improved ****************************/
    self.delete_announcement = function() {

        $.post(delete_announcement_url, {announcement_id: self.vue.id_for_deleted_announcement}, function() {

            //alert('deleted!');
            self.vue.all_announcements.splice(self.vue.index_to_be_deleted, 1);
            self.populate_after_deleting(self.vue.all_announcements);
            //self.re_populate_map(self.vue.all_announcements, null); //cant seem to re-use this function
        });
    };

 /************************ Can be improved ****************************/
    self.populate_after_deleting = function(marker_list) {

          self.campus_map.clear_map();

          for(var i=0; i < marker_list.length; i++){

                var ann = marker_list[i];
                self.campus_map.set_marker(ann);
                self.campus_map.add_marker(ann);
                self.vue.announcements_to_show.push(ann);
                self.campus_map.finalize_marker();
          }
    };


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],

        data: {
            index_to_be_deleted: null,
            id_for_deleted_announcement: null,
            logged_in: false,
            search_content: null,
            isCreatingAnnouncement: false,
            show_users_announcements: true,
            is_history_showing: true,
            announcement_form: _announcement_form,
            filter_form: _filter_form,
            all_announcements: [],
            users_announcements: [],
            announcements_to_show: [],
            search_announcements: [],
            map_clickable: false,
            show_search: false
        },

        methods: {
            toggle_filter_show: self.toggle_filter_show,
            cancel_announcement_button: self.cancel_announcement_button,
            filter_submit_button: self.filter_submit_button,


            set_next_announcement: self.set_next_announcement,
            add_announcement: self.add_announcement,
            change_view: self.change_view,
            view_announcement: self.view_announcement,
            hide_history: self.hide_history,

            create_announcement_button: self.create_announcement_button,
            update_marker: self.update_marker,
            re_populate_map: self.re_populate_map,
            initial_populate_map: self.initial_populate_map,
            populate_map: self.populate_map,

            update_history: self.update_history,
            view_announcement_in_history: self.view_announcement_in_history,
            search: self.search,
            call:self.call,
            draw_search_announcements: self.draw_search_announcements,
            announcement_Detail: self.announcement_Detail,

            delete_announcement: self.delete_announcement,
            populate_after_deleting:self.populate_after_deleting,
        }

    });

    self.initial_populate_map();

    console.log("map_var:", map_var);
    $("#vue-div").show();
    return self;
};


var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});