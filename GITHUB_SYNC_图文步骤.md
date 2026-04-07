# PGM联赛 · GitHub 云端同步 — 详细图文操作步骤

> 本文档逐步引导你从零开始将 PGM联赛项目推送到 GitHub 并实现在线访问。

---

## 第一步：注册 GitHub 账号（如已有账号则跳过）

1. 打开浏览器，访问 **https://github.com**
2. 点击右上角绿色按钮 **「Sign up」**
3. 填写邮箱、设置密码、用户名，按提示完成注册
4. 到邮箱中点击验证链接激活账号

> 💡 用户名建议用英文，比如 `laubob-pgm`，这个用户名将出现在你的在线地址中：
> `https://laubob-pgm.github.io/pgm-league/`

---

## 第二步：安装 Git

1. 打开浏览器，访问 **https://git-scm.com/download/win**
2. 点击 **「Click here to download」** 自动下载安装包
3. 双击下载的 `.exe` 文件，一路点 **「Next」** 使用默认选项
4. 安装完成后，按 `Win + R`，输入 `powershell`，回车打开 PowerShell
5. 输入以下命令验证安装是否成功：

```powershell
git --version
```

> ✅ 如果显示类似 `git version 2.45.0`，说明安装成功

---

## 第三步：在 GitHub 创建仓库

### 3.1 进入创建页面

- 打开 **https://github.com**
- 确保已登录
- 点击右上角 **「+」** 号图标
- 在下拉菜单中选择 **「New repository」**

```
┌─────────────────────────────────────────────────┐
│  GitHub 首页右上角区域                            │
│                                                   │
│  [你的头像]  [+]  [🔔通知]                         │
│              │                                     │
│              ├── New repository    ← 点这个        │
│              ├── Import repository                  │
│              ├── New codespace                      │
│              ├── New gist                          │
│              └── New organization                   │
└─────────────────────────────────────────────────┘
```

### 3.2 填写仓库信息

```
┌─────────────────────────────────────────────────────────────┐
│  Create a new repository                                      │
│                                                               │
│  Repository name                                              │
│  ┌─────────────────────────────────┐                         │
│  │ pgm-league                      │  ← 填写仓库名（英文）    │
│  └─────────────────────────────────┘                         │
│                                                               │
│  Description (optional)                                       │
│  ┌─────────────────────────────────┐                         │
│  │ PGM足球经理官方联赛管理平台       │  ← 填写仓库描述（中文）│
│  └─────────────────────────────────┘                         │
│                                                               │
│  ○ Public    ● Public               ← 选择 Public（免费Pages）│
│                                                               │
│  ☐ Add a README file                ← 不要勾选！              │
│  ☐ Add .gitignore                   ← 不要勾选！              │
│  ☐ Choose a license                 ← 不要勾选！              │
│                                                               │
│            [ Create repository ]    ← 点这个绿色按钮          │
└─────────────────────────────────────────────────────────────┘
```

| 选项 | 设置 | 说明 |
|------|------|------|
| Repository name | `pgm-league` | 你的在线地址将包含这个名字 |
| Description | `PGM足球经理官方联赛管理平台` | 随意填写 |
| 可见性 | **Public** | 必须选 Public 才能用免费 GitHub Pages |
| Add a README | **不要勾选** | 我们本地已有文件 |
| Add .gitignore | **不要勾选** | 我们本地已创建 |

### 3.3 点击绿色按钮

点击底部 **「Create repository」** 按钮，进入下一步。

> ✅ 创建成功后会跳转到一个页面，页面上会显示你的仓库地址，类似：
> `https://github.com/你的用户名/pgm-league`

---

## 第四步：本地初始化 Git 并推送

### 4.1 打开 PowerShell

- 按 `Win + X`，选择 **「Windows PowerShell」** 或 **「终端」**
- 或按 `Win + R`，输入 `powershell`，回车

### 4.2 进入项目目录

```powershell
cd "C:\Users\J.K\WorkBuddy\20260407120000\PGM联赛"
```

### 4.3 初始化 Git 仓库

