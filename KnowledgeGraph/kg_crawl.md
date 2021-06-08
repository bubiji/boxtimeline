# Logic

- 读取相关 yml 配置文件（Eg. ffmpeg.yml）
- 获取静态数据
- 直接将静态数据送入 pipelines

- 获取需要下载的数据信息
- 生成 Requset
- 放入 grapy 的分发器（sched.py）
- 经过一系列 Middleware 后
- 下载相应的数据
- 选择相应的解析器
- 解析后数据送入 pipelines

- pipelines 将数据进行预处理
- 保存到数据库


- 当任务完成后执行 RAT_KG 导入任务
