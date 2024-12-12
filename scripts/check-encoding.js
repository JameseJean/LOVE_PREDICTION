const fs = require('fs');
const iconv = require('iconv-lite');
const path = require('path');

function checkFileEncoding(filePath) {
  const buffer = fs.readFileSync(filePath);
  const content = buffer.toString();
  
  // 检查是否有乱码字符
  if (content.includes('�')) {
    console.error(`文件 ${filePath} 中发现乱码字符`);
    return false;
  }
  
  // 检查是否为 UTF-8
  try {
    const decoded = iconv.decode(buffer, 'utf8');
    const reencoded = iconv.encode(decoded, 'utf8');
    if (!buffer.equals(reencoded)) {
      console.error(`文件 ${filePath} 不是有效的 UTF-8 编码`);
      return false;
    }
  } catch (error) {
    console.error(`检查文件 ${filePath} 编码时出错:`, error);
    return false;
  }
  
  return true;
}

// 获取要检查的文件列表
function getFilesToCheck() {
  return [
    'public/scripts/validation.js',
    'docs/ISSUES.md',
    'docs/design.md',
    'docs/README.md',
    'docs/product.md',
    'public/index.html',
    'server.js'
  ];
}

// 执行检查
function runCheck() {
  console.log('开始检查文件编码...');
  const files = getFilesToCheck();
  let hasError = false;
  
  files.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        console.log(`检查文件: ${file}`);
        if (!checkFileEncoding(file)) {
          hasError = true;
        }
      } else {
        console.warn(`文件不存在: ${file}`);
      }
    } catch (error) {
      console.error(`处理文件 ${file} 时出错:`, error);
      hasError = true;
    }
  });
  
  if (!hasError) {
    console.log('✅ 所有文件编码检查通过');
  } else {
    console.error('❌ 发现编码问题，请修复后重试');
    process.exit(1);
  }
}

// 运行检查
runCheck(); 