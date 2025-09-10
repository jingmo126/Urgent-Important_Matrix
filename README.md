# 四象限任务管理系统

一个基于Vue3和Express的响应式四象限任务管理系统，帮助用户通过重要性和紧急性来管理任务优先级。

## 技术栈

### 前端
- Vue 3 (组合式API)
- Vue Router
- Pinia (状态管理)
- Tailwind CSS (样式)
- Axios (HTTP请求)

### 后端
- Node.js
- Express
- MySQL
- Sequelize (ORM)

## 功能特点

- 四象限视图：根据任务的重要性和紧急性将任务分类到四个象限
- 优先级列表：按优先级排序的任务列表
- 响应式设计：适配各种屏幕尺寸
- 可折叠侧边栏：提供更多工作空间
- 任务管理：添加、编辑、删除任务
- 优先级计算：基于重要度和紧急度自动计算任务优先级

## 安装和运行

### 前提条件

- Node.js (v14+)
- MySQL

### 安装步骤

1. 克隆仓库

```bash
git clone <repository-url>
cd quadrant-task-manager
```

2. 安装依赖

```bash
npm run install:all
```

3. 配置数据库

- 创建MySQL数据库
  ```bash
  mysql -u root -p
  CREATE DATABASE quadrant_tasks;
  ```

- 配置环境变量
  - 复制 `server/.env.example` 文件并重命名为 `server/.env`
  - 修改 `.env` 文件中的数据库配置参数：
    ```
    # 数据库配置
    DB_HOST=localhost          # MySQL服务器地址
    DB_USER=root               # MySQL用户名
    DB_PASSWORD=password       # MySQL密码
    DB_NAME=quadrant_tasks     # 数据库名称
    
    # 服务器配置
    PORT=5000
    NODE_ENV=development
    ```
  - 确保您的MySQL服务器允许远程连接（如果需要）
  - 确保指定的用户有足够的权限访问quadrant_tasks数据库

### 启动指南

您可以选择以下两种方式之一启动应用：

#### 方式 1: 同时启动前后端服务器

```bash
npm run dev
```

这将同时启动：
- 前端服务器: http://localhost:3000
- 后端服务器: http://localhost:5000

#### 方式 2: 分别启动前后端服务器

1. **确保MySQL服务器正在运行**

2. **启动后端服务器** (在一个终端)

```bash
npm run dev:server
```

3. **启动前端服务器** (在另一个终端)

```bash
npm run dev:client
```

### 故障排除

如果遇到 `ECONNREFUSED` 错误或其他连接问题，请使用以下工具进行诊断：

1. **检查服务器状态**

```bash
node check-server-status.js
```

2. **测试数据库连接**

```bash
cd server
node test-mysql-connection.js
```

这些脚本会提供详细的诊断信息和解决方案建议。

## 使用说明

### 四象限视图

- 点击右上角的按钮切换展示模式和编辑模式
- 在编辑模式下，点击任务可以编辑，点击空白区域可以添加新任务
- 在展示模式下，鼠标悬停在象限上会放大该象限

### 优先级列表

- 显示按优先级排序的所有任务
- 可以直接添加、编辑和删除任务

### 任务属性

- 标题：任务名称
- 描述：任务详细说明（可选）
- 重要度：1-10的评分
- 紧急度：1-10的评分
- 优先级：自动计算，公式为 `重要度 × 0.4 + 紧急度 × 0.6`
- 截止日期：任务截止时间（可选）

## 构建生产版本

```bash
npm run build
```

## 许可证

MIT