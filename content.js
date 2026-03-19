(async function () {

    await myElementA.createContainer();
    await myElementA.setNotice1('primary', '已加载');
    await myElementA.toggleVisibility();
    await myElementA.btnController();


    // ── 统一 MutationObserver：监听所有自动化流程 ──────────────────────────
    // 资源控制要点：
    //   1. 只注册一个 Observer（多个 Observer 每次 DOM 变动都各自触发回调，更耗资源）
    //   2. pageText 只读取一次，所有任务共享同一份快照
    //   3. 300ms 防抖，合并高频 DOM 变更为单次回调
    //   4. 各任务独立 isProcessing 锁，互不阻塞
    //   5. 全部完成后 disconnect，彻底释放

    let _debounceTimer = null;

    let _tasks = [
        {
            name: 'proc01',
            textKey: 'What do you want to create',
            fn: () => proc01Questionnaire.start(),
            isProcessing: false,
            done: false,
        },
        {
            name: 'proc03',
            textKey: 'Welcome to AI Studio',
            fn: () => proc03Walkthrough.start(),
            isProcessing: false,
            done: false,
        },
        {
            name: 'proc05',
            textKey: 'Your avatar is ready',
            fn: () => proc05AvatarForm.start(),
            isProcessing: false,
            done: false,
        },
        {
            name: 'proc06',
            textKey: 'Generate Video',
            fn: () => proc06OutPutName.start(),
            isProcessing: false,
            done: false,
        },
        {
            name: 'proc07',
            textKey: 'Choose the perfect plan for you',
            fn: () => proc07Popover.pop01ChoosePlan(),
            isProcessing: false,
            done: false,
        },
        {
            name: 'proc07',
            textKey: 'Review Uploads',
            fn: () => proc07Popover.pop02ReviewUpload(),
            isProcessing: false,
            done: false,
        },
        {
            name: 'proc07',
            textKey: 'How likely are you to recommend us to a friend or colleague',
            fn: () => proc07Popover.pop03Recommend(),
            isProcessing: false,
            done: false,
        },
        {
            name: 'proc07',
            textKey: 'Introducing Brand Systems',
            fn: () => proc07Popover.pop04Introducing(),
            isProcessing: false,
            done: false,
        },
        // {
        //     name: 'proc07',
        //     textKey: 'Create more with Avatar IV',
        //     fn: () => proc07Popover.pop05CreateMoreAvatar(),
        //     isProcessing: false,
        //     done: false,
        // },
    ];

    let _runTasks = async () => {
        // 守卫0：全部已完成，直接 return（理论上此时 Observer 已 disconnect）
        if (_tasks.every(t => t.done)) return;

        let pageText = document.body.textContent; // 只读一次，所有任务共用

        // console.log('[helper-heygen] _runTasks | url:', window.location.href);

        // if (pageText.includes('Brand System')) {
        //     console.log(`1111 Brand = `, 'Brand');
        // }

        for (let task of _tasks) {
            // console.log(`1111 _tasks = `, _tasks);

            if (task.done) continue;

            let textFound = pageText.includes(task.textKey);
            // console.log(`[helper-heygen] ${task.name} | textFound:${textFound} | isProcessing:${task.isProcessing}`);

            if (!textFound) continue;        // 守卫1：文本嗅探
            if (task.isProcessing) continue; // 守卫2：防并发

            // console.log(`[helper-heygen] ${task.name} → 触发`);

            // 异步执行，不 await，避免阻塞 for 循环中其他任务
            task.isProcessing = true;
            (async () => {
                try {
                    let result = await task.fn();
                    // console.log(`[helper-heygen] ${task.name} result:`, result);

                    let isDone = result && result.msg === '任务已完成';
                    if (isDone) {
                        task.done = true;
                    }
                } catch (e) {
                    console.error(`[helper-heygen] ${task.name} error:`, e);
                } finally {
                    task.isProcessing = false;

                    // 全部完成则释放 Observer
                    if (_tasks.every(t => t.done)) {
                        _observer.disconnect();
                    }
                }
            })();
        }
    };

    let _observer = new MutationObserver(() => {
        clearTimeout(_debounceTimer);
        _debounceTimer = setTimeout(_runTasks, 1000);
    });

    _observer.observe(document.body, {
        childList: true,  // 监听子节点增删
        subtree: true,    // 监听所有后代
        // 不加 attributes / characterData → 减少无效触发
    });

    // 立即执行一次：防止页面已渲染完毕、无后续 DOM 变动时漏掉检测
    // （直接打开目标页 或 React 已渲染完成时的兜底）
    _runTasks();

    let _lastCtrlBTime = 0;
    let _triggerGenerateVideo = async () => {
        let now = Date.now();
        if (now - _lastCtrlBTime < 250) return;
        _lastCtrlBTime = now;
        await proc07Popover.pop06GenerateVideo();
    };

    // 方案1：chrome.commands（只要点中浏览器窗口即可，无需点击页面）
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action !== 'shortcutCtrlB') return;
        _triggerGenerateVideo();
    });

    // 方案2：兜底（页面有焦点时也能触发）
    window.addEventListener('keydown', async (e) => {
        let isCtrlB = (e.ctrlKey || e.metaKey) && e.key === 'b';
        if (!isCtrlB) return;
        e.preventDefault();
        await _triggerGenerateVideo();
    });


})();
