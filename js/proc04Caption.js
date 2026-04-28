/*
流程

https://app.heygen.com/create-v4/draft

*/

class proc04Caption {

    // 记录每个 URL 的尝试次数：成功则设为 Infinity，失败则累加，超过 MAX_RETRIES 停止
    static _MAX_RETRIES = 3;
    static _applyAttempts = new Map(); // url → 次数
    static _isApplying   = false;      // 内部锁，防止多入口并发
    static _lastClickedCaptionId = null; // 点击拦截：记录用户最后点击的字幕样式卡片 id

    // ── storage 缓存：避免每次触发都发 IPC 到主进程 ──
    // 稳定优先：初始化一次 + onChanged 同步更新，常态下零 IPC
    static _cacheReady       = false;
    static _cachedEnabled    = false;
    static _cachedPreset     = null;
    static _cacheInitPromise = null;

    static _initCache() {
        if (proc04Caption._cacheReady) return Promise.resolve();
        if (proc04Caption._cacheInitPromise) return proc04Caption._cacheInitPromise;
        proc04Caption._cacheInitPromise = new Promise((resolve) => {
            try {
                chrome.storage.local.get(['autoCaptionEnabled', 'captionPreset'], (r) => {
                    proc04Caption._cachedEnabled = (r && r.autoCaptionEnabled === true);
                    proc04Caption._cachedPreset  = (r && r.captionPreset) || null;
                    proc04Caption._cacheReady    = true;

                    // 监听 storage 变化，保持缓存同步（只注册一次）
                    try {
                        chrome.storage.onChanged.addListener((changes, area) => {
                            if (area !== 'local') return;
                            if (changes.autoCaptionEnabled) {
                                proc04Caption._cachedEnabled = changes.autoCaptionEnabled.newValue === true;
                            }
                            if (changes.captionPreset) {
                                proc04Caption._cachedPreset = changes.captionPreset.newValue || null;
                            }
                        });
                    } catch (_) {}

                    resolve();
                });
            } catch (_) {
                proc04Caption._cacheReady = true;
                resolve();
            }
        });
        return proc04Caption._cacheInitPromise;
    }

    /**
     * 监听 Generate 按钮点击 → 在用户点击时保存当前字幕设置
     * 无论用 Ctrl+B 还是直接点按钮都会触发
     */
    static _watchGenerateBtn() {
        if (window.__heygenCaptionWatcher) return;
        window.__heygenCaptionWatcher = true;

        const _tryAttach = () => {
            // 已 hook 的按钮仍在 DOM 中 → 无需重扫
            if (window.__heygenGenBtnHooked && window.__heygenGenBtnHooked.isConnected) return;
            window.__heygenGenBtnHooked = null;

            for (const btn of document.querySelectorAll('button')) {
                if ((btn.textContent || '').trim() !== 'Generate') continue;
                if (!btn.__captionSaveHooked) {
                    btn.__captionSaveHooked = true;
                    btn.addEventListener('click', () => {
                        // 稍微延迟一下，确保 React 状态已同步
                        setTimeout(() => proc04Caption.saveCurrentSettings(), 80);
                    });
                }
                window.__heygenGenBtnHooked = btn; // 记录已 hook 的按钮
                return; // Generate 按钮唯一，找到即可停止
            }
        };

        // 立即尝试附加（按钮可能已在 DOM 中）
        _tryAttach();

        // 用 MutationObserver 监听按钮出现（防抖 800ms，减少 React 频繁渲染的影响）
        let debounce = null;
        const obs = new MutationObserver(() => {
            clearTimeout(debounce);
            debounce = setTimeout(_tryAttach, 2000);
        });
        obs.observe(document.body, { childList: true, subtree: true });

        // 页面离开时清理
        window.addEventListener('pagehide', () => {
            obs.disconnect();
            window.__heygenCaptionWatcher = false;
            window.__heygenGenBtnHooked = null;
        }, { once: true });
    }

