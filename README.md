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

最后在 App「家长中心 → 资料同步 → 立即同步」即可生效。同步成功后 App 会刷新片源缓存，不用重启、不用重装。

> **务必跑第 3 步**：App 下载时用 `manifest.json` 里的 sha256 校验文件，只改 `data/poem_media.json` 而不更新清单，会校验失败（或一直显示"已是最新"）。

## 同步机制

- App 启动时（可配置「进入即检测更新」）静默拉取 `manifest.json`，与本地已下载文件比对 **sha256**，**只增量下载有变化的文件**，下载到 App 私有目录后优先使用。
- 每个下载文件都会做 sha256 校验，校验不过不会落盘，避免 CDN 缓存的旧文件覆盖新资源。
- 未同步 / 未配置时，App 自动回退 APK 内置资源，完全不影响离线使用。
- 建议开启「仅 WiFi 自动下载」（首次全量约 68.8 MB）。

> **CDN 缓存提示**：jsDelivr 国内节点（`testingcf.jsdelivr.net`）对 `@main` 缓存较长。v1.3.9 起 App 会并发比对 6 条线路的清单版本、取最新的一条同步；老版本 APK 遇到「同步后仍是旧版」，在资料同步页手动切到「GitHub 直连 / jsDelivr 全球 / GHProxy 加速」再同步即可。

## 合规边界

只用公开免费内容，不登录、不碰大会员 / 付费、不破解加密；App 不下载、不缓存、不转存任何一方的视频流。网页类片源由官方平台自己播放与授权。

---
小宠学伴 · 4 岁宝宝识字启蒙 App · 片源表 v4 · 资源包版本见 `manifest.json`
