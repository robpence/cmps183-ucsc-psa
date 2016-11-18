__author__ = 'diesel'


# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime

def get_user_email():
    return auth.user.email if auth.user else None

db.define_table('Announcements',
                Field('author'),
                Field('description'),
                Field('gps', 'float'),
                Field('category'),
                Field('score', 'integer'),
                Field('solved', 'boolean'),
                Field('edited_on', default=datetime.datetime.utcnow()),
                Field('created_on', default=datetime.datetime.utcnow()),
                )


# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)