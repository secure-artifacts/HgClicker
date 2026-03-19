/* 
流程

https://app.heygen.com/avatars/create/add-new-avatar-entry?returnTo=%2Favatar%2Fmy-avatars

https://app.heygen.com/avatar/my-avatars

*/

class proc05AvatarForm {


    static async start() {
        const self = this;

        try {
            // let pageUrl = window.location.href;
            // if (!(pageUrl.includes('/avatars/create/') || pageUrl.includes('/avatar/my-avatar'))) {
            //     return { status: true, msg: `不是目标页面` };
            // }

            let _getElement = async () => {
                return await myXPath.getElement(`.//*[contains(text(), "Your avatar is ready")]`);
            }

            let element = await _getElement();
            if (!element) {
                return { status: true, msg: `不是目标页面` };
            }

            // 错误信息
            let errorMsg = null;

            // 是否提交了
            // let isSubmit = false;

            // 流程控制 （可以作为参考模板，带 if then 函数）
            let _stepProcess = async (loop) => {
                let isNext = true;

                if (loop > 3) {
                    return { status: false, msg: `已尝试了3次，任务执行失败，${errorMsg}` };
                }

                if (isNext) {
                    // await myUtil.sleep(300+ Math.random() * 300);

                    let { status, msg } = await self.setAge();

                    isNext = status;
                    if (!isNext) {
                        errorMsg = msg;
                    }
                }

                if (isNext) {
                    await myUtil.sleep(200 + Math.random() * 200);

                    let { status, msg } = await self.setGender();

                    isNext = status;
                    if (!isNext) {
                        errorMsg = msg;
                    }
                }

                if (isNext) {
                    await myUtil.sleep(200 + Math.random() * 200);

                    let { status, msg } = await self.setEthnicity();

                    isNext = status;
                    if (!isNext) {
                        errorMsg = msg;
                    }
                }

                if (isNext) {
                    await myUtil.sleep(200 + Math.random() * 200);

                    let { status, msg } = await self.setName();

                    isNext = status;
                    if (!isNext) {
                        errorMsg = msg;
                    }

                    if (status) {
                        return { status: true, msg: `任务已完成` };
                    }
                }

                /*
                if (isSubmit) {
                    return { status: true, msg: `任务已完成` };
                }
 
                if (!isNext) {
                    loop++;
 
                    return await _stepProcess(loop);
                }
 
                return { status: true, msg: `任务已完成` }; */
            }

            return await _stepProcess(1);
        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }

    // Age
    static async setAge() {
        const self = this;

        try {
            if (1) {
                let element = await myXPath.getElement(`//div[contains(text(), "Age")]/following-sibling::button[@role="combobox" and @data-state="closed"]`);
                if (element) {
                    // return { status: false, msg: '找不到按钮1' };
                    element.click();
                }
            }

            await myUtil.sleep(200 + Math.random() * 200);

            if (1) {
                let btn = await myXPath.getElement(`//div[@role="presentation"]//div[./div/div[text()="Early Middle Age"]]`);
                if (btn) {
                    // return { status: false, msg: '找不到按钮2' };
                    btn.click();
                }
            }

            return { status: true, msg: `已找到按钮` };
        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }

    // Gender
    static async setGender() {
        const self = this;

        try {
            let element = await myXPath.getElement(`//div[contains(text(), "Gender")]/following-sibling::button[@role="combobox" and @data-state="closed"]`);
            if (element) {
                // return { status: false, msg: '找不到按钮3' };
                element.click();
            }

            await myUtil.sleep(200 + Math.random() * 200);

            if (1) {
                let btn = await myXPath.getElement(`//div[@role="presentation"]//div[./div/div[text()="Man"]]`);
                if (btn) {
                    // return { status: false, msg: '找不到按钮4' };
                    btn.click();
                }
            }

            return { status: true, msg: `执行成功` };
        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }

    // Ethnicity
    static async setEthnicity() {
        const self = this;

        try {
            let element = await myXPath.getElement(`//div[contains(text(), "Ethnicity")]/following-sibling::button[@role="combobox" and @data-state="closed"]`);
            if (element) {
                // return { status: false, msg: '找不到按钮5' };
                element.click();
            }

            await myUtil.sleep(200 + Math.random() * 200);

            if (1) {
                let btn = await myXPath.getElement(`//div[@role="presentation"]//div[./div/div[text()="White"]]`);
                if (btn) {
                    // return { status: false, msg: '找不到按钮6' };
                    btn.click();
                }
            }

            return { status: true, msg: `执行成功` };
        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }

    // Name
    static async setName() {
        const self = this;

        try {
            await myUtil.sleep(200 + Math.random() * 200);

            if (1) {
                let order = null;
                let sign = await myXPath.getElement(`//div[@id="myAccountAlias"]`);
                if (sign) {
                    order = sign.getAttribute('account-order');
                }
                if (order) {
                    let element = await myXPath.getElement(`//div[contains(text(), "Name")]/following-sibling::div/div/input`);
                    if (element) {
                        await mySimulate.setInputValue(element, order);
                    }
                }
            }

            return { status: true, msg: `执行成功` };
        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }


}