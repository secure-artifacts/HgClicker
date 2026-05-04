/*
流程

https://app.heygen.com/create-v4/draft

*/

class proc04Caption {

    static _lastClickedCaptionId = null; // 点击拦截：记录用户最后点击的字幕样式卡片 id

    static _cacheReady       = false;
    static _cachedPreset     = null;
    static _cacheInitPromise = null;

    static _initCache() {
        if (proc04Caption._cacheReady) return Promise.resolve();
        if (proc04Caption._cacheInitPromise) return proc04Caption._cacheInitPromise;
        proc04Caption._cacheInitPromise = new Promise((resolve) => {
            try {
                chrome.storage.sync.get(['captionPreset'], (r) => {
                    proc04Caption._cachedPreset = (r && r.captionPreset) || null;
                    proc04Caption._cacheReady   = true;

                    try {
                        chrome.storage.onChanged.addListener((changes, area) => {
                            if (area === 'sync' && changes.captionPreset) {
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
     * 监听 Captions 按钮点击 → 用户打开面板时立即应用已保存的预设
     */
    static _watchCaptionBtn() {
        if (window.__heygenCaptionBtnWatcher) return;
        window.__heygenCaptionBtnWatcher = true;

        let _applying = false;

        const _tryAttach = () => {
            if (window.__heygenCaptionBtnHooked && window.__heygenCaptionBtnHooked.isConnected) return;
            window.__heygenCaptionBtnHooked = null;

            const btn = document.evaluate(
                "//div[contains(@class,'tw-h-16') and .//span[text()='Captions']]",
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;
            if (!btn || btn.__captionBtnHooked) return;
            btn.__captionBtnHooked = true;
            window.__heygenCaptionBtnHooked = btn;

            btn.addEventListener('click', async () => {
                // 面板当前已开（[data-caption-id] 卡片存在）说明这次点击是关闭，跳过
                if (document.querySelectorAll('[data-caption-id]').length > 0) return;
                if (_applying) return;

                await proc04Caption._initCache();
                const preset = proc04Caption._cachedPreset;
                if (!preset) return;

                _applying = true;
                try {
                    await myUtil.sleep(300);
                    await proc04Caption._applySettings(preset);
                    myElementA._showQuickToast('✅ 字幕已自动设置', 2500);
                } catch (e) {
                    console.error('[proc04Caption._watchCaptionBtn]', e);
                } finally {
                    _applying = false;
                }
            });
        };

        _tryAttach();

        let _debounce = null;
        const obs = new MutationObserver(() => {
            clearTimeout(_debounce);
            _debounce = setTimeout(_tryAttach, 2000);
        });
        obs.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('pagehide', () => {
            obs.disconnect();
            window.__heygenCaptionBtnWatcher = false;
            window.__heygenCaptionBtnHooked = null;
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
     * 在编辑器页面初始化监听器（由 content.js MutationObserver 触发一次）
     */
    static init() {
        if (!window.location.href.includes('/create-v4/')) return { status: true, msg: '不是编辑器页面' };
        proc04Caption._watchCaptionBtn();
        proc04Caption._watchCaptionCards();
        return { status: true, msg: '任务已完成' };
    }

    /**
     * 手动字幕设置（点击"字幕设置"按钮触发）
     * 有预设则应用预设；无预设则仅打开字幕面板，提示用户先保存样式
     */
    static async start() {
        const preset = await new Promise((resolve) => {
            try {
                chrome.storage.sync.get(['captionPreset'], (r) => {
                    resolve(r.captionPreset || null);
                });
            } catch (_) { resolve(null); }
        });

        if (!preset) {
            // 无预设：仅打开字幕面板，不强制套用任何默认样式
            try {
                let btnCaption = await myXPath.getElement(`//div[contains(@class,'tw-h-16') and .//span[text()='Captions']]`, 5);
                if (btnCaption) {
                    if (document.querySelectorAll('[data-caption-id]').length === 0) {
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
            let btnCaption = await myXPath.getElement(`//div[contains(@class,'tw-h-16') and .//span[text()='Captions']]`, 5);
            if (btnCaption) {
                if (document.querySelectorAll('[data-caption-id]').length === 0) {
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
     * 保存当前字幕设置到 chrome.storage.sync（清理浏览器数据不丢失）
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
                const btnCaption = await myXPath.getElement(`//div[contains(@class,'tw-h-16') and .//span[text()='Captions']]`, 3);
                if (btnCaption) {
                    if (document.querySelectorAll('[data-caption-id]').length === 0) {
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
                    chrome.storage.sync.set({ captionPreset: preset }, resolve);
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
