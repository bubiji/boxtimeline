import sqlite3

import config

conn = sqlite3.connect(config.data + '/data.db')

def with_sqlite():
    def warp(f):
        def _run(*args, **kwargs):
            with conn:
                cur = conn.cursor()
                ret = f(cur, *args, **kwargs)
                cur.close()
                return ret
        return _run
    return warp

@with_sqlite()
def create_tables(cur):
    cur.execute('''CREATE TABLE IF NOT EXISTS triples (item text, field text, value text, PRIMARY KEY (item, field, value))''')

@with_sqlite()
def save_triple(cur, item, field, value):
    cur.execute('''INSERT INTO triples (item, field, value) VALUES (?, ?, ?)''', (item, field, value, ))

@with_sqlite()
def get_triples(cur):
    cur.execute('''SELECT * FROM triples''')
    retval = []
    while True:
        data = cur.fetchone()
        if not data:
            break
        retval.append(data)

    return retval

@with_sqlite()
def get_triples_by_item(cur, item):
    cur.execute('''SELECT * FROM triples WHERE item = ?''', (item, ))
    retval = []
    while True:
        data = cur.fetchone()
        if not data:
            break
        retval.append(data)

    return retval

@with_sqlite()
def remove_triple(cur, item, field, value):
    cur.execute('''DELETE FROM triples WHERE item = ? AND field = ? AND value = ?''', (item, field, value, ))
