// proc09AutoRedirect.js
// 在 Projects 页面检测视频数量，不足 3 个时自动跳转到 Avatar 页面

class proc09AutoRedirect {

    static async start() {
        try {
            // 只在 projects 页运行
            if (!window.location.href.includes('/projects')) {
                return { status: true, msg: '不是目标页面' };
            }

            // 检查用户是否启用了自动跳转开关
            const enabled = await new Promise((resolve) => {
                try {
                    chrome.storage.local.get(['autoRedirectEnabled'], (result) => {
                        resolve(result.autoRedirectEnabled === true);
                    });
                } catch (_) {
                    resolve(false);
                }
            });

            if (!enabled) {
                return { status: true, msg: '自动跳转已关闭' };
            }

            // 轮询等待视频卡片渲染（每 500ms 检测一次，最多等 6 秒）
            let count = 0;
            for (let i = 0; i < 12; i++) {
                count = proc09AutoRedirect.countVideos();
                if (count > 0) break;
                await myUtil.sleep(500);
            }

            console.log(`[proc09] Projects 页面视频数量: ${count}`);

            if (count < 3) {
                const delay = await new Promise((resolve) => {
                    try {
                        chrome.storage.local.get(['autoRedirectDelay'], (result) => {
                            resolve(result.autoRedirectDelay ?? 5);
                        });
                    } catch (_) {
                        resolve(5);
                    }
                });
                console.log(`[proc09] 视频数 ${count} < 3，${delay} 秒后跳转到 Avatar 页面`);
                const shouldRedirect = await proc09AutoRedirect.countdownRedirect(delay);
                if (shouldRedirect) {
                    window.location.href = 'https://app.heygen.com/avatar/my-avatars';
                }
            }

            return { status: true, msg: '任务已完成' };

        } catch (error) {
            throw new Error(`Error-proc09-0001: ${error.message}`);
        }
    }

    // 倒计时提示，返回 true 表示倒计时结束应跳转，false 表示用户取消
    static countdownRedirect(seconds = 5) {
        return new Promise((resolve) => {
            // 创建提示条
            const bar = document.createElement('div');
            bar.id = 'hg-redirect-bar';
            bar.style.cssText = `
                position: fixed;
                top: 18px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 999999;
                background: #1e293b;
                color: #f1f5f9;
                padding: 11px 18px;
                border-radius: 10px;
                font-size: 14px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                border: 1px solid #334155;
                display: flex;
                align-items: center;
                gap: 14px;
                white-space: nowrap;
            `;

            const msgEl = document.createElement('span');
            msgEl.id = 'hg-redirect-msg';

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '取消';
            cancelBtn.style.cssText = `
                padding: 4px 14px;
                border-radius: 6px;
                border: 1px solid #475569;
                background: transparent;
                color: #94a3b8;
                font-size: 13px;
                cursor: pointer;
                flex-shrink: 0;
            `;

            bar.appendChild(msgEl);
            bar.appendChild(cancelBtn);
            document.body.appendChild(bar);

            let remaining = seconds;
            let cancelled = false;

            const updateMsg = () => {
                msgEl.textContent = `视频不足 3 个，${remaining} 秒后跳转到 Avatar 页面...`;
            };
            updateMsg();

            cancelBtn.addEventListener('click', () => {
                cancelled = true;
                clearInterval(timer);
                try { bar.remove(); } catch (_) {}
                resolve(false);
            }, { once: true });

            const timer = setInterval(() => {
                remaining--;
                if (remaining <= 0) {
                    clearInterval(timer);
                    try { bar.remove(); } catch (_) {}
                    if (!cancelled) resolve(true);
                } else {
                    updateMsg();
                }
            }, 1000);
        });
    }

    // 统计当前页面的视频卡片数量
    static countVideos() {
        try {
            // 方法1：通过 tw-group 卡片统计
            const groups = document.querySelectorAll('div.tw-group.tw-min-w-0');
            if (groups.length > 0) {
                const valid = Array.from(groups).filter(g => {
                    const t = g.textContent || '';
                    return t.includes('Avatar Video') ||
                           t.includes('ago') ||
                           t.includes('just now') ||
                           t.includes('Ready');
                });
                if (valid.length > 0) return valid.length;
            }

            // 方法2：通过 "Avatar Video" 文本统计
            const spans = document.querySelectorAll('span.tw-truncate');
            let count = 0;
            for (const span of spans) {
                if (span.textContent.trim() === 'Avatar Video') count++;
            }
            return count;

        } catch (_) {
            return 0;
        }
    }
}
