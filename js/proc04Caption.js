/* 
流程

https://app.heygen.com/create-v4/draft

*/

class proc04Caption {

    static async start() {
        const self = this;

        await self.step4Caption();
    }


    /**
     * 调整字幕
     */
    static async step4Caption() {
        const self = this;

        try {
            let heyGenTextStyle = 'stamp_red';
            let heyGenPositionY = 1450;
            let heyGenFontsize = 77;

            // 字幕按钮
            let _getBtnCaption = async () => {
                let selector = `//button[.//*[@name="cc-captions"]]`;
                return await myXPath.getElement(selector, 5);
            }

            // 字幕样式 栏目
            let _getCardStyle = async () => {
                let selector = `//div[./div/div/h2[text()="Captions"] and .//button[@data-caption-id]]`;
                return await myXPath.getElement(selector, 5);
            }

            // 字幕样式
            let _getTextStyle = async () => {
                // let selector = `//button[./img[@alt="new104 caption preview"]]`;
                // let selector = `//div[./div/div/h2[text()="Captions"]]//button[@data-caption-id="stamp_red"]`;
                let selector = `//div[./div/div/h2[text()="Captions"]]//button[@data-caption-id="${heyGenTextStyle}"]`;
                return await myXPath.getElement(selector, 5);
            }

            // 位置 栏目
            let _getCardPosition = async () => {
                let selector = `//div[./div/div/h2[text()="Captions"] and .//*[text()="Position"]]`;
                return await myXPath.getElement(selector, 5);
            }

            // 位置Y
            let _getPositionY = async () => {
                let selector = `//div[text()="Y"]/following-sibling::input[@type="number"]`;
                return await myXPath.getElement(selector, 5);
            }

            // 字体大小 box
            let _getFontSizeBox = async () => {
                let selector = `//div[./div/div/h2[text()="Captions"] and .//*[text()="Text"]]//div[./div/*[text()="Text"]]/div[2]/div[2]/div[2]/div[@title]`;
                return await myXPath.getElement(selector, 5);
            }

            // 字体大小 input
            let _getFontSizeInput = async () => {
                let selector = `//div[./div/div/h2[text()="Captions"]]//div[@class="tw-relative"]//input[@type="number"]`;
                return await myXPath.getElement(selector, 5);
            }

            let _getBtnGenerate = async () => {
                let selector = `//button[text()="Generate"]`;
                return await myXPath.getElement(selector, 5);
            }

            let _getTitle = async () => {
                let selector = `//div[@role="dialog" and .//*[contains(text(), "Generate Video")]]//div[text()="Title"]/following-sibling::div//input`;
                return await myXPath.getElement(selector, 5);
            }

            let _getBtnSubmit = async () => {
                let selector = `//div[@role="dialog" and .//*[contains(text(), "Generate Video")]]//button[text()="Submit"]`;
                return await myXPath.getElement(selector, 5);
            }

            let _getCardTitle = async () => {
                let selector = `//div[./div/div/h2[text()="Captions"]]//*[text()="Captions"]`;
                return await myXPath.getElement(selector, 5);
            }

            let _execute = async (loop) => {
                if (loop > 10) {
                    return { status: false, msg: `已尝试了10次，任务执行失败` };
                }

                if (1) {
                    let element = await _getBtnCaption();
                    if (element) {
                        let className = element.getAttribute('class');
                        if (!className.includes('!tw-bg-black/90')) {
                            await mySimulate.cursorClick(element);
                        }
                    }
                }

                /* 
                <button data-caption-id="stamp_red" class="">
                <img src="https://static.heygen.ai/prod/movio/public/resource/1bd2280e344e4c2f97ddbcbcd8dade47.png" alt="stamp_red caption preview" class="">
                </button>
                */

                // 字幕样式
                if (1) {
                    let card = await _getCardStyle();
                    if (card) {
                        let element = await _getTextStyle();
                        if (element) {
                            // element.click();
                            await mySimulate.cursorClick(element);
                            // await myUtil.sleep(1000);
                        }
                    }
                }

                // 位置 栏目
                if (1) {
                    let card = await _getCardPosition();
                    if (card) {
                        if (1) {
                            let element = await _getPositionY();
                            if (element) {
                                await mySimulate.setInputValue(element, heyGenPositionY);
                                await myUtil.sleep(500);
                                await mySimulate.inputValue2(element, heyGenPositionY);
                                await myUtil.sleep(500);
                            }
                        }

                        // if (1) {
                        //     let box = await _getFontSizeBox();
                        //     console.log(`1111 box = `, box);
                        //     if (box) {
                        //         // box.click();
                        //         await mySimulate.cursorClick(box);

                        //         let element = await _getFontSizeInput();
                        //         if (element) {
                        //             await mySimulate.setInputValue(element, heyGenFontsize);
                        //             await myUtil.sleep(1000);
                        //         }
                        //     }
                        // }

                        // if (1) {
                        //     let element = await _getCardTitle();
                        //     if (element) {
                        //         await mySimulate.cursorClick(element);
                        //     }
                        // }
                    }
                }

                // 确认数据是否设置
                // if (1) {
                //     // 位置Y
                //     // value="1632"
                //     let element = await _getPositionY();
                //     let box = await _getFontSizeBox();

                //     if (element && box) {
                //         let value = element.getAttribute('value');

                //         console.log(`1111 value = `, value);

                //         // title="77"
                //         let title = box.getAttribute('title');

                //         // if (String(value) === String(heyGenPositionY) && String(title) === String(heyGenFontsize)) {
                //         //     //
                //         // } else {
                //         //     loop++;
                //         //     return await _execute(loop);
                //         // }
                //     }
                // }

                // if (1) {
                //     let btn = await _getBtnGenerate();
                //     if (btn) {
                //         // btn.click();
                //         await mySimulate.cursorClick(btn);
                //     }
                // }

                // title
                // if (1) {
                //     let element = await _getTitle();
                //     if (element) {
                //         // let { taskNo } = taskData;

                //         await mySimulate.setInputValue(element, taskNo);
                //     }
                // }

                // if (1) {
                //     let btn = await _getBtnSubmit();
                //     if (btn) {
                //         // await btn.click();
                //         await mySimulate.cursorClick(btn);

                //         return { status: true, msg: `任务已完成` };
                //     }
                // }

                // loop++;
                // return await _execute(loop);
            }

            return await _execute(1);
        } catch (error) {
            throw new Error(`Error-ms04createvideo-0005: ${error.message}`);
        }
    }

    // 时间
    static async getVideoSecond() {
        // const self = this;

        try {
            // 时间标签
            let _getTimeSpan = async () => {
                /* 
                <div>
                    <span class="tw-min-w-[33px] tw-text-end">00:00</span>
                    <span class="tw-font-normal tw-text-textDisable">/</span>
                    <span class="tw-min-w-[33px] tw-font-normal tw-text-textDisable">00:28</span>
                </div>
                */
                let selector = `(.//div[./div/button[.//*[@name="play-s"]]]//span)[last()]`;
                return await myXPath.getElement(selector, 5);
            }

            let element = await _getTimeSpan();
            if (element) {
                let content = element.innerText || element.textContent || '';

                console.log(`1111 content = `, content);

                // 00:28
                if (content && content.match(/^\d+:\d+$/)) {
                    let second = myUtil.timeToSeconds(content);
                    if (second) {
                        return second;
                    }
                }
            }

            return null;
        } catch (error) {
            throw new Error(`Error-ms04createvideo-0006: ${error.message}`);
        }
    }




}