    /**
     * 监听 Script 输入框：从空→有内容时触发自动字幕
     * 比页面加载触发更可靠（此时页面必然已渲染完成）
     */
    static _watchScriptInput() {
        if (window.__heygenScriptWatcher) return;
        window.__heygenScriptWatcher = true;

        const _tryAttach = () => {
            try {
            // 已 hook 的元素仍在 DOM 中 → 直接跳过所有扫描（最主要的 CPU 节省点）
            if (window.__heygenScriptHookedEl && window.__heygenScriptHookedEl.isConnected) return;
            window.__heygenScriptHookedEl = null;

            // 查找 Script 输入区域（contenteditable 或 textarea）
            // 策略1：data-placeholder / aria-placeholder 包含 "script" 或 "/"
            let scriptEl = null;
            for (const el of document.querySelectorAll('[data-placeholder],[aria-placeholder]')) {
                try {
                    const ph = (el.getAttribute('data-placeholder') || el.getAttribute('aria-placeholder') || '').toLowerCase();
                    if (ph.includes('script') || ph.includes('/')) { scriptEl = el; break; }
                } catch (_) {}
            }
            // 策略2：找 "Script" 标题（用具体标签限定，避免遍历全部元素）
            if (!scriptEl) {
                const candidates = document.querySelectorAll('span, label, h1, h2, h3, h4, h5, p');
                for (const heading of candidates) {
                    try {
                        if (heading.children.length > 0) continue;
                        if ((heading.textContent || '').trim() !== 'Script') continue;
                        let parent = heading.parentElement;
                        for (let i = 0; i < 5; i++) {
                            if (!parent) break;
                            const editable = parent.querySelector('[contenteditable="true"]');
                            if (editable) { scriptEl = editable; break; }
                            parent = parent.parentElement;
                        }
                        if (scriptEl) break;
                    } catch (_) {}
                }
            }
            // 策略3：页面上第一个 contenteditable（兜底）
            if (!scriptEl) {
                scriptEl = document.querySelector('[contenteditable="true"]');
            }

            if (!scriptEl || scriptEl.__scriptWatchHooked) return;
            scriptEl.__scriptWatchHooked = true;
            window.__heygenScriptHookedEl = scriptEl; // 记录，供后续调用短路判断

            let _hadContent = !!(scriptEl.textContent || scriptEl.value || '').trim();

            scriptEl.addEventListener('input', async () => {
                const hasContent = !!(scriptEl.textContent || scriptEl.value || '').trim();
                if (!_hadContent && hasContent) {
                    // 脚本刚从空变为有内容
                    _hadContent = true;
                    const url = window.location.href;
                    const attempts = proc04Caption._applyAttempts.get(url) || 0;
                    if (attempts !== Infinity) {
                        // 允许重新尝试（重置计数），等待一小段让用户继续输入
                        proc04Caption._applyAttempts.delete(url);
                        await myUtil.sleep(800);
                        await proc04Caption.autoApply();
                    }
                } else if (!hasContent) {
                    _hadContent = false;
                }
            });
            } catch (_) {} // _tryAttach 整体保护：防止 DOM 访问异常冒泡
        };

        _tryAttach();
        let debounce = null;
        const obs = new MutationObserver(() => {
            clearTimeout(debounce);
            debounce = setTimeout(_tryAttach, 2000); // 800ms 防抖，减少 React 频繁渲染的影响
        });
        obs.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('pagehide', () => {
            obs.disconnect();
            window.__heygenScriptWatcher = false;
            window.__heygenScriptHookedEl = null;
        }, { once: true });
    }

    /**
     * 监听字幕样式卡片点击，记录用户选中的 captionId
     * HeyGen 不在 DOM 上暴露选中状态，只能通过点击事件拦截
     */
    static _watchCaptionCards() {
        if (window.__heygenCaptionCardWatcher) return;
        window.__heygenCaptionCardWatcher = true;
        document.addEventListener('click', (e) => {
            const card = e.target.closest('[data-caption-id]');
            if (card && card.dataset.captionId) {
                proc04Caption._lastClickedCaptionId = card.dataset.captionId;
                console.log('[proc04Caption] 点击拦截记录 captionId:', proc04Caption._lastClickedCaptionId);
            }
        }, true); // capture 阶段，早于 React 处理
    }

