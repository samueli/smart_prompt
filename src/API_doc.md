# Smart Prompt API 接口文档

## 基本信息

- 基础URL: `https://prompt-api.playwithai.fun`
- 所有请求和响应均使用 JSON 格式
- 所有响应都包含 `success` 字段，表示请求是否成功
- 时间格式使用 ISO 8601 标准：`YYYY-MM-DDTHH:mm:ss.sssZ`
- 认证方式：Bearer Token
  ```
  Authorization: Bearer <your_token>
  ```

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": { ... }  // 具体的响应数据
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误信息"
}
```

### 认证失败响应
```json
{
  "success": false,
  "error": "Bearer token is required"
}
```

## 数据结构

### Prompt 对象
```typescript
{
  id: string;            // 提示词ID
  title: string;         // 提示词标题
  tags: string;          // 标签，JSON数组字符串，如 ["AI", "翻译"]
  creator: string;       // 创建者
  create_time: string;   // 创建时间
  update_time: string;   // 更新时间
  status: number;        // 状态：1=正常，0=已删除
  is_public: number;     // 是否公开：1=公开，0=私有
  source_prompt: string; // 原始提示词
  optimized_prompt: string; // 优化后的提示词
}
```

## API 端点

### 1. 获取提示词列表

获取所有状态为正常的提示词列表。

**请求**
- 方法：`GET`
- 路径：`/api/prompts`
- 认证：Bearer Token（必填）
- 查询参数：
  - `orderBy`（可选）：排序字段，默认为 `update_time`
  - `order`（可选）：排序方式，可选值 `asc` 或 `desc`，默认为 `desc`

**示例请求**
```bash
# 获取提示词列表
curl https://prompt-api.playwithai.fun/api/prompts \
  -H "Authorization: Bearer your_token_here"

# 自定义排序
curl https://prompt-api.playwithai.fun/api/prompts?orderBy=create_time&order=asc \
  -H "Authorization: Bearer your_token_here"
```

**成功响应**
```json
{
  "success": true,
  "data": [
    {
      "id": "test-001",
      "title": "中英文翻译助手",
      "tags": "[\"AI\", \"翻译\"]",
      "creator": "test_user",
      "create_time": "2024-12-29T02:08:24Z",
      "update_time": "2024-12-29T02:08:24Z",
      "status": 1,
      "is_public": 1,
      "source_prompt": "你是一个翻译助手",
      "optimized_prompt": "你是一个专业的翻译助手，精通中英文互译，注重准确性和地道表达"
    }
  ]
}
```

**错误响应**
```json
{
  "success": false,
  "error": "Bearer token is required"
}
```

### 2. 获取公开提示词列表

获取所有公开的提示词列表，不需要认证。

**请求**
- 方法：`GET`
- 路径：`/api/prompts/public`
- 查询参数：
  - `orderBy`（可选）：排序字段，默认为 `update_time`
  - `order`（可选）：排序方式，可选值 `asc` 或 `desc`，默认为 `desc`

**示例请求**
```bash
# 获取公开提示词列表
curl https://prompt-api.playwithai.fun/api/prompts/public

# 自定义排序
curl https://prompt-api.playwithai.fun/api/prompts/public?orderBy=create_time&order=asc
```

**成功响应**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "提示词标题",
      "tags": "[]",
      "creator": "创建者",
      "create_time": "2024-01-01T00:00:00Z",
      "update_time": "2024-01-01T00:00:00Z",
      "status": 1,
      "is_public": 1,
      "source_prompt": "原始提示词",
      "optimized_prompt": "优化后的提示词"
    }
  ]
}
```

### 3. 创建或更新提示词

创建新的提示词或更新现有提示词。

**请求**
- 方法：`POST`
- 路径：`/api/prompts`
- 认证：Bearer Token（必填）
- Content-Type: `application/json`
- 请求体：
  ```json
  {
    "title": "中英文翻译助手",
    "tags": "[\"AI\", \"翻译\"]",
    "creator": "test_user",
    "source_prompt": "你是一个翻译助手",
    "optimized_prompt": "你是一个专业的翻译助手，精通中英文互译，注重准确性和地道表达",
    "is_public": 1
  }
  ```
  注意：
  - 创建新提示词时无需提供 `id`，系统会自动生成
  - 更新提示词时需要提供 `id`
  - `create_time`、`update_time` 和 `status` 由系统自动管理

**示例请求**
```bash
# 创建新提示词
curl -X POST https://prompt-api.playwithai.fun/api/prompts \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "中英文翻译助手",
    "tags": "[\"AI\", \"翻译\"]",
    "creator": "test_user",
    "source_prompt": "你是一个翻译助手",
    "optimized_prompt": "你是一个专业的翻译助手，精通中英文互译，注重准确性和地道表达",
    "is_public": 1
  }'
```

**成功响应**
```json
{
  "success": true,
  "data": {
    "id": "bdef9b8b-f248-4ce0-b4cd-a3d47fd343b7",
    "title": "中英文翻译助手",
    "tags": "[\"AI\", \"翻译\"]",
    "creator": "test_user",
    "create_time": "2024-12-29T02:30:19.055Z",
    "update_time": "2024-12-29T02:30:19.055Z",
    "status": 1,
    "is_public": 1,
    "source_prompt": "你是一个翻译助手",
    "optimized_prompt": "你是一个专业的翻译助手，精通中英文互译，注重准确性和地道表达"
  }
}
```

**错误响应**
```json
{
  "success": false,
  "error": "Bearer token is required"
}
```

### 4. 删除提示词

将提示词标记为已删除状态（软删除）。

**请求**
- 方法：`DELETE`
- 路径：`/api/prompts/:id`
- 认证：Bearer Token（必填）
- URL 参数：
  - `id`：提示词ID

