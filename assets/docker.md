# 背景
在上一篇的部署过程中，完全是把服务器当成本地开发环境来用，在服务器上拉取代码、安装依赖、运行代码，这样的部署过程过于原始了，部署步骤多，效率低；依赖直接全局安装，污染全局环境，不同项目没有做到隔离。部署流程急需升级。

# 使用docker简化部署
第一步的优化是上传构建产物代替上传源码，这样在服务器上就只需要运行构建产物这一个步骤了。

## 为什么需要docker
一个服务的运行需要通常各种各样的依赖环境，前端服务至少需要nginx和node，如果在每个服务器上都需要把这些环境都配置一遍，即使是非常熟练的工程师也不免觉得繁琐。如果存在一种技术，能生成一个完全的构建产物，这个构建产物包含了服务运行所包含的全部依赖，直接运行这个构建产物就能把服务跑起来就好了。

<br/>**容器化技术**就是我们所需要的解决方案。容器化技术有两个重要概念
* 镜像：镜像是一个只读的模板，包含了运行应用所需的所有代码、库、依赖和设置。它可以被看作是容器的蓝图。镜像用于创建容器。
* 容器：容器是镜像的一个运行实例，可以理解为容器就是应用+依赖+运行环境，容器具有以下特点
    *  **隔离性**：容器提供了一个独立的运行环境，隔离了不同容器间的应用程序和进程，使它们不会相互影响。
    * **可移植性**：由于容器包含了应用及其所有依赖，可以在任何支持 Docker 的系统上运行，从开发环境到生产环境都能保持一致。
    * 轻量级：容器不需要额外的操作系统开销，相比虚拟机更节省资源和启动更快。

容器的更多优点不再赘述，想要使用容器，就需要用到docker了，docker可以让我们方便的创建和使用容器。
下面以前端项目为例，介绍使用docker部署的流程。

## docker常用命令
```bash
# 构建镜像，docker build -t 用户名/镜像名:镜像tag .
docker build -t mhhongfe/deploy-fe-demo:1.0 .

# 查看镜像
docker images

# 删除镜像
docker rmi 镜像ID

# 推送镜像到docker hub 
docker push 镜像名称

# 拉取镜像
docker pull 镜像名称

# 启动容器
docker start 容器ID

# 根据镜像创建新容器，并运行容器
docker run -p 8080:80 mhhongfe/deploy-fe-demo:1.0

# 查看运行中容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器运行
docker stop 容器ID

# 删除容器
docker rm 容器ID

```

