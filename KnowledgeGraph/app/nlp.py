import requests
import json
from collections import defaultdict
import ahocorasick
import jieba
import re
import os

from config import data as path, number_attrs, array_attrs, normal_attrs, index_name, es_host

re_sp = re.compile('[;；]')

def load_ac_dict(attr_mapping_file):
    A = ahocorasick.Automaton()
    f = open(attr_mapping_file)
    i = 0
    for line in f:
        parts = line.strip().split(" ")
        for p in parts:
            if p != "":
                A.add_word(p,(i,p))
                i += 1
    A.make_automaton()
    return A

def load_attr_map(attr_mapping_file):
    f = open(attr_mapping_file)
    mapping = defaultdict(list)
    for line in f:
        parts = line.strip().split(" ")
        for p in parts:
            if p != '':
                mapping[p].append(parts[0])
    return mapping

def load_entity_map(entity_mapping_file):
    f = open(entity_mapping_file)
    mapping = defaultdict(list)
    for line in f:
        parts = line.strip().split("$$")
        for p in parts:
            if p != '':
                mapping[p].append(parts[0])
    return mapping

def load_entity_dict(entity_file):
    f = open(entity_file)
    ents = {}
    for line in f:
        ents[line.strip()] = 1
    return ents

def load_val_dict(val_file):
    f = open(val_file)
    val_attr_map = {}
    for line in f:
        parts = line.strip().split(" ")
        val_attr_map[parts[0]] = parts[1]
    return val_attr_map

attr_map = None
attr_ac  = None
ent_dict = None
ent_map  = None
val_dict = None

def load_mappings():
    global attr_map, attr_ac, ent_dict, ent_map, val_dict
    attr_map = load_attr_map(path+"/attr_mapping.txt")
    attr_ac = load_ac_dict(path+"/attr_mapping.txt")
    ent_dict = load_entity_dict(path+"/all_entity.txt")
    ent_map = load_entity_map(path+"/entity_mapping.txt")
    val_dict = load_val_dict(path+"/data_val.txt")

def parse_ans(ans):
    ans = ans.strip()
    return (ans[0], ans[2:].strip())

def parse(q):
    idx = q[1].find('：')
    qs = q[1][idx + 1:]
    idx = q[2].find('：')
    ans = q[2][idx + 1:]
    data = {
        'id': q[0][:-1],
        'question': qs,
        'answer': dict([parse_ans(q) for q in re_sp.split(ans) if q])
    }
    return data

def parse_query(question):
    answer, query_type = "", None
    # question = question.upper()
    parts = re.split("：|:|<|>|<=|>=", question)
    en = _entity_linking(parts[0])

    if len(parts) < 2:
        if len(en):
            query_type = 1
            answer,msg = _search_single_subj(en[-1]) #查询实体
        else:
            return question, '未识别到实体',-1
    elif 'AND' in question or 'OR' in question:
        query_type = 4
        bool_ops = re.findall('AND|OR',question)
        exps = re.split('AND|OR',question)
        answer,msg = _search_multi_PO(exps, bool_ops)
    elif len(en) > 0 and len(parts) == 2:
        query_type = 4
        answer, msg = _search_multihop_SP(parts) # 实体属性查询 and 多跳查询实体
    elif len(_map_predicate(parts[0])) != 0: #多属性查询实体   todo:需要轮询前后分词，判断属性和分词位置
        query_type = 5
        answer, msg = _search_multi_PO([question],[])
    elif len(en):
        query_type = 3
        answer, msg = _search_multihop_SP(parts) # 实体属性查询 and 多跳查询实体
    else:
        msg = '未识别到实体或属性: ' + parts[0]

    return answer, msg, query_type

def _search_multihop_SP(parts):
    has_done = parts[0]
    v = parts[0]
    ov = parts[0]
    for i in range(1, len(parts)):
        en = _entity_linking(v)
        if not len(en):
            return '执行到: ' + has_done, '==> 对应的结果为:' + v + ', 知识库中没有该实体: ' + v
        #card, msg = _search_single_subj(en[-1]) #找到了一个对象，所有搜索结果中第一个对象
        p = _map_predicate(parts[i])
        card, msg = _search_single_subj_with_po(en[-1],p)
        if not len(p):
            return '执行到: ' + has_done, '==> 知识库中没有该属性: ' + parts[i]
        if not card:
            card = {'subj': 'unknow'}
        p = p[0]
        if p not in card: #判断如果实体没有这个属性，直接返回，说明找到的实体不对。
            return '执行到: ' + has_done, '==> 实体 ' + card['subj'] + ' 没有属性 ' + p
        v = card[p]
        ov = card[p]
        if not isinstance(v,str):
            v = str(v)
        has_done += ":" + parts[i]
    return ov, 'done'

