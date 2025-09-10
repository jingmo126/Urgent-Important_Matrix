# MySQL服务器配置指南

本指南提供了在运行四象限任务管理系统时配置MySQL服务器的详细说明和常见问题解决方案。

## 安装MySQL服务器

### Windows系统

1. 从 [MySQL官方网站](https://dev.mysql.com/downloads/installer/) 下载MySQL Installer
2. 运行安装程序，选择"Developer Default"或"Server Only"
3. 按照安装向导完成安装
4. 在配置步骤中设置root用户密码（请记住这个密码）
5. 确保MySQL服务设置为自动启动

### macOS系统

使用Homebrew安装：

```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

### Linux系统

以Ubuntu为例：

```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

## 创建数据库和用户

### 登录MySQL

```bash
mysql -u root -p
# 输入root用户密码
```

### 创建数据库

```sql
CREATE DATABASE quadrant_tasks;
```

### 创建专用用户（可选但推荐）

为了安全起见，建议创建一个专用用户而不是使用root用户：

```sql
CREATE USER 'quadrant_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON quadrant_tasks.* TO 'quadrant_user'@'localhost';
FLUSH PRIVILEGES;
```

如果需要从其他主机访问MySQL服务器：

```sql
CREATE USER 'quadrant_user'@'%' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON quadrant_tasks.* TO 'quadrant_user'@'%';
FLUSH PRIVILEGES;
```

## 配置环境变量

在`server/.env`文件中配置数据库连接参数：

```
# 数据库配置
DB_HOST=localhost
DB_USER=root  # 或您创建的专用用户
DB_PASSWORD=your_mysql_password_here  # 您设置的MySQL密码
DB_NAME=quadrant_tasks

# 服务器配置
PORT=5000
NODE_ENV=development
```

## 常见问题与解决方案

### 1. "Access denied for user 'root'@'localhost'"错误

**可能的原因**：
- 密码不正确
- root用户配置问题
- 用户权限不足

**解决方案**：

重置root用户密码：

```bash
# 停止MySQL服务
sudo systemctl stop mysql  # Linux
# 或在Windows上通过服务管理器停止

# 以跳过权限检查的方式启动
mysqld_safe --skip-grant-tables &

# 连接到MySQL
mysql -u root

# 重置密码
USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;

# 退出并重启MySQL服务
EXIT;
sudo systemctl restart mysql  # Linux
# 或在Windows上通过服务管理器重启
```

### 2. "Can't connect to MySQL server on 'localhost'"错误

**可能的原因**：
- MySQL服务未启动
- 端口号错误
- 防火墙阻止连接

**解决方案**：

检查MySQL服务状态：

```bash
# Windows
services.msc  # 查看MySQL服务是否启动

# Linux
sudo systemctl status mysql

# macOS
brew services list
```

### 3. "Unknown database 'quadrant_tasks'"错误

**可能的原因**：
- 数据库未创建
- 数据库名称拼写错误

**解决方案**：

确保已创建名为`quadrant_tasks`的数据库：

```sql
SHOW DATABASES;
-- 如果没有quadrant_tasks，创建它
CREATE DATABASE quadrant_tasks;
```

## MySQL配置优化

对于生产环境，建议进行以下优化：

1. 修改`my.cnf`（Linux/macOS）或`my.ini`（Windows）文件：

```
[mysqld]
# 增加连接数
max_connections = 200

# 增加数据包大小限制
max_allowed_packet = 64M

# 启用慢查询日志（调试时使用）
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2
```

2. 定期备份数据库：

```bash
mysqldump -u root -p quadrant_tasks > quadrant_tasks_backup.sql
```

3. 为大表添加索引以提高查询性能：

```sql
USE quadrant_tasks;
ALTER TABLE Goals ADD INDEX idx_goals_priority (priority);
ALTER TABLE Actions ADD INDEX idx_actions_completed (completed);
```

## 连接测试

我们已经为您创建了一个详细的MySQL连接测试脚本，可以帮助您诊断和解决可能的连接问题。

### 使用命令行测试

可以使用以下命令测试MySQL连接是否正常：

```bash
# 使用环境变量中的配置进行连接测试
mysql -u ${DB_USER} -p${DB_PASSWORD} -h ${DB_HOST} ${DB_NAME}
```

### 使用Node.js测试脚本

项目中已经包含了一个名为`test-mysql-connection.js`的测试脚本，它可以：
- 验证数据库连接参数
- 测试与MySQL服务器的连接
- 检查指定数据库是否存在
- 提供详细的错误诊断和解决方案

运行测试脚本：

```bash
cd server
node test-mysql-connection.js
```

测试脚本会提供详细的连接状态信息和可能的解决方案，帮助您快速解决任何连接问题。

## 其他资源

- [MySQL官方文档](https://dev.mysql.com/doc/)
- [Sequelize文档](https://sequelize.org/docs/v6/)
- [MySQL 8.0参考手册](https://dev.mysql.com/doc/refman/8.0/en/)