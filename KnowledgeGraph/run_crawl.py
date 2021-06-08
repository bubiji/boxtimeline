import subprocess
import requests
import json
from urllib.parse import urlparse
import os
import re

from config import data as path

from data.preprocess import transform_entity2json
from data.insert import begin_insert_job, delete_index

from app import db

DOWNLOAD_PATH=path + '/downloads'

github = 'github.com'

# fossy_username = 'fossy'
# fossy_password = 'fossy'

# re_upload_pk = re.compile("UploadPk is: '(\d+)'")

def parse_line(line):
    # github.com/opentelecoms-org/jsmpp,2.3.4,05832NPW
    if line.startswith(github):
        line = line[len(github) + 1:]
        line = line.split(',')
        return {'repo': line[0], 'version': line[1], 'spec_code': line[2]}

    return None

def api(uri):
    retval = 'https://api.github.com/repos/{}'.format(uri)
    print(retval)
    return retval

def get_repo(uri):
    rsp = requests.get(api(uri), headers={'Authorization': 'token ec609b2b723e8c4914b71e9a9f609afa4bbf21b0'})
    return rsp.json()

def get_tags(uri):
    return get_repo(uri + '/tags')

def check_branch(uri, branch):
    branch = get_repo('{}/branches/{}'.format(uri, branch))
    if branch.get('message'):
        return False
    return True

def check_commit(uri, commit):
    commit = get_repo('{}/commits/{}'.format(uri, commit))
    if commit.get('message'):
        return False
    return True

repo_keys = ['homepage', 'language', 'license.name', 'description', 'default_branch']

def get_meta(meta, keys):
    # print("get_meta starting:%s"%(meta))

    retval = {}
    for key in keys:
        ks = key.split('.')
        v = meta.get(ks[0])
        for k in ks[1:]:
            if v:
                v = v.get(k)

        retval[ks[0]] = v

    return retval

def get_tag_meta(repo, tag_name = None, info={'default_branch': 'master'}):

    meta = get_tags(repo)
    print("get_tag_meta starting:%s"%(meta))

    if len(meta) > 0:
        if not tag_name:
            tag_name = meta[0]['name']

        retval = {}
        for m in meta:
            if not m.get('name'):
                continue
            print(m['name'])
            if m['name'].find(tag_name) > -1:
                retval['tag_name'] = m['name']
                retval['download_url'] = m['tarball_url']

                break

        if retval.get('tag_name'):
            return retval

    def gen_retval(name):
        return {
            'tag_name': name,
            'download_url': 'https://api.github.com/repos/{}/tarball/{}'.format(repo, name)
        }

    if check_commit(repo, tag_name):
        return gen_retval(tag_name)

    if check_branch(repo, tag_name):
        return gen_retval(tag_name)

    return gen_retval(info['default_branch'])


def get_file_name(url):
    print("get_file_name starting:%s"%(url))

    p = urlparse(url)
    fn = p.path.replace('/', '_')
    if fn.find('tarball') > -1:
        fn += '.tar.gz'

    return fn

def download(url, fn):
    print("download starting:%s"%(url))
    rsp = requests.get(url)
    with open(fn, 'wb') as f:
        f.write(rsp.content)

def cloc(url):
    print("cloc starting:%s"%(url))
    fn = '{}/{}'.format(DOWNLOAD_PATH, get_file_name(url))
    download(url, fn)
    out = call(['cloc', '--json', fn])
    retval = json.loads(out)
    retval.pop('header', None)
    sum = retval.pop('SUM')
    v0 = 0
    lang = ''
    for k, v in retval.items():
        if v['code'] > v0:
            v0 = v['code']
            lang = k

    return {
        'main_language': lang,
        'code': sum['code']
    }

def call(args):
    r = subprocess.run(args, stdout=subprocess.PIPE)

    return str(r.stdout, 'utf-8', errors='ignore')

