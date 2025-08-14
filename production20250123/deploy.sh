#!/bin/bash
# 最后修改时间->2025-08-11 16:40
# 作者：Docker部署配置
# 功能：Vue3项目一键部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查部署环境..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    # 检查Docker服务状态
    if ! docker info &> /dev/null; then
        log_error "Docker 服务未运行，请启动 Docker 服务"
        exit 1
    fi
    
    log_info "环境检查通过 ✓"
}

# 清理旧容器
cleanup_old() {
    log_info "清理旧容器和镜像..."
    
    # 停止并删除旧容器
    if docker-compose ps | grep -q "vue3-production-app"; then
        docker-compose down
        log_info "旧容器已停止"
    fi
    
    # 清理悬挂镜像
    docker image prune -f
    log_info "悬挂镜像已清理"
}

# 构建应用
build_app() {
    log_info "开始构建 Vue3 应用..."
    
    # 创建必要目录
    mkdir -p logs/nginx
    
    # 构建镜像
    docker-compose build --no-cache
    
    if [ $? -eq 0 ]; then
        log_info "应用构建成功 ✓"
    else
        log_error "应用构建失败"
        exit 1
    fi
}

# 启动服务
start_services() {
    log_info "启动 Docker 服务..."
    
    # 启动服务
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        log_info "服务启动成功 ✓"
    else
        log_error "服务启动失败"
        exit 1
    fi
}

# 健康检查
health_check() {
    log_info "进行健康检查..."
    
    # 等待服务启动
    sleep 10
    
    # 检查容器状态
    if docker-compose ps | grep -q "Up"; then
        log_info "容器运行正常 ✓"
    else
        log_error "容器启动异常"
        docker-compose logs
        exit 1
    fi
    
    # 检查HTTP响应
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f http://localhost/health &> /dev/null; then
            log_info "应用健康检查通过 ✓"
            break
        else
            log_warn "等待应用启动... ($((attempt + 1))/$max_attempts)"
            sleep 2
            attempt=$((attempt + 1))
        fi
    done
    
    if [ $attempt -eq $max_attempts ]; then
        log_error "应用健康检查超时"
        docker-compose logs
        exit 1
    fi
}

# 显示部署信息
show_info() {
    log_info "部署完成！🎉"
    echo ""
    echo "访问地址："
    echo "  - 主页: http://localhost"
    echo "  - 健康检查: http://localhost/health"
    echo ""
    echo "管理命令："
    echo "  - 查看状态: docker-compose ps"
    echo "  - 查看日志: docker-compose logs -f"
    echo "  - 停止服务: docker-compose down"
    echo "  - 重启服务: docker-compose restart"
    echo ""
    echo "监控命令："
    echo "  - 资源使用: docker stats"
    echo "  - 容器详情: docker inspect vue3-production-app"
}

# 主函数
main() {
    echo "=========================================="
    echo "Vue3 Docker 部署脚本"
    echo "=========================================="
    
    check_dependencies
    cleanup_old
    build_app
    start_services
    health_check
    show_info
}

# 脚本参数处理
case "$1" in
    "stop")
        log_info "停止所有服务..."
        docker-compose down
        log_info "服务已停止"
        ;;
    "restart")
        log_info "重启服务..."
        docker-compose restart
        log_info "服务已重启"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        docker-compose ps
        ;;
    "clean")
        log_info "清理所有容器和镜像..."
        docker-compose down -v --rmi all
        docker system prune -a -f
        log_info "清理完成"
        ;;
    *)
        main
        ;;
esac