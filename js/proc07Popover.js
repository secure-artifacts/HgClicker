/* 
多种弹框
*/

class proc07Popover {

    /**
     * 选择计划
     * @returns 
     */
    static async pop01ChoosePlan() {
        const self = this;

        try {
            let _getElement = async () => {
                let selector = `//*[contains(text(), "Choose the perfect plan for you")]`;
                return await myXPath.getElement(selector, 1);
            }

            let element = await _getElement();
            if (!element) {
                return { status: true, msg: `不是目标页面` };
            }

            await myUtil.sleep(500 + Math.random() * 500);

            let _getBtnSubmit = async () => {
                let selector = `//button[text()="Choose Free" and not(@disabled)]`;
                return await myXPath.getElement(selector, 5);
            }

            let _execute = async (loop) => {
                if (loop > 3) {
                    return { status: false, msg: `已尝试了3次，任务执行失败` };
                }

                if (1) {
                    let btn = await _getBtnSubmit();
                    if (btn) {
                        await mySimulate.cursorClick(btn);

                        return { status: true, msg: `任务已完成` };
                    }
                }

                loop++;
                return await _execute(loop);
            }

            return await _execute(1);
        } catch (error) {
            throw new Error(`Error-proc07popover-0001: ${error.message}`);
        }
    }

    /**
     * Review Uploads
     * @returns 
     */
    static async pop02ReviewUpload() {
        const self = this;

        try {
            // Review Uploads

            let _getElement = async () => {
                let selector = `//div[@role="dialog" and .//*[contains(text(), "Review Uploads")]]`;
                return await myXPath.getElement(selector, 1);
            }

            let element = await _getElement();
            if (!element) {
                return { status: true, msg: `不是目标页面` };
            }

            await myUtil.sleep(500 + Math.random() * 500);

            let _getBtnSubmit = async () => {
                let selector = `//div[@role="dialog" and .//*[contains(text(), "Review Uploads")]]//button[text()="Continue" and not(@disabled)]`;
                return await myXPath.getElement(selector, 5);
            }

            let _execute = async (loop) => {
                if (loop > 3) {
                    return { status: false, msg: `已尝试了3次，任务执行失败` };
                }

                if (1) {
                    let btn = await _getBtnSubmit();
                    if (btn) {
                        await mySimulate.cursorClick(btn);

                        return { status: true, msg: `任务已完成` };
                    }
                }

                loop++;
                return await _execute(loop);
            }

            return await _execute(1);
        } catch (error) {
            throw new Error(`Error-proc07popover-0002: ${error.message}`);
        }
    }

    /**
     * 推荐可能性
     * How likely are you to recommend us to a friend or colleague?
     * @returns 
     */
    static async pop03Recommend() {
        const self = this;

        try {
            // Review Uploads

            let _getSection = async () => {
                let selector = `//div[@role="dialog" and .//*[contains(text(), "How likely are you to recommend us to a friend or colleague")]]`;
                return await myXPath.getElement(selector, 1);
            }

            let element = await _getSection();
            if (!element) {
                return { status: true, msg: `不是目标页面` };
            }

            await myUtil.sleep(500 + Math.random() * 500);

            let _getElements = async () => {
                let selector = `//div[@role="dialog"]//button[text()="10"] | //div[@role="dialog"]//button[text()="Submit" and not(@disabled)]`;
                return await myXPath.getElements(selector, 5);
            }

            let _getOption = (elements) => {
                for (const element of elements) {
                    let tag = element.tagName.toLowerCase();
                    if (tag == 'button') {
                        let btnText = element.innerText || element.textContent || '';
                        if (btnText == '10') {
                            return element;
                        }
                    }
                }
                return null;
            }

            let _getSubmit = (elements) => {
                for (const element of elements) {
                    let tag = element.tagName.toLowerCase();
                    if (tag == 'button') {
                        let btnText = element.innerText || element.textContent || '';
                        if (btnText == 'Submit') {
                            return element;
                        }
                    }
                }
                return null;
            }

            let _execute = async (loop) => {
                if (loop > 10) {
                    return { status: false, msg: `已尝试了10次，任务执行失败` };
                }

                let elements = await _getElements();

                // 需要 Submit 优先
                // 最后才是 Option

                let btnSubmit = _getSubmit(elements);
                if (btnSubmit) {
                    await mySimulate.cursorClick(btnSubmit);

                    return { status: true, msg: `任务已完成` };
                }

                let btnOption = _getOption(elements);
                if (btnOption) {
                    await mySimulate.cursorClick(btnOption);

                    await myUtil.sleep(500 + Math.random() * 500);

                    loop++;
                    return await _execute(loop);
                }
            }

            return await _execute(1);
        } catch (error) {
            throw new Error(`Error-proc07popover-0003: ${error.message}`);
        }
    }

    /**
     * Introducing Brand Systems
     * @returns 
     */
    static async pop04Introducing() {
        const self = this;

        try {
            let _getElement = async () => {
                let selector = `//*[contains(text(), "Introducing Brand Systems")]`;
                return await myXPath.getElement(selector, 1);
            }

            let _getBtnClose = async () => {
                let selector = `//div[@role="dialog"]//button[.//*[@name="close"]]`;
                return await myXPath.getElement(selector, 5);
            }

            let element = await _getElement();
            if (!element) {
                return { status: true, msg: `不是目标页面` };
            }

            await myUtil.sleep(500 + Math.random() * 500);

            let _execute = async (loop) => {
                if (loop > 3) {
                    return { status: false, msg: `已尝试了3次，任务执行失败` };
                }

                if (1) {
                    let btn = await _getBtnClose();
                    if (btn) {
                        await mySimulate.cursorClick(btn);

                        return { status: true, msg: `任务已完成` };
                    }
                }

                loop++;
                return await _execute(loop);
            }

            return await _execute(1);
        } catch (error) {
            throw new Error(`Error-proc07popover-0001: ${error.message}`);
        }
    }