逐行复制粘贴执行（每次粘贴一行，回车执行）：

```powershell
git init
```
> ✅ 显示 `Initialized empty Git repository in ...` 表示成功

```powershell
git branch -M main
```
> 这步将默认分支改名为 `main`（GitHub 新仓库默认使用 main）

### 4.4 配置你的身份（仅第一次需要）

```powershell
git config user.name "laubob"
```
> 将 `laubob` 替换为你的 GitHub 用户名

```powershell
git config user.email "你的邮箱@example.com"
```
> 将邮箱替换为你注册 GitHub 时的邮箱

### 4.5 查看即将提交的文件

```powershell
git status
```

你会看到类似输出：

```
On branch main
No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .github/workflows/deploy.yml
        .gitignore
        GITHUB_SYNC.md
        SPEC.md
        index.html
        manifest.json
        sw.js

nothing added to commit but untracked files present
```

> ✅ 注意：`.workbuddy_memory_*.md` 和 `generated-images/` 不会出现在列表中（已被 .gitignore 排除）

### 4.6 添加所有文件

```powershell
git add .
```

> 这里的 `.` 表示当前目录下的所有文件

### 4.7 创建第一次提交

```powershell
git commit -m "feat: 初始化 PGM联赛 第62届项目"
```

> ✅ 显示类似 `create mode 100644 index.html ...` 等多行输出，表示提交成功

### 4.8 关联 GitHub 远程仓库

```powershell
git remote add origin https://github.com/你的用户名/pgm-league.git
```

> ⚠️ 把 `你的用户名` 替换成你在第三步注册时的实际 GitHub 用户名！
>
> 例如，如果你的用户名是 `laubob-pgm`，则命令为：
> `git remote add origin https://github.com/laubob-pgm/pgm-league.git`

### 4.9 推送到 GitHub

```powershell
git push -u origin main
```

执行后会出现以下交互：

```
┌─────────────────────────────────────────────────┐
│  浏览器会自动弹出 GitHub 登录页面                 │
│                                                   │
│  ┌───────────────────────────────────┐           │
│  │                                   │           │
│  │   GitHub.com                      │           │
│  │                                   │           │
│  │   Sign in to continue             │           │
│  │                                   │           │
│  │   [Username] [你的用户名]         │  ← 确认  │
│  │   [Password] [输入密码或Token]    │  ← 注意  │
│  │                                   │           │
│  │   [ Sign in ]                    │           │
│  │                                   │           │
│  └───────────────────────────────────┘           │
│                                                   │
│  ⚠️ GitHub 已不支持密码登录，需要用 Token！       │
│  见下方「Token 认证问题」章节                      │
└─────────────────────────────────────────────────┘
```

---

## 🔑 Token 认证问题（重要）

如果你 push 时弹窗登录失败，是因为 GitHub 已停用密码登录。你需要创建一个 Personal Access Token：

### 创建 Token 步骤

1. 打开 **https://github.com/settings/tokens**
2. 点击绿色按钮 **「Generate new token」** → 选择 **「Generate new token (classic)」**

```
┌─────────────────────────────────────────────────┐
│  New personal access token (classic)              │
│                                                   │
│  Note                                             │
│  ┌─────────────────────────────────┐             │
│  │ PGM-League-Push                 │  ← 给Token起个名字 │
│  └─────────────────────────────────┘             │
│                                                   │
│  Expiration                                       │
│  ┌─────────────────────────────────┐             │
│  │ No expiration            ▼      │  ← 选择不过期 │
│  └─────────────────────────────────┘             │
│                                                   │
│  Select scopes                                    │
│  ☑ repo                    ← 勾选这个！             │
│  ☑ repo:status                                     │
│  ☑ repo_deployment                                 │
│  ☐ repo:public_repo                                │
│  ☑ repo:invite                                     │
│  ...                                               │
│                                                   │
│         [ Generate token ]   ← 点绿色按钮          │
└─────────────────────────────────────────────────┘
```

