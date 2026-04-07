# PGM足球经理官方联赛 - 技术规范

## 1. 项目概述

**项目名称：** PGM足球经理官方联赛
**项目类型：** 移动优先 Web App（PWA）
**核心功能：** 足球联赛管理平台，支持多级别联赛、球队管理、赛程安排、比赛结果录入、自动生成数据榜单
**目标用户：** 联赛管理员、各球队主教练/助理教练

---

## 2. 联赛结构

### 2.1 联赛级别与分组

| 联赛 | 分组 | 球队数量 |
|------|------|----------|
| 超级联赛 | 无 | 12支 |
| 甲级联赛 | 东区 / 西区 | 各12支（共24支） |
| 乙级联赛 | 东部 / 西部 | 各12支（共24支） |

**总计：60支球队**

### 2.2 升降级规则

| 赛季结束 | 升级 | 降级 |
|----------|------|------|
| 超级联赛 | 无 | 积分榜最后2名 → 甲级（东区/西区各1名） |
| 甲级联赛 | 超级联赛最后2名降入甲级（按赛区） | 甲级积分榜最后2名 → 乙级（东区/西区各1名）；甲级积分榜第1名 → 超级 |
| 乙级联赛 | 甲级联赛最后2名降入乙级（按赛区） | 乙东积分榜前2名 → 甲级；乙西积分榜前2名 → 甲级 |

> **升降级逻辑（简化版）：**
> - 超级最后2名 → 甲级（东区/西区各1名）
> - 甲级最后2名 → 乙级（东区/西区各1名）
> - 甲级第1名 → 超级
> - 乙东前2名 → 甲级；乙西前2名 → 甲级

---

## 3. 功能模块

### 3.1 联赛积分榜

- 显示字段：**排名、球队、场次、胜、平、负、进球、失球、净胜球、积分**
- 支持按联赛/分组筛选
- 实时自动排序（积分 → 净胜球 → 进球）
- 颜色标注：升级区（绿色）、降级区（红色）

### 3.2 球队管理

- 球队列表（按分组显示）
- 球队详情：
  - 球队名称、Logo（emoji图标）
  - 主教练姓名
  - 球员名单（姓名、号码、位置、进球数、助攻数）
- 阵容管理：添加/编辑/删除球员
- 每支球队最多25人

### 3.3 球员数据

- 球员详情：球队、号码、姓名、位置、进球、助攻、评分
- 评分机制：每场比赛后由主教练手动评分（1-10分）

### 3.4 赛程管理

- 自动生成完整赛季赛程（每支球队与同组球队双循环，共22轮）
- 显示：轮次、日期、时间、主队、客队、场地
- 支持赛程编辑（日期、时间、场地调整）

### 3.5 比赛结果录入

**权限控制：**
- 主教练或助理教练（需登录）
- 只能录入自己球队参与的比赛

**录入内容：**
- 比分（主队得分、客队得分）
- 进球球员列表
- 助攻球员列表
- 比赛中最佳球员（Man of the Match）

**数据自动更新：**
- 积分榜实时更新
- 个人射手榜、助攻榜、最佳球员榜自动计算

### 3.6 数据榜单

#### 射手榜
- 显示：排名、球员姓名、球队、进球数
- 按联赛分组显示

#### 助攻榜
- 显示：排名、球员姓名、球队、助攻数

#### 最佳球员榜
- 显示：排名、球员姓名、球队、场均评分
- 需至少出场5场才有资格上榜

---

## 4. 技术方案

### 4.1 技术栈

- **前端：** 纯 HTML5 + CSS3 + Vanilla JavaScript
- **数据存储：** LocalStorage（本地持久化）
- **UI框架：** 自定义 CSS（移动优先设计）
- **打包：** PWA（Progressive Web App），可安装到手机桌面

### 4.2 数据结构

```javascript
// 球队
{
  id: "team_001",
  name: "球队名称",
  shortName: "简称",
  emoji: "⚽",
  league: "super",      // super, jiaEast, jiaWest, yiEast, yiWest
  coach: "主教练姓名",
  players: [
    {
      id: "player_001",
      name: "球员姓名",
      number: 10,
      position: "FW",   // GK, DF, MF, FW
      goals: 0,
      assists: 0,
      rating: 0,
      gamesPlayed: 0
    }
  ]
}

// 比赛
{
  id: "match_001",
  round: 1,
  homeTeam: "team_001",
  awayTeam: "team_002",
  date: "2026-04-15",
  time: "15:00",
  venue: "主场球场",
  homeScore: null,
  awayScore: null,
  scorers: [],         // [{playerId, teamId, minute}]
  assists: [],         // [{playerId, teamId}]
  motm: null,          // playerId
  status: "pending"    // pending, completed
}

// 赛季设置
{
  currentSeason: "2025-2026",
  currentRound: 1,
  promotionRules: { ... }
}
```

