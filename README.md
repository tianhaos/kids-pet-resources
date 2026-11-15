# 小宠学伴 · 资源同步仓库

「小宠学伴」App 的**资源同步源**。App 内置了本仓库的 6 条下载线路，家长在「家长中心 → 资料同步」挑线路 / 一键测速，或直接点「立即同步」即可增量下载到手机本地，**不需要手动填地址**。

## App 端配置

资源库地址（raw 基址）：

```
https://raw.githubusercontent.com/tianhaos/kids-pet-resources/main/
```

> 内置线路还包括 jsDelivr 全球 / 国内节点、GHProxy 反代、fastly jsDelivr 等，App 会自动换线路重试。

## 仓库结构

| 目录 / 文件 | 内容 | 数量 |
|---|---|---|
| `manifest.json` | 同步清单：每个文件的 path / size / sha256 + 版本号 | 3355 条 |
| `voice/` | 预生成情感配音 mp3（甜美姐姐 sweet / 活泼哥哥 lively） | 3322 个 |
| `audio/` | 音效与背景音乐 wav | 4 个 |
| `books/` | 绘本插图 jpg | 28 张 |
| `data/poem_media.json` | 古诗动画片源表（可热更新，改完同步即生效） | 1 个 |

## 古诗动画片源表 `data/poem_media.json`

`items[诗名].type` 支持三种：

| type | url 写法 | 行为 |
|---|---|---|
| `page` | `https://…` 官方单集播放页 | 用系统浏览器外跳官方平台播放（央视网版权合规） |
| `video` | 可直链的 `https://…/xx.mp4` | App 内全屏播放 |
| `resource` | 资源包内相对路径，如 `video/jingyesi.mp4` | 把 mp4 放进本仓库 → 同步到手机 → App 内播放 |

`collection` 是节目专题页，`search` / `fallback` 是没配精确片源时的兜底搜索。目前 `items` 已收录 11 首《千秋诗颂》央视网官方单集页。

**改这份文件不需要发新版 APK**：改完 → 重新生成 `manifest.json` → 提交推送 → App 同步后自动 `invalidate()` 片源缓存并立即生效。

## 同步机制

- App 启动时（可配置「进入即检测更新」）静默拉取 `manifest.json`，与本地已下载文件比对 **sha256**，**只增量下载有变化的文件**，下载到 App 私有目录后优先使用。
- 每个下载文件都会做 sha256 校验，校验不过不会落盘，避免 CDN 缓存的旧文件覆盖新资源。
- 未同步 / 未配置时，App 自动回退 APK 内置资源，完全不影响离线使用。
- 建议开启「仅 WiFi 自动下载」（首次全量约 68.8 MB）。

> **CDN 缓存提示**：jsDelivr 的国内节点（`testingcf.jsdelivr.net`）对 `@main` 有较长缓存，推送后可能短时间内仍返回旧清单。App 会自动比对各线路清单版本、取最新的一条同步；老版本 APK 若遇到「同步后仍是旧版本」，在资料同步页手动切到「GitHub 直连 / jsDelivr 全球 / GHProxy 加速」任一线路再同步即可。

## 如何更新资源

在本项目 `kids_pet_learning/` 目录下运行：

```bash
python _build/gen_resource_manifest.py
```

重新生成 `manifest.json`（自动更新版本号与 sha256），然后把变动的资源文件与本清单一起提交推送：

```bash
git add -A
git commit -m "更新资源 2026.xx.xx"
git push
```

App 下次启动检测到新版本即自动增量更新。

---
小宠学伴 · 4 岁宝宝识字启蒙 App · 资源包版本 2026.11.15.1
