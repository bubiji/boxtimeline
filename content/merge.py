from datetime import datetime, timedelta
import json

def to_num(v):
    return float(v[1:].replace(',', ''))

def to_ts(s):
    return int(datetime.strptime(s, '%Y-%m-%d').timestamp())

def load_hists(n):
    hists = {}
    with open('box_price_history.txt', 'r') as f:
        line = f.readline().strip()
        header = line.split('\t')

        for line in f:
            line = line.strip().split('\t')

            data = dict(zip(header, line))
            date = data.pop('Date')

            for k, v in data.items():
                name = k.split(' ')[0].lower()
                price = to_num(v)
                if name == n:
                    hist = {
                        'price': price,
                        'rate': 0,
                        'time': to_ts(date),
                        'incidents': []
                    }

                    hists[date] = hist
                    print(price, date)

    return hists


def load_data():
    data = {}
    with open('data_date_classname_select', 'r') as f:
        for line in f.readlines():
            line = line.split(',')
            if len(line) < 2:
                continue
            date = line[0].strip().split('.')
            if len(date[1]) == 1:
                date[1] = '0' + date[1]
            if len(date[2]) == 1:
                date[2] = '0' + date[2]

            data['{}-{}-{}'.format(date[0], date[1], date[2])] = line[1].strip()
    return data

def gen_incidents(title, idx):
    offset = offsets[idx % offsetLen]
    return [{
           "bullish": offset < 50,
           "comment": title,
           "great": True,
           "hoffset_h5": 0,
           "hoffset_pc": 0,
           "inchart_h5": True,
           "inchart_pc": True,
           "incident": title,
           "link": "",
           "offset_h5": offset,
           "offset_pc": offset
    }]

offsets = [
  165,
  148, 
  130,
  18,
  0,
  -18,
  -36,
  -54,
  -72,
]

offsetLen = len(offsets)

def main(script, name='box'):
    data = load_data()
    prices = load_hists(name)
    idx = 0
    for key, val in data.items():
        try:
            if len(prices[key]['incidents']) > 0:
                prices[key]['incidents'][0]['comment'] = val
                prices[key]['incidents'][0]['incident'] = val
                prices[key]['incidents'][0]['link'] = ''
                prices[key]['incidents'][0]['hoffset_h5'] = 0
                prices[key]['incidents'][0]['hoffset_pc'] = 0
            else:
                prices[key]['incidents'] = gen_incidents(val, idx)
                idx += 1
        except Exception as e:
            print(e)

    prices = list(prices.values())
    with open(f'{name}_hists', 'w') as f:
        json.dump(prices, f, indent=2, ensure_ascii=False)


if __name__ == '__main__':
    import sys
    main(*sys.argv)
