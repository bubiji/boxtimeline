import json
import os
import re
from collections import defaultdict
from config import data as path, array_attrs, normal_attrs, ignore_val_attrs, ignore_val_values, number_attrs

def load_map(mapping_file, sp=' '):
    f = open(mapping_file)
    mapping = defaultdict(list)
    for line in f:
        parts = line.strip().split(sp)
        for p in parts:
            if p != '':
                mapping[p].append(parts[0])
    return mapping

def load_line(mapping_file, sp=' '):
    f = open(mapping_file)
    mapping = defaultdict(list)
    for line in f:
        parts = line.strip().split(sp)
        for p in parts:
            if p:
                if p not in mapping[parts[0]]:
                    mapping[parts[0]].append(p)
    return mapping

def gen_entity():
    new_ent = {'po': []}
    for attr in array_attrs:
        new_ent[attr] = []

    return new_ent

def get_lines(fn):
    try:
        with open(fn, 'r') as f:
            return f.read().split('\n')
    except:
        return []

def write_lines(fn, lines):
    with open(fn, 'w') as f:
        for line in lines:
            if line:
                f.write(line)
                f.write('\n')

def with_file(fn):
    def warp(func):
        def _run(*args, **kwargs):
            newLines = func(*args, **kwargs)
            lines = get_lines(fn)
            for line in newLines:
                if line not in lines:
                    lines.append(line)
            write_lines(fn, lines)
        return _run
    return warp

@with_file(os.path.join(path, 'data_val.txt'))
def write_val(val_attr_map):
    for v in val_attr_map:
        val_attr_map[v] = sorted(list(val_attr_map[v].items()), key=lambda x:x[1], reverse=True)

    for v in val_attr_map:
        line = [v]
        for attr in val_attr_map[v]:
            line.append(attr[0])
        yield ' '.join(line)


@with_file(os.path.join(path, "attr_mapping.txt"))
def write_attr_mapping(attr_mapping):
    attr_line = load_line(os.path.join(path, 'attr_mapping_custom.txt'))
    attr_mapping = sorted(list(attr_mapping.items()), key=lambda x:x[1], reverse=True)

    for v in attr_mapping:
        line = ''
        if attr_line.get(v[0]):
            yield ' '.join(attr_line[v[0]])
        else:
            yield v[0]

@with_file(os.path.join(path, "entity_mapping.txt"))
def write_entity_mapping(entity_mapping):
    entity_mapping = sorted(list(entity_mapping.items()), key=lambda x:x[1], reverse=True)
    entity_line = load_line(os.path.join(path, 'entity_mapping_custom.txt'), '$$')

    for v in entity_mapping:
        if entity_line.get(v[0]) and len(entity_line[v[0]]) > 1:
            yield '$$'.join(entity_line[v[0]])

@with_file(os.path.join(path, "all_entity.txt"))
def write_all_entity(all_entity):
    all_entity = sorted(list(all_entity.items()), key=lambda x:x[1], reverse=True)
    entity_line = load_line(os.path.join(path, 'entity_mapping_custom.txt'), '$$')
    for v in all_entity:
        if entity_line.get(v[0]):
            for vv in entity_line[v[0]]:
                yield vv
        else:
            yield v[0]

def transform_entity2json(input_file):
    '''
    一个entity的所有属性为一个文档
    height,weight由于要支持range搜索，需要另存为int类型，要单独考虑
    '''

    attr_map = load_map(os.path.join(path, 'attr_mapping_custom.txt'))
    entity_map = load_map(os.path.join(path, 'entity_mapping_custom.txt'), '$$')

    out_name = input_file[:input_file.rfind(".")]

    f_input = open(input_file)
    f_json = open(out_name + ".json","w")

    val_attr_map = defaultdict(dict)
    attr_mapping = defaultdict(int)
    all_entity = defaultdict(int)
    entity_mapping = defaultdict(int)

    last = None
    new_ent = gen_entity()
    for line in f_input:
        parts = line.strip().split("$$", 2)
        if len(parts) < 3:
            continue
        entity = parts[0].strip()
        attr = parts[1].strip()

        if entity_map.get(entity):
            entity = entity_map[entity][0]

        entity_mapping[entity] += 1

        all_entity[entity] += 1

        if attr_map.get(attr):
            attr = attr_map[attr][0]

        attr_mapping[attr] += 1

        attr_vals = parts[2].strip()
        if last is None:
            last = entity

        if last is not None and entity != last:
            new_ent['subj'] = last
            new_ent_j = json.dumps(new_ent)
            f_json.write(new_ent_j + "\n")
            last = entity
            new_ent = gen_entity()

        v = clean_normal(attr_vals)

        if attr in array_attrs:
            if attr_vals not in new_ent[attr]:
                new_ent[attr].append(attr_vals)

        if attr in normal_attrs:
            new_ent[attr] = attr_vals
        else:
            if attr not in number_attrs + array_attrs:
                for vv in v:
                    new_ent['po'].append({'pred':attr,'obj':vv})

        if attr in ignore_val_attrs:
            continue

        for vv in v:
            if vv in ignore_val_values:
                continue
            if len(vv) < 2:
                continue
            if attr in val_attr_map[vv]:
                val_attr_map[vv][attr] += 1
            else:
                val_attr_map[vv][attr] = 1

            attr_mapping[attr] += 1
            all_entity[entity] += 1

    new_ent['subj'] = last
    new_ent_j = json.dumps(new_ent)
    f_json.write(new_ent_j + "\n")

    write_val(val_attr_map)
    write_attr_mapping(attr_mapping)
    write_entity_mapping(entity_mapping)
    write_all_entity(all_entity)

def clean_normal(attr_vals):
    v = []
    a = re.split(" |,|，|、|#|;|；|\\\\n|：|。|（|）|\(|\)", attr_vals)
    for aa in a:
        if aa:
            v.append(aa)
    return v

if __name__ == '__main__':
    transform_entity2json("data.nq")
