import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量，指定.env文件的完整路径
dotenv.config({ path: path.resolve(__dirname, '.env') });

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

// 定义用户模型
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

// 定义目标模型
const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
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
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
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
  },
  repeating: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

// 设置用户和目标的关联关系
User.hasMany(Goal, {
  foreignKey: 'userId',
  as: 'goals'
});

Goal.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
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

// 设置用户和行动的关联关系
User.hasMany(Action, {
  foreignKey: 'userId',
  as: 'actions'
});

Action.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// 为了保持向后兼容，保留Task模型的引用
const Task = Goal;

// 认证相关路由

// 用户注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, phone, email } = req.body;
    
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }
    
    // 注意：在实际生产环境中，应该使用bcrypt等库对密码进行加密
    // 这里为了演示简化了实现
    const user = await User.create({
      username,
      password,
      phone,
      email
    });
    
    // 不返回密码信息
    const userData = {
      id: user.id,
      username: user.username,
      phone: user.phone,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.status(201).json({
      message: '注册成功',
      user: userData
    });
  } catch (error) {
    console.error('注册用户失败:', error);
    res.status(500).json({ message: '注册失败，请稍后再试', error: error.message });
  }
});

// 用户登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 注意：在实际生产环境中，应该使用bcrypt等库验证密码
    // 这里为了演示简化了实现
    if (user.password !== password) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成令牌（实际生产环境中应该使用JWT）
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    // 不返回密码信息
    const userData = {
      id: user.id,
      username: user.username,
      phone: user.phone,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.json({
      message: '登录成功',
      user: userData,
      token
    });
  } catch (error) {
    console.error('用户登录失败:', error);
    res.status(500).json({ message: '登录失败，请稍后再试', error: error.message });
  }
});

// 手机号验证码登录（简化实现）
app.post('/api/auth/login/phone', async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    // 查找用户
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(401).json({ message: '手机号或验证码错误' });
    }
    
    // 注意：在实际生产环境中，应该验证真实的验证码
    // 这里为了演示简化了实现，假设验证码总是正确的
    
    // 生成令牌（实际生产环境中应该使用JWT）
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    // 不返回密码信息
    const userData = {
      id: user.id,
      username: user.username,
      phone: user.phone,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.json({
      message: '登录成功',
      user: userData,
      token
    });
  } catch (error) {
    console.error('手机号登录失败:', error);
    res.status(500).json({ message: '登录失败，请稍后再试', error: error.message });
  }
});

// 发送验证码（简化实现）
app.post('/api/auth/send-code', async (req, res) => {
  try {
    const { phone } = req.body;
    
    // 生成验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 注意：在实际生产环境中，应该通过短信服务发送真实的验证码
    // 这里为了演示简化了实现
    console.log(`验证码: ${verificationCode} (发送到手机: ${phone})`);
    
    res.json({
      success: true,
      message: '验证码发送成功',
      data: {
        phone,
        verificationCode,
        expireAt: new Date(Date.now() + 5 * 60 * 1000) // 5分钟后过期
      }
    });
  } catch (error) {
    console.error('发送验证码失败:', error);
    res.status(500).json({ message: '发送验证码失败，请稍后再试', error: error.message });
  }
});

// 路由

