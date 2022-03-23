from datetime import datetime, timedelta
import random
import json

import csv

def load_hists():
    hists = {}
    with open('btc_10years', 'r') as f:
        data = json.load(f)
        for hist in data:
            date = datetime.fromtimestamp(hist['time'])
            hists[date.strftime('%Y-%m-%d')] = hist['price']
    return hists

def random_price(base_price, factor = 1):
    return base_price + factor * (random.random() - 0.5) * 2

def gen_price(hists, date, money, base_price, factor = 1):
    price = hists.get(date.strftime('%Y-%m-%d'), random_price(base_price, factor))
    amount = money / price
    return {
        'price': price,
        'amount': amount,
        'money': money,
        'date': date
    }

def calc_earn_rate(prices):
    money = 0
    amount = 0
    for price in prices:
        money += price['money']
        amount += price['amount']
        worth = price['price'] * amount
        rate = (worth - money) / money * 100
        price['total_money'] = money
        price['total_amount'] = amount
        price['worth'] = worth
        price['rate'] = rate


def save(prices):
    with open('prices.csv', 'w', newline='') as csvfile:
        fieldnames = ['price', 'money', 'amount', 'total_money', 'total_amount', 'worth', 'rate', 'date']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for price in prices:
            writer.writerow(price)

base_price = 0
factor = 1

date = datetime.now() - timedelta(days=300)
delta = timedelta(days=1)

money = 100
prices = []

hists = load_hists()

for i in range(0, 200):
    price = gen_price(hists, date, money, base_price, factor)
    prices.append(price)
    base_price = price['price']
    date += delta

calc_earn_rate(prices)

save(prices)

