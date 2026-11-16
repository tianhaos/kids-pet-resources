# 小宠学伴 · 资源同步仓库

「小宠学伴」App 的**资源同步源**。App 内置了本仓库的 6 条下载线路，家长在「家长中心 → 资料同步」挑线路 / 一键测速，或直接点「立即同步」即可增量下载到手机本地，**不需要手动填地址**。

## App 端配置

资源库地址（raw 基址）：

```
https://raw.githubusercontent.com/tianhaos/kids-pet-resources/main/
```

> 内置线路还包括 jsDelivr 全球 / 国内节点、GHProxy 反代、fastly jsDelivr 等，App 会自动比对各线路清单版本、取最新的一条同步。

## 仓库结构

| 目录 / 文件 | 内容 | 数量 |
|---|---|---|
| `manifest.json` | 同步清单：每个文件的 path / size / sha256 + 版本号 | 3355 条 |
| `voice/` | 预生成情感配音 mp3（甜美姐姐 sweet / 活泼哥哥 lively） | 3322 个 |
| `audio/` | 音效与背景音乐 wav | 4 个 |
| `books/` | 绘本插图 jpg | 28 张 |
| `data/poem_media.json` | **古诗动画片源表 v4**（可热更新，改完同步即生效） | 1 个 |
| `update.json` | **安装包更新清单**：版本号 / 整包 sha256 / 分片列表 / 更新说明 | 1 个 |
| `apk/v<版本>_<build>/` | 安装包分片，每片 6MB（App 下载后合并校验） | 约 11 片 / 版 |

## 古诗动画片源表 `data/poem_media.json`（v4）

**v1.6.0 起 App 不做任何搜索或地址解析**：找片这一步在资源维护时完成，把动画地址写进配置，App 只按配置打开。这样不会再出现「解析失败」的报错页。

### 配置格式

`items[诗名].videos[]` 是**数组**，一首诗可以配任意多条动画：

```json
{
  "version": 4,
  "items": {
    "静夜思": {
      "videos": [
        {
          "type": "video",
          "url": "https://example.com/jingyesi.mp4",
          "provider": "自有动画",
          "name": "静夜思 · 水墨动画",
          "official": true
        },
        {
          "type": "bilibili",
          "url": "BV1cKFoz1ESE",
          "provider": "哔哩哔哩",
          "name": "千秋诗颂 · 静夜思",
          "official": true
        }
      ]
    }
  },
  "search": {
    "provider": "哔哩哔哩",
    "url": "https://search.bilibili.com/all?keyword={q}",
    "query_prefix": "古诗动画"
  }
}
```

兼容旧写法：`items[诗名]` 直接写单条对象，或写成一个数组，App 都能读。

### 四种 `type`

| type | url 写法 | App 行为 |
|---|---|---|
| `video` | `https://…/xx.mp4`（或 m3u8 直链） | App 内全屏播放；需要防盗链时加 `"headers": {"Referer": "…"}` |
| `resource` | 资源包内相对路径，如 `video/jys.mp4` | 把 mp4 放进本仓库 → 同步到手机 → App 内播放 |
| `bilibili` | `BV1xxxxxxxxx` 或 B 站视频网址 | 优先唤起哔哩哔哩 APP（`bilibili://video/<BV>`），没装就打开网页 |
| `page` | 任意官方网页 `https://…` | 系统浏览器打开，官方页面自己播，App 不解析网页内容 |

`official: false` 的条目不会展示，避免把来路不明的内容推给孩子。`collection` 是节目专题页，`search` 是**没配动画时**的兜底搜索（默认按诗名搜哔哩哔哩），`fallback` 是备用搜索。

### App 里的三种行为

- 这首诗配了 **1 条** → 点「看动画」直接打开
- 配了 **多条** → 弹列表让孩子 / 家长挑，显示动画名、来源、播放方式，另有「去哔哩哔哩搜」入口
- **一条都没配** → 直接跳哔哩哔哩按诗名搜这一集的动画

