__author__ = 'diesel'



# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_announcement():
    """Here you get a new announcement and add it.  Return what you want."""
    '''
    ann_id = db.Announcements.insert( name=request.vars.name )
    ann = db.post(ann_id)
    '''

    ann_id = db.Announcements.insert(
        name = request.vars.name,
        latitude = request.vars.latitude,
        longitude = request.vars.longitude,
    )
    ann = db.Announcements(ann_id)

    logger.info("ann= %r" % (ann))


    return response.json(dict(announcement=ann))