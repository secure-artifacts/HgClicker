class myEffect {

    /**
     * 自动流畅滑到 container 父容器的垂直的中间位置
     * @param {*} elementX 
     * @returns 
     */
    /* 
    myEffect.elementScrollToCenter2(container, elementX);
    */
    static elementScrollToCenter2(container, elementX) {
        function _scrollTo(element, container) {
            if (!element || !container) {
                console.error("Element or container not found.");
                return;
            }

            // Get bounding rectangles for both container and element
            const screenRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            // Calculate the center of the element relative to the container
            const elementCenter = elementRect.top + (elementRect.height / 2);
            const screenCenter = screenRect.top + (screenRect.height / 2);

            // Calculate how much we need to scroll
            const scrollAmount = elementCenter - screenCenter;

            // Smooth scrolling
            container.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }

        // let _getContainer = () => {
        //     let element = document.querySelector(`div[data-pagelet="MainView"] div.xw2csxc.x1odjw0f.xh8yej3.x18d9i69`);
        //     if (element) {
        //         return element;
        //     }
        //     return null;
        // };

        // let container = _getContainer();
        if (!container) {
            console.error("container not found.");
            return false;
        }

        if (!elementX) {
            console.error("Element not found.");
            return false;
        }

        _scrollTo(elementX, container);
    }

    /**
     * 时间点自动居中
     * @param {*} groupId
     */
    static async timeAutoScroll2(groupId) {
        // const self = this;

        try {
            let _getContainer = async () => {
                let selector = `//div[@id="lemonId2Wrapper"]//div[./table[@id="table1"]]`;
                return await myXPath.getElement(selector, 5);
            }

            let _getElement = async () => {
                let selector = `//div[@id="lemonId2Wrapper"]//table[@id="table1"]//tr[.//td[text()="${groupId}"]]`;
                return await myXPath.getElement(selector, 5);
            }

            let container = await _getContainer();
            if (container) {
                container.querySelectorAll('tr').forEach(tr => {
                    tr.classList.remove('table-primary');
                });;
            }

            let tr = await _getElement();
            if (tr) {
                tr.classList.add('table-primary');

                myEffect.elementScrollToCenter2(container, tr);
            }
        } catch (error) {
            throw new Error(`Error-myeffect-0002: ${error.message}`);
        }
    }

    
}