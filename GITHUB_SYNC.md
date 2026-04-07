# PGM联赛 · GitHub 云端同步方案

> 本文档说明如何将 PGM联赛 项目同步到 GitHub，并通过 GitHub Pages 实现免费在线访问。

---

## 目录

1. [方案概览](#方案概览)
2. [一次性初始化（首次操作）](#一次性初始化首次操作)
3. [日常开发同步流程](#日常开发同步流程)
4. [自动部署说明](#自动部署说明)
5. [多设备协作](#多设备协作)
6. [安全注意事项](#安全注意事项)
7. [常见问题](#常见问题)

---

## 方案概览

```
本地修改 index.html
       ↓
   git add & commit
       ↓
   git push → GitHub 仓库
       ↓  (自动触发 GitHub Actions)
   GitHub Pages 在线访问
```

| 功能 | 说明 |
|------|------|
| **版本管理** | Git 追踪每次改动，随时可回滚到历史版本 |
| **云端备份** | 代码存储在 GitHub，本地损坏不丢失 |
| **在线访问** | GitHub Pages 免费托管，手机直接访问 |
| **自动部署** | 推送代码后 1~2 分钟，线上自动更新 |
| **多设备同步** | 任何电脑克隆仓库即可继续开发 |

---

## 一次性初始化（首次操作）

### 前置条件

- 安装 [Git](https://git-scm.com/download/win)
- 注册 [GitHub](https://github.com) 账号

### Step 1：在 GitHub 创建仓库

1. 登录 GitHub → 点击右上角 **"+"** → **"New repository"**
2. 仓库名填写：`pgm-league`（或自定义）
3. 选择 **Public**（GitHub Pages 免费版需要公开仓库）
4. **不要**勾选「Initialize with README」
5. 点击 **"Create repository"**

### Step 2：本地初始化 Git 仓库

在项目目录下打开 PowerShell，依次执行：

```powershell
# 进入项目目录
cd "C:\Users\J.K\WorkBuddy\20260407120000\PGM联赛"

# 初始化 Git 仓库
git init

# 设置默认分支为 main
git branch -M main

# 配置用户信息（只需执行一次）
git config user.name "你的GitHub用户名"
git config user.email "你的邮箱@example.com"
```

### Step 3：首次提交并推送

```powershell
# 添加所有文件到暂存区
git add .

# 创建第一次提交
git commit -m "feat: 初始化 PGM联赛 第62届项目"

# 关联远程仓库（替换为你的 GitHub 用户名和仓库名）
git remote add origin https://github.com/你的用户名/pgm-league.git

# 推送到 GitHub
git push -u origin main
```

### Step 4：开启 GitHub Pages

1. 打开仓库页面 → 点击 **Settings** 选项卡
2. 左侧找到 **Pages** 菜单
3. **Source** 选择 `GitHub Actions`
4. 保存后等待 1~2 分钟

> 首次 push 后 GitHub Actions 会自动运行，完成后你的联赛页面就可以通过以下地址访问：
>
> **`https://你的用户名.github.io/pgm-league/`**

---

## 日常开发同步流程

每次修改 `index.html`（或其他文件）后，执行以下命令同步到云端：

```powershell
# 进入项目目录
cd "C:\Users\J.K\WorkBuddy\20260407120000\PGM联赛"

# 查看改动了哪些文件
git status

# 将所有改动加入暂存区
git add .

# 提交（-m 后面填写本次改动的简要说明）
git commit -m "fix: 修复第3轮赛程数据"

# 推送到 GitHub（同时触发自动部署）
git push
```

### 推荐的提交信息格式

| 前缀 | 用途 | 示例 |
|------|------|------|
| `feat:` | 新功能 | `feat: 添加球员评分功能` |
| `fix:` | 修复 bug | `fix: 修正积分计算逻辑` |
| `data:` | 更新比赛数据 | `data: 录入第5轮比赛结果` |
| `ui:` | 界面调整 | `ui: 优化手机端显示效果` |
| `refactor:` | 代码重构 | `refactor: 整理球队初始化代码` |

---

## 自动部署说明

本项目已配置 `.github/workflows/deploy.yml`，每次向 `main` 分支推送代码后：

1. GitHub Actions 自动执行（无需手动操作）
2. 约 **1~2 分钟** 后，GitHub Pages 上的内容自动更新
3. 可在仓库的 **Actions** 选项卡查看部署进度和日志

### 手动触发部署

如需不推送代码也强制重新部署：

1. 打开 GitHub 仓库 → **Actions** 选项卡
2. 左侧选择 **"Deploy PGM League to GitHub Pages"**
3. 点击右侧 **"Run workflow"** 按钮

---

## 多设备协作

### 在新电脑上继续开发

```powershell
# 克隆仓库到本地（只需执行一次）
git clone https://github.com/你的用户名/pgm-league.git

# 进入目录开始开发
cd pgm-league
```

### 拉取最新代码（已有本地仓库时）

```powershell
# 拉取远程最新改动（开始工作前执行）
git pull
```

### 查看历史版本

```powershell
# 查看提交历史
git log --oneline --graph

# 查看某次提交的改动内容
git show <commit-hash>

# 回滚到某个历史版本（危险操作，请谨慎）
git checkout <commit-hash> -- index.html
```

---

## 安全注意事项

> ⚠️ **重要：以下内容在 push 前请务必处理**

### 硬编码密码问题

当前 `index.html` 中存在明文密码：

```javascript
// 高危：管理员密码暴露在前端代码中
if (teamId === 'laubob' && password === 'i981456981456') { ... }
```

**仓库设为 Public 后任何人都能看到这个密码。**

**建议处理方案（选一种）：**

**方案A（最简单）：仓库改为 Private**
- GitHub 仓库设置 → 改为 Private
- GitHub Pages 在 Private 仓库中需要付费（GitHub Pro）

**方案B（推荐）：修改管理员密码，并理解这是前端密码**
- 将密码改成你知道但不重要的内容
- 接受这是一个「隐藏而非加密」的方案，适合私人小项目

**方案C（最安全，将来考虑）：引入后端验证**
- 将登录逻辑移到服务器端

### .gitignore 已排除的敏感文件

本项目 `.gitignore` 已配置排除以下内容：
- `.workbuddy_memory_*.md` — 工作记忆文件（含密码记录）
- `generated-images/` — AI 生成图片（体积大）
- `.env` — 环境变量文件

---

## 常见问题

**Q: push 时提示认证失败？**

GitHub 已停用密码认证，需要使用 Personal Access Token：
1. GitHub → Settings → Developer Settings → Personal access tokens → Tokens (classic)
2. 生成 Token，勾选 `repo` 权限
3. push 时用 Token 代替密码

或者配置 SSH Key（推荐长期使用）：
```powershell
ssh-keygen -t ed25519 -C "你的邮箱@example.com"
# 将生成的 ~/.ssh/id_ed25519.pub 内容添加到 GitHub SSH Keys
```

---

**Q: GitHub Pages 显示的还是旧版本？**

1. 检查 Actions 是否运行成功（仓库 → Actions 选项卡）
2. 强制刷新浏览器：`Ctrl+Shift+R`
3. Service Worker 缓存问题：打开浏览器开发者工具 → Application → Service Workers → "Update on reload"

---

**Q: 想回滚到上个版本？**

```powershell
# 查看最近提交
git log --oneline -10

# 只回滚 index.html 到上个版本（其他文件不变）
git checkout HEAD~1 -- index.html
git commit -m "revert: 回滚 index.html 到上个版本"
git push
```

---

**Q: 怎么看谁改了什么？**

```powershell
git log --oneline --all   # 所有提交记录
git diff HEAD~1 HEAD      # 对比最近两次提交的差异
```

---

> 📌 **访问地址**：部署完成后，线上地址为：
> `https://你的GitHub用户名.github.io/pgm-league/`