def _search_multi_PO(exps, bool_ops): #多实体查询
    ans_list = []
    po_list = []
    cmp_dir = {
        "<":"lt",
        "<=":"lte",
        ">":"gt",
        ">=":"gte"
    }

    for e in exps:
        if e == "":
            return "", 'AND 或 OR 后不能为空'

        begin_with_NOT = False
        if e[0:3] == 'NOT':
            begin_with_NOT = True
            e = e[3:]
        elif 'NOT' in e:
            return e, 'NOT请放在PO对前面'

        op = re.findall("：|:|>|<|>=|<=",e)
        if len(op) != 1:
            return e, '语法错误'
        op = op[0]
        if op == '<' or op == '>':
            index = e.find(op)
            if e[index+1] == '=':
                op = op + '='
        pred,  obj  = e.split(op) # todo： 同样判断obj对象和pred属性位置

        pred = pred.strip()
        obj = obj.strip()

        c_pred = _map_predicate(pred)
        if not len(c_pred):
            return e, '知识库中没有该属性: ' + pred
        if obj == '':
            return e+"?", '属性值不能为空'
        pred = c_pred[0]

        part_query = []
        if not begin_with_NOT:
            if op == ':' or op == '：':
                if pred in normal_attrs + number_attrs + array_attrs:
                    part_query = {'match': {pred: obj}}
                else:
                    part_query = {'bool': {'must': [{'match': {'po.pred': pred}}, {'match': {'po.obj': obj}}]}}
            else:
                if pred in number_attrs:
                    part_query = {'range':{pred: {cmp_dir[op]: float(obj)}}}
                else:
                    return e,'该属性不支持比较大小,目前只支持运行内存, 机身内存'
        else:
            if op == ':' or op == '：':
                if pred in normal_attrs + number_attrs + array_attrs:
                    part_query = {'bool': {'must_not': {'match': {pred: obj}}}}
                else:
                    part_query = {'bool': {'must': [{'match': {'po.pred': pred}},{'bool': {'must_not': {'match': {'po.obj': obj}}}}]}} # todo： 搜索答案的json不对
            else:
                if pred in number_attrs:
                    part_query = {'bool': {'must_not': {'range':{pred: {cmp_dir[op]: int(obj)}}}}}
                else:
                    return e,'该属性不支持比较大小,目前只支持运行内存, 机身内存'
        po_list.append(part_query)

    or_po = [False] * len(exps)
    should_list = []
    must_list = []
    i = 0
    while i < len(bool_ops):
        if bool_ops[i] == 'OR':
            adjacent_or = [po_list[i]]
            or_po[i] = True
            while i < len(bool_ops) and bool_ops[i] == 'OR':
                adjacent_or.append(po_list[i+1])
                or_po[i+1] = True
                i += 1
            should_list.append(adjacent_or)
        i += 1
    for i,po in enumerate(or_po):
        if not po:
            must_list.append(po_list[i])
    query = {}
    if must_list:
        query = {'query': {'bool': {'must': must_list}}}
        if should_list:
            query['query']['bool']['should'] = should_list
    else:
        query = {'query': {'bool': {'should': should_list}}}

    res = do_search(query)

    if not res.get('hits') or res['hits'].get('total', 0) == 0:
        return None,'none'
    else:
        ans = []
        for e in res['hits']['hits']:
            name = e['_source']['subj']
            ans.append([e['_id'], name])

        return ans, 'done'


def _search_single_subj(entity_name):
    query = {"query": { "match" :{"subj" : entity_name}}}

    res = do_search(query)

    if not res.get('hits') or res['hits'].get('total', 0) == 0:
        return None, 'entity'
    else:
        s = res['hits']['hits'][0]['_source'] #todo 轮询所有结果 如果有那个值 对应属性 取出
        card = make_card(entity_name, s)
        return card, 'done'

