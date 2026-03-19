

class myElementA {

    /**
     * 设置提示信息
     * @param {*} type 
     * @param {*} msg 
     */
    /* 
    await myElementA.setNotice1('primary', `xxxxx`);
    await myElementA.setNotice1('danger', `xxxxx`);
    */
    static async setNotice1(type, msg) {
        const element = document.querySelector('#container0211A #notice1');
        if (element) {
            // alert-success
            // alert-danger

            // alert-primary
            // alert-secondary
            // alert-warning
            // alert-info
            // alert-primary
            // alert-light
            // alert-dark

            // 清除所有类名
            element.className = '';
            element.classList.add(`text-${type}`);
            element.innerHTML = msg;
        }
    }

    /**
     * 控件显示或隐藏
     */
    static async toggleVisibility() {
        //  const self = this;

        // btn-outline-warning
        // btn-outline-success

        try {
            const container = document.querySelector('#container0211A');
            const button = document.querySelector('#container0211A #btnSwitcher');
            if (!(container && button)) {
                return false;
            }

            let _icon = `<img src="${chrome.runtime.getURL('icon.png')}">`;

            button.addEventListener('click', (event) => {
                button.classList.remove('btn-success', 'btn-warning', 'btn-info');

                let state = button.getAttribute('state') || 'hidden'; // visible / hidden
                if (state === 'visible') {
                    button.setAttribute('state', 'hidden');
                    button.innerHTML = `${_icon}`;
                    button.classList.add('btn-info');

                    container.classList.add('body-hidden');
                }
                else if (state === 'hidden') {
                    button.setAttribute('state', 'visible');
                    button.innerHTML = `${_icon}`;
                    button.classList.add('btn-success');

                    container.classList.remove('body-hidden');
                }

                // myExtra.resetBlockBodyHeight();
            });

        } catch (error) {
            throw new Error(`Error-myelement-0001: ${error.message}`);
        }
    }

    /**
     * 创建主框架
     */
    static async createContainer() {
        try {
            let element = document.querySelector('#container0211A');

            if (!element) {
                // let html = `
                // <div id="blockHeader" class="d-flex align-items-center justify-content-end">
                //     <button id="btnSwitcher" class="btn btn-warning" state="visible">😊已隐藏</button>
                // </div>

                // <div id="blockBody">
                //     <section name="textKeyword">
                //         <div>
                //             <button name="btnQuestionnaire">问卷选项</button>
                //             <button name="btnNewAvatar">上传头像</button>
                //             <button name="btnWalkthrough" class="btn">跳过引导</button>
                //             <button name="btnAvatarForm" class="btn">填写信息</button>
                //             <button name="btnCaption" class="btn">字幕设置</button>
                //         </div>
                //     </section>
                // </div>
                // `;

                let _icon = `<img src="${chrome.runtime.getURL('icon.png')}">`;

                let html = `
                <div id="blockHeader" class="d-flex align-items-center justify-content-end">
                    <button id="btnSwitcher" class="btn btn-info" state="hidden">${_icon}</button>
                </div>

                <div id="blockBody">
                    <section name="textKeyword">
                        <div>
                            <button name="btnNewAvatar">上传头像</button>
                            <button name="btnCaption" class="btn">字幕设置</button>
                        </div>
                    </section>
                </div>
                `;

                html = myUtil.compressHTML(html);

                element = document.createElement('div');
                element.id = 'container0211A';
                element.classList.add('container-0211');
                element.classList.add('body-hidden');
                element.innerHTML = html;
                document.body.appendChild(element);
            }
        } catch (error) {
            throw new Error(`Error-myelement-0002: ${error.message}`);
        }
    }

    /**
     * 更新 section 数据
     */
    static async updateSectionKeyword() {
        try {
            let element = await myXPath.getElement(`//div[@id="container0211A"]//section[@name="textKeyword"]//textarea`);
            let label = await myXPath.getElement(`//div[@id="container0211A"]//section[@name="textKeyword"]/label`);

            if (element && label) {
                let lines = element.value.split('\n').filter(line => line.trim());
                if (lines.length) {
                    label.innerHTML = `关键词 ${lines.length} 条`;
                } else {
                    label.innerHTML = `关键词`;
                }
            }
        } catch (error) {
            throw new Error(`Error-myelement-0003: ${error.message}`);
        }
    }

    // 提取 Place ID
    static async extractPlaceId(url) {
        try {
            const gMatch = url.match(/!16s\/g\/([^!]+)\?entry=/);
            if (gMatch && gMatch[1]) {
                return gMatch[1];
            }

            // 3. 提取 legacy 格式 (0x....:0x....)
            const legacyMatch = url.match(/!1s([0-9a-fx:]+)/i);
            if (legacyMatch && legacyMatch[1]) {
                return legacyMatch[1];
            }

            return null; // 没找到
        } catch (e) {
            return null;
        }
    }

