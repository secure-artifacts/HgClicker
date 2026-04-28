/* 
流程

https://app.heygen.com/create-v4/d284ee5aa67b4defb4615619d86a7b59?vt=p&avatarGroup=78c8ce9f6523418685ba34fde1e81956&defaultLookId=78c8ce9f6523418685ba34fde1e81956&fromCreateButton=true

*/

class proc03Walkthrough {


    static async start() {
        const self = this;

        try {
            // let pageUrl = window.location.href;
            // if (!pageUrl.match(/\/create-v\d+/i)) {
            //     return { status: true, msg: `不是目标页面` };
            // }

            let _getElement = async () => {
                let selector = `//*[contains(text(), "Welcome to AI Studio") or contains(text(), "Continue (") or contains(text(), "Get started")]`;
                return await myXPath.getElement(selector, 10);
            }

            let element = await _getElement();
            if (!element) {
                return { status: true, msg: `不是目标页面` };
            }

            let _execute = async (loop) => {
                if (loop > 20) {
                    return { status: false, msg: `已尝试了20次，任务执行失败` };
                }

                if (1) {
                    let btn = await _getElement();
                    if (btn) {
                        await mySimulate.cursorClick(btn);

                        await myUtil.sleep(1000 + Math.random() * 1000);

                        let content = btn.innerText || btn.textContent || '';
                        if (content.includes('Get started')) {
                            return { status: true, msg: `任务已完成` };
                        }

                        loop++;
                        return await _execute(loop);
                    }
                }

                loop++;
                return await _execute(loop);
            }

            return await _execute(1);
        } catch (error) {
            throw new Error(`Error-ms04createvideo-0003: ${error.message}`);
        }
    }


}