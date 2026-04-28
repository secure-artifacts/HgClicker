
class myJson {

    /**
     * 在 JSON 中找指定的 key 值
     * @param {*} jsonData 
     * @param {*} nodeName 
     * @returns 
     */
    static async _findValueByKey(jsonData, nodeName) {
        const self = this;

        try {
            if (typeof jsonData === 'object' && jsonData !== null) {
                if (nodeName in jsonData) {
                    return jsonData[nodeName];
                }
                for (let key in jsonData) {
                    let result = await self._findValueByKey(jsonData[key], nodeName);
                    if (result !== undefined) {
                        return result;
                    }
                }
            } else if (Array.isArray(jsonData)) {
                for (let item of jsonData) {
                    let result = await self._findValueByKey(item, nodeName);
                    if (result !== undefined) {
                        return result;
                    }
                }
            }
            return undefined;
        } catch (error) {
            throw new Error(`Error-myjson-0002: ${error.message}`);
        }
    }

    static async _fixText(text) {
        try {
            // \\\"
            // text = text.replace(/\\+"/g, '"');

            // "comet_video_player_static_config":"{}",
            // text = text.replace(/"([^"]+"):"\{\}"/g, '"$1":{}');

            // "ranking_tracking_string":"{"request_id":"71e2455e-5cf5-4d7d-b5bd-f0863020a482","bucket_id":"105993498947305","owner_id":"100086099657084","scored_time":0,"ranker_join_key":"71e2455e-5cf5-4d7d-b5bd-f0863020a482","raas_position":0,"raas_newly_scored_position":0,"random_rate":0,"usecase_id":"1","is_suggested":false,"viewstate_token":"{"shardManagerScope":"rva","snapshotId":5846974725356378855,"versionId":0,"creationTime":1695645276}"}",
            // text = text.replace(/:"{"/g, ':{"');
            // text = text.replace(/}"/g, '}');

            text = text.replace(/<script[^>]*?>/g, '\n\\nn<script>');
            text = text.replace(/<\/script>/g, '</script>\n\n\n');

            return text;
        } catch (error) {
            throw new Error(`Error-myjson-0003: ${error.message}`);
        }
    }

    /**
     * 尝试修复并重新解析
     * @param {*} jsonString 
     * @returns 
     */
    static async _tryParseJSON(jsonString) {
        try {
            let _fixAndParseJSON = (jsonString) => {
                try {
                    // 使用正则表达式去除无效的引号
                    let fixedJSONString = jsonString.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');

                    // 尝试重新解析修复后的 JSON 字符串
                    return JSON.parse(fixedJSONString);
                } catch (error) {
                    // 如果修复后仍然无法解析，返回 null
                    return null;
                }
            }

            try {
                return JSON.parse(jsonString);
            } catch (error) {
                // 如果 JSON 解析失败，尝试修复并重新解析
                return _fixAndParseJSON(jsonString);
            }
        } catch (error) {
            throw new Error(`Error-myjson-0004: ${error.message}`);
        }
    }

    /**
     * 要在页面中历遍 <script>{json code here}</script>，并找出所有指定 key 的值
     * @param {*} jsonData 
     * @param {*} nodeName 
     * @returns 
     */
    /* 
    // 要查找的目标 key
    let nodeName = 'me';

    // 调用函数查找值
    let results = await myJson.findNodeDatasInPageContent1(pageContent, nodeName);

    // 输出结果
    console.log('找到的值:', results);
    */

    static async findNodeDatasInPageContent1(pageContent, nodeName) {
        const self = this;

        try {
            pageContent += '';
            if (!pageContent) {
                return null;
            }

            pageContent = await self._fixText(pageContent);

            let scriptRegex = /<script[^>]*?>([\s\S]*?)<\/script>/g;
            let results = [];

            let match;
            while ((match = scriptRegex.exec(pageContent))) {
                let jsonString = match[1].trim();
                if (jsonString.length > 200 && jsonString.indexOf(`"${nodeName}":`) !== -1) {
                    try {
                        let jsonData = await self._tryParseJSON(jsonString);
                        if (jsonData) {
                            let value = await self._findValueByKey(jsonData, nodeName);
                            if (value !== undefined) {
                                results.push(value);
                            }
                        }
                    } catch (error) {
                        // console.log(jsonString);
                        console.error("JSON 解析错误:", error);
                    }
                }
            }

            return results;
        } catch (error) {
            throw new Error(`Error-myjson-0005: ${error.message}`);
        }
    }

    // ========

