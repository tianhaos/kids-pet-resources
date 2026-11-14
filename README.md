# 小宠学伴 · 资源同步仓库

「小宠学伴」App 的**资源同步源**。App 内「家长模式 → 我的 → 设置 → 资料同步」填入本仓库的 raw 基址，即可把资源下载/增量更新到手机本地。

## App 端配置

资源库地址（raw 基址）：

```
https://raw.githubusercontent.com/tianhaos/kids-pet-resources/main/
```

> 也可使用 jsDelivr CDN（国内更快）：`https://cdn.jsdelivr.net/gh/tianhaos/kids-pet-resources@main/`

## 仓库结构

| 目录 / 文件 | 内容 | 数量 |
|---|---|---|
| `manifest.json` | 同步清单：每个文件的 path / size / sha256 + 版本号 | 3354 条 |
| `voice/` | 预生成情感配音 mp3（甜美姐姐 sweet / 活泼哥哥 lively） | 3322 个 |
| `audio/` | 音效与背景音乐 wav | 4 个 |
| `books/` | 绘本插图 jpg | 28 张 |

## 同步机制

- App 启动时（可配置「进入即检测更新」）静默拉取 `manifest.json`，与本地已下载文件比对 **sha256**，**只增量下载有变化的文件**，下载到 App 私有目录后优先使用。
- 未同步 / 未配置时，App 自动回退 APK 内置资源，完全不影响离线使用。
- 建议开启「仅 WiFi 自动下载」（首次全量约 68.8 MB）。

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
小宠学伴 · 4 岁宝宝识字启蒙 App · 资源包版本 2026.11.14
