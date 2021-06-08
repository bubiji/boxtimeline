from sanic import Sanic
from sanic.response import json, raw, file

from app.nlp import translate_NL2LF, parse_query, load_mappings
from sanic_cors import CORS
from app import db

from data.preprocess import transform_entity2json
from data.insert import begin_insert_job
from config import data as path
import os

import re

import asyncio

import json as jsonLib

lock = asyncio.Lock()

app = Sanic()

CORS(app)

def do_query(query):
    lf_question = translate_NL2LF(query)
    answer, msg, query_type = parse_query(lf_question)
    if query_type == 5 and isinstance(answer, list):
        word = lf_question.split(':')[1]
        out = []
        for ans in answer:
            q = query.replace(word, ans[1])
            lf_qu = translate_NL2LF(q)
            if lf_qu == ans[1]:
                continue

            parts = re.split("：|:|<|>|<=|>=", lf_qu)
            if len(parts) > 2:
                continue

            if 'AND' in lf_qu or 'OR' in lf_qu:
                continue

            ret = parse_query(lf_qu)

            if ret[1] == 'done' and ret[2] == 3:
                query_type = 6
                out.append({'subj': ans[1], 'result': ret[0]})

        if query_type == 6:
            answer = out

    return answer, msg, query_type

app.static('/', './web/build')

@app.route('/')
@app.route('/chat')
@app.route('/import')
@app.route('/export')
def index(request):
    return file('./web/build/index.html')

@app.post('/api/search')
def do_search(request):
    question = request.form.get('question')
    answer, msg, query_type = do_query(question)

    return json({'answer': answer, 'msg': msg, 'query_type': query_type})

@app.route('/api/triples', methods=['POST', 'DELETE', 'OPTIONS'])
async def save_triple(request):
    if (request.method == 'OPTIONS'):
        return json({'result': 'ok'})

    item = request.form.get('item')
    field = request.form.get('field')
    value = request.form.get('value')
    if not item:
        return json({'err': 'item is required.'})
    if not field:
        return json({'err': 'field is required.'})
    if not value:
        return json({'err': 'value is required.'})

    try:
        if request.method == 'POST':
            db.save_triple(item, field, value)
        if request.method == 'DELETE':
            db.remove_triple(item, field, value)
        async with lock:
            reload_triples(item)
        return json({'result': 'ok'})
    except Exception as e:
        return json({'err': str(e)})

@app.post('/api/import_triples/')
async def import_triples(request):
    data = jsonLib.loads(str(request.body, 'utf-8', errors='ignore'))
    items = []
    for item in data['source']:
        item.pop('id', None) # remove field id
        subj = item.pop(data['subj'], None)
        if subj not in items:
            items.append(subj)
        if subj:
            for k,v in item.items():
                try:
                    db.save_triple(subj, k, v)
                except:
                    pass
    async with lock:
        for item in items:
            try:
                reload_triples(item)
            except Exception as e:
                print(e)
    return json({'result': 'ok'})

@app.get('/api/export_triples/')
async def export_triples(request):
    triples = db.get_triples()
    data = {}
    for triple in triples:
        if triple[0] not in data:
            data[triple[0]] = {}
            data[triple[0]]['subj'] = triple[0]
        data[triple[0]][triple[1]] = triple[2]
    return json(list(data.values()))


def to_triple_file(item, output = 'output.nq'):
    triples = db.get_triples_by_item(item)
    with open(output, 'w') as f:
        for triple in triples:
            f.write('{}$${}$${}\n'.format(*triple))

def reload_triples(item):
    to_triple_file(item, os.path.join(path, 'data.nq'))

    transform_entity2json(os.path.join(path, "data.nq"))
    begin_insert_job(os.path.join(path, "data.json"))

    load_mappings()

if __name__ == '__main__':
    load_mappings()
    db.create_tables()
    app.run(host='0.0.0.0', port=8000)
