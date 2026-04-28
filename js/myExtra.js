

class myExtra {

    /**
     * 获取账号信息
     * @returns 
     */
    static async getCurrentUser() {
        //  const self = this;

        try {
            let pageContent = document.documentElement.outerHTML;

            let accountInfo = await myFacebook.getAccountProfiles(pageContent);
            if (!accountInfo) {
                return null;
            }

            /* 
            profileId: '100086099657084',
            profileName: 'Connor Nicholson',
            profileRole: 'PROFILE',
            avatarId: '464111905_532524709627513_4971280538028930816_n',
            avatarUrl: 'https://scontent-lga3-1.xx.fbcdn.net/v/t39.30808-1/464111905_532524709627513_4971280538028930816_n.jpg?stp=c138.56.769.769a_dst-jpg_s148x148_tt6&_nc_cat=111&ccb=1-7&_nc_sid=fe756c&_nc_ohc=mebtqBEeeH8Q7kNvgGCC5VG&_nc_zt=24&_nc_ht=scontent-lga3-1.xx&_nc_gid=AJrYI8vuIktKVxiqsZLvU4o&oh=00_AYBDN6Clpem-l4PjlHrVr7By1GMLY-jGLqY3AeCZpPO9AA&oe=6786091D',
            */

            /* 
            currentUser: {
                "accountName": "Connor Nicholson",
                "accountNumber": "100086099657084",
                profileRole: 'PAGE',
                "accountImageUrl": "https://graph.facebook.com/100086099657084/picture?width=320&height=320&access_token=567067343352427|f249176f09e26ce54212b472dbab8fa8",
                // "extensionVersion": "1.0.14",
                // "extensionName": "小桔子（第三版）"
            },

            profilesNode = [
                {
                    profileId: '100090562390220',
                    profileName: 'Truth & Light',
                    profileRole: 'PAGE',
                    profileAvatarId: '332304034_746221943619469_7295153753461827941_n',
                    profileAvatarUrl: 'https://scontent-lga3-3.xx.fbcdn.net/v/t39.30808-1/332304034_746221943619469_7295153753461827941_n.jpg?stp=cp0_dst-jpg_s64x64_tt6&_nc_cat=110&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=STbBTSaQk2AQ7kNvgEF-SwF&_nc_zt=24&_nc_ht=scontent-lga3-3.xx&_nc_gid=An6v6YcTidAaMydt806E7X5&oh=00_AYA0cTjVqXLhwMxbzuv9c7ut0mHPy1ReSS0CRmZxv8HRPQ&oe=6790A9DA'
                }
            ]
            */

            let { profilesNode } = accountInfo;

            return { profilesNode };
        } catch (error) {
            throw new Error(`Error-apptaskutil-0001: ${error.message}`);
        }
    }

    static async saveValue(tagName, element, field, text) {
        let groupLink = window.location.href;
        let pageContent = document.documentElement.innerHTML;

        let groupInfo = await myFacebook.findNotLoggedGroupData(pageContent, groupLink);
        let { groupName, placeID } = groupInfo;

        if (!placeID) {
            return await myElementA.setNotice1('danger', '获取不到小组ID');
        }

        let dataNew = { placeID, groupName, groupLink };
        dataNew[field] = text;

        await myExtra.saveEvaluateData(dataNew);

        if (tagName === 'button') {
            // <section var-title="活跃度" var-field="valueGroupActivity">
            // 删除一个 block 的所有选中的样式
            let buttonsBlock = document.querySelectorAll(`section[var-field="${field}"] button`);
            for (let button2 of buttonsBlock) {
                button2.classList.remove('selected');
            }

            element.classList.add('selected');
        }

        await myElementA.setNotice1('primary', '');
    }

    /**
     * 获取某一行数据
     * @param {*} dataNew 
     * @returns 
     */
    static async getEvaluateItem(dataNew) {
        // const self = this;

        try {
            let def = {
                placeID: '',
                searchKeyword: '',
                churchName: '',
                churchUrl: '',
                facebookUrl: '',

                _churchHostName: '', // churchUrl 链接的域名
            }
            let itemNew = { ...def, ...dataNew };

            if (itemNew.churchUrl) {
                let location = myUtil.getLocation(itemNew.churchUrl);
                itemNew._churchHostName = location.hostname.replace(/^www\./i, '');
            }

            let result = await myStorage.getResult();

            // 统一通过 placeID 作为一行数据的唯一标识
            let _check = (valueOld, valueNew) => {
                if (valueOld && valueNew) {
                    return valueOld === valueNew;
                }
                return false;
            };

            let index = result.findIndex(itemOld => {
                return _check(itemOld.placeID, itemNew.placeID) ||
                    _check(itemOld.churchUrl, itemNew.churchUrl) ||
                    _check(itemOld._churchHostName, itemNew._churchHostName) ||
                    _check(itemOld.facebookUrl, itemNew.facebookUrl);
            });

            if (index === -1) {
                return null;
            }

            return result[index];
        } catch (error) {
            throw new Error(`Error-apptaskutil-xxxx: ${error.message}`);
        }
    }

