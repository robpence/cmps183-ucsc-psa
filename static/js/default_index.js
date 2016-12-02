// This is the js for the default/index.html view.


var _announcement_form = {
    description: null,
    name: null,
    active: false,
    category: null,
    id: null
};

//probably needs changing
var _comment_form = {
    comment_text: null,
    active: false,
    id: null
};


var _filter_form = {
    category: null,
    username: null,
    age: null,
    show:false
};


var _right_side_nav_options = {
    show_history: false,
    create_announcement: false,
    hide_tools: false
};


var app = function() {

    var self = {};



    function clear_announcement_form() {
        self.vue.announcement_form.description = null;
        self.vue.announcement_form.name = null;
        self.vue.announcement_form.active = false;
    }

    function clear_comment_form(){
        self.vue.comment_form.comment_text = null;
        self.vue.comment_form.active = false;
    }


    Vue.config.silent = false; // show all warnings


    self.add_announcement = function () {
        // The submit button to add a post has been pressed.
        $.post(add_announcement_url,
            {
                name: self.vue.announcement_form.name,
                description: self.vue.announcement_form.description,
                end_date: self.vue.announcement_form.end_date,
                latitude: self.next_announcement.lat,
                longitude: self.next_announcement.lng,
                category: self.next_announcement.category
            },
            function (data) {
                $.web2py.enableElement($("#add_announcement_submit"));
                $('#CreateAnnouncementModal').modal('hide');

                self.vue.isCreatingAnnouncement = false;
                self.vue.map_clickable = false;
                console.log(self.vue.map_clickable);
                clear_announcement_form();
                self.campus_map.finalize_marker(data['id']);
                //self.initial_populate_map();
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
                self.campus_map.finalize_marker(ann['id']);
            }
        }
    };


    self.re_populate_map = function(ann_list, requirments){
        if(ann_list == null)
            ann_list = self.vue.all_announcements;
        if (requirments == null)
            requirments = self.vue.filter_form;
        self.campus_map.clear_map();
        self.populate_map(ann_list, requirments);
    };


    /* This function retrieves all of the announcements
        from the server, draws the icons on the map, and
        fills the lists of announcements such as
        vue.users_announcements
     */
    self.initial_populate_map = function (){

        //alert('populating map again');

        $.getJSON(get_announcements_url,
            function (data) {

                self.vue.logged_in = data.logged_in;
                self.this_user = data.user;
                //console.log('callback: populate_map');

                self.vue.all_announcements = data.announcements;
                var a = self.vue.all_announcements;
                for(var i=0; i < a.length; i++){
                    var ann = self.vue.all_announcements[i];

                    // prepare the marker to be drawn
                    self.vue.all_announcements[i] = Announcement_from_db(ann);
                    self.campus_map.set_marker(
                        self.vue.all_announcements[i]
                    );

                    // draw marker
                    self.campus_map.add_marker(self.vue.all_announcements[i]);
                    self.campus_map.finalize_marker(ann['id']);

                    // add marker to appropriate lists
                    if( data.logged_in &&
                        data.user.email == self.vue.all_announcements[i].author){
                        self.vue.users_announcements.push(
                            self.vue.all_announcements[i]
                        );
                    }
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


    self.announcement_Detail = function(index) {
        announcement = self.vue.all_announcements[index];
        //announcement = self.vue.names[index];
        $('#announcementDetailTitle').html(announcement.name);
        $('#announcementDetailDescription').html(announcement.description);
        $('#announcementDetailAuthor').html(announcement.author);
        $('#announcementDetailCreatedon').html(announcement.created_on);
        $('#announcementDetailCategory').html(announcement.category);
        $('#announcementDetailScore').html(announcement.score);

        self.vue.id_to_be_deleted = announcement.id;
        console.log(self.vue.id_to_be_deleted);

        self.vue.get_comments_for_announcements();

        //probably add something to list all the comments for this post here

        $('#AnnouncementModal').modal('show');
    };


    self.campus_map = New_Map(function(lat, lng){
        // this function gets called when the map is clicked
        self.next_announcement.lat = lat;
        self.next_announcement.lng = lng;
        self.vue.announcement_form.active = false;
        return self.vue.isCreatingAnnouncement;
    },
    function(e){
        // this function gets called when a map icon is clicked
        //console.log('iconclick e=', e);

        //console.log('e=', e);
        var m = self.campus_map.find_marker(e.target);

        for(var i=0; i < self.vue.all_announcements.length; i++){
            var ann = self.vue.all_announcements[i];

            if (ann.id == m._ann_id ){
                if(ann.author == self.this_user.email) {
                    self.edit_announcement(ann);
                    self.announcement_Detail(i);
                }
                break;
            }
        }
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



    /* ------------     SEARCH  FUNCTIONS    ----------------------------------------*/
    /*
        search is case sensitive and searches through announcement name, description,
        and author.
     */
    self.execute_search = function() {
        console.log('execute_search');

        var query_str = self.vue.search_content;
        var a = self.vue.all_announcements;

        var found_list = [];
        for(var i=0; i < a.length; i++){
            var ann = a[i];

            if (0 <= ann.description.search(query_str)){
                found_list.push(ann);

            }else if (0 <= ann.name.search(query_str)){
                found_list.push(ann);

            }else if (0 <= ann.author.search(query_str)){
                found_list.push(ann);
            }
        }

        self.re_populate_map(found_list, {category:'all'});

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

        $.post(delete_announcement_url, {
            announcement_id: self.vue.id_to_be_deleted
        }, function() {
            console.log(self.vue.index_to_be_deleted);
            self.vue.all_announcements.splice(self.vue.index_to_be_deleted, 1);
            console.log('delete post request');
            self.populate_after_deleting(self.vue.all_announcements);
            //self.re_populate_map(self.vue.all_announcements, null); //cant seem to re-use this function
        });
    };

 /************************ Can be improved ****************************/
    self.populate_after_deleting = function(marker_list) {

        console.log('populate after deleting');
        console.log('index of marker ' + self.vue.index_to_be_deleted);

        self.campus_map.clear_map();
        //self.campus_map.delete_most_recent();
        //self.campus_map.clear_marker(self.vue.index_to_be_deleted);

        for(var i=0; i < marker_list.length; i++){
                var ann = marker_list[i];
                self.campus_map.set_marker(ann);
                self.campus_map.add_marker(ann);
                //self.vue.announcements_to_show.push(ann);

                //the ann.id might be wrong
                self.campus_map.finalize_marker(ann.id);
          }
    };


    /* ------------    History FUNCTIONS    ----------------------------------------*/
    self.toggle_history_show = function(){
        self.vue.right_nav_options.show_history = !self.vue.right_nav_options.show_history;
    };

    /* ------------     Right Navbar Toggle ------------------------------------*/
    self.toggle_right_navbar_show = function(){
        self.vue.right_nav_options.hide_tools = !self.vue.right_nav_options.hide_tools;

        // we need to re-size the map take up the space previously covered by the
        // right side nav bar
        var w = null;
        if (self.vue.right_nav_options.hide_tools){
            w = 220;
        }else{
            w = 420;
        }
        $("#mapid").height($(window).height() * 1.00).width($(window).width() * 1.0 - w);
    };


    /* ------------     Announcement Edit functions  ----------------------------*/

    self.edit_announcement = function(ann){
        self.vue.announcement_form.description = ann.description;
        self.vue.announcement_form.name = ann.name;
        self.vue.announcement_form.id = ann.id;
        self.vue.edditing_announcemnt = true;
    };


    self.announcement_edit_submit_button = function(){
        // The submit button to edit an announcement has been pressed.
        $.post(edit_announcement_url,
            {
                name: self.vue.announcement_form.name,
                description: self.vue.announcement_form.description,
                announcement_id: self.vue.announcement_form.id
            },
            function (data) {
                clear_announcement_form();
                self.vue.edditing_announcemnt = false;
            });
    };


    self.announcement_edit_cancel_button = function(){
        self.vue.edditing_announcemnt = false;
    };


    /* ------------     Announcement Edit functions  ----------------------------*/
    self.add_comment = function () {
        console.log(self.vue.id_to_be_deleted);
        $.post(add_comment_url,
            {
                comment_text: self.vue.comment_form.comment_text,
                score: self.vue.comment_form.score,
                //id_to_be_deleted is currently set when the user opens the window to view the ann
                ann_id: self.vue.id_to_be_deleted
            },
            function (data) {
                $.web2py.enableElement($("#add_comment_submit"));
                clear_comment_form();
                self.vue.get_comments_for_announcements();
            });
    };

    self.get_comments_for_announcements = function(){
        console.log(self.vue.id_to_be_deleted);
        $.getJSON(get_comments_for_announcements_url,
            function (data) {
                self.vue.announcement_comments = [];
                self.vue.announcement_comments = data.comments;
            });
        console.log(self.vue.announcement_comments);
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],

        data: {
            index_to_be_deleted: null,
            id_to_be_deleted: null,
            id_for_deleted_announcement: null,
            id_for_new_announcement:null,
            logged_in: false,

            edditing_announcemnt: false,
            // this holds the query string that the user enters
            search_content: null,
            isCreatingAnnouncement: false,
            is_history_showing: true,
            announcement_form: _announcement_form,
            comment_form: _comment_form,
            filter_form: _filter_form,
            all_announcements: [],
            users_announcements: [],
            announcements_to_show: [],
            search_announcements: [],
            announcement_comments: [],

            map_clickable: false,
            show_search: false,

            right_nav_options: _right_side_nav_options,

            this_user:null
        },

        methods: {

            /* comment functions*/
            add_comment: self.add_comment,
            //delete_comment: self.delete_comment,
            get_comments_for_announcements: self.get_comments_for_announcements,


            /* announcement edit functions */
            announcement_edit_submit_button: self.announcement_edit_submit_button,
            announcement_edit_cancel_button: self.announcement_edit_cancel_button,

            /* navbar display functions */
            toggle_right_navbar_show: self.toggle_right_navbar_show,

            /* history functions */
            toggle_history_show: self.toggle_history_show,

            /* filter functions */
            toggle_filter_show: self.toggle_filter_show,
            filter_submit_button: self.filter_submit_button,

            /* creating announcement functions */
            cancel_announcement_button: self.cancel_announcement_button,
            set_next_announcement: self.set_next_announcement,
            add_announcement: self.add_announcement,
            create_announcement_button: self.create_announcement_button,

            /* search functions */
            execute_search: self.execute_search,


            change_view: self.change_view,
            view_announcement: self.view_announcement,



            update_marker: self.update_marker,
            re_populate_map: self.re_populate_map,
            initial_populate_map: self.initial_populate_map,
            populate_map: self.populate_map,

            update_history: self.update_history,
            view_announcement_in_history: self.view_announcement_in_history,

            call:self.call,
            announcement_Detail: self.announcement_Detail,
            delete_announcement: self.delete_announcement,
            populate_after_deleting:self.populate_after_deleting,
            new_announcement_Detail:self.new_announcement_Detail,
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