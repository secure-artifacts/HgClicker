

class myElementA {

    /**
     * 设置提示信息
     * @param {*} type 
     * @param {*} msg 
     */
    /* 
    await myElementA.setNotice1('primary', `xxxxx`);
    await myElementA.setNotice1('danger', `xxxxx`);
    */
    static async setNotice1(type, msg) {
        const element = document.querySelector('#container0211A #notice1');
        if (element) {
            // alert-success
            // alert-danger

            // alert-primary
            // alert-secondary
            // alert-warning
            // alert-info
            // alert-primary
            // alert-light
            // alert-dark

            // 清除所有类名
            element.className = '';
            element.classList.add(`text-${type}`);
            element.innerHTML = msg;
        }
    }

    /**
     * 控件显示或隐藏
     */
    static async toggleVisibility() {
        try {
            const container = document.querySelector('#container0211A');
            const button = document.querySelector('#container0211A #btnSwitcher');
            if (!(container && button)) {
                return false;
            }

            let _icon = `<img src="${chrome.runtime.getURL('icon128.png')}">`;

            const _collapse = () => {
                button.setAttribute('state', 'hidden');
                button.classList.remove('btn-success', 'btn-warning', 'btn-info');
                button.classList.add('btn-info');
                button.innerHTML = `${_icon}`;
                container.classList.add('body-hidden');
            };

            const _expand = () => {
                button.setAttribute('state', 'visible');
                button.innerHTML = `${_icon}`;
                button.classList.remove('btn-success', 'btn-warning', 'btn-info');
                button.classList.add('btn-success');
                container.classList.remove('body-hidden');
            };

            // 点击图标 → 切换展开/收起
            button.addEventListener('click', (event) => {
                if (event._fromDrag) return;
                button.classList.remove('btn-success', 'btn-warning', 'btn-info');
                let state = button.getAttribute('state') || 'hidden';
                if (state === 'visible') {
                    _collapse();
                } else {
                    _expand();
                }
            });

        } catch (error) {
            throw new Error(`Error-myelement-0001: ${error.message}`);
        }
    }