## 本地构建镜像
1. 准备一个前端应用
直接用vue-cli创建的项目，上传至github，[前端服务](https://github.com/mhhong-fe/deploy-fe-demo)

2. 安装docker
    * 官网下载docker客户端：<https://docs.docker.com/desktop/install/mac-install/>（这里是mac版本）
    * 客户端安装后可以使用github账号登陆，登陆后命令行输入docker -v，显示docker版本信息则安装成功

3. 编写dockerfile
   <br/>dockerfile就是描述创建镜像流程的配置文件，详细语法可参考[菜鸟教程](https://www.runoob.com/docker/docker-dockerfile.html)
   ```bash
    # 使用官方 Node.js 镜像作为构建基础镜像
    FROM node:18.17.1 AS builder

    # 安装 pnpm
    RUN npm install -g pnpm@8.7.0

    # 设置工作目录
    WORKDIR /app

    # 复制 package.json 和 pnpm-lock.yaml（如果有的话）到工作目录
    COPY package*.json pnpm-lock.yaml* ./

    # 安装应用依赖
    RUN pnpm install

    # 复制应用源代码到工作目录
    COPY . .

    # 构建应用
    RUN pnpm run build

    # 使用 Nginx 镜像作为生产环境镜像
    FROM nginx:alpine

    # 将构建产物从 /app/dist 复制到 Nginx 的默认服务目录
    COPY --from=builder /app/dist /usr/share/nginx/html

    # 暴露端口 80
    EXPOSE 80

    # 启动 Nginx
    CMD ["nginx", "-g", "daemon off;"]

    ```
4. 本地构建镜像
   ```
    # 构建镜像，这样命名方便后续推送到docker hub中
    docker build -t 用户名/镜像名:镜像tag .

    # m系列芯片需要指定构建平台，不然在服务器上会出现平台不兼容的问题
    # docker: image with reference dockerpull.com/mhhongfe/deploy-fe-demo:1.0 was found but does not match the specified platform: wanted linux/amd64, actual: linux/arm64.
    docker buildx build --platform linux/amd64 -t mhhongfe/deploy-fe-demo:2.0 .
    
   ```
   构建完之后，可以在docker客户端查看构建好的镜像
   
    ![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/94ab9ab4836a428cb376e9071e3c2ae9~tplv-73owjymdk6-jj-mark:0:0:0:0:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzA0MzA2MDQwNzYwNzU2MCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724300718&x-orig-sign=oK6XYhAMxhtFrcxatqmgPLiO8sA%3D)
5. 本地运行镜像
    构建好之后在本地先运行看看效果
    ```
    # 容器内是运行在80端口上，宿主机上的映射是3000端口
    docker run -p 3000:80 mhhongfe/deploy-fe-demo:2.0
    ```
   本地访问localhost:3000，顺利看到效果
   
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/856d76faf3474d7ca6bd93e3429fb97b~tplv-73owjymdk6-jj-mark:0:0:0:0:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzA0MzA2MDQwNzYwNzU2MCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724300718&x-orig-sign=guJvlCdkXHOGm%2Fq0HHXL%2FgJDbV0%3D)
   
## 在服务器上运行容器
1. 把镜像推送到docker hub
    ```
    docker push mhhongfe/deploy-fe-demo:2.0 
    ```
2. 服务器上安装docker
    <br/>在阿里云服务器上安装docker，参考[安装文档](https://help.aliyun.com/zh/ecs/use-cases/install-and-use-docker-on-a-linux-ecs-instance?spm=5176.21213303.J_qCOwPWspKEuWcmp8qiZNQ.11.143d2f3dhvVcDH&scm=20140722.S_help@@%E6%96%87%E6%A1%A3@@51853._.ID_help@@%E6%96%87%E6%A1%A3@@51853-RL_%E5%AE%89%E8%A3%85docker-LOC_llm-OR_ser-V_3-RE_new4@@cardNew-P0_0)
3. 拉取镜像
    ```
    docker pull mhhongfe/deploy-fe-demo:2.0
    ```
    这一步因为各种原因，可能会出现超时，错误如下：
    ```
    error pulling image configuration: download failed after attempts=6: dial tcp 69.63.176.143:443: i/o timeout
    ```
    网上的解决方案都是配置各种国内的镜像源，但不少镜像源都不能用，最终使用dockerpull.com镜像源解决，不知道这个源能坚持多久，菜鸟学点技术真不容易。
    [镜像源配置参考](https://dockerpull.com/)
    
4. 运行容器
    ```
    docker run -d -p 8080:80 dockerpull.com/mhhongfe/deploy-fe-demo:2.0
    ```
使用服务器ip:8080访问服务，成功访问！

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/3b3bdf8ddb4f49af886de0ca1387581d~tplv-73owjymdk6-jj-mark:0:0:0:0:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzA0MzA2MDQwNzYwNzU2MCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724300718&x-orig-sign=GDBvrQfF3AywGaYqp75QgF8iIZI%3D)

## 总结
第一阶段成功完成，使用docker去除了依赖安装的流程，做到了不同项目的隔离，部署流程做到了较大的简化，目前在服务器上只需要拉取镜像、运行镜像两步。
<br/>踩了两个坑
* 服务器是linux/amd64，但m系列mac上默认镜像是linux/arm64平台，不能自动兼容。解决方案是指定构建的镜像平台，通过docker buildx模拟跨平台，docker能跨操作系统提供一致的环境，但还不能跨硬件架构自动兼容。
* 从docker hub上拉取镜像，一直报超时。配置国内的镜像源可以暂时解决，但是镜像源也会被封禁，这个问题怎么解决？
