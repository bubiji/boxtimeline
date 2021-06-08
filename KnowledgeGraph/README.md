# RAT_KG

```
docker-compose up -d

docker exec -i -t rat_kg sh -c "python3 run_crawl.py"
```

Open <http://localhost:8000>


# RAT_KG	# BUBIJI_KG


```	```
docker run -i -t --rm --name es -p 9200:9200 docker.elastic.co/elasticsearch/elasticsearch:6.4.3	docker-compose up -d
```	

## 安装依赖	

```	
pip3 install -r requirements.txt	
```	

## 导入数据	docker exec -i -t BUBIJI_KG sh -c "python3 run_crawl.py"

```	
python3 run_crawl.py data/test.csv	
# 如果数据已经抓过了只要执行下面命令即可重新导入数据	
python3 run_crawl.py	
```	```


## 启动应用	Open <http://localhost:8000>

```	
python3 run_app.py	
```
