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

- 创建MySQL数据库 `quadrant_tasks`
- 根据需要修改 `server/.env` 文件中的数据库配置

4. 启动开发服务器

```bash
npm run dev
```

这将同时启动前端和后端服务器：
- 前端: http://localhost:3000
- 后端: http://localhost:5000

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