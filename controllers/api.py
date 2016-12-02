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

        '''
        #if r['category'] == None  :
        if r['category'] not in ['urgent', 'event', "shutdown"]:
            logger.info("====> api:get_announcements(): r=%r" % r)
            db(db.Announcements.id == r['id']).delete()
            continue
        '''

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


def get_search():

    t = request.vars.search_content

    q = ((db.Announcements.name.contains(t)) |
         (db.Announcements.description.contains(t)))

    search_announcements = db(q).select(db.Announcements.ALL)
    logger.info("search %r" % search_announcements)
    return response.json(dict(search_announcements=search_announcements))