def _search_single_subj_with_po(entity_name,po_name):
    query = {"query": { "match" :{"subj" : entity_name}}}

    res = do_search(query)

    if not res.get('hits') or res['hits'].get('total', 0) == 0:
        return None, 'entity'
    else:
        s = res['hits']['hits'][0]['_source'] #todo 轮询所有结果 如果有那个值 对应属性 取出
        card = make_card(entity_name, s)

        entities = res['hits']['hits']
        for s in entities:
            entity = s['_source']
            if  entity_name in entity['subj']:
            #if po['pred'] in po_name:
                for po in entity['po']:
                    if po['pred'] in po_name:
                        for po in entity['po']:
                            if po['pred'] in card:
                                if card[po['pred']].find(po['obj']) == -1:
                                    card[po['pred']] += ' ' + po['obj']
                            else:
                                card[po['pred']] = po['obj']

        return card, 'done'

def make_card(subj, source):
    card = dict()
    card['subj'] = subj
    for k, v in source.items():
        if k == 'po':
            continue
        card[k] = v

    for po in source['po']:
        if po['pred'] in card:
            if card[po['pred']].find(po['obj']) == -1:
                card[po['pred']] += ' ' + po['obj']
        else:
            card[po['pred']] = po['obj']
    return card

def _search_single_subj_pred_pair(entity_name, attr_name):
    query = '{"query": {"constant_score": {"filter": {"bool": {"must": {"term": {"pred": "' + \
        attr_name + '"}},"must":{"term":{"subj":"' + entity_name + '"}}}}}}}'
    res = do_search(query)

    if res['hits']['total'] == 0:
        ans, _ = _search_single_subj(entity_name)
        return ans, 'str'
    else:
        obj = res['hits']['hits'][0]['_source']['obj']
        # obj_en, _ = _search_single_subj(obj)
        # if obj_en is not None:
        #     return obj_en, 'entity'
        # else:
        return obj, 'str'

def translate_NL2LF(nl_query):
    #'''
    # 使用基于模板的方法将自然语言查询转化为logic form
    #'''
    # nl_query = nl_query.upper()
    entity_list = _entity_linking(nl_query)
    attr_list = _map_predicate(nl_query,False)
    lf_query = ""
    if entity_list:
        if not attr_list: #如果没识别出属性 那么就是查询实体
            lf_query = entity_list[-1]
        else:
            first_entity_pos = nl_query.find(entity_list[-1]) #实体的位置
            first_attr_pos = nl_query.find(attr_list[0]) #属性的位置
            if len(attr_list) == 1: #一个属性
                if first_entity_pos < first_attr_pos: #判断属性位置
                    lf_query = "{}:{}".format(entity_list[-1], attr_list[0])
                else:
                    lf_query = "{}:{}".format(attr_list[0], entity_list[-1])
            else: #多个属性
                lf_query = entity_list[-1]
                for pred in attr_list:
                    lf_query += ":" + pred
    else:
        val_d = _val_linking(nl_query)

        attr_pos = {}
        val_pos = {}

        for a in attr_list:
            attr_pos[a] = nl_query.find(a)

        for v in val_d:
            val_pos[v] = nl_query.find(v)

        retain_attr = []
        for a in attr_pos:
            mapped_a = attr_map[a][0]
            if mapped_a in number_attrs:
                retain_attr.append(a)

        for a in number_attrs:
            if nl_query.find(a) > -1 and a not in retain_attr:
                    retain_attr.append(a)

        tmp = {}
        for v in val_pos:
            to_retain = True
            for a in attr_pos:
                if(val_pos[v] >= attr_pos[a] and val_pos[v] + len(v) <= attr_pos[a] + len(a)):
                    to_retain = False
                    break
            if to_retain:
                tmp[v] = val_d[v]
        val_d = tmp

        has_attr = len(attr_pos) > 0

        final_val_d= {}
        for v in val_d:
            if val_d[v] in number_attrs:
                if val_d[v] not in attr_pos and not has_attr:
                    retain_attr.append(val_d[v])
                    attr_pos[val_d[v]] = 0
                continue

            if not (v.isdigit() or v in '大于' or v in '小于'):
                final_val_d[v] = val_d[v]


        part_queries = []
        for a in retain_attr:
            mapped_a = attr_map[a][0]
            part_query = ""

            if part_query:
                part_queries.append(part_query)

        for q in part_queries:
            if not lf_query:
                lf_query += q
            else:
                lf_query += ' AND ' + q

        prev_pred = []
        for v, pred in final_val_d.items():
            if len(v) < 2:
                continue
            if pred in prev_pred:
                lf_query += ' OR ' + '{}:{}'.format(pred, v)
            else:
                if not lf_query:
                    lf_query = '{}:{}'.format(pred, v)
                else:
                    lf_query += ' AND ' + '{}:{}'.format(pred, v)
                prev_pred.append(pred)
    return lf_query

