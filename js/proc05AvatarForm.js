/* 
流程

https://app.heygen.com/avatars/create/add-new-avatar-entry?returnTo=%2Favatar%2Fmy-avatars

https://app.heygen.com/avatar/my-avatars

*/

class proc05AvatarForm {


    static async start() {
        const self = this;

        try {
            let element = await myXPath.getElement(`.//*[contains(text(), "Your avatar is ready")]`);
            if (!element) {
                return { status: true, msg: `不是目标页面` };
            }

            const stored = await new Promise(resolve => chrome.storage.local.get(['avatarFormMode'], resolve));
            const mode = stored.avatarFormMode || 'randomName';

            await myUtil.sleep(200 + Math.random() * 200);

            await self.setAge();
            await self.setGender();
            await self.setEthnicity();

            if (mode === 'randomName') {
                await self.setName();
                await self.clickContinue();
            }
            return { status: true, msg: `任务已完成` };
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

            const _firstNames = [
                'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella',
                'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
                'Liam', 'Noah', 'Oliver', 'Elijah', 'James',
                'Lucas', 'Mason', 'Ethan', 'Logan', 'Aiden',
                'Sofia', 'Camila', 'Luna', 'Grace', 'Chloe',
                'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora',
                'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison',
                'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Zoe',
                'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah',
                'Audrey', 'Brooklyn', 'Bella', 'Claire', 'Skylar',
                'Jackson', 'Sebastian', 'Mateo', 'Jack', 'Owen',
                'Theodore', 'Aiden', 'Samuel', 'Joseph', 'John',
                'David', 'Wyatt', 'Matthew', 'Luke', 'Asher',
                'Carter', 'Julian', 'Grayson', 'Leo', 'Jayden',
                'Gabriel', 'Isaac', 'Lincoln', 'Anthony', 'Hudson',
                'Dylan', 'Ezra', 'Thomas', 'Charles', 'Christopher',
                'Jaxon', 'Maverick', 'Josiah', 'Isaiah', 'Andrew',
                'Elias', 'Joshua', 'Nathan', 'Caleb', 'Ryan',
                'Adrian', 'Miles', 'Eli', 'Nolan', 'Christian',
            ];

            const _lastNames = [
                'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
                'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
                'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                'Lee', 'Perez', 'Thompson', 'White', 'Harris',
                'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
                'Walker', 'Young', 'Allen', 'King', 'Wright',
                'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
                'Green', 'Adams', 'Nelson', 'Baker', 'Hall',
                'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
            ];

            const firstName = _firstNames[Math.floor(Math.random() * _firstNames.length)];
            const lastName  = _lastNames[Math.floor(Math.random() * _lastNames.length)];
            const randomName = `${firstName} ${lastName}`;

            let element = await myXPath.getElement(`//div[contains(text(), "Name")]/following-sibling::div/div/input`);
            if (element) {
                await mySimulate.setInputValue(element, randomName);
            }

            return { status: true, msg: `执行成功` };
        } catch (error) {
            throw new Error(`Error-xxxxx-xxxx: ${error.message}`);
        }
    }

    // 等待 Continue 按钮变黑（可点击）后自动点击
    static async clickContinue() {
        const self = this;
        try {
            const maxWait = 20000;
            const interval = 3000;
            const start = Date.now();

            while (Date.now() - start < maxWait) {
                const btn = await myXPath.getElement(`//button[normalize-space(text())="Continue"]`);

                if (btn && !btn.disabled && btn.offsetParent !== null) {
                    // 检查背景色是否为深色（黑色 = 可点击状态）
                    try {
                        const bg = window.getComputedStyle(btn).backgroundColor;
                        const m  = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                        if (m) {
                            const brightness = parseInt(m[1]) + parseInt(m[2]) + parseInt(m[3]);
                            if (brightness < 150) {
                                // 按钮已变黑，短暂延迟后点击
                                await myUtil.sleep(300);
                                btn.click();
                                return { status: true, msg: `已点击 Continue` };
                            }
                        } else {
                            // 无法解析颜色时，只要不是 disabled 就点击
                            await myUtil.sleep(300);
                            btn.click();
                            return { status: true, msg: `已点击 Continue` };
                        }
                    } catch (_) {
                        btn.click();
                        return { status: true, msg: `已点击 Continue` };
                    }
                }

                await myUtil.sleep(interval);
            }

            return { status: false, msg: `等待超时，Continue 按钮未就绪` };
        } catch (error) {
            throw new Error(`Error-proc05-continue: ${error.message}`);
        }
    }


}