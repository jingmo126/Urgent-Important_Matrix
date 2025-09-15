const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('状态码:', res.statusCode);
    console.log('响应数据:', data);
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error.message);
});

// 发送请求体
req.write(JSON.stringify({
  username: 'testuser789',
  password: 'password123'
}));
req.end();