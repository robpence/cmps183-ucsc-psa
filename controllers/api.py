__author__ = 'diesel'


def _setup_announcement(a):
    return a


def get_announcements():
    logger.info("====> api:get_announcements(): request.vars= %r " % request.vars)

    # We just generate a lot of of data.
    anns = []
    #has_more = False

    rows = db(db.Announcements).select()

    logger.info("====> api:get_announcements(): numrows = %r" % len(rows) )

    for i, r in enumerate(rows):

        a = _setup_announcement(r)
        anns.append(a)
        logger.info("====> api:get_announcements(): a = %r" % a )


    #logged_in = auth.user_id is not None
    logger.info("====> api:get_announcements(): len-anns = %r" % len(anns) )

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
    vars = request.vars
    ann_id = db.Announcements.insert(
        name = vars.name,
        latitude = vars.latitude,
        longitude = vars.longitude,
        description = vars.description,
        category = vars.category
    )
    ann = db.Announcements(ann_id)

    logger.info("ann= %r" % (ann))


    return response.json(dict(announcement=ann))
