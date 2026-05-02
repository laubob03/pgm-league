# Cloudflare Workers 部署指南

## 概述

本项目已迁移到 Cloudflare Workers 代理模式，GitHub Token 将安全地存储在 Worker 环境变量中，前端代码不再暴露任何敏感信息。

## 部署步骤

### 1. 注册 Cloudflare 账号

访问 [Cloudflare 官网](https://dash.cloudflare.com/) 注册免费账号。

### 2. 创建 Workers 项目

1. 登录 Cloudflare Dashboard
2. 进入 **Workers & Pages** → **Create Application**
3. 选择 **Create Worker**
4. 给 Worker 命名（如 `pgm-league-proxy`）

### 3. 配置 Worker 代码

将 `worker.js` 的内容复制到 Worker 编辑器中。

### 4. 设置环境变量（Secret）

1. 在 Worker 页面，点击 **Settings** → **Variables**
2. 添加环境变量：
   - **变量名**: `GITHUB_TOKEN`
   - **值**: 你的 GitHub Personal Access Token（需要 gist 权限）
   - 勾选 **Encrypt** 加密存储

### 5. 配置路由（可选）

如果你想使用自定义域名：

1. 在 Worker 页面，点击 **Triggers** → **Routes**
2. 添加路由规则：
   - **Route**: `your-domain.com/api/*`
   - **Worker**: 选择你的 Worker

### 6. 测试部署

访问 `https://your-worker-name.workers.dev/api/gists/4a08491692074f35f0f2320434826e41` 应该能看到 Gist 数据。

### 7. 部署前端到 GitHub Pages

1. 将修改后的 `index.html` 推送到 GitHub 仓库
2. 确保 GitHub Pages 配置正确

## 注意事项

1. **Token 安全**: 永远不要将 Token 提交到代码仓库
2. **权限最小化**: GitHub Token 只需要勾选 `gist` 权限即可
3. **定期轮换**: 建议定期更换 GitHub Token
4. **监控日志**: 在 Cloudflare Dashboard 中监控 Worker 执行日志

## 文件说明

- `worker.js` - Cloudflare Workers 代理代码
- `wrangler.toml` - Wrangler CLI 配置文件（可选）
- `index.html` - 已修改的前端代码（移除了硬编码 Token）

## 技术原理

```
浏览器请求 → Cloudflare Worker → GitHub API
                              ↑
                        Token 安全存储在 Worker
                        前端无法访问
```

这样既保证了安全性，又完全保留了原有的同步协作功能。
