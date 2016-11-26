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


    #logged_in = auth.user_id is not None
    #logger.info("====> api:get_announcements(): len-anns = %r" % len(anns) )

    return response.json(dict(
        announcements=anns,
        #logged_in=logged_in,
        #has_more=has_more,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_announcement():
    """Here you get a new announcement and add it.  Return what you want."""
    '''
    ann_id = db.Announcements.insert( name=request.vars.name )
    ann = db.post(ann_id)
    '''

    logger.info("category: %r" % (request.vars.category))
    vars = request.vars
    ann_id = db.Announcements.insert(
        name = vars.name,
        latitude = vars.latitude,
        longitude = vars.longitude,
        description = vars.description,
        category = vars.category
    )
    ann = db.Announcements(ann_id)

    #logger.info("api:add_announcement ==> ann= %r" % (ann))
    #logger.info("api:add_announcement_category ==> ann= %r" % (ann.category))


    return response.json(dict(announcement=ann))

def get_users_announcements():
    users_announcements = db(db.Announcements.author == auth.user.email).select()
    return response.json(dict(users_announcements = users_announcements))

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

def get_search():

    t = request.vars.search_content

    q = ((db.Announcements.name.contains(t)) |
         (db.Announcements.description.contains(t)))

    search_announcements = db(q).select(db.Announcements.ALL)
    logger.info("search %r" % search_announcements)
    return response.json(dict(search_announcements=search_announcements))