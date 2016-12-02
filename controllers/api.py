__author__ = 'diesel'


def _setup_announcement(a):
    return a


def get_announcements():
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
        ann_id = db.Announcements.insert(
            name = vars.name,
            latitude = vars.latitude,
            longitude = vars.longitude,
            description = vars.description,
            category = vars.category
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





