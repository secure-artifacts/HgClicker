/* 
流程

https://app.heygen.com/onboarding

What do you want to create
*/

class proc02UpdateImage {


    static async start() {
        const self = this;

        try {
            // 错误信息
            let errorMsg = null;

            // 是否提交了
            let isSubmit = false;

            // 流程控制 （可以作为参考模板，带 if then 函数）
            let _stepProcess = async (loop) => {
                let isNext = true;

                if (loop > 3) {
                    return { status: false, msg: `已尝试了3次，任务执行失败，${errorMsg}` };
                }

                if (!isSubmit && isNext) {
                    // await myUtil.sleep(500 + Math.random() * 500);

                    let { status, msg } = await self.clickUploadButton();
                    isNext = status;
                    if (!isNext) {
                        errorMsg = msg;
                    }
                }

                // page 3
                /* if (!isSubmit && isNext) {
                    await myUtil.sleep(1000 + Math.random() * 500);

                    let { status, msg } = await self.clickOptions2();
                    isNext = status;
                    if (!isNext) {
                        errorMsg = msg;
                    }
                } */
               
                /*
                // page 4
                if (!isSubmit && isNext) {
                    await myUtil.sleep(1000 + Math.random() * 500);
 
                    let { status, msg } = await self.clickSubmit();
                    isNext = status;
                    if (!isNext) {
                        errorMsg = msg;
                    }
 
                    if (status) {
                        isSubmit = true;
                    }
                }
 
                if (isSubmit) {
                    return { status: true, msg: `任务执行已完成` };
                }
 
                if (!isNext) {
                    loop++;
 
                    return await _stepProcess(loop);
                }
 
                return { status: true, msg: `任务执行已完成` }; */
            }

            return await _stepProcess(1);
        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }

    // 找按钮
    static async clickUploadButton() {
        const self = this;

        try {
            // 检查 "Upload Photos of Your Avatar" 弹框是否真正可见
            const _uploadDialogVisible = () => {
                return Array.from(document.querySelectorAll('h1,h2,h3,h4'))
                    .some(h => {
                        if (!h.textContent.includes('Upload Photos')) return false;
                        const r = h.getBoundingClientRect();
                        return r.width > 0 && r.height > 0;
                    });
            };

            // 如果弹框已可见，直接返回
            if (_uploadDialogVisible()) {
                return { status: true, msg: '上传弹框已显示' };
            }

            // ── 新流程：hover "Create a virtual character" → 点击 "Upload photo" ──

            // 1. 等待卡片渲染完成（最多 10 秒）
            const _waitForCard = async () => {
                const start = Date.now();
                while (Date.now() - start < 10000) {
                    const img = document.querySelector('img[src*="create_virtual_char.png"]');
                    if (img) {
                        const r = img.getBoundingClientRect();
                        if (r.width > 0 && r.height > 0) return img;
                    }
                    await myUtil.sleep(300);
                }
                return null;
            };

            const virtualImg = await _waitForCard();
            if (!virtualImg) {
                return { status: false, msg: '找不到 virtual character 卡片' };
            }

            let cardDiv = null;
            let p = virtualImg.parentElement;
            for (let i = 0; i < 6 && p; i++) {
                if (p.classList && p.classList.contains('tw-cursor-pointer')) {
                    cardDiv = p;
                    break;
                }
                p = p.parentElement;
            }
            if (!cardDiv) cardDiv = virtualImg.closest('div') || virtualImg.parentElement;

            // 2. 触发 hover 事件让 "Upload photo" 按钮出现
            cardDiv.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }));
            cardDiv.dispatchEvent(new MouseEvent('mouseover',  { bubbles: true, cancelable: true, view: window }));
            await myUtil.sleep(400 + Math.random() * 200);

            // 3. 等待并点击 "Upload photo" 按钮
            const _findUploadBtn = () => {
                for (const el of document.querySelectorAll('button,div,span,a')) {
                    const t = (el.textContent || '').trim().toLowerCase();
                    if (t === 'upload photo' || t === 'upload photos') {
                        const r = el.getBoundingClientRect();
                        if (r.width > 0 && r.height > 0) return el;
                    }
                }
                return null;
            };

            let uploadBtn = _findUploadBtn();

            // 若还没出现，再等一下重试
            if (!uploadBtn) {
                await myUtil.sleep(500);
                uploadBtn = _findUploadBtn();
            }

            if (uploadBtn) {
                uploadBtn.click();
                await myUtil.sleep(600 + Math.random() * 300);
            } else {
                return { status: false, msg: 'Hover 后未找到 Upload photo 按钮' };
            }

            // 4. 确认上传弹框已打开
            if (_uploadDialogVisible()) {
                return { status: true, msg: '上传弹框已打开' };
            }

            return { status: false, msg: '点击后弹框未出现' };
        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }

    // 点击选项
    static async clickOptions2() {
        const self = this;

        try {
            if (1) {
                let btns = await myXPath.getElements(`//div[@class="tw-grid tw-gap-3 tw-grid-cols-1"]/div`);
                if (!btns) {
                    return { status: false, msg: '找不到按钮' };
                }

                // 避开最后 other
                btns = btns.slice(0, -1);

                let btn = myUtil.randomArrayItem(btns);
                btn.click();
            }

            await myUtil.sleep(200 + Math.random() * 200);

            if (1) {
                let btn = await myXPath.getElement(`//button[text()="Continue"]`);
                if (!btn) {
                    return { status: false, msg: '找不到按钮' };
                }
                btn.click();
            }

            return { status: true, msg: `执行成功` };
        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }

    // 点击选项 + 提交
    static async clickSubmit() {
        const self = this;

        try {
            if (1) {
                let btns = await myXPath.getElements(`//div[@class="tw-grid tw-gap-3 tw-grid-cols-2"]/div`);
                if (!btns) {
                    return { status: false, msg: '找不到按钮' };
                }

                // 避开最后 other
                btns = btns.slice(0, -1);

                let btn = myUtil.randomArrayItem(btns);
                btn.click();
            }

            await myUtil.sleep(200 + Math.random() * 200);

            if (1) {
                let btn = await myXPath.getElement(`//button[text()="Submit"]`);
                if (!btn) {
                    return { status: false, msg: '找不到按钮' };
                }
                btn.click();
            }

            return { status: true, msg: `执行成功` };
        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }



}