import os
import re

root = os.path.dirname(__file__)
data = os.path.join(root, 'data')

array_attrs = []
normal_attrs = []

number_attrs = []

ignore_val_attrs = []
ignore_val_values = []

index_name = 'product'
es_host = 'http://elasticsearch:9200'
