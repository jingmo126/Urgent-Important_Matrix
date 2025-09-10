// 服务器状态检查脚本
// 用于测试端口5000是否开放，以及提供后端连接问题的排查步骤

const http = require('http');
const net = require('net');

console.log('正在检查服务器状态...\n');

// 检查端口5000是否开放
function checkPortOpen(port, host = 'localhost') {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    
    socket.setTimeout(2000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

// 测试API连接
function testApiConnection() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:5000/api/goals', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ success: true, statusCode: res.statusCode, data });
      });
    }).on('error', (e) => {
      resolve({ success: false, error: e.message });
    });
  });
}

// 主函数
async function main() {
  console.log('1. 检查端口5000是否开放...');
  const portOpen = await checkPortOpen(5000);
  
  if (!portOpen) {
    console.log('❌ 端口5000未开放！后端服务器可能未启动。');
    console.log('\n💡 解决方案:');
    console.log('   1. 打开新终端');
    console.log('   2. 运行: cd server');
    console.log('   3. 运行: npm run dev:server');
    console.log('   4. 等待服务器启动成功');
  } else {
    console.log('✅ 端口5000已开放！');
    
    console.log('\n2. 测试API连接...');
    const apiResult = await testApiConnection();
    
    if (apiResult.success) {
      console.log(`✅ API连接成功！状态码: ${apiResult.statusCode}`);
      console.log('\n3. 检查数据库连接...');
      console.log('   请运行: cd server && node test-mysql-connection.js');
    } else {
      console.log(`❌ API连接失败: ${apiResult.error}`);
      console.log('\n💡 可能的原因:');
      console.log('   1. 后端服务器正在运行但API路由未正确配置');
      console.log('   2. 数据库连接问题');
      console.log('   3. 服务器正在重启过程中');
      console.log('\n💡 解决方案:');
      console.log('   1. 检查服务器日志是否有错误信息');
      console.log('   2. 运行数据库连接测试: cd server && node test-mysql-connection.js');
      console.log('   3. 尝试重启后端服务器');
    }
  }
  
  console.log('\n📋 完整的排查步骤:');
  console.log('   1. 确保MySQL服务器正在运行');
  console.log('   2. 确保已创建quadrant_tasks数据库');
  console.log('   3. 检查server/.env文件中的数据库配置是否正确');
  console.log('   4. 运行数据库连接测试');
  console.log('   5. 启动后端服务器');
  console.log('   6. 启动前端服务器 (npm run dev:client)');
}

main().catch(console.error);