# 最后修改时间->2025-08-11 16:40
# 作者：Docker部署配置
# 功能：Vue3项目多阶段构建Dockerfile

# ===============================
# 第一阶段：构建阶段 (Builder)
# ===============================
# 这是构建阶段的基础镜像，使用Node.js 18的alpine版本，命名为builder
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖
# 该命令用于在alpine系统中安装前端项目构建所需的依赖工具：
# - git：用于拉取依赖包或代码仓库
# - python3、make、g++：用于编译部分需要源码构建的npm依赖（如node-gyp相关包）
RUN apk add --no-cache git python3 make g++

# 设置npm镜像源并安装pnpm
# 使用pnpm的原因：
# 1. pnpm采用硬链接和内容寻址存储依赖，极大减少磁盘空间占用和安装时间，适合Docker多阶段构建场景。
# 2. 安装速度快，依赖一致性强，能有效避免node_modules冗余和依赖冲突。
# 3. 社区推荐，兼容性好，支持monorepo和现代前端项目最佳实践。
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm@latest --registry=https://registry.npmmirror.com

# 复制package.json和pnpm-lock.yaml（优化Docker层缓存）
COPY package.json pnpm-lock.yaml ./

# ✅ 新增：复制 scripts 目录（如果还有其他目录，也一起复制）
COPY scritps/ ./scritps/
# scripts/ （正确拼写）

# 安装项目依赖
RUN npm install -g pnpm@8.15.5 && \
    pnpm install --frozen-lockfile --prod=false

# 复制源代码
# 复制所有项目文件（包括源代码、配置、静态资源等）到容器工作目录
# 主要包括：
# - src/                # 源代码目录
# - public/             # 公共静态资源
# - vite.config.ts      # Vite配置文件
# - tsconfig.json       # TypeScript配置
# - .env*               # 环境变量文件
# - nginx.conf          # Nginx配置（如有）
# - 其他构建相关文件
COPY . .

# 构建生产环境代码
RUN pnpm run build:pro

# 验证构建结果
RUN ls -la dist/

# ===============================
# 第二阶段：生产阶段 (Production)
# ===============================
FROM nginx:1.25-alpine AS production

# 设置维护者信息
# 这些LABEL信息会作为镜像的元数据，显示在镜像详情中（如通过`docker inspect`命令查看），用于标识镜像的维护者、用途和版本等信息。
LABEL maintainer="前端Docker部署配置"
LABEL description="Vue3项目生产环境容器"
LABEL version="1.0"

# 安装必要工具
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache \
    tzdata \
    wget \
    curl \
    && rm -rf /var/cache/apk/*

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制Nginx配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 创建nginx运行所需目录
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /var/log/nginx \
    /run/nginx

# 设置目录权限
RUN chown -R nginx:nginx /var/cache/nginx \
    /var/log/nginx \
    /usr/share/nginx/html \
    /run/nginx

# 设置文件权限
RUN chmod -R 755 /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# 切换到非root用户
USER nginx

# 启动Nginx
# 这是启动Nginx主进程，并让其以前台方式运行，保持容器持续运行
# -g "daemon off;" 的含义是让nginx以非守护进程（前台）方式运行，保持容器持续运行，不会自动后台退出
# 之所以要以前台方式运行，是因为Docker容器的主进程（PID 1）如果退出，容器就会停止。
# 让nginx以前台方式运行，可以保证容器生命周期与nginx主进程一致，避免容器提前退出。
CMD ["nginx", "-g", "daemon off;"]