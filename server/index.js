import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// 加载环境变量
dotenv.config();

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'quadrant_tasks',
  logging: false
});

// 定义任务模型
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  importance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5
  },
  urgency: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5
  },
  priority: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// 路由

// 获取所有任务
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error('获取任务失败:', error);
    res.status(500).json({ message: '获取任务失败', error: error.message });
  }
});

// 获取单个任务
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }
    res.json(task);
  } catch (error) {
    console.error('获取任务失败:', error);
    res.status(500).json({ message: '获取任务失败', error: error.message });
  }
});

// 创建任务
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error('创建任务失败:', error);
    res.status(400).json({ message: '创建任务失败', error: error.message });
  }
});

// 更新任务
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }
    await task.update(req.body);
    res.json(task);
  } catch (error) {
    console.error('更新任务失败:', error);
    res.status(400).json({ message: '更新任务失败', error: error.message });
  }
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }
    await task.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('删除任务失败:', error);
    res.status(500).json({ message: '删除任务失败', error: error.message });
  }
});

// 提供前端静态文件（生产环境）
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// 启动服务器
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 同步数据库模型
    await sequelize.sync();
    console.log('数据库已同步');
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
  }
}

startServer();