目前内置 11 首《千秋诗颂》，每首配了「央视网官方单集页 + 实测过的 B 站 BV 号」两条，用来验证多动画列表。

### 维护流程（改配置不用发新版 APK）

在工作区根目录执行：

```bash
# 1. 编辑 kids_pet_learning/assets/data/poem_media.json
# 2. 巡检所有地址是否还有效
python kids_pet_learning/_build/check_poem_media.py

# 3. 校验格式 + 同步到本仓库 + 重算 manifest 的 size / sha256 / version
python _build/publish_poem_media.py

# 4. 提交推送
cd kids-pet-resources
git add -A && git commit -m "更新古诗动画片源" && git push
```

> **git push 卡认证时**：本机全局配置会把 `github.com` 重写到 ghproxy，push 常会失败。
> 可改用 API 脚本 `python _build/push_repo_media.py`（按需编辑脚本里的 `FILES` / `MESSAGE`，
> 一次 commit 同时更新多个文件）。发布安装包则直接用 `python _build/release_apk.py`，
> 它会自动提交清单 + 全部分片，不需要手动 git 操作。

最后在 App「家长中心 → 资料同步 → 立即同步」即可生效。同步成功后 App 会刷新片源缓存，不用重启、不用重装。

> **务必跑第 3 步**：App 下载时用 `manifest.json` 里的 sha256 校验文件，只改 `data/poem_media.json` 而不更新清单，会校验失败（或一直显示"已是最新"）。

## 同步机制

- App 启动时（可配置「进入即检测更新」）静默拉取 `manifest.json`，与本地已下载文件比对 **sha256**，**只增量下载有变化的文件**，下载到 App 私有目录后优先使用。
- 每个下载文件都会做 sha256 校验，校验不过不会落盘，避免 CDN 缓存的旧文件覆盖新资源。
- 未同步 / 未配置时，App 自动回退 APK 内置资源，完全不影响离线使用。
- 建议开启「仅 WiFi 自动下载」（首次全量约 68.8 MB）。

> **CDN 缓存提示**：jsDelivr 国内节点（`testingcf.jsdelivr.net`）对 `@main` 缓存较长。v1.3.9 起 App 会并发比对 6 条线路的清单版本、取最新的一条同步；老版本 APK 遇到「同步后仍是旧版」，在资料同步页手动切到「GitHub 直连 / jsDelivr 全球 / GHProxy 加速」再同步即可。

## 安装包在线更新（App 内升级）

家长在 App「家长中心 → 检查更新」就能看到新版本、下载并安装，**不用再连电脑传 APK**。孩子界面不显示任何更新提示，避免打扰小朋友。

### 为什么分片

本机网络只有 `api.github.com` / `raw.githubusercontent.com` 可达，`github.com` 和 `uploads.github.com` 都连不上，用不了 Release asset 和 `git push`；而 GitHub Git Data API 对单个 blob 有大小限制（60MB 整包实测返回 422）。所以把 APK 切成 **6MB 一片**，通过 API 上传。分片还有个好处：低于 jsDelivr 单文件 20MB 上限，App 能直接复用上面那 6 条资源下载线路，国内速度更好、断线自动换线路。

### `update.json` 格式

```json
{
  "schema": 1,
  "versionName": "1.7.0",
  "versionCode": 21,
  "apkName": "kids_pet_learning_v1.7.0_21.apk",
  "size": 63084372,
  "sha256": "整包 sha256",
  "partSize": 6291456,
  "parts": [
    {"path": "apk/v1.7.0_21/part_000.bin", "size": 6291456, "sha256": "该片 sha256"}
  ],
  "updatedAt": "2026-11-16T11:00:00+08:00",
  "minVersionCode": 0,
  "force": false,
  "changelog": ["新增：…", "修复：…"]
}
```

- `versionCode` 必须和 `pubspec.yaml` 里 `version: 1.7.0+21` 的 `+21` 一致，App 用它和本机版本比较；
- `parts[].path` 是**仓库相对路径**，App 用内置线路基址拼出下载 URL；
- 每片单独校验 sha256，合并后再校验整包 `sha256`，任何一片坏了都会换线路重下，绝不拿坏包去安装；
- `changelog` 一行一条，用 `|` 写在发布命令里；`force` 为 true 时 App 不提供「跳过此版本」。

