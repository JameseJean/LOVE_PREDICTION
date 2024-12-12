module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name1, age1, name2, age2 } = req.body;
    
    // 模拟预测逻辑
    const score = Math.floor(Math.random() * 41) + 60; // 60-100之间的随机数
    
    return res.status(200).json({
      score,
      person1: { name: name1, age: age1 },
      person2: { name: name2, age: age2 }
    });
  } catch (error) {
    console.error('预测出错:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}; 