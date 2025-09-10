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

// 数据库连接 - 使用MySQL服务器
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

// 定义目标模型
const Goal = sequelize.define('Goal', {
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
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  marked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

// 定义行动模型
const Action = sequelize.define('Action', {
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
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  marked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

// 设置目标和行动的关联关系
Goal.hasMany(Action, {
  foreignKey: 'goalId',
  as: 'actions'
});

Action.belongsTo(Goal, {
  foreignKey: 'goalId',
  as: 'goal'
});

// 为了保持向后兼容，保留Task模型的引用
const Task = Goal;

// 路由

// 获取所有目标
app.get('/api/goals', async (req, res) => {
  try {
    // 默认获取未完成的目标
    const goals = await Goal.findAll({
      where: {
        completed: false
      },
      include: [{ model: Action, as: 'actions', where: { completed: false }, required: false }]
    });
    res.json(goals);
  } catch (error) {
    console.error('获取目标失败:', error);
    res.status(500).json({ message: '获取目标失败', error: error.message });
  }
});

// 获取所有行动
app.get('/api/actions', async (req, res) => {
  try {
    // 默认获取未完成的行动
    const actions = await Action.findAll({
      where: {
        completed: false
      },
      include: [{ model: Goal, as: 'goal' }]
    });
    res.json(actions);
  } catch (error) {
    console.error('获取行动失败:', error);
    res.status(500).json({ message: '获取行动失败', error: error.message });
  }
});

// 获取目标的所有行动
app.get('/api/goals/:goalId/actions', async (req, res) => {
  try {
    const actions = await Action.findAll({
      where: {
        goalId: req.params.goalId,
        completed: false
      }
    });
    res.json(actions);
  } catch (error) {
    console.error('获取行动失败:', error);
    res.status(500).json({ message: '获取行动失败', error: error.message });
  }
});

// 创建行动
app.post('/api/actions', async (req, res) => {
  try {
    const action = await Action.create(req.body);
    res.status(201).json(action);
  } catch (error) {
    console.error('创建行动失败:', error);
    res.status(400).json({ message: '创建行动失败', error: error.message });
  }
});

// 更新行动
app.put('/api/actions/:id', async (req, res) => {
  try {
    const action = await Action.findByPk(req.params.id);
    if (!action) {
      return res.status(404).json({ message: '行动不存在' });
    }
    await action.update(req.body);
    res.json(action);
  } catch (error) {
    console.error('更新行动失败:', error);
    res.status(400).json({ message: '更新行动失败', error: error.message });
  }
});

// 部分更新行动
app.patch('/api/actions/:id', async (req, res) => {
  try {
    const action = await Action.findByPk(req.params.id);
    if (!action) {
      return res.status(404).json({ message: '行动不存在' });
    }
    await action.update(req.body);
    res.json(action);
  } catch (error) {
    console.error('更新行动失败:', error);
    res.status(400).json({ message: '更新行动失败', error: error.message });
  }
});

// 删除行动
app.delete('/api/actions/:id', async (req, res) => {
  try {
    const action = await Action.findByPk(req.params.id);
    if (!action) {
      return res.status(404).json({ message: '行动不存在' });
    }
    await action.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('删除行动失败:', error);
    res.status(500).json({ message: '删除行动失败', error: error.message });
  }
});

// 标记/取消标记目标
app.patch('/api/goals/:id/mark', async (req, res) => {
  try {
    const goal = await Goal.findByPk(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: '目标不存在' });
    }
    await goal.update({ marked: !goal.marked });
    res.json(goal);
  } catch (error) {
    console.error('标记目标失败:', error);
    res.status(400).json({ message: '标记目标失败', error: error.message });
  }
});

// 标记/取消标记行动
app.patch('/api/actions/:id/mark', async (req, res) => {
  try {
    const action = await Action.findByPk(req.params.id);
    if (!action) {
      return res.status(404).json({ message: '行动不存在' });
    }
    await action.update({ marked: !action.marked });
    res.json(action);
  } catch (error) {
    console.error('标记行动失败:', error);
    res.status(400).json({ message: '标记行动失败', error: error.message });
  }
});

// 为了保持向后兼容，保留原有的任务API
// 获取所有任务
app.get('/api/tasks', async (req, res) => {
  try {
    // 默认获取未完成的任务
    const tasks = await Task.findAll({
      where: {
        completed: false
      }
    });
    res.json(tasks);
  } catch (error) {
    console.error('获取任务失败:', error);
    res.status(500).json({ message: '获取任务失败', error: error.message });
  }
});

// 获取已完成任务
app.get('/api/tasks/completed', async (req, res) => {
  try {
    const completedTasks = await Task.findAll({
      where: {
        completed: true
      }
    });
    res.json(completedTasks);
  } catch (error) {
    console.error('获取已完成任务失败:', error);
    res.status(500).json({ message: '获取已完成任务失败', error: error.message });
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

// 部分更新任务（支持PATCH请求）
app.patch('/api/tasks/:id', async (req, res) => {
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
    // 同步数据库模型（强制重建表以应用新的字段）
    await sequelize.sync({ alter: true });
    console.log('数据库已同步（已应用模型更改）');
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
  }
}

startServer();