### 发布新版本

```bash
# 1. 改 pubspec.yaml 的 version（版本号 + build 号都要 +1）
# 2. 在工作区根目录执行：打包并一次提交所有分片
python _build/release_apk.py --build --notes "新增：安装包在线更新|优化：手机里直接升级"

# 只想发布已经打好的 APK：
python _build/release_apk.py --notes "修复：…"

# 先本地预演，不上传：
python _build/release_apk.py --dry-run
```

脚本会：读 `pubspec.yaml` 版本 → 切 6MB 分片并算 sha256 → 生成 `update.json` → 通过 GitHub API **一次 commit** 提交清单 + 全部分片 + README（避免「新清单 + 旧分片」的中间态）→ 清理只保留最近 2 个版本的分片。token 从 Windows 凭据管理器读取，不打印、不落盘。

> 每次发版**务必同步递增 build 号**：App 只认 `versionCode`，版本号变了但 build 号没变会检测不到更新。

### App 端流程

1. 启动后静默并发拉 6 条线路的 `update.json`，取 `versionCode` 最大的一份（防 CDN 旧缓存）；只在**家长首页**亮「有新版本」角标；
2. 家长点「检查更新」看更新说明，点「下载更新」逐片下载，支持断点续传、自动换线路、屏幕常亮；
3. 下载完合并校验 → 调起系统安装界面（Android 8+ 首次需允许「安装未知应用」，App 内有引导按钮）；
4. 安装失败 / 用户取消，已下好的 APK 会保留，可随时点「重新打开安装界面」。

`update.json` 不进 `manifest.json`，资源同步不会去下载它，两套机制互不干扰。

## 古诗内容包（加诗只更新资源，不用重装 APK）

仓库根目录的 `content_pack.json` 是**完整诗单**（当前 105 首 = 内置 38 + 扩展 67）。App 启动时并发拉 6 条线路、取 `version` 最大的一份，有新版本就在加载题库前落盘，**本次启动即生效**，孩子界面零提示。

> 这个文件也不进 `manifest.json`，和安装包在线更新、二进制资源同步三套机制互不干扰。

### 新增 / 修改古诗后

```bash
# 1. 改诗单：直接编辑 kids_pet_learning/assets/data/poems.json（内置），
#    或在 kids_pet_learning/content/library/poem_extend_*.json 里加扩展资料，
#    然后运行 python _build/content_tools.py library 刷新清单。

# 2. 重新生成并推送内容包（版本号同日自动 +1，不用手改）：
python _build/publish_content_pack.py --note "新增古诗3首"

# 先本地预演、不上传：
python _build/publish_content_pack.py --dry-run

# 3. 端到端校验（模拟 App 启动预检，确认 6 线路取到最新、诗单是超集）：
python _build/verify_content_pack.py
```

推完手机**重启 App** 即看到新诗，不用改 Dart 代码、不用重新打包、不用走在线更新装 APK。

### 生效规则

- `version` 形如 `20261116.1`（日期.当天序号），App 按字符串比较取最大；同日重发脚本会自动递增序号；
- 家长在「内容热更新」点过「恢复内置内容」会暂时关闭预检，任何一次手动导入 / 检查会重新开启；
- 家长手动导入的内容（pinLocal）优先级最高，自动预检绝不覆盖；
- 内容包只带 `poems.json`，落盘时会保留已生效的其他数据文件（题库 / 宠物配置），不会冲掉。

## 合规边界

只用公开免费内容，不登录、不碰大会员 / 付费、不破解加密；App 不下载、不缓存、不转存任何一方的视频流。网页类片源由官方平台自己播放与授权。安装包为本 App 自有构建产物，仅通过本仓库分发。

---
小宠学伴 · 4 岁宝宝识字启蒙 App · 片源表 v4 · 安装包在线更新 v1 · 资源包版本见 `manifest.json`
