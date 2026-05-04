// proc10AvatarClick.js
// 在 Avatar 页面按顺序自动点击 Look 卡片中间按钮，选择 Build scene-by-scene

class proc10AvatarClick {

    static async start() {
        try {
            if (!window.location.href.includes('/avatar/my-avatars')) {
                return { status: true, msg: '不是目标页面' };
            }

            const enabled = await proc10AvatarClick._get('avatarClickEnabled');
            if (!enabled) return { status: true, msg: '功能已关闭' };

            // 若 "Choose a voice" 弹框打开，等待用户选完后弹框消失（最多 5 分钟）
            const _isVoiceDialogOpen = () =>
                Array.from(document.querySelectorAll('*')).some(el => {
                    if (el.children.length > 0) return false;
                    const t = (el.textContent || '').trim();
                    if (t !== 'Choose a voice') return false;
                    const r = el.getBoundingClientRect();
                    return r.width > 0 && r.height > 0;
                });

            if (_isVoiceDialogOpen()) {
                console.log('[proc10] 检测到 Choose a voice 弹框，等待用户选完...');
                for (let i = 0; i < 600; i++) {
                    await myUtil.sleep(500);
                    if (!_isVoiceDialogOpen()) break;
                }
                console.log('[proc10] Choose a voice 弹框已关闭，继续');
            }

            // 等待 Look 卡片渲染（最多 12 秒）
            let cards = [];
            for (let i = 0; i < 24; i++) {
                cards = proc10AvatarClick._getLookCards();
                if (cards.length > 0) break;
                await myUtil.sleep(500);
            }

            if (cards.length === 0) {
                console.log('[proc10] 未找到 Look 卡片');
                return { status: true, msg: '未找到 Look 卡片' };
            }

            const storedIdx = (await proc10AvatarClick._get('avatarClickIndex')) ?? 0;

            // 读取已用 src 列表，全部用完则重置进入下一轮
            let usedSrcs = (await proc10AvatarClick._get('usedLookSrcs')) || [];
            if (usedSrcs.length >= cards.length) {
                usedSrcs = [];
                await proc10AvatarClick._set('usedLookSrcs', []);
                console.log('[proc10] 所有 Look 已轮完，重置 usedLookSrcs');
            }

            const _getCardSrc = (c) => { const img = c.querySelector('img'); return img ? img.src : null; };

            // 从 storedIdx 开始找第一张未用过的卡片
            let targetIdx = -1, card = null;
            for (let offset = 0; offset < cards.length; offset++) {
                const idx = (storedIdx + offset) % cards.length;
                const src = _getCardSrc(cards[idx]);
                if (!src || !usedSrcs.includes(src)) {
                    targetIdx = idx;
                    card = cards[idx];
                    break;
                }
            }

            if (!card) {
                // 全部已用（理论上不会到这里）
                targetIdx = storedIdx % cards.length;
                card = cards[targetIdx];
            }

            console.log(`[proc10] 共 ${cards.length} 个 Look，操作第 ${targetIdx + 1} 个，已用 ${usedSrcs.length} 个`);

            // 直接调用 React onMouseEnter 触发卡片 hover 状态
            proc10AvatarClick._callReact(card, 'onMouseEnter');
            proc10AvatarClick._nativeHover(card);
            await myUtil.sleep(400);

            // 在 tw-group 卡片内部直接找全部 3 个按钮（按 DOM 顺序）
            // 3 个按钮顺序：[... 左] [cursor 中] [heart 右]，取 index 1
            const btnsInCard = Array.from(card.querySelectorAll('button')).filter(b => {
                const cls = b.className || '';
                return cls.includes('tw-h-[24px]') && cls.includes('tw-bg-fill-general');
            });

            console.log(`[proc10] 卡片内找到 ${btnsInCard.length} 个按钮`);

            if (btnsInCard.length < 2) {
                console.log('[proc10] 按钮数量不足');
                return { status: true, msg: '按钮数量不足' };
            }

            // 按 x 坐标排序（位置为 0 的排最后作为兜底）
            const sortedBtns = [...btnsInCard].sort((a, b) => {
                const ax = a.getBoundingClientRect().left || 99999;
                const bx = b.getBoundingClientRect().left || 99999;
                return ax - bx;
            });

            // 3 个：取中间；2 个：取 index 1；1 个：取 index 0
            const midIdx = sortedBtns.length >= 3 ? 1 : sortedBtns.length - 1;
            const midBtn = sortedBtns[midIdx];
            console.log(`[proc10] 共 ${sortedBtns.length} 个按钮，点击第 ${midIdx + 1} 个`);

            proc10AvatarClick._callReact(midBtn, 'onClick');
            proc10AvatarClick._nativeClick(midBtn);

            const ok = await proc10AvatarClick._clickMenuItem('Build scene-by-scene');

            if (!ok) {
                console.log('[proc10] Build scene-by-scene 未出现');
                return { status: true, msg: '菜单项未出现' };
            }

            // 记录已用 src，更新轮转索引
            const cardSrc = _getCardSrc(card);
            if (cardSrc) {
                usedSrcs.push(cardSrc);
                await proc10AvatarClick._set('usedLookSrcs', usedSrcs);
            }
            const nextIdx = (targetIdx + 1) % cards.length;
            await proc10AvatarClick._set('avatarClickIndex', nextIdx);
            console.log(`[proc10] 完成，下次将操作第 ${nextIdx + 1} 个`);

            return { status: true, msg: '任务已完成' };

        } catch (error) {
            throw new Error(`Error-proc10-0001: ${error.message}`);
        }
    }

