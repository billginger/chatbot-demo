# Chatbot Demo

Build a multilingual chatbot to integrate with WeChat and Facebook

## How to use

### Clone this project to your server

```
cd /data
git clone https://github.com/billginger/chatbot-demo.git chatbot-demo
```

### Configuration

* 将您的域名证书文件放到以下目录：

```
/data/chatbot-demo/nginx/cert
```

* 修改以下配置文件以适用您的域名：

```
/data/chatbot-demo/nginx/conf/server.conf
```

* 可能需要将微信域名校验文件放到以下目录：

```
/data/chatbot-demo/nginx/www
```

* 根据以下文件在相同目录下创建 `config.js`：

```
/data/chatbot-demo/chatbot-portal-backend/config.example.js
/data/chatbot-demo/chatbot-wechat/config.example.js
/data/chatbot-demo/chatbot-facebook/config.example.js
```

### Use Docker

#### Run Nginx

* Pull Nginx image:

```
docker pull nginx
```

* 以挂载本地目录和配置文件的方式运行容器：

```
docker run --name nginx -d --network host -v /data/chatbot-demo/nginx:/etc/nginx -v /data/chatbot-demo/logs:/logs nginx
```

> 请注意：这里 nginx 容器使用了宿主网络，不需要映射端口，访问其它容器暴露的端口也会比较方便。

#### When the configuration file is modified

* 重启容器使新的配置文件生效（不建议）：

```
docker restart nginx
```

* 进入容器，先验证配置文件，再重载配置文件：

```
docker exec -it nginx bash
nginx -t
nginx -s reload
```

* 在容器外，先验证配置文件，再重载配置文件：

```
docker exec nginx bash -c "nginx -t"
docker exec nginx bash -c "nginx -s reload"
```

#### Run MongoDB

* Pull MongoDB image:

```
docker pull mongo
```

* 以挂载本地目录的方式运行容器：

```
docker run --name mongo -d -p 27017:27017 -v /data/chatbot-demo/db:/data/db mongo --auth
```

> 请注意：这里 mongo 容器使用了 --auth 这个参数来启动，以启用 MongoDB 的鉴权模式。

* 进入容器创建用户：

```
docker exec -it mongo bash
mongo
use admin
db.createUser({user:'<username>',pwd:'<password>',roles:[{role:'root',db:'admin'}]})
exit
```

* 在 `config.js` 配置 db_url，以 chatbot-facebook 为例：

```
mongodb://<username>:<password>@<host>:<port>/chatbot-facebook?authSource=admin
```

#### Run App

* 使用 Dockerfile 构建镜像：

```
cd /data/chatbot-demo/dockerfile/node-pm2
docker build -t node-pm2 .
```

* 以挂载本地目录的方式运行容器：

```
docker run --name chatbot-portal -d -p 3000:3000 -v /data/chatbot-demo/chatbot-portal-backend:/app -v /data/chatbot-demo/logs:/logs node-pm2
docker run --name chatbot-wechat -d -p 3010:3000 -v /data/chatbot-demo/chatbot-wechat:/app -v /data/chatbot-demo/logs:/logs node-pm2
docker run --name chatbot-facebook -d -p 3020:3000 -v /data/chatbot-demo/chatbot-facebook:/app -v /data/chatbot-demo/logs:/logs node-pm2
```

* 进入容器：

```
docker exec -it chatbot-facebook sh
```

* 第一次运行程序，需要安装依赖的模块：

```
cd /app
npm i
```

* 使用 PM2 运行程序：

```
cd /app
pm2 start
```

* 在容器外，先查看程序状态，再重启程序：

```
docker exec chatbot-facebook sh -c "pm2 list"
docker exec chatbot-facebook sh -c "pm2 restart all"
```

## Load Balancing

Nginx 配置文件中，默认为每个 Node.js 程序配置了 2 个节点，请参考以下文件：

```
/data/chatbot-demo/nginx/conf/upstream.conf
```

以 chatbot-facebook 为例，按照 Nginx 的配置，应运行如下 2 个容器：

```
docker run --name chatbot-facebook-a -d -p 3020:3000 -v /data/chatbot-demo/chatbot-facebook:/app -v /data/chatbot-demo/logs:/logs node-pm2
docker run --name chatbot-facebook-b -d -p 3021:3000 -v /data/chatbot-demo/chatbot-facebook:/app -v /data/chatbot-demo/logs:/logs node-pm2
```

假如只运行了一个容器，收到 chatbot-facebook 的 http 请求时，会在 `nginx_error.log` 中产生 `connect() failed` 的日志，但请不要担心，请求仍会顺利的传递到正在运行的那一个容器。

## Multiple Processes

本项目 Node.js 程序使用了 Cluster 来创建多进程，在多核 CPU 下，会创建 1 个主进程和 N 个工作进程（N = CPU 核心数）

> 请注意：不要使用 PM2 之类的进程管理软件来实现多进程，这会导致系统资源开销过大、日志丢失等问题。

## Log System

本项目所有日志都会保存到 `/logs` 目录下。

所有日志的打印时间都为 0 时区时间。

Nginx 日志使用 Nginx 默认格式，分为：

* 进站日志：nginx_access.log
* 错误日志：nginx_error.log

Node.js 日志使用自定义格式，以 chatbot-facebook 为例，分为：

* 进站日志：chatbot_facebook_access.log
* 应用日志：chatbot_facebook_app.log
* 错误日志：chatbot_facebook_error.log
* 所有日志：chatbot_facebook_all.log

其中，进站日志格式为：
```r
:method :url :status :content-length :response-timems
```

进站日志、应用日志、错误日志都由 Log4js 模块创建，超过 10M 会自动分割备份，最多保留 5 个备份文件。

“所有日志”由 PM2 创建，包含“进站日志”、“应用日志”、“错误日志”，不会分割，永久保留。
