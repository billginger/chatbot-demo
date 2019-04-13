# Gravity Prototype

Build a multilingual chatbot to integrate with WeChat and Facebook

## How to use

### Clone this project to your server

```
cd /data
git clone https://github.com/billginger/gravity-prototype.git gravity-prototype
```

### Configuration

* 将您的域名证书文件放到以下目录：

```
/data/gravity-prototype/nginx/cert
```

* 修改以下配置文件以适用您的域名：

```
/data/gravity-prototype/nginx/conf/server.conf
```

### Use Docker

#### Run Nginx

* Pull Nginx image:

```
docker pull nginx
```

* 以挂载本地目录和配置文件的方式运行容器：

```
docker run --name nginx -d --network host -v /data/gravity-prototype/nginx:/etc/nginx -v /data/gravity-prototype/logs:/logs nginx
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

#### Run App

* 使用 Dockerfile 构建镜像：

```
cd /data/gravity-prototype/dockerfile/node-pm2
docker build -t node-pm2 .
```

* 以挂载本地目录的方式运行容器：

```
docker run --name gravity-portal-backend -d -p 3000:3000 -v /data/gravity-prototype/gravity-portal-backend:/app -v /data/gravity-prototype/logs:/logs node-pm2
docker run --name gravity-wechat -d -p 3010:3000 -v /data/gravity-prototype/gravity-wechat:/app -v /data/gravity-prototype/logs:/logs node-pm2
docker run --name gravity-facebook -d -p 3020:3000 -v /data/gravity-prototype/gravity-facebook:/app -v /data/gravity-prototype/logs:/logs node-pm2
```

* 进入容器：

```
docker exec -it gravity-facebook sh
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
docker exec gravity-facebook sh -c "pm2 list"
docker exec gravity-facebook sh -c "pm2 restart all"
```

## Load Balancing

Nginx 配置文件中，默认为每个 Node.js 程序配置了 2 个节点，请参考以下文件：

```
/data/gravity-prototype/nginx/conf/upstream.conf
```

以 gravity-facebook 为例，按照 Nginx 的配置，应运行如下 2 个容器：

```
docker run --name gravity-facebook-a -d -p 3020:3000 -v /data/gravity-prototype/gravity-facebook:/app -v /data/gravity-prototype/logs:/logs node-pm2
docker run --name gravity-facebook-b -d -p 3021:3000 -v /data/gravity-prototype/gravity-facebook:/app -v /data/gravity-prototype/logs:/logs node-pm2
```

假如只运行了一个容器，收到 gravity-facebook 的 http 请求时，会在 `nginx_error.log` 中产生 `connect() failed` 的日志，但请不要担心，请求仍会顺利的传递到正在运行的那一个容器。

## Multiple Processes

本项目 Node.js 程序使用了 Cluster 来创建多进程，在多核 CPU 下，会创建 1 个主进程和 N 个工作进程（N = CPU 核心数）

> 请注意：不要使用 PM2 之类的进程管理软件来实现多进程，这会导致系统资源开销过大、日志丢失等问题。

## Log System

本项目所有日志都会保存到 `/logs` 目录下。

所有日志的打印时间都为 0 时区时间。

Nginx 日志使用 Nginx 默认格式，分为：

* 进站日志：nginx_access.log
* 错误日志：nginx_error.log

Node.js 日志使用自定义格式，以 gravity-facebook 为例，分为：

* 进站日志：gravity_facebook_access.log
* 应用日志：gravity_facebook_app.log
* 错误日志：gravity_facebook_error.log
* 所有日志：gravity_facebook_all.log

其中，进站日志格式为：
```r
:method :url :status :content-length :response-timems
```

进站日志、应用日志、错误日志都由 Log4js 模块创建，超过 10M 会自动分割备份，最多保留 5 个备份文件。

“所有日志”由 PM2 创建，不会分割，永久保留。
