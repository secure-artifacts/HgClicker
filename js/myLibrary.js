class myLibrary {

    // 使用示例：
    /* 
    myLibrary.delegateEvent(document.body, '#btnLogin', 'click', async function (e) {
        e.preventDefault();

    });
    */
    /**
    * 事件委托函数
    * @param {Element} parent - 要添加事件监听器的父元素
    * @param {String} selector - 用于匹配子元素的选择器
    * @param {String} type - 事件类型（如 'click'）
    * @param {Function} handler - 当匹配的子元素触发事件时调用的函数
    */
    static delegateEvent(parent, selector, type, handler) {
        try {
            parent.addEventListener(type, function (event) {
                let target = event.target;
                while (target && target !== parent) {
                    if (target.matches(selector)) {
                        handler.call(target, event);
                        break;
                    }
                    target = target.parentNode;
                }
            });
        } catch (error) {
            throw new Error(`Error-myutil2-0001: ${error.message}`);
        }
    }


}