**示例请求**
```bash
curl -X DELETE https://prompt-api.playwithai.fun/api/prompts/test-001 \
  -H "Authorization: Bearer your_token_here"
```

**成功响应**
```json
{
  "success": true
}
```

**错误响应**
```json
{
  "success": false,
  "error": "Bearer token is required"
}
```

### 4. 获取单个提示词

获取指定ID的提示词详细信息。

**请求**
- 方法：`GET`
- 路径：`/api/prompts/:id`
- 认证：Bearer Token（必填）
- URL参数：
  - `id`：提示词ID

**示例请求**
```bash
curl https://prompt-api.playwithai.fun/api/prompts/test-001 \
  -H "Authorization: Bearer your_token_here"
```

**成功响应**
```json
{
  "success": true,
  "data": {
    "id": "test-001",
    "title": "中英文翻译助手",
    "tags": "[\"AI\", \"翻译\"]",
    "creator": "test_user",
    "create_time": "2024-12-29T02:08:24Z",
    "update_time": "2024-12-29T02:08:24Z",
    "status": 1,
    "is_public": 1,
    "source_prompt": "你是一个翻译助手",
    "optimized_prompt": "你是一个专业的翻译助手，精通中英文互译，注重准确性和地道表达"
  }
}
```

### 5. 更新提示词公开状态

更新指定提示词的公开状态。

**请求**
- 方法：`PUT`
- 路径：`/api/prompts/:id/public`
- 认证：Bearer Token（必填）
- URL参数：
  - `id`：提示词ID
- Content-Type: `application/json`
- 请求体：
  ```json
  {
    "is_public": 1  // 1=公开，0=私有
  }
  ```

**示例请求**
```bash
curl -X PUT https://prompt-api.playwithai.fun/api/prompts/test-001/public \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "is_public": 1
  }'
```

**成功响应**
```json
{
  "success": true,
  "data": {
    "id": "test-001",
    "is_public": 1
  }
}
```

### 6. 更新提示词可见性

更新指定提示词的可见性状态。

**请求**
- 方法：`PATCH`
- 路径：`/api/prompts/:id/visibility`
- 认证：Bearer Token（必填）
- URL参数：
  - `id`：提示词ID
- Content-Type: `application/json`
- 请求体：
  ```json
  {
    "status": 1  // 1=正常可见，0=已删除/不可见
  }
  ```

**示例请求**
```bash
curl -X PATCH https://prompt-api.playwithai.fun/api/prompts/test-001/visibility \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "status": 1
  }'
```

**成功响应**
```json
{
  "success": true,
  "data": {
    "id": "test-001",
    "status": 1
  }
}
```

### 7. 获取优化框架列表

获取所有可用的提示词优化框架列表，不需要认证。

**请求**
- 方法：`GET`
- 路径：`/api/prompts/optimize/frameworks`
- 认证：不需要

**示例请求**
```bash
# 获取优化框架列表
curl https://prompt-api.playwithai.fun/api/prompts/optimize/frameworks
```

**成功响应**
```json
{
  "success": true,
  "data": [
    {
      "code": "GENERAL",
      "cn_name": "通用优化",
      "en_name": "General Optimization",
      "cn_description": "这是一个专业的prompt优化助手框架...",
      "en_description": "This is a professional prompt optimization assistant framework..."
    },
    {
      "code": "BROKE",
      "cn_name": "BROKE框架",
      "en_name": "BROKE Framework",
      "cn_description": "这是一个将普通提示词转换为结构化broke格式的优化框架...",
      "en_description": "This is an optimization framework that converts regular prompts into structured BROKE format..."
    }
  ]
}
```

**错误响应**
```json
{
  "success": false,
  "error": "发生未知错误"
}
```

### 8. 优化提示词

优化现有提示词，使其更适合特定场景和需求。

**请求**
- 方法：`POST`
- 路径：`/api/prompts/optimize`
- 认证：Bearer Token（必填）
- Content-Type: `application/json`
- 请求体：
  ```typescript
  {
    "inputPrompt": string,         // 原始提示词
    "businessScenario": string,    // 应用场景
    "optimizationFramework": string, // 优化框架
    "outputFormat": string         // 输出格式
  }
  ```

**示例请求**
```bash
curl -X POST https://prompt-api.playwithai.fun/api/prompts/optimize \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "inputPrompt": "翻译这段文字",
    "businessScenario": "专业文档翻译",
    "optimizationFramework": "CRAP (Clear, Relevant, Accurate, Professional)",
    "outputFormat": "保持原文格式，包含中英对照"
  }'
```

**成功响应**
```json
{
  "success": true,
  "data": {
    "optimizedPrompt": "你是一个专业的翻译专家，精通中英文互译。请将以下文字翻译成英文，要求：\n1. 保持专业术语的准确性\n2. 符合目标语言的表达习惯\n3. 保留原文格式\n4. 同时提供中英对照\n\n请翻译："
  }
}
```

**错误响应**
```json
{
  "success": false,
  "error": "无效的请求参数"
}
```

## 错误处理

API 可能返回以下 HTTP 状态码：

- 200：请求成功
- 400：请求参数错误
- 401：认证失败
- 404：资源不存在
- 500：服务器内部错误

当发生错误时，响应体将包含错误信息：
```json
{
  "success": false,
  "error": "错误描述信息"
}
```

## 注意事项

1. 所有API请求都需要通过Bearer Token进行认证
2. Bearer Token需要在HTTP请求头中通过Authorization字段传递
3. 删除操作为软删除，数据仍然保留在数据库中
4. 创建提示词时，如果不指定 is_public，默认为私有（0）
5. 认证失败会返回401状态码
