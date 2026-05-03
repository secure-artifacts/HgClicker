// proc08BatchDownload.js — HeyGen 批量下载 & 删除

class proc08BatchDownload {

    // ========== 入口 ==========
    static async start() {
        const self = this;
        try {
            if (!window.location.href.includes('/projects')) {
                self._showToast('⚠️ 请在 Projects 页面使用批量下载', 4000);
                return { status: false, msg: '不是目标页面' };
            }
            await self._batchDownload();
            return { status: true, msg: '执行完成' };
        } catch (err) {
            self._log(`主流程出错: ${err.message}`, 'error');
            return { status: false, msg: err.message };
        }
    }

    // ========== 日志 ==========
    static _log(msg, type = 'info') {
        try { console.log(`[HeyGen下载][${type}] ${msg}`); } catch (_) {}
    }

    // ========== Toast ==========
    static _showToast(html, durationMs = 5000) {
        try {
            const old = document.getElementById('hg-dl-toast');
            if (old) old.remove();
            const el = document.createElement('div');
            el.id = 'hg-dl-toast';
            el.innerHTML = html;
            document.body.appendChild(el);
            if (durationMs > 0) setTimeout(() => { try { el.remove(); } catch (_) {} }, durationMs);
            return el;
        } catch (_) { return null; }
    }

    static _hideToast() {
        try { const t = document.getElementById('hg-dl-toast'); if (t) t.remove(); } catch (_) {}
    }

