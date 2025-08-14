# 环境配置使用指南

## 📋 重要说明

**为了使用环境变量功能，您需要手动重命名以下文件：**

```bash
# 重命名环境配置文件
mv env.development .env.development
mv env.production .env.production
```

## 🔧 环境配置说明

### 开发环境配置 (.env.development)

用于本地开发和测试环境：

```bash
# 开发环境配置
NODE_ENV = 'development'

# 开发环境接口地址
VITE_APP_BASE_API = '/api'
VITE_SERVE = 'http://172.22.44.99:8080'

# 应用标题
VITE_APP_TITLE = 'SKID检测系统'

# 是否开启Mock
VITE_USE_MOCK = true
```

### 生产环境配置 (.env.production)

用于生产部署环境：

```bash
# 生产环境配置
NODE_ENV = 'production'

# 生产环境接口地址
VITE_APP_BASE_API = '/api'
VITE_SERVE = 'http://your-production-server:8080'

# 应用标题
VITE_APP_TITLE = 'SKID检测系统'

# 是否开启Mock
VITE_USE_MOCK = false
```

## 🚀 使用步骤

### 1. 重命名配置文件
```bash
mv env.development .env.development
mv env.production .env.production
```

### 2. 修改生产环境配置
编辑 `.env.production` 文件，将 `VITE_SERVE` 修改为实际的生产服务器地址。

### 3. 运行项目
```bash
# 开发环境
npm run dev

# 生产构建
npm run build:pro
```

## 📊 优化内容总结

### ✅ 已完成的优化：

1. **vite.config.ts**
   - ✅ 添加文件头注释（符合项目规范）
   - ✅ 修复 viteMockServe 配置错误
   - ✅ 规范代码格式和结构
   - ✅ 添加生产环境构建优化
   - ✅ 使用环境变量替代硬编码

2. **环境变量配置**
   - ✅ 创建开发环境配置 (env.development)
   - ✅ 创建生产环境配置 (env.production)
   - ✅ 统一环境变量管理

3. **src/utils/request.ts**
   - ✅ 添加文件头注释
   - ✅ 使用环境变量替代硬编码API地址
   - ✅ 保持原有功能完整性

4. **src/setting.ts**
   - ✅ 添加文件头注释
   - ✅ 统一API地址管理
   - ✅ 使用环境变量配置所有API路径

## 🎯 优化效果

### 代码规范
- ✅ 所有修改文件都符合项目代码规范
- ✅ 统一的文件头注释格式
- ✅ 规范的代码结构

### 配置管理
- ✅ 消除所有硬编码问题
- ✅ 支持多环境部署
- ✅ 集中化配置管理

### 构建优化
- ✅ 生产环境代码分包
- ✅ 移除调试信息
- ✅ 资源优化配置

## ⚠️ 注意事项

1. **环境变量文件重命名**：必须将 `env.*` 文件重命名为 `.env.*` 才能生效。

2. **生产环境配置**：部署前请确保修改 `.env.production` 中的服务器地址。

3. **Git 管理**：建议将 `.env.*` 文件添加到 `.gitignore` 中，避免敏感信息泄露。

4. **构建脚本**：使用 `npm run build:pro` 进行生产环境构建。

---

**优化完成！现在您的项目具备了规范的代码结构和灵活的环境配置管理能力。**