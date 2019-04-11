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
docker run --name nginx -d -p 80:80 -p 443:443 -v /data/gravity-prototype/nginx:/etc/nginx -v /data/gravity-prototype/logs:/logs nginx
```

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
pm2 start pm2.json
```
