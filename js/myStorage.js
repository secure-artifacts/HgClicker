class myStorage {

    static async setResult(data) {
        try {
            // Store data in chrome.storage.local
            chrome.storage.local.set({ 'storage-result': JSON.stringify(data) }, () => {
                // Callback to handle any errors or confirm completion
            });

            // Send message to background.js to save data
            chrome.runtime.sendMessage({ action: "setResult", data: data });
        } catch (error) {
            // throw new Error(`Error-mystorage-0001: ${error.message}`);
        }
    }

    static async getResult() {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.get(['storage-result'], (result) => {
                    resolve(JSON.parse(result['storage-result'] || '[]') || []);
                });
            } catch (error) {
                // throw new Error(`Error-mystorage-0002: ${error.message}`);
            }
        });
    }


}