    /**
     * 在文本里找出包含有指定节点的 <script></script> JSON数据
     * @param {*} pageContent 
     * @param {*} nodeName 
     * @returns 
     */
    static async _findAllJsonDataInText2(text, nodeName) {
        const self = this;

        try {
            // 递归函数，检查JSON数据是否包含指定的节点名
            let _isContainNode = (data, nodeName) => {
                if (typeof data === 'object' && data !== null) {
                    if (data.hasOwnProperty(nodeName)) {
                        return true;
                    }
                    for (let key in data) {
                        if (data.hasOwnProperty(key) && typeof data[key] === 'object') {
                            if (_isContainNode(data[key], nodeName)) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }

            text = await self._fixText(text);

            let scriptRegex = /<script[^>]*?>[\s\S]*?<\/script>/g;
            let scriptMatches = text.match(scriptRegex);
            let results = [];

            if (scriptMatches) {
                for (let scriptMatch of scriptMatches) {
                    let scriptContent = scriptMatch.replace(/<script[^>]*?>|<\/script>/g, '').trim();

                    try {
                        let jsonData = await self._tryParseJSON(scriptContent);
                        if (jsonData) {
                            if (_isContainNode(jsonData, nodeName)) {
                                results.push(jsonData);
                            }
                        }
                    } catch (error) {
                        //
                    }
                }
            }

            return results;
        } catch (error) {
            throw new Error(`Error-myjson-0006: ${error.message}`);
        }
    }

    /**
     * 找出包含有指定节点的的数据
     * @param {*} jsonData 
     * @param {*} nodeName 
     * @returns 
     */
    static async _findNodeDataInJsonData2(jsonData, nodeName) {
        try {
            let data = [];

            // 递归函数，用于在 JSON 对象中查找指定的节点
            let _findNode = (node) => {
                if (node && typeof node === 'object') {
                    if (nodeName in node) {
                        data.push(node[nodeName]);
                    }

                    // 递归地处理所有属性值
                    for (let key in node) {
                        _findNode(node[key]);
                    }
                }
            }

            try {
                _findNode(jsonData);
            } catch (error) {
                //
            }

            return data;
        } catch (error) {
            throw new Error(`Error-myjson-0007: ${error.message}`);
        }
    }

    /**
     * 在文本中匹配所有 <script type="application/json"></script> 文件，并获取所有包含指定节点的数据
     * 在写这个函数时，忘记了已经有一个 findNodeDatasInPageContent1(), 但既然写了，就不去改写代码了
     * @param {*} pageContent 
     * @param {*} nodeName 
     * @returns 
     */
    /* 
    let pageContent = await myFile.readFile(`${__dirname}/file1.html`);

    let nodeName = 'story';

    // let results = await myJson.findNodeDatasInPageContent1(pageContent, nodeName);
    let results = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

    console.log(`length = `, results.length);
    console.log(`results = `, results);

    说明：
        20240428 使用情况：刚发完帖后，在页面内容里搜索 'story' 
        用 findNodeDatasInPageContent1() 只搜索出2个结果    -- 不准确
        用 findNodeDatasInPageContent2() 只搜索出35个结果   -- 准确


    */
    static async findNodeDatasInPageContent2(pageContent, nodeName) {
        const self = this;

        try {
            // 在整个文档中调用函数并打印结果
            let results = await self._findAllJsonDataInText2(pageContent, nodeName);

            let data = [];
            for (let jsonData of results) {
                let nodeDatas = await self._findNodeDataInJsonData2(jsonData, nodeName);
                for (let nodeData of nodeDatas) {
                    data.push(nodeData);
                }
            }

            return data;
        } catch (error) {
            throw new Error(`Error-myjson-0008: ${error.message}`);
        }
    }

    /**
     * 在 jsonDatas 中获取所有包含指定节点的数据
     * @param {*} jsonDatas 
     * @param {*} nodeName 
     * @returns 
     */
    /* 
    let _countReaction = async () => {
        let counts = await myJson.findNodeDatasInJsonDatas(jsonDatas, 'count');
        return counts.length ? counts[0] : 0;
    }
    
    */
    static async findNodeDatasInJsonDatas(jsonDatas, nodeName) {
        const self = this;

        try {
            // 在整个文档中调用函数并打印结果
            // let results = await self._findAllJsonDataInText2(text, nodeName);

            // 如果直接传入一个对象就转换为一个数组
            if (!Array.isArray(jsonDatas)) {
                jsonDatas = [jsonDatas];
            }

            let data = [];
            for (let jsonData of jsonDatas) {
                let nodeDatas = await self._findNodeDataInJsonData2(jsonData, nodeName);
                for (let nodeData of nodeDatas) {
                    data.push(nodeData);
                }
            }

            return data;
        } catch (error) {
            throw new Error(`Error-myjson-0009: ${error.message}`);
        }
    }

    // =====================
    // JSON.parse() 报错，通过正则解析数据
    // =====================

    /**
     * 获取字符串前多少个字符，后多少个字符
     * @param {*} str 
     * @param {*} keyword 
     * @param {*} left 
     * @param {*} right 
     * @returns 
     */
    /* 
    let keyword = '"surface"';
    let surroundingStrings = getSurroundingCharacters(responseText, keyword, 10, 10);
    */
    static async getSurroundingCharacters(str, keyword, left, right) {
        // const self = this;

        try {
            let positions = [];
            let index = str.indexOf(keyword);
            while (index !== -1) {
                positions.push(index);
                index = str.indexOf(keyword, index + 1);
            }

            let len = keyword.length;

            // 对每个指定字符获取前100个字符到后100个字符的子串
            let results = [];
            for (let pos of positions) {
                let start = Math.max(0, pos - left);
                let end = Math.min(str.length, pos + right + len);

                let surrounding = str.substring(start, end);
                results.push(surrounding);
            }

            return results;
        } catch (error) {
            throw new Error(`Error-myjson-0010: ${error.message}`);
        }
    }


}