    /**
     * 自动应用字幕设置（由 MutationObserver 或 Script 输入触发）
     * 检查 storage 中是否有保存的预设，如有则应用，如无则跳过
     */
    static async autoApply() {
        // 内部并发锁：防止多个入口（页面加载 / Script 输入）同时执行
        if (proc04Caption._isApplying) return { status: true, msg: '正在处理中' };
        proc04Caption._isApplying = true;
        try {
            const url = window.location.href;

            // 0. 先做最廉价的守卫：URL 不匹配则立即返回，不做任何 IPC / 注册
            if (!url.includes('/create-v4/')) return { status: true, msg: '不是编辑器页面' };

            // 同一个视频：已成功 或 已达最大重试次数 则直接返回（避免后续 IPC / 监听器注册）
            const _attempts = proc04Caption._applyAttempts.get(url) || 0;
            if (_attempts === Infinity) return { status: true, msg: '已应用过' };
            if (_attempts >= proc04Caption._MAX_RETRIES) return { status: true, msg: '已达最大重试次数' };

            // 初始化 storage 缓存（只在首次发一次 IPC，之后常态 0 IPC）
            await proc04Caption._initCache();

            // 无论是否有预设，都监听 Generate 按钮、Script 输入、字幕卡片点击（内部有 window 级守卫，只注册一次）
            proc04Caption._watchGenerateBtn();
            proc04Caption._watchScriptInput();
            proc04Caption._watchCaptionCards();

            // 1. 检查开关（缓存读取）
            if (!proc04Caption._cachedEnabled) return { status: true, msg: '自动字幕已关闭' };

            // 2. 读取保存的预设（缓存读取）；无预设则跳过（用户尚未设置过样式）
            const preset = proc04Caption._cachedPreset;
            if (!preset) return { status: true, msg: '无字幕预设，跳过' };

            // 3. 等待编辑器完整渲染
            await myUtil.sleep(2800 + Math.random() * 1600);

            // 4. 记录本次尝试（先累加，失败时不会再被覆盖为 Infinity）
            proc04Caption._applyAttempts.set(url, _attempts + 1);

            // 5. 应用设置
            await proc04Caption._applySettings(preset);

            // 6. 成功：标记为 Infinity，不再重试
            proc04Caption._applyAttempts.set(url, Infinity);

            myElementA._showQuickToast('✅ 字幕已自动设置', 2500);
            return { status: true, msg: '字幕已自动设置' };

        } catch (error) {
            console.error('[proc04Caption.autoApply]', error);
            return { status: false, msg: error.message };
        } finally {
            proc04Caption._isApplying = false;
        }
    }

    /**
     * 手动字幕设置（点击"字幕设置"按钮触发）
     * 有预设则应用预设；无预设则仅打开字幕面板，提示用户先保存样式
     */
    static async start() {
        const preset = await new Promise((resolve) => {
            try {
                chrome.storage.local.get(['captionPreset'], (r) => {
                    resolve(r.captionPreset || null);
                });
            } catch (_) { resolve(null); }
        });

        if (!preset) {
            // 无预设：仅打开字幕面板，不强制套用任何默认样式
            try {
                let btnCaption = await myXPath.getElement(`//button[.//*[@name="cc-captions"]]`, 5);
                if (btnCaption) {
                    const cls = btnCaption.getAttribute('class') || '';
                    if (!cls.includes('!tw-bg-black/90')) {
                        await mySimulate.cursorClick(btnCaption);
                    }
                }
            } catch (_) {}
            myElementA._showQuickToast('ℹ️ 尚无字幕预设，请设置好后点"保存当前样式"', 4000);
            return;
        }

        try {
            await this._applySettings(preset);
            myElementA._showQuickToast('✅ 字幕样式已应用', 2500);
        } catch (e) {
            console.error('[proc04Caption.start]', e);
            myElementA._showQuickToast(`⚠️ 字幕设置失败：${e.message}`, 5000);
        }
    }