    // ========== 确认对话框 ==========
    static _showConfirm(message) {
        return new Promise((resolve) => {
            let resolved = false;
            const cleanup = (val) => {
                if (resolved) return;
                resolved = true;
                try { overlay.remove(); } catch (_) {}
                resolve(val);
            };
            const overlay = document.createElement('div');
            overlay.id = 'hg-dl-confirm-overlay';
            overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(false); });
            const box = document.createElement('div');
            box.id = 'hg-dl-confirm-box';
            const msgEl = document.createElement('div');
            msgEl.id = 'hg-dl-confirm-msg';
            msgEl.innerHTML = message;
            const row = document.createElement('div');
            row.id = 'hg-dl-confirm-row';
            const noBtn = document.createElement('button');
            noBtn.className = 'hg-dl-confirm-cancel';
            noBtn.textContent = '取消';
            noBtn.addEventListener('click', () => cleanup(false), { once: true });
            const yesBtn = document.createElement('button');
            yesBtn.className = 'hg-dl-confirm-ok';
            yesBtn.textContent = '删除';
            yesBtn.addEventListener('click', () => cleanup(true), { once: true });
            row.appendChild(noBtn);
            row.appendChild(yesBtn);
            box.appendChild(msgEl);
            box.appendChild(row);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        });
    }

    // ========== 工具函数 ==========
    static _sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

    static _isAlive(el) {
        try { return el && el.isConnected && el.offsetParent !== null; } catch (_) { return false; }
    }

    static _isVisible(el) {
        try {
            if (!el || !el.isConnected) return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
        } catch (_) { return false; }
    }

    static _safeRect(el) {
        try { return (el && el.isConnected) ? el.getBoundingClientRect() : null; } catch (_) { return null; }
    }

    static _safeClick(el) {
        try { if (el && el.isConnected) { el.click(); return true; } } catch (_) {}
        return false;
    }

    static _safeDispatch(el, event) {
        try { if (el && el.isConnected) el.dispatchEvent(event); } catch (_) {}
    }

    static _waitFor(predicate, timeout = 8000, interval = 500) {
        return new Promise((resolve) => {
            let settled = false;
            let timer = null;
            const done = (val) => {
                if (settled) return;
                settled = true;
                if (timer !== null) clearInterval(timer);
                resolve(val);
            };
            try { const r = predicate(); if (r) { done(r); return; } } catch (_) {}
            const start = Date.now();
            timer = setInterval(() => {
                try { const r = predicate(); if (r) { done(r); return; } } catch (_) {}
                if (Date.now() - start >= timeout) done(null);
            }, interval);
        });
    }

    // ========== Background 通信 ==========
    static _interceptNextDownload(timeoutMs = 30000) {
        return new Promise((resolve) => {
            let done = false;
            const finish = (val) => { if (!done) { done = true; resolve(val); } };
            try {
                chrome.runtime.sendMessage(
                    { action: 'interceptNextDownload', timeout: timeoutMs },
                    (res) => { if (chrome.runtime.lastError) { finish(null); return; } finish(res); }
                );
            } catch (_) { finish(null); }
            setTimeout(() => finish(null), timeoutMs + 2000);
        });
    }

    static _downloadViaExtension(url, filename) {
        return new Promise((resolve) => {
            try {
                chrome.runtime.sendMessage(
                    { action: 'downloadFile', url, filename },
                    (res) => { if (chrome.runtime.lastError) { resolve(false); return; } resolve(res && res.success); }
                );
            } catch (_) { resolve(false); }
        });
    }

    // ========== 滚动加载全部卡片（应对虚拟滚动）==========
    static async _scrollToLoadAll() {
        const self = this;
        try {
            const findScroller = () => {
                for (const el of document.querySelectorAll('*')) {
                    try {
                        if (!el.isConnected) continue;
                        const style = window.getComputedStyle(el);
                        const overflow = style.overflow + style.overflowY;
                        if (!overflow.includes('auto') && !overflow.includes('scroll')) continue;
                        if (el.scrollHeight > el.clientHeight + 50 && el.clientHeight > 200) return el;
                    } catch (_) {}
                }
                return null;
            };

            const scroller = findScroller();
            const scrollEl = scroller || document.documentElement;

            scrollEl.scrollTop = 0;
            await self._sleep(300);

            let lastScrollTop = -1;
            let sameCount = 0;
            while (sameCount < 3) {
                scrollEl.scrollTop += Math.max(300, scrollEl.clientHeight * 0.6);
                await self._sleep(350);
                if (scrollEl.scrollTop === lastScrollTop) {
                    sameCount++;
                } else {
                    sameCount = 0;
                    lastScrollTop = scrollEl.scrollTop;
                }
            }

            scrollEl.scrollTop = 0;
            await self._sleep(400);
        } catch (_) {}
    }

    // ========== 提取卡片唯一 Key ==========
    static _getCardKey(card) {
        try {
            for (const attr of ['data-id', 'data-video-id', 'data-item-id', 'id']) {
                const v = card.getAttribute(attr);
                if (v && v.length > 2) return `id:${v}`;
            }
            for (const el of card.querySelectorAll('span, p, div, h3, h4, h5')) {
                if (el.children.length > 0) continue;
                const text = (el.textContent || '').trim();
                if (!text || text.length < 2 || text.length > 120) continue;
                if (/^(Avatar Video|Draft|just now|\d)/.test(text)) continue;
                if (/\b(minute|hour|day|second|ago|just)\b/i.test(text)) continue;
                return `title:${text}`;
            }
        } catch (_) {}
        return null;
    }

    // ========== 按 Key 重新查找卡片 ==========
    static _findCardByKey(key, fallbackIndex) {
        const self = this;
        try {
            const allCards = self._findVideoCards().filter(c => !self._isDraftCard(c));
            const byIndex  = () => (fallbackIndex !== undefined ? allCards[fallbackIndex] : null) || null;

            if (!key) return byIndex();

            if (key.startsWith('id:')) {
                const id = key.slice(3);
                return allCards.find(c =>
                    ['data-id','data-video-id','data-item-id','id'].some(a => c.getAttribute(a) === id)
                ) || byIndex();
            }
            if (key.startsWith('title:')) {
                const title = key.slice(6);
                const found = allCards.find(card => {
                    for (const el of card.querySelectorAll('span, p, div, h3, h4, h5')) {
                        if (el.children.length > 0) continue;
                        if ((el.textContent || '').trim() === title) return true;
                    }
                    return false;
                });
                return found || byIndex();
            }
            if (key.startsWith('pos:')) {
                const idx = parseInt(key.slice(4));
                return allCards[idx] || byIndex();
            }
        } catch (_) {}
        return null;
    }

    // ========== 判断是否为 Draft 卡片 ==========
    static _isDraftCard(card) {
        try {
            return Array.from(card.querySelectorAll('*')).some(el =>
                el.children.length === 0 &&
                (el.textContent || '').trim().toLowerCase() === 'draft'
            );
        } catch (_) { return false; }
    }

    // ========== 查找视频卡片 ==========
    static _findVideoCards() {
        try {
            const groups = document.querySelectorAll('div.tw-group.tw-min-w-0');
            if (groups.length > 0) {
                const valid = Array.from(groups).filter((g) => {
                    try {
                        if (g.parentElement && g.parentElement.closest('div.tw-group.tw-min-w-0')) return false;
                        const t = g.textContent || '';
                        return t.includes('Avatar Video') || t.includes('ago') ||
                               t.includes('minutes') || t.includes('hours') || t.includes('just now');
                    } catch (_) { return false; }
                });
                if (valid.length > 0) return valid;
            }
            const spans = document.querySelectorAll('span.tw-truncate');
            const cards = [];
            for (const span of spans) {
                try {
                    if (span.textContent.trim() === 'Avatar Video') {
                        let p = span.parentElement;
                        for (let i = 0; i < 8 && p; i++) {
                            if (p.classList && p.classList.contains('tw-group')) { cards.push(p); break; }
                            p = p.parentElement;
                        }
                    }
                } catch (_) {}
            }
            return cards;
        } catch (_) { return []; }
    }

    // ========== 勾选卡片的 checkbox ==========
    static async _checkCard(card) {
        const self = this;
        // 最多重试 3 次，每次间隔 400ms
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const outer = (card.closest && card.closest('div.tw-relative')) || card;

                // 触发 hover 事件，让 checkbox 显现
                self._safeDispatch(outer, new MouseEvent('mouseenter', { bubbles: true }));
                self._safeDispatch(card,  new MouseEvent('mouseenter', { bubbles: true }));
                self._safeDispatch(card,  new MouseEvent('mouseover',  { bubbles: true }));
                self._safeDispatch(card,  new MouseEvent('mousemove',  { bubbles: true, clientX: 10, clientY: 10 }));
                await self._sleep(400);

                // 策略1：标准 checkbox
                let cb = outer.querySelector('input[type="checkbox"]') ||
                         outer.querySelector('[role="checkbox"]')       ||
                         card.querySelector('input[type="checkbox"]')   ||
                         card.querySelector('[role="checkbox"]');

                // 策略2：左上角任意可点击元素（button / div / span）
                if (!cb) {
                    const outerRect = self._safeRect(outer);
                    if (outerRect) {
                        for (const el of outer.querySelectorAll('button, [role="button"], div, span')) {
                            try {
                                const r = self._safeRect(el);
                                if (!r || r.width === 0) continue;
                                const relLeft = r.left - outerRect.left;
                                const relTop  = r.top  - outerRect.top;
                                if (relLeft >= 0 && relLeft < 70 && relTop >= 0 && relTop < 70) {
                                    cb = el; break;
                                }
                            } catch (_) {}
                        }
                    }
                }

                if (cb) {
                    self._log(`第 checkbox 找到 (attempt ${attempt + 1}): ${cb.tagName} class="${(cb.className||'').substring(0,60)}"`);
                    self._safeClick(cb);
                    await self._sleep(200);
                    return true;
                }
                self._log(`attempt ${attempt + 1}: 未找到 checkbox，重试...`);
            } catch (_) {}
        }
        return false;
    }

    // ========== 立即检查工具栏是否存在（同步，不等待）==========
    static _findToolbarNow() {
        try {
            for (const el of document.querySelectorAll('div.tw-fixed')) {
                if (!el.isConnected) continue;
                const cls = el.className || '';
                if (cls.includes('tw-bottom-4') && cls.includes('tw-bg-black/90')) return el;
            }
        } catch (_) {}
        return null;
    }

    // ========== 等待底部工具栏出现 ==========
    // 工具栏特征 class：tw-bg-black/90 tw-fixed tw-bottom-4 tw-left-1/2
    static async _waitForToolbar(timeout = 5000) {
        const self = this;
        return self._waitFor(() => {
            try {
                // 策略1：精确 class 匹配（已确认的工具栏 class）
                for (const el of document.querySelectorAll('div.tw-fixed')) {
                    if (!el.isConnected) continue;
                    const cls = el.className || '';
                    if (cls.includes('tw-bottom-4') && cls.includes('tw-bg-black/90')) return el;
                }
                // 策略2：兜底 — 固定在底部且包含 selected 文字
                for (const el of document.querySelectorAll('div')) {
                    if (!el.isConnected) continue;
                    const cls = el.className || '';
                    if (!cls.includes('tw-fixed')) continue;
                    const text = el.textContent || '';
                    if (text.includes('selected') || text.includes('Select All')) return el;
                }
            } catch (_) {}
            return null;
        }, timeout, 300);
    }

    // ========== 在工具栏中找并点击下载按钮 ==========
    static async _clickToolbarDownload(toolbar) {
        const self = this;
        try {
            // 策略1：aria-label 含 download
            for (const b of (toolbar || document).querySelectorAll('button, [role="button"]')) {
                try {
                    const aria = (b.getAttribute('aria-label') || '').toLowerCase();
                    const title = (b.getAttribute('title') || '').toLowerCase();
                    if (aria.includes('download') || title.includes('download')) {
                        self._safeClick(b);
                        return true;
                    }
                } catch (_) {}
            }

            // 策略2：工具栏内的图标按钮按位置顺序（Move=1, Download=2, Delete=3, Close=4）
            // 找到所有工具栏内可见的图标按钮，取第2个（下载）
            if (toolbar) {
                const iconBtns = Array.from(toolbar.querySelectorAll('button, [role="button"]')).filter(b => {
                    try {
                        const r = self._safeRect(b);
                        return r && r.width > 0 && r.height > 0;
                    } catch (_) { return false; }
                });
                self._log(`工具栏按钮数: ${iconBtns.length}`);
                // Move(0), Download(1), Delete(2), Close(3) — 取索引 1
                if (iconBtns.length >= 2) {
                    self._safeClick(iconBtns[1]);
                    return true;
                }
            }
        } catch (_) {}
        return false;
    }

    // ========== 关闭底部工具栏（点 × 按钮）==========
    static async _closeToolbar(toolbar) {
        const self = this;
        try {
            await self._sleep(300);
            // 找工具栏内的关闭按钮（× / Close）
            if (toolbar && toolbar.isConnected) {
                const btns = Array.from(toolbar.querySelectorAll('button, [role="button"]')).filter(b => {
                    try { const r = self._safeRect(b); return r && r.width > 0; } catch (_) { return false; }
                });
                // 最后一个通常是 ×
                const closeBtn = btns[btns.length - 1];
                if (closeBtn) { self._safeClick(closeBtn); await self._sleep(300); return; }
            }
            // 兜底：Escape 键
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
            await self._sleep(300);
        } catch (_) {}
    }

    // ========== 处理下载模态框 ==========
    // 流程：工具栏 Download 图标 → 弹出模态框 → 点击大 Download 按钮 → 下载开始，模态框自动关闭
    static async _handleDownloadModal() {
        const self = this;
        try {
            // 等待模态框出现（最多 5 秒）
            // 特征：包含大 Download 按钮（宽度 > 150px，区别于工具栏小图标）
            const dlBtn = await self._waitFor(() => {
                for (const b of document.querySelectorAll("button, a, [role='button']")) {
                    try {
                        const text = (b.textContent || '').trim();
                        if (text !== 'Download' && text !== '下载') continue;
                        if (!self._isAlive(b)) continue;
                        const rect = self._safeRect(b);
                        if (rect && rect.width > 150) return b;
                    } catch (_) {}
                }
                return null;
            }, 5000, 300);

            if (!dlBtn) {
                self._log('未找到下载模态框', 'warn');
                return false;
            }

            self._log('点击模态框 Download 按钮');
            await self._sleep(200);
            self._safeClick(dlBtn);

            // 模态框点击后自动关闭，等待其消失（最多 4 秒）
            await self._waitFor(() => {
                for (const b of document.querySelectorAll("button, a, [role='button']")) {
                    try {
                        const text = (b.textContent || '').trim();
                        if (text !== 'Download' && text !== '下载') continue;
                        if (!self._isAlive(b)) continue;
                        const rect = self._safeRect(b);
                        if (rect && rect.width > 150) return false; // 仍然存在，继续等
                    } catch (_) {}
                }
                return true; // 模态框已消失
            }, 4000, 300);

            await self._sleep(300);
            return true;
        } catch (_) { return false; }
    }

    // ========== 全选并删除 ==========
    static async _selectAllAndDelete() {
        const self = this;
        try {
            self._log('开始全选视频...', 'info');

            const freshCards = self._findVideoCards();
            if (freshCards.length === 0) {
                self._log('未找到视频卡片', 'error');
                return false;
            }

            for (const card of freshCards) {
                try {
                    if (!card.isConnected) continue;
                    const outer = (card.closest && card.closest('div.tw-relative')) || card;

                    self._safeDispatch(outer, new MouseEvent('mouseenter', { bubbles: true }));
                    self._safeDispatch(card,  new MouseEvent('mouseenter', { bubbles: true }));
                    await self._sleep(400);

                    let cb = null;
                    try {
                        cb = outer.querySelector('input[type="checkbox"]') ||
                             outer.querySelector('[role="checkbox"]')       ||
                             card.querySelector('input[type="checkbox"]')  ||
                             card.querySelector('[role="checkbox"]');
                    } catch (_) {}

                    if (!cb) {
                        try {
                            const outerRect = self._safeRect(outer);
                            if (outerRect) {
                                for (const b of outer.querySelectorAll('button')) {
                                    const r = self._safeRect(b);
                                    if (r && r.left - outerRect.left < 50 && r.top - outerRect.top < 50) {
                                        cb = b; break;
                                    }
                                }
                            }
                        } catch (_) {}
                    }

                    if (cb) self._safeClick(cb);
                } catch (_) {}
                await self._sleep(300);
            }

            self._log('等待 Delete 按钮...', 'info');
            const trashBtn = await self._waitFor(() => {
                try {
                    const btns = Array.from(document.querySelectorAll('button,[role="button"]'))
                        .filter(b => {
                            try {
                                const r = b.getBoundingClientRect();
                                return b.isConnected && r.width > 0 && r.height > 0
                                    && r.top > window.innerHeight * 0.7;
                            } catch (_) { return false; }
                        });

                    for (const b of btns) {
                        try {
                            const aria  = (b.getAttribute('aria-label') || '').toLowerCase();
                            const title = (b.getAttribute('title')      || '').toLowerCase();
                            const text  = (b.textContent || '').trim().toLowerCase();
                            if (aria.includes('delete')  || aria.includes('trash')  ||
                                title.includes('delete') || title.includes('trash') ||
                                text === 'delete'        || text === '删除') return b;
                        } catch (_) {}
                    }

                    const iconBtns = btns.filter(b => {
                        try { return (b.textContent || '').trim().length === 0 && b.querySelector('svg'); } catch (_) { return false; }
                    });
                    if (iconBtns.length >= 2) return iconBtns[iconBtns.length - 2];
                    if (iconBtns.length === 1) return iconBtns[0];
                } catch (_) {}
                return null;
            }, 8000);

            if (!trashBtn) {
                self._log('未找到 Delete 按钮', 'error');
                return false;
            }

            self._log('已点击 Delete 按钮', 'info');
            self._safeClick(trashBtn);

            await self._sleep(600);
            const confirmBtn = await self._waitFor(() => {
                try {
                    for (const b of document.querySelectorAll('button,[role="button"]')) {
                        if (!b.isConnected) continue;
                        const r = b.getBoundingClientRect();
                        if (r.width === 0 || r.height === 0) continue;
                        const text = (b.textContent || '').trim().toLowerCase();
                        if (['move to trash', 'delete', 'confirm', 'yes', 'trash',
                             '删除', '确认', '确定'].includes(text)) return b;
                    }
                } catch (_) {}
                return null;
            }, 8000);

            if (confirmBtn) {
                self._safeClick(confirmBtn);
                self._log('已确认删除', 'success');
            } else {
                self._log('未找到确认按钮', 'error');
            }
            return true;
        } catch (err) {
            self._log(`删除出错: ${err.message}`, 'error');
            return false;
        }
    }

    // ========== 主流程 ==========
    static async _batchDownload() {
        const self = this;

        // 1. 滚动加载全部卡片
        self._showToast('🔍 正在扫描所有视频...', -1);
        await self._scrollToLoadAll();
        self._hideToast();

        // 2. 收集卡片，按 key 去重
        const allCards = self._findVideoCards();
        if (allCards.length === 0) {
            self._showToast('⚠️ 未找到视频卡片，请确认在 Projects 页面', 4000);
            return;
        }

        const draftCount = allCards.filter(c => self._isDraftCard(c)).length;
        const cardKeys   = [];

        for (let idx = 0; idx < allCards.length; idx++) {
            const card = allCards[idx];
            if (self._isDraftCard(card)) continue;
            // 始终用位置索引作为 key，避免同名视频被误判为重复
            cardKeys.push(`pos:${idx}`);
        }

        const total = cardKeys.length;
        if (total === 0) {
            self._showToast('⚠️ 所有视频均为 Draft，无可下载内容', 4000);
            return;
        }

        const draftNote = draftCount > 0
            ? `<br><span style="font-size:12px;color:#f59e0b;">⚠️ 已跳过 ${draftCount} 个 Draft 视频</span>`
            : '';
        self._showToast(`⬇️ 开始下载，共 ${total} 个视频${draftNote}`, 4000);
        await self._sleep(500);

        for (let i = 0; i < cardKeys.length; i++) {
            try {
                self._log(`处理第 ${i + 1}/${total} 个`);
                self._showToast(`⬇️ 第 ${i + 1} / ${total} 个...`, -1);

                // 每轮重新从 DOM 查找卡片
                const card = self._findCardByKey(cardKeys[i], i);
                if (!card || !card.isConnected) {
                    self._log(`第 ${i + 1} 个：卡片引用失效，跳过`, 'error');
                    continue;
                }

                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await self._sleep(300);

                // 步骤1：勾选卡片
                const checked = await self._checkCard(card);
                if (!checked) {
                    self._log(`第 ${i + 1} 个：未找到 checkbox，跳过`, 'error');
                    continue;
                }

                // 步骤2：等待底部工具栏出现
                const toolbar = await self._waitForToolbar(5000);
                if (!toolbar) {
                    self._log(`第 ${i + 1} 个：工具栏未出现，跳过`, 'error');
                    continue;
                }
                self._log(`第 ${i + 1} 个：工具栏已出现`);

                // 步骤3：提前注册下载拦截
                const interceptPromise = self._interceptNextDownload(30000);

                // 步骤4：点击工具栏下载按钮
                const dlClicked = await self._clickToolbarDownload(toolbar);
                if (!dlClicked) {
                    self._log(`第 ${i + 1} 个：未找到工具栏下载按钮，跳过`, 'error');
                    try { chrome.runtime.sendMessage({ action: 'cancelDownloadWait' }); } catch (_) {}
                    await self._closeToolbar(toolbar);
                    continue;
                }

                // 步骤5：处理可能出现的确认弹窗（如有 Download 按钮则点击）
                await self._handleDownloadModal();

                // 步骤6：等待下载拦截结果
                self._showToast(`⏳ 第 ${i + 1}/${total} 个：等待下载...`, -1);
                const intercepted = await interceptPromise;
                self._hideToast();

                if (intercepted && intercepted.success && intercepted.url) {
                    const started = await self._downloadViaExtension(intercepted.url, intercepted.filename);
                    self._showToast(
                        started ? `✅ 第 ${i + 1}/${total} 个下载已开始` : `⚠️ 第 ${i + 1}/${total} 个：扩展下载失败`,
                        3000
                    );
                } else {
                    self._showToast(`✅ 第 ${i + 1}/${total} 个下载已触发`, 3000);
                }

                // 步骤7：等页面恢复正常状态
                // 模态框关闭后工具栏通常也自动消失；若还在就关掉
                await self._sleep(800);
                const currentToolbar = self._findToolbarNow();
                if (currentToolbar) {
                    self._log('工具栏仍存在，主动关闭');
                    await self._closeToolbar(currentToolbar);
                }
                await self._sleep(600);

            } catch (err) {
                self._log(`第 ${i + 1} 个异常: ${err.message}`, 'error');
                // 尝试关闭可能残留的工具栏
                try {
                    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
                } catch (_) {}
                await self._sleep(500);
            }
        }

        self._log('全部下载完成', 'success');
        self._showToast(`✅ ${total} 个视频下载完成`, 4000);
    }

}
