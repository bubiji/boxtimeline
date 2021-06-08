'''
将一个知识图谱中的数据导入elastic search,须提前新建index和type
'''
import sys
import requests
import re

from config import index_name, es_host

re_subj = re.compile('"subj": "(.+)"')

def bulk_insert(base_url, data):
    rsp = requests.post(base_url, headers={"Content-Type":"application/x-ndjson"}, data=data)
    # print(rsp.json())

def delete_index():
    base_url = "{}/{}/".format(es_host, index_name)
    rsp = requests.delete(base_url)
    # print(rsp.json())


def begin_insert_job(json_filepath, bulk_size=1000):
    base_url = "{}/{}/_doc/_bulk".format(es_host, index_name)
    f = open(json_filepath)
    cnt, es_id = 0, 1
    data = ""
    for line in f:
        m = re_subj.search(line)
        if not m:
            continue
        name = m.group(1)
        action_meta = '{"index": {"_id":"' + name + '"}}'
        data = data + action_meta + "\n" + line

        es_id += 1
        cnt += 1
        if cnt >= bulk_size:
            bulk_insert(base_url, data)
            cnt, data = 0, ""
        if not (es_id % bulk_size):
            print(es_id)
    if cnt:
        bulk_insert(base_url, data)

if __name__ == '__main__':
    begin_insert_job("data.json")