// 获取所有目标
app.get('/api/goals', async (req, res) => {
  try {
    // 从查询参数中获取用户ID（客户端已在请求中添加）
    // 在实际生产环境中，应该从JWT或其他认证方式中获取
    const userId = req.query.userId || 1; // 默认值仅用于演示
    
    // 默认获取未完成的目标
    const goals = await Goal.findAll({
      where: {
        userId,
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
    // 从查询参数中获取用户ID（客户端已在请求中添加）
    const userId = req.query.userId || 1;
    
    // 默认获取未完成的行动
    const actions = await Action.findAll({
      where: {
        userId,
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
    // 从查询参数中获取用户ID（客户端已在请求中添加）
    const userId = req.query.userId || 1;
    
    const actions = await Action.findAll({
      where: {
        goalId: req.params.goalId,
        userId,
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
    // 从请求体中获取用户ID（客户端已在请求中添加）
    const userId = req.body.userId || 1;
    
    const action = await Action.create({
      ...req.body,
      userId
    });
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
    // 从请求体中获取用户ID（客户端已在请求中添加）
    const userId = req.body.userId || 1;
    
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId
      }
    });
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
    // 从请求体中获取用户ID（客户端已在请求中添加）
    const userId = req.body.userId || 1;
    
    const action = await Action.findOne({
      where: {
        id: req.params.id,
        userId
      }
    });
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
    // 从查询参数中获取用户ID（客户端已在请求中添加）
    const userId = req.query.userId || 1;
    
    // 默认获取未完成的任务
    const tasks = await Task.findAll({
      where: {
        userId,
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
    // 从查询参数中获取用户ID（客户端已在请求中添加）
    const userId = req.query.userId || 1;
    
    // 获取已完成的目标
    const completedGoals = await Task.findAll({
      where: {
        userId,
        completed: true
      }
    });
    
    // 获取已完成的行动
    const completedActions = await Action.findAll({
      where: {
        userId,
        completed: true
      }
    });
    
    // 合并已完成的目标和行动并返回
    // 注意：对于客户端的区分逻辑，目标没有goalId，行动有goalId
    const allCompletedTasks = [...completedGoals, ...completedActions];
    res.json(allCompletedTasks);
  } catch (error) {
    console.error('获取已完成任务失败:', error);
    res.status(500).json({ message: '获取已完成任务失败', error: error.message });
  }
});

// 获取单个任务
app.get('/api/tasks/:id', async (req, res) => {
  try {
    // 从查询参数中获取用户ID（客户端已在请求中添加）
    const userId = req.query.userId || 1;
    
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId
      }
    });
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
    // 从请求体中获取用户ID（客户端已在请求中添加）
    const userId = req.body.userId || 1;
    
    const task = await Task.create({
      ...req.body,
      userId
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('创建任务失败:', error);
    res.status(400).json({ message: '创建任务失败', error: error.message });
  }
});

// 更新任务
app.put('/api/tasks/:id', async (req, res) => {
  try {
    // 从请求体中获取用户ID（客户端已在请求中添加）
    const userId = req.body.userId || 1;
    
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId
      }
    });
    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }
    // 确保用户不能修改userId
    const updateData = { ...req.body };
    delete updateData.userId;
    await task.update(updateData);
    res.json(task);
  } catch (error) {
    console.error('更新任务失败:', error);
    res.status(400).json({ message: '更新任务失败', error: error.message });
  }
});

// 部分更新任务（支持PATCH请求）
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    // 从请求体中获取用户ID（客户端已在请求中添加）
    const userId = req.body.userId || 1;
    
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId
      }
    });
    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }
    // 确保用户不能修改userId
    const updateData = { ...req.body };
    delete updateData.userId;
    await task.update(updateData);
    res.json(task);
  } catch (error) {
    console.error('更新任务失败:', error);
    res.status(400).json({ message: '更新任务失败', error: error.message });
  }
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    // 从查询参数中获取用户ID（客户端已在请求中添加）
    const userId = req.query.userId || 1;
    
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId
      }
    });
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
const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // 检查是否需要强制重建表（仅在开发环境使用）
    const forceRebuild = process.env.NODE_ENV === 'development' && process.argv.includes('--force-rebuild');
    
    // 选择同步模式
    if (forceRebuild) {
      console.log('⚠️  强制重建表结构（将删除所有现有数据）...');
      await sequelize.sync({ force: true });
      console.log('✅  表结构已重建');
    } else {
      // 尝试使用alter模式同步
      try {
        await sequelize.sync({ alter: true });
        console.log('✅  数据库已同步（已应用模型更改）');
      } catch (alterError) {
        // 如果alter模式失败（可能是索引过多问题），使用安全模式
        console.warn('⚠️  alter模式同步失败，使用安全模式同步:', alterError.message);
        await sequelize.sync({ alter: { drop: false } });
        console.log('✅  数据库已安全同步');
      }
    }
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
      if (process.env.NODE_ENV === 'development') {
        console.log('💡  提示：如果需要强制重建表结构，请使用命令：node server/index.js --force-rebuild');
      }
    });
  } catch (error) {
    console.error('❌  启动服务器失败:', error);
    console.error('详细错误:', JSON.stringify(error, null, 2));
  }
}

startServer();