3. **只勾选 `repo`** 那一大项就行（会自动选中子项）
4. 点击底部 **「Generate token」**
5. 页面会显示一串长字符，**这就是你的 Token**

> ⚠️ **这个 Token 只会显示一次！请立即复制保存！**

### 使用 Token 登录

push 时弹出登录窗口：
- **Username**：填你的 GitHub 用户名
- **Password**：填刚才生成的 Token（不是你的 GitHub 密码）

> ✅ 登录成功后，push 会继续执行并显示推送进度

---

## 第五步：开启 GitHub Pages

### 5.1 进入仓库设置

```
┌─────────────────────────────────────────────────────┐
│  你的仓库页面                                          │
│                                                        │
│  laubob-pgm/pgm-league                                 │
│                                                        │
│  Code  Issues  Pull requests  Actions  Projects  Wiki  │
│                                      │                │
│  ...                          你可能要先等Actions跑完    │
│                                                        │
│  ⬇️ 点击下方标签页                                      │
│                                                        │
│  Code    Issues    Pull requests    Actions           │
│                              Settings    ← 点这个     │
│                                                        │
│  ⬇️ 或者点击页面右上角的 ⚙️ 齿轮图标                      │
│                                                        │
│  [你的头像]  [⚙️ Settings]                              │
│                                                        │
└─────────────────────────────────────────────────────┘
```

- 打开你的仓库 `https://github.com/你的用户名/pgm-league`
- 点击 **「Settings」** 标签（仓库页面顶部标签栏最右边，或右上角 ⚙️ 图标）

### 5.2 配置 Pages

```
┌─────────────────────────────────────────────────────┐
│  Settings                                             │
│                                                        │
│  General    Access    Branches    Tags                 │
│  ...                                                   │
│  Pages    ← 左侧菜单找到这个，点击                      │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Build and deployment                             │  │
│  │                                                    │  │
│  │  Source: GitHub Actions  ▼                        │  │
│  │          │                                          │  │
│  │          ├── GitHub Actions   ← 选这个！           │  │
│  │          └── Deploy from a branch                   │  │
│  │                                                    │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│                                                        │
│  (选完 GitHub Actions 后可能需要点 Save)                 │
│                                                        │
└─────────────────────────────────────────────────────┘
```

- 在左侧菜单找到 **「Pages」** 并点击
- **Source** 下拉框选择 **「GitHub Actions」**

### 5.3 等待自动部署

回到仓库主页，点击 **「Actions」** 标签：

```
┌─────────────────────────────────────────────────────┐
│  Actions                                              │
│                                                        │
│  All workflows                                         │
│                                                        │
│  ┌─ Deploy PGM League to GitHub Pages ─────────────┐  │
│  │                                                   │  │
│  │  ⭕ main  Init...                    1m ago      │  │
│  │   │                                    ← 运行中  │  │
│  │   ├─ ✅ Checkout 代码                                │  │
│  │   ├─ ✅ 配置 GitHub Pages                           │  │
│  │   ├─ ⏳ 上传静态文件              ← 正在执行       │  │
│  │   └─ ○ 部署到 GitHub Pages                         │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                        │
└─────────────────────────────────────────────────────┘
```

> ✅ 等待约 **1~2 分钟**，所有步骤变为 ✅ 绿色勾号后，部署完成

---

## 第六步：访问你的在线联赛页面

部署成功后，打开浏览器访问：

```
https://你的用户名.github.io/pgm-league/
```

例如用户名是 `laubob-pgm`，则地址为：
```
https://laubob-pgm.github.io/pgm-league/
```

> 💡 如果页面打不开，等 1~2 分钟再试。浏览器缓存可能需要强制刷新（`Ctrl + Shift + R`）

---

## 第七步：日常修改后的同步流程

以后每次修改 `index.html` 后，按以下 **3 步**同步：

### 步骤一：打开 PowerShell，进入项目目录

```powershell
cd "C:\Users\J.K\WorkBuddy\20260407120000\PGM联赛"
```

### 步骤二：查看改了什么

```powershell
git status
```

