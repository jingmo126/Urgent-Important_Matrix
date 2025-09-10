// MySQL连接测试脚本
// 用于验证MySQL服务器配置是否正确

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

console.log('正在测试MySQL数据库连接...');
console.log('数据库配置信息:');
console.log('- 主机:', process.env.DB_HOST || '未设置');
console.log('- 用户名:', process.env.DB_USER || '未设置');
console.log('- 数据库名称:', process.env.DB_NAME || '未设置');
console.log('- 密码:', process.env.DB_PASSWORD ? '已设置' : '未设置');

// 创建数据库连接
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
    dialectOptions: {
      connectTimeout: 10000 // 10秒超时
    }
  }
);

// 测试连接的函数
async function testConnection() {
  try {
    console.log('\n正在尝试连接到MySQL服务器...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功！');
    
    // 尝试列出所有数据库以验证权限
    try {
      const [databases] = await sequelize.query('SHOW DATABASES;');
      console.log('\n可用数据库列表:');
      databases.forEach(db => {
        console.log(`- ${Object.values(db)[0]}`);
      });
    } catch (err) {
      console.log('ℹ️  无法列出数据库（权限限制）:', err.message);
    }
    
    // 检查指定的数据库是否存在
    try {
      await sequelize.query(`USE ${process.env.DB_NAME};`);
      console.log(`✅ 数据库 '${process.env.DB_NAME}' 存在且可以访问。`);
    } catch (err) {
      console.error(`❌ 错误: 无法访问数据库 '${process.env.DB_NAME}'。`, err.message);
      console.log(`ℹ️  请运行以下SQL命令创建数据库：CREATE DATABASE ${process.env.DB_NAME};`);
    }
    
    // 检查用户权限
    try {
      const [result] = await sequelize.query('SELECT CURRENT_USER();');
      console.log('\n当前连接的用户:', Object.values(result[0])[0]);
    } catch (err) {
      console.log('ℹ️  无法获取当前用户信息:', err.message);
    }
    
  } catch (error) {
    console.error('❌ 数据库连接失败！');
    console.error('错误详情:', error.message);
    
    // 提供常见错误的解决方案
    if (error.message.includes('Access denied')) {
      console.log('\n💡 可能的解决方案:');
      console.log('1. 检查用户名和密码是否正确');
      console.log('2. 确保用户有足够的权限访问该数据库');
      console.log('3. 运行以下命令授予权限：');
      console.log(`   GRANT ALL PRIVILEGES ON ${process.env.DB_NAME}.* TO '${process.env.DB_USER}'@'${process.env.DB_HOST || 'localhost'}' IDENTIFIED BY 'your_password';`);
      console.log('   FLUSH PRIVILEGES;');
    } else if (error.message.includes('Unknown database')) {
      console.log('\n💡 可能的解决方案:');
      console.log(`1. 创建数据库: CREATE DATABASE ${process.env.DB_NAME};`);
    } else if (error.message.includes('Connection refused')) {
      console.log('\n💡 可能的解决方案:');
      console.log('1. 确保MySQL服务器正在运行');
      console.log('2. 检查主机名和端口是否正确');
      console.log('3. 检查防火墙设置是否允许连接');
    }
  } finally {
    // 关闭连接
    await sequelize.close();
    console.log('\n测试完成，已关闭数据库连接。');
  }
}

// 运行测试
console.log('ℹ️  如果连接失败，请参考MYSQL_CONFIGURATION_GUIDE.md文件获取详细配置指南。');
testConnection();