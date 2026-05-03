

class mySimulate {

    /**
     * 模拟点击一个元素
     * @param {*} element 
     * @returns 
     */
    /* 
    await mySimulate.cursorClick(xxxx);
    */
    static async cursorClick(element) {
        //  const self = this;

        try {
            if (!element) {
                return false;
            }

            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(clickEvent);
        } catch (error) {
            throw new Error(`Error-mysimulate-0001: ${error.message}`);
        }
    }

    static async sleep(ms) {
        try {
            return new Promise(resolve => setTimeout(resolve, ms));
        } catch (error) {
            throw new Error(`Error-mysimulate-0044: ${error.message}`);
        }
    }

    /**
     * 重写 input里的值
     * @param {*} input 
     * @param {*} newValue 
     */
    static async setInputValue(input, newValue) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
        ).set;

        nativeInputValueSetter.call(input, newValue);

        input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

        input.dispatchEvent(new Event('change', { bubbles: true }));

        // 4. 可选：blur 事件（模拟用户离开输入框）
        // input.dispatchEvent(new Event('blur',  { bubbles: true }));
    }

    /**
     * 在 Chrome 扩展 content script 中向 input/textarea/contenteditable 元素输入文字
     * @param {HTMLElement} inputElement - 目标输入元素
     * @param {string} inputText - 要输入的文字
     * @param {Object} [args={}] - 配置选项
     * @param {boolean} [args.isClearOldValue=true]     是否先清空原有内容
     * @param {boolean} [args.isScrollToVisible=false]  是否滚动到可视区域
     * @param {boolean} [args.isSimulateTyping=true]    是否逐字模拟输入（较慢但更像真人）
     * @param {boolean} [args.isCompareValue=false]     是否在输入前后对比值（目前仅记录，不抛异常）
     * @returns {Promise<boolean>} 成功返回 true，失败返回 false
     */
    static async inputValue2(inputElement, inputText, args = {}) {
        const self = this;

        const defaults = {
            isClearOldValue: true,
            isScrollToVisible: false,
            isSimulateTyping: true,
            isCompareValue: false,
        };

        const options = { ...defaults, ...args };

        if (!inputElement || !(inputElement instanceof HTMLElement)) {
            return false;
        }

        try {
            // 1. 滚动到可见区域（可选）
            if (options.isScrollToVisible) {
                inputElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
                await self.sleep(80);   // 等待滚动完成
            }

            // 2. 聚焦元素
            inputElement.focus();
            await self.sleep(30);

            // 3. 清空原有内容（尽量模拟真实清空）
            if (options.isClearOldValue) {
                await this._clearElementValue(inputElement);
                await self.sleep(40);
            }

            // 4. 输入文字
            if (options.isSimulateTyping) {
                await this._simulateHumanTyping(inputElement, inputText);
            } else {
                await this._setValueDirectly(inputElement, inputText);
            }

            await self.sleep(50);

            // 5. 可选：对比值（目前只取值，不做断言）
            if (options.isCompareValue) {
                const finalValue = this._getElementValue(inputElement);
                console.debug('[inputValue2] 最终值:', finalValue);
                // 如果以后需要对比，可以在这里加逻辑
            }

            // 6. 失焦（视情况可选）
            inputElement.blur();

            return true;

        } catch (err) {
            console.warn('[inputValue2] 执行出错:', err);
            return false;
        }
    }

    // ────────────────────────────────────────────────
    //  辅助方法
    // ────────────────────────────────────────────────

    static async _clearElementValue(el) {
        const tag = el.tagName.toLowerCase();
        const isInput = tag === 'input' || tag === 'textarea';
        const isEditable = el.isContentEditable;

        if (isInput || isEditable) {
            // 方式1：直接清空 + 触发事件（最可靠）
            if (isInput) {
                el.value = '';
            } else {
                el.innerText = '';
            }

            // 触发 input / change 事件
            el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));

            // 方式2：模拟全选 + 删除（部分网站会监听）
            try {
                el.select?.();                    // input/textarea
                if (isEditable) {
                    const sel = window.getSelection();
                    sel.selectAllChildren(el);
                }
                document.execCommand('delete');
            } catch { }

            // 再触发一次 input 事件
            el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
        }
    }

    static async _setValueDirectly(el, text) {
        const tag = el.tagName.toLowerCase();

        if (tag === 'input' || tag === 'textarea') {
            el.value = text;
        } else if (el.isContentEditable) {
            el.innerText = text;
            // 或者用更精细的方式：
            // el.textContent = text;
        }

        // 触发必要事件
        el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    static async _simulateHumanTyping(el, text) {
        const self = this;

        for (const char of text) {
            // 模拟按下单个字符
            const keydown = new KeyboardEvent('keydown', { key: char, bubbles: true });
            const keypress = new KeyboardEvent('keypress', { key: char, bubbles: true });
            const input = new InputEvent('input', {
                data: char,
                bubbles: true,
                composed: true
            });

            el.dispatchEvent(keydown);
            el.dispatchEvent(keypress);
            el.dispatchEvent(input);

            // 真实输入框会自动追加字符，这里手动追加（更保险）
            const tag = el.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') {
                el.value += char;
            } else if (el.isContentEditable) {
                el.innerText += char;
            }

            // 模拟打字间隔（可调）
            await self.sleep(60 + Math.random() * 120);
        }

        // 最后再触发一次 change
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    static _getElementValue(el) {
        const tag = el.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') {
            return (el.value || '').trim();
        }
        if (el.isContentEditable) {
            return (el.innerText || el.textContent || '').trim();
        }
        return '';
    }


}