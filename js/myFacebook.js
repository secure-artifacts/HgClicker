class myFacebook {

    /**
    * 从页面代码里找出账号ID
    * @param {*} pageContent 
    */
    static async findFacebookId(pageContent) {
        try {
            pageContent += '';
            if (!pageContent) {
                return null;
            }

            let _getFacebookId = () => {
                // \\\"
                pageContent = pageContent.replace(/\\+"/g, '"');

                let matches = null;

                // "ACCOUNT_ID":"61551297484432","USER_ID":"61551297484432"
                matches = pageContent.match(/"ACCOUNT_ID":"(\d+)"/);
                if (matches) {
                    return matches[1];
                }

                matches = pageContent.match(/"USER_ID":"(\d+)"/);
                if (matches) {
                    return matches[1];
                }

                // ------

                // "viewer_actor":{"__typename":"User","id":"61551297484432"}
                matches = pageContent.match(/"viewer_actor":\{"__typename":"User","id":"(\d+)"\}/);
                if (matches) {
                    return matches[1];
                }

                // ------

                // href="https://www.facebook.com/profile.php?id=61551297484432&amp;sk=photos"
                // href="https://www.facebook.com/profile.php?id=61551297484432&amp;sk=friends"
                matches = pageContent.match(/href="https:\/\/www\.facebook\.com\/profile\.php\?id=(\d+)(?:&amp;|&)sk=(?:about|friends|photos|videos|map|sports|music|movies|tv|books|likes|events)"/);
                if (matches) {
                    return matches[1];
                }

                // ------

                // "viewer":{"actor":{"__typename":"User","id":"61551297484432"
                matches = pageContent.match(/"viewer":\{"actor":\{"__typename":"User","id":"(\d+)"/);
                if (matches) {
                    return matches[1];
                }

                // ------

                // "fbid":"61551297484432"
                matches = pageContent.match(/"fbid":"(\d+)"/);
                if (matches) {
                    return matches[1];
                }

                return null;
            }

            let facebookId = _getFacebookId();
            if (facebookId === null) {
                return null;
            }

            // 当账号还没有登陆的时候
            // {"ACCOUNT_ID":"0","USER_ID":"0","NAME":"",

            // 正常的ID
            if (facebookId.match(/^\d{7,20}$/)) {
                return facebookId;
            }

            return null;
        } catch (error) {
            throw new Error(`Error-myfacebook-0001: ${error.message}`);
        }
    }

    /**
     * 匹配用户ID
     * @param {*} pageContent 
     * @param {*} profileId 
     * @returns 
     */
    /* 
    let pageContent = await myFile.readFile(`${__dirname}/../file1.html`);

    let isExists = await myFacebook.checkProfileId(pageContent, '61555273767398');

    console.log(`isExists = `, isExists);
    */
    static async checkProfileId(pageContent, profileId) {
        // const self = this;

        try {
            /* 
            正确用户ID，链接没有重定向
            https://www.facebook.com/profile.php?id=61555273767398

            匹配到 8 个结果："profile_owner":{"id":"61555273767398"}

            正确用户ID，链接重定向
            https://www.facebook.com/profile.php?id=100040656614050
            =>
            https://www.facebook.com/dianne.wiltshire.140/

            匹配到 6 个结果："profile_owner":{"id":"100040656614050"}

            不正确用户ID，链接重定向
            https://www.facebook.com/profile.php?id=555040656614050

            匹配到 0 个结果："profile_owner":{"id":"555040656614050"}
            */

            if (String(pageContent).length < 1000) {
                return false;
            }

            let count = 0;

            let matches = await myJson.findNodeDatasInPageContent2(pageContent, 'profile_owner');
            for (let match of matches) {
                let id = myUtil.getObjectChainValue(match, 'id');
                if (id && id === profileId) {
                    count++;
                }
            }

            return count > 3;
        } catch (error) {
            throw new Error(`Error-myfacebook-0002: ${error.message}`);
        }
    }

    /**
     * 从页面代码里找出帖文数据
     * @param {*} pageUrl 
     * @param {*} pageContent 
     * @param {*} findType 搜索字段的类型，full: 全部字段，simple: 简单字段
     * @returns 
     */
    /* 
    注意：这 pageContent 是在小组时间线页面内容，其它页面的帖文没测试
    */
    /* 
    example:
    
    let pageContent = await myFile.readFile(`${__dirname}/../file1.html`);

    let essaysData = await myFacebook.findEssaysData(pageUrl, pageContent, 'full');
    */
    static async findEssaysData(pageUrl, pageContent, findType = 'full') {
        // const self = this;

        try {
            // pageContent 内容可以是页面的代码，也可以是 /api/graphql
            let _setPageContent = async (content) => {
                if (!content.match(/<script[^<>]*?>/i)) {
                    let lines = content.split('\n').filter(value => value.length > 1000);
                    lines = lines.map(str => {
                        if (!str.match(/<script[^<>]*?>/i)) {
                            return `<script type="application/json">${str}</script>`;
                        }
                        return str;
                    });
                    content = lines.join('\n\n');
                }
                return content;
            }

            let _getActor = async (actors2) => {
                actors2 = actors2.flat();

                let obj = {};
                for (let actor of actors2) {
                    if (actor && typeof actor === 'object') {
                        obj = { ...obj, ...actor };
                    }
                }

                // obj: {
                //     name: actor2.name,
                //     id: actor2.id,
                //     url: actor2.url,
                // },

                return obj;
            }

            let _getGroupId = async (groups2, essayLink) => {
                let obj = {};
                for (let item of groups2) {
                    if (item && typeof item === 'object') {
                        obj = { ...obj, ...item };
                    }
                }
                let groupId = obj.id || null;
                return groupId ? groupId : myUtil.getGroupIdFromLink(essayLink);
            }

            let _getImageText = async (imageTexts2) => {
                imageTexts2 = myUtil.arrayUnique(imageTexts2);

                // "May be an image of text"
                // "May be an image of text that says 'in TONIGHT'S PRAYER Lord, ...Jesus Name, Amen!'"

                imageTexts2 = imageTexts2.filter(text => {
                    if (text === 'May be an image of text') {
                        return false;
                    }
                    return true;
                });

                imageTexts2 = imageTexts2.map(text => {
                    text = String(text).trim();
                    text = text.replace(/^May be an image of text that says '(.+)'$/i, '$1');
                    return text;
                });

                return imageTexts2.length ? imageTexts2[0] : null;
            }

            // 获取 attachments
            let _getAttachmentUrls = async (attachments2) => {
                attachments2 = attachments2.flat();

                let photos = [];
                if (attachments2 && Array.isArray(attachments2)) {
                    for (let attachment of attachments2) {
                        let photos2 = [];

                        photos2 = await myJson.findNodeDatasInJsonDatas(attachment, 'photo_image');
                        photos = photos.concat(photos2);

                        photos2 = await myJson.findNodeDatasInJsonDatas(attachment, 'large_share_image');
                        photos = photos.concat(photos2);

                        // 一个帖文有多张图片
                        photos2 = await myJson.findNodeDatasInJsonDatas(attachment, 'image');
                        photos = photos.concat(photos2);
                    }
                }

                photos = photos.filter(item => {
                    if (item && typeof item === 'object' && item.hasOwnProperty('uri')) {
                        return true;
                    }
                    return false;
                });

                let attachmentUrls = photos.map(item => item.uri);
                attachmentUrls = myUtil.arrayUnique(attachmentUrls);

                // 去重
                let _temp = new Set();
                attachmentUrls = attachmentUrls.filter(url => {
                    let imageId = myUtil.getAttachmentIdFromLink(url);

                    // 使用 url 不能解析时不致于影响数据
                    imageId = imageId ? imageId : url;

                    if (!_temp.has(imageId)) {
                        _temp.add(imageId);
                        return true;
                    }
                    return false;
                });

                return attachmentUrls;
            }

            // 获取点赞量
            let _getCountLike = async (feedbacks2) => {
                feedbacks2 = feedbacks2.flat();

                let items = [];
                if (feedbacks2 && Array.isArray(feedbacks2)) {
                    for (let feedback of feedbacks2) {
                        let items2 = await myJson.findNodeDatasInJsonDatas(feedback, 'reaction_count');
                        items = items.concat(items2);
                    }
                }

                items = items.filter(item => item && item.hasOwnProperty('count'));
                let counts = items.map(item => item.count);
                return counts.length ? Math.max(...counts) : 0;
            }

            // 获取留言量
            let _getCountComment = async (feedbacks2) => {
                feedbacks2 = feedbacks2.flat();

                let items = [];
                if (feedbacks2 && Array.isArray(feedbacks2)) {
                    for (let feedback of feedbacks2) {
                        let items2 = await myJson.findNodeDatasInJsonDatas(feedback, 'comments');
                        items = items.concat(items2);
                    }
                }

                items = items.filter(item => item && item.hasOwnProperty('total_count'));
                let counts = items.map(item => item.total_count);
                return counts.length ? Math.max(...counts) : 0;
            }

            // 分享量
            let _getCountShare = async (feedbacks2) => {
                feedbacks2 = feedbacks2.flat();

                let items = [];
                if (feedbacks2 && Array.isArray(feedbacks2)) {
                    for (let feedback of feedbacks2) {
                        let items2 = await myJson.findNodeDatasInJsonDatas(feedback, 'share_count');
                        items = items.concat(items2);
                    }
                }

                items = items.filter(item => item && item.hasOwnProperty('count'));
                let counts = items.map(item => item.count);
                return counts.length ? Math.max(...counts) : 0;
            }

            pageContent = await _setPageContent(pageContent);

            let nodeName = 'story';
            let stories = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

            let ids = stories.map(item => item.id);
            ids = myUtil.arrayUnique(ids);

            let data = [];
            for (let id of ids) {
                let object = {};
                let actors2 = [];
                let attachments2 = [];
                let feedbacks2 = [];
                let groups2 = [];
                let imageTexts2 = [];

                let stories2 = stories.filter(story => story.id === id);
                while (stories2.length) {
                    let story = stories2.pop();

                    let actors = await myJson.findNodeDatasInJsonDatas(story, 'actors');
                    actors2 = actors2.concat(actors);

                    let attachments = await myJson.findNodeDatasInJsonDatas(story, 'attachments');
                    attachments2 = attachments2.concat(attachments);

                    let feedbacks = await myJson.findNodeDatasInJsonDatas(story, 'feedback');
                    feedbacks2 = feedbacks2.concat(feedbacks);

                    let group = await myJson.findNodeDatasInJsonDatas(story, 'group');
                    groups2 = groups2.concat(group);

                    let target_group = await myJson.findNodeDatasInJsonDatas(story, 'target_group');
                    groups2 = groups2.concat(target_group);

                    let imageText = await myJson.findNodeDatasInJsonDatas(story, 'accessibility_caption');
                    imageTexts2 = imageTexts2.concat(imageText);


                    object = { ...object, ...story };
                }
                object = { ...object, ...{ actors2 } };
                object = { ...object, ...{ attachments2 } };
                object = { ...object, ...{ feedbacks2 } };
                object = { ...object, ...{ groups2 } };
                object = { ...object, ...{ imageTexts2 } };

                data.push(object);
            }

            let data2 = [];
            for (let story of data) {
                let { url, post_id, creation_time, message, actors2, attachments2, feedbacks2, groups2, imageTexts2 } = story;

                // 在 my_pending_content 页面，获取不到 essayId
                if (!post_id && url) {
                    post_id = myUtil.getEssayIdFromLink(url);
                }

                // let params = { url, post_id, creation_time, message, attachments2, actor2, groups2, imageTexts2 };
                // console.log(`params = `, params);

                if (!(url && post_id && creation_time && actors2 && attachments2 && groups2 && imageTexts2)) {
                    continue;
                }

                url = url.replace(/\/permalink\//i, '/posts/');

                // let item = {
                //     essayLink: myUtil.pureLink(url),
                //     essayId: post_id,
                //     createTimestamp: creation_time,
                //     groupId: await _getGroupId(groups2, url),
                //     actorId: actor.id || null,
                //     actorName: actor.name || null,
                //     messageText: message && message.text || null,
                //     imageText: await _getImageText(imageTexts2),
                //     attachmentUrls: await _getAttachmentUrls(attachments2),
                //     countLike: await _getCountLike(feedbacks2),
                //     countComment: await _getCountComment(feedbacks2),
                //     countShare: await _getCountShare(feedbacks2),
                // };

                // simple: 简单字段
                let item = {
                    essayLink: myUtil.pureLink(url),
                    essayId: post_id,
                    createTimestamp: creation_time,
                };

                // findType 搜索字段的类型，full: 全部字段，simple: 简单字段
                if (findType === 'full') {
                    let actor = await _getActor(actors2);

                    let item2 = {
                        groupId: await _getGroupId(groups2, url),
                        actorId: actor.id || null,
                        actorName: actor.name || null,
                        messageText: message && message.text || null,
                        imageText: await _getImageText(imageTexts2),
                        attachmentUrls: await _getAttachmentUrls(attachments2),
                        countLike: await _getCountLike(feedbacks2),
                        countComment: await _getCountComment(feedbacks2),
                        countShare: await _getCountShare(feedbacks2),
                    };

                    item = { ...item, ...item2 };
                }

                data2.push(item);
            }

            return data2;
        } catch (error) {
            // let groupId = myUtil.getGroupIdFromLink(pageUrl);

            // await myDevTool.logInFile(`04-06-1 pageContent-${groupId}.txt`, pageContent);

            throw new Error(`Error-myfacebook-0003: ${error.message}`);
        }
    }

    /**
    * 从页面代码里找出贡献者数据
    * @param {*} pageContent 
    */
    /* 
    let pageUrl = page.url();
    let contributorsData = await myFacebook.findContributorsData(pageUrl, responseText);

    // output
    let data = [
        {
            essayLink: 'https://www.facebook.com/groups/1370793533396019/posts/1888503341625033',
            essayId: '1888503341625033',
            createTimestamp: 1721921678,
            actorId: '100095363315530',
            actorName: 'Faithful Journey'
        }
    */
    static async findContributorsData(pageUrl, pageContent) {
        // const self = this;

        try {
            // pageContent 内容可以是页面的代码，也可以是 /api/graphql
            let _setPageContent = async (content) => {
                if (!content.match(/<script[^<>]*?>/i)) {
                    let lines = content.split('\n').filter(value => value.length > 1000);
                    lines = lines.map(str => {
                        if (!str.match(/<script[^<>]*?>/i)) {
                            return `<script type="application/json">${str}</script>`;
                        }
                        return str;
                    });
                    content = lines.join('\n\n');
                }
                return content;
            }

            // let _isTopContributor2 = async (story) => {
            //     // let metadata = myUtil.getObjectChainValue(story, 'comet_sections', 'metadata');

            //     let signals = await myJson.findNodeDatasInJsonDatas(story, 'displayed_user_signals');
            //     signals = signals.flat();

            //     for (let signal of signals) {
            //         let text = myUtil.getObjectChainValue(signal, 'title', 'text');
            //         if (text === 'Top contributor') {
            //             return true;
            //         }
            //     }

            //     return false;
            // }

            let _isTopContributor = async (metadata) => {
                if (Array.isArray(metadata) && metadata.length) {
                    for (let meta of metadata) {
                        let signals = await myJson.findNodeDatasInJsonDatas(meta, 'displayed_user_signals');
                        signals = signals.flat();

                        for (let signal of signals) {
                            let text = myUtil.getObjectChainValue(signal, 'title', 'text');
                            if (text === 'Top contributor') {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }

            // story 下还有 story，还有 story
            let _filterStories = async (stories) => {
                let stories2 = [];

                for (let story of stories) {
                    let id = myUtil.getObjectChainValue(story, 'id');
                    let can_viewer_see_menu = myUtil.getObjectChainValue(story, 'can_viewer_see_menu');
                    let metadata = myUtil.getObjectChainValue(story, 'comet_sections', 'metadata');
                    let encrypted_tracking = myUtil.getObjectChainValue(story, 'encrypted_tracking');

                    if (!(id && can_viewer_see_menu && metadata && encrypted_tracking)) {
                        continue;
                    }

                    let isTopContributor = await _isTopContributor(metadata);
                    if (!isTopContributor) {
                        continue;
                    }

                    stories2.push(story);
                }

                return stories2;
            }

            let _getActor = async (actors2) => {
                actors2 = actors2.flat();

                let obj = {};
                for (let actor of actors2) {
                    if (actor && typeof actor === 'object') {
                        obj = { ...obj, ...actor };
                    }
                }

                // obj: {
                //     name: actor2.name,
                //     id: actor2.id,
                //     url: actor2.url,
                // },

                return obj;
            }

            pageContent = await _setPageContent(pageContent);

            let nodeName = 'story';
            let stories = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

            // 找出 Top contributor
            stories = await _filterStories(stories);

            let ids = stories.map(item => item.id);
            ids = myUtil.arrayUnique(ids);

            let data = [];
            for (let id of ids) {
                // 处理多层都是 story 的情况
                let _stories = [];

                let stories2 = stories.filter(story => story.id === id);
                while (stories2.length) {
                    let story = stories2.pop();

                    let stories3 = await myJson.findNodeDatasInJsonDatas(story, 'story');
                    _stories = _stories.concat(stories3);
                }

                let object = {};
                let actors2 = [];

                while (_stories.length) {
                    let story = _stories.pop();

                    let actors = await myJson.findNodeDatasInJsonDatas(story, 'actors');
                    actors2 = actors2.concat(actors);

                    object = { ...object, ...story };
                }
                object = { ...object, ...{ actors2 } };

                data.push(object);
            }

            let data2 = [];
            for (let story of data) {
                let { url, post_id, creation_time, actors2 } = story;

                // 在 my_pending_content 页面，获取不到 essayId
                if (!post_id && url) {
                    post_id = myUtil.getEssayIdFromLink(url);
                }

                if (!(url && post_id && creation_time)) {
                    continue;
                }

                let actor = await _getActor(actors2);

                url = url.replace(/\/permalink\//i, '/posts/');

                let item = {
                    essayLink: myUtil.pureLink(url),
                    essayId: post_id,
                    createTimestamp: creation_time,
                    actorId: actor.id || null,
                    actorName: actor.name || null,
                };

                data2.push(item);
            }

            return data2;
        } catch (error) {
            // let groupId = myUtil.getGroupIdFromLink(pageUrl);

            // await myDevTool.logInFile(`04-06-1 pageContent-${groupId}.txt`, pageContent);

            throw new Error(`Error-myfacebook-0004: ${error.message}`);
        }
    }

    /**
    * 从搜索页面代码里找出小组数据
    * @param {*} pageContent 
    */
    /* 
    https://www.facebook.com/search/groups?q=${phrase}

    https://www.facebook.com/search/groups?q=God&filters=eyJwdWJsaWNfZ3JvdXBzOjAiOiJ7XCJuYW1lXCI6XCJwdWJsaWNfZ3JvdXBzXCIsXCJhcmdzXCI6XCJcIn0ifQ%3D%3D
    */
    /* 
    example:
    
    let pageContent = await myFile.readFile(`${__dirname}/../file1.html`);

    let searchData = await myFacebook.findSearchData(pageContent);
    */
    static async findSearchData(pageContent) {
        // const self = this;

        try {
            // pageContent 内容可以是页面的代码，也可以是 /api/graphql
            let _setPageContent = async (content) => {
                if (!content.match(/<script[^<>]*?>/i)) {
                    let lines = content.split('\n').filter(value => value.length > 1000);
                    lines = lines.map(str => {
                        if (!str.match(/<script[^<>]*?>/i)) {
                            return `<script type="application/json">${str}</script>`;
                        }
                        return str;
                    });
                    content = lines.join('\n\n');
                }
                return content;
            }

            // let _getClusterId = async (cluster) => {
            //     let id1 = myUtil.getObjectChainValue(cluster, 'view_model', 'profile', 'id');
            //     let id2 = myUtil.getObjectChainValue(cluster, 'view_model', 'loggedProfile', 'id');
            //     let id3 = myUtil.getObjectChainValue(cluster, 'view_model', 'logging_model', 'tapped_result_id');
            //     return id1 || id2 || id3;
            // }

            let _getGroupLink = async (cluster) => {
                let link1 = myUtil.getObjectChainValue(cluster, 'view_model', 'profile', 'url');
                let link2 = myUtil.getObjectChainValue(cluster, 'view_model', 'loggedProfile', 'url');
                return link1 || link2;
            }

            let _getGroupName = async (cluster) => {
                let link1 = myUtil.getObjectChainValue(cluster, 'view_model', 'profile', 'name');
                let link2 = myUtil.getObjectChainValue(cluster, 'view_model', 'loggedProfile', 'name');
                return link1 || link2;
            }

            let _getCountGroupMember = async (cluster) => {
                let text = myUtil.getObjectChainValue(cluster, 'view_model', 'primary_snippet_text_with_entities', 'text');

                if (!text) {
                    return '';
                }

                // Public · 1 member · 5 posts a day
                // Public \u00b7 2.9K members \u00b7 8 posts a day
                let matches = text.match(/\s+([^\s]+)\s+(member|members)/i);
                if (matches) {
                    // 2.9K
                    return myUtil.parseFBLikeNumber(matches[1]);
                }
                return text;
            }

            // 公开 / 非公开
            let _getGroupPrivacy = async (cluster) => {
                let text = myUtil.getObjectChainValue(cluster, 'view_model', 'primary_snippet_text_with_entities', 'text');

                if (!text) {
                    return '';
                }

                // Public \u00b7 2.9K members \u00b7 8 posts a day
                if (text.match(/Public/i)) {
                    return '公开';
                }
                return '非公开';
            }

            let _getCountPostToday = async (cluster) => {
                let text = myUtil.getObjectChainValue(cluster, 'view_model', 'primary_snippet_text_with_entities', 'text');

                if (!text) {
                    return '';
                }

                // Public \u00b7 46K members \u00b7 10+ posts a day
                let matches = text.match(/(\d+\+?) posts a day/i);
                if (matches) {
                    // 10+
                    let value = matches[1];
                    if (value.includes('+')) {
                        value = value.replace('+', '');
                        return parseInt(value) + 5;
                    }
                    return parseInt(value);
                }
                return '';
            }

            let _getCountPostMonth = async (cluster) => {
                let text = myUtil.getObjectChainValue(cluster, 'view_model', 'primary_snippet_text_with_entities', 'text');

                if (!text) {
                    return '';
                }

                // Public \u00b7 7.7K members \u00b7 8 posts a month
                let matches = text.match(/(\d+\+?) posts a month/i);
                if (matches) {
                    // 10+
                    let value = matches[1];
                    if (value.includes('+')) {
                        value = value.replace('+', '');
                        return parseInt(value) + 5;
                    }
                    return parseInt(value);
                }
                return '';
            }

            let _getCountPostYear = async (cluster) => {
                let text = myUtil.getObjectChainValue(cluster, 'view_model', 'primary_snippet_text_with_entities', 'text');

                if (!text) {
                    return '';
                }

                // Public \u00b7 136 members \u00b7 4 posts a year
                let matches = text.match(/(\d+\+?) posts a year/i);
                if (matches) {
                    // 10+
                    let value = matches[1];
                    if (value.includes('+')) {
                        value = value.replace('+', '');
                        return parseInt(value) + 5;
                    }
                    return parseInt(value);
                }
                return '';
            }

            let _getClusters = async (pageContent2) => {
                // relay_rendering_strategy 2025-01-14 没有这个节点了，找到另一个相似的节点 rendering_strategy
                if (1) {
                    let nodeName = 'rendering_strategy';
                    let data = await myJson.findNodeDatasInPageContent2(pageContent2, nodeName);
                    if (data.length) {
                        return data;
                    }
                }

                if (1) {
                    let nodeName = 'relay_rendering_strategy';
                    let data = await myJson.findNodeDatasInPageContent2(pageContent2, nodeName);
                    if (data.length) {
                        return data;
                    }
                }

                return [];
            }

            pageContent = await _setPageContent(pageContent);

            let clusters = await _getClusters(pageContent);

            let data = [];
            for (let cluster of clusters) {
                let groupName = await _getGroupName(cluster);
                let groupLink = await _getGroupLink(cluster);
                let groupId = myUtil.getGroupIdFromLink(groupLink);
                let countGroupMember = await _getCountGroupMember(cluster);
                let groupPrivacy = await _getGroupPrivacy(cluster);
                let countPostToday = await _getCountPostToday(cluster);
                let countPostMonth = await _getCountPostMonth(cluster);
                let countPostYear = await _getCountPostYear(cluster);

                if (groupName && groupLink) {
                    data.push({ groupName, groupLink, groupId, countGroupMember, groupPrivacy, countPostToday, countPostMonth, countPostYear });
                }
            }

            return data;
        } catch (error) {
            // await myDevTool.logInFile(`07-13-1 pageContent-search.txt`, pageContent);

            throw new Error(`Error-myfacebook-0005: ${error.message}`);
        }
    }

    /**
     * 获取非登陆状态下的小组信息
     * @param {*} pageContent 
     * @returns 
     */
    static async findNotLoggedGroupData(pageContent) {
        const self = this;

        try {
            // pageContent 内容可以是页面的代码，也可以是 /api/graphql
            let _setPageContent = async (content) => {
                if (!content.match(/<script[^<>]*?>/i)) {
                    let lines = content.split('\n').filter(value => value.length > 1000);
                    lines = lines.map(str => {
                        if (!str.match(/<script[^<>]*?>/i)) {
                            return `<script type="application/json">${str}</script>`;
                        }
                        return str;
                    });
                    content = lines.join('\n\n');
                }
                return content;
            }

            // let _getClusterId = async (cluster) => {
            //     let id1 = myUtil.getObjectChainValue(cluster, 'view_model', 'profile', 'id');
            //     let id2 = myUtil.getObjectChainValue(cluster, 'view_model', 'loggedProfile', 'id');
            //     let id3 = myUtil.getObjectChainValue(cluster, 'view_model', 'logging_model', 'tapped_result_id');
            //     return id1 || id2 || id3;
            // }

            let _getGroupLink1 = async (clusters) => {
                let _value = (cluster) => {
                    let _text1 = () => {
                        return myUtil.getObjectChainValue(cluster, 'url');
                    }

                    let _text2 = () => {
                        return myUtil.getObjectChainValue(cluster, 'join_action', 'group', 'url');
                    }

                    let _text3 = () => {
                        return myUtil.getObjectChainValue(cluster, 'profile_header_renderer', 'group', 'url');
                    }

                    let _text4 = () => {
                        return myUtil.getObjectChainValue(cluster, 'profile_header_renderer', 'group', 'join_action', 'group', 'url');
                    }

                    return _text1() || _text2() || _text3() || _text4();
                }

                for (let cluster of clusters) {
                    let value = _value(cluster);
                    if (value) {
                        return value;
                    }
                }
                return null;
            }

            let _getGroupName1 = async (clusters) => {
                let _value = (cluster) => {
                    let _text1 = () => {
                        return myUtil.getObjectChainValue(cluster, 'name');
                    }

                    let _text2 = () => {
                        return myUtil.getObjectChainValue(cluster, 'join_action', 'group', 'name');
                    }

                    let _text3 = () => {
                        return myUtil.getObjectChainValue(cluster, 'featurable_title', 'text');
                    }

                    let _text4 = () => {
                        return myUtil.getObjectChainValue(cluster, 'profile_header_renderer', 'group', 'name');
                    }

                    let _text5 = () => {
                        return myUtil.getObjectChainValue(cluster, 'profile_header_renderer', 'group', 'featurable_title', 'text');
                    }

                    let _text6 = () => {
                        return myUtil.getObjectChainValue(cluster, 'profile_header_renderer', 'group', 'join_action', 'group', 'name');
                    }

                    return _text1() || _text2() || _text3() || _text4() || _text5() || _text6();
                }

                for (let cluster of clusters) {
                    let value = _value(cluster);
                    if (value) {
                        return value;
                    }
                }
                return null;
            }

            let _getGroupName2 = async (clusters) => {
                let _value = (cluster) => {
                    let _text1 = () => {
                        return myUtil.getObjectChainValue(cluster, 'route', 'rootView', 'props', 'entity_name');
                    }

                    return _text1();
                }

                for (let cluster of clusters) {
                    let value = _value(cluster);
                    if (value) {
                        return value;
                    }
                }
                return null;
            }

            let _getGroupLink2 = async (clusters) => {
                let _value = (cluster) => {
                    let _text1 = () => {
                        // "url": "\/groups\/681206320814301\/search\/?q=God",
                        let url = myUtil.getObjectChainValue(cluster, 'route', 'url');

                        if (url && url.match(/^\/groups\//i)) {
                            url = url.replace(/\/search\/\?q=.*$/, '/');
                            return `https://www.facebook.com${url}`;
                        }

                        return url;
                    }

                    return _text1();
                }

                for (let cluster of clusters) {
                    let value = _value(cluster);
                    if (value) {
                        return value;
                    }
                }
                return null;
            }

            let _getCountGroupMember = async (clusters) => {
                let _value = (cluster) => {
                    let text = myUtil.getObjectChainValue(cluster, 'if_viewer_can_see_activity_section', 'group_total_members_info_text');

                    if (!text) {
                        return '';
                    }

                    // 3,066 total members
                    text = text.replace(/total\s+/ig, '');
                    text = text.replace(/,/ig, '');

                    // 成员总数：54895 人 => 54895
                    text = text.replace(/^.*?(\d+).*?$/, '$1 members');

                    // Public · 1 member · 5 posts a day
                    // Public \u00b7 2.9K members \u00b7 8 posts a day
                    let matches = text.match(/(?:\s+)?([^\s]+)\s+(member|members)/i);
                    if (matches) {
                        // 2.9K
                        return myUtil.parseFBLikeNumber(matches[1]);
                    }

                    return text;
                }

                for (let cluster of clusters) {
                    let value = _value(cluster);
                    if (value) {
                        return value;
                    }
                }
                return null;
            }

            // 公开 / 非公开
            let _getGroupPrivacy1 = async (clusters) => {
                let _value = (cluster) => {
                    // let text = myUtil.getObjectChainValue(cluster, 'view_model', 'primary_snippet_text_with_entities', 'text');

                    let _text1 = () => {
                        return myUtil.getObjectChainValue(cluster, 'privacy_info', 'title', 'text');
                    }

                    let _text2 = () => {
                        return myUtil.getObjectChainValue(cluster, 'profile_header_renderer', 'group', 'privacy_info', 'title', 'text');
                    }

                    let text = _text1() || _text2();

                    if (!text) {
                        return '';
                    }

                    // Public \u00b7 2.9K members \u00b7 8 posts a day
                    if (text.match(/(Public|公开|公開)/i)) {
                        return '公开';
                    }
                    return '非公开';
                }

                for (let cluster of clusters) {
                    let value = _value(cluster);
                    if (value) {
                        return value;
                    }
                }
                return null;
            }

            let _getGroupPrivacy2 = async (groupLink) => {
                // "url": "\/groups\/681206320814301\/search\/?q=God",

                // 说明：这里就简单处理，英文使用这个功能都是手动的，都是公开的小组才会去看
                if (groupLink && groupLink.match(/\/search\//i)) {
                    return '公开';
                }
                return '非公开';
            }

            let _getCountPostToday = async (clusters) => {
                let _value = (cluster) => {
                    let _text1 = () => {
                        return myUtil.getObjectChainValue(cluster, 'if_viewer_can_see_activity_section', 'number_of_posts_in_last_day');
                    }

                    return _text1();
                }

                for (let cluster of clusters) {
                    let value = _value(cluster);
                    if (value) {
                        return value;
                    }
                }
                return null;
            }

            let _getCountPostMonth = async (clusters) => {
                let _value = (cluster) => {
                    let _text1 = () => {
                        return myUtil.getObjectChainValue(cluster, 'if_viewer_can_see_activity_section', 'number_of_posts_in_last_month');
                    }

                    return _text1();
                }

                for (let cluster of clusters) {
                    let value = _value(cluster);
                    if (value) {
                        return value;
                    }
                }
                return null;
            }

            let _getCountPostYear = async (clusters) => {
                return null;
            }

            let _getClusters1 = async (pageContent2) => {
                let nodeName = 'group';
                let data = await myJson.findNodeDatasInPageContent2(pageContent2, nodeName);
                if (data.length) {
                    return data;
                }
                return [];
            }

            let _getClusters2 = async (pageContent2) => {
                let nodeName = 'initialRouteInfo';
                let data = await myJson.findNodeDatasInPageContent2(pageContent2, nodeName);
                if (data.length) {
                    return data;
                }
                return [];
            }

            pageContent = await _setPageContent(pageContent);

            let clusters1 = await _getClusters1(pageContent);
            let clusters2 = await _getClusters2(pageContent);

            let groupName1 = await _getGroupName1(clusters1);
            let groupLink1 = await _getGroupLink1(clusters1);

            let groupName2 = await _getGroupName2(clusters2);
            let groupLink2 = await _getGroupLink2(clusters2);

            let groupName = groupName1 || groupName2;
            let groupLink = groupLink1 || groupLink2;

            if (!(groupName && groupLink)) {
                return null;
            }

            // let groupId = myUtil.getGroupIdFromLink(groupLink);
            let groupId = await self.getGroupIdBySlug(pageContent, groupLink);
            let countGroupMember = await _getCountGroupMember(clusters1);
            let groupPrivacy = await _getGroupPrivacy1(clusters1) || await _getGroupPrivacy2(groupLink);
            let countPostToday = await _getCountPostToday(clusters1);
            let countPostMonth = await _getCountPostMonth(clusters1);
            let countPostYear = await _getCountPostYear(clusters1);
            let groupLocation = await self.getGroupLocation(pageContent);
            let creationDate = await self.getCreationDate(pageContent);

            /* 
            result =  {
                groupName: 'Covenant with God',
                groupLink: 'https://www.facebook.com/groups/166644673199919/',
                groupId: '166644673199919',
                countGroupMember: 3067,
                groupPrivacy: '公开',
                countPostToday: 6,
                countPostMonth: 170,
                countPostYear: null,
                groupLocation: 'United States, Canada'
            }
            */
            return { groupName, groupLink, groupId, countGroupMember, groupPrivacy, countPostToday, countPostMonth, countPostYear, groupLocation, creationDate };
        } catch (error) {
            // await myDevTool.logInFile(`07-13-1 pageContent-search.txt`, pageContent);

            throw new Error(`Error-myfacebook-0005: ${error.message}`);
        }
    }

    /**
     * 获取小组是否是 私密状态
     * @param {*} pageContent 
     * @returns 
     */
    /* 
    let privacy = await myFacebook.getGroupPrivacy(pageContent, groupLink);
    */
    static async getGroupPrivacy(pageContent, groupLink) {
        try {
            let _getPrivacy1 = async () => {
                let nodeName = 'privacy_info';
                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

                let values = [];
                for (let match of matches) {
                    if (match && match.hasOwnProperty('label')) {
                        let { label } = match;
                        if (label && label.hasOwnProperty('text')) {
                            let value = label.text;
                            if (value) {
                                values.push(value);
                            }
                        }
                    }
                }
                return values.length ? values[0] : null;
            }

            let _getPrivacy2 = async () => {
                /* 
                "privacy_scope": {
                    "icon_image": {
                        "name": "everyone"
                    },
                    "description": "Public"
                },
                */

                let nodeName = 'privacy_scope';
                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);
                let values = [];
                for (let match of matches) {
                    if (match && match.hasOwnProperty('description')) {
                        let value = match.description;
                        if (value) {
                            values.push(value);
                        }
                    }
                }
                return values.length ? values[0] : null;
            }

            // 只有登陆后才显示的菜单栏目
            // let _checkHasNavItem = async () => {
            //     // let selector = `xpath/.//div[@role="tablist"]//a[@role="tab" and (contains(@href, "/members") or contains(@href, "/events") or contains(@href, "/announcements"))]`;
            //     // return await mySnippet11Util.getElement(selector, 3);
            //     if (
            //         pageContent.includes('role="tablist"') &&
            //         pageContent.includes('role="tab"') &&
            //         (
            //             pageContent.includes('/members') ||
            //             pageContent.includes('/events') ||
            //             pageContent.includes('/announcements') ||
            //             pageContent.includes('/media')
            //         )
            //     ) {
            //         return true;
            //     }
            //     return false;
            // }

            let privacy = await _getPrivacy1() || await _getPrivacy2() || null;

            // let hasNavItem = await _checkHasNavItem();
            // let result = privacy === 'Public' && hasNavItem ? '公开' : '非公开';

            // Public group
            let result = privacy && String(privacy).match(/Public/i) ? '公开' : '非公开';

            // if (result === '非公开') {
            //     let fileName = myUtil.getGroupIdFromLink(groupLink);
            //     await myDevTool.logInFile(`privacy pageContent-${fileName}.txt`, pageContent);
            // }

            return result;
        } catch (error) {
            throw new Error(`Error-myfacebook-0006: ${error.message}`);
        }
    }

    /**
     * 获取 title
     * @param {*} pageContent 
     * @returns 
     */
    /* 
    let pageContent = await page.content();
    let groupName = await myFacebook.getTitle(pageContent);
    */
    static async getTitle(pageContent) {
        try {
            if (!pageContent) {
                return '没有内容';
            }

            let _getTitle1 = async () => {
                // <title>(20+) Block Rosary Crusade Int'l | Facebook</title>
                let title = null;
                let matches = pageContent.match(/<title[^>]*?>([^<>]*?)<\/title>/i);
                if (matches) {
                    title = matches[1];
                    title = myUtil.unescapeHTML(title);
                    title = title.replace(/\([^)]+\)/g, '');
                    title = title.replace(/\|?\s*?Facebook/i, '');
                    title = title.trim();
                }
                return title;
            }

            let _getTitle2 = async (nodeName) => {
                /* 
                "owning_profile": {
                    "id": "100079235700821"
                    "name": "A Touch Of Christ",
                }

                "delegate_page": {
                    "id": "107316371875448",
                    "name": "A Touch Of Christ",
                }

                "profile_owner": {
                    "id": "100079235700821",
                    "short_name": "A Touch Of Christ",
                    "contextual_message_request_state": "NO_REQUEST_NEEDED"
                },
                */

                let values = [];

                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);
                for (let match of matches) {
                    if (match && match.hasOwnProperty('id') && match.hasOwnProperty('name')) {
                        let { name } = match;
                        if (name) {
                            values.push(name);
                        }
                    }
                    else if (match && match.hasOwnProperty('id') && match.hasOwnProperty('short_name')) {
                        let { short_name } = match;
                        if (short_name) {
                            values.push(short_name);
                        }
                    }
                }

                return values.length ? values[0] : null;
            }

            let title = await _getTitle1() || await _getTitle2('owning_profile') || await _getTitle2('delegate_page') || await _getTitle2('profile_owner');

            return title ? title : '未获取';
        } catch (error) {
            throw new Error(`Error-myfacebook-0007: ${error.message}`);
        }
    }

    /**
    * 获取地址
    * @param {*} pageContent 
    */
    static async getGroupLocation(pageContent) {
        //  const self = this;

        try {
            let nodeName = 'group_locations';
            let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

            matches = myUtil.flat2(matches);
            /* 
            matches =  [
                { id: '112463092102121', name: 'United States' },
                { id: '107480665948163', name: 'Canada' }
            ]
            */

            // matches = matches.map(item => item[0]);

            let values = [];
            for (let match of matches) {
                if (match && match.hasOwnProperty('name')) {
                    let { name } = match;
                    if (name) {
                        values.push(name);
                    }
                }
            }

            // United States, Canada
            // return values.length ? values[0] : '未获取';
            return values.length ? values.join(', ') : '未获取';
        } catch (error) {
            throw new Error(`Error-myfacebook-0008: ${error.message}`);
        }
    }

    /**
    * 获取小组描述
    * @param {*} pageContent 
    */
    static async getGroupDescription(pageContent) {
        try {
            let _getDesc1 = async () => {
                let nodeName = 'comet_discussion_tab_cards';
                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

                // 避免数组多层嵌套
                let loop = 0;
                while (loop < 5 && Array.isArray(matches) && matches.length && Array.isArray(matches[0])) {
                    matches = matches.flat();
                    loop++;
                }

                let values = [];
                for (let match of matches) {
                    let text = myUtil.getObjectChainValue(match, 'group', 'description_with_entities', 'text');
                    if (text) {
                        values.push(text);
                    }
                }

                return values.length ? values[0] : '';
            }

            let _getDesc2 = async () => {
                let nodeName = 'group';
                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

                // 避免数组多层嵌套
                let loop = 0;
                while (loop < 5 && Array.isArray(matches) && matches.length && Array.isArray(matches[0])) {
                    matches = matches.flat();
                    loop++;
                }

                let values = [];
                for (let match of matches) {
                    let text = myUtil.getObjectChainValue(match, 'description_with_entities', 'text');
                    if (text) {
                        values.push(text);
                    }
                }

                return values.length ? values[0] : '';
            }

            return await _getDesc1() || await _getDesc2();
        } catch (error) {
            throw new Error(`Error-myfacebook-0009: ${error.message}`);
        }
    }

    /**
    * 获取小组创建日期
    * @param {*} pageContent 
    */
    static async getCreationDate(pageContent) {
        try {
            let _getTimestamp = async () => {
                let nodeName = 'group';
                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

                // 避免数组多层嵌套
                let loop = 0;
                while (loop < 5 && Array.isArray(matches) && matches.length && Array.isArray(matches[0])) {
                    matches = matches.flat();
                    loop++;
                }

                let values = [];
                for (let match of matches) {
                    let text = myUtil.getObjectChainValue(match, 'if_viewer_can_see_activity_section', 'created_time');
                    if (!text) {
                        text = myUtil.getObjectChainValue(match, 'group_history', 'create_time');
                    }
                    if (text) {
                        values.push(text);
                    }
                }

                return values.length ? values[0] : '';
            }

            let timestamp = await await _getTimestamp();
            if (timestamp) {
                return myUtil.convertTimestampToDatetime(timestamp, 'Y-m-d');
            }

            return '';
        } catch (error) {
            throw new Error(`Error-myfacebook-0009: ${error.message}`);
        }
    }

    /**
    * 从about页面代码里找出小组数据
    * @param {*} pageContent 
    */
    static async findGroupInfoInAbout(pageContent) {
        const self = this;

        try {
            let _getActivityInfo = async () => {
                /* 
                <span>9 new posts today</span>
                <span>692 in the last month</span>

                <span>3,617 total members</span>
                <span>+ 206 in the last week</span>
                */

                let _parseInt = (val) => {
                    return parseInt(val.replace(/,/g, ''));
                }

                let _getCount1 = () => {
                    let matches = pageContent.match(/>[^<>]*?([\d\,]+)\s*?(new posts today)\s*?<\/span>/i);
                    return matches ? _parseInt(matches[1]) : 'No';
                }

                let _getCount2 = () => {
                    let matches = pageContent.match(/>[^<>]*?([\d\,]+)\s*?(in the last month)\s*?<\/span>/i);
                    return matches ? _parseInt(matches[1]) : 'No';
                }

                let _getCount3 = () => {
                    let matches = pageContent.match(/>[^<>]*?([\d\,]+)\s*?(total members)\s*?<\/span>/i);
                    return matches ? _parseInt(matches[1]) : 'No';
                }

                let _getCount4 = () => {
                    let matches = pageContent.match(/>[^<>]*?([\d\,]+)\s*?(in the last week)\s*?<\/span>/i);
                    return matches ? _parseInt(matches[1]) : 'No';
                }

                // 整理数据
                // <span xxxxx>151<!-- --> new posts today</span>
                pageContent = pageContent.replace(/<!--\s*?-->/g, '');

                let count1 = _getCount1();
                let count2 = _getCount2();
                let count3 = _getCount3();
                let count4 = _getCount4();

                return {
                    countPostToday: count1,
                    countPostLastMonth: count2,
                    countGroupMember: count3,
                    countMemberLastWeek: count4,
                };
            }

            let groupName = await self.getTitle(pageContent);
            let groupLocation = await self.getGroupLocation(pageContent);
            let groupPrivacy = await self.getGroupPrivacy(pageContent, null);
            let groupDescription = await self.getGroupDescription(pageContent);
            let creationDate = await self.getCreationDate(pageContent);
            let activityInfo = await _getActivityInfo();

            // groupPrivacy = groupPrivacy === 'Public' ? '公开' : '非公开';

            let { countPostToday, countPostLastMonth, countGroupMember, countMemberLastWeek } = activityInfo;

            return { groupName, groupLocation, groupPrivacy, groupDescription, creationDate, countPostToday, countPostLastMonth, countGroupMember, countMemberLastWeek };
        } catch (error) {
            throw new Error(`Error-myfacebook-0010: ${error.message}`);
        }
    }

    /**
    * 获取 Admins & moderators
    * @param {*} pageContent 
    */
    static async getGroupAdminsModerators(pageContent) {
        try {
            if (String(pageContent).length < 1000) {
                return { countAdmin: 0, countModerator: 0 };
            }

            // 获取 Admins & moderators 数量
            let _getCountTotal = async () => {
                let nodeName = 'admin_and_moderator_profiles';
                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

                // matches = [ { count: 4 } ]

                // 按理，只有一个
                let match = matches.length ? matches[0] : null;

                let count = myUtil.getObjectChainValue(match, 'count');

                return count;
            }

            // 获取 Admins 数量
            let _getCountAdmin = async () => {
                let nodeName = 'group_admin_profiles';
                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

                // 按理，只有一个
                let match = matches.length ? matches[0] : null;

                let edges = myUtil.getObjectChainValue(match, 'edges');

                return Array.isArray(edges) ? edges.length : 0;
            }

            let total = await _getCountTotal();

            let countAdmin = await _getCountAdmin();
            let countModerator = total - countAdmin;

            // 避免 total 没有获取到值，而为负数
            countModerator = countModerator > 0 ? countModerator : 0;

            return { countAdmin, countModerator };
        } catch (error) {
            throw new Error(`Error-myfacebook-0011: ${error.message}`);
        }
    }


    /**
    * 在小组时间线获取小组人数（从时间线上获取，只能是大概，如 17.5K）
    * @param {*} pageContent 
    */
    static async getCountGroupMember(pageContent) {
        // const self = this;

        try {
            // 
            let nodeName = 'group';
            let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

            let obj = {};
            for (let match of matches) {
                if (match && typeof match === 'object' && match.hasOwnProperty('id') && match.hasOwnProperty('name')) {
                    obj = { ...obj, ...match };
                }
            }

            let counts = await myJson.findNodeDatasInJsonDatas(obj, 'formatted_count_text');

            counts = counts.map(value => myUtil.parseFBLikeNumber(value));

            return counts.length ? counts[0] : 0;
        } catch (error) {
            throw new Error(`Error-myfacebook-0012: ${error.message}`);
        }
    }

    /**
    * 从小组时间线页面代码里, 找出小组ID
    * @param {*} pageContent 
    * @param {*} groupLink 
    */
    /* 
    https://www.facebook.com/groups/brcintl => 223338737765935
    */
    /* 
    let groupLink = 'https://www.facebook.com/groups/brcintl';
    let groupId = await myFacebook.getGroupIdBySlug(pageContent, groupLink);
    */
    static async getGroupIdBySlug(pageContent, groupLink) {
        // const self = this;

        try {
            let groupId = myUtil.getGroupIdFromLink(groupLink);
            if (!groupId) {
                return null;
            }

            if (groupId.match(/^\d+$/)) {
                return groupId;
            }

            let groupSlug = String(groupId).trim();

            let nodeName = 'group';
            let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);
            for (let match of matches) {
                if (match && typeof match === 'object' && match.hasOwnProperty('id') && match.hasOwnProperty('group_address')) {
                    let { id, group_address } = match;
                    if (String(group_address).trim() === groupSlug) {
                        return id;
                    }
                }
            }

            return groupSlug;
        } catch (error) {
            throw new Error(`Error-myfacebook-0013: ${error.message}`);
        }
    }

    /**
    * 从小组时间线页面代码里, 找出小组slug
    * @param {*} pageContent 
    * @param {*} groupLink 
    */
    /* 
    https://www.facebook.com/groups/773848899294717 => SooniosOrchid
    */
    /* 
    let groupLink = 'https://www.facebook.com/groups/773848899294717';
    let groupId = await myFacebook.getGroupIdBySlug(pageContent, groupLink);
    */
    static async getGroupSlugById(pageContent, groupLink) {
        // const self = this;

        try {
            let groupId = myUtil.getGroupIdFromLink(groupLink);
            if (!groupId) {
                return null;
            }

            if (!groupId.match(/^\d+$/)) {
                return groupId;
            }

            let nodeName = 'group';
            let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);
            for (let match of matches) {
                if (match && typeof match === 'object' && match.hasOwnProperty('id') && match.hasOwnProperty('group_address')) {
                    let { id, group_address } = match;
                    if (String(id).trim() === groupId) {
                        return group_address;
                    }
                }
            }

            return groupId;
        } catch (error) {
            throw new Error(`Error-myfacebook-0013: ${error.message}`);
        }
    }

    /**
     * 从页面代码里找出账号信息
     * @param {*} pageContent 
     * @returns 
     */
    static async getAccountProfiles(pageContent) {
        // const self = this;

        try {
            // 找出一个合适的头像链接
            let _getAvatarUrl = (avatarId) => {
                let regexp = new RegExp(`https:\/\/[^"]+${avatarId}[^"]+`, 'g');
                let matches = pageContent.match(regexp);

                // jpg_s148x148
                if (matches) {
                    let data = matches.map(link => {
                        link = myUtil.unescapeHTML(link);

                        // dst-png_p80x80
                        // dst-jpg_p80x80
                        // dst-jpg_s320x320_tt6
                        // dst-jpg_s64x64_tt6

                        let matches2 = link.match(/dst-(jpg|jpeg|png)_([^-_&]+)/i);
                        let dst = matches2 ? matches2[2] : ''; // s148x148

                        let size = dst.match(/(\d+)/i);
                        let width = size ? parseInt(size[1]) : ''; // 148

                        return { width, link };
                    });

                    data = data.filter(item => {
                        let { width } = item;
                        return 60 <= width && width <= 250;
                    });

                    if (data.length) {
                        data.sort(function (a, b) {
                            let result = 0;

                            // DESC
                            result = parseInt(b.width) - parseInt(a.width);
                            if (result !== 0) {
                                return result;
                            }

                            return 0;
                        });

                        return data[0].link;
                    }
                }
                return null;
            }

            // 获取这个账号的所有账号和专页
            let _getProfilesNode = async (params) => {
                let { identities, profileId, profileName, profileRole, avatarId, profilePicture } = params;

                let nodeName = 'profile';
                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

                // 无论是账号身份，还是专页身份，accountId 都是账号ID
                let profileIds = identities.map(item => item.accountId);

                // 专页ID
                let pageIds = identities.map(item => item.actorId).filter(actorId => !profileIds.includes(actorId));

                let _getRole = (id2) => {
                    if (profileIds.includes(id2)) {
                        return 'PROFILE';
                    }
                    if (pageIds.includes(id2)) {
                        return 'PAGE';
                    }
                    // 如果不是账号本身，就是其它的专页ID
                    return 'PAGE';
                }

                let data = [];

                let item = {
                    profileId,
                    profileName,
                    profileRole,
                    profileAvatarId: avatarId,
                    profileAvatarUrl: profilePicture,
                }
                data.push(item);

                for (let match of matches) {
                    if (match && match.hasOwnProperty('id') && match.hasOwnProperty('name') && match.hasOwnProperty('quick_switch_picture')) {
                        let { id, name, quick_switch_picture } = match;

                        let item = {
                            profileId: id,
                            profileName: myUtil.textTrim(name),
                            profileRole: _getRole(id),
                            profileAvatarId: myUtil.getAttachmentIdFromLink(quick_switch_picture.uri || ''),
                            profileAvatarUrl: quick_switch_picture.uri || '',
                        }
                        data.push(item);
                    }
                }

                // 去掉重复
                let idsTemp = [];
                let data2 = [];

                for (let item of data) {
                    let { profileId } = item;

                    if (!idsTemp.includes(profileId)) {
                        idsTemp.push(profileId);
                        data2.push(item);
                    }
                }

                return data2;
            }

            let _getProfilesDetail = async () => {
                let nodeName = 'actor';
                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

                matches = matches.filter(item => {
                    if (!(item && item.hasOwnProperty('profile_type_name_for_content'))) {
                        return false;
                    }
                    return true;
                });

                return matches;
            }

            let _getIdentity = async () => {
                let nodeName = 'fbIdentity';
                let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

                // 去重复
                let temp = new Set();
                matches = matches.filter(item => {
                    let { actorId, accountId } = item;
                    let key = `${actorId}_${accountId}`;
                    if (temp.has(key)) {
                        return false;
                    }
                    temp.add(key);
                    return true;
                });

                /* 
               账号ID 100086099657084 
               专页ID 100090562390220

               // 专页身份打开的页面
               matches =  [
                   { actorId: '100090562390220', accountId: '100086099657084' },
               ]

               // 账号身份打开的页面
               matches =  [
                   { actorId: '100086099657084', accountId: '100086099657084' },
               ]

               // 找出账号ID，直接找出 accountId
               */

                return matches;
            }

            let profiles = await _getProfilesDetail();
            if (!profiles.length) {
                return null;
            }

            let identities = await _getIdentity();

            let profile = profiles[0];

            let profileId = profile['id'];
            let profileName = myUtil.textTrim(profile['name']);
            let profileRole = String(profile['profile_type_name_for_content']).toUpperCase(); // PROFILE / PAGE
            let profilePicture = profile['profile_picture'].uri;
            let avatarId = myUtil.getAttachmentIdFromLink(profilePicture);
            let avatarUrl = _getAvatarUrl(avatarId);

            let profilesNode = await _getProfilesNode({ identities, profileId, profileName, profileRole, avatarId, profilePicture });
            // let profilesNode = profile['profile_switcher_eligible_profiles'].nodes.map(node => node.profile.id);
            // [ '61559431306058', '61557607959775' ]

            return { profileId, profileName, profileRole, avatarId, avatarUrl, profilesNode };
        } catch (error) {
            throw new Error(`Error-myfacebook-0014: ${error.message}`);
        }
    }

    /**
    * 抓取页面文本
    * @param {*} pageContent 
    */
    /* 
    let contentTexts = await myFacebook.crawlContentTexts(pageContent);
    */
    static async crawlContentTexts(pageContent) {
        // const self = this;

        try {
            let matches = pageContent.matchAll(/<(?:div|h1|h2|h3|h4|span)[^>]*?>([^<]{3,})</g);

            let _temp = new Set();

            let texts = Array.from(matches)
                .map(match => match[1].trim())
                .map(text => myUtil.unescapeHTML(text))
                .filter(text => {
                    if (text.length < 3) {
                        return false;
                    }

                    if (_temp.has(text)) {
                        return false;
                    }

                    _temp.add(text);
                    return true;
                });

            return texts;
        } catch (error) {
            throw new Error(`Error-myfacebook-0015: ${error.message}`);
        }
    }

    // -----
    /**
    * 获取版主或管理员通帖的记录
    * @param {*} pageContent 
    */
    /* 
    example:

    let pageContent = await myFile.readFile(`${__dirname}/../file1.html`);

    let pageUrl = page.url();
    let contributorsData = await myFacebook.findGroupAdminActivityData(pageUrl, responseText);
    */
    static async findGroupAdminActivityData(pageUrl, pageContent) {
        // const self = this;

        try {
            // pageContent 内容可以是页面的代码，也可以是 /api/graphql
            let _setPageContent = async (content) => {
                if (!content.match(/<script[^<>]*?>/i)) {
                    let lines = content.split('\n').filter(value => value.length > 1000);
                    lines = lines.map(str => {
                        if (!str.match(/<script[^<>]*?>/i)) {
                            return `<script type="application/json">${str}</script>`;
                        }
                        return str;
                    });
                    content = lines.join('\n\n');
                }
                return content;
            }

            let _getActor = async (item, activityText) => {
                if (item) {
                    // let name = myUtil.getObjectChainValue(item, 'entity', 'short_name');
                    let id = myUtil.getObjectChainValue(item, 'entity', 'id');
                    let url = myUtil.getObjectChainValue(item, 'entity', 'url');

                    let offset = myUtil.getObjectChainValue(item, 'offset');
                    let length = myUtil.getObjectChainValue(item, 'length');

                    // 说明：short_name 可能只会取名，并不是完整的姓+名，所用使用这方法获取
                    let name = null;
                    if (offset !== null && length !== null) {
                        name = activityText.substring(offset, offset + length);
                    }

                    if (name && id && url) {
                        return { name, id, url };
                    }
                }
                return null;
            }

            let _getEssay = async (item) => {
                if (item) {
                    let url = myUtil.getObjectChainValue(item, 'entity', 'url');
                    let id = myUtil.getEssayIdFromLink(url);

                    if (id && url) {
                        return { id, url };
                    }
                }
                return null;
            }

            pageContent = await _setPageContent(pageContent);

            let nodeName = 'management_activities';
            let activities = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

            // 避免数组多层嵌套
            let loop = 0;
            while (loop < 5 && Array.isArray(activities) && activities.length && Array.isArray(activities[0])) {
                activities = activities.flat();
                loop++;
            }

            let data = [];
            for (let item of activities) {
                let edges = item.edges;
                for (let edge of edges) {
                    let activityText = myUtil.getObjectChainValue(edge, 'node', 'activity_title', 'text');

                    // Caitlin Kitson approved a pending post by Sunita Tamang.
                    if (!activityText.includes('approved a pending post')) {
                        continue;
                    }

                    let activityTime = myUtil.getObjectChainValue(edge, 'node', 'activity_time');

                    let activity_ranges = myUtil.getObjectChainValue(edge, 'node', 'activity_title', 'ranges');
                    let [_adminInfo, _essayInfo, _publisherInfo] = activity_ranges || [null, null, null];

                    let adminInfo = await _getActor(_adminInfo, activityText);
                    let essayInfo = await _getEssay(_essayInfo);
                    let publisherInfo = await _getActor(_publisherInfo, activityText);

                    // console.log(`activityText = `, activityText);
                    // console.log(`adminInfo = `, adminInfo);
                    // console.log(`essayInfo = `, essayInfo);
                    // console.log(`publisherInfo = `, publisherInfo);

                    if (adminInfo && essayInfo && publisherInfo) {
                        let adminName = adminInfo.name;
                        let adminId = adminInfo.id;
                        let adminUrl = adminInfo.url;

                        let publisherName = publisherInfo.name;
                        let publisherId = publisherInfo.id;
                        let publisherUrl = publisherInfo.url;

                        let essayId = essayInfo.id;
                        let essayLink = essayInfo.url;

                        data.push({ activityText, activityTime, adminName, adminId, adminUrl, publisherName, publisherId, publisherUrl, essayId, essayLink });
                    }
                }
            }

            /* 
            activityData =  [
                {
                    activityText: 'Caitlin Kitson approved a pending post by Sunita Tamang.',
                    activityTime: 1724285033,
                    adminName: 'Caitlin Kitson',
                    adminId: '61556306994484',
                    adminUrl: 'https://www.facebook.com/profile.php?id=61556306994484'
                    publisherName: 'Sunita',
                    publisherId: '100073115622582',
                    publisherUrl: 'https://www.facebook.com/profile.php?id=100073115622582'
                    essayId: '1601944313697763',
                    essayLink: 'https://www.facebook.com/groups/1457060861519443/posts/1601944313697763/'
                }
            
            ]
            */

            return data;
        } catch (error) {
            // let groupId = myUtil.getGroupIdFromLink(pageUrl);

            // await myDevTool.logInFile(`04-06-1 pageContent-${groupId}.txt`, pageContent);

            throw new Error(`Error-myfacebook-0016: ${error.message}`);
        }
    }

    /**
     * 获取专页的用户ID
     * @param {*} pageUrl 
     * @param {*} pageContent 
     * @returns 
     */
    static async getPageUserId(pageUrl, pageContent) {
        // const self = this;

        try {
            let nodeName = 'actors';
            let matches = await myJson.findNodeDatasInPageContent2(pageContent, nodeName);

            let _extractMatch = (match) => {
                // 当一个数组的子元素还是数组，就拉平一层
                if (match && Array.isArray(match) && Array.isArray(match[0])) {
                    match = match.flat();
                    return _extractMatch(match);
                }
                return match;
            }


            let data = [];

            for (let match of matches) {
                match = _extractMatch(match);
                data = data.concat(match);
            }

            pageUrl = myUtil.pureLink(pageUrl);

            let _temp = [];
            let data2 = [];

            for (let item of data) {
                let id = myUtil.getObjectChainValue(item, 'id');
                let url = myUtil.getObjectChainValue(item, 'url');
                url = myUtil.pureLink(url);

                if (id && url === pageUrl && !_temp.includes(id)) {
                    _temp.push(id);
                    data2.push({ id, url });
                }
            }

            if (data2.length) {
                return data2[0].id;
            }

            return null;
        } catch (error) {
            throw new Error(`Error-myfacebook-0017: ${error.message}`);
        }
    }


}