    /**
     * 应用字幕设置
     * @param {Object} settings - { captionId, positionY, fontSize }
     */
    static async _applySettings(settings) {
        try {
            console.log('[proc04Caption._applySettings] 开始应用:', JSON.stringify(settings));

            // 打开字幕面板
            let btnCaption = await myXPath.getElement(`//button[.//*[@name="cc-captions"]]`, 5);
            if (btnCaption) {
                let className = btnCaption.getAttribute('class');
                if (!className.includes('!tw-bg-black/90')) {
                    console.log('[proc04Caption._applySettings] 打开字幕面板');
                    await mySimulate.cursorClick(btnCaption);
                } else {
                    console.log('[proc04Caption._applySettings] 字幕面板已打开');
                }
            } else {
                console.warn('[proc04Caption._applySettings] ⚠️ 未找到字幕面板按钮');
            }

            // 设置字幕样式
            if (settings.captionId) {
                // 等待卡片渲染（面板刚打开时卡片可能尚未出现，最多等 5 秒）
                const waitStart = Date.now();
                while (document.querySelectorAll('[data-caption-id]').length === 0 && Date.now() - waitStart < 5000) {
                    await myUtil.sleep(200);
                }
                // 直接用属性选择器查找目标卡片（h2[text()="Captions"] 在当前 HeyGen DOM 中不存在）
                const styleBtn = document.querySelector(`[data-caption-id="${settings.captionId}"]`);
                if (styleBtn) {
                    console.log('[proc04Caption._applySettings] 点击样式卡片:', settings.captionId);
                    await mySimulate.cursorClick(styleBtn);
                    proc04Caption._lastClickedCaptionId = settings.captionId;
                    await myUtil.sleep(400);
                } else {
                    console.warn('[proc04Caption._applySettings] ⚠️ 未找到样式卡片 data-caption-id=', settings.captionId);
                }
            } else {
                console.log('[proc04Caption._applySettings] preset 无 captionId，跳过样式选择');
            }

            // 设置位置 Y（直接查输入框，h2[text()="Captions"] 在当前 HeyGen DOM 中不存在）
            if (settings.positionY) {
                let yInput = await myXPath.getElement(
                    `//div[text()="Y"]/following-sibling::input[@type="number"]`, 5
                );
                if (yInput) {
                    console.log('[proc04Caption._applySettings] 设置位置 Y:', settings.positionY);
                    await mySimulate.setInputValue(yInput, String(settings.positionY));
                    await myUtil.sleep(500);
                    await mySimulate.inputValue2(yInput, String(settings.positionY));
                    await myUtil.sleep(500);
                } else {
                    console.warn('[proc04Caption._applySettings] ⚠️ 未找到 Y 输入框');
                }
            }

            // 设置字号
            if (settings.fontSize) {
                console.log('[proc04Caption._applySettings] 设置字号:', settings.fontSize);
                await proc04Caption._setFontSize(settings.fontSize);
            }

            console.log('[proc04Caption._applySettings] 完成');
        } catch (error) {
            throw new Error(`Error-proc04Caption-apply: ${error.message}`);
        }
    }

