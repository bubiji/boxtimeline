from datetime import datetime, timedelta
import json

def load_hists():
    hists = {}
    with open('btc_10years_orig', 'r') as f:
        data = json.load(f)
        for hist in data:
            date = datetime.fromtimestamp(hist['time'])
            hist['incidents'] = []
            hists[date.strftime('%Y-%m-%d')] = hist
    return hists

def load_data():
    data = {}
    with open('data2022.txt', 'r') as f:
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

def main():
    data = load_data()
    prices = load_hists()
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

    start_timestamp = datetime(2019, 6, 28).timestamp()
    def filter_func(price):
        return price['time'] > start_timestamp

    prices = list(filter(filter_func, prices))
    with open('../api/w1/btc_10years', 'w') as f:
    # with open('btc_10years', 'w') as f:
        json.dump(prices, f, indent=2, ensure_ascii=False)


main()