def _remove_dup(word_list):  #删除多余的词组，只留下一个属性
    #'''
    #args:
    #    word_list: 一个字符串的list
    #'''
    distinct_word_list = []
    for i in range(len(word_list)):
        is_dup = False
        for j in range(len(word_list)):
            if j != i and word_list[i] in word_list[j]:
                is_dup = True
                break
        if not is_dup:
            distinct_word_list.append(word_list[i])
    return distinct_word_list


def _map_predicate(pred_name, map_attr=True):   #找出一个字符串中是否包含知识库中的属性

    def _map_attr(word_list):
        ans = []
        for word in word_list:
            ans.append(attr_map[word][0])
        return ans

    match = []
    for w in attr_ac.iter(pred_name):
        match.append(w[1][1])
    if not len(match):
        return []

    ans = _remove_dup(match)
    if map_attr:
        ans = _map_attr(ans)
    return ans

def _generate_ngram_word(word_list_gen):
    #'''
    #args:
    #    word_list_gen: 一个字符串的迭代器
    #'''
    word_list = []
    for w in word_list_gen:
        word_list.append(w)
    n = len(word_list)
    ans = []
    for i in range(1, n+1):
        for j in range(0,n+1-i):
            ans.append(''.join(word_list[j:j+i]))
    return ans

def _entity_linking(entity_name):    #找出一个字符串中是否包含知识库中的实体，这里是字典匹配，可以用检索代替
    parts = re.split(r'的|是|有', entity_name)
    ans = []
    ans1 = ""
    for p in parts:
        pp = jieba.cut(p)
        if pp is not None:
            for phrase in _generate_ngram_word(pp):
                if phrase in ent_dict:
                    if ent_map.get(phrase):
                        ans.append(ent_map[phrase][0])
                    else:
                        ans.append(phrase)
    return ans

def _val_linking(nl_query):
    parts = re.split(r'的|是|有', nl_query)
    hit_val = []
    for p in parts:
        for phrase in _generate_ngram_word(p):
            if phrase in val_dict:
                hit_val.append(phrase)

    hit_val = _remove_dup(hit_val)
    ans = {}
    for p in hit_val:
        ans[p] = val_dict[p]

    return ans

def gen_query_(reg, normal_value, attr, nl_query, pos, l):
    m = reg.findall(nl_query[pos:])
    if not m:
        return '', pos
    value = m[0]
    value_pos = pos + nl_query[pos:].find(value)
    between = nl_query[pos + l:value_pos]
    pos = value_pos + len(value)
    value = normal_value(value)
    if not isinstance(value, str):
        value = str(value)
    if re.search('大于等于|不小于|>=', between):
        return attr + '>=' + value, pos
    elif re.search('大于|>', between):
        return attr + '>' + value, pos
    elif re.search('等于|=|是', between):
        return attr + ":" + value, pos
    elif re.search('小于等于|不超过|<=|不大于', between):
        return attr + "<=" + value, pos
    elif re.search('小于', between):
        return attr + "<" + value, pos
    else:
        return attr + ":" + value, pos

    return '', pos

def gen_query(reg, normal_value, attr, nl_query, pos, l):
    v, pos = gen_query_(reg, normal_value, attr, nl_query, pos, l)
    return v

def do_search(query):
    url = '{}/{}/_search'.format(es_host, index_name)
    if not isinstance(query, str):
        query = json.dumps(query)
    rsp = requests.post(url,
            headers={'Content-Type': 'application/json'},
            data = query)
    return rsp.json()
