# Gravity Prototype

Build a multilingual chatbot to integrate with WeChat and Facebook

## 使用 Docker 镜像

以挂载本地目录和配置文件的方式运行容器：

```
docker run --name nginx -d -p 80:80 -p 443:443 -v /data/gravity-prototype/nginx:/etc/nginx -v /data/gravity-prototype/logs:/logs nginx
```

重启容器：

```
docker restart nginx
```

在容器外重新加载 Nginx 配置文件：

```
docker exec nginx bash -c "nginx -s reload"
```