    /**
     * 在 Google/Map 执行
     */
    static async fetchGoogleMap() {
        const self = this;

        let url = decodeURIComponent(window.location.href);
        // if (!url.includes('https://www.google.com/maps/place/')) {
        //     return false;
        // }

        let _getChurchUrl = async () => {
            let anchor = await myXPath.getElement(`//div[@role="main" and @aria-label]//div[@role="region"]//a[@data-item-id and @data-tooltip]`);
            if (anchor) {
                let churchUrl = anchor.getAttribute('href').trim();
                return myUtil.pureLink2(churchUrl);
            }
            return '';
        }

        let input = await myXPath.getElement(`//form/input[@name="q"]`);

        // 显示点选后的教堂栏目
        let main = await myXPath.getElement(`//div[@role="main" and @aria-label]`);

        if (!(input && main)) {
            return false;
        }

        let placeID = self.extractPlaceId(url);
        let searchKeyword = String(input.value).trim();
        let churchName = main.getAttribute('aria-label').trim();

        if (placeID && searchKeyword) {
            let churchUrl = await _getChurchUrl();
            let dataNew = { placeID, searchKeyword, churchName, churchUrl };

            await myExtra.saveEvaluateData(dataNew);

            // await myElementA.updateSectionRemark();

            await myElementA.setNotice1('primary', '有更新');

            if (churchUrl) {
                await self.fetchChurchPage(churchUrl);
            }
        }
    }

    // 在教堂网址中找facebook链接
    static async fetchChurchPage(churchUrl) {
        // 请求获取 churchUrl 的内容
        chrome.runtime.sendMessage({ action: 'fetchUrl', url: churchUrl }, async (response) => {
            if (response.error) {
                // console.error('获取 churchUrl 内容失败:', churchUrl);
                return false;
            }

            // 将 HTML 字符串转换为 DOM 对象
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.html, 'text/html');

            // 使用修改后的 getElements 函数查询 DOM
            // <a href="http://www.facebook.com/xxxx1">Facebook</a>
            // <a href="http://facebook.com/xxxx2">Facebook</a>
            let anchor = await myXPath.getElementX(doc, `//a[contains(@href, "facebook.com")]`);
            if (!anchor) {
                return false;
            }

            let facebookUrl = anchor.getAttribute('href').trim();
            if (facebookUrl) {
                facebookUrl = myUtil.pureLink2(facebookUrl);

                let dataNew = { churchUrl, facebookUrl };
                await myExtra.saveEvaluateData(dataNew);

                // await myElementA.updateSectionRemark();

                await myElementA.setNotice1('primary', '已找到Facebook链接');
            } else {
                await myElementA.setNotice1('primary', '没有找到Facebook链接');
            }
        });
    }

    /**
     * 关键词
     */
    // static async textKeyword() {
    //     const self = this;

    //     try {
    //         const textarea = document.querySelector('#container0211A section[name="textKeyword"] textarea');
    //         textarea.addEventListener('blur', async (event) => {
    //             let el = event.target;
    //             let text = el.value;
    //             let lines = text.split('\n').map(line => line.trim()).filter(line => line);
    //             lines = myUtil.arrayUnique(lines);
    //             el.value = lines.join('\n');

    //             await self.updateSectionKeyword();
    //         });

    //     } catch (error) {
    //         throw new Error(`Error-myelement-0005: ${error.message}`);
    //     }
    // }


    static async btnController() {
        const self = this;

        try {
            // 问卷选项
            // if (1) {
            //     const element = document.querySelector('#container0211A button[name="btnQuestionnaire"]');
            //     element.addEventListener('click', async (event) => {
            //         await proc01Questionnaire.start();
            //     });
            // }

            // 上传头像
            if (1) {
                const element = document.querySelector('#container0211A button[name="btnNewAvatar"]');
                element.addEventListener('click', async (event) => {
                    let href = window.location.href;

                    // https://app.heygen.com/avatar/my-avatars
                    // https://app.heygen.com/avatars/create/add-new-avatar-entry

                    if (!(href.includes('/avatars/create/add-new-avatar-entry'))) {
                        window.location.href = 'https://app.heygen.com/avatars/create/add-new-avatar-entry?start=true';
                    }

                    await proc02UpdateImage.start();
                });

                let href = window.location.href;
                if (href.includes('?start=true')) {
                    const newUrl = '/avatars/create/add-new-avatar-entry';
                    window.history.pushState({ path: newUrl }, '', newUrl);

                    await myUtil.sleep(500 + Math.random() * 500);

                    await proc02UpdateImage.start();
                }
            }

            // 跳过引导
            // if (1) {
            //     const element = document.querySelector('#container0211A button[name="btnWalkthrough"]');
            //     element.addEventListener('click', async (event) => {
            //         await proc03Walkthrough.start();
            //     });
            // }

            // 填写信息
            // if (1) {
            //     const element = document.querySelector('#container0211A button[name="btnAvatarForm"]');
            //     element.addEventListener('click', async (event) => {
            //         await proc05AvatarForm.start();
            //     });
            // }

            if (1) {
                const element = document.querySelector('#container0211A button[name="btnCaption"]');
                element.addEventListener('click', async (event) => {
                    await proc04Caption.start();
                });
            }


        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }

}