### 4.3 用户权限

- **超级管理员：** 可管理所有球队、录入所有比赛、编辑赛程
- **球队主教练/助教：** 仅可录入本队比赛、查看本队数据

**登录方式：** 简单密码认证（可扩展为真实后端认证）

---

## 5. UI/UX 设计

### 5.1 视觉风格

- **主题色：** 深绿色（#1B5E20）为主色调，足球草坪绿渐变
- **强调色：** 金色（#FFD700）用于冠军、高亮
- **背景：** 浅灰白（#F5F5F5）底色，卡片式布局
- **字体：** 无衬线字体，清晰易读

### 5.2 导航结构

```
底部 Tab 导航：
├── 首页（联赛概览）
├── 积分榜
├── 球队
├── 赛程
└── 榜单

侧滑菜单（右上角）：
├── 我的球队
├── 录入比赛
├── 设置
└── 登录/退出
```

### 5.3 移动优先

- 设计基于 375px 宽度屏幕
- 点击区域最小 44px × 44px
- 卡片式信息展示
- 下拉刷新、上拉加载

---

## 6. 球队数据

### 第62届PGM联赛参赛球队（60支）

#### 超级联赛（12支）
A. Bilbao, Arsenal, Aston Villa, Barcelona, Benfica, FC Bayern, Juventus, Man City, Palmeiras, Paris SG, River, Wrexham

#### 甲级联赛-东区（12支）
1860 Munchen, Aberdeen, AS Roma, Atl. Tucuman, Dortmund, Fulham, Hertha BSC, Liverpool, Marseille, Monaco, Newcastle, Nottm Forest

#### 甲级联赛-西区（12支）
Ajax, Brighton, Chelsea, Everton, Fiorentina, Frankfurt, Genk, Hamburger SV, Lazio, Leicester, RC Lens, Schalke

#### 乙级联赛-东部（12支）
A. Madrid, Asante Kotoko, Como, FC Porto, Leverkusen, Oriental Dragon, R. Madrid, Stuttgart, Sunderland, Tottenham, 青岛海神, 上海绿地

#### 乙级联赛-西部（12支）
AC Milan, Atalanta, Celtic, FC Koln, Flamengo, Inter, Man Utd, Napoli, PSV, Sporting, West Ham, Wolfsburg

### 队徽
- 所有球队使用 Transfermarkt 官方队徽 CDN 图片
- 格式: `https://img.a4manatransfermarkt.de/images/logo-klein/verein/{id}.png`

### 球员数据
- **UID系统**：每名球员拥有唯一识别码（UID），用于跨版本数据绑定
- **数据来源**：第62届PGM联赛官方球员名单
- **球员数量**：每队约30-35名球员
- **位置分配**：根据球员在名单中的顺序自动分配（门将0-3，后卫4-7，中场8-11，前锋12+）
- **统计字段**：进球、助攻、评分、出场次数、MOTM次数

---

## 7. 赛季赛程

### 第62届PGM联赛赛程表

第62届联赛使用官方指定的固定赛程表，每个联赛22轮，每轮6场比赛，共132场/联赛。

**超级联赛赛程：** 22轮（见index.html中的LEAGUE_FIXTURES.super）
**甲东联赛赛程：** 22轮（见index.html中的LEAGUE_FIXTURES.jiaEast）
**甲西联赛赛程：** 22轮（见index.html中的LEAGUE_FIXTURES.jiaWest）
**乙东联赛赛程：** 22轮（见index.html中的LEAGUE_FIXTURES.yiEast）
**乙西联赛赛程：** 22轮（见index.html中的LEAGUE_FIXTURES.yiWest）

**数据格式：**
```javascript
// 每个联赛的赛程使用紧凑的索引格式
// {h: 主场球队索引, a: 客场球队索引}
// 球队索引对应TEAM_NAMES数组中的位置
LEAGUE_FIXTURES = {
  super: [
    [{h:0,a:11}, {h:5,a:1}, ...],  // 第1轮
    [{h:11,a:0}, {h:1,a:5}, ...],  // 第2轮
    // ... 共22轮
  ],
  ...
}
```

**总计：** 660场比赛/赛季（5个联赛 × 22轮 × 6场）

---

## 8. 验收标准

- [ ] 五个联赛/分组的积分榜正确显示和排序
- [ ] 球队管理（增删改查球员）功能完整
- [ ] 赛程自动生成并正确显示
- [ ] 主教练可录入比赛结果（需登录验证）
- [ ] 射手榜、助攻榜、最佳球员榜自动计算并实时更新
- [ ] 升降级规则逻辑正确
- [ ] 移动端界面友好，可添加到桌面
- [ ] 数据持久化存储在 LocalStorage