    /**
     * 设置字号（点击字号显示区域 → 输入 → 回车确认）
     */
    static async _setFontSize(size) {
        try {
            // 面板已打开，直接在 document.body 中查找字号元素
            // （h2[text()="Captions"] 在当前 HeyGen DOM 中不存在，不能用作容器守卫）

            // 查找字号显示元素（叶节点，纯数字，包含 cursor 或 fill-block 类名）
            let sizeEl = null;
            let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
            let node;
            while ((node = walker.nextNode())) {
                if (node.children.length > 0) continue;
                let text = (node.textContent || '').trim();
                if (!/^\d{1,3}$/.test(text)) continue;
                let num = parseInt(text);
                if (num < 10 || num > 500) continue;
                let cls = (node.className || '') + ' ' + ((node.parentElement && node.parentElement.className) || '');
                if (cls.includes('cursor') || cls.includes('fill-block')) {
                    sizeEl = node;
                    break;
                }
            }
            if (!sizeEl) return;

            // 点击进入编辑模式
            await mySimulate.cursorClick(sizeEl);
            await myUtil.sleep(400);

            // 查找出现的输入框
            let sizeInput = document.querySelector('input[type="text"].tw-absolute') ||
                await myXPath.getElement(`//input[@type="text" and contains(@class, "tw-absolute")]`, 3);

            if (sizeInput) {
                await mySimulate.setInputValue(sizeInput, size);
                await myUtil.sleep(200);
                sizeInput.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter', keyCode: 13, bubbles: true
                }));
                await myUtil.sleep(300);
            }
        } catch (error) {
            console.error('[proc04Caption._setFontSize]', error);
        }
    }

    /**
     * 保存当前字幕设置到 chrome.storage.local
     * 在用户点击 Generate 前调用
     */
    static async saveCurrentSettings() {
        try {
            if (!window.location.href.includes('/create-v4/')) return;

            // 等待字幕样式卡片出现（比检测面板标题更可靠，卡片是真正需要的数据）
            const _cardsLoaded = () => document.querySelectorAll('[data-caption-id]').length > 0;

            // 有点击记录时跳过面板等待（captionId 已知，无需等卡片加载）
            if (!_cardsLoaded() && !proc04Caption._lastClickedCaptionId) {
                // 尝试打开字幕面板
                const btnCaption = await myXPath.getElement(`//button[.//*[@name="cc-captions"]]`, 3);
                if (btnCaption) {
                    const cls = btnCaption.getAttribute('class') || '';
                    if (!cls.includes('!tw-bg-black/90')) {
                        btnCaption.click();
                    }
                }
                // 等待样式卡片渲染（最多 5 秒）
                const waitStart = Date.now();
                while (!_cardsLoaded() && Date.now() - waitStart < 5000) {
                    await myUtil.sleep(200);
                }
                // 仍未加载则放弃
                if (!_cardsLoaded()) {
                    console.log('[proc04Caption] 字幕样式卡片未加载且无点击记录，跳过保存');
                    return;
                }
            }

            let captionId = null;
            let positionY = null;
            let fontSize = null;

            // 确保点击监听已启动
            proc04Caption._watchCaptionCards();

            // ── 读取选中的字幕样式 ──
            let allBtns = document.querySelectorAll('[data-caption-id]');
            console.log('[proc04Caption.saveCurrentSettings] data-caption-id 元素数:', allBtns.length);

            // 策略0：点击拦截（最可靠）—— HeyGen 不在 DOM 暴露选中态，只能靠点击事件记录
            if (proc04Caption._lastClickedCaptionId) {
                captionId = proc04Caption._lastClickedCaptionId;
                console.log('[proc04Caption.saveCurrentSettings] 策略0 点击拦截 命中:', captionId);
            }

            // 策略1：aria 属性（pressed / checked / selected）
            for (let btn of allBtns) {
                try {
                    if (btn.getAttribute('aria-pressed')   === 'true' ||
                        btn.getAttribute('aria-checked')   === 'true' ||
                        btn.getAttribute('aria-selected')  === 'true') {
                        captionId = btn.getAttribute('data-caption-id');
                        console.log('[proc04Caption.saveCurrentSettings] 策略1 aria 命中:', captionId);
                        break;
                    }
                } catch (_) {}
            }

            // 策略2：data-state 属性（Radix UI / Headless UI 常用）
            if (!captionId) {
                for (let btn of allBtns) {
                    try {
                        const state = btn.getAttribute('data-state') || '';
                        if (state === 'on' || state === 'active' || state === 'checked' || state === 'selected') {
                            captionId = btn.getAttribute('data-caption-id');
                            console.log('[proc04Caption.saveCurrentSettings] 策略2 data-state 命中:', captionId);
                            break;
                        }
                    } catch (_) {}
                }
            }

            // 策略3：class 含 !tw-bg-black/90（HeyGen 统一选中态标志，与工具栏按钮一致）
            if (!captionId) {
                for (let btn of allBtns) {
                    let cls = btn.className || '';
                    if (cls.includes('!tw-bg-black/90')) {
                        captionId = btn.getAttribute('data-caption-id');
                        console.log('[proc04Caption.saveCurrentSettings] 策略3 !tw-bg-black/90 命中:', captionId);
                        break;
                    }
                }
            }

            // 策略4：class 名含 ring / selected / active / checked（Tailwind 选中态）
            if (!captionId) {
                for (let btn of allBtns) {
                    let cls = btn.className || '';
                    if (cls.includes('ring') || cls.includes('selected') ||
                        cls.includes('active') || cls.includes('checked')) {
                        captionId = btn.getAttribute('data-caption-id');
                        console.log('[proc04Caption.saveCurrentSettings] 策略4 class 命中:', captionId);
                        break;
                    }
                }
            }

            // 策略5：outline 非 none（浏览器焦点 / 选中态常带 outline）
            if (!captionId) {
                for (let btn of allBtns) {
                    try {
                        let style = window.getComputedStyle(btn);
                        let outline = style.outlineWidth || '0';
                        if (parseFloat(outline) > 0) {
                            captionId = btn.getAttribute('data-caption-id');
                            console.log('[proc04Caption.saveCurrentSettings] 策略5 outline 命中:', captionId);
                            break;
                        }
                    } catch (_) {}
                }
            }

            // 策略6：border-width > 1（选中项通常有粗边框）
            if (!captionId) {
                for (let btn of allBtns) {
                    try {
                        let style = window.getComputedStyle(btn);
                        let bw = parseFloat(style.borderWidth) || 0;
                        if (bw > 1) {
                            captionId = btn.getAttribute('data-caption-id');
                            console.log('[proc04Caption.saveCurrentSettings] 策略6 borderWidth 命中:', captionId);
                            break;
                        }
                    } catch (_) {}
                }
            }

            // 策略7：box-shadow 非空（选中样式常有阴影）
            if (!captionId) {
                for (let btn of allBtns) {
                    try {
                        let style = window.getComputedStyle(btn);
                        let shadow = style.boxShadow || '';
                        if (shadow && shadow !== 'none' && !shadow.includes('rgba(0, 0, 0, 0)')) {
                            captionId = btn.getAttribute('data-caption-id');
                            console.log('[proc04Caption.saveCurrentSettings] 策略7 boxShadow 命中:', captionId);
                            break;
                        }
                    } catch (_) {}
                }
            }

            if (!captionId) {
                console.warn('[proc04Caption.saveCurrentSettings] 所有策略均未检测到选中的字幕样式');
            }

            // ── 读取位置 Y ──
            let yInput = document.evaluate(
                '//div[text()="Y"]/following-sibling::input[@type="number"]',
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;
            if (yInput) {
                let val = parseInt(yInput.value);
                if (!isNaN(val)) positionY = val;
            }

            // ── 读取字号 ──
            let captionPanel = document.evaluate(
                '//div[./div/div/h2[text()="Captions"]]',
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;
            if (captionPanel) {
                let walker = document.createTreeWalker(captionPanel, NodeFilter.SHOW_ELEMENT);
                let node;
                while ((node = walker.nextNode())) {
                    if (node.children.length > 0) continue;
                    let text = (node.textContent || '').trim();
                    if (!/^\d{1,3}$/.test(text)) continue;
                    let num = parseInt(text);
                    if (num < 10 || num > 500) continue;
                    let cls = (node.className || '') + ' ' + ((node.parentElement && node.parentElement.className) || '');
                    if (cls.includes('cursor') || cls.includes('fill-block')) {
                        fontSize = num;
                        break;
                    }
                }
            }

            // ── 保存到 storage ──
            if (captionId || positionY || fontSize) {
                let preset = {};
                if (captionId) preset.captionId = captionId;
                if (positionY) preset.positionY = positionY;
                if (fontSize) preset.fontSize = fontSize;

                await new Promise((resolve) => {
                    chrome.storage.local.set({ captionPreset: preset }, resolve);
                });
                console.log('[proc04Caption] 已保存字幕预设:', preset);
            }
        } catch (error) {
            console.error('[proc04Caption.saveCurrentSettings]', error);
        }
    }

    // 获取视频时长
    static async getVideoSecond() {
        try {
            let _getTimeSpan = async () => {
                let selector = `(.//div[./div/button[.//*[@name="play-s"]]]//span)[last()]`;
                return await myXPath.getElement(selector, 5);
            }

            let element = await _getTimeSpan();
            if (element) {
                let content = element.innerText || element.textContent || '';
                if (content && content.match(/^\d+:\d+$/)) {
                    let second = myUtil.timeToSeconds(content);
                    if (second) return second;
                }
            }

            return null;
        } catch (error) {
            throw new Error(`Error-ms04createvideo-0006: ${error.message}`);
        }
    }

}