# def cp2foss(fn):
#     m = re_upload_pk.search(call(['cp2foss', '--username', fossy_username, '--password', fossy_password, fn]))
#     if not m:
#         return None
#     return m.group(1)
#
# def parse_fo_result(out):
#     values = {}
#     for line in out.split('\n'):
#         line = line.split(':')
#
#         if len(line) == 1:
#             continue
#
#         value = line[1].strip()
#
#
#         if value == 'No_license_found':
#             continue
#
#         if not value:
#             continue
#
#         if values.get(value):
#             values[value] += 1
#         else:
#             values[value] = 1
#
#     values = sorted(values.items(), key=lambda x: x[1], reverse=True)[:3]
#
#     return ';'.join([l[0] for l in values])
#
# def fo_nomos_license_list(pk):
#     out = call(['fo_nomos_license_list', '--username', fossy_username,
#         '--password', fossy_password, '-u', pk])
#
#     return parse_fo_result(out)
#
# def fo_copyright_list(pk):
#     out = call(['fo_copyright_list', '--user', fossy_username,
#         '--password', fossy_password, '-u', pk])
#
#     return parse_fo_result(out)

# def fossy(url):
#     print("fossy starting:%s"%(url))
#     fn = '{}/{}'.format(DOWNLOAD_PATH, get_file_name(url))
#     download(url, fn)
#     pk = cp2foss(fn)
#
#     if not pk:
#         return {'fossy_licenses': '', 'fossy_copyrights': ''}
#
#     licenses = ''
#     copyrights = ''
#
#     for _ in range(10):
#         try:
#             licenses = fo_nomos_license_list(pk)
#             if licenses.find('Fossology') == -1:
#                 break
#         except Exception as e:
#             print(e)
#         licenses = ''
#
#     for _ in range(10):
#         try:
#             copyrights = fo_copyright_list(pk)
#             if copyrights.find('Fossology') == -1:
#                 break
#         except Exception as e:
#             print(e)
#
#         copyrights = ''
#
#     return {
#         'fossy_licenses': licenses,
#         'fossy_copyrights': copyrights
#     }

def save_json(data, output = 'output.json'):
    with open(output, 'w') as f:
        json.dump(data, f)

def load_data(fn):
    with open(fn, 'r') as f:
        return json.load(f)

def save_triple_to_db(data):
    triple = []
    for item in data:
        repo = item.pop('repo', None)
        if not repo:
            continue

        name = repo.split('/')[1]

        item['repo'] = 'http://github.com/{}'.format(repo)

        for key, value in item.items():
            if not value:
                continue
            try:
                db.save_triple(name, key, value)
            except Exception as e:
                pass

def to_triple_file(output = 'output.nq'):
    triples = db.get_triples()
    with open(output, 'w') as f:
        for triple in triples:
            f.write('{}$${}$${}\n'.format(*triple))

def save_triple(data, output = 'output.nq'):
    triple = []
    for item in data:
        repo = item.pop('repo', None)
        if not repo:
            continue

        name = repo.split('/')[1]

        triple.append('{}$$repo$$http://github.com/{}'.format(name, repo))

        for key, value in item.items():
            if not value:
                continue
            line = '{}$${}$${}'.format(name, key, value)
            if line not in triple:
                triple.append(line)

    with open(output, 'w') as f:
        f.write('\n'.join(triple))

def crawl(fn):
    print("crawl starting")
    os.makedirs(DOWNLOAD_PATH, exist_ok=True)
    repos = []
    with open(fn, 'r') as f:
        for line in f.readlines():
            line = line.strip()
            line = parse_line(line)
            if line:
                repos.append(line)


    data = []
    for repo in repos:
        try:
            info = get_meta(get_repo(repo['repo']), repo_keys)
            ver = None
            if len(repo) > 1:
                ver = repo['version']

            tag = get_tag_meta(repo['repo'], ver, info)

            info.update(repo)
            info.update(get_tag_meta(repo['repo'], ver, info))
            info.update(cloc(info['download_url']))
            # info.update(fossy(info['download_url']))

            data.append(info)
            # print(json.dumps(info, indent=2))
        except Exception as e:
            # raise e
            print(e)

    return data

def main(script, fn = None):
    print("init starting")
    data = []
    if fn:
        data = crawl(fn)
        save_json(data, os.path.join(path, 'crawl.json'))
    else:
        data = load_data(os.path.join(path, 'crawl.json'))

    db.create_tables()

    save_triple_to_db(data)
    to_triple_file(os.path.join(path, 'data.nq'))

    # save_triple(data, output=os.path.join(path, 'data.nq'))

    transform_entity2json(os.path.join(path, "data.nq"))
    delete_index()
    begin_insert_job(os.path.join(path, "data.json"))


if __name__ == '__main__':
    import sys

    main(*sys.argv)
