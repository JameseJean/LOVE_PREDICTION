// 确保submitForm函数可用
if (typeof submitForm !== 'function') {
  console.error('submitForm 函数未定义，请确保main.js已正确加载');
}

// 表单验证配置
const validationRules = {
  name1: {
    min: 2,
    max: 20,
    pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/,  // 支持中文、英文和空格
    messages: {
      required: '请输入你的姓名',
      min: '姓名至少需要2个字符',
      max: '姓名不能超过20个字符',
      pattern: '姓名只能包含中文或英文字符'
    }
  },
  age1: {
    min: 18,
    max: 99,
    pattern: /^\d+$/,  // 只允许整数
    messages: {
      required: '请输入你的年龄',
      min: '年龄必须大于或等于18岁',
      max: '年龄必须小于100岁',
      pattern: '请输入有效的年龄'
    }
  },
  name2: {
    min: 2,
    max: 20,
    pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/,
    messages: {
      required: '请输入对方姓名',
      min: '姓名至少需要2个字符',
      max: '姓名不能超过20个字符',
      pattern: '姓名只能包含中文或英文字符'
    }
  },
  age2: {
    min: 18,
    max: 99,
    pattern: /^\d+$/,
    messages: {
      required: '请输入对方年龄',
      min: '年龄必须大于或等于18岁',
      max: '年龄必须小于100岁',
      pattern: '请输入有效的年龄'
    }
  }
};

// 错误提示函数
function showError(inputElement, message) {
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  errorElement.textContent = message;
  inputElement.classList.add('error');
}

// 清除错误提示
function clearError(inputElement) {
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  errorElement.textContent = '';
  inputElement.classList.remove('error');
}

// 验证单个输入框
function validateInput(inputElement) {
  const value = inputElement.value.trim();
  const rules = validationRules[inputElement.id];
  
  // 必填验证
  if (!value) {
    showError(inputElement, rules.messages.required);
    return false;
  }
  
  // 对于年龄字段
  if (inputElement.id === 'age1' || inputElement.id === 'age2') {
    const age = Number(value);
    console.log(`验证年龄: ${age}`); // 添加调试信息
    
    // 先验证是否为有效数字
    if (isNaN(age)) {
      console.log('年龄不是有效数字');
      showError(inputElement, rules.messages.pattern);
      return false;
    }
    
    // 再验证范围
    if (age < rules.min) {
      console.log(`年龄 ${age} 小于最小值 ${rules.min}`);
      showError(inputElement, rules.messages.min);
      return false;
    }
    
    if (age > rules.max) {
      console.log(`年龄 ${age} 大于最大值 ${rules.max}`);
      showError(inputElement, rules.messages.max);
      return false;
    }
    
    // 验证通过，清除错误提示
    clearError(inputElement);
    console.log(`年龄 ${age} 验证通过`);
    return true;
  }
  
  // 姓名字段的格式验证
  if (!rules.pattern.test(value)) {
    showError(inputElement, rules.messages.pattern);
    return false;
  }
  
  clearError(inputElement);
  return true;
}

// 表单验证初始化
function initFormValidation() {
  const form = document.getElementById('prediction-form');
  const inputs = form.querySelectorAll('input');
  
  // 添加实时验证
  inputs.forEach(input => {
    // 输入时验证
    input.addEventListener('input', () => {
      validateInput(input);
    });
    
    // 失去焦点时验证
    input.addEventListener('blur', () => {
      validateInput(input);
    });
  });
  
  // 表单提交验证
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;
    
    console.log('开始表单验证...');
    
    inputs.forEach(input => {
      console.log(`验证字段 ${input.id}: ${input.value}`);
      if (!validateInput(input)) {
        console.log(`字段 ${input.id} 验证失败`);
        isValid = false;
      }
    });
    
    if (isValid) {
      // 收集表单数据
      const formData = {
        name1: form.name1.value.trim(),
        age1: Number(form.age1.value.trim()),
        name2: form.name2.value.trim(),
        age2: Number(form.age2.value.trim())
      };
      
      console.log('表单验证通过，准备提交数据:', formData);
      
      try {
        // 添加提交状态
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = '提交中...';
        submitButton.classList.add('loading');
        
        submitForm(formData)
          .then(response => {
            console.log('提交成功:', response);
            // 结果已经在 submitForm 中显示
          })
          .catch(error => {
            console.error('提交失败:', error);
            alert('提交失败: ' + (error.message || '请稍后重试'));
          })
          .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = '提交';
            submitButton.classList.remove('loading');
          });
      } catch (error) {
        console.error('提交过程出错:', error);
        alert('提交出错: ' + (error.message || '请稍后重试'));
      }
    } else {
      console.log('表单验证失败，不提交');
    }
  });
}

// 初始化验证
document.addEventListener('DOMContentLoaded', initFormValidation); 