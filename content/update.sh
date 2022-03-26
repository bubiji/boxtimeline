#!/usr/bin/env bash

curl https://raw.githubusercontent.com/xiaolai/regular-investing-in-box/master/data/box_price_history.txt > box_price_history.txt

python3 merge.py box
python3 merge.py btc

mv box_hists ../box
mv btc_hists ../btc
