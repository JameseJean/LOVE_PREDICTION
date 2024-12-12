// 全局状态管理
const state = {
  isLoading: false,
  result: null
};

// 显示加载状态
function showLoading() {
  state.isLoading = true;
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = '<div class="loading"></div>';
}

// 隐藏加载状态
function hideLoading() {
  state.isLoading = false;
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = false;
  submitButton.textContent = '提交';
}

// 显示预测结果
function showResult(result) {
  const resultSection = document.getElementById('result-section');
  console.log('显示结果:', result);
  
  const score = result.score || Math.floor(Math.random() * 41) + 60;
  
  // 根据分数选择表情
  const emoji = score >= 90 ? '❤️' : 
               score >= 80 ? '😊' : 
               score >= 70 ? '🙂' : '😐';
  
  // 构建结果HTML
  const resultHTML = `
    <div class="result-card">
      <div class="result-emoji">${emoji}</div>
      <div class="compatibility-score">${score}%</div>
      <div class="result-names">
        ${result.person1.name} & ${result.person2.name}
      </div>
      <div class="result-description">
        ${getResultDescription(score)}
      </div>
    </div>
  `;
  
  resultSection.innerHTML = resultHTML;
  resultSection.classList.add('show');
}

// 获取结果描述
function getResultDescription(score) {
  if (score >= 90) {
    return '太棒了！你们简直是天生一对！';
  } else if (score >= 80) {
    return '很不错！你们有很大的发展潜力！';
  } else if (score >= 70) {
    return '还不错，继续努力，会更好的！';
  } else {
    return '或许你们需要更多的了解彼此。';
  }
}

// API配置
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://love-prediction-nxo93si9y-jamesjeans-projects.vercel.app'
  : '';

// 提交表单
async function submitForm(formData) {
  console.log('开始提交数据到服务器...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('服务器响应:', result);
    showResult(result);
    return result;
    
  } catch (error) {
    console.error('提交请求失败:', error);
    throw error;
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 添加表单重置功能
  const form = document.getElementById('prediction-form');
  form.addEventListener('reset', () => {
    const resultSection = document.getElementById('result-section');
    resultSection.classList.remove('show');
    resultSection.innerHTML = '';
  });
}); 