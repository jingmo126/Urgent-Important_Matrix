# Google Cloud 部署文档：四象限任务管理系统

本文档详细介绍如何将四象限任务管理系统部署到Google Cloud虚拟机实例上。

## 前提条件

- Google Cloud账号和项目
- 本地已安装Google Cloud SDK
- 基本的Linux命令行知识

## 第一部分：创建Google Cloud虚拟机实例

### 步骤1：创建VM实例

1. 登录[Google Cloud Console](https://console.cloud.google.com/)
2. 导航到"Compute Engine" > "VM实例"
3. 点击"创建实例"
4. 配置实例参数：
   - **名称**: 输入一个描述性名称（如`task-manager-instance`）
   - **区域/可用区**: 选择离目标用户最近的区域（如`asia-east1-a`）
   - **机器配置**: 推荐至少`1 vCPU`和`2 GB`内存
   - **引导磁盘**: 选择`Ubuntu 22.04 LTS`
   - **防火墙**: 勾选"允许HTTP流量"和"允许HTTPS流量"
5. 点击"创建"

### 步骤2：连接到VM实例

1. 在VM实例列表中，找到刚创建的实例
2. 点击"SSH"按钮连接到实例

## 第二部分：安装必要软件和配置环境

### 步骤1：更新系统包

```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装必要的工具
sudo apt install -y git curl build-essential
```

### 步骤2：安装Node.js和npm

```bash
# 安装Node.js 20（推荐版本）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
npm -v
```

### 步骤3：安装MySQL数据库

```bash
# 安装MySQL服务器
sudo apt install -y mysql-server

# 启动MySQL服务
sudo systemctl start mysql
sudo systemctl enable mysql

# 运行安全配置向导
sudo mysql_secure_installation
```

在安全配置向导中：
- 设置root密码
- 移除匿名用户
- 禁止root远程登录（可选，但推荐）
- 删除测试数据库
- 重新加载权限表

## 第三部分：配置数据库

### 步骤1：创建数据库和用户

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE quadrant_tasks;

# 创建数据库用户并设置密码
CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'your_secure_password';

# 授予用户权限
GRANT ALL PRIVILEGES ON quadrant_tasks.* TO 'taskuser'@'localhost';

# 刷新权限
FLUSH PRIVILEGES;

# 退出MySQL
EXIT;
```

**注意**：请将`your_secure_password`替换为强密码。

### 步骤2：验证数据库连接

```bash
mysql -u taskuser -p quadrant_tasks
# 如果成功登录，则表示数据库配置正确
EXIT;
```

## 第四部分：部署应用程序

### 步骤1：克隆项目代码

```bash
# 克隆代码仓库（替换为实际的仓库URL）
git clone https://github.com/yourusername/quadrant-task-manager.git

# 进入项目目录
cd quadrant-task-manager
```

### 步骤2：安装依赖

```bash
# 安装项目依赖
npm run install:all
```

### 步骤3：创建.env文件

```bash
# 进入服务器目录
cd server

# 创建.env文件
sudo nano .env
```

在.env文件中添加以下内容：

```env
# 数据库配置
DB_HOST=localhost
DB_USER=taskuser
DB_PASSWORD=your_secure_password
DB_NAME=quadrant_tasks

# 服务器配置
PORT=5000
NODE_ENV=production
```

**注意**：
- 将`your_secure_password`替换为之前设置的数据库密码
- 如果需要更改端口，可以修改PORT值

保存并退出编辑器（按`Ctrl+O`，然后按`Ctrl+X`）。

### 步骤4：构建前端应用

```bash
# 返回项目根目录
cd ..

# 构建前端应用
npm run build
```

## 第五部分：设置系统服务（PM2）

为了确保应用程序在服务器重启后能够自动启动，我们将使用PM2来管理Node.js进程。

### 步骤1：安装PM2

```bash
# 全局安装PM2
npm install -g pm2
```

### 步骤2：使用PM2启动应用

1. 首先，确保前端已经构建完成（在第四部分步骤4中已完成）

2. 使用PM2启动后端服务：

```bash
# 进入服务器目录
cd server

# 使用PM2命令启动后端服务（推荐）
PM2_HOME=~/.pm2 pm2 start index.js --name task-manager-api

# 返回项目根目录
cd ..
```

### 步骤3：设置PM2自动启动

```bash
# 配置PM2开机自启
PM2_HOME=~/.pm2 pm2 startup systemd -u $USER --hp $HOME

# 保存当前进程列表
PM2_HOME=~/.pm2 pm2 save

# 查看PM2进程状态
PM2_HOME=~/.pm2 pm2 status

# 查看应用日志
PM2_HOME=~/.pm2 pm2 logs task-manager-api
```

### 步骤4：PM2常用命令

```bash
# 启动应用
PM2_HOME=~/.pm2 pm2 start index.js --name task-manager-api

# 停止应用
PM2_HOME=~/.pm2 pm2 stop task-manager-api

# 重启应用
PM2_HOME=~/.pm2 pm2 restart task-manager-api

# 删除应用
PM2_HOME=~/.pm2 pm2 delete task-manager-api

# 监控应用
PM2_HOME=~/.pm2 pm2 monit
```

## 第六部分：配置Nginx作为反向代理（可选但推荐）

使用Nginx可以提供更好的性能、安全性和域名配置能力。

### 步骤1：安装Nginx

```bash
# 安装Nginx
sudo apt install -y nginx

# 启动Nginx服务
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 步骤2：配置Nginx反向代理

```bash
# 创建Nginx配置文件
sudo nano /etc/nginx/sites-available/task-manager
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com; # 替换为您的域名或VM的外部IP

    location / {
        proxy_pass http://localhost:5000; # 后端API端口（应用已集成前端）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**注意**：
- 将`your-domain.com`替换为您的域名或虚拟机的外部IP地址
- 由于应用已集成前端（通过server/index.js中的静态文件服务），我们只需代理到后端端口即可

保存配置文件并激活：

```bash
# 创建符号链接以启用站点
sudo ln -s /etc/nginx/sites-available/task-manager /etc/nginx/sites-enabled/

# 测试Nginx配置
sudo nginx -t

# 重新加载Nginx配置
sudo systemctl reload nginx
```

## 第七部分：配置防火墙规则

确保Google Cloud防火墙允许HTTP（80端口）和HTTPS（443端口）流量。如果您使用了自定义端口，也需要相应地配置防火墙规则。

1. 在Google Cloud Console中，导航到"VPC网络" > "防火墙"
2. 点击"创建防火墙规则"
3. 配置规则：
   - **名称**: 输入描述性名称（如`allow-web-traffic`）
   - **目标**: 指定目标标签
   - **来源过滤**: 选择`IP范围`并输入`0.0.0.0/0`
   - **协议和端口**: 选择`指定的协议和端口`并勾选`tcp`，然后输入`80, 443, 5000`（包含应用端口）
4. 点击"创建"

## 第八部分：验证部署

1. 打开浏览器，输入您的域名或VM的外部IP地址
2. 如果一切配置正确，您应该能够看到四象限任务管理系统的界面
3. 尝试添加、编辑和删除任务，确保系统功能正常
4. 检查数据库是否正确存储了任务数据

## 常见问题排查

### 数据库连接问题

- 确认.env文件中的数据库配置正确
- 检查MySQL服务是否正在运行：`sudo systemctl status mysql`
- 验证MySQL用户权限：`mysql -u taskuser -p quadrant_tasks`

### 服务器启动问题

- 检查PM2日志：`PM2_HOME=~/.pm2 pm2 logs task-manager-api`
- 确认Node.js版本兼容：项目推荐使用Node.js 14+版本
- 验证端口是否被占用：`sudo lsof -i :5000`

### 前端访问问题

- 检查Nginx配置：`sudo nginx -t`
- 查看Nginx错误日志：`sudo tail -f /var/log/nginx/error.log`
- 确认防火墙规则是否正确配置

## 维护建议

- 定期备份数据库：`mysqldump -u taskuser -p quadrant_tasks > backup.sql`
- 定期更新系统包：`sudo apt update && sudo apt upgrade -y`
- 监控应用程序日志：`PM2_HOME=~/.pm2 pm2 monit`
- 考虑为网站配置HTTPS证书（推荐使用Let's Encrypt）

---

部署完成后，您的四象限任务管理系统应该能够在Google Cloud虚拟机上稳定运行，为用户提供任务管理功能。