    /**
     * Create more with Avatar IV
     * @returns 
     */
    static async pop05CreateMoreAvatar() {
        const self = this;

        try {
            let _getElement = async () => {
                let selector = `//*[contains(text(), "Create more with Avatar")]`;
                return await myXPath.getElement(selector, 1);
            }

            let _getBtnClose = async () => {
                let selector = `//div[@role="dialog"]//button[.//*[@name="close"]]`;
                return await myXPath.getElement(selector, 5);
            }

            let element = await _getElement();
            if (!element) {
                return { status: true, msg: `不是目标页面` };
            }

            await myUtil.sleep(500 + Math.random() * 500);

            let _execute = async (loop) => {
                if (loop > 3) {
                    return { status: false, msg: `已尝试了3次，任务执行失败` };
                }

                if (1) {
                    let btn = await _getBtnClose();
                    if (btn) {
                        await mySimulate.cursorClick(btn);

                        return { status: true, msg: `任务已完成` };
                    }
                }

                loop++;
                return await _execute(loop);
            }

            return await _execute(1);
        } catch (error) {
            throw new Error(`Error-proc07popover-0005: ${error.message}`);
        }
    }

    /**
     * Generate Video
     * @returns 
     */
    static async pop06GenerateVideo() {
        const self = this;

        try {
            let pageUrl = window.location.href;
            if (!pageUrl.match(/\/create-v\d+/i)) {
                return { status: true, msg: `不是目标页面` };
            }

            // let _isDialog = async () => {
            //     let selector = `//div[@role="dialog" and .//*[contains(text(), "Generate Video")]]`;
            //     return await myXPath.getElement(selector, 1);
            // }

            // 说明：使用这个效率更快
            let _isDialog = async () => {
                let pageText = document.body.textContent;
                return pageText.includes('Generate Video');
            }

            let _getBtnGenerate = async () => {
                let selector = `//button[text()="Generate" and not(@disabled)]`;
                return await myXPath.getElement(selector, 1);
            }

            let _getBtnSubmit = async () => {
                let selector = `//div[@role="dialog" and .//*[contains(text(), "Generate Video")]]//button[text()="Submit" and not(@disabled)]`;
                return await myXPath.getElement(selector, 1);
            }

            let _watchSubmitBtn = () => {
                // 若已有监听，先判断旧 dialog 是否还在 DOM 里
                if (window.__heygenSubmitObserver) {
                    if (window.__heygenSubmitObserverDialog && document.contains(window.__heygenSubmitObserverDialog)) {
                        return; // 旧 dialog 仍存在，不重复挂载
                    }
                    // 旧 dialog 已关闭，断开残留 observer
                    window.__heygenSubmitObserver.disconnect();
                    window.__heygenSubmitObserver = null;
                    window.__heygenSubmitObserverDialog = null;
                }

                // 尝试点击 Submit（若已可点击则直接点，返回 true）
                let _tryClick = (dialog) => {
                    let btns = Array.from(dialog.querySelectorAll('button:not([disabled])'));
                    let btn = btns.find(b => b.textContent.trim() === 'Submit');
                    if (!btn) return false;
                    if (window.__heygenSubmitObserver) {
                        window.__heygenSubmitObserver.disconnect();
                        window.__heygenSubmitObserver = null;
                    }
                    window.__heygenSubmitObserverDialog = null;
                    mySimulate.cursorClick(btn);
                    return true;
                };

                // 第二阶段：dialog 已出现，等待至少 2 秒后再开始监听 Submit
                let _watchDialogSubmit = (dialog) => {
                    setTimeout(() => {
                        if (_tryClick(dialog)) return; // 延迟后已可点击，直接点

                        let obs = new MutationObserver(() => _tryClick(dialog));
                        window.__heygenSubmitObserver = obs;
                        window.__heygenSubmitObserverDialog = dialog;
                        obs.observe(dialog, {
                            subtree: true,
                            childList: true,       // 兼容 React 重新渲染节点
                            attributes: true,
                            attributeFilter: ['disabled']
                        });
                    }, 5000);
                };

                let dialog = document.querySelector('div[role="dialog"]');
                if (dialog) {
                    // dialog 已存在，直接进入第二阶段
                    _watchDialogSubmit(dialog);
                } else {
                    // dialog 还没出现（刚点了 Generate），先等它出现
                    let obs = new MutationObserver(() => {
                        let d = document.querySelector('div[role="dialog"]');
                        if (!d) return;
                        obs.disconnect();
                        if (window.__heygenSubmitObserver === obs) {
                            window.__heygenSubmitObserver = null;
                            window.__heygenSubmitObserverDialog = null;
                        }
                        _watchDialogSubmit(d);
                    });
                    window.__heygenSubmitObserver = obs;
                    window.__heygenSubmitObserverDialog = null;
                    obs.observe(document.body, { childList: true, subtree: true });
                }
            };

            let isDialog = await _isDialog();
            if (!isDialog) {
                let btn = await _getBtnGenerate();
                if (btn) {
                    await mySimulate.cursorClick(btn);
                    _watchSubmitBtn(); // 点了 Generate 后立即挂载，自动等待 dialog → Submit
                    return true;
                }
            }
            else {
                let btn = await _getBtnSubmit();
                if (btn) {
                    await mySimulate.cursorClick(btn);
                    return true;
                }
                else {
                    // 弹框已出现但 Submit 尚未可点击，挂载监听等待
                    _watchSubmitBtn();
                    return true;
                }
            }
        } catch (error) {
            throw new Error(`Error-proc07popover-0006: ${error.message}`);
        }
    }




}