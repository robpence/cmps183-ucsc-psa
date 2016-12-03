__author__ = 'diesel'

import datetime

def _setup_announcement(a):
    return a

def _setup_comment(c):
    return c


def get_announcements():

    check_announcements_date()

    logger.info("====> api:get_announcements(): request.vars= %r " % request.vars)

    # We just generate a lot of of data.
    anns = []
    #has_more = False

    rows = db(db.Announcements).select(orderby=~db.Announcements.created_on)

    logger.info("====> api:get_announcements(): numrows = %r" % len(rows) )

    for i, r in enumerate(rows):

        a = _setup_announcement(r)
        anns.append(a)
        logger.info("====> api:get_announcements(): a = %r" % a )


    logger.info("====> api:get_announcements(): auth = %r" % auth.user )

    logged_in = auth.user_id is not None
    if auth.user:
        user = auth.user
    else:
        user = False

    #logger.info("====> api:get_announcements(): len-anns = %r" % len(anns) )

    return response.json(dict(
        announcements=anns,
        logged_in=logged_in,
        user=user
        #has_more=has_more,
    ))

#checks the date and deletes it if it older than 3 days i think.
def check_announcements_date():
    announcements = db(db.Announcements).select(orderby=~db.Announcements.created_on)
    for announcement in announcements:
        #if the announcement is an event
        if announcement.category == "event":
            past = datetime.datetime.strptime(announcement.end_date, "%Y-%m-%d")
            present = datetime.datetime.utcnow()
            #if the event is one day over its end date then it will delete.
            if (present - past).days > 1:
                db(db.Announcements.id == announcement.id).delete()
                db.commit()
        else:
            past = datetime.datetime.strptime(announcement.created_on, "%Y-%m-%d %H:%M:%S.%f")
            present = datetime.datetime.utcnow()
            # everything that not a event gets deleted after a day.
            if (present - past).days > 1:
                # calc = (present - past).days
                # print(calc)
                # print("deleted: " + str(announcement))
                db(db.Announcements.id == announcement.id).delete()
                db.commit()

    return 'success'


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
@auth.requires_login()
def add_announcement():
    """Here you get a new announcement and add it.  Return what you want."""
    '''
    ann_id = db.Announcements.insert( name=request.vars.name )
    ann = db.post(ann_id)
    '''

    logger.info("category: %r" % (request.vars.category))

    if request.vars.category not in ['urgent', 'event', "shutdown"]:
        return response.json({})

    else:

        vars = request.vars
        logger.info("vars.end_date: %r" % (vars.end_date))
        ann_id = db.Announcements.insert(
            name = vars.name,
            latitude = vars.latitude,
            longitude = vars.longitude,
            description = vars.description,
            category = vars.category,
            end_date = vars.end_date
        )
        ann = db.Announcements(ann_id)

        logger.info("api:add_announcement ==> ann= %r" % (ann))
        #logger.info("api:add_announcement_category ==> ann= %r" % (ann.category))


        return response.json(ann)

def get_users_announcements():
    if(auth.user != None):
        users_announcements = db(db.Announcements.author == auth.user).select()
        #users_announcements = db(db.Announcements.author == auth.user.email).select()
        return response.json(dict(users_announcements = users_announcements))
    else:
        return response.json(dict(users_announcements = None))

def get_only_urgent():
    urgent_announcements = db(db.Announcements.category == 'urgent').select()
    return response.json(dict(urgent_announcements = urgent_announcements))

def get_only_event():
    event_announcements = db(db.Announcements.category == 'event').select()
    return response.json(dict(event_announcements = event_announcements))

def get_only_shutdown():
    shutdown_announcements = db(db.Announcements.category == 'shutdown').select()
    logger.info("shutdown %r" % shutdown_announcements)
    return response.json(dict(shutdown_announcements = shutdown_announcements))


def get_announcement(p_id, u_email):
    # A announcement is specified.  We need to check that it exists, and that the user is the author.
    # We use .first() to get either the first element or None, rather than an iterator.
    q = ((db.Announcements.author == u_email) &
         (db.Announcements.id == p_id))
    return db(q).select().first()



# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def edit_announcement():
    """Here you get a new announcement and add it.  Return what you want."""
    # Implement me!

    announcement = get_announcement(request.vars.announcement_id, auth.user.email)

    announcement.description = request.vars.description
    announcement.name = request.vars.name
    announcement.updated_on = datetime.datetime.utcnow()
    announcement.update_record()
    return response.json(announcement)


def delete_announcement():

    ann = request.vars.announcement_id
    db(db.Announcements.id == ann).delete()
    logger.info("deleted announcement with id %r" % ann)
    return "ok"

# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
@auth.requires_login()
def add_comment_to_announcement():
    """Here you get a new comment and add it.  Return what you want."""
    vars = request.vars
    logger.info("vars.comment_text: %r" % (vars.comment_text))
    comment_id = db.Comments.insert(
        comment_text = vars.comment_text,
        score = 1,
        ann_id= vars.ann_id,
    )
    comment = db.Announcements(comment_id)

    logger.info("api:add_comment_to_announcement ==> comment= %r" % (comment))

    return response.json(comment)

def get_comments_for_announcements():

    logger.info("====> api:get_comments_for_announcement(): request.vars= %r " % request.vars)

    # We just generate a lot of of data.
    comments = []
    #has_more = False

    rows = db(db.Comments).select(orderby=~db.Comments.ann_id)

    logger.info("====> api:get_comments_for_announcement(): numrows = %r" % len(rows) )

    for i, r in enumerate(rows):

        c = _setup_comment(r)  #I don't know what this does
        comments.append(c)
        logger.info("====> api:get_comments_for_announcement(): a = %r" % c )

    logged_in = auth.user_id is not None
    if auth.user:
        user = auth.user
    else:
        user = False

    return response.json(dict(
        comments=comments,
        logged_in=logged_in,
        user=user
        #has_more=has_more,
    ))

def delete_comment():
    logger.info("deleted comment with id %r" % request.vars.comment_id)
    db(db.Comments.id == request.vars.comment_id).delete()
    logger.info("comment with id: %r" % db(db.Comments.id == request.vars.comment_id))
    db.commit()
    return "ok"

def up_vote_comment():
    comment_id = request.vars.commit_id
    logger.info("comment: %r" % comment_id)
    db(db.Comments.id == request.vars.comment_id).update(score= db.Comments.score + 1)
    return "ok"

def down_vote_comment():
    comment_id = request.vars.commit_id
    logger.info("comment: %r" % comment_id)
    db(db.Comments.id == request.vars.comment_id).update(score=db.Comments.score - 1)
    return "ok"

def edit_comment():
    """Here you get a new announcement and add it.  Return what you want."""
    # Implement me!

    logger.info("vars: %r" % request.vars)
    logger.info("vars_comment_text: %r" % request.vars.comment_text)
    logger.info("vars id: %r" % request.vars.comment_id)
    logger.info("comment_text: %r" % db(db.Comments.id == request.vars.comment_id))

    #comment.comment_text = request.vars.comment_text
    #comment.edited_on = datetime.datetime.utcnow()
    db(db.Comments.id == request.vars.comment_id).update(comment_text=request.vars.comment_text, edited_on=datetime.datetime.utcnow())
    db.commit()
    logger.info("comment_text: %r" % db(db.Comments.id == request.vars.comment_id))
    return "ok"