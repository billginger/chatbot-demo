# Gravity Prototype

Build a multilingual chatbot to integrate with WeChat and Facebook

## 使用 Docker 镜像

以挂载本地目录和配置文件的方式运行容器：

```r
docker run --name nginx -d -p 80:80 -v /data/gravity-prototype/nginx:/etc/nginx -v /data/gravity-prototype/logs:/logs nginx
```
