chrome.commands.onCommand.addListener((command) => {
    if (command !== 'generate-video') return;
    chrome.windows.getLastFocused({ populate: true }, (win) => {
        if (!win) return;
        let activeTab = win.tabs.find(tab => tab.active);
        if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, { action: 'shortcutCtrlB' });
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "setResult":
            chrome.storage.local.set({ 'storage-result': JSON.stringify(request.data) });
            break;

        case "fetchUrl":
            fetch(request.url, { method: 'GET' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP 错误: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => sendResponse({ html }))
                .catch(error => sendResponse({ error: error.message }));
            return true; // 保持消息通道开放以支持异步响应
            break;

    }
    return true;
});