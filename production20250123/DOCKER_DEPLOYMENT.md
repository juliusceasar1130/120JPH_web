# Docker + Nginx 生产环境部署指南

> 最后修改时间：2025-08-11 16:40  
> 作者：Docker部署配置  
> 功能：Vue3项目完整的Docker部署方案  

## 📋 部署方案概述

本方案采用 **Docker Compose + 多阶段构建** 的现代化部署架构：

- **构建阶段**：Node.js 18 Alpine + PNPM（高效构建）
- **生产阶段**：Nginx 1.25 Alpine（轻量运行）
- **编排工具**：Docker Compose（统一管理）
- **安全特性**：非root用户 + 健康检查

## 🏗️ 架构图

```
源码 → Docker多阶段构建 → Nginx容器 → 用户访问
  ↓
环境隔离 → 自动化构建 → 性能优化 → 高可用性
```

## 📁 文件结构

部署相关文件如下：

```
production20250123/
├── Dockerfile              # 多阶段构建配置
├── docker-compose.yml      # 服务编排配置
├── nginx.conf              # Nginx生产环境配置
├── .dockerignore           # Docker构建排除文件
├── .env.docker             # 环境变量配置示例
└── DOCKER_DEPLOYMENT.md    # 本部署文档
```

## 🚀 快速开始

### 1. 环境准备

确保您的服务器安装了以下工具：

```bash
# 检查Docker版本（要求 >= 20.0）
docker --version

# 检查Docker Compose版本（要求 >= 2.0）
docker-compose --version

# 确保Docker服务运行中
sudo systemctl status docker
```

### 2. 克隆项目并配置

```bash
# 进入项目目录
cd production20250123

# 检查必要文件是否存在
ls -la Dockerfile docker-compose.yml nginx.conf

# 创建日志目录
mkdir -p logs/nginx

# 设置环境变量（可选）
cp .env.docker .env
```

### 3. 一键部署

```bash
# 构建并启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f vue-app
```

### 4. 验证部署

```bash
# 检查容器运行状态
docker ps

# 检查健康状态
curl http://localhost/health

# 访问应用
curl http://localhost
```

## 📖 详细部署步骤

### 步骤1：配置环境变量（可选）

```bash
# 复制环境变量文件
cp .env.docker .env

# 根据需要编辑环境变量
nano .env
```

### 步骤2：构建Docker镜像

```bash
# 仅构建镜像（不启动）
docker-compose build

# 强制重新构建（清除缓存）
docker-compose build --no-cache

# 查看构建的镜像
docker images | grep vue3
```

### 步骤3：启动服务

```bash
# 后台启动所有服务
docker-compose up -d

# 前台启动（查看实时日志）
docker-compose up

# 启动指定服务
docker-compose up -d vue-app
```

### 步骤4：服务管理

```bash
# 查看服务状态
docker-compose ps

# 查看资源使用情况
docker stats

# 重启服务
docker-compose restart vue-app

# 停止服务
docker-compose stop

# 停止并删除容器
docker-compose down
```

## 🔧 高级配置

### 自定义端口映射

编辑 `docker-compose.yml`：

```yaml
services:
  vue-app:
    ports:
      - "8080:80"  # 映射到8080端口
      - "8443:443" # HTTPS端口
```

### 添加域名访问

1. 修改 `nginx.conf` 中的 `server_name`：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    # 其他配置...
}
```

2. 重新构建并启动：

```bash
docker-compose up -d --build
```

### 启用HTTPS（SSL）

1. 准备SSL证书文件
2. 创建ssl目录并放置证书
3. 修改nginx.conf添加SSL配置
4. 修改docker-compose.yml挂载证书目录

### 性能优化配置

```bash
# 增加系统资源限制
docker-compose up -d --scale vue-app=2

# 查看详细资源使用
docker-compose top
```

## 📊 监控与日志

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs vue-app

# 实时跟踪日志
docker-compose logs -f --tail=100 vue-app

# 查看Nginx访问日志
docker exec -it vue3-production-app tail -f /var/log/nginx/access.log
```

### 健康检查

```bash
# 手动健康检查
curl http://localhost/health

# 查看容器健康状态
docker inspect vue3-production-app | grep Health -A 10
```

### 性能监控

```bash
# 查看容器资源使用
docker stats vue3-production-app

# 查看详细系统信息
docker exec -it vue3-production-app top
```

## 🛠️ 故障排查

### 常见问题及解决方案

#### 1. 构建失败

```bash
# 清理Docker缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache

# 检查磁盘空间
df -h
```

#### 2. 服务无法启动

```bash
# 查看详细错误日志
docker-compose logs vue-app

# 检查端口占用
netstat -tlnp | grep :80

# 查看容器内部
docker exec -it vue3-production-app sh
```

#### 3. 访问404错误

```bash
# 检查Nginx配置
docker exec -it vue3-production-app nginx -t

# 查看文件是否正确复制
docker exec -it vue3-production-app ls -la /usr/share/nginx/html
```

#### 4. 性能问题

```bash
# 检查资源使用
docker stats

# 调整资源限制
# 编辑 docker-compose.yml 中的 deploy.resources 部分
```

## 🔄 版本更新流程

### 1. 停止当前服务

```bash
docker-compose down
```

### 2. 更新代码

```bash
git pull origin main
# 或手动更新源码
```

### 3. 重新构建并启动

```bash
docker-compose up -d --build
```

### 4. 验证更新

```bash
curl http://localhost/health
```

## 📦 生产环境最佳实践

### 1. 安全配置

- 使用非root用户运行容器
- 启用健康检查机制
- 设置资源限制
- 定期更新基础镜像

### 2. 性能优化

- 启用Gzip压缩
- 配置静态资源缓存
- 使用CDN加速
- 监控资源使用情况

### 3. 备份策略

```bash
# 备份重要配置
tar -czf docker-config-backup.tar.gz \
  docker-compose.yml \
  nginx.conf \
  Dockerfile \
  .env

# 备份日志
tar -czf logs-backup.tar.gz logs/
```

### 4. 自动化部署

可以结合CI/CD工具（如Jenkins、GitLab CI等）实现自动化部署：

```bash
#!/bin/bash
# deploy.sh
git pull
docker-compose down
docker-compose up -d --build
```

## 🆘 紧急处理

### 快速回滚

```bash
# 停止当前版本
docker-compose down

# 回滚到上一个镜像版本
docker tag vue3-app:latest vue3-app:backup
docker-compose up -d
```

### 应急访问

```bash
# 进入容器排查
docker exec -it vue3-production-app sh

# 临时修改配置（重启后失效）
docker exec -it vue3-production-app vi /etc/nginx/nginx.conf
docker exec -it vue3-production-app nginx -s reload
```

## 📞 技术支持

如遇到问题，请提供以下信息：

1. 运行环境信息：`docker version` 和 `docker-compose version`
2. 错误日志：`docker-compose logs vue-app`
3. 系统资源：`docker stats`
4. 网络状态：`docker network ls`

---

**🎉 恭喜！您已成功完成Vue3项目的Docker容器化部署！**