# AI 恋爱/婚姻契合度预测 API 文档

## 预测接口

### 请求信息
- URL: `/predict`
- 方法: `POST`
- Content-Type: `application/json`

### 请求参数
```json
{
  "name": "string",  // 姓名，2-20个字符
  "age": "number"    // 年龄，18-99的整数
}
```

### 响应格式
```json
{
  "score": "number",      // 契合度分数，60-100
  "name": "string",       // 输入的姓名
  "age": "number",        // 输入的年龄
  "timestamp": "string"   // 预测时间戳
}
```

### 错误响应
```json
{
  "error": "string"  // 错误信息
}
```

### 状态码
- 200: 成功
- 400: 请求参数错误
- 500: 服务器内部错误

### 示例
请求：
```json
{
  "name": "张三",
  "age": 25
}
```

响应：
```json
{
  "score": 85,
  "name": "张三",
  "age": 25,
  "timestamp": "2024-03-20T12:34:56.789Z"
}
``` 