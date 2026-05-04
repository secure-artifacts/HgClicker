/* 
流程

 https://app.heygen.com/create-v4/8aa0f10500e642e99587bc909028a482

*/

class proc06OutPutName {

    static async getTitle() {
        try {
            let selector = `//div[@role="dialog" and .//*[contains(text(), "Generate Video")]]//div[text()="Title"]/following-sibling::div//input`;
            return await myXPath.getElement(selector, 5);
        } catch (error) {
            throw new Error(`Error-proc06-getTitle-0001: ${error.message}`);
        }
    }

    static async start() {
        try {
            // 检查是否启用自动填充人名
            const enabled = await new Promise((resolve) => {
                try {
                    chrome.storage.local.get(['autoFillNameEnabled'], (r) => {
                        resolve(r.autoFillNameEnabled !== false); // 默认开启
                    });
                } catch (_) { resolve(true); }
            });
            if (!enabled) return { status: true, msg: '自动填充人名已关闭' };

            let titleEl = await proc06OutPutName.getTitle();
            if (!titleEl) {
                return { status: true, msg: '未找到目标弹框' };
            }

            await proc06OutPutName.setName(titleEl);

            return { status: true, msg: '任务已完成' };
        } catch (error) {
            throw new Error(`Error-proc06-start-0001: ${error.message}`);
        }
    }

    /**
     * 调整字幕
     */
    static async setName(titleEl) {
        const self = this;

        try {
            let order = null;
            let sign = await myXPath.getElement(`//div[@id="myAccountAlias"]`);
            if (sign) {
                order = sign.getAttribute('account-order');
            }
            if (order) {
                await mySimulate.setInputValue(titleEl, order);
            }
        } catch (error) {
            throw new Error(`Error-ms04createvideo-0005: ${error.message}`);
        }
    }






}