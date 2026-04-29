# HeyGen Helper — Auto Click

HeyGen 辅助浏览器插件，自动处理 [app.heygen.com](https://app.heygen.com) 上的重复性操作，提升视频批量生产效率。

**当前版本：2.3.0**

---

## 版本说明

| 分支 | 适用浏览器 |
|------|-----------|
| `chrome` | Chrome / Edge（Manifest V3） |
| `main` | Firefox |

---

## 功能列表

| 模块 | 触发页面 | 说明 |
|------|---------|------|
| **proc01** 问卷自动填写 | `/onboarding` | 自动选择问卷选项，跳过新用户引导 |
| **proc02** 图片更新 | `/onboarding` | 自动上传/替换 Avatar 图片 |
| **proc03** 引导跳过 | AI Studio 欢迎页 | 自动点击跳过新手引导流程 |
| **proc04** 字幕预设 | `/create-v4/` 编辑器 | 保存并自动应用字幕样式、位置、字号 |
| **proc05** Avatar 表单 | `/avatars/create/` | 自动填写 Avatar 创建表单 |
| **proc06** 输出命名 | `/create-v4/` 编辑器 | 自动设置视频输出文件名 |
| **proc07** 弹框处理 | 全站 | 自动关闭升级提示、评分弹框、上传审核等弹窗 |
| **proc08** 批量下载 | `/projects` | 批量下载并可选删除 Projects 页面中的视频 |
| **proc09** 自动跳转 | `/projects` | 视频数不足 3 个时，自动倒计时跳转到 Avatar 页面 |

快捷键：`Cmd+B`（Mac）/ `Ctrl+B`（Windows）— 触发生成视频

---

## 安装方式

### Chrome / Edge

1. 切换到 `chrome` 分支，下载或 Clone 代码
2. 打开 `chrome://extensions/`，开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」，选择项目根目录
4. 访问 `https://app.heygen.com` 即可使用

### Firefox

1. 切换到 `main` 分支，下载或 Clone 代码
2. 打开 `about:debugging#/runtime/this-firefox`
3. 点击「临时载入附加组件」，选择项目根目录下的 `manifest.json`

---

## 使用说明

插件加载后会在页面右侧显示控制面板，各流程根据当前页面内容自动触发。

- **批量下载**：在 Projects 页面点击控制面板中的下载按钮启动
- **字幕预设**：在编辑器页面手动配置一次后，后续自动应用
- **自动跳转**：需在控制面板中开启「自动跳转」开关才会生效
- **清理数据**：删除功能独立于下载，在「清理数据」对话框中单独操作

---

## 权限说明

| 权限 | 用途 |
|------|------|
| `storage` | 保存字幕预设、开关状态等本地设置 |
| `downloads` | 批量下载视频文件 |
| `tabs` / `scripting` | 在 HeyGen 页面注入自动化脚本 |
| `browsingData` / `cookies` | 清理指定缓存数据（仅 Cookies、LocalStorage、IndexedDB） |

---

## 项目结构

```
js/
├── myUtil.js        工具函数（sleep、重试等）
├── myElementA.js    控制面板 UI 组件
├── mySimulate.js    模拟用户输入（点击、键盘事件）
├── myXPath.js       XPath 工具封装
├── proc01-09*.js    各自动化流程模块
content.js           主入口，MutationObserver 统一调度
background.js        Service Worker（后台任务）
```

---

## 更新日志

### v2.3.0

**字幕功能全面修复**

- **修复 captionId 无法保存**：HeyGen 当前版本不在 DOM 上暴露字幕样式的选中状态（aria、class、style 均无差异），原有 7 种检测策略全部失效。改用**点击拦截**方案：在 document capture 阶段监听 `[data-caption-id]` 卡片点击，用户点选哪张样式即记录其 id，保存时直接使用。
- **修复字幕样式无法自动应用**：`_applySettings()` 中查找样式卡片的 XPath（`h2[text()="Captions"]`）在当前 HeyGen DOM 中不存在。改为直接使用 `querySelector('[data-caption-id="xxx"]')`，并等待卡片实际渲染后再点击。
- **修复位置 Y / 字号无法自动应用**：移除失效的容器守卫，直接查找对应输入框和字号元素。
- **优化保存响应速度**：已有点击记录时跳过面板打开和卡片等待流程，保存操作立即执行。

**界面调整**

- 字幕设置独立为主行按钮（CC 图标），点击一键应用已保存字幕样式
- 设置按钮移至插件图标右侧

---

### v2.2.0

**崩溃修复**

- 修复 Chrome 浏览器崩溃问题：`browsingData.remove()` 限制为仅清理 Cookies、LocalStorage、IndexedDB、Downloads，消除 SIGSEGV 风险

**字幕自动设置（全面重构）**

- 自动应用上次字幕预设，新增 Script 输入触发，改为 URL 路径匹配触发，修复语法错误，最多自动重试 3 次，新增并发保护锁

**批量下载（稳定性提升）**

- 修复漏下载（React 重渲染后 DOM 引用失效）、重复下载（嵌套卡片去重）、小窗口漏下载（自动滚动加载全部卡片）
- 下载与删除功能分离，避免误操作

**其他**

- 适配 HeyGen 新 UI 的头像上传流程
- 设置面板与清理对话框重新设计
- 插件图标更新为彩色 Pinwheel 图标

---

## License

MIT

---

## Download

Download the latest signed release asset from:

https://github.com/secure-artifacts/HgClicker/releases

For this browser extension, download `hgclicker-<tag>.zip`, unzip it to a stable local folder, then load the unzipped folder from `chrome://extensions` with Developer mode enabled.

## Verify provenance

After downloading the zip file, verify that it was built and uploaded by the official GitHub Actions workflow:

```bash
gh attestation verify ./hgclicker-<tag>.zip --repo secure-artifacts/HgClicker
```

Successful verification means the artifact provenance matches the official repository workflow.

## 如何发布新版本

本项目使用 GitHub Actions 自动构建和发布。每次发布新版本只需要创建一个 Git Tag 并推送即可。

### 发布步骤

#### 1. 确保代码已提交并推送

在发布之前，确保你的所有代码改动已经提交并推送到 GitHub：

```bash
git status
git add .
git commit -m "你的改动说明"
git push origin main
```

#### 2. 创建版本 Tag

Git Tag 是一个版本标记，用于标识发布的版本号。版本号格式为 `v主版本.次版本.修订版本`，例如 `v1.0.0`、`v1.1.0`、`v2.0.0`。

```bash
git tag -a v2.3.1 -m "Release version 2.3.1"
```

#### 3. 推送 Tag 触发自动构建

```bash
git push origin v2.3.1
```

推送后，GitHub Actions 会自动执行以下操作：

1. 打包浏览器扩展 zip
2. 生成安全签名 Attestation
3. 创建 Release 并上传构建产物

#### 4. 查看构建结果

- 构建进度：访问项目的 Actions 页面查看
- 发布结果：访问项目的 Releases 页面查看已发布的文件

### 版本号说明

| 版本号格式 | 什么时候用 | 示例 |
|-----------|-----------|------|
| `vX.0.0` | 重大更新、不兼容改动 | `v2.0.0` |
| `vX.Y.0` | 新增功能 | `v2.4.0` |
| `vX.Y.Z` | 修复 bug | `v2.3.1` |

### 如果构建失败怎么办

1. 访问项目的 Actions 页面查看错误日志
2. 修复代码或 workflow 问题
3. 删除失败的 tag 并重新创建：

```bash
git tag -d v2.3.1
git push origin :refs/tags/v2.3.1
git tag -a v2.3.1 -m "Release version 2.3.1"
git push origin v2.3.1
```
