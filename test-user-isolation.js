const http = require('http');

// 测试用户隔离功能
async function testUserIsolation() {
  console.log('开始测试用户隔离功能...');
  
  try {
    // 1. 创建用户A
    console.log('1. 创建用户A...');
    const userA = await registerUser('testuserA', 'passwordA');
    console.log('用户A创建成功:', userA);
    
    // 2. 登录用户A
    console.log('2. 登录用户A...');
    const loginResponseA = await loginUser('testuserA', 'passwordA');
    console.log('用户A登录成功');
    
    // 3. 用户A创建一个目标
    console.log('3. 用户A创建目标...');
    const goal = await createGoal(loginResponseA.user.id, {
      title: '用户A的测试目标',
      description: '只有用户A应该能看到这个目标',
      importance: 8,
      urgency: 6,
      priority: 7
    });
    console.log('用户A的目标创建成功:', goal);
    
    // 4. 创建用户B
    console.log('4. 创建用户B...');
    const userB = await registerUser('testuserB', 'passwordB');
    console.log('用户B创建成功:', userB);
    
    // 5. 登录用户B
    console.log('5. 登录用户B...');
    const loginResponseB = await loginUser('testuserB', 'passwordB');
    console.log('用户B登录成功');
    
    // 6. 用户B获取自己的目标列表
    console.log('6. 用户B获取目标列表...');
    const userBGoals = await getGoals(loginResponseB.user.id);
    console.log('用户B的目标数量:', userBGoals.length);
    
    // 7. 验证用户B看不到用户A的目标
    const hasUserATarget = userBGoals.some(g => g.title === '用户A的测试目标');
    console.log('用户B是否能看到用户A的目标:', hasUserATarget);
    
    // 8. 用户A获取自己的目标列表（确认自己能看到）
    console.log('7. 用户A获取目标列表...');
    const userAGoals = await getGoals(loginResponseA.user.id);
    console.log('用户A的目标数量:', userAGoals.length);
    const userASeesOwnGoal = userAGoals.some(g => g.title === '用户A的测试目标');
    console.log('用户A是否能看到自己的目标:', userASeesOwnGoal);
    
    // 8. 清理测试数据（可选）
    // 实际测试中可以保留数据用于进一步验证
    
    console.log('\n===== 测试结果总结 =====');
    console.log('✓ 用户A创建了目标');
    console.log('✓ 用户A能看到自己的目标:', userASeesOwnGoal);
    console.log('✓ 用户B看不到用户A的目标:', !hasUserATarget);
    
    if (userASeesOwnGoal && !hasUserATarget) {
      console.log('✅ 用户隔离功能测试通过！');
    } else {
      console.log('❌ 用户隔离功能测试失败！');
    }
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 辅助函数：注册用户
function registerUser(username, password) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(data).user);
        } else if (res.statusCode === 400 && JSON.parse(data).message === '用户名已存在') {
          // 如果用户已存在，直接登录获取用户信息
          loginUser(username, password).then(loginResponse => {
            resolve(loginResponse.user);
          }).catch(reject);
        } else {
          reject(new Error(`注册失败: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({ username, password }));
    req.end();
  });
}

// 辅助函数：登录用户
function loginUser(username, password) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`登录失败: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({ username, password }));
    req.end();
  });
}

// 辅助函数：创建目标
function createGoal(userId, goalData) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`创建目标失败: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({ ...goalData, userId }));
    req.end();
  });
}

// 辅助函数：获取目标列表
function getGoals(userId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/goals?userId=${userId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`获取目标失败: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// 执行测试
if (require.main === module) {
  testUserIsolation();
}

module.exports = { testUserIsolation };