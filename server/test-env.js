import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量，指定.env文件的完整路径
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('环境变量测试:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : '未设置');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('PORT:', process.env.PORT);