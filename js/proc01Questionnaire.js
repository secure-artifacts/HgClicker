/* 
问卷选项

https://app.heygen.com/onboarding

What do you want to create
*/

class proc01Questionnaire {

    static async start() {
        const self = this;

        try {
            // let pageUrl = window.location.href;
            // if (!pageUrl.includes('/onboarding')) {
            //     return { status: true, msg: `不是目标页面` };
            // }

            let _getElement = async () => {
                let selector = `.//*[contains(text(), "What do you want to create")]`;
                return await myXPath.getElement(selector, 1);
            }

            let element = await _getElement();
            if (!element) {
                return { status: true, msg: `不是目标页面` };
            }

            let _getElements = async () => {
                let selector = `.//div[contains(@class, "tw-grid tw-gap-3 tw-grid-cols-")]/div | .//button[text()="Continue" and not(@disabled)] | .//button[text()="Submit" and not(@disabled)]`;
                return await myXPath.getElements(selector, 5);
            }

            let _getOptions = (elements) => {
                let items = [];
                for (const element of elements) {
                    let tag = element.tagName.toLowerCase();
                    if (tag == 'div') {
                        items.push(element);
                    }
                }
                return items.length ? items : null;
            }

            let _getContinue = (elements) => {
                for (const element of elements) {
                    let tag = element.tagName.toLowerCase();
                    if (tag == 'button') {
                        let btnText = element.innerText || element.textContent || '';
                        if (btnText == 'Continue') {
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
                // 需要 Continue 优先
                // 最后才是 Option

                let btnSubmit = _getSubmit(elements);
                if (btnSubmit) {
                    await mySimulate.cursorClick(btnSubmit);

                    return { status: true, msg: `任务已完成` };
                }

                let btnContinue = _getContinue(elements);
                if (btnContinue) {
                    await mySimulate.cursorClick(btnContinue);

                    await myUtil.sleep(1000 + Math.random() * 1000);

                    loop++;
                    return await _execute(loop);
                }

                let options = _getOptions(elements);
                if (options && options.length) {
                    // 避开最后 other
                    let btns = options.slice(0, -1);

                    let btn = myUtil.randomArrayItem(btns);
                    await mySimulate.cursorClick(btn);

                    await myUtil.sleep(1000 + Math.random() * 1000);

                    loop++;
                    return await _execute(loop);
                }
            }

            return await _execute(1);
        } catch (error) {
            throw new Error(`Error-ms01questionnaire-0001: ${error.message}`);
        }
    }


}