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
            if (1) {
                let mask = await myXPath.getElement(`//div[./div/img[@src="https://dynamic.heygen.ai/tr:f-auto/avatar/create_virtual_char.png"]]`);
                if (!mask) {
                    return { status: false, msg: '找不到div' };
                }

                // 方法 A：最常用，触发 mouseover 事件（会冒泡）
                mask.dispatchEvent(new MouseEvent('mouseover', {
                    bubbles: true,       // 让事件可以冒泡（重要）
                    cancelable: true,
                    view: window
                }));
            }

            await myUtil.sleep(100 + Math.random() * 100);

            if (1) {
                let btn = await myXPath.getElement(`//button[contains(text(), "Upload photo")]`);
                if (!btn) {
                    return { status: false, msg: '找不到按钮' };
                }
                btn.click();
            }
          
            return { status: true, msg: `已找到按钮` };
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