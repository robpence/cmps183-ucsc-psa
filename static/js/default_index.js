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


var _left_side_nav_options = {
    show_ann_detail: false
};


var app = function() {

    var self = {
        edit_this_marker: null,
        next_announcement: {}
    };



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
        self.toggle_announcement_form();

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
                //$('#CreateAnnouncementModal').modal('hide');


                var added_announcement = Announcement_from_db(data);
                self.vue.isCreatingAnnouncement = false;
                clear_announcement_form();
                self.campus_map.finalize_marker(added_announcement['id']);
                self.vue.all_announcements.unshift(added_announcement);
                self.vue.announcements_to_show.unshift(added_announcement);


                console.log('add_annoucement, added_ann=', added_announcement);

                //self.vue.users_announcements.push(added_announcement);

                self.vue.users_announcements.unshift(added_announcement);

                self.vue.map_clickable = false;
            });

    };


    self.populate_map = function(marker_list, requirments){

        for(var i=0; i < marker_list.length; i++){
            var ann = marker_list[i];


            if (ann.category == requirments.category || requirments.category == 'all'){
                self.campus_map.draw_marker(ann.latlng, ann.icon);
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
        self.vue.announcements_to_show = ann_list;

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

                    // prepare the marker to be drawn
                    var ann = self.vue.all_announcements[i];
                    ann =  Announcement_from_db(ann);
                    self.vue.all_announcements[i] = ann;

                    // draw marker
                    self.campus_map.draw_marker(ann.latlng, ann.icon);
                    self.vue.announcements_to_show.push(ann);
                    self.campus_map.finalize_marker(ann['id']);

                    // add marker to appropriate lists
                    if( data.logged_in &&
                        data.user.email == ann.author){
                        self.vue.users_announcements.push(ann);
                    }
                }

            });
    };



    self.set_next_announcement = function (new_announcement){
        self.next_announcement = Announcement(new_announcement);
        self.campus_map.set_next_marker(
            self.next_announcement
        );

        //lets you click on the map after selecting which type of announcement you want to make
        self.vue.map_clickable = true;
    };


    self.update_marker = function(cat){
        self.next_announcement = Announcement(cat);
        self.campus_map.update_most_recent(self.next_announcement);
    };


    self.change_view = function(location) {
       self.campus_map.change_map_view(location);
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


    //this isn't called anymore, it was for the modal
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

        //$('#AnnouncementModal').modal('show');
    };
    /********************************************************************************
     *                      CAMPUS MAP
     ********************************************************************************/


    self.visit_announcement = function(marker, visit){
        for(var i=0; i < self.vue.all_announcements.length; i++){
            var ann = self.vue.all_announcements[i];

            if (ann.id == marker._ann_id ){
                if(ann.author == self.this_user.email) {
                    visit(ann);
                }
                break;
            }

        }
    };



    self.campus_map = New_Map(function(lat, lng, e){
        // this function gets called when the map is clicked
        self.next_announcement.lat = lat;
        self.next_announcement.lng = lng;
        return self.vue.map_clickable;
    },
    function(e){
        // this function gets called when a map icon is clicked
        //console.log('iconclick e=', e);

        //console.log('e=', e);
        var m = self.campus_map.find_marker(e.target);
        self.edit_this_marker = e;
        self.visit_announcement(m, self.edit_announcement);

    });

    /********************************************************************************/

    self.cancel_announcement_button = function (){
        self.campus_map.delete_most_recent();
        self.vue.map_clickable = false;
        self.vue.isCreatingAnnouncement = false;
        clear_announcement_form();
        self.vue.is_creating_announcement = false;
        //self.vue.toggle_announcement_form;

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

        var query_str = self.vue.search_content.toLowerCase();
        var a = self.vue.all_announcements;

        var found_list = [];
        for(var i=0; i < a.length; i++){
            var ann = a[i];

            if (0 <= ann.description.toLowerCase().search(query_str)){
                found_list.push(ann);

            }else if (0 <= ann.name.toLowerCase().search(query_str)){
                found_list.push(ann);

            }else if (0 <= ann.author.toLowerCase().search(query_str)){
                found_list.push(ann);
            }
        }

        self.re_populate_map(found_list, {category:'all'});

    };


    self.toggle_filter_show = function(){
        self.vue.filter_form.show = !self.vue.filter_form.show;
    };


    self.filter_submit_button = function(){
        self.re_populate_map();
    };


 /************************ Can be improved ****************************/
    self.delete_announcement = function() {

        $.post(delete_announcement_url,
            {
                announcement_id: self.vue.id_for_deleted_announcement
            }, function() {
                self.vue.all_announcements.splice(self.vue.index_to_be_deleted, 1);
                console.log('delete post request');
                self.populate_after_deleting(self.vue.all_announcements);
                //self.re_populate_map(self.vue.all_announcements, null);

                var m = self.campus_map.find_marker(e.target);

                // remove from all_announcements
                for(var i=0; i < self.vue.all_announcements.length; i++){
                    var ann = self.vue.all_announcements[i];
                    if (ann.id == m._ann_id ){
                        self.vue.all_announcements.splice(i, 1);
                        break;
                    }
                }

                // remove from user_announcements
                for(var i=0; i < self.vue.users_announcements.length; i++){
                    var ann = self.vue.users_announcements[i];
                    if (ann.id == m._ann_id ){
                        self.vue.users_announcements.splice(i, 1);
                        break;
                    }
                }

                // remove from campus map

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
                self.campus_map.draw_marker(ann.latlng, ann.icon);
                //self.vue.announcements_to_show.push(ann);
                self.campus_map.finalize_marker();
          }
    };


    /************************ Can be improved ****************************/
    self.announcement_Detail = function(ann_id) {
        //Announcements are queried in order of their id (refer to API.py)
        //lets find the corresponding icon in the list
        for (var i = 0; i < self.vue.all_announcements.length; i++) {
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

        //$('#AnnouncementModal').modal('show');
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

        $("#mapid").width($(window).width() * 1.0 - w);
    };


    /* ------------     Announcement Edit functions  ----------------------------*/

    self.edit_announcement = function(ann){
        self.vue.announcement_form.description = ann.description;
        self.vue.announcement_form.name = ann.name;
        self.vue.announcement_form.id = ann.id;
        self.vue.editing_announcement = true;
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
                self.vue.editing_announcement = false;
            });
    };


    self.announcement_edit_cancel_button = function(){
        self.vue.editing_announcement = false;
        clear_announcement_form();
    };


    self.announcement_edit_delete_button = function(ann_id){
        $.post(delete_announcement_url,
            {
                announcement_id: ann_id
            }, function() {

                console.log('delete post request');
                var m = self.campus_map.find_marker(self.edit_this_marker.target);

                // remove from all_announcements
                for(var i=0; i < self.vue.all_announcements.length; i++){
                    var ann = self.vue.all_announcements[i];
                    if (ann.id == m._ann_id ){
                        self.vue.all_announcements.splice(i, 1);
                        break;
                    }
                }

                // remove from user_announcements
                for(var i=0; i < self.vue.users_announcements.length; i++){
                    var ann = self.vue.users_announcements[i];
                    if (ann.id == m._ann_id ){
                        self.vue.users_announcements.splice(i, 1);
                        break;
                    }
                }

                // remove from campus map
                self.campus_map.delete_marker(m);
                self.edit_this_marker = null;

                clear_announcement_form();
                self.vue.editing_announcement = false;
        });
    };


    self.show_announcement_details = function(ann){
        console.log('show_announcement_details, ann=', ann);
        self.vue.left_nav_options.show_ann_detail = true;
        self.vue.show_this_announcement = ann;
        self.campus_map.set_coordinates(ann.latlng);
        self.vue.id_to_be_deleted = ann.id;
        console.log(self.vue.id_to_be_deleted);
        self.vue.get_comments_for_announcements();
    };


    self.close_announcement_details = function(){
        self.vue.left_nav_options.show_ann_detail = false;
    };


    self.minimize_announcement = function(ann){
        console.log('enter minimize_announcement');
        self.vue.left_nav_options.show_ann_detail = false;
        self.vue.minimized_announcements.push(ann);
        console.log('end minimize_announcement');
    };

    self.close_minimized_announcement = function(target){
         console.log("close_minimized_announcements");
         // remove from all_announcements

        for(var i=0; i < self.vue.minimized_announcements.length; i++){
            var ann = self.vue.minimized_announcements[i];
            if (ann.id == target.id ){
                self.vue.minimized_announcements.splice(i, 1);
                break;
            }
        }

        console.log("close_minimized_announcements, mini_anns=",self.vue.minimized_announcements);

    };


    self.restore_minimized_announcement = function(ann){
        console.log("resotore_minimized_announcements");
        self.close_minimized_announcement(ann);
        self.vue.left_nav_options.show_ann_detail = true;
        self.vue.show_this_announcement = ann;
    };

    /* onclick history function to view the icon */
    self.view_history_announcement = function(coordinates) {
        self.campus_map.set_coordinates(coordinates);
    };


    /* ------------     Comment functions  ----------------------------*/
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

    self.delete_comment = function(comment_idx){
      console.log("delete_comment_called");
        $.post(delete_comment_url,
            { comment_id: self.vue.announcement_comments[comment_idx].id },
            function () {
                self.vue.get_comments_for_announcements();
                console.log(comment_idx)
            }
        )
    };

    self.up_vote_comment = function(comment_idx){
        console.log("up_vote_comment_called");
            $.post(up_vote_comment_url,
                { comment_id: self.vue.announcement_comments[comment_idx].id },
                function () {
                    self.vue.get_comments_for_announcements();
                    console.log(comment_idx)
                }
            );
    };

    self.down_vote_comment = function(comment_idx){
        console.log("down_vote_comment_called");
            $.post(down_vote_comment_url,
                { comment_id: self.vue.announcement_comments[comment_idx].id },
                function () {
                    self.vue.get_comments_for_announcements();
                    console.log(comment_idx)
                }
            );
    };

    self.edit_comment = function(comment_idx){
        self.vue.comment_form.comment_text = self.vue.announcement_comments[comment_idx].comment_text;
        self.vue.comment_form.id = self.vue.announcement_comments[comment_idx].id;
        self.vue.editing_comment_id = self.vue.announcement_comments[comment_idx].id;
        console.log(self.vue.editing_comment_id);
        self.vue.editing_comment = true;
        console.log("edit comment called");
    };

    self.comment_edit_submit_button = function(){
        // The submit button to edit an announcement has been pressed.
        console.log("edit submit button called");
        $.post(edit_comment_url,
            {
                comment_text: self.vue.comment_form.comment_text,
                comment_id:  self.vue.editing_comment_id
            },
            function (data) {
                clear_comment_form();
                self.vue.editing_comment = false;
                //this can probably be changed to get comments for a specific announcement but oh well.
                self.vue.get_comments_for_announcements();
            });
    };


    self.comment_edit_cancel_button = function(){
        self.vue.editing_comment = false;
    };

    self.toggle_announcement_form = function() {
        self.vue.is_creating_announcement = !self.vue.is_creating_announcement;
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],

        data: {
            show_this_announcement: null,

            editing_comment_id: null,
            index_to_be_deleted: null,
            id_to_be_deleted: null,
            id_for_deleted_announcement: null,
            id_for_new_announcement:null,
            logged_in: false,
            is_creating_announcement: false,

            editing_announcement: false,
            editing_comment: false,
            // this holds the query string that the user enters
            search_content: null,
            isCreatingAnnouncement: false,
            is_history_showing: null,
            announcement_form: _announcement_form,
            comment_form: _comment_form,
            filter_form: _filter_form,
            all_announcements: [],
            users_announcements: [],
            announcements_to_show: [],
            search_announcements: [],
            announcement_comments: [],
            minimized_announcements: [],

            map_clickable: false,
            show_search: false,

            right_nav_options: _right_side_nav_options,
            left_nav_options: _left_side_nav_options,

            this_user:null
        },

        methods: {

            /* comment functions*/
            add_comment: self.add_comment,
            delete_comment: self.delete_comment,
            get_comments_for_announcements: self.get_comments_for_announcements,
            up_vote_comment: self.up_vote_comment,
            down_vote_comment: self.down_vote_comment,
            edit_comment: self.edit_comment,
            comment_edit_submit_button: self.comment_edit_submit_button,
            comment_edit_cancel_button: self.comment_edit_cancel_button,


            /* left side announcement display functions */
            show_announcement_details: self.show_announcement_details,
            close_announcement_details: self.close_announcement_details,
            minimize_announcement: self.minimize_announcement,
            restore_minimized_announcement: self.restore_minimized_announcement,
            close_minimized_announcement: self.close_minimized_announcement,

            toggle_announcement_form: self.toggle_announcement_form,

            /* announcement edit functions */
            announcement_edit_submit_button: self.announcement_edit_submit_button,
            announcement_edit_cancel_button: self.announcement_edit_cancel_button,
            announcement_edit_delete_button: self.announcement_edit_delete_button,

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
            view_history_announcement: self.view_history_announcement,



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

document.getElementById('box-for-urgent').style.backgroundColor = "rgb(" + 167 + "," + 201 + "," + 240 + ")"; //blueish
document.getElementById('box-for-shutdown').style.backgroundColor = "rgb(" + 253 + "," + 114 + "," + 123 + ")"; //redish
document.getElementById('box-for-event').style.backgroundColor = "rgb(" + 135 + "," + 225 + "," + 141 + ")"; //greenish

document.getElementById('urgent-box-2').style.backgroundColor = "rgb(" + 167 + "," + 201 + "," + 240 + ")"; //blueish
document.getElementById('shutdown-box-2').style.backgroundColor = "rgb(" + 253 + "," + 114 + "," + 123 + ")"; //redish
document.getElementById('event-box-2').style.backgroundColor = "rgb(" + 135 + "," + 225 + "," + 141 + ")"; //greenish

document.getElementById('urgent-box-3').style.backgroundColor = "rgb(" + 167 + "," + 201 + "," + 240 + ")"; //blueish
document.getElementById('shutdown-box-3').style.backgroundColor = "rgb(" + 253 + "," + 114 + "," + 123 + ")"; //redish
document.getElementById('event-box-3').style.backgroundColor = "rgb(" + 135 + "," + 225 + "," + 141 + ")"; //greenish

document.getElementById('his-for-urgent').style.backgroundColor = "rgb(" + 167 + "," + 201 + "," + 240 + ")"; //blueish
document.getElementById('his-for-shutdown').style.backgroundColor = "rgb(" + 253 + "," + 114 + "," + 123 + ")"; //redish
document.getElementById('his-for-event').style.backgroundColor = "rgb(" + 135 + "," + 225 + "," + 141 + ")"; //greenish

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});