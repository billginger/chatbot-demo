# Gravity Prototype

Build a multilingual chatbot to integrate with WeChat and Facebook

## 使用 Docker 镜像

### Nginx

拉取 Nginx 镜像：

```
docker pull nginx
```

以挂载本地目录和配置文件的方式运行容器：

```
docker run --name nginx -d -p 80:80 -p 443:443 -v /data/gravity-prototype/nginx:/etc/nginx -v /data/gravity-prototype/logs:/logs nginx
```

重启容器使新的配置文件生效（不建议）：

```
docker restart nginx
```

进入容器，先验证配置文件，再重载配置文件：

```
docker exec -it nginx bash
nginx -t
nginx -s reload
```

在容器外，先验证配置文件，再重载配置文件：

```
docker exec nginx bash -c "nginx -t"
docker exec nginx bash -c "nginx -s reload"
```