    /**
     * 保存评估数据
     * @param {*} dataNew 
     * @returns 
     */
    static async saveEvaluateData(dataNew) {
        // const self = this;

        try {
            let def = {
                placeID: '',
                searchKeyword: '',
                churchName: '',
                churchUrl: '',
                facebookUrl: '',

                _churchHostName: '', // churchUrl 链接的域名
            }
            let itemNew = { ...def, ...dataNew };

            if (itemNew.churchUrl) {
                let location = myUtil.getLocation(itemNew.churchUrl);
                itemNew._churchHostName = location.hostname.replace(/^www\./i, '');
            }

            let result = await myStorage.getResult();

            // 统一通过 placeID 作为一行数据的唯一标识
            let _check = (valueOld, valueNew) => {
                if (valueOld && valueNew) {
                    return valueOld === valueNew;
                }
                return false;
            };

            // 把 itemNew 覆盖 itemOld 每项的值，但 itemNew 空的项不覆盖
            let _updateItem = (itemOld, itemNew) => {
                for (let key in itemNew) {
                    if (itemNew[key] !== '') {
                        itemOld[key] = itemNew[key];
                    }
                }
                return itemOld;
            }

            let index = result.findIndex(itemOld => {
                return _check(itemOld.placeID, itemNew.placeID) ||
                    _check(itemOld.churchUrl, itemNew.churchUrl) ||
                    _check(itemOld._churchHostName, itemNew._churchHostName) ||
                    _check(itemOld.facebookUrl, itemNew.facebookUrl);
            });

            // add
            if (index === -1) {
                result.push(itemNew);
            }
            // update
            else {
                let itemOld = result[index];

                // result[index] = { ...itemOld, ...itemNew };
                result[index] = _updateItem(itemOld, itemNew);
            }

            await myStorage.setResult(result);

            return true;
        } catch (error) {
            throw new Error(`Error-apptaskutil-0002: ${error.message}`);
        }
    }

    /**
     * 读取评估数据
     * @param {*} placeID 
     * @returns 
     */
    // static async getEvaluateData(placeID) {
    //     // const self = this;

    //     try {
    //         let result = await myStorage.getResult();

    //         return myUtil.getObjectChainValue(result, placeID) || {};
    //     } catch (error) {
    //         throw new Error(`Error-apptaskutil-0002: ${error.message}`);
    //     }
    // }

    /**
     * 设置 blockBody 高度
     */
    // static async resetBlockBodyHeight() {
    //     try {
    //         let resizeHeight = () => {
    //             let blocks = document.querySelectorAll(`.container-0211 div[id="blockBody"]`);

    //             // 获取视口高度
    //             const viewportHeight = window.innerHeight;

    //             blocks.forEach(block => {
    //                 // 获取元素相对于视口顶部的距离
    //                 const rect = block.getBoundingClientRect();
    //                 const top = rect.top;

    //                 // 计算能够设置的最大高度
    //                 const maxHeight = viewportHeight - top;

    //                 // 设置元素的 max-height 属性
    //                 block.style.maxHeight = `${maxHeight}px`;
    //                 block.style.overflowY = 'auto'; // 如果内容超过这个高度，会显示滚动条
    //             });
    //         }

    //         let handler = myUtil.debounce(() => {
    //             resizeHeight();
    //         }, 250);
    //         window.addEventListener('resize', handler);

    //         resizeHeight();
    //     } catch (error) {
    //         throw new Error(`Error-apptaskutil-0003: ${error.message}`);
    //     }
    // }

    /**
     * 返回数据
     */
    static async getResultData() {
        try {
            let head = [];
            let body = [];

            let data = await myStorage.getResult();
            if (!data.length) {
                return { head, body };
            }

            head.push(['教堂名称', '教堂网址', 'Facebook链接', '关键词']);

            for (let item of data) {
                let { placeID, searchKeyword, churchName, churchUrl, facebookUrl } = item;
                body.push([churchName, churchUrl, facebookUrl, searchKeyword]);
            }
            return { head, body };
        } catch (error) {
            throw new Error(`Error-myeffect-0003: ${error.message}`);
        }
    }


}