    // 找 Look 卡片的实际 hover 目标：内层 tw-group div（onMouseEnter 在这里）
    static _getLookCards() {
        let grid = null;
        for (const div of document.querySelectorAll('div')) {
            if ((div.className || '').includes('minmax(232px') &&
                div.textContent.includes('Add a look')) {
                grid = div;
                break;
            }
        }
        if (!grid) return [];

        const result = [];
        for (const child of grid.children) {
            if (child.textContent.includes('Add a look')) continue;
            // 找内层真正的 hover 目标（tw-group + tw-cursor-pointer）
            const hoverTarget = Array.from(child.querySelectorAll('div')).find(d => {
                const cls = d.className || '';
                return cls.includes('tw-group') &&
                       cls.includes('tw-cursor-pointer') &&
                       cls.includes('tw-rounded-[20px]');
            });
            if (hoverTarget) result.push(hoverTarget);
        }
        return result;
    }

    // 直接调用 React 内部事件 handler
    static _callReact(el, eventName) {
        try {
            const key = Object.keys(el).find(k => k.startsWith('__reactProps'));
            if (!key) return;
            const handler = el[key][eventName];
            if (typeof handler === 'function') {
                handler({
                    type: eventName.replace(/^on/, '').toLowerCase(),
                    currentTarget: el,
                    target: el,
                    bubbles: true,
                    preventDefault: () => {},
                    stopPropagation: () => {},
                });
            }
        } catch (_) {}
    }

    // 原生 hover 事件（辅助触发，不触发 mouseleave）
    static _nativeHover(el) {
        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2 || 400;
        const y = r.top + r.height / 2 || 400;
        const o = { bubbles: true, cancelable: true, clientX: x, clientY: y };
        el.dispatchEvent(new MouseEvent('pointerover',  o));
        el.dispatchEvent(new MouseEvent('pointerenter', { ...o, bubbles: false }));
        el.dispatchEvent(new MouseEvent('mouseover',    o));
        el.dispatchEvent(new MouseEvent('mouseenter',   { ...o, bubbles: false }));
        el.dispatchEvent(new MouseEvent('mousemove',    o));
    }

    // 原生 click 事件（坐标用 0,0 也没关系，React 依赖事件类型不依赖坐标）
    static _nativeClick(el) {
        el.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
        el.dispatchEvent(new MouseEvent('mousedown',   { bubbles: true, cancelable: true }));
        el.dispatchEvent(new MouseEvent('pointerup',   { bubbles: true, cancelable: true }));
        el.dispatchEvent(new MouseEvent('mouseup',     { bubbles: true, cancelable: true }));
        el.dispatchEvent(new MouseEvent('click',       { bubbles: true, cancelable: true }));
    }

    // 轮询查找菜单项文本节点并点击（最多等 4 秒）
    static async _clickMenuItem(text) {
        for (let i = 0; i < 20; i++) {
            await myUtil.sleep(200);
            // 用 TreeWalker 找精确文本节点，不受父元素 children 干扰
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node, found = null;
            while ((node = walker.nextNode())) {
                if (node.textContent.trim() === text) { found = node.parentElement; break; }
            }
            if (found) {
                const target = found.closest('button') || found.closest('[role="menuitem"]') || found.closest('li') || found;
                proc10AvatarClick._callReact(target, 'onClick');
                proc10AvatarClick._nativeClick(target);
                return true;
            }
        }
        return false;
    }

    static _get(key) {
        return new Promise(resolve => {
            try { chrome.storage.local.get([key], r => resolve(r[key])); }
            catch (_) { resolve(undefined); }
        });
    }

    static _set(key, val) {
        return new Promise(resolve => {
            try { chrome.storage.local.set({ [key]: val }, resolve); }
            catch (_) { resolve(); }
        });
    }

    static resetIndex() {
        return proc10AvatarClick._set('avatarClickIndex', 0);
    }
}