    static _initDrag(container) {
        const THRESHOLD = 5;
        let startX, startY, startLeft, startTop, didDrag;

        container.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (e.target.closest('button, input, label, a')) return;

            const rect = container.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            didDrag = false;

            const onMove = (e) => {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                if (!didDrag && Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
                didDrag = true;
                container.style.cursor = 'grabbing';
                let newLeft = Math.max(0, Math.min(window.innerWidth - container.offsetWidth, startLeft + dx));
                let newTop  = Math.max(0, Math.min(window.innerHeight - container.offsetHeight, startTop + dy));
                container.style.left  = newLeft + 'px';
                container.style.top   = newTop + 'px';
                container.style.right = 'auto';
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                container.style.cursor = '';
                if (didDrag) {
                    const r = container.getBoundingClientRect();
                    chrome.storage.local.set({ panelPosition: { left: r.left, top: r.top } });
                }
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    /**
     * 创建主框架
     */
    static async createContainer() {
        try {
            let element = document.querySelector('#container0211A');

            if (!element) {
                // let html = `
                // <div id="blockHeader" class="d-flex align-items-center justify-content-end">
                //     <button id="btnSwitcher" class="btn btn-warning" state="visible">😊已隐藏</button>
                // </div>

                // <div id="blockBody">
                //     <section name="textKeyword">
                //         <div>
                //             <button name="btnQuestionnaire">问卷选项</button>
                //             <button name="btnNewAvatar">上传头像</button>
                //             <button name="btnWalkthrough" class="btn">跳过引导</button>
                //             <button name="btnAvatarForm" class="btn">填写信息</button>
                //             <button name="btnCaption" class="btn">字幕设置</button>
                //         </div>
                //     </section>
                // </div>
                // `;

                let _icon = `<img src="${chrome.runtime.getURL('icon128.png')}">`;

                let html = `
                <div id="mainRow">
                    <button name="btnClearData" data-tooltip="清理数据" class="hg-btn-danger"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
                    <button name="btnBatchDownload" data-tooltip="批量下载"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                    <button name="btnCopyEmail" data-tooltip="复制邮箱"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg></button>
                    <button name="btnNewAvatar" data-tooltip="上传头像"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></button>
                    <button name="btnCaption" data-tooltip="字幕设置"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 15h4M15 15h2M7 11h2M13 11h4"/></svg></button>
                    <button id="btnSwitcher" state="visible">${_icon}</button>
                    <button name="btnSettings" id="btnSettings">⚙</button>
                </div>
                <div name="settingsPanel" class="hg-settings-panel">
                    <div class="hg-sp-section-title">字幕</div>
                    <div class="hg-caption-row">
                        <button name="btnSaveCaption" class="hg-sp-btn">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                            保存当前样式
                        </button>
                    </div>
                    <div class="hg-sp-divider"></div>
                    <div class="hg-sp-section-title">功能</div>
                    <label class="hg-toggle-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <input type="checkbox" name="chkAutoFillName">
                        <span>自动填充人名</span>
                    </label>
                    <label class="hg-toggle-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>
                        <input type="checkbox" name="chkAutoRedirect">
                        <span>自动跳转</span>
                    </label>
                    <div class="hg-redirect-delay-row">
                        <span class="hg-redirect-delay-label">跳转延迟</span>
                        <input type="number" name="redirectDelay" min="1" max="30" step="1" value="5" class="hg-redirect-delay-input">
                        <span class="hg-redirect-delay-unit">秒</span>
                    </div>
                    <label class="hg-toggle-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
                        <input type="checkbox" name="chkAvatarClick">
                        <span>自动点击 Look</span>
                    </label>
                    <div class="hg-avatar-click-row">
                        <span name="avatarClickProgress">进度：第 1 个</span>
                        <button name="btnResetAvatarClick" class="hg-sp-btn hg-sp-btn-sm">重置</button>
                    </div>
                    <div class="hg-sp-divider"></div>
                    <div class="hg-sp-section-title">头像表单</div>
                    <label class="hg-toggle-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <input type="radio" name="avatarFormMode" value="randomName">
                        <span>随机人名 + 自动属性</span>
                    </label>
                    <label class="hg-toggle-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8M8 13h5"/></svg>
                        <input type="radio" name="avatarFormMode" value="fixedAttr">
                        <span>跳过人名，填写属性</span>
                    </label>
                </div>
                `;

                html = myUtil.compressHTML(html);

                element = document.createElement('div');
                element.id = 'container0211A';
                element.classList.add('container-0211');
                element.innerHTML = html;
                document.body.appendChild(element);

                chrome.storage.local.get(['panelPosition'], (result) => {
                    if (result.panelPosition) {
                        const maxLeft = window.innerWidth  - element.offsetWidth;
                        const maxTop  = window.innerHeight - element.offsetHeight;
                        element.style.left  = Math.max(0, Math.min(maxLeft, result.panelPosition.left)) + 'px';
                        element.style.top   = Math.max(0, Math.min(maxTop,  result.panelPosition.top))  + 'px';
                        element.style.right = 'auto';
                    }
                });

                myElementA._initDrag(element);
            }
        } catch (error) {
            throw new Error(`Error-myelement-0002: ${error.message}`);
        }
    }

    /**
     * 更新 section 数据
     */
    static async updateSectionKeyword() {
        try {
            let element = await myXPath.getElement(`//div[@id="container0211A"]//section[@name="textKeyword"]//textarea`);
            let label = await myXPath.getElement(`//div[@id="container0211A"]//section[@name="textKeyword"]/label`);

            if (element && label) {
                let lines = element.value.split('\n').filter(line => line.trim());
                if (lines.length) {
                    label.innerHTML = `关键词 ${lines.length} 条`;
                } else {
                    label.innerHTML = `关键词`;
                }
            }
        } catch (error) {
            throw new Error(`Error-myelement-0003: ${error.message}`);
        }
    }


    /**
     * 关键词
     */
    // static async textKeyword() {
    //     const self = this;

    //     try {
    //         const textarea = document.querySelector('#container0211A section[name="textKeyword"] textarea');
    //         textarea.addEventListener('blur', async (event) => {
    //             let el = event.target;
    //             let text = el.value;
    //             let lines = text.split('\n').map(line => line.trim()).filter(line => line);
    //             lines = myUtil.arrayUnique(lines);
    //             el.value = lines.join('\n');

    //             await self.updateSectionKeyword();
    //         });

    //     } catch (error) {
    //         throw new Error(`Error-myelement-0005: ${error.message}`);
    //     }
    // }


    // ── 清理数据：简易确认框 ──
    static _showClearConfirm(htmlMsg) {
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
            msgEl.innerHTML = htmlMsg;

            const row = document.createElement('div');
            row.id = 'hg-dl-confirm-row';

            const noBtn = document.createElement('button');
            noBtn.className = 'hg-dl-confirm-cancel';
            noBtn.textContent = '取消';
            noBtn.addEventListener('click', () => cleanup(false), { once: true });

            const yesBtn = document.createElement('button');
            yesBtn.className = 'hg-dl-confirm-ok';
            yesBtn.textContent = '确认清理';
            yesBtn.style.background = '#0ea5e9';
            yesBtn.addEventListener('click', () => cleanup(true), { once: true });

            row.appendChild(noBtn);
            row.appendChild(yesBtn);
            box.appendChild(msgEl);
            box.appendChild(row);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        });
    }

    // ── 清理数据：含删除视频选项的确认框 ──
    static _showClearDataDialog() {
        return new Promise((resolve) => {
            let resolved = false;
            const cleanup = (val) => {
                if (resolved) return;
                resolved = true;
                try { overlay.remove(); } catch (_) {}
                resolve(val);
            };

            // 遮罩层
            const overlay = document.createElement('div');
            overlay.id = 'hg-dl-confirm-overlay';
            overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(null); });

            // 卡片容器
            const box = document.createElement('div');
            box.className = 'hg-clear-box';

            // ── 标题行 ──
            const titleRow = document.createElement('div');
            titleRow.className = 'hg-clear-title-row';
            titleRow.innerHTML =
                `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                <span>清理登录数据</span>`;

            // ── 将清除列表 ──
            const listLabel = document.createElement('div');
            listLabel.className = 'hg-clear-section-label';
            listLabel.textContent = '将清除';

            const itemsWrap = document.createElement('div');
            itemsWrap.className = 'hg-clear-items';
            [
                { icon: '🍪', text: 'Cookies', note: '登录凭据' },
                { icon: '💾', text: 'LocalStorage', note: '本地存储' },
                { icon: '🗄️', text: 'IndexedDB', note: '数据库' },
                { icon: '⬇️', text: 'Download History', note: '下载记录' },
            ].forEach(({ icon, text, note }) => {
                const item = document.createElement('div');
                item.className = 'hg-clear-item';
                item.innerHTML =
                    `<span class="hg-clear-item-icon">${icon}</span>
                     <span class="hg-clear-item-name">${text}</span>
                     <span class="hg-clear-item-note">${note}</span>`;
                itemsWrap.appendChild(item);
            });

            // ── 保留提示 ──
            const keepNote = document.createElement('div');
            keepNote.className = 'hg-clear-keep-note';
            keepNote.innerHTML =
                `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Surfshark Cookie 自动保留 · 密码不清除</span>`;

            // ── 删除视频复选框 ──
            const chkLabel = document.createElement('label');
            chkLabel.className = 'hg-clear-chk-row';
            const chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.checked = true;
            const chkText = document.createElement('span');
            chkText.innerHTML =
                `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                同时删除 HeyGen 视频`;
            chkLabel.appendChild(chk);
            chkLabel.appendChild(chkText);

            // ── 按钮行 ──
            const btnRow = document.createElement('div');
            btnRow.className = 'hg-clear-btn-row';

            const noBtn = document.createElement('button');
            noBtn.className = 'hg-clear-btn-cancel';
            noBtn.textContent = '取消';
            noBtn.addEventListener('click', () => cleanup(null), { once: true });

            const yesBtn = document.createElement('button');
            yesBtn.className = 'hg-clear-btn-ok';
            yesBtn.textContent = '确认清理';
            yesBtn.addEventListener('click', () => cleanup({ deleteVideos: chk.checked }), { once: true });

            btnRow.appendChild(noBtn);
            btnRow.appendChild(yesBtn);

            box.appendChild(titleRow);
            box.appendChild(listLabel);
            box.appendChild(itemsWrap);
            box.appendChild(keepNote);
            box.appendChild(chkLabel);
            box.appendChild(btnRow);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        });
    }

    // ── 等待视频卡片从 DOM 消失（删除完成标志）──
    // maxMs: 最长等待毫秒数，超时后不再等待直接返回
    static _waitForVideosGone(maxMs = 12000) {
        return new Promise((resolve) => {
            const start = Date.now();
            const check = () => {
                try {
                    const cards = proc08BatchDownload._findVideoCards();
                    if (cards.length === 0) {
                        resolve(); // 卡片已全部消失 → 删除完成
                        return;
                    }
                } catch (_) {}
                if (Date.now() - start >= maxMs) {
                    resolve(); // 超时，不再等待
                    return;
                }
                setTimeout(check, 600);
            };
            setTimeout(check, 1000); // 点击确认后先等 1 秒再开始轮询
        });
    }

    // ── 清理数据：Toast 提示 ──
    static _showQuickToast(html, durationMs = 4000) {
        try {
            const old = document.getElementById('hg-dl-toast');
            if (old) old.remove();
            const el = document.createElement('div');
            el.id = 'hg-dl-toast';
            el.innerHTML = html;
            document.body.appendChild(el);
            if (durationMs > 0) setTimeout(() => { try { el.remove(); } catch (_) {} }, durationMs);
        } catch (_) {}
    }

    // ── 读取当前登录邮箱 ──
    static _findEmailInDom() {
        const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;

        // 策略1：ajs_user_traits（旧版 HeyGen 存这里）
        try {
            const traits = JSON.parse(localStorage.getItem('ajs_user_traits') || '{}');
            if (traits.email && emailRegex.test(traits.email)) return traits.email;
        } catch (_) {}

        // 策略2：正则扫描所有 localStorage 值（兼容 PostHog 等任意 key）
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (!k) continue;
                const v = localStorage.getItem(k) || '';
                if (!v.includes('@')) continue;
                const m = v.match(emailRegex);
                if (m) return m[0];
            }
        } catch (_) {}

        // 策略3：扫描 DOM 文本节点（兜底）
        try {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                const match = (node.textContent || '').trim().match(emailRegex);
                if (match) return match[0];
            }
        } catch (_) {}

        return null;
    }

    // ── 点击左下角头像按钮，展开 profile 菜单 ──
    static _openProfileMenu() {
        try {
            // 策略1：找带有 profile / account / user / avatar 关键词的 class 或 aria-label，
            //         且位于左侧区域（left < 200）的可见元素
            const kwSelectors = [
                '[class*="user-avatar"]', '[class*="userAvatar"]',
                '[class*="profile-avatar"]', '[class*="profileAvatar"]',
                '[aria-label*="profile" i]', '[aria-label*="account" i]',
                '[aria-label*="my account" i]', '[aria-label*="user menu" i]',
            ];
            for (const sel of kwSelectors) {
                try {
                    const el = document.querySelector(sel);
                    if (!el) continue;
                    const r = el.getBoundingClientRect();
                    if (r.width > 0 && r.height > 0 && r.left < 200) {
                        el.click();
                        return true;
                    }
                } catch (_) {}
            }

            // 策略2：左侧底部圆形小按钮（left < 120, top > 65%, 宽高相近且较小）
            //         且内容极短（图标 / 首字母），排除包含定价相关词的元素
            const allBtns = Array.from(document.querySelectorAll('button, [role="button"]'));
            const profileBtn = allBtns.find(b => {
                try {
                    const r = b.getBoundingClientRect();
                    if (r.left >= 120 || r.top <= window.innerHeight * 0.65 || r.width <= 0) return false;
                    // 要求宽高接近（圆形）且不超过 60px
                    if (Math.abs(r.width - r.height) > 12 || r.width > 64) return false;
                    // border-radius 需接近 50%（圆形头像按钮）
                    const br = parseFloat(window.getComputedStyle(b).borderRadius) || 0;
                    if (br < r.width * 0.4) return false;
                    // 排除文字超过3个字符的按钮（非头像）
                    const txt = (b.textContent || '').trim();
                    if (txt.length > 3) return false;
                    return true;
                } catch (_) { return false; }
            });
            if (profileBtn) { profileBtn.click(); return true; }
        } catch (_) {}
        return false;
    }

    static async btnController() {
        const self = this;

        try {
            // 问卷选项
            // if (1) {
            //     const element = document.querySelector('#container0211A button[name="btnQuestionnaire"]');
            //     element.addEventListener('click', async (event) => {
            //         await proc01Questionnaire.start();
            //     });
            // }

            // ── 设置面板 开/关 ──
            if (1) {
                const btn   = document.querySelector('#container0211A button[name="btnSettings"]');
                const panel = document.querySelector('#container0211A div[name="settingsPanel"]');
                if (btn && panel) {
                    let autoCloseTimer = null;

                    const closePanel = () => {
                        panel.classList.remove('open');
                        btn.classList.remove('selected');
                        btn.textContent = '⚙ 设置';
                    };

                    btn.addEventListener('click', () => {
                        const isOpen = panel.classList.contains('open');
                        clearTimeout(autoCloseTimer);
                        panel.classList.toggle('open', !isOpen);
                        btn.classList.toggle('selected', !isOpen);
                        btn.textContent = isOpen ? '⚙ 设置' : '⚙ 设置 ▴';
                    });

                    panel.addEventListener('mouseleave', () => {
                        autoCloseTimer = setTimeout(closePanel, 2000);
                    });

                    panel.addEventListener('mouseenter', () => {
                        clearTimeout(autoCloseTimer);
                    });
                }
            }

            // 上传头像
            if (1) {
                const element = document.querySelector('#container0211A button[name="btnNewAvatar"]');
                element.addEventListener('click', async (event) => {
                    let href = window.location.href;

                    // https://app.heygen.com/avatar/my-avatars
                    // https://app.heygen.com/avatars/create/add-new-avatar-entry

                    if (!(href.includes('/avatars/create/add-new-avatar-entry'))) {
                        window.location.href = 'https://app.heygen.com/avatars/create/add-new-avatar-entry?start=true';
                    }

                    await proc02UpdateImage.start();
                });

                let href = window.location.href;
                if (href.includes('?start=true')) {
                    // 不用 pushState —— 它会触发 SPA 路由重渲染，导致上传区域被隐藏
                    // 不再固定 sleep，由 proc02UpdateImage 内部等待卡片渲染完成
                    await proc02UpdateImage.start();
                }
            }

            // 跳过引导
            // if (1) {
            //     const element = document.querySelector('#container0211A button[name="btnWalkthrough"]');
            //     element.addEventListener('click', async (event) => {
            //         await proc03Walkthrough.start();
            //     });
            // }

            // 填写信息
            // if (1) {
            //     const element = document.querySelector('#container0211A button[name="btnAvatarForm"]');
            //     element.addEventListener('click', async (event) => {
            //         await proc05AvatarForm.start();
            //     });
            // }

            if (1) {
                const element = document.querySelector('#container0211A button[name="btnCaption"]');
                element.addEventListener('click', async (event) => {
                    await proc04Caption.start();
                });
            }

            // 批量下载
            if (1) {
                const element = document.querySelector('#container0211A button[name="btnBatchDownload"]');
                if (element) {
                    element.addEventListener('click', async (event) => {
                        element.disabled = true;
                        try {
                            await proc08BatchDownload.start();
                        } finally {
                            element.disabled = false;
                        }
                    });
                }
            }

            // 复制邮箱
            if (1) {
                const element = document.querySelector('#container0211A button[name="btnCopyEmail"]');
                if (element) {
                    element.addEventListener('click', async () => {
                        element.disabled = true;
                        try {
                            // 直接从 localStorage 读取邮箱，无需点击任何按钮
                            const email = myElementA._findEmailInDom();

                            if (email) {
                                await navigator.clipboard.writeText(email);
                                myElementA._showQuickToast(`✅ 已复制：${email}`, 3000);
                            } else {
                                myElementA._showQuickToast('⚠️ 未找到邮箱，请确认已登录', 3000);
                            }
                        } catch (err) {
                            myElementA._showQuickToast(`⚠️ 复制失败：${err.message}`, 3000);
                        } finally {
                            element.disabled = false;
                        }
                    });
                }
            }

            // 清理数据（含可选删除视频）
            if (1) {
                const element = document.querySelector('#container0211A button[name="btnClearData"]');
                if (element) {
                    element.addEventListener('click', async () => {
                        const result = await myElementA._showClearDataDialog();
                        if (!result) return;

                        element.disabled = true;

                        // 如果勾选了删除视频且在 Projects 页面，先执行删除，等待完成后再清理
                        if (result.deleteVideos && window.location.href.includes('/projects')) {
                            myElementA._showQuickToast('🗑️ 正在删除视频...', -1);
                            try {
                                await proc08BatchDownload._selectAllAndDelete();
                                // 等待视频卡片从 DOM 消失（最多等 12 秒），确保删除已被服务器处理
                                await myElementA._waitForVideosGone(12000);
                                myElementA._showQuickToast('✅ 视频已删除，准备清理数据...', 2000);
                                await new Promise(r => setTimeout(r, 2000));
                            } catch (_) {}
                        }

                        myElementA._showQuickToast('🧹 正在清理数据...', -1);

                        chrome.runtime.sendMessage({ action: 'clearBrowsingData' }, (res) => {
                            element.disabled = false;
                            if (res && res.success) {
                                window.location.href = 'https://auth.heygen.com/';
                            } else {
                                const err = (res && res.error) ? res.error : '未知错误';
                                myElementA._showQuickToast(`⚠️ 清理失败：${err}`, 4000);
                            }
                        });
                    });
                }
            }

            // 保存当前字幕样式按钮
            if (1) {
                const btn = document.querySelector('#container0211A button[name="btnSaveCaption"]');
                if (btn) {
                    btn.addEventListener('click', async () => {
                        if (!window.location.href.includes('/create-v4/')) {
                            myElementA._showQuickToast('⚠️ 请先打开视频编辑器页面再保存', 3000);
                            return;
                        }
                        btn.disabled = true;
                        try {
                            await proc04Caption.saveCurrentSettings();
                            chrome.storage.sync.get(['captionPreset'], (r) => {
                                if (r && r.captionPreset && Object.keys(r.captionPreset).length > 0) {
                                    myElementA._showQuickToast('✅ 字幕样式已保存', 2500);
                                } else {
                                    myElementA._showQuickToast('⚠️ 未读取到字幕样式，请先在编辑器中设置字幕', 4000);
                                }
                            });
                        } catch (e) {
                            myElementA._showQuickToast(`⚠️ 保存失败：${e.message}`, 4000);
                        } finally {
                            btn.disabled = false;
                        }
                    });
                }
            }

            // 自动跳转开关
            if (1) {
                const checkbox = document.querySelector('#container0211A input[name="chkAutoRedirect"]');
                if (checkbox) {
                    chrome.storage.local.get(['autoRedirectEnabled'], (result) => {
                        checkbox.checked = result.autoRedirectEnabled === true;
                    });
                    checkbox.addEventListener('change', (event) => {
                        chrome.storage.local.set({ autoRedirectEnabled: event.target.checked });
                    });
                }
            }

            // 跳转延迟秒数
            if (1) {
                const delayInput = document.querySelector('#container0211A input[name="redirectDelay"]');
                if (delayInput) {
                    chrome.storage.local.get(['autoRedirectDelay'], (result) => {
                        delayInput.value = result.autoRedirectDelay ?? 5;
                    });
                    delayInput.addEventListener('change', (event) => {
                        const val = Math.max(1, Math.min(30, parseInt(event.target.value, 10) || 5));
                        event.target.value = val;
                        chrome.storage.local.set({ autoRedirectDelay: val });
                    });
                }
            }

            // 自动点击 Look 开关 + 进度重置
            if (1) {
                const chk = document.querySelector('#container0211A input[name="chkAvatarClick"]');
                if (chk) {
                    chrome.storage.local.get(['avatarClickEnabled'], (result) => {
                        chk.checked = result.avatarClickEnabled === true;
                    });
                    chk.addEventListener('change', (e) => {
                        chrome.storage.local.set({ avatarClickEnabled: e.target.checked });
                    });
                }

                const progressEl = document.querySelector('#container0211A [name="avatarClickProgress"]');
                const refreshProgress = () => {
                    if (!progressEl) return;
                    chrome.storage.local.get(['avatarClickIndex'], (r) => {
                        progressEl.textContent = `进度：第 ${((r.avatarClickIndex ?? 0)) + 1} 个`;
                    });
                };
                refreshProgress();

                const btnReset = document.querySelector('#container0211A button[name="btnResetAvatarClick"]');
                if (btnReset) {
                    btnReset.addEventListener('click', () => {
                        chrome.storage.local.set({ avatarClickIndex: 0 }, refreshProgress);
                    });
                }
            }

            // 自动填充人名开关
            if (1) {
                const checkbox = document.querySelector('#container0211A input[name="chkAutoFillName"]');
                if (checkbox) {
                    chrome.storage.local.get(['autoFillNameEnabled'], (result) => {
                        checkbox.checked = result.autoFillNameEnabled !== false; // 默认开启
                    });
                    checkbox.addEventListener('change', (event) => {
                        chrome.storage.local.set({ autoFillNameEnabled: event.target.checked });
                    });
                }
            }

            // 头像表单模式
            if (1) {
                const radios = document.querySelectorAll('#container0211A input[name="avatarFormMode"]');
                if (radios.length) {
                    chrome.storage.local.get(['avatarFormMode'], (result) => {
                        const mode = result.avatarFormMode || 'randomName';
                        radios.forEach(r => { r.checked = r.value === mode; });
                    });
                    radios.forEach(r => {
                        r.addEventListener('change', (e) => {
                            if (e.target.checked) {
                                chrome.storage.local.set({ avatarFormMode: e.target.value });
                            }
                        });
                    });
                }
            }


        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }

}
