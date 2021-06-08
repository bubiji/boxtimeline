FROM python:3.7.4-alpine3.10

RUN apk add alpine-sdk

WORKDIR /data
COPY requirements.txt /data/requirements.txt
RUN pip3 install -r requirements.txt

COPY . /data

CMD ["python3", "/data/run_app.py"]
