/* 
// 获取单个元素
let element = await myXPath.getElement(`//div[@role="button"]`);

// 获取多个元素
let elements = await myXPath.getElements(`//div[@data-type="item"]`);

*/

class myXPath {

    /**
     * 生成随机字符串
     * @param {number} length - 随机字符串长度
     * @returns {string} 随机字符串
     */
    static generateRandomString(length = 10) {
        return Math.random().toString(36).substr(2, length);
    }

    /**
     * 根据 XPath 获取多个元素
     * @param {string} xpath - XPath 表达式
     * @param {number} [countAttempt=3] - 尝试次数
     * @returns {Promise<Element[]>} 找到的元素数组
     */
    static async getElements(xpath, countAttempt = 3) {
        let elements = null;

        while (!elements && countAttempt > 0) {
            try {
                const result = document.evaluate(
                    xpath,
                    document,
                    null,
                    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                    null
                );

                elements = [];
                for (let i = 0; i < result.snapshotLength; i++) {
                    elements.push(result.snapshotItem(i));
                }

                // 如果没有找到元素，当作 null 处理
                if (!elements.length) {
                    elements = null;
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } catch (error) {
                console.error('XPath 查询错误:', error);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            countAttempt--;
        }

        return elements && elements.length ? elements : [];
    }

    /**
     * 根据 XPath 获取第一个元素
     * @param {string} xpath - XPath 表达式
     * @param {number} [countAttempt=3] - 尝试次数
     * @returns {Promise<Element|null>} 找到的第一个元素，未找到返回 null
     */
    static async getElement(xpath, countAttempt = 3) {
        const elements = await myXPath.getElements(xpath, countAttempt);
        return elements.length > 0 ? elements[0] : null;
    }

    /**
     * 在给定的父元素内查找子元素
     * @param {Element} parentElement - 父元素
     * @param {string} xpath - XPath 表达式
     * @param {number} [countAttempt=3] - 尝试次数
     * @returns {Promise<Element|null>} 找到的第一个子元素，未找到返回 null
     */
    static async findElements(parentElement, xpath, countAttempt = 3) {
        // 如果父元素不存在，直接返回 null
        if (!parentElement) {
            return null;
        }

        // 生成随机标记
        const randomString = this.generateRandomString(10);

        // 在父元素上添加随机标记属性
        parentElement.setAttribute('parent-random', randomString);

        // 修改 xpath，增加父元素标记的选择器
        const xpath2 = `//*[@parent-random="${randomString}"]${xpath}`;

        const elements = await myXPath.getElements(xpath2, countAttempt);

        // 查找完成后移除随机标记
        parentElement.removeAttribute('parent-random');

        return elements;
    }

    static async findElement(parentElement, xpath, countAttempt = 3) {
        const elements = await myXPath.findElements(parentElement, xpath, countAttempt);
        return elements.length > 0 ? elements[0] : null;
    }

    // ===================
    // 读取从 DOMParser 解析的HTML
    // ===================

    static async getElementX(xpath, countAttempt = 3) {
        const elements = await myXPath.getElementsX(xpath, countAttempt);
        return elements.length > 0 ? elements[0] : null;
    }

    static async getElementsX(contextDocument, xpath, countAttempt = 3) {
        let elements = null;

        // 如果提供了 iframe，使用 iframe 的 contentDocument；否则使用 contextDocument 或主文档
        const doc = contextDocument || document;

        while (!elements && countAttempt > 0) {
            try {
                const result = doc.evaluate(
                    xpath,
                    doc,
                    null,
                    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                    null
                );

                elements = [];
                for (let i = 0; i < result.snapshotLength; i++) {
                    elements.push(result.snapshotItem(i));
                }

                // 如果没有找到元素，将 elements 置为 null 并等待
                if (!elements.length) {
                    elements = null;
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } catch (error) {
                console.error('XPath 查询错误:', error);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            countAttempt--;
        }

        return elements && elements.length ? elements : [];
    }

}