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
    with open('data.txt', 'r') as f:
        for line in f.readlines():
            line = line.split(',')
            date = line[0].strip().split('.')
            if len(date[1]) == 1:
                date[1] = '0' + date[1]
            if len(date[2]) == 1:
                date[2] = '0' + date[2]

            data['{}-{}-{}'.format(date[0], date[1], date[2])] = line[1].strip()
    return data

def gen_incidents(title):
    return [{
           "bullish": True,
           "comment": title,
           "great": True,
           "hoffset_h5":-150,
           "hoffset_pc":-150,
           "inchart_h5": True,
           "inchart_pc": True,
           "incident": title,
           "link": "",
           "offset_h5": 0,
           "offset_pc": 0
    }]

def main():
    data = load_data()
    prices = load_hists()
    for key, val in data.items():
        try:
            prices[key]['incidents'] = gen_incidents(val)
        except Exception as e:
            print(e)

    prices = list(prices.values())

    start_timestamp = datetime(2019, 6, 28).timestamp()
    def filter_func(price):
        return price['time'] > start_timestamp

    prices = list(filter(filter_func, prices))
    with open('../api/w1/btc_10years', 'w') as f:
        json.dump(prices, f, indent=2)


main()
