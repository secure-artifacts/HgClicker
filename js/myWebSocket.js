

class myWebSocket {

    /**
     * ws发送和接收
     * @param {*} ws 
     * @param {*} callbackSend 
     * @param {*} callbackResponse 
     */
    static async request(ws, callbackSend, callbackResponse) {
        // const self = this;

        try {
            // let params = {
            //     sendKey: 'lemon/to-serxxver-send-fetch',
            //     sendRole: 'fb-cherry-evaluate',
            //     isResponse: true, // 是否等待回复
            //     status: true,
            //     msg: `请求抓取数据`,
            //     payload: { groupId },
            // };
            let params = await callbackSend();

            if (!(params && params.sendKey)) {
                throw new Error(`参数缺少参数 sendKey`);
            }

            if (!(params && params.hasOwnProperty('isResponse'))) {
                throw new Error(`参数缺少属性 isResponse`);
            }

            ws.send(JSON.stringify(params));

            if (params && params.isResponse) {
                ws.onmessage = async (event) => {
                    let res2 = JSON.parse(event.data);

                    if (res2 && res2.hasOwnProperty('sendKey')) {
                        let { sendKey } = res2;

                        // 简化参数，发送和返回使用同一个 key
                        if (sendKey === params.sendKey) {
                            // let { status, msg } = res2;
                            await callbackResponse(res2);
                        }
                    }
                };
            } else {
                await callbackResponse(null);
            }
        } catch (error) {
            throw new Error(`Error-mywebsocket-0001: ${error.message}`);
        }
    }


}