输出示例：
```
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   index.html
```
> ✅ `modified: index.html` 表示 index.html 有改动，待提交

### 步骤三：提交并推送

```powershell
git add .
git commit -m "data: 录入第3轮比赛结果"
git push
```

> 💡 `-m` 后面是本次改动的说明，建议按以下格式写：

| 你做了什么 | 建议的 commit 信息 |
|-----------|-------------------|
| 录入了比赛数据 | `data: 录入第5轮比赛结果` |
| 修改了页面样式 | `ui: 优化积分榜手机端显示` |
| 修复了某个bug | `fix: 修正射手榜排序逻辑` |
| 添加了新功能 | `feat: 添加红黄牌统计` |
| 更新了球员名单 | `data: 更新巴塞罗那球员名单` |

推送后等待 1~2 分钟，线上自动更新。

---

## 第八步：在其他电脑上同步（可选）

### 在新电脑上克隆项目

```powershell
# 1. 安装 Git（参考第二步）
# 2. 打开 PowerShell

# 3. 克隆仓库
git clone https://github.com/你的用户名/pgm-league.git

# 4. 进入目录
cd pgm-league

# 5. 直接用编辑器打开 index.html 即可继续开发
```

### 已有项目的电脑拉取最新代码

```powershell
cd "C:\Users\J.K\WorkBuddy\20260407120000\PGM联赛"
git pull
```

> ✅ 这会从 GitHub 下载最新的代码，覆盖本地文件

---

## 常见问题速查

### Q1：push 时报错 `fatal: Authentication failed`

GitHub 不接受密码登录，需要使用 Token：
1. 去创建 Token（见第四步的「Token 认证问题」）
2. push 时密码栏填 Token 而非 GitHub 密码

### Q2：push 时报错 `fatal: remote origin already exists`

说明之前已经关联过远程仓库，忽略这步即可，直接执行 `git push`

### Q3：GitHub Pages 页面显示 404

- 确认 Actions 已完成（仓库 → Actions → 全部 ✅）
- 确认 Pages → Source 选的是 `GitHub Actions`
- 等 2~3 分钟再试
- 检查仓库名是否正确（地址格式：`用户名.github.io/仓库名/`）

### Q4：页面更新了但线上还是旧版本

- **强制刷新浏览器**：按 `Ctrl + Shift + R`
- **清除 Service Worker 缓存**：
  1. 打开网页 → 按 `F12` 打开开发者工具
  2. 切换到 **「Application」** / **「应用」** 标签
  3. 左侧找到 **「Service Workers」**
  4. 勾选 **「Update on reload」**
  5. 刷新页面

### Q5：想撤销某次提交

```powershell
# 查看历史提交
git log --oneline -10

# 回滚到上一个版本（只回滚 index.html）
git checkout HEAD~1 -- index.html
git commit -m "revert: 回滚 index.html"
git push
```

### Q6：误删了文件想恢复

```powershell
# 查看被删的文件
git status

# 恢复被删的文件
git restore index.html

# 如果已经提交了删除，用 checkout 恢复
git checkout HEAD~1 -- index.html
```

---

## 📌 速查卡片

打印出来贴在电脑旁：

```
┌──────────────────────────────────────────┐
│           PGM联赛 Git 速查                │
├──────────────────────────────────────────┤
│                                          │
│  进入目录：                               │
│  cd C:\Users\J.K\WorkBuddy\              │
│      20260407120000\PGM联赛              │
│                                          │
│  日常同步（3条命令）：                     │
│  git add .                               │
│  git commit -m "说明"                     │
│  git push                                │
│                                          │
│  拉取最新：                               │
│  git pull                                │
│                                          │
│  查看状态：                               │
│  git status                              │
│                                          │
│  查看历史：                               │
│  git log --oneline -10                   │
│                                          │
│  在线地址：                               │
│  用户名.github.io/pgm-league/            │
│                                          │
└──────────────────────────────────────────┘
```

---

> 📞 如遇问题，随时打开 `GITHUB_SYNC.md` 查阅或联系协助处理。
