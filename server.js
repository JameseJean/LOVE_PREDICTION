const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json());

// 添加正确的 MIME 类型
app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.type('text/css');
  }
  next();
});

// 安全头配置
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 预测结果计算函数
function calculateCompatibility(name1, age1, name2, age2) {
  // 基础分数：60-100之间
  let baseScore = Math.floor(Math.random() * 41) + 60;
  
  // 根据年龄差异调整分数
  const ageDiff = Math.abs(age1 - age2);
  if (ageDiff <= 5) {
    baseScore += 10;
  } else if (ageDiff <= 10) {
    baseScore += 5;
  }
  
  return Math.min(baseScore, 100);
}

// 预测接口
app.post('/api/predict', (req, res) => {
  const { name1, age1, name2, age2 } = req.body;
  
  // 参数验证
  if (!name1 || !age1 || !name2 || !age2) {
    return res.status(400).json({
      error: '请提供完整的信息'
    });
  }
  
  // 计算契合度
  const score = calculateCompatibility(
    name1, parseInt(age1),
    name2, parseInt(age2)
  );
  
  // 构建响应数据
  const result = {
    score,
    person1: { name: name1, age: age1 },
    person2: { name: name2, age: age2 },
    timestamp: new Date().toISOString()
  };
  
  res.json(result);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    error: '服务器内部错误，请稍后重试'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器已启动，访问 http://localhost:${PORT}`);
});
