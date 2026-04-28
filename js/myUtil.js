// const { SHA256 } = require('crypto-js');
// const myEmoji = require('./myEmoji');

/* 
注意：
cherry 里 myEmoji 更新了，也需要同步更新到 react 里 myEmojiReact.js

cherry 使用 module.exports = myUtil;
react 使用 export default myUtil;

*/

class myUtil {

    /**
    * 方便其他地方使用
    * @param {*} value 
    * @returns 
    */
    static textTrim(value) {
        try {
            if (value && typeof value === 'string') {
                value = value.trim();
            }
            return value;
        } catch (error) {
            throw new Error(`Error-myutil-0001: ${error.message}`);
        }
    }

    /**
    * 去掉多行文本的两边空格
    * @param {*} str 
    * @returns 
    */
    /* 
    examples:
    let words = `
        758417642165890
        823175615821640
        1610052239451354
    `;
    */
    static textTrimWordInText(str) {
        try {
            if (str && typeof str === 'string') {
                str = str.trim();
                str = str.replace(/^\s*?([^\s]+)\s*?$/igm, function (line, value) {
                    return value;
                });
            }
            return str;
        } catch (error) {
            throw new Error(`Error-myutil-0002: ${error.message}`);
        }
    }

    /**
     * 今天日期 2022-07-23
     * @returns 
     */
    static getToday() {
        try {
            let date = new Date();
            let y = '' + date.getFullYear();
            let m = '' + (date.getMonth() + 1);
            let d = '' + date.getDate();

            m = m.padStart(2, '0');
            d = d.padStart(2, '0');

            return `${y}-${m}-${d}`;
        } catch (error) {
            throw new Error(`Error-myutil-0003: ${error.message}`);
        }
    }

    /**
    * 获取当前时间
    * @returns 
    */
    static getTime() {
        try {
            let date = new Date();
            let h = '' + date.getHours();
            let i = '' + date.getMinutes();
            let s = '' + date.getSeconds();

            h = h.padStart(2, '0');
            i = i.padStart(2, '0');
            s = s.padStart(2, '0');

            return `${h}:${i}:${s}`;
        } catch (error) {
            throw new Error(`Error-myutil-0004: ${error.message}`);
        }
    }

    /**
    * 时间小时和分钟
    * @returns 
    */
    static getTimeHi() {
        try {
            let date = new Date();

            let h = '' + date.getHours();
            let i = '' + date.getMinutes();

            h = h.padStart(2, '0');
            i = i.padStart(2, '0');

            return `${h}:${i}`;
        } catch (error) {
            throw new Error(`Error-myutil-0005: ${error.message}`);
        }
    }

    /**
     * 获取当前日期和时间
     * @returns 
     */
    static getDatetime() {
        try {
            let today = this.getToday();
            let time = this.getTime();
            return `${today}T${time}`;
        } catch (error) {
            throw new Error(`Error-myutil-0006: ${error.message}`);
        }
    }

    /**
     * 获取当前时间的时间戳
     * @returns 
     */
    static getTimestamp() {
        try {
            // (new Date()).getTime() = Date.now() = 秒数 + 毫秒

            // 时间戳不要毫秒
            return Math.floor((new Date()).getTime() / 1000);
        } catch (error) {
            throw new Error(`Error-myutil-0007: ${error.message}`);
        }
    }

    /**
     * 美化日期格式
     * @returns 
     */
    static prettyDate(text) {
        try {
            if (text && typeof text === 'string') {
                if (text.match(/^\d{4}-\d+-\d+$/)) {
                    return text.split('-').map(num => num.padStart(2, '0')).join('-');
                }
            }
            return text;
        } catch (error) {
            throw new Error(`Error-myutil-0133: ${error.message}`);
        }
    }

    /**
     * 美化时间格式
     * @returns 
     */
    static prettyTime(text) {
        try {
            if (text && typeof text === 'string') {
                if (text.match(/^\d+:\d+$/) || text.match(/^\d+:\d+:\d+$/)) {
                    return text.split(':').map(num => num.padStart(2, '0')).join(':');
                }
            }
            return text;
        } catch (error) {
            throw new Error(`Error-myutil-0134: ${error.message}`);
        }
    }

    /**
     * 把时间转化为 ISO 8601 格式，如 2023-09-04T04:00:00.000Z
     * @param {*} datetime 
     * @returns 
     */
    static convertDatetimeToISO8601(datetime) {
        try {
            let _getToday = () => {
                let date = new Date();
                let y = date.getFullYear();
                let m = '' + (date.getMonth() + 1);
                let d = '' + date.getDate();
                m = m.padStart(2, '0');
                d = d.padStart(2, '0');
                return `${y}-${m}-${d}`;
            }

            let _getISO8601 = (datetime) => {
                datetime = datetime.trim();

                // 2023-9-4 => 2023-09-04
                datetime = datetime.replace(/(\d+)-(\d+)-(\d+)/, function (whole, y, m, d) {
                    y = y.padStart(2, '0');
                    m = m.padStart(2, '0');
                    d = d.padStart(2, '0');
                    return `${y}-${m}-${d}`;
                });

                // 4:5 => 04:05
                datetime = datetime.replace(/(\d+):(\d+)/, function (whole, h, i) {
                    h = h.padStart(2, '0');
                    i = i.padStart(2, '0');
                    return `${h}:${i}`;
                });

                // 4:5:6 => 04:05:06
                datetime = datetime.replace(/(\d+):(\d+):(\d+)/, function (whole, h, i, s) {
                    h = h.padStart(2, '0');
                    i = i.padStart(2, '0');
                    s = s.padStart(2, '0');
                    return `${h}:${i}:${s}`;
                });

                let matches = null;

                // 2022-01-04 11:49:05
                matches = datetime.match(/^(\d{4}-\d{2}-\d{2})\s*?(\d{1,2}:\d{1,2}:\d{1,2})$/);
                if (matches) {
                    return `${matches[1]}T${matches[2]}.000Z`;
                }

                // 2022-01-04 11:49
                matches = datetime.match(/^(\d{4}-\d{2}-\d{2})\s*?(\d{1,2}:\d{1,2})$/);
                if (matches) {
                    return `${matches[1]}T${matches[2]}:00.000Z`;
                }

                // 2022-01-04
                if (datetime.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return `${datetime}T00:00:00.000Z`;
                }

                // 11:49:05
                if (datetime.match(/^\d{1,2}:\d{1,2}:\d{1,2}$/)) {
                    let today = _getToday();
                    return `${today}T${datetime}.000Z`;
                }

                // 11:49
                if (datetime.match(/^\d{1,2}:\d{1,2}$/)) {
                    let today = _getToday();
                    return `${today}T${datetime}:00.000Z`;
                }

                return datetime;
            }

            datetime = datetime + '';
            return _getISO8601(datetime);
        } catch (error) {
            throw new Error(`Error-myutil-0008: ${error.message}`);
        }
    }

    /**
    * 根据指定的日期时间，获取时间戳
    * @returns 
    */
    /* 
    let timestamp = myUtil.convertDatetimeToTimestamp('2022-08-10 10:49');
    */
    static convertDatetimeToTimestamp(datetime) {
        const self = this;

        try {
            datetime = datetime + '';

            let datetime2 = self.convertDatetimeToISO8601(datetime);

            let d = new Date(datetime2);

            // 返回秒，并加上时区差
            let dt = parseInt(d.getTime() / 1000) + d.getTimezoneOffset() * 60;
            return dt;
        } catch (error) {
            throw new Error(`Error-myutil-0009: ${error.message}`);
        }
    }

    /**
     * 把时间的字符串转为时间戳
     * @param {*} timeStr 
     * @returns 
     */
    /* 
    1s       => 1713264343
    Just now => 1713264343
    6:40     => 1713264000
    6:40 AM  => 1713264000
    */
    static convertStringToTimestamp(timeStr) {
        const self = this;

        try {
            let _getTime1 = (text2) => {
                let seconds = self.textToSeconds(text2);
                return myUtil.getTimestamp() - seconds;
            }

            let _getTime2 = (text2) => {
                // 分割时间字符串，获取小时和分钟
                let [hour, minute] = text2.split(':').map(str => parseInt(str.trim()));

                // 检查AM或PM
                let isPM = text2.includes('PM');

                // 如果是下午并且小时不是12，则加上12小时
                if (isPM && hour !== 12) {
                    hour += 12;
                }

                // 如果是上午并且小时是12，则将小时设为0
                if (!isPM && hour === 12) {
                    hour = 0;
                }

                // 创建一个新的Date对象，并设置小时和分钟
                let date = new Date();
                date.setHours(hour);
                date.setMinutes(minute);
                date.setSeconds(0);
                date.setMilliseconds(0);

                // 返回时间戳（以秒为单位）
                return Math.floor(date.getTime() / 1000);
            }

            let text2 = String(timeStr).replace(/[\r\n]+/g, '').replace(/\s+/g, '');

            // Just now
            if (text2.match(/(Justnow)/i)) {
                text2 = '1s';
            }

            // 1s
            // 1m
            // 1h
            // 1d
            if (text2.match(/\d+\s*?(s|m|h|d)/i)) {
                return _getTime1(text2);
            }

            return _getTime2(text2);
        } catch (error) {
            throw new Error(`Error-myutil-0128: ${error.message}`);
        }
    }

    /**
    * 把时间字符串转换为日期
    * @return 
    */
    /* 
    2023-09-05 => 2023-09-05
    2023-9-5 => 2023-09-05
    2023-9-5 12:10 => 2023-09-05
    2023-9-5 12:10:15 => 2023-09-05
    2023-9-5 1:2:3 => 2023-09-05

    Fri Sep 05 2023 => 2023-09-05
    */
    static convertDateStringToDate(dataString) {
        try {
            // 解析输入日期字符串为Date对象
            let d1 = new Date(dataString);

            if (isNaN(d1.getTime())) {
                // 如果解析日期失败，则返回空字符串或其他错误处理
                return dataString;
            }

            // 获取年、月、日
            let year = d1.getUTCFullYear();
            let month = String(d1.getUTCMonth() + 1).padStart(2, '0');
            let day = String(d1.getUTCDate()).padStart(2, '0');

            // 使用UTC的年月日
            return `${year}-${month}-${day}`;
        } catch (error) {
            throw new Error(`Error-myutil-0010: ${error.message}`);
        }
    }

    /**
    * 把时间字符串转换为时间
    * @return 
    */
    /* 
    2024-04-18T15:70:00.000Z => 15:40:00
    */
    static convertDateStringToTime(dataString) {
        try {
            // 解析输入日期字符串为Date对象
            let d1 = new Date(dataString);

            if (isNaN(d1.getTime())) {
                // 如果解析失败，则返回空字符串或其他错误处理
                return dataString;
            }

            let hours = String(d1.getUTCHours()).padStart(2, '0');
            let minutes = String(d1.getUTCMinutes()).padStart(2, '0');
            let seconds = String(d1.getUTCSeconds()).padStart(2, '0');

            // His
            return hours + ':' + minutes + ':' + seconds;
        } catch (error) {
            throw new Error(`Error-myutil-0129: ${error.message}`);
        }
    }

    /**
    * 根据指定的时间戳，获取时间
    * @returns 
    */
    /* 
    1549312452 => 10:49:45
    let datetime = myUtil.convertTimestampToDatetime(1549312452, 'H');
    let datetime = myUtil.convertTimestampToDatetime(1549312452, 'Hi');
    let datetime = myUtil.convertTimestampToDatetime(1549312452, 'His');

    1549312452 => 2019-02-04
    let datetime = myUtil.convertTimestampToDatetime(1549312452, 'Y-m-d');
    */
    static convertTimestampToDatetime(timestamp, format = 'His') {
        try {
            let _padLeft = (val) => {
                return val.substr(-2);
            }

            // let timestamp = 1549312452
            timestamp = parseInt(timestamp);
            let date = new Date(timestamp * 1000);
            let hours = _padLeft('0' + date.getHours());
            let minutes = _padLeft('0' + date.getMinutes());
            let seconds = _padLeft('0' + date.getSeconds());

            if (format === 'Y-m-d') {
                let y = '' + date.getFullYear();
                let m = '' + (date.getMonth() + 1);
                let d = '' + date.getDate();
                m = m.padStart(2, '0');
                d = d.padStart(2, '0');
                return `${y}-${m}-${d}`;
            }
            else if (format === 'Hi') {
                return hours + ':' + minutes;
            }
            else if (format === 'H') {
                return hours;
            }

            // His
            return hours + ':' + minutes + ':' + seconds;
        } catch (error) {
            throw new Error(`Error-myutil-0011: ${error.message}`);
        }
    }

    /**
     * 纠正时间格式 2024-8-5 to 2024-8-40
     * @param {*} value 
     * @param {*} defValue 默认值
     * @returns 
     */
    /* 
    value = '2024-08-05 to 2024-08-30'
    value = myUtil.setDateToDate(value, '当天');
    */
    static setDateToDate(value, defValue) {
        // const self = this;

        try {
            if (!(value && typeof value === 'string')) {
                return defValue;
            }

            // let value = '2024-8-5 to 2024-8-40';

            // 2024-08-01 to 2024-08-20

            let _getLastDay = (year, month) => {
                year = parseInt(year);
                month = parseInt(month);
                return new Date(year, month, 0).getDate();
            }

            let _setMonth = (val) => {
                val = parseInt(val) || 1;
                val = val < 0 ? 1 : val;
                val = val > 12 ? 12 : val;
                return String(val).padStart(2, '0');
            }

            let _setDay = (y, m, d) => {
                let lastDay = _getLastDay(y, m);

                d = parseInt(d) || 1;
                d = d < 0 ? 1 : d;
                d = d > lastDay ? lastDay : d;
                return String(d).padStart(2, '0');
            }

            value = value.replace(/\s+/g, '');

            if (!value.match(/^\d{4}-\d+-\d+to\d{4}-\d+-\d+$/i)) {
                return defValue;
            }

            value = value.replace(/^(\d+)-(\d+)-(\d+)to(\d+)-(\d+)-(\d+)$/, function (whole, y1, m1, d1, y2, m2, d2) {
                m1 = _setMonth(m1);
                d1 = _setDay(y1, m1, d1);

                m2 = _setMonth(m2);
                d2 = _setDay(y2, m2, d2);

                return `${y1}-${m1}-${d1} to ${y2}-${m2}-${d2}`;
            });

            return value;
        } catch (error) {
            throw new Error(`Error-myutil-0144: ${error.message}`);
        }
    }

    /* 
    // 执行转换
    const timeInfo = myUtil.extractTimeInfo('2024-02-08 13:15');

    { year: 2024, month: 2, day: 8, hour: 1, minute: 15, meridiem: 'PM' }
    */
    /**
     * 
     * @param {*} text 
     * @param {*} is12HourFormat 是否是 12小时制
     * @returns 
     */
    static extractTimeInfo(text, is12HourFormat = false) {
        try {
            if (!(text && typeof text === 'string')) {
                return null;
            }

            // 拆分日期和时间
            const [date, time] = text.trim().split(/[\t\r\n\s]+/);

            // 获取日期的各部分
            const [year, month, day] = date.split("-").map(num => parseInt(num, 10));

            // 获取时间的小时和分钟
            let [hour, minute] = time.split(":").map(num => parseInt(num, 10));

            // 计算AM或PM
            let meridiem = null;

            // 12小时制
            if (is12HourFormat) {
                meridiem = hour >= 12 ? 'PM' : 'AM';

                // 转换为12小时制
                if (hour === 0) {
                    hour = 12;
                } else if (hour > 12) {
                    hour -= 12;
                }
            }

            return { year, month, day, hour, minute, meridiem };
        } catch (error) {
            throw new Error(`Error-myutil-0152: ${error.message}`);
        }
    }

    /**
     * 把时间解析为时间点
     * @param {*} time 
     * @returns 
     */
    /* 
    // 06:00~07:00 => ['06:00', '07:00']
    let [timeStart, timeEnd] = myUtil.getTimePoints('06:00~07:00');
    */
    static getTimePoints(time) {
        try {
            let points = [];
            let matches = time.match(/^(\d{2}:\d{2})~(\d{2}:\d{2})$/);
            if (matches) {
                points.push(matches[1]);
                points.push(matches[2]);
            }
            return points;
        } catch (error) {
            throw new Error(`Error-myutil-0012: ${error.message}`);
        }
    }

    /**
     * 获取偏移日期/时间
     * @param {*} time 指定的日期/时间
     * @param {*} offsetSecond 偏移（秒）
     */
    /* 
    let datetime = myUtil.getDatetimeOffset('10:00', 300);
    */
    static getDatetimeOffset(time, offsetSecond) {
        const self = this;

        try {
            // 根据指定的日期时间，获取时间戳
            let timestamp = self.convertDatetimeToTimestamp(time);

            // 偏移了多少秒
            timestamp = timestamp + offsetSecond;

            // 根据指定的时间戳，获取时间
            let datetime = self.convertTimestampToDatetime(timestamp, 'Hi');

            return datetime;
        } catch (error) {
            throw new Error(`Error-myutil-0013: ${error.message}`);
        }
    }

    /**
    * 获取偏移日期
    * @param {*} time 指定的日期
    * @param {*} offsetDay 偏移（天数）负数是之前，正数是之后
    */
    /* 
    let date = myUtil.getDateOffset('2023-09-12', 5); // 2023-09-17
    */
    static getDateOffset(date, offsetDay) {
        try {
            offsetDay = parseInt(offsetDay);

            // 获取日期对象
            let d1 = new Date(date);

            // 计算偏移后的日期
            let d2 = new Date(d1.getTime() + offsetDay * 24 * 60 * 60 * 1000);
            // 2023-09-17T00:00:00.000Z

            // 使用UTC的年月日
            let year = d2.getUTCFullYear();
            let month = String(d2.getUTCMonth() + 1).padStart(2, '0');
            let day = String(d2.getUTCDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            throw new Error(`Error-myutil-0014: ${error.message}`);
        }
    }

    /**
    * 获取偏移时间（小时+分钟）
    * @param {*} time 指定的时间（小时+分钟）
    * @param {*} offsetDay 偏移量，单位是秒
    */
    /* 
    let time2 = myUtil.getTimeOffset('10:00', 300);
    */
    static getTimeOffset(time, offsetSecond) {
        try {
            if (!(time && typeof time === 'string' && time.match(/:/))) {
                return null;
            }

            // 解析时间字符串并转换为小时和分钟
            let [hour, minute] = time.split(':').map(Number);

            // 计算偏移后的时间（单位：分钟）
            let totalMinutes = hour * 60 + minute + offsetSecond / 60;
            totalMinutes = (totalMinutes + 24 * 60) % (24 * 60); // 处理超过一天的情况

            // 将结果转换为小时和分钟格式
            let resultHour = Math.floor(totalMinutes / 60);
            let resultMinute = Math.floor(totalMinutes % 60);

            // 格式化小时和分钟为两位数
            let formattedHour = String(resultHour).padStart(2, '0');
            let formattedMinute = String(resultMinute).padStart(2, '0');

            return `${formattedHour}:${formattedMinute}`;
        } catch (error) {
            throw new Error(`Error-myutil-0131: ${error.message}`);
        }
    }

    /**
     * 分解时间段
     * @param {*} timesString 
     * @param {*} returnType 返回类型
     * @returns 
     */
    /* 
    // let timesString = '!06::::00~10:30@;11:0～09:70¥'
    // let timesString = '06:00~10:30;11:13～13:30'
    // let timesString = '06:00~14:30;11:00～11:30'

    returnType 返回类型：
        time-slice 时间范围 如 
            [
                { time1: '06:00', time2:'10:30' },
                { time1: '11:00', time2:'11:30' },
            ]

        time-range 时间范围 如 
            [ '06:00~10:30', '11:00~11:30' ]

        time-string 时间范围 如 
            '06:00~10:30; 11:00~11:30'

        time-data 时间数据 如 
            [
                { hour1: 6, minute1: 0, hour2: 10, minute2: 30 },
                { hour1: 7, minute1: 0, hour2: 9, minute2: 59 }
            ]

    */
    /* 
    let timesString = '06:00~10:30;11:00～11:30'
    let value = myUtil.extractTimesString(timesString, 'time-string');
    */
    static extractTimesString(timesString, returnType = 'time-range') {
        const self = this;

        try {
            // 使输入的参数格式标准
            let _letStandard = (value) => {
                if (!(value && typeof value === 'string')) {
                    return '06:00~23:30';
                }
                return value;
            }

            // 时间范围 06:00~23:30
            let _setHour = (val) => {
                val = isNaN(val) ? 0 : parseInt(val);
                val = val < 0 ? 0 : val;
                val = val > 23 ? 23 : val;
                return val;
            }

            // 时间范围 06:00~23:30
            let _setMinute = (val) => {
                val = isNaN(val) ? 0 : parseInt(val);
                val = val < 0 ? 0 : val;
                val = val > 59 ? 59 : val;
                return val;
            }

            // 时间比较
            let _compareTimes = (range1, range2) => {
                let hour1 = String(range1.hour2).padStart(2, '0');
                let minute1 = String(range1.minute2).padStart(2, '0');
                let time1 = `${hour1}:${minute1}`;

                let hour2 = String(range2.hour1).padStart(2, '0');
                let minute2 = String(range2.minute1).padStart(2, '0');
                let time2 = `${hour2}:${minute2}`;

                return time1 < time2;
            }

            // 提取时间
            let _extractRanges = (value) => {
                value = String(value);
                value = value.replace(/\s+/g, '');

                value = value.replace(/[：:]+/g, ':');
                value = value.replace(/[~～]+/g, '~');
                value = value.replace(/[；;]+/g, ';');

                let ranges = [];

                let matches = value.matchAll(/\d+:\d+~\d+:\d+/g);
                for (let match of matches) {
                    let val = match[0];
                    // '06:00~23:30'

                    let matches2 = val.match(/(\d+):(\d+)~(\d+):(\d+)/);
                    if (matches2) {
                        let hour1 = _setHour(matches2[1]);
                        let minute1 = _setMinute(matches2[2]);
                        let hour2 = _setHour(matches2[3]);
                        let minute2 = _setMinute(matches2[4]);

                        ranges.push({ hour1, minute1, hour2, minute2 });
                    }
                }

                return ranges;
            }

            // 过滤时间
            let _filterRanges = (ranges) => {
                if (!ranges.length) {
                    return [];
                }

                // 检查单个组时间大小的合理性
                ranges = ranges.filter(range => {
                    let { hour1, minute1, hour2, minute2 } = range;

                    hour1 = String(hour1).padStart(2, '0');
                    minute1 = String(minute1).padStart(2, '0');
                    hour2 = String(hour2).padStart(2, '0');
                    minute2 = String(minute2).padStart(2, '0');

                    let time1 = `${hour1}:${minute1}`;
                    let time2 = `${hour2}:${minute2}`;

                    // 时间范围 06:00~23:30
                    if (!('06:00' <= time1 && time1 < time2 && time2 <= '23:30')) {
                        return false;
                    }

                    // time1 跟 time2 时间段内需要30分钟
                    let timestamp1 = self.convertDatetimeToTimestamp(time1);
                    let timestamp2 = self.convertDatetimeToTimestamp(time2);

                    if (!(timestamp2 - timestamp1 >= 60 * 30)) {
                        return false;
                    }

                    return true;
                });

                if (!ranges.length) {
                    return [];
                }

                // 检查整体时间嵌套的合理性
                // 思路: 先拿出第一组，用第二组时间跟第一组比较，如果合理，直接第三组时间跟第二组，直到最后
                if (ranges.length === 1) {
                    return ranges;
                }

                let range1 = null;
                ranges = ranges.filter(range2 => {
                    // 第一个默认通过
                    if (!range1) {
                        range1 = range2;
                        return true;
                    }

                    let result = _compareTimes(range1, range2);
                    if (result) {
                        range1 = range2;
                        return true;
                    }

                    return false;
                });

                /* 
                ranges =  [ { hour1: 6, minute1: 0, hour2: 14, minute2: 30 } ]
                */
                return ranges;
            }

            let _toSlice = (data) => {
                return data.map(range => {
                    let { hour1, minute1, hour2, minute2 } = range;

                    hour1 = String(hour1).padStart(2, '0');
                    minute1 = String(minute1).padStart(2, '0');
                    hour2 = String(hour2).padStart(2, '0');
                    minute2 = String(minute2).padStart(2, '0');

                    let time1 = `${hour1}:${minute1}`;
                    let time2 = `${hour2}:${minute2}`;

                    return { time1, time2 };
                });
            }

            timesString = _letStandard(timesString);

            // '06:00~07:30; 08:00~23:30'
            let data = _extractRanges(timesString);

            /* 
            data =  [
                { hour1: 6, minute1: 0, hour2: 10, minute2: 30 },
                { hour1: 7, minute1: 0, hour2: 9, minute2: 59 }
            ]
            */
            data = _filterRanges(data);

            // 默认值
            if (!data.length) {
                data = [{ hour1: 6, minute1: 0, hour2: 23, minute2: 30 }];
            }

            if (returnType === 'time-slice') {
                return _toSlice(data);
            }

            if (returnType === 'time-range') {
                return _toSlice(data).map(time => `${time.time1}~${time.time2}`);
            }

            if (returnType === 'time-string') {
                return _toSlice(data).map(time => `${time.time1}~${time.time2}`).join('; ');
            }

            // 时间数据
            return data;
        } catch (error) {
            throw new Error(`Error-myutil-0141: ${error.message}`);
        }
    }

    /**
     * 下个月的这一天的日期，如今天日期是 2023-10-25，那么结果是 2023-11-25
     * @returns 
     */
    /* 
    let sameDateNextMonth = myUtil.getSameDateNextMonth();
    */
    static getSameDateNextMonth() {
        try {
            let d1 = new Date();

            let d2 = new Date(d1);
            d2.setMonth(d1.getMonth() + 1);

            let year = d2.getFullYear();
            let month = String(d2.getMonth() + 1).padStart(2, '0');
            let day = String(d2.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            throw new Error(`Error-myutil-0015: ${error.message}`);
        }
    }

    /**
     * 下一年的这一天的日期，如今天日期是 2023-10-25，那么结果是 2024-10-25
     * @returns 
     */
    /* 
    let sameDateNextYear = myUtil.getSameDateNextYear();
    */
    static getSameDateNextYear() {
        try {
            let d1 = new Date();

            let d2 = new Date(d1);
            d2.setFullYear(d1.getFullYear() + 1);

            let year = d2.getFullYear();
            let month = String(d2.getMonth() + 1).padStart(2, '0');
            let day = String(d2.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            throw new Error(`Error-myutil-0143: ${error.message}`);
        }
    }

    /**
     * 时间比较
     * 在 3 天内（包括 3 天）
     * @param {*} day 
     * @param {*} interval 
     * @returns 
     */
    /* 
    // 2022-11-13 是否在前和后 3 天 内
    let isInDays = myUtil.compareDay('2022-11-13', 3);
    */
    static compareDay(target, interval) {
        const self = this;

        try {
            // let target = '2022-11-13';
            let timestamp1 = self.convertDatetimeToTimestamp(self.getToday());
            let timestamp2 = self.convertDatetimeToTimestamp(target);
            let diff = timestamp1 - timestamp2;

            // 在 interval 天内（包括 interval 天）
            return (Math.abs(diff) / (60 * 60 * 24)) < interval;
        } catch (error) {
            throw new Error(`Error-myutil-0016: ${error.message}`);
        }
    }

    /**
     * 计算一个指定的日期跟当天比较，差几天
     * @param {*} day 
     * @param {*} interval 
     * @returns 
     */
    /* 
    如果是当天，返回是 0
    如果是前一天，，返回是 1
    如果是后一天，，返回是 -1
    let dayDiff = myUtil.getDayDiff('2022-11-13');
    */
    static getDayDiff(target) {
        const self = this;

        try {
            let timestamp1 = self.convertDatetimeToTimestamp(self.getToday());
            let timestamp2 = self.convertDatetimeToTimestamp(target);
            let diff = timestamp1 - timestamp2;
            return Math.floor(diff / (60 * 60 * 24));
        } catch (error) {
            throw new Error(`Error-myutil-0017: ${error.message}`);
        }
    }

    /**
     * 计算两个日期差
     * @param {*} date1 
     * @param {*} date2 
     * @returns 
     */
    /* 
    let date1 = '2024-09-20';
    let date2 = '2024-09-20';
    let diff = myUtil.getDayDiff2(date1, date2);
    diff = 0

    let date1 = '2024-09-19';
    let date2 = '2024-09-20';
    let diff = myUtil.getDayDiff2(date1, date2);
    diff = 1

    let date1 = '2024-09-20';
    let date2 = '2024-09-19';
    let difference = getDayDiff2(date1, date2);
    diff = -1

    结果的逻辑是： date2 - date1

    */
    static getDayDiff2(date1, date2) {
        // const self = this;

        try {
            // 将日期字符串转换为 Date 对象
            let d1 = new Date(date1);
            let d2 = new Date(date2);

            // 计算时间差（以毫秒为单位）
            let diff = d2 - d1;

            // 将毫秒转换为天数
            return Math.floor(diff / (1000 * 60 * 60 * 24));
        } catch (error) {
            throw new Error(`Error-myutil-0148: ${error.message}`);
        }
    }

    /**
     * 时间转换为秒数
     * @param {*} timeString // 标准格式是：小时:分钟:秒 支持格式：秒 / 分钟:秒 / 小时:分钟:秒
     * @returns 
     */
    /* 
    let text = '1:2:3'
    let seconds = myUtil.timeToSeconds(text);
    // output: 3723
    */
    static timeToSeconds(timeString) {
        const self = this;

        try {
            let _calc = (hours, minutes, seconds) => {
                hours = Number(hours);
                minutes = Number(minutes);
                seconds = Number(seconds);

                if (hours >= 24) {
                    hours = 23;
                }
                if (minutes >= 60) {
                    minutes = 59;
                }
                if (seconds >= 60) {
                    seconds = 59;
                }

                let total = 0;
                if (hours > 0) {
                    total += hours * 3600;
                }
                if (minutes > 0) {
                    total += minutes * 60;
                }
                total += seconds;
                return total;
            }

            timeString += '';
            timeString = self.textTrim(timeString);

            if (!timeString) {
                return 0;
            }

            let matches = null;

            // 1:2:3
            matches = timeString.match(/^(\d+)[^\d]+?(\d+)[^\d]+?(\d+)$/);
            if (matches) {
                return _calc(matches[1], matches[2], matches[3]);
            }

            // 2:3
            matches = timeString.match(/^(\d+)[^\d]+?(\d+)$/);
            if (matches) {
                return _calc(0, matches[1], matches[2]);
            }

            // 2
            matches = timeString.match(/^(\d+)$/);
            if (matches) {
                return _calc(0, 0, matches[1]);
            }

            return 0;
        } catch (error) {
            throw new Error(`Error-myutil-0018: ${error.message}`);
        }
    }

    /**
     * 时间转换为秒数
     * @param {*} timeString // 标准格式是：小时:分钟:秒 支持格式：秒 / 分钟:秒 / 小时:分钟:秒
     * @returns 
     */
    /* 
    // 5m, 3h, 3d
    5m => 300
    let seconds = myUtil.textToSeconds(text);
    */
    static textToSeconds(text) {
        try {
            if (text && typeof text === 'string') {
                let matches = text.match(/^(\d+)\s*?(s|m|h|d)$/i);
                if (matches) {
                    let time = parseInt(matches[1]);
                    let unit = matches[2];

                    let second = 0;
                    switch (unit) {
                        case 's':
                            second = time;
                            break;
                        case 'm':
                            second = time * 60;
                            break;
                        case 'h':
                            second = time * 60 * 60;
                            break;
                        case 'd':
                            second = time * 60 * 60 * 24;
                            break;
                        default:
                            break;
                    }
                    return second;
                }
            }
            return 0;
        } catch (error) {
            throw new Error(`Error-myutil-0126: ${error.message}`);
        }
    }

    /**
     * 秒数转换为时间格式（按视频时长格式要求设计）
     * @param {*} seconds 
     * @returns 
     */
    /* 
    example:
    let time = myUtil.secondsToTime(100);

    // 1:40
    console.log( 'time = ', time );
    */
    static secondsToTime(seconds) {
        try {
            seconds = parseInt(seconds);

            let hours = Math.floor(seconds / 3600);
            let minutes = Math.floor((seconds - (hours * 3600)) / 60);
            let seconds2 = seconds - (hours * 3600) - (minutes * 60);

            let str = '';

            if (hours > 0) {
                str += hours + ':';

                if (minutes < 10) {
                    str += '0';
                }
            }

            str += minutes + ':';

            if (seconds2 < 10) {
                str += '0';
            }

            str += seconds2;
            return str;
        } catch (error) {
            throw new Error(`Error-myutil-0019: ${error.message}`);
        }
    }

    // 判断现在是什么时间段: am / pm / night
    static getTimeOfDay() {
        try {
            let hour = new Date().getHours();
            if (hour < 12) {
                return 'am';
            } else if (hour < 18) {
                return 'pm';
            } else {
                return 'night';
            }
        } catch (error) {
            throw new Error(`Error-myutil-0020: ${error.message}`);
        }
    }

    /* 
    abc => 00abc
    let code = myUtil.padLeft('abc', 5, '0');
    */
    static padLeft(str, length, pad) {
        try {
            str = str + '';
            while (str.length < length) {
                str = pad + str;
            }
            return str;
        } catch (error) {
            throw new Error(`Error-myutil-0021: ${error.message}`);
        }
    }

    /**
    * 去掉重复元素
    * @param {*} array 
    */
    static arrayUnique(array) {
        try {
            if (Array.isArray(array) && array.length) {
                // let array = ['a', 1, 'a', 2, '1'];
                let unique = array.filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                });
                // return ['a', 1, 2, '1']
                return unique;
            }
            return array;
        } catch (error) {
            throw new Error(`Error-myutil-0022: ${error.message}`);
        }
    }

    /**
    * 数组随机排序
    * @param {*} array 
    */
    static arrayShuffle(array) {
        try {
            if (Array.isArray(array) && array.length) {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }
            return array;
        } catch (error) {
            throw new Error(`Error-myutil-0023: ${error.message}`);
        }
    }

    /**
     * 获取数组中一段
     * @param {*} array 数组
     * @param {*} endOffset 结尾空出几个元素
     * @param {*} length 获取几个元素（受数组长度限制）
     * @returns 
     */
    /* 
    let list = [1, 2, 3, 4, 5, 6, 7];
    let items = myUtil.arraySlice(list, 3, 2);
    [3, 4]
    */
    static arraySlice(array, endOffset, length) {
        try {
            return array.filter((item, index, array) => {
                // 结尾偏移多少个元素
                // let endOffset = 3;

                // 保留多少个元素
                // let length = 3;

                // 开始偏移多少个元素
                let beginOffset = array.length - endOffset - length;
                beginOffset = beginOffset < 0 ? 0 : beginOffset;
                return beginOffset <= index && index < array.length - endOffset;
            });
        } catch (error) {
            throw new Error(`Error-myutil-0024: ${error.message}`);
        }
    }

    /**
     * 数组求和
     * @param {*} array 数组
     * @returns 
     */
    /* 
    let array = [1, 2, 3, 4];
    let sum = await myUtil.arraySum(array);
    */
    static arraySum(array) {
        try {
            return array.reduce((sum, num) => sum + num, 0);
        } catch (error) {
            throw new Error(`Error-myutil-0415: ${error.message}`);
        }
    }

    /**
     * 判断 elementTexts 和 imageAlts 中的每个元素的字符串是否有包含关系
     * @param {*} elementTexts 可以是数组类型，也可以是字符串
     * @param {*} imageAlts 可以是数组类型，也可以是字符串
     * @returns 
     */
    /* 
    let elementTexts = ['未提供相片說明', 'xxxxx'];
    let imageAlts = ['未提供相片說明']
    let isInclude =  myUtil.arrayIsInclude(elementTexts, imageAlts);
    */
    static arrayIsInclude(items1, items2, args = {}) {
        const self = this;

        try {
            let def = {
                compareType: 'pureValue',
            }
            args = { ...def, ...args };

            // 过滤字符串
            let _filterValue = (text) => {
                if (args.compareType === 'pureValue') {
                    text = self.pureValue(text);
                }
                return text;
            }

            if (items1 && items2) {
                if (!Array.isArray(items1)) {
                    items1 = [items1];
                }
                if (!Array.isArray(items2)) {
                    items2 = [items2];
                }

                // 循环遍历 items1 和 items2 中的每个元素，判断是否存在包含关系
                for (let i = 0; i < items1.length; i++) {
                    let value1 = self.textTrim(items1[i]);
                    value1 = _filterValue(value1);

                    for (let j = 0; j < items2.length; j++) {
                        let value2 = self.textTrim(items2[j]);
                        value2 = _filterValue(value2);

                        if (value1.includes(value2) || value2.includes(value1)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0025: ${error.message}`);
        }
    }

    /**
     * 获取一维数组中元素的次数
     * @param {*} array 
     */
    /* 
    ['a', 'b', 'a'] => { a: 2, b: 1 }
    */
    static arrayDuplicate(array) {
        try {
            if (!(Array.isArray(array) && array.length)) {
                return {};
            }

            let counts = {};
            for (let i = 0; i < array.length; i++) {
                let value = array[i];
                if (counts[value]) {
                    counts[value]++;
                } else {
                    counts[value] = 1;
                }
            }
            return counts;
        } catch (error) {
            throw new Error(`Error-myutil-0026: ${error.message}`);
        }
    }

    /**
     * 获取二维数组中指定元素的次数
     * @param {*} array 
     */
    /* 
    let array = [
        { id: 4734, name: 'Tom' },
        { id: 4737, name: 'Tom' },
        { id: 4738, name: 'Danny' }
    ]
    =>
    let data = myUtil.arrayDuplicate2(array, 'name');
    data = [
        { id: 4734, name: 'Tom', _count: 2 },
        { id: 4737, name: 'Tom', _count: 2 },
        { id: 4738, name: 'Danny', _count: 1 }
    ]
    */
    static arrayDuplicate2(array, keyName) {
        try {
            if (!(Array.isArray(array) && array.length)) {
                return array;
            }

            let counts = {};

            array.forEach((item) => {
                let value = item[keyName];
                counts[value] = (counts[value] || 0) + 1;
            });

            // 将重复次数添加到每个对象中
            let result = array.map((item) => {
                let value = item[keyName];
                let _count = counts[value];
                return { ...item, _count };
            });

            return result;
        } catch (error) {
            throw new Error(`Error-myutil-0027: ${error.message}`);
        }
    }

    /**
     * 获取一维数组中出现次数最多的元素
     * @param {*} array 
     */
    static arrayFindMostFrequent(array) {
        try {
            let occurrences = {};
            let maxElement = array[0];
            let maxCount = 1;

            for (let i = 0; i < array.length; i++) {
                let value = array[i];
                if (occurrences[value]) {
                    occurrences[value]++;
                } else {
                    occurrences[value] = 1;
                }

                if (occurrences[value] > maxCount) {
                    maxElement = value;
                    maxCount = occurrences[value];
                }
            }
            return maxElement;
        } catch (error) {
            throw new Error(`Error-myutil-0028: ${error.message}`);
        }
    }

    /**
     * 二维数组 行 和 列 兑换
     * @param {*} array 
     * @returns 
     */
    static arrayTranspose(array) {
        try {
            if (!(Array.isArray(array) && array.length)) {
                return array;
            }

            let rows = array.length;
            let cols = array[0].length;

            // 创建一个新的二维数组，交换行和列
            let array2 = [];
            for (let j = 0; j < cols; j++) {
                array2[j] = [];
                for (let i = 0; i < rows; i++) {
                    array2[j][i] = array[i][j];
                }
            }
            return array2;
        } catch (error) {
            throw new Error(`Error-myutil-0029: ${error.message}`);
        }
    }

    /**
    * 复制数据变量
    * @param {*} values 
    * @returns 
    */
    static deepCopy(values) {
        try {
            if (values === '') {
                return values;
            }
            return JSON.parse(JSON.stringify(values));
        } catch (error) {
            throw new Error(`Error-myutil-0030: ${error.message}`);
        }
    }

    /**
    * 数组倒序
    * 代替JS原始颠倒顺序的方法，不影响原数据的顺序
    * @param {*} array 
    * @returns 
    */
    static arrayReverse(array) {
        try {
            return [].concat(array).reverse();
        } catch (error) {
            throw new Error(`Error-myutil-0031: ${error.message}`);
        }
    }

    /**
     * 去掉数组中某一项
    * @param {*} array 
    * @param {*} value 
    */
    static arrayRemoveItem(array, value) {
        try {
            array = array.filter(function (item) {
                return item !== value;
            });
            return array;
        } catch (error) {
            throw new Error(`Error-myutil-0032: ${error.message}`);
        }
    }

    /**
      * 元素 value 在数组中出现的次数
     * @param {*} array 
     * @param {*} value 
     */
    static arrayOccurrences(array, value) {
        try {
            let count = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    count++;
                }
            }
            return count;
        } catch (error) {
            throw new Error(`Error-myutil-0033: ${error.message}`);
        }
    }

    /**
     * 去掉数组中空的元素
     * @param {*} array 
     */
    static removeEmptyItem(array) {
        const self = this;

        try {
            if (array && Array.isArray(array)) {
                array = array.filter(function (value) {
                    if (value && typeof value === 'string') {
                        return self.textTrim(value);
                    }
                    return true;
                });
            }
            return array;
        } catch (error) {
            throw new Error(`Error-myutil-0034: ${error.message}`);
        }
    }

    /**
    * 在数组中是否包含字符
    * @param {*} array
    * @param {*} value 
    * @returns 
    */
    static arrayIncludes(array, value) {
        try {
            if (!(Array.isArray(array) && array.length)) {
                return false;
            }

            value += '';
            if (!value) {
                return false;
            }

            let _toLower = (str) => {
                str = str + '';

                // '   NEW ARRIVAL'
                str = str.trim();

                // 字母大小写： NEW ARRIVAL
                str = str.toLowerCase();

                // 单词间隔： NEW      ARRIVAL
                str = str.replace(/\s+/g, ' ');

                return str;
            }

            array = array.map(val => _toLower(val));
            value = _toLower(value);

            for (let i = 0; i < array.length; i++) {
                let key = array[i];
                if (value.includes(key)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0035: ${error.message}`);
        }
    }

    /**
     * 分页 - 如5个帖文为一页，可以分多少页
     * @param {*} array 
     * @param {*} pageSize 
     * @returns 
     */
    /* 
    example:
    let pageCount = myUtil.getPaginatePageCount([1, 2, 3, 4, 5, 6], 2);
     */
    static getPaginatePageCount(array, pageSize) {
        try {
            pageSize = pageSize < 1 ? 1 : pageSize;
            pageSize = pageSize > array.length ? array.length : pageSize;
            return Math.ceil(array.length / pageSize);
        } catch (error) {
            throw new Error(`Error-myutil-0036: ${error.message}`);
        }
    }

    /**
     * 分页 - 如5个账号分，每个账号可以分多少个帖文
     * @param {*} array 
     * @param {*} pageSize 
     * @returns 
     */
    /* 
    example:
    let pageSize = myUtil.getPaginatePageSize([1, 2, 3, 4, 5, 6], 2);
     */
    static getPaginatePageSize(array, pageTotal) {
        try {
            pageTotal = pageTotal < 1 ? 1 : pageTotal;
            return Math.ceil(array.length / pageTotal);
        } catch (error) {
            throw new Error(`Error-myutil-0037: ${error.message}`);
        }
    }

    /**
     * 分页
     * @param {*} array 
     * @param {*} pageSize 
     * @param {*} pageNumber 
     * @returns 
     */
    /* 
    example:
    let data = myUtil.getPaginateItems([1, 2, 3, 4, 5, 6], 2, 1);
     */
    static getPaginateItems(array, pageSize, pageNumber) {
        try {
            pageSize = pageSize < 1 ? 1 : pageSize;
            pageSize = pageSize > array.length ? array.length : pageSize;

            let pageSizeMax = Math.ceil(array.length / pageSize);
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageNumber = pageNumber > pageSizeMax ? pageSizeMax : pageNumber;

            return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
        } catch (error) {
            throw new Error(`Error-myutil-0038: ${error.message}`);
        }
    }

    /**
    * 随机获取两个数字之间的值
    * @param {*} array 
    */
    /* 
    example:
    let timeRandom = myUtil.randomBetweenInt(2, 5);
    */
    static randomBetweenInt(min, max) {
        try {
            if (min > max) {
                let temp = min;
                min = max;
                max = temp;
            }

            min = Math.ceil(min);
            max = Math.floor(max + 1);
            return Math.floor(Math.random() * (max - min) + min);
        } catch (error) {
            throw new Error(`Error-myutil-0039: ${error.message}`);
        }
    }

    /* 
    example:
    let string = 1250;
    let random = myUtil.randomBetweenInt2(string, 10, 15);
    */
    /**
     * 根据种子变量的不同，随机获取两个数字之间的值
     * @param {*} string 字符串
     * @param {*} min 随机值的最小值
     * @param {*} max 随机值的最大值
     * @returns 
     */
    static randomBetweenInt2(string, min, max) {
        try {
            // 将字符串转为数字
            let _hashCode = (str) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    let char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash &= hash;
                }
                return hash;
            }

            let random = Math.abs(_hashCode(string));

            return random % (max - min + 1) + min;
        } catch (error) {
            throw new Error(`Error-myutil-0132: ${error.message}`);
        }
    }

    /**
     * 解析间隔时间的截取范围
     * @param {*} value 
     * @param {*} min 
     * @param {*} max 
     */
    /* 
    let data = myUtil.getIntervalRange('10~20', 3, 120);
    data =  { intMin: 15, intMax: 20 }
    */
    static getIntervalRange(value, min, max) {
        try {
            // let value = '3~120'
            let range = { intMin: min, intMax: max };

            let matches = String(value).match(/^(\d+)~(\d+)$/);
            if (matches) {
                let intMin = Number(matches[1]);
                let intMax = Number(matches[2]);

                if (intMin > 0 && intMax > 0 && intMin < intMax) {
                    intMin = intMin < min ? min : intMin;
                    intMin = intMin > max ? max : intMin;

                    intMax = intMax < min ? min : intMax;
                    intMax = intMax > max ? max : intMax;

                    return { intMin, intMax };
                }
            }

            return range;
        } catch (error) {
            throw new Error(`Error-myutil-0146: ${error.message}`);
        }
    }

    /**
     * 解析一个数字的范围
     * @param {*} value 
     * @param {*} default 
     * @param {*} min 
     * @param {*} max 
     */
    /* 
    let value = myUtil.getNumberRange('10', 5, 3, 120);
    value =  10
    */
    static getNumberRange(value, def, min, max) {
        const self = this;

        try {
            value = self.textTrim(value);

            value = String(value) ? value : def; // default
            value = !isNaN(value) ? value : def; // default

            value = parseInt(value);
            value = value < min ? min : value; // min
            value = value > max ? max : value; // max

            return value;
        } catch (error) {
            throw new Error(`Error-myutil-0147: ${error.message}`);
        }
    }

    /**
     * 随机序列号, 如 7112-8774-1678-1834
     * @param {*} groupCount 
     * @returns 
     */
    static randomSerialNumber(groupCount = 4) {
        try {
            let _random = () => {
                return Math.floor(Math.random() * 10000);
            }

            let arr = [];
            for (let i = 0; i < groupCount; i++) {
                arr.push(_random());
            }
            return arr.join('-');
        } catch (error) {
            throw new Error(`Error-myutil-0040: ${error.message}`);
        }
    }

    /**
     * 随机从数组中拿出一项
     * @param {*} array 
     * @returns 
     */
    /* 
    let type = myUtil.randomArrayItem(['comment', 'reply']);
    */
    static randomArrayItem(array) {
        const self = this;

        try {
            if (!(Array.isArray(array) && array.length)) {
                return array;
            }

            let index = self.randomBetweenInt(0, array.length - 1);
            return array[index];
        } catch (error) {
            throw new Error(`Error-myutil-0041: ${error.message}`);
        }
    }

    /**
     * 随机字符串
     * @param {*} length 
     * @returns 
     */
    /* 
    let essayRandomStr = myUtil.randomString(10);
    */
    static randomString(length) {
        try {
            let str = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                str += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return str;
        } catch (error) {
            throw new Error(`Error-myutil-0042: ${error.message}`);
        }
    }

    /**
     * 生成随机密码
     * @param {*} length 
     * @returns 
     */
    static randomPassword(length) {
        try {
            let str = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                str += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return str;
        } catch (error) {
            throw new Error(`Error-myutil-0043: ${error.message}`);
        }
    }

    /**
    * sleep
    * @param {*} ms 
    * @returns 
    */
    /* 
    await myUtil.sleep(2000);
    */
    static async sleep(ms) {
        try {
            return new Promise(resolve => setTimeout(resolve, ms));
        } catch (error) {
            throw new Error(`Error-myutil-0044: ${error.message}`);
        }
    }

    /**
     * 字符串转为小写
     * @param {*} str
     * @returns 
     */
    static strLowerCase(str) {
        try {
            if (str && typeof str === 'string') {
                return str.toLowerCase();
            }
            return str;
        } catch (error) {
            throw new Error(`Error-myutil-0045: ${error.message}`);
        }
    }

    /**
     * 字符串转为大写
     * @param {*} str 
     * @returns 
     */
    static strUpperCase(str) {
        try {
            if (str && typeof str === 'string') {
                return str.toUpperCase();
            }
            return str;
        } catch (error) {
            throw new Error(`Error-myutil-0046: ${error.message}`);
        }
    }

    /* 
    thanks for https://stackoverflow.com/a/3710506
    */
    /**
     * 是否是 JSON
     * @param {*} text 
     * @returns 
     */
    static isJson(text) {
        try {
            if (text && typeof text === 'string') {
                text = text.replace(/\\["\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '');
                if (/^[\],:{}\s]*$/.test(text)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0047: ${error.message}`);
        }
    }

    /**
     * 判断 obj 是否为空
     * @param {*} obj 
     * @returns 
     */
    static isObjectEmpty(obj) {
        try {
            if (obj && typeof obj === 'object') {
                return Object.keys(obj).length === 0;
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0048: ${error.message}`);
        }
    }

    /**
     * 是否是 邮箱
     * @param {*} text 
     * @returns 
     */
    static isEmail(text) {
        try {
            if (text && typeof text === 'string') {
                return text.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0049: ${error.message}`);
        }
    }

    /**
     * 是否是 手机号码
     * @param {*} text 
     * @returns 
     */
    static isPhone(text) {
        try {
            if (text && typeof text === 'string') {
                // 16469349327
                if (text.match(/^\d{9,12}$/)) {
                    return true;
                }

            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0050: ${error.message}`);
        }
    }

    /**
     * 是否是 facebook Id
     * @param {*} text 
     * @returns 
     */
    static isFacebookId(text) {
        try {
            text = text + '';
            if (text && typeof text === 'string') {
                // 购买的账号 100037445263860
                if (text.match(/^\d{7,20}$/)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0051: ${error.message}`);
        }
    }

    /**
    * 是否是 FB二步密钥
    * @param {*} text 
    * @returns 
    */
    static isFBAuthentication(text) {
        try {
            if (text && typeof text === 'string') {
                // UIDP EGCV E6RT MISK UDPA HDXN IFAQ ZKRD
                text = text.replace(/\s+/g, '');
                if (text.length !== 32) {
                    return false;
                }
                if (!text.match(/^[a-z0-9]+$/ig)) {
                    return false;
                }
                return true;
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0052: ${error.message}`);
        }
    }

    /**
     * 提示 msg
     * @param {*} result 
     */
    /* 
    example
    myUtil.msgColorText({ status: false, msg: xxxxx })
    */
    static msgColorText(result) {
        try {
            let { status, msg } = result;
            if (status) {
                msg = `<span class="text-success" role="alert">${msg}</span>`;
            } else {
                msg = `<span class="text-danger" role="alert">${msg}</span>`;
            }
            return msg;
        } catch (error) {
            throw new Error(`Error-myutil-0053: ${error.message}`);
        }
    }

    /**
     * 提示 msg
     * @param {*} result 
     */
    /* 
    example
    modal_color= myUtil.modalBgColor({ status: false })
    */
    static modalBgColor(result) {
        try {
            let { status } = result;
            if (status) {
                return 'modal-bg-success';
            } else {
                return 'modal-bg-danger';
            }
        } catch (error) {
            throw new Error(`Error-myutil-0054: ${error.message}`);
        }
    }

    /**
     * 把编码后的标检转换为html标签
     * @param {*} text 
     * @returns 
     */
    static unescapeHTML(text) {
        try {
            if (text && typeof text === 'string') {
                return text.replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'")
                    .replace(/&nbsp;/g, ' ');
            }
            return text;
        } catch (error) {
            throw new Error(`Error-myutil-0055: ${error.message}`);
        }
    }

    /**
     * Converting unicode character to string format
     * \u2211 -> ∑ \u0032 -> 2 \u222B -> ∫
     * thank for https://stackoverflow.com/questions/17267329/converting-unicode-character-to-string-format
     * @param {*} text 
     * @returns 
     */
    static unicodeToChar(text) {
        try {
            if (text && typeof text === 'string') {
                return text.replace(/\\u[\dA-F]{4}/ig, function (match) {
                    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
                });
            }
            return text;
        } catch (error) {
            throw new Error(`Error-myutil-0056: ${error.message}`);
        }
    }

    /**
     * 把参数转变为请求参数，如 {a: 'user', b: 'bar'} => a=user&b=bar
     * @param {*} params 
     * @returns 
     */
    /* 
    let params = {
        spreadsheetRole: 'spreadsheet-user',
        route: '/websocketpage',
        t: Date.now(),
    };
    let queryString = myUtil.paramsToQueryString(params);
    `?${queryString}
    */
    static paramsToQueryString(params) {
        try {
            return new URLSearchParams(params).toString();
        } catch (error) {
            throw new Error(`Error-myutil-0057: ${error.message}`);
        }
    }

    /**
     * 路径斜杠方向一致
     * @param {*} file 
     * @returns 
     */
    static pathSlashUnified(file) {
        try {
            return file.replace(/\\+/g, '/');
        } catch (error) {
            throw new Error(`Error-myutil-0058: ${error.message}`);
        }
    }

    /**
     * 头一个字母大写
     * @param {*} string 
     * @returns 
     */
    static capitalizeFirstLetter(string) {
        try {
            return string.charAt(0).toUpperCase() + string.slice(1);
        } catch (error) {
            throw new Error(`Error-myutil-0059: ${error.message}`);
        }
    }

    /**
    * 获取 谷歌表格Id, 和 工作表 Id
    * @param {*} link 
    * @returns 
    */
    static parseSpreadsheetLink(link) {
        try {
            // let link = 'https://docs.google.com/Spreadsheets/d/1EmoVd_k8iPC6sVf2edo2njn9-2AoUwk6gzFoZlbATQk/edit#gid=774846712'
            if (link && typeof link === 'string') {
                link = myUtil.standardLink(link);

                let matches = link.match(/https:\/\/docs\.google\.com\/spreadsheets\/d\/([^/]+)\/.+gid=([0-9]+)/i);
                if (matches) {
                    let [, spreadsheetId, sheetId] = matches;
                    return { spreadsheetId, sheetId };
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0060: ${error.message}`);
        }
    }

    /**
    * 获取 谷歌表格Id
    * @param {*} link 
    * @returns 
    */
    static getSpreadsheetId(link) {
        try {
            // let link = 'https://docs.google.com/Spreadsheets/d/1EmoVd_k8iPC6sVf2edo2njn9-2AoUwk6gzFoZlbATQk/edit#gid=774846712'
            if (link && typeof link === 'string') {
                let matches = link.match(/https:\/\/docs\.google\.com\/spreadsheets\/d\/([^/]+)\//i);
                if (matches) {
                    return matches[1];
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0149: ${error.message}`);
        }
    }

    /**
    * 获取 谷歌脚本 Id
    * @param {*} link 
    * @returns 
    */
    static getGoogleScriptId(link) {
        try {
            // https://script.google.com/home/projects/19L8FY8RIf...afzzFyqA412iF3u8LVB7UI1b/edit
            // https://script.google.com/u/0/home/projects/19L8FY8RIf...afzzFyqA412iF3u8LVB7UI1b/edit
            // https://script.google.com/u/1/home/projects/19L8FY8RIf...afzzFyqA412iF3u8LVB7UI1b/edit
            if (link && typeof link === 'string') {
                let matches = link.match(/https:\/\/script\.google\.com(?:\/u\/\d+)?\/home\/projects\/([^/]{40,80})\/edit/i);
                return matches ? matches[1] : null;
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0061: ${error.message}`);
        }
    }

    /**
    * 获取 谷歌部署 Id
    * @param {*} link 
    * @returns 
    */
    static getGoogleDeployId(link) {
        try {
            // https://script.google.com/macros/s/AKfycbxfiHPVQF...tki12X5XU9ySgCbsjayH--LsIGcruc3Xfw5j/exec
            if (link && typeof link === 'string') {
                let matches = link.match(/https:\/\/script\.google\.com\/macros\/s\/([^/]{40,80})\/exec/i);
                return matches ? matches[1] : null;
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0062: ${error.message}`);
        }
    }

    /**
     * 从谷歌云端目录路径获取文件夹ID
     * @param {*} link 
     * @returns 
     */
    /* 
    let folderId = myUtil.getGoogleFolderId(link);
    */
    static getGoogleFolderId(link) {
        try {
            // https://drive.google.com/drive/folders/1iB1cfz7itZi-IOcH--aYhpm9-7ZLnFSc
            if (link && typeof link === 'string') {
                let matches = link.match(/https:\/\/drive\.google\.com\/drive\/folders\/([^/]{20,40})/i);
                return matches ? matches[1] : null;
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0136: ${error.message}`);
        }
    }

    /**
     * 检查谷歌云端服务账号密钥格式
     * @param {*} text  credentials 实际是JSON，但保存到数据库后是文本
     * @returns 
     */
    /* 
    let isCredentials = myUtil.isGoogleCredentials(text);
    */
    static isGoogleCredentials(text) {
        try {
            if (text && typeof text === 'string') {
                if (!text.match(/"(type)"/)) {
                    return false;
                }
                if (!text.match(/"(project_id)"/)) {
                    return false;
                }
                if (!text.match(/"(private_key_id)"/)) {
                    return false;
                }
                if (!text.match(/"(private_key)"/)) {
                    return false;
                }
                if (!text.match(/"(client_email)"/)) {
                    return false;
                }
                if (!text.match(/"(client_id)"/)) {
                    return false;
                }
                if (!text.match(/"(auth_uri)"/)) {
                    return false;
                }
                if (!text.match(/"(token_uri)"/)) {
                    return false;
                }
                if (!text.match(/"(client_x509_cert_url)"/)) {
                    return false;
                }
                if (!text.match(/"(universe_domain)"/)) {
                    return false;
                }

                return true;
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0137: ${error.message}`);
        }
    }

    /**
     * 是否是谷歌邮箱
     * @param {*} email 
     * @returns 
     */
    /* 
    let isGmail = myUtil.isGmail(email);
    */
    static isGmail(email) {
        try {
            // xxx@gmail.com
            if (email && typeof email === 'string') {
                if (email.match(/^[^@.]+@gmail\.com$/i)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0136: ${error.message}`);
        }
    }

    /**
    * 从链接中获取 post id （支持 fb 和 vk）
    * @param {*} link 
    * @returns 
    */
    static getEssayIdFromLink(link) {
        const self = this;

        try {
            if (!(link && typeof link === 'string')) {
                return null;
            }

            let matches = null;

            // vk
            if (link.match(/vk\.com/i)) {
                // https://vk.com/httpschat.whatsapp.comlkjgko?w=wall-181535376_4759
                // https://vk.com/feed?w=wall-143135862_133556
                // https://vk.com/kerem__bursin?w=wall660502632_830
                matches = link.match(/\?w=(wall-?[\d_]{12,})/);
                if (matches) {
                    return matches[1];
                }

                // https://vk.com/feed?section=groups&w=wall-217130479_59592
                // https://vk.com/al_feed.php?section=groups&w=wall-217130479_61035
                matches = link.match(/vk\.com\/[^/?#&%]+\?section=groups&w=([^/?#&%]+)/i);
                if (matches) {
                    return matches[1];
                }
            }

            /* 
            https://www.facebook.com/groups/1799139950373955/permalink/3182604228694180
            https://www.facebook.com/groups/953882868416800/pending_posts/?post_id=1372250083246741&search=
            */
            // 实际 postid 是 15 位数字，但不确定, 有一次遇到过9位的老号，就用 9 保险一些
            if (link.match(/^\d{9,}$/g)) {
                return link;
            }

            // 20240509 multi_permalinks 打开的是小组的时间线差不多，有很多帖文，按理说就不是一个单独帖文的链接，但已经这样写很久了，就不修改了
            // https://www.facebook.com/groups/1721815804831972/?multi_permalinks=2327353497611530%2C2322907414722805%2C2322918884721658%2C2322932804720266%2C2322932521386961%2C2322901268056753%2C2322017951478418%2C2322002664813280%2C2322013718145508%2C2322008338146046&notif_id=1714214472743432&notif_t=group_highlights&ref=notif

            link = link.replace(/(multi_permalinks=|post_id=|story_fbid=|\/user\/|\/pending_posts\/|\/permalink\/)/ig, '/posts/');
            matches = link.match(/\/posts\/(\d+)/);
            if (matches) {
                return matches[1];
            }

            // 帖文ID为字母 的链接 
            // https://www.facebook.com/BibleandGod/posts/pfbid0hBHUdaeCvHCbGnuzCpULEAUaqvqfxXAaBFufqzVKxmBLiubbtwFWPtZq5Dh99Y14l
            // https://www.facebook.com/BibleandGod/posts/pfbid02ku5fqtYJaxfCsW6Ax3iqQFLRxhGqY2CPWkpyiM78iq1VpyCmvsrgGbFomkCDv7kVl?__cft__[0]=
            matches = link.match(/\/posts\/([\w_]{30,})/);
            if (matches) {
                return matches[1];
            }

            // 如果没有找到，也有可能匹配规则没有考虑到，再尝试执行
            let res = self.getLinkObjectFromLink(link);
            if (res) {
                let { groupId, linkId } = res;
                return linkId ? linkId : null;
            }

            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0063: ${error.message}`);
        }
    }

    /**
     * 从链接中获取 cft ID
     * @param {*} link 
     * @returns 
     */
    /* 
    说明：这个cft，是随机生成的，只有单独那个帖相同，给其它帖不一样，页面刷新后就改变了
    */
    static getCftIdFromLink(link) {
        const self = this;

        try {
            link = self.textTrim(link + '');
            if (link) {
                // /groups/279174479502425/user/100083579520964/?__cft__[0]=AZWgbvQrlX-bvj9XJGTbAVCTJZsODs0Rr...VCHf0A&__tn__=%2CP-R
                let matches = link.match(/__cft__\[0\]=([^=&"?]+)/);
                if (matches) {
                    return matches[1];
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0138: ${error.message}`);
        }
    }

    /**
     * 从链接中获取链接ID
     * @param {*} link 
     * @returns 
     */
    static getStuffId(link) {
        const self = this;

        try {
            link = String(link).trim();

            if (link && link.includes('__text__')) {
                return link;
            }

            return self.getEssayIdFromLink(link) || self.getGroupIdFromLink(link) || self.getReelIdFromLink(link) || self.getLiveIdFromLink(link) || self.getPhotoIdFromLink(link) || self.getUserIdFromLink(link);
        } catch (error) {
            throw new Error(`Error-myutil-0123: ${error.message}`);
        }
    }

    /**
     * 从链接中获取链接尽可能多的ID
     * @param {*} link 
     * @returns 
     */
    /* 
    let linkIds = myUtil.getLinkIds(link);
    */
    static getLinkIds(link) {
        const self = this;

        /* 
        https://www.facebook.com/groups/739196984566179/?hoisted_section_header_type=recently_seen&mu
        https://www.facebook.com/groups/402540638150365/user/100003385002130/?__cft__[0]=AZUk5WMlP
        https://www.facebook.com/profile.php?id=100091405761249&__cft__[0]=AZXWSSVcXbE
        */

        try {
            let linkIds = [];

            let linkId = null;
            linkId = self.getEssayIdFromLink(link);
            if (linkId) {
                linkIds.push(linkId);
            }

            linkId = self.getGroupIdFromLink(link);
            if (linkId) {
                linkIds.push(linkId);
            }

            linkId = self.getReelIdFromLink(link);
            if (linkId) {
                linkIds.push(linkId);
            }

            linkId = self.getLiveIdFromLink(link);
            if (linkId) {
                linkIds.push(linkId);
            }

            linkId = self.getPhotoIdFromLink(link);
            if (linkId) {
                linkIds.push(linkId);
            }

            linkId = self.getUserIdFromLink(link);
            if (linkId) {
                linkIds.push(linkId);
            }

            return self.arrayUnique(linkIds);
        } catch (error) {
            throw new Error(`Error-myutil-0135: ${error.message}`);
        }
    }

    /**
    * 从链接中获取小组链接 （支持 fb 和 vk）
    * @param {*} url 
    * @returns 
    */
    static getGroupLinkFromLink(url) {
        const self = this;

        try {
            url = self.textTrim(url + '');
            if (url) {
                // vk
                if (url.match(/vk\.com/i)) {
                    // https://vk.com/httpschat.whatsapp.comlkjgko?w=wall-181535376_4759
                    // https://vk.com/kerem__bursin?w=wall660502632_830
                    if (url.match(/\?w=/)) {
                        return url.substring(0, url.indexOf('?w='));
                    }
                }

                // 常规的链接
                // https://www.facebook.com/groups/1799139950373955/posts/2164091283878818/

                // 帖文ID为字母 的链接 
                // https://www.facebook.com/BibleandGod/posts/pfbid0hBHUdaeCvHCbGnuzCpULEAUaqvqfxXAaBFufqzVKxmBLiubbtwFWPtZq5Dh99Y14l
                // https://www.facebook.com/BibleandGod/posts/pfbid02ku5fqtYJaxfCsW6Ax3iqQFLRxhGqY2CPWkpyiM78iq1VpyCmvsrgGbFomkCDv7kVl?__cft__[0]=
                if (url.match(/\/posts\//)) {
                    return url.substring(0, url.indexOf('/posts/'));
                }

                /* 
                https://www.facebook.com/groups/1799139950373955/permalink/3182604228694180
                https://www.facebook.com/groups/953882868416800/pending_posts/?post_id=1372250083246741&search=
                */
                url = url.replace(/(multi_permalinks=|post_id=|story_fbid=|\/user\/|\/pending_posts\/|\/permalink\/)/ig, '/posts/');
                if (url.match(/\/posts\//)) {
                    return url.substring(0, url.indexOf('/posts/'));
                }

                let matches = null;

                // https://www.facebook.com/TheBeanBoltShow/videos/1865497473845347/
                // https://www.facebook.com/100090435586184/videos/1019582446152516
                matches = url.match(/www\.facebook\.com\/([^/]+)\/videos\/\d+\/?/);
                if (matches) {
                    let groupId = matches[1];
                    if (groupId.match(/^\d+$/)) {
                        return `https://www.facebook.com/profile.php?id=${groupId}`;
                    }
                    return `https://www.facebook.com/${groupId}`;
                }

                // https://www.facebook.com/profile.php?id=100090435586184&__tn__=-]C-R
                matches = url.match(/\/profile\.php\?id=(\d+)/);
                if (matches) {
                    let groupId = matches[1];
                    return `https://www.facebook.com/profile.php?id=${groupId}`;
                }

                // https://www.facebook.com/watch/100090513579708
                matches = url.match(/\/watch\/(\d+)/);
                if (matches) {
                    let groupId = matches[1];
                    if (groupId.match(/^\d+$/)) {
                        return `https://www.facebook.com/profile.php?id=${groupId}`;
                    }
                    return `https://www.facebook.com/${groupId}`;
                }


            }
            return url;
        } catch (error) {
            throw new Error(`Error-myutil-0064: ${error.message}`);
        }
    }

    /**
     * 在链接后面加上 photos_by
     * @param {*} linkUrl 
     * @returns 
     */
    static getLinkTabPhoto(linkUrl) {
        try {
            // linkUrl = 'https://www.facebook.com/WonderfulFGaBT.Kateown/photos_by';
            // linkUrl = 'https://www.facebook.com/profile.php?id=100093323380609&sk=photos_by';

            linkUrl = linkUrl.replace(/(&sk=photos_by|\/photos_by)+/ig, '');

            let linkType = myUtil.getLinkType2FromLink(linkUrl);
            if (linkType === 'pages-main') {
                let groupId = myUtil.getGroupIdFromLink(linkUrl);

                if (groupId.match(/^\d+$/)) {
                    linkUrl = `${linkUrl}&sk=photos_by`;
                } else {
                    linkUrl = `${linkUrl}/photos_by`;
                }
            }

            return linkUrl;
        } catch (error) {
            throw new Error(`Error-myutil-0065: ${error.message}`);
        }
    }

    /**
     * 在链接后面加上 about
     * @param {*} linkUrl 
     * @returns 
     */
    static getLinkTabAbout(linkUrl) {
        try {
            // linkUrl = 'https://www.facebook.com/WonderfulFGaBT.Kateown/about';
            // linkUrl = 'https://www.facebook.com/profile.php?id=100093323380609&sk=about';

            linkUrl = linkUrl.replace(/(&sk=about|\/about)+/ig, '');

            let linkType = myUtil.getLinkType2FromLink(linkUrl);
            if (linkType === 'pages-main') {
                let groupId = myUtil.getGroupIdFromLink(linkUrl);

                if (groupId.match(/^\d+$/)) {
                    linkUrl = `${linkUrl}&sk=about`;
                } else {
                    linkUrl = `${linkUrl}/about`;
                }
            }

            return linkUrl;
        } catch (error) {
            throw new Error(`Error-myutil-0066: ${error.message}`);
        }
    }

    /**
     * 判断远程文件是否存在 JS
     * @param {*} urlFile 
     * @returns 
     */
    static checkRemoteFileExistsJs(urlFile) {
        try {
            let xhr = new XMLHttpRequest();
            xhr.open('HEAD', urlFile, false);
            xhr.send();

            if (xhr.status === '404') {
                return false;
            }
            return true;
        } catch (error) {
            throw new Error(`Error-myutil-0067: ${error.message}`);
        }
    }

    /**
    * 从链接中获取 小组 对象
    * @param {*} link 
    * @returns 
    */
    /* 
    watch-main
    watch-single
    
    videos-main
    videos-single

    groups-main
    groups-single

    users-single

    pages-main
    pages-single

    users-main
    users-single

    groups-single

    */
    /* 
    推荐使用：
    // groups / pages / videos / reel / watch / users
    let listenType = await myUtil.getListenLinkType2(link);
    */
    static getLinkObjectFromLink(link) {
        const self = this;

        try {
            if (link && typeof link === 'string') {
                let matches = null;

                link = self.standardLink(link);

                link = link.replace(/\/+$/g, '');

                // https://www.facebook.com
                matches = link.match(/\.facebook\.com\/?$/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'home', groupId: null, linkId: 'home' };
                }

                // 视频两种链接 start
                /* 
                https://www.facebook.com/watch/FaithWithGodPosts
                https://www.facebook.com/watch/?v=910217430418300
                
                https://www.facebook.com/FaithWithGodPosts/videos
                https://www.facebook.com/FaithWithGodPosts/videos/?ref=page_internal
                https://www.facebook.com/FaithWithGodPosts/videos/1318434675358509
                */

                // https://www.facebook.com/watch/?v=910217430418300
                matches = link.match(/\.facebook\.com\/watch\/?\?v=([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'watch-single', groupId: null, linkId: matches[1] };
                }

                // https://www.facebook.com/watch/live/?ref=watch_permalink&v=1638986156575904
                matches = link.match(/\.facebook\.com\/watch\/live\/[^/]*?[?&]+v=([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'watch-single', groupId: null, linkId: matches[1] };
                }

                // https://www.facebook.com/watch/FaithWithGodPosts
                matches = link.match(/\.facebook\.com\/watch\/([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'watch-main', groupId: matches[1], linkId: null };
                }

                // https://www.facebook.com/reel/865394845147311/?s=single_unit
                matches = link.match(/\.facebook\.com\/reel\/(\d+)/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'reel-single', groupId: null, linkId: matches[1] };
                }

                // https://www.facebook.com/FaithWithGodPosts/videos/1318434675358509
                matches = link.match(/\.facebook\.com\/([^/?#&%]+)\/videos\/([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'videos-single', groupId: matches[1], linkId: matches[2] };
                }

                // https://www.facebook.com/FaithWithGodPosts/videos
                matches = link.match(/\.facebook\.com\/([^/?#&%]+)\/videos\/?/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'videos-main', groupId: matches[1], linkId: null };
                }

                // 视频两种链接 end

                // facebook
                // https://www.facebook.com/groups/459254339
                // => 459254339

                // 小组 start

                // https://www.facebook.com/groups/338988747477004/posts/737649047610970/?mibextid=6NoCDW
                // https://www.facebook.com/groups/HageeMinistries/posts/3420968618149924/
                matches = link.match(/\.facebook\.com\/groups\/([^/?#&%]+)\/posts\/([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'groups-single', groupId: matches[1], linkId: matches[2] };
                }

                /* 
                https://www.facebook.com/groups/338988747477004/
                */
                matches = link.match(/\.facebook\.com\/groups\/([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'groups-main', groupId: matches[1], linkId: null };
                }

                // 注意：1. 这是专页链接
                // 注意：2. 这个链接id是专页的数字ID, 但是在浏览器打开时，会跳转成专页英文名的ID，所以是数字ID，就跟小组ID格式就是一样的，分别不出来
                // https://www.facebook.com/permalink.php?story_fbid=pfbid0BrhUyYJRshDuVb4Y7uDTfZPRvyrepYLu4s5HPMyBfcEkJgvG3gzpqXzm7KNtEJ2Rl&id=103954619198161
                // https://www.facebook.com/permalink.php?story_fbid=pfbid02iBKzGFpae5eXgyWj3tzLtoBBJAW5crgiwvphEZLbsFQTu8gAuMMqPfxFLNe2n8Mwl&id=107743848911916&comment_id=1424868218051942&reply_comment_id=188662783920139
                if (link.match(/www\.facebook\.com\/permalink\.php/i) && link.match(/[?&]story_fbid=[^&=/]+/i) && link.match(/[?&]id=[^&=/]+/i)) {
                    let search = link.replace(/^.+\?/, '');
                    let searchParams = new URLSearchParams(search);
                    let story_fbid = searchParams.get('story_fbid');
                    let id = searchParams.get('id');

                    // return { platform: 'platform-fb', linkType2: 'pages-single', groupId: story_fbid, linkId: id };
                    // 11-28 id=103954619198161 是小组ID
                    return { platform: 'platform-fb', linkType2: 'pages-single', groupId: id, linkId: story_fbid };
                }

                // #1
                // 注意：这里的位置需要放在 #2 的上方
                // 这链接跟专页的链接很像，但它是个人链接
                // https://www.facebook.com/kathy.bradley.9843?comment_id=Y29tbWVudDoxNzcwNjc5NDUyMjAxNjFfMTU3NzE2MDU5Mjc5NDU1NQ%3D%3D
                matches = link.match(/www\.facebook\.com\/((?:\w+\.)(?:\w+\.)?(?:\w+)?)\?comment_id=/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'users-single', groupId: null, linkId: matches[1] };
                }

                /*
                #2
                // 注意：这里的位置需要放在 #1 的下方

                专页
                
                */

                // https://www.facebook.com/BelieveinCatholicism/posts/pfbid0coNh6armNvFiYhYRznTgdd28tYDZKcVSj4JLHWNpHZyJceYGXckd2n5mD6kXDm4Ql
                matches = link.match(/\.facebook\.com\/([^/?#&%]+)\/posts\/([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'pages-single', groupId: matches[1], linkId: matches[2] };
                }

                // 不知怎么区分个人主页，还是专页了，两个链接是一样的
                // https://www.facebook.com/profile.php?id=100092989048047
                matches = link.match(/www\.facebook\.com\/profile\.php\?id=(\d+)/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'pages-main', groupId: matches[1], linkId: null };
                }

                // https://www.facebook.com/BelieveinCatholicism
                // https://www.facebook.com/BelieveinCatholicism/
                // https://www.facebook.com/Gain-Gods-Salvation-103954619198161/?comment_id=Y29tbWVudDoxNzcwNjc5NDUyMjAxNjFfNzQxNDI1ODE3MzMxNzQ1
                // https://www.facebook.com/155171481023398
                matches = link.match(/\.facebook\.com\/([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-fb', linkType2: 'pages-main', groupId: matches[1], linkId: null };
                }

                // ---------------------

                // https://vk.com/
                matches = link.match(/\.vk\.com\/?$/i);
                if (matches) {
                    return { platform: 'platform-vk', linkType2: 'home', groupId: null, linkId: 'home' };
                }

                // vk 个人

                // https://vk.com/id529371697?w=wall529371697_2507
                matches = link.match(/vk\.com\/(id[^/?#&%]+)\/?\?w=([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-vk', linkType2: 'users-single', groupId: matches[1], linkId: matches[2] };
                }

                // https://vk.com/id529371697
                matches = link.match(/vk\.com\/(id[^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-vk', linkType2: 'users-main', groupId: matches[1], linkId: null };
                }

                // https://vk.com/feed?section=groups&w=wall-217130479_59592
                // https://vk.com/al_feed.php?section=groups&w=wall-217130479_61035
                matches = link.match(/vk\.com\/[^/?#&%]+\?section=groups&w=([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-vk', linkType2: 'groups-single', groupId: null, linkId: matches[1] };
                }

                // vk 小组
                // https://vk.com/religionpablic?w=wall-56370215_961461
                // https://vk.com/wall-217130479_57557?w=wall-217130479_57557
                matches = link.match(/vk\.com\/([^/?#&%]+)\/?\?w=([^/?#&%]+)/i);
                if (matches) {
                    return { platform: 'platform-vk', linkType2: 'groups-single', groupId: matches[1], linkId: matches[2] };
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0068: ${error.message}`);
        }
    }

    /**
     * 转换链接短的类型
     * @param {*} linkTypeX 值有多种方式：如有可能是 groups 也有可能是 groups-main
     * @returns 
     */
    /* 
    watch-main => watch
    videos-main => videos
    groups-main => groups
    pages-main => pages

    let linkType =  myUtil.resetLinkType(linkType2);
    */
    static resetLinkType(linkTypeX) {
        try {
            if (!linkTypeX) {
                return null;
            }
            return linkTypeX.split('-')[0];
        } catch (error) {
            throw new Error(`Error-myutil-0069: ${error.message}`);
        }
    }

    /**
     * 从链接中获取类型 linkType2
     * @param {*} link 
     * @returns 
     */
    static getLinkType2FromLink(link) {
        const self = this;

        try {
            if (link && typeof link === 'string') {
                let params = self.getLinkObjectFromLink(link);
                if (params) {
                    let { linkType2 } = params;
                    return linkType2;
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0070: ${error.message}`);
        }
    }

    /**
     * 判断顶帖表链接类型（这函数只是判断顶帖表的链接，比 getLinkObjectFromLink 函数简单）
     * @param {*} link 
     * @returns 
     */
    /* 
    let linkType = myUtil.getListenLinkType(link);
    */
    static getListenLinkType(link) {
        try {
            if (!(link && typeof link === 'string')) {
                return 'unknown';
            }

            if (link.match(/www\.facebook\.com\/?$/)) {
                return 'home';
            }

            // https://www.facebook.com/groups/707674783766388/posts/1017044576162739/
            if (link.match(/\/posts\/\d+/)) {
                return 'post';
            }

            // https://www.facebook.com/GodsSheepSeekingGodsFootsteps/posts/pfbid02RstutrJJ7EmN8GQtGaVXRMrUEtvMQ9aXAv6W52QtidMF3EWcCWM8it9xist9t1A5l
            if (link.match(/\/[\w]+\/posts\/[\w]+/)) {
                return 'post';
            }

            // https://www.facebook.com/permalink.php?story_fbid=pfbid09fo7HtssdgN7ourLsHxrMM1sRuyowLJPsvMfudttcfzwBkFEzJN1uxtpZEYPHr3ql&id=100092989048047
            if (link.match(/\/permalink\.php\?story_fbid=[\w]+/)) {
                return 'post';
            }

            // https://www.facebook.com/groups/1296268581253660/pending_posts/?search=&has_selection=false&is_notif_background=false&post_id=1313539652859886
            if (link.match(/\/pending_posts\//)) {
                return 'post';
            }

            // https://www.facebook.com/groups/catholicfaith2023/permalink/2280814072118626
            if (link.match(/\/permalink\//)) {
                return 'post';
            }

            // 专页Watch主页面视频
            // https://www.facebook.com/watch/theveilislifted
            if (link.match(/www\.facebook\.com\/watch\//)) {
                return 'watch';
            }

            // https://www.facebook.com/reel/738248734732022
            if (link.match(/\/reel\/\d+/)) {
                return 'reel';
            }

            // https://www.facebook.com/profile.php?id=100092989048047&sk=reels_tab
            // https://www.facebook.com/Fishermanshortvideo/reels_tab
            if (link.match(/www\.facebook\.com\//) && link.match(/(&sk=reels_tab|\/reels_tab)/)) {
                return 'reels';
            }

            // https://www.facebook.com/100090513579708/videos/1400534977549416
            if (link.match(/www\.facebook\.com\//) && link.match(/\/videos\/\d+/)) {
                return 'videos';
            }


            return 'unknown';
        } catch (error) {
            throw new Error(`Error-myutil-0071: ${error.message}`);
        }
    }

    /**
     * 判断顶帖表链接类型2（这函数只是判断顶帖表的链接，比 getLinkObjectFromLink 函数简单）
     * @param {*} link 
     * @returns groups / pages / videos / reel / watch / users
     */
    /* 
    // groups / pages / videos / reel / watch / users
    let listenType = await myUtil.getListenLinkType2(link);
     */
    static getListenLinkType2(link) {
        const self = this;

        try {
            let _getLinkType2 = (link) => {
                let params = self.getLinkObjectFromLink(link);
                return params ? params.linkType2 : 'unknown';
            }

            let _resetLinkType = (linkType) => {
                if (!linkType) {
                    return null;
                }
                return linkType.split('-')[0];
            }

            // 主要针对顶帖表里的链接
            let listenType = self.getListenLinkType(link);
            if (listenType === 'unknown') {
                // 主要针对互动表里的链接
                let linkType = _getLinkType2(link);
                return _resetLinkType(linkType);
            }

            return listenType;
        } catch (error) {
            throw new Error(`Error-myutil-0121: ${error.message}`);
        }
    }

    /**
    * 从链接中获取 小组ID / 专页ID
    * @param {*} link 
    * @returns 
    */
    /* 
    说明：有两种获取小组ID的方法：

    // 从链接获取小组ID
    let groupId = myUtil.getGroupIdFromLink(groupLink);
    
    // 从页面代码中获取小组ID，这个方式可以获得原始的小组，而不是Slug
    let pageContent = await page.content();
    let groupId = await myFacebook.getGroupIdBySlug(pageContent, groupLink);
    */
    static getGroupIdFromLink(link) {
        const self = this;

        try {
            if (link && typeof link === 'string') {
                let res = self.getLinkObjectFromLink(link);
                if (res) {
                    let { groupId, linkId } = res;
                    return groupId ? groupId : null;
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0072: ${error.message}`);
        }
    }

    /**
    * 用 帖文链接 转换成 一个小组链接
    * @param {*} essayLink 
    * @returns 
    */
    static getGroupLinkFromEssayLink(essayLink) {
        const self = this;

        try {
            if (essayLink) {
                let params = self.getLinkObjectFromLink(essayLink);
                if (params) {
                    let { platform, linkType2, groupId, linkId } = params;

                    if (platform === 'platform-vk') {
                        return `https://vk.com/${linkId}`;
                    }

                    if (platform === 'platform-fb') {
                        if (linkType2 === 'groups-main') {
                            return `https://www.facebook.com/groups/${groupId}/`;
                        }
                        else if (linkType2 === 'groups-single') {
                            return `https://www.facebook.com/groups/${groupId}/`;
                        }

                        // 专页的链接会发生跳转，专页的链接不做处理
                        // https://www.facebook.com/permalink.php?story_fbid=pfbid0qvCUA9MBjZ1K56bKAEoLgh6Eqa3iW9pm5GGsH46dvvoSVukF1MSt7G6BtgcfzKxHl&id=100295522923980
                    }
                }
            }
            return essayLink;
        } catch (error) {
            throw new Error(`Error-myutil-0073: ${error.message}`);
        }
    }

    /**
    * 从链接中获取 User ID
    * @param {*} link 
    * @returns 
    */
    static getUserIdFromLink(link) {
        const self = this;

        try {
            if (link && typeof link === 'string') {
                let matches = null;

                // /friends/suggestions/?profile_id=100081102407842
                matches = link.match(/\/friends\/suggestions\/\?profile_id=([^/?#&%]+)/i);
                if (matches) {
                    return matches[1];
                }

                // /messages/t/61551691445967/
                matches = link.match(/\/messages\/t\/([^/?#&%]+)\/?/i);
                if (matches) {
                    return matches[1];
                }

                // /groups/621403755226825/user/100071481467617/?__cft__
                // => 100071481467617
                matches = link.match(/\/groups\/[^/]+\/user\/([^/?#&%]+)/i);
                if (matches) {
                    return matches[1];
                }

                // 不知怎么区分个人主页，还是专页了，两个链接是一样的
                // https://www.facebook.com/ollie.shaw.113
                // https://www.facebook.com/profile.php?id=100071481467617
                let groupId = self.getGroupIdFromLink(link);
                if (groupId) {
                    return groupId;
                }

            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0074: ${error.message}`);
        }
    }

    /**
    * 使 Facebook 的链接完整
    * @param {*} link 
    * @returns 
    */
    static makeFBLinkFull(link) {
        try {
            link = link + '';

            if (link && link.match(/^\//i)) {
                link = `https://www.facebook.com${link}`;
            }

            if (link) {
                link = link.replace(/\/+$/, '');
            }
            return link;
        } catch (error) {
            throw new Error(`Error-myutil-0075: ${error.message}`);
        }
    }

    /**
     * 使 vk 的链接完整
     * /id197358138 => https://vk.com/id197358138
     * @param {*} link 
     * @returns 
     */
    static makeVKLinkFull(link) {
        try {
            link = link + '';

            if (link && link.match(/^\/id/i)) {
                link = `https://vk.com${link}`;
            }

            if (link) {
                link = link.replace(/\/+$/, '');
            }
            return link;
        } catch (error) {
            throw new Error(`Error-myutil-0076 ${error.message}`);
        }
    }

    /**
     * 使链接标准化
     */
    /* 
    link = myUtil.standardLink(link);
    */
    static standardLink(link) {
        try {
            if (!(link && typeof link === 'string')) {
                return link;
            }

            // google link
            if (link.match(/\.google\.com/i)) {
                // https://drive.google.com/file/d/14_3KLf8i4uHJRDUG4wEH3gLnxsTs3Q2w/view?pli=1
                link = link.replace(/\/view\?pli=\d+$/g, '/view');

                // https://docs.google.com/spreadsheets/d/1VeXqlE-u8ARWVUG4xx1nO0SNS3hIZ6fUCfrccxXrgUQ/edit?gid=179484002#gid=179484002
                link = link.replace(/\/edit\?gid=(\d+)#gid=\d+$/g, '/edit#gid=$1');

                // https://docs.google.com/spreadsheets/d/1SwsI7rVTS_V23Rg59EgWNpH9N_I8d4GMTPgngTOVemU/edit?pli=1#gid=817036011
                link = link.replace(/\/edit\?pli=\d+#gid=(\d+)$/g, '/edit#gid=$1');

                // https://docs.google.com/spreadsheets/d/1SwsI7rVTS_V23Rg59EgWNpH9N_I8d4GMTPgngTOVemU/edit?pli=1&gid=1050317513#gid=1050317513
                link = link.replace(/\/edit\?[^#]+#gid=(\d+)$/g, '/edit#gid=$1');

                // 格式兼容
                /* 
                https://docs.google.com/spreadsheets/d/1I-WIRkQZFpePqXaXO9KCifpwqSZL9byyFS6wRdb2IC8/edit?usp=sharing
                =>
                https://docs.google.com/spreadsheets/d/1I-WIRkQZFpePqXaXO9KCifpwqSZL9byyFS6wRdb2IC8/edit#gid=0
                */
                link = link.replace(/\/edit\?usp=.+$/i, '/edit#gid=0');

                /* 
                https://docs.google.com/spreadsheets/d/1I-WIRkQZFpePqXaXO9KCifpwqSZL9byyFS6wRdb2IC8/edit
                =>
                https://docs.google.com/spreadsheets/d/1I-WIRkQZFpePqXaXO9KCifpwqSZL9byyFS6wRdb2IC8/edit#gid=0
                */
                link = link.replace(/\/edit$/i, '/edit#gid=0');
            }

            // https://fb.com
            link = link.replace(/https:\/\/fb\.com/i, 'https://www.facebook.com');

            // https://www.fb.com
            link = link.replace(/https:\/\/www\.fb\.com/i, 'https://www.facebook.com');

            // https://facebook.com
            link = link.replace(/https:\/\/facebook\.com/i, 'https://www.facebook.com');

            // https://www.facebook.com/people/Jesus-Words-and-Prayer/61552699156557/
            link = link.replace(/facebook\.com\/people\/([^/]+)/i, 'facebook.com/$1');

            // 2024-11-10
            // https://www.facebook.com/groups/cslewisofficial/posts/d41d8cd9/10161132934723520/
            link = link.replace(/\/posts\/d[\w]+\/(\d{10,})/g, '/posts/$1');

            // 2024-11-10
            // https://www.facebook.com/groups/cslewisofficial/posts/we-need-not-despair-even-in-our-worst-for-our-failures-are-forgiven-the-only-fat/10161133362378520/
            // slug部分，以 - 结尾
            // https://www.facebook.com/groups/1195150824204590/posts/lord-i-pray-that-this-nation-returns-to-you-we-need-you-jesus-bring-revival-and-/2269925236727138/
            // 如果slug部分，以 - 开始
            // https://www.facebook.com/groups/1195150824204590/posts/-lord-i-pray-that-this-nation-returns-to-you-we-need-you-jesus-bring-revival-and/2269925236727138/
            link = link.replace(/\/posts\/[^/]+\/(\d{10,})/g, '/posts/$1');

            return link;
        } catch (error) {
            throw new Error(`Error-myutil-0140 ${error.message}`);
        }
    }

    /**
     * 美化链接
     * @param {*} link 
     * @returns 
     */
    static pureLink(link) {
        const self = this;

        try {
            if (!(link && typeof link === 'string')) {
                return link;
            }

            link = link + '';

            link = self.standardLink(link);

            // 排除 vk
            // https://vk.com/public215587024?w=wall-215587024_8274
            // /wall529371697_2507
            // /wall-215587024_46315
            if (link.match(/vk\.com/i)) {
                //
            }
            else if (link.match(/^\/wall/i)) {
                link = `https://vk.com${link}`;
            }

            // facebook link
            else {
                // 不能用 link = link.replace(/\?.+$/g, '');
                // https://www.facebook.com/groups/536916004843594/?multi_permalinks=

                // https://www.facebook.com/groups/279174479502425/posts/1347500749336454/?__cft__[0]=
                // https://www.facebook.com/permalink.php?story_fbid=pfbid02J7h5dM2a4345&__cft__[0]=AZUeeJtYTmGzyUtygH&__tn__=,O,P-R
                // https://www.facebook.com/groups/354322643399813/posts/549164890582253/?__tn__=%2CO%2CP-R
                link = link.replace(/\?__cft__.+$/g, '');
                link = link.replace(/&__cft__.+$/g, '');

                link = link.replace(/\?__tn__.+$/g, '');
                link = link.replace(/&__tn__.+$/g, '');

                // https://www.facebook.com/groups/103551256692642/posts/3002246230156449/?comment_id=3017727738608298&notif_id=1712447270443732&notif_t=group_comment
                link = link.replace(/\?comment_id.+$/g, '');
                link = link.replace(/&comment_id.+$/g, '');

                // https://www.facebook.com/groups/371845861662757/permalink/753056646875008/?mibextid=oMANbw
                link = link.replace(/\?mibextid=.+$/g, '');

                // https://www.facebook.com/watch/hashtag/godswordispowerful?__eep__=6%2F
                link = link.replace(/\?__eep__=.+$/g, '');

                // /reel/796695422500106/?s=single_unit
                link = link.replace(/\?s=single_unit$/g, '');

                // https://www.facebook.com/watch/?ref=tab
                link = link.replace(/\?ref=tab.*?$/g, '');

                // https://www.facebook.com/groups/1530390727699256/?multi_permalinks=1680412559363738&hoisted_section_header_type=recently_seen
                // https://www.facebook.com/groups/625217336107488/?hoisted_section_header_type=recently_seen&multi_permalinks=855170129778873
                link = link.replace(/[?&]?hoisted_section_header_type=recently_seen.*?$/g, '');
                link = link.replace(/[?&]?multi_permalinks=.+$/g, '');

                // ref是有作用的，不作处理
                // https://www.facebook.com/FaithWithGodPosts/videos/?ref=page_internal
                // https://www.facebook.com/watch/live/?ref=watch_permalink&v=1023407129096732
                // link = link.replace(/\?ref=.+$/g, '');
            }

            link = link.replace(/\s+/g, '');
            link = link.replace(/\/+$/g, '');
            return link;
        } catch (error) {
            throw new Error(`Error-myutil-0077 ${error.message}`);
        }
    }

    /**
     * 比较两个 group 链接
     * @param {*} groupLink1
     * @param {*} groupLink2
     * @returns 
     */
    /* 
    myUtil.isEqualGroupLink(groupLink1, groupLink2)
     */
    static isEqualGroupLink(groupLink1, groupLink2) {
        const self = this;

        try {
            // 去掉链接最后的 / 
            let _formatLink = (link) => {
                link = link.replace(/\/+$/g, '');
                return link;
            }

            groupLink1 = groupLink1 + '';
            groupLink2 = groupLink2 + '';

            if (groupLink1.length > 15 && groupLink2.length > 15) {
                if (groupLink1 === groupLink2) {
                    return true;
                }

                // https://www.facebook.com/groups/189269791853816/
                if (_formatLink(groupLink1) === _formatLink(groupLink2)) {
                    return true;
                }

                let groupId1 = self.getGroupIdFromLink(groupLink1);
                let groupId2 = self.getGroupIdFromLink(groupLink2);
                if (groupId1 && groupId1 === groupId2) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0078: ${error.message}`);
        }
    }

    /**
     * 比较两个帖文链接
     * @param {*} essayLink1 
     * @param {*} essayLink2 
     * @returns 
     */
    /* 
    myUtil.isEqualEssayLink(taskLink1, taskLink2)
     */
    static isEqualEssayLink(link1, link2) {
        const self = this;

        try {
            if (link1 && link1 === link2) {
                return true;
            }

            let groupId1 = self.getGroupIdFromLink(link1);
            let essayId1 = self.getEssayIdFromLink(link1);

            let groupId2 = self.getGroupIdFromLink(link2);
            let essayId2 = self.getEssayIdFromLink(link2);

            if ((groupId1 && essayId1) && (groupId1 === groupId2) && (essayId1 === essayId2)) {
                return true;
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0079: ${error.message}`);
        }
    }

    /**
     * 判断一个页面是否正处在当前的页面中（当前是否就是想要在那个页面）
     * @param {*} pageUrl1
     * @param {*} pageUrl2
     * @returns 
     */
    static isSamePageUrl(pageUrl1, pageUrl2) {
        const self = this;

        try {
            if (pageUrl1 === pageUrl2) {
                return true;
            }
            pageUrl1 = self.pureLink(pageUrl1);
            pageUrl2 = self.pureLink(pageUrl2);
            return pageUrl1 === pageUrl2;
        } catch (error) {
            throw new Error(`Error-myutil-0080: ${error.message}`);
        }
    }

    /**
     * 判断两个链接是否相等（链接有可能不一定完全相同）
     * @param {*} pageUrl1
     * @param {*} pageUrl2
     * @returns 
     */
    static isEqualPageUrl(pageUrl1, pageUrl2) {
        const self = this;

        try {
            if (pageUrl1 === pageUrl2) {
                return true;
            }

            pageUrl1 = self.pureLink(pageUrl1);
            pageUrl2 = self.pureLink(pageUrl2);
            if (pageUrl1 === pageUrl2) {
                return true;
            }

            // 帖文链接
            let groupId1 = self.getGroupIdFromLink(pageUrl1)
            let essayId1 = self.getEssayIdFromLink(pageUrl1);

            let groupId2 = self.getGroupIdFromLink(pageUrl2);
            let essayId2 = self.getEssayIdFromLink(pageUrl2);

            if (groupId1 && essayId1 && groupId1 === groupId2 && essayId1 === essayId2) {
                return true;
            }

            // Live链接
            /* 
            live 链接会发生跳转，如
            https://www.facebook.com/100092989048047/videos/1023407129096732
            跳转到
            https://www.facebook.com/watch/live/?ref=watch_permalink&v=1023407129096732
            */

            let liveLink1 = self.pureLink(pageUrl1);
            let liveLink2 = self.pureLink(pageUrl2);
            if (liveLink1 === liveLink2) {
                return true;
            }

            let liveId1 = self.getLiveIdFromLink(liveLink1);
            let liveId2 = self.getLiveIdFromLink(liveLink2);
            if (liveId1 === liveId2) {
                return true;
            }

            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0081: ${error.message}`);
        }
    }

    /**
     * 判断链接是否包含另一个链接
     * @param {*} pageUrl1
     * @param {*} pageUrl2
     * @param {*} isExclude 排除FB首页 https://www.facebook.com
     * @returns 
     */
    /* 
    let isInclude = myUtil.isIncludePageUrl(page.url(), targetUrl);
     */
    static isIncludePageUrl(pageUrl1, pageUrl2, isExclude = true) {
        const self = this;

        try {
            let _isLink = (link) => {
                if (link && typeof link === 'string' && link.match(/^https:\/\//)) {
                    return true;
                }
                return false;
            }

            if (!(_isLink(pageUrl1) && _isLink(pageUrl2))) {
                return false;
            }

            if (pageUrl1 === pageUrl2) {
                return true;
            }

            pageUrl1 = self.pureLink(pageUrl1);
            pageUrl2 = self.pureLink(pageUrl2);

            if (pageUrl1 === pageUrl2) {
                return true;
            }

            // https://business.facebook.com/latest/inbox/facebook
            // https://business.facebook.com/latest/inbox/facebook?asset_id=289423890913577&mailbox_id=&selected_item_id=289433330912633&thread_type=FB_PAGE_POST
            if (pageUrl1.includes(pageUrl2) || pageUrl2.includes(pageUrl1)) {
                // 排除FB首页
                if (isExclude) {
                    // 两个参数中，如果其中一个参数是 https://www.facebook.com，就返回 false
                    // 说明：FB所有页面都是这个域名开头，就会造成所有的结果总是 true，是不合理的
                    if ([pageUrl1, pageUrl2].includes('https://www.facebook.com')) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0124: ${error.message}`);
        }
    }

    /**
    * 比较网址
    * @param {*} links1 
    * @param {*} links2 
    * @returns 
    */
    /* 
    let links1 = ['https://www.holyspiritspeaks.org/videos/where-is-my-home-movie/?source=skyl_xz204&num=2295417&team=7d&fbclid=IwAR2HFXfNks1_0fJ_lKA_z8nlC6cSQjUDmUZ3_SHDuCn1u4vLCGmAdR93mHY']
    let links2 = ['https://translate.google.com/?hl=en&sl=zh-CN&tl=en&text=%E5%9F%BA%E5%87%86%E7%BA%BF&op=translate', 'https://www.holyspiritspeaks.org/videos/where-is-my-home-bbb/']
    let isSame = myUtil.isEqualEssayImageLink(links1, links2)
    */
    static isEqualEssayImageLink(links1, links2) {
        const self = this;

        try {
            // 单个链接格式化
            let _formatLink = (link) => {
                link = link + '';
                link = link.replace(/\?.+$/g, '');
                link = link.replace(/\s+/g, '');
                link = link.replace(/\/+$/g, '');
                link = link.toLowerCase();
                return link;
            }

            // 需要排除的链接
            let _getExcludes = () => {
                let excludes = [
                    'https://www.facebook.com'
                ];
                let hosts = excludes.map(link => {
                    link = _formatLink(link);
                    let location = self.getLocation(link);
                    return location.host;
                });
                return hosts;
            }

            // 数组链接格式化
            let _getHosts = (excludes, links) => {
                links = links.map(link => {
                    return _formatLink(link);
                });
                links = links.filter(link => link);

                let hosts = links.map(link => {
                    let location = self.getLocation(link);
                    return location.host;
                });

                // 去掉要排除的域名
                hosts = hosts.filter(host => {
                    return !excludes.includes(host);
                });

                return hosts;
            }

            let excludes = _getExcludes();
            let hosts1 = _getHosts(excludes, links1);
            let hosts2 = _getHosts(excludes, links2);

            if (hosts1.length && hosts2.length) {
                let join1 = hosts1.join('');
                let join2 = hosts2.join('');

                if (join1 === join2) {
                    return true;
                }

                // https://www.holyspiritspeaks.org/videos/where-is-my-home-movie
                for (let i = 0; i < hosts2.length; i++) {
                    let host2 = hosts2[i];
                    if (hosts1.includes(host2)) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0082: ${error.message}`);
        }
    }

    /**
     * 是否是小组链接
     * @param {*} link 
     * @returns 
     */
    /* 
    let isGroupLink = myUtil.isGroupLink(pageUrl);
    */
    static isGroupLink(link) {
        try {
            if (link && typeof link === 'string') {
                let matches = link.match(/https:\/\/www\.facebook.com\/groups\/([^\/]+)/);
                if (matches) {
                    let groupName = matches[1].toLowerCase();
                    if (['feed'].includes(groupName)) {
                        return false;
                    }
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0150: ${error.message}`);
        }
    }

    /**
     * 获取网址的各部分
     * @param {*} href 
     * @returns 
     */
    // getLocation("http://example.com:3000/pathname/?search=test#hash");
    /*
    {
        "protocol": "http:",
        "host": "example.com:3000",
        "hostname": "example.com",
        "port": "3000",
        "pathname": "/pathname/",
        "search": "?search=test",
        "hash": "#hash"
    }
    */
    static getLocation(href) {
        try {
            let match = href.match(/^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
            return match && {
                href: href,
                protocol: match[1],
                host: match[2],
                hostname: match[3],
                port: match[4],
                pathname: match[5],
                search: match[6],
                hash: match[7]
            }
        } catch (error) {
            throw new Error(`Error-myutil-0083: ${error.message}`);
        }
    }

    /**
     * 从链接获取fbid
     * @param {*} link 
     * @returns 
     */
    static getFbIdFromLink(link) {
        try {
            if (link && typeof link === 'string') {
                let matches = null;

                /* 
                https://www.facebook.com/profile.php?id=100078699315606
                */
                matches = link.match(/\/profile\.php\?id=(\d{13,})/i);
                if (matches) {
                    return matches[1];
                }

                /* 
                https://www.facebook.com/groups/398190833669927/user/100078699315606/
                */
                matches = link.match(/\/groups\/\d+\/user\/(\d{13,})/i);
                if (matches) {
                    return matches[1];
                }

                /* 
                100081209252924
                https://www.facebook.com/permalink.php?story_fbid=pfbid0hWDtYfEYtDL7ieHTie8TWGt4C7E3SYkbc7A9FRripR4QY5oWaM5vgBTk7CNiddWSl&id=100081209252924
                */
                matches = link.match(/permalink\.php.*?id=(\d{13,})/i);
                if (matches) {
                    return matches[1];
                }

                /* 
                https://vk.com/id660038250 => id660038250
                https://vk.com/kerem__bursin => kerem__bursin
                */
                matches = link.match(/\/\/vk\.com\/([^/?#]+)/i);
                if (matches) {
                    return matches[1];
                }


            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0084: ${error.message}`);
        }
    }

    /**
     * 从链接获取视频ID
     * @param {*} link 
     * @returns 
     */
    static getVideoIdFromLink(link) {
        try {
            if (link && typeof link === 'string') {
                // https://www.facebook.com/watch/?v=195304791803894
                if (link.includes('watch/?v=')) {
                    let match = link.match(/watch\/\?v=(\d+)/);
                    if (match && match[1]) {
                        return match[1];
                    }
                }
                // https://www.facebook.com/holymary.amen/videos/572420821546078
                else if (link.includes('/videos/')) {
                    let match = link.match(/videos\/(\d+)/);
                    if (match && match[1]) {
                        return match[1];
                    }
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0085: ${error.message}`);
        }
    }

    /**
     * 从链接获取ReelID
     * @param {*} link 
     * @returns 
     */
    static getReelIdFromLink(link) {
        try {
            if (link && typeof link === 'string') {
                // https://www.facebook.com/reel/6982960918394396
                let match = link.match(/\/reel\/(\d+)/);
                if (match) {
                    return match[1];
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0086: ${error.message}`);
        }
    }

    /**
     * 从链接获取LiveID
     * @param {*} link 
     * @returns 
     */
    static getLiveIdFromLink(link) {
        try {
            if (link && typeof link === 'string') {
                /* 
                这两种链接都是可以的：
                    通过 https://fb.watch/mOaLpWPL7d/ 后跳转后的链接
                    https://www.facebook.com/watch/live/?ref=watch_permalink&v=1023407129096732

                    在专业的栏目页面点开的链接
                    https://www.facebook.com/100092989048047/videos/1023407129096732
                */

                let matches = null;

                // https://www.facebook.com/watch/live/?ref=watch_permalink&v=1023407129096732
                matches = link.match(/\/watch\/live\//) && link.match(/v=(\d{10,})/);
                if (matches) {
                    return matches[1];
                }

                // 把Watch推荐的视频当Live视频处理
                // https://www.facebook.com/watch/?v=384430901057842&__cft__[0]=AZXLPQ3Mfsmamxcq9voGFW
                matches = link.match(/\/watch\/\?v=(\d{10,})/);
                if (matches) {
                    return matches[1];
                }

                // https://www.facebook.com/TheBeanBoltShow/videos/1865497473845347/
                // https://www.facebook.com/100092989048047/videos/1023407129096732
                matches = link.match(/\/videos\/(\d{10,})/);
                if (matches) {
                    return matches[1];
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0087: ${error.message}`);
        }
    }

    /**
     * 从链接获取 PhotoId
     * @param {*} link 
     * @returns 
     */
    static getPhotoIdFromLink(link) {
        try {
            if (link && typeof link === 'string') {

                /* 
                第1种链接
                https://www.facebook.com/photo.php?fbid=747681104031964&set=pb.00000000000.-00000000000&type=3
                https://www.facebook.com/photo.php?fbid=3610386279063525&set=pb.00000000000.-00000000000&type=3

                第2种链接
                https://www.facebook.com/275636239205229/photos/pb.00000000000.-00000000000/747681104031964/?type=3
                https://www.facebook.com/275636239205229/photos/pb.00000000000.-00000000000/3610386279063525/?type=3

                */

                let match = null;

                // https://www.facebook.com/photo.php?fbid=747681104031964&set=pb.00000000000.-00000000000&type=3
                match = link.match(/fbid=(\d+)/);
                if (match) {
                    return match[1];
                }

                // https://www.facebook.com/275636239205229/photos/pb.00000000000.-00000000000/747681104031964/?type=3
                match = link.match(/\/photos\/[^/]+\/(\d+)/);
                if (match) {
                    return match[1];
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0121: ${error.message}`);
        }
    }

    /**
     * 从链接中获取附件ID（就是远程的图片文件名）
     * @param {*} link 
     * @returns 
     */
    /* 
    let imageId = myUtil.getAttachmentIdFromLink(imageUrl);
     */
    static getAttachmentIdFromLink(link) {
        try {
            if (link && typeof link === 'string') {
                // https://scontent-lga3-1.xx.fbcdn.net/v/t39.30808-1/382990491_122098628474056381_41055094285863499_n.jpg?stp=c5.0.32.32a_cp0_dst-jpg_p32x32&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=r0CqAIZE570AX-swTyj&_nc_ht=scontent-lga3-1.xx&oh=00_AfA_gE1Utigr5tZIC-wP7fLxORWVj43xTC4dlH6Jw--C4w&oe=660F9903

                // https://external.fagc3-1.fna.fbcdn.net/emg1/v/t13/15735621434371027805?url=https://tributecenteronline.s3-accelerate.amazonaws.com/Obituaries/28629849/Social.jpg&fb_obo=1&utld=amazonaws.com&stp=c0.5000x0.5000f_dst-jpg_flffffff_p1000x522_q75&ccb=13-1&oh=06_Q399FRAcGli54s2qZOq05xE5XUP1QuZDbaOkDuvpFCB68ec&oe=66737157&_nc_sid=c97757

                // https://external.fagc3-2.fna.fbcdn.net/emg1/v/t13/6894830629380934527?url=https://cdn.tukioswebsites.com/social/facebook/fb_3/2682c265-b336-4119-a84b-7e7354acc851/c9b65328721da8af9132df36a0bb8044_ae18ea351e2cd803c606d0b124e624f4&fb_obo=1&utld=tukioswebsites.com&stp=c0.5000x0.5000f_dst-jpg_flffffff_p1000x522_q75&ccb=13-1&oh=06_Q399NiiSWbbn2JRgN62pLuPaO5qJESfOYGOy8FLW60h2_mQ&oe=66737664&_nc_sid=085657

                link = decodeURIComponent(link);

                // 外部的资源
                if (link.match(/https:\/\/external\./i)) {
                    let matches = link.match(/https:\/\/external\.[^/]+\/[^/]+\/v\/[^/]+\/(\d+)/);
                    if (matches) {
                        return 'external_' + matches[1];
                    }
                }

                let matches = link.match(/\/([^.]+)\.(jpg|jpeg|png|gif)/);
                if (matches) {
                    return matches[1];
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0122: ${error.message}`);
        }
    }

    /* 
    清除 msg 多余信息
    保留后两节，方法开发时跟函数

    Error: Error-user-controllerx-0009: Error-user-configx-0006: 这是错误信息
    =>
    Error-user-controllerx-0009: Error-user-configx-0006: 这是错误信息

    Error: Error-utilx-routex-0005: Error-utilx-routex-0007: Error-user-controllerx-0009: Error-user-configx-0006: 各类留言和回复 的表头 通用留言，找不到跟它匹配
    =>
    Error-user-controllerx-0009: Error-user-configx-0006: 这是错误信息
    */
    static clearMsg(msg) {
        try {
            msg = msg + '';
            // 如果已经有 Error-user-configx-0006: 那最前面的 Error: 可以删除
            // Error: Error-user-controllerx-0009: Error-user-configx-0006: 这是错误信息
            if (msg.match(/^\s*?Error:\s*?(Error-[^:\s]+-\d{4}:)/ig)) {
                msg = msg.replace(/^\s*?Error:(\s+)?/i, '');
            }
            let _execute = (loop) => {
                // Error: Error-utilx-routex-0005: Error-utilx-routex-0007: Error-user-controllerx-0009: Error-user-configx-0006: 各类留言和回复 的表头 通用留言，找不到跟它匹配
                let regexp = new RegExp('(Error\\-[^:\\s]+\\-\\d{4}:)\\s*?(Error\\-[^:\\s]+\\-\\d{4}:)\\s*?(Error\\-[^:\\s]+\\-\\d{4}:)', 'ig');
                if (msg.match(regexp)) {
                    msg = msg.replace(regexp, function (whole, error1, error2, error3) {
                        return `${error2} ${error3}`;
                    });
                    if (loop < 10) {
                        loop++;
                        _execute(loop);
                    }
                }
            }
            _execute(1);
            return msg;
        } catch (error) {
            throw new Error(`Error-myutil-0089: ${error.message}`);
        }
    }

    static convertCharacter(str) {
        try {
            if (str && typeof str === 'string') {
                str = str.toLocaleLowerCase();
            }
            return str;
        } catch (error) {
            throw new Error(`Error-myutil-0090: ${error.message}`);
        }
    }

    /**
    * 去掉所有文字符号
    * @param {*} str 
    * @returns 
    */
    static removeCharacter(str) {
        try {
            if (str && typeof str === 'string') {
                // remove english punctuation
                str = str.replace(/[~`!@#$%^&*'"+\-_,./:;<=>?[\]{}()<>\\/|।]+/g, '');

                // remove Chinese characters
                str = str.replace(/[\u4e00-\u9fa5]+/g, '');

                // remove chinese punctuation
                str = str.replace(/[（）【】《》‘’“”?、，。？！：；]+/g, '');

                // remove: ❤️💗🌙⭐✍🙏💡☘️
                // str = str.replace(/\p{Emoji}/g, '');

                // remove: ✞︎
                // str = str.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/g, '');

                str = str.replace(/\s+/g, ' ');
            }
            return str;
        } catch (error) {
            throw new Error(`Error-myutil-0091: ${error.message}`);
        }
    }

    /**
    * 净化（去掉表情，文字符号）
    * @param {array|string} value 
    * @returns 
    */
    // static pureValue(value) {
    //     const self = this;

    //     try {
    //         let _pureValue = (line) => {
    //             // 去掉所有表情符号
    //             line = myEmoji.removeEmoji(line);

    //             // 去掉所有文字符号
    //             line = self.removeCharacter(line);

    //             // 去掉前后空格
    //             line = self.textTrim(line);
    //             return line;
    //         }

    //         // 可以是 array
    //         if (value && Array.isArray(value)) {
    //             value = value.map(line => {
    //                 return _pureValue(line);
    //             });
    //         }

    //         // 可以是 string
    //         if (value && typeof value === 'string') {
    //             value = _pureValue(value);
    //         }

    //         return value;
    //     } catch (error) {
    //         throw new Error(`Error-myutil-0092: ${error.message}`);
    //     }
    // }

    /**
     * 把所有文字符号转变成逗号
     * @param {*} str 
     * @returns 
     */
    static replacePunctuation(str) {
        try {
            if (str && typeof str === 'string') {
                // replace english punctuation
                str = str.replace(/[~`!@#$%^&*'"+\-_,./:;<=>?[\]{}()<>\\/|।]+/g, ',');
                // replace Chinese characters
                str = str.replace(/[\u4e00-\u9fa5]+/g, ',');
                // replace chinese punctuation
                str = str.replace(/[（）【】《》‘’“”?、，。？！：；]+/g, ',');
            }
            return str;
        } catch (error) {
            throw new Error(`Error-myutil-0093: ${error.message}`);
        }
    }

    /**
     * 获取原生[task]名称
     * @param {*} key
     * @returns 
     */
    /* 
    [任务]顶帖-全民 => [任务]顶帖
    let sheetNameRaw = myUtil.getTaskItemTitle(sheetName);
    */
    static getTaskItemTitle(sheetName) {
        const self = this;

        try {
            if (sheetName && typeof sheetName === 'string') {
                let sheetNameRaw = sheetName.replace(/^(\[任务\][^-]+)-.+$/i, function (whole, sheetNameRaw) {
                    return self.textTrim(sheetNameRaw);
                });
                return sheetNameRaw;
            }
            return sheetName;
        } catch (error) {
            throw new Error(`Error-myutil-0094: ${error.message}`);
        }
    }

    /**
     * 获取跟 [任务]关联顶帖 对应的 表名
     * @param {*} taskSheetItems
     * @param {*} sheetNameRaw
     * @returns 
     */
    /* 
    [任务]关联顶帖 => [任务]关联顶帖-01
    */
    static getTaskNameByTaskNameRow(taskSheetItems, sheetNameRaw) {
        const self = this;

        try {
            let sheetNames = taskSheetItems.map(item => item.sheetName);
            sheetNames = sheetNames.filter(sheetName => {
                let sheetNameRaw2 = self.getTaskItemTitle(sheetName);
                return sheetNameRaw2 === sheetNameRaw;
            });
            return sheetNames.length ? sheetNames[0] : null;
        } catch (error) {
            throw new Error(`Error-myutil-0095: ${error.message}`);
        }
    }

    /**
    * 根据任务名称，获得【公共】表格对应的工作表名称
    * @param {*} taskItemTitle 
    * @returns 
    */
    /* 
    // [任务]顶帖 => 各类留言和回复
    // [任务]VK搜索顶帖 => VK各类留言和回复

    let discussSheetName = myUtil.getDiscussSheetNameByTaskName(taskItemTitle);
    */
    static getDiscussSheetNameByTaskName(taskItemTitle) {
        try {
            let sheetName2 = '各类留言和回复';

            switch (taskItemTitle) {
                case '[任务]顶帖':
                case '[任务]关联顶帖':
                case '[任务]草莓顶帖':
                case '[任务]分享帖文':
                case '[任务]到专页XX看视频':
                    {
                        sheetName2 = '各类留言和回复';
                        break;
                    }
                case '[任务]VK顶帖':
                case '[任务]VK关联顶帖':
                case '[任务]VK搜索顶帖':
                    {
                        sheetName2 = 'VK各类留言和回复';
                        break;
                    }
                default: {
                    break;
                }
            }

            return sheetName2;
        } catch (error) {
            throw new Error(`Error-myutil-0096: ${error.message}`);
        }
    }

    /**
     * 获取任务名称，如 [任务]关联顶帖-01
     * @param {*} taskListDataActive
     * @returns 
     */
    static getTaskNameByTaskListDataActive(taskListDataActive) {
        try {
            let taskItemTitles = taskListDataActive.map(item => {
                return item.subTableData[0]['任务名称'];
            });
            return taskItemTitles.length ? taskItemTitles[0] : null;
        } catch (error) {
            throw new Error(`Error-myutil-0097: ${error.message}`);
        }
    }

    /**
     * 获取任务名称模板原名，如 [任务]关联顶帖-01 =>[任务]关联顶帖
     * @param {*} taskListDataActive
     * @returns 
     */
    static getTaskItemTitleByTaskListDataActive(taskListDataActive) {
        const self = this;

        try {
            let taskItemTitles = taskListDataActive.map(item => {
                return item.subTableData[0]['任务名称'];
            });
            if (taskItemTitles.length) {
                return self.getTaskItemTitle(taskItemTitles[0]);
            }
            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0098: ${error.message}`);
        }
    }

    /**
     * 获取 taskKey
     * @param {*} taskListDataActive 
     * @param {*} taskItemTitle 
     * @returns 
     */
    /* 
    let taskInfo = myUtil.getTaskInfo(taskListDataActive, '[任务]关联顶帖');
    */
    static getTaskInfo(taskListDataActive, taskItemTitle) {
        const self = this;

        try {
            let taskInfos = taskListDataActive.map(item => {
                return item.subTableData[0];
            });

            taskInfos = taskInfos.filter(item => {
                let sheetNameRaw = self.getTaskItemTitle(item['任务名称']);
                return sheetNameRaw === taskItemTitle;
            });

            /* 
            任务执行电脑: "所有电脑",
            任务名称: "[任务]XXXXX"
            任务类型: "task-xxx-fb"
            任务时间段: "17:00~23:30"
            任务时间段GMT: "17:00~23:30"
            任务来源: "个人"
            任务优先级: 50
            任务分析描述: "可用"
            rowNum: 5
            */

            if (taskInfos.length) {
                return taskInfos[0];
            }

            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0099: ${error.message}`);
        }
    }

    /**
     * node buffer to string
     * @param {*} buffer 
     * @returns 
     */
    static buffer2string(buffer) {
        try {
            return new TextDecoder().decode(buffer);
        } catch (error) {
            throw new Error(`Error-myutil-0100: ${error.message}`);
        }
    }

    /**
    * 获取远程Json文件 Js
    * @param {*} url 
    * @returns 
    */
    static async fetchRemoteJsonJs(url) {
        try {
            // let url = `https://truelove.altervista.org/plugin/Cherry/${versionX}/js/notification.json`;

            // let t = new Date().getTime();
            // url = url + `?t=${t}`;
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.json();
        } catch (error) {
            throw new Error(`Error-myutil-0101: ${error.message}`);
        }
    }

    /**
     * 判断是否是标准的目录路径
     * @param {*} dirPath 
     * @returns 
     */
    static async isStandardDirPath(dirPath) {
        const self = this;

        try {
            // C:/Users/Asus/Documents/Share X/Screenshots

            dirPath = dirPath.replace(/\\/g, '/');
            dirPath = dirPath.replace(/\/+/g, '/');
            dirPath = dirPath.replace(/\/+$/, '');

            if (dirPath.match(/\/[^\w\-\s]+/ig)) {
                throw new Error(`文件夹的路径，需要用 英文字母，数字`);
            }

            let matches = dirPath.match(/\/[^/:]+/ig);
            if (matches) {
                for (let i = 0; i < matches.length; i++) {
                    let pathName = matches[i].substring(1);
                    if (await self.existsSpecialSymbol(pathName)) {
                        throw new Error(`文件夹的路径，不能包含有特殊符号和表情符号`);
                    }
                }
            }

            return true;
        } catch (error) {
            throw new Error(`Error-myutil-0102: ${error.message}`);
        }
    }

    /**
    * 是否包含特殊符号
    * @param {*} str 
    * @returns 
    */
    // static async existsSpecialSymbol(str) {
    //     try {
    //         if (str && typeof str === 'string') {
    //             let isMatch = str.match(/[~!@#$%^&*(){}_+|:"<>?`\-=[\]\\;',.//*-]+/);
    //             if (isMatch) {
    //                 return true;
    //             }

    //             isMatch = str.match(/[·【】~！@￥%……&*（）——+|：“”《》？、，。-]+/);
    //             if (isMatch) {
    //                 return true;
    //             }

    //             let regex1 = myEmoji.getRegexp1();
    //             isMatch = str.match(regex1);
    //             if (isMatch) {
    //                 return true;
    //             }

    //             let regex2 = myEmoji.getRegexp2();
    //             isMatch = str.match(regex2);
    //             if (isMatch) {
    //                 return true;
    //             }

    //             // 这个正则测试 aaaa 也不能通过
    //             // let regex3 = myEmoji.getRegexp3();
    //             // isMatch = str.match(regex3);
    //             // if (isMatch) {
    //             //     return true;
    //             // }

    //         }
    //         return false;
    //     } catch (error) {
    //         throw new Error(`Error-myutil-0103: ${error.message}`);
    //     }
    // }

    /**
    * 解析FB点赞数
    * @param {*} str 
    * @returns 
    */
    static parseFBLikeNumber(str) {
        // 23&nbsp;萬
        // 4,984
        // 456
        // 17.5K members

        try {
            let str2 = str + '';
            str2 = str2.replace(/(&nbsp;)/g, '');
            str2 = str2.replace(/[,]+/g, '');
            str2 = str2.replace(/[千]+/g, 'K');
            str2 = str2.replace(/[萬]+/g, 'M');
            str2 = str2.replace(/\s+/g, '');

            let matches = str2.match(/(\d*\.?\d+)([KkMmBbTt]?)/);
            if (!matches) {
                return null;
            }

            let number = parseFloat(matches[1]);
            let unit = matches[2].toUpperCase();

            // 根据单位进行相应的转换
            switch (unit) {
                case 'K':
                    return Math.abs(number) * 1000;
                case 'M':
                    return Math.abs(number) * 1000000;
                case 'B':
                    return Math.abs(number) * 1000000000;
                case 'T':
                    return Math.abs(number) * 1000000000000;
                default:
                    return Math.abs(number);
            }
        } catch (error) {
            throw new Error(`Error-myutil-0104: ${error.message}`);
        }
    }

    /**
    * 判断两个数组是否有交集，大小写不敏感
    * @param {*} array1
    * @param {*} array2
    * @returns 
    */
    static hasIntersection(array1, array2) {
        try {
            let _toLower = (array) => {
                return array.map(value => {
                    return (value + '').toLowerCase();
                });
            }

            if (!(Array.isArray(array1) && array1.length && Array.isArray(array2) && array2.length)) {
                return false;
            }

            array1 = _toLower(array1);
            array2 = _toLower(array2);

            for (let i = 0; i < array2.length; i++) {
                let value = array2[i];
                if (array1.includes(value)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0105: ${error.message}`);
        }
    }

    /**
    * 随机返回 -1 / 1
    * @return -1 / 1
    */
    static getRandomSign() {
        try {
            let signs = [-1, 1];
            let index = this.randomBetweenInt(0, signs.length - 1);
            return signs[index];
        } catch (error) {
            throw new Error(`Error-myutil-0106: ${error.message}`);
        }
    }

    /**
    * 根据账号代号获取社交平台
    * @returns 
    */
    static getPlatform(accountNumber) {
        try {
            if (typeof accountNumber === 'string' && accountNumber.match(/^id\d+$/) && accountNumber.length > 8) {
                return 'platform-vk';
            }
            return 'platform-fb';
        } catch (error) {
            throw new Error(`Error-myutil-0107: ${error.message}`);
        }
    }

    /**
    * 获取搜索引擎
    * @returns 
    */
    static getSearchEngineName(link) {
        try {
            link += '';

            // https://www.google.com/
            // https://www.google.ru/
            if (link.match(/(google\.com|google\.ru)/i)) {
                return 'google';
            }

            // https://yandex.com/
            // https://yandex.ru/
            // https://ya.ru/
            if (link.match(/(yandex\.com|yandex\.ru|ya\.ru)/i)) {
                return 'yandex';
            }

            return null;
        } catch (error) {
            throw new Error(`Error-myutil-0108: ${error.message}`);
        }
    }

    /**
     * 打乱顺序：第 1, 2 , 最后一个 顺序不变，中间的打乱顺序
    * 目的是：前和后跟其他的功能对接是，头和尾能对接得上
     * @param {*} list 
     */
    static arrayShuffleMiddleItems(list) {
        const self = this;

        try {
            if (list.length >= 5) {
                let item1 = list[0];
                let item2 = list[1];
                let item9 = list[list.length - 1];

                let middles = list.filter((item, index) => {
                    if (index === 0 || index === 1 || index === list.length - 1) {
                        return false;
                    }
                    return true;
                });

                middles = self.arrayShuffle(middles);
                list = [].concat(item1, item2, middles, item9);
            }
            return list;
        } catch (error) {
            throw new Error(`Error-myutil-0109: ${error.message}`);
        }
    }

    /**
    * 打乱顺序：先把数据分页，再每个分页的子元素随机排序
    * 目的是：整体不会前后颠倒
    * @param {*} list 
    */
    /* 
    essays = myUtil.arrayShuffleByPagination(essays, { pageSize: 2 });
    */
    static arrayShuffleByPagination(list, args = {}) {
        const self = this;

        try {
            let def = {
                // 每部分需要装多少
                pageSize: 2,
            }
            args = { ...def, ...args };

            if (!(Array.isArray(list) && list.length)) {
                return [];
            }

            // 把数组分成几部分
            let pageTotal = Math.ceil(list.length / args.pageSize);
            pageTotal = pageTotal > list.length ? list.length : pageTotal;
            pageTotal = pageTotal < 0 ? 1 : pageTotal;

            // 每部分需要装多少
            let pageSize = Math.ceil(list.length / pageTotal);

            let ranges = [];
            for (let i = 0; i < pageTotal; i++) {
                ranges.push(self.getPaginateItems(list, pageSize, i + 1));
            }

            // 每部分随机排序
            let list2 = [];
            for (let i = 0; i < ranges.length; i++) {
                let items = self.arrayShuffle(ranges[i]);
                list2 = list2.concat(items);
            }
            return list2;
        } catch (error) {
            throw new Error(`Error-myutil-0110: ${error.message}`);
        }
    }

    /**
    * 是否是 账号代号
    * @param {*} value // EN012 
    */
    static isAccountAlias(value) {
        try {
            if (value && typeof value === 'string') {
                if (!value.match(/FB/i) && value.match(/^[A-Z]{2}[0-9]{3}$/)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0111: ${error.message}`);
        }
    }

    /**
     * 还原混淆后的字符内容
     * @param {string|array} value 字符内容
     * @returns 
     */
    static stringDeobfuscator(value) {
        try {
            // 这个函数是复制有志写的函数 https://github.com/dev-coco/String-Obfuscator

            /**
             * @description 字符还原
             * @param {string} str - 混淆后的内容
             * @returns {string} - 还原后的内容
             */
            function stringDeobfuscator(str) {
                str = str.replace(/𝐀|𝗔|𝖠|𝙰|𝐴|𝘈|𝑨|𝘼|ᴀ|𝔸|𝒜|𝓐|𝔄|𝕬|ᴬ|ＡⱯ]/g, 'A')
                str = str.replace(/𝐁|𝗕|𝖡|𝙱|𝐵|𝘉|𝑩|𝘽|ʙ|𝔹|ℬ|𝓑|𝔅|𝕭|ᴮ|Ｂ|ꓭ/g, 'B')
                str = str.replace(/𝐂|𝗖|𝖢|𝙲|𝐶|𝘊|𝑪|𝘾|ᴄ|ℂ|𝒞|𝓒|ℭ|𝕮|ᶜ|Ｃ|Ɔ/g, 'C')
                str = str.replace(/𝐃|𝗗|𝖣|𝙳|𝐷|𝘋|𝑫|𝘿|ᴅ|𝔻|𝒟|𝓓|𝔇|𝕯|ᴰ|Ｄ|ꓷ/g, 'D')
                str = str.replace(/𝐄|𝗘|𝖤|𝙴|𝐸|𝘌|𝑬|𝙀|ᴇ|𝔼|ℰ|𝓔|𝔈|𝕰|ᴱ|Ｅ|Ǝ/g, 'E')
                str = str.replace(/𝐅|𝗙|𝖥|𝙵|𝐹|𝘍|𝑭|𝙁|ғ|𝔽|ℱ|𝓕|𝔉|𝕱|ᶠ|Ｆ|Ⅎ/g, 'F')
                str = str.replace(/𝐆|𝗚|𝖦|𝙶|𝐺|𝘎|𝑮|𝙂|ɢ|𝔾|𝒢|𝓖|𝔊|𝕲|ᴳ|Ｇ|ꓨ/g, 'G')
                str = str.replace(/𝐇|𝗛|𝖧|𝙷|𝐻|𝘏|𝑯|𝙃|ʜ|ℍ|ℋ|𝓗|ℌ|𝕳|ᴴ|Ｈ]/g, 'H')
                str = str.replace(/𝐈|𝗜|𝖨|𝙸|𝐼|𝘐|𝑰|𝙄|ɪ|𝕀|ℐ|𝓘|ℑ|𝕴|ᴵ|Ｉ/g, 'I')
                str = str.replace(/𝐉|𝗝|𝖩|𝙹|𝐽|𝘑|𝑱|𝙅|ᴊ|𝕁|𝒥|𝓙|𝔍|𝕵|ᴶ|Ｊ|ſ/g, 'J')
                str = str.replace(/𝐊|𝗞|𝖪|𝙺|𝐾|𝘒|𝑲|𝙆|ᴋ|𝕂|𝒦|𝓚|𝔎|𝕶|ᴷ|Ｋ|ꓘ/g, 'K')
                str = str.replace(/𝐋|𝗟|𝖫|𝙻|𝐿|𝘓|𝑳|𝙇|ʟ|𝕃|ℒ|𝓛|𝔏|𝕷|ᴸ|Ｌ|ꓶ/g, 'L')
                str = str.replace(/𝐌|𝗠|𝖬|𝙼|𝑀|𝘔|𝑴|𝙈|ᴍ|𝕄|ℳ|𝓜|𝔐|𝕸|ᴹ|Ｍ/g, 'M')
                str = str.replace(/𝐍|𝗡|𝖭|𝙽|𝑁|𝘕|𝑵|𝙉|ɴ|ℕ|𝒩|𝓝|𝔑|𝕹|ᴺ|Ｎ/g, 'N')
                str = str.replace(/𝐎|𝗢|𝖮|𝙾|𝑂|𝘖|𝑶|𝙊|ᴏ|𝕆|𝒪|𝓞|𝔒|𝕺|ᴼ|Ｏ/g, 'O')
                str = str.replace(/𝐏|𝗣|𝖯|𝙿|𝑃|𝘗|𝑷|𝙋|ᴘ|ℙ|𝒫|𝓟|𝔓|𝕻|ᴾ|Ｐ|Ԁ/g, 'P')
                str = str.replace(/𝐐|𝗤|𝖰|𝚀|𝑄|𝘘|𝑸|𝙌|ǫ|ℚ|𝒬|𝓠|𝔔|𝕼|Q|Ｑ|Ò/g, 'Q')
                str = str.replace(/𝐑|𝗥|𝖱|𝚁|𝑅|𝘙|𝑹|𝙍|ʀ|ℝ|ℛ|𝓡|ℜ|𝕽|ᴿ|Ｒ|ꓤ/g, 'R')
                // str = str.replace(/𝐒|𝗦|𝖲|𝚂|𝑆|𝘚|𝑺|𝙎|s|𝕊|𝒮|𝓢|𝔖|𝕾|ˢ|Ｓ/g, 'S')
                str = str.replace(/𝐒|𝗦|𝖲|𝚂|𝑆|𝘚|𝑺|𝙎|s|𝕊|𝒮|𝓢|𝔖|𝕾|Ｓ/g, 'S')
                str = str.replace(/𝐓|𝗧|𝖳|𝚃|𝑇|𝘛|𝑻|𝙏|ᴛ|𝕋|𝒯|𝓣|𝔗|𝕿|ᵀ|Ｔ|ꓕ/g, 'T')
                str = str.replace(/𝐔|𝗨|𝖴|𝚄|𝑈|𝘜|𝑼|𝙐|ᴜ|𝕌|𝒰|𝓤|𝔘|𝖀|ᵁ|Ｕ|ꓵ/g, 'U')
                str = str.replace(/𝐕|𝗩|𝖵|𝚅|𝑉|𝘝|𝑽|𝙑|ᴠ|𝕍|𝒱|𝓥|𝔙|𝖁|ⱽ|Ｖ|ꓥ/g, 'V')
                str = str.replace(/𝐖|𝗪|𝖶|𝚆|𝑊|𝘞|𝑾|𝙒|ᴡ|𝕎|𝒲|𝓦|𝔚|𝖂|ᵂ|Ｗ/g, 'W')
                str = str.replace(/𝐗|𝗫|𝖷|𝚇|𝑋|𝘟|𝑿|𝙓|x|𝕏|𝒳|𝓧|𝔛|𝖃|ˣ|Ｘ/g, 'X')
                str = str.replace(/𝐘|𝗬|𝖸|𝚈|𝑌|𝘠|𝒀|𝙔|ʏ|𝕐|𝒴|𝓨|𝔜|𝖄|ʸ|Ｙ|⅄/g, 'Y')
                str = str.replace(/𝐙|𝗭|𝖹|𝚉|𝑍|𝘡|𝒁|𝙕|ᴢ|ℤ|𝒵|𝓩|ℨ|𝖅|ᶻ|Ｚ/g, 'Z')
                str = str.replace(/𝐚|𝗮|𝖺|𝚊|𝑎|𝘢|𝒂|𝙖|ᴀ|𝕒|𝒶|𝓪|𝔞|𝖆|ᵃ|ａ|ɐ/g, 'a')
                str = str.replace(/𝐛|𝗯|𝖻|𝚋|𝑏|𝘣|𝒃|𝙗|ʙ|𝕓|𝒷|𝓫|𝔟|𝖇|ᵇ|ｂ/g, 'b')
                str = str.replace(/𝐜|𝗰|𝖼|𝚌|𝑐|𝘤|𝒄|𝙘|ᴄ|𝕔|𝒸|𝓬|𝔠|𝖈|ᶜ|ｃ|ɔ/g, 'c')
                str = str.replace(/𝐝|𝗱|𝖽|𝚍|𝑑|𝘥|𝒅|𝙙|ᴅ|𝕕|𝒹|𝓭|𝔡|𝖉|ᵈ|ｄ/g, 'd')
                str = str.replace(/𝐞|𝗲|𝖾|𝚎|𝑒|𝘦|𝒆|𝙚|ᴇ|𝕖|𝑒|𝓮|𝔢|𝖊|ᵉ|ｅ|ǝ/g, 'e')
                str = str.replace(/𝐟|𝗳|𝖿|𝚏|𝑓|𝘧|𝒇|𝙛|ғ|𝕗|𝒻|𝓯|𝔣|𝖋|ᶠ|ｆ|ɟ/g, 'f')
                str = str.replace(/𝐠|𝗴|𝗀|𝚐|𝑔|𝘨|𝒈|𝙜|ɢ|𝕘|𝑔|𝓰|𝔤|𝖌|ᵍ|ｇ|ƃ/g, 'g')
                str = str.replace(/𝐡|𝗵|𝗁|𝚑|ℎ|𝘩|𝒉|𝙝|ʜ|𝕙|𝒽|𝓱|𝔥|𝖍|ʰ|ｈ|ɥ/g, 'h')
                str = str.replace(/𝐢|𝗶|𝗂|𝚒|𝑖|𝘪|𝒊|𝙞|ɪ|𝕚|𝒾|𝓲|𝔦|𝖎|ᶦ|ｉ|ı̣/g, 'i')
                str = str.replace(/𝐣|𝗷|𝗃|𝚓|𝑗|𝘫|𝒋|𝙟|ᴊ|𝕛|𝒿|𝓳|𝔧|𝖏|ʲ|ｊ|ɾ̣/g, 'j')
                str = str.replace(/𝐤|𝗸|𝗄|𝚔|𝑘|𝘬|𝒌|𝙠|ᴋ|𝕜|𝓀|𝓴|𝔨|𝖐|ᵏ|ｋ|ʞ/g, 'k')
                str = str.replace(/𝐥|𝗹|𝗅|𝚕|𝑙|𝘭|𝒍|𝙡|ʟ|𝕝|𝓁|𝓵|𝔩|𝖑|ˡ|ｌ|ן/g, 'l')
                str = str.replace(/𝐦|𝗺|𝗆|𝚖|𝑚|𝘮|𝒎|𝙢|ᴍ|𝕞|𝓂|𝓶|𝔪|𝖒|ᵐ|ｍ|ɯ/g, 'm')
                str = str.replace(/𝐧|𝗻|𝗇|𝚗|𝑛|𝘯|𝒏|𝙣|ɴ|𝕟|𝓃|𝓷|𝔫|𝖓|ⁿ|ｎ/g, 'n')
                str = str.replace(/𝐨|𝗼|𝗈|𝚘|𝑜|𝘰|𝒐|𝙤|ᴏ|𝕠|𝑜|𝓸|𝔬|𝖔|ᵒ|ｏ/g, 'o')
                str = str.replace(/𝐩|𝗽|𝗉|𝚙|𝑝|𝘱|𝒑|𝙥|ᴘ|𝕡|𝓅|𝓹|𝔭|𝖕|ᵖ|ｐ/g, 'p')
                str = str.replace(/𝐪|𝗾|𝗊|𝚚|𝑞|𝘲|𝒒|𝙦|ǫ|𝕢|𝓆|𝓺|𝔮|𝖖|ᑫ|ｑ/g, 'q')
                str = str.replace(/𝐫|𝗿|𝗋|𝚛|𝑟|𝘳|𝒓|𝙧|ʀ|𝕣|𝓇|𝓻|𝔯|𝖗|ʳ|ｒ|ɹ/g, 'r')
                str = str.replace(/𝐬|𝘀|𝗌|𝚜|𝑠|𝘴|𝒔|𝙨|s|𝕤|𝓈|𝓼|𝔰|𝖘|ˢ|ｓ/g, 's')
                str = str.replace(/𝐭|𝘁|𝗍|𝚝|𝑡|𝘵|𝒕|𝙩|ᴛ|𝕥|𝓉|𝓽|𝔱|𝖙|ᵗ|ｔ|ʇ/g, 't')
                str = str.replace(/𝐮|𝘂|𝗎|𝚞|𝑢|𝘶|𝒖|𝙪|ᴜ|𝕦|𝓊|𝓾|𝔲|𝖚|ᵘ|ｕ/g, 'u')
                str = str.replace(/𝐯|𝘃|𝗏|𝚟|𝑣|𝘷|𝒗|𝙫|ᴠ|𝕧|𝓋|𝓿|𝔳|𝖛|ᵛ|ｖ|ʌ/g, 'v')
                str = str.replace(/𝐰|𝘄|𝗐|𝚠|𝑤|𝘸|𝒘|𝙬|ᴡ|𝕨|𝓌|𝔀|𝔴|𝖜|ʷ|ｗ|ʍ/g, 'w')
                str = str.replace(/𝐱|𝘅|𝗑|𝚡|𝑥|𝘹|𝒙|𝙭|x|𝕩|𝓍|𝔁|𝔵|𝖝|ˣ|ｘ/g, 'x')
                str = str.replace(/𝐲|𝘆|𝗒|𝚢|𝑦|𝘺|𝒚|𝙮|ʏ|𝕪|𝓎|𝔂|𝔶|𝖞|ʸ|ｙ|ʎ/g, 'y')
                str = str.replace(/𝐳|𝘇|𝗓|𝚣|𝑧|𝘻|𝒛|𝙯|ᴢ|𝕫|𝓏|𝔃|𝔷|𝖟|ᶻ|ｚ/g, 'z')
                return str;
            }

            if (value && typeof value === 'string') {
                value = stringDeobfuscator(value);
            }
            else if (Array.isArray(value) && value.length) {
                value = value.map(val => stringDeobfuscator(val));
            }

            return value;
        } catch (error) {
            throw new Error(`Error-myutil-0112: ${error.message}`);
        }
    }

    /* 
    let hash = myUtil.getStringHash(json);
    */
    // static getStringHash(string) {
    //     try {
    //         let hash = SHA256(string).toString();
    //         return hash;
    //     } catch (error) {
    //         throw new Error(`Error-myutil-0113: ${error.message}`);
    //     }
    // }

    /**
     * 版本号比较
     * @param {*} versionA 
     * @param {*} versionB 
     * @returns 
     */
    /* 
    let versionA = '10.2.30';
    let versionB = '2.3.4';
    
    let comparison = compareVersions(versionA, versionB);
    if (comparison === -1) {
        console.log(`${versionA} is less than ${versionB}`);
    } else if (comparison === 1) {
        console.log(`${versionA} is greater than ${versionB}`);
    } else {
        console.log(`${versionA} is equal to ${versionB}`);
    }
    */
    static compareVersions(versionA, versionB) {
        try {
            let partsA = versionA.split('.').map(Number);
            let partsB = versionB.split('.').map(Number);

            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                let a = partsA[i] || 0;
                let b = partsB[i] || 0;

                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                }
            }

            return 0;
        } catch (error) {
            throw new Error(`Error-myutil-0114: ${error.message}`);
        }
    }

    /**
     * 设置取值范围
     * @param {*} value 
     * @param {*} min 最小
     * @param {*} max 最大
     */
    static numberRange(value, min, max) {
        try {
            value = parseInt(value) || 0;
            value = value < min ? min : value;
            value = value > max ? max : value;
            return value;
        } catch (error) {
            throw new Error(`Error-myutil-0115: ${error.message}`);
        }
    }

    /**
     * 是否是帖文链接
     * @param {*} link 
     * @param {*} isSupportEmpty 是否支持空链接 或 #
     * @returns 
     */
    /* 
    let isEssayLink = myUtil.isEssayAnchorLink(link, false);
    */
    static isEssayAnchorLink(link, isSupportEmpty = false) {
        const self = this;

        try {
            // 按有链接时作判断
            let _isEssay = (link) => {
                link = self.makeFBLinkFull(link);

                // /stories/122102569034113571/UzpfSVNDOjExMjEzODkwNTIxOTQwNzY=/?view_single=false
                // /ads/about/?
                // https://www.facebook.com/hashtag/eiffeltower
                // https://www.facebook.com/friends/suggestions/?profile_id=100072577620828
                // /groups/597124298041388/user/100000132812162/
                // https://www.facebook.com/photo/?fbid=122124205352163142&set=gm.1047097239710756
                if (link.match(/(stories|ads|hashtag|friends|user|photo)/i)) {
                    return false;
                }

                // /groups/2780311902277191/?hoisted_section_header_type=recently_seen&multi_permalinks=3223593664615677
                if (link.includes('hoisted_section_header_type=')) {
                    return false;
                }

                // 留言/回复里的帖文链接
                // https://www.facebook.com/groups/519000115996002/posts/1081700729725935/?comment_id=1081713819724626
                if (link.includes('comment_id=')) {
                    return false;
                }

                // https://www.facebook.com/GodsSheepSeekingGodsFootsteps?__cft__
                let groupId = self.getGroupIdFromLink(link);
                let essayId = self.getEssayIdFromLink(link);
                if (!(groupId && essayId)) {
                    return false;
                }

                return true;
            }

            if (typeof link === 'string') {
                // link 当有链接时，需要有链接的要求作判断
                if (link.length > 5) {
                    return _isEssay(link);
                }

                // ?__cft__[0]=AZXo7q5lJkrELp62VpwkzlL4omoaquaIL1qNz9dwhUMG8vYYGhLn3MKIrK&__tn__=%2CO%2CP-R#?fbb
                if (link.match(/^\?__cft__\[0\]=/)) {
                    return true;
                }

                // link 当没有链接时，可以为空，或为 #
                // 用于判断 FB 帖文链接，当光标没有移动到anchor前的时候，需要返回 true
                if (isSupportEmpty) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0116: ${error.message}`);
        }
    }

    /**
     * 是否是Reel链接
     * @param {*} link 
     * @param {*} isSupportEmpty 是否支持空链接 或 #
     * @returns 
     */
    static isReelAnchorLink(link, isSupportEmpty = false) {
        const self = this;

        try {
            // 按有链接时作判断
            let _isReel = (link) => {
                link = self.makeFBLinkFull(link);

                // https://www.facebook.com/100090568105015/videos/1085642479334021/
                let reelId = self.getReelIdFromLink(link);
                if (!reelId) {
                    return false;
                }

                return true;
            }

            if (typeof link === 'string') {
                // link 当有链接时，需要有链接的要求作判断
                if (link.length > 5) {
                    return _isReel(link);
                }

                // link 当没有链接时，可以为空，或为 #
                // 用于判断 FB 帖文链接，当光标没有移动到anchor前的时候，需要返回 true
                if (isSupportEmpty) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0117: ${error.message}`);
        }
    }

    /**
     * 是否是Live链接
     * @param {*} link 
     * @param {*} isSupportEmpty 是否支持空链接 或 #
     * @returns 
     */
    static isLiveAnchorLink(link, isSupportEmpty = false) {
        const self = this;

        try {
            // 按有链接时作判断
            let _isLive = (link) => {
                link = self.makeFBLinkFull(link);

                // https://www.facebook.com/100090568105015/videos/1085642479334021/
                let reelId = self.getLiveIdFromLink(link);
                if (!reelId) {
                    return false;
                }

                return true;
            }

            if (typeof link === 'string') {
                // link 当有链接时，需要有链接的要求作判断
                if (link.length > 5) {
                    return _isLive(link);
                }

                // link 当没有链接时，可以为空，或为 #
                // 用于判断 FB 帖文链接，当光标没有移动到anchor前的时候，需要返回 true
                if (isSupportEmpty) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0118: ${error.message}`);
        }
    }

    /**
     * 是否是Photo链接
     * @param {*} link 
     * @returns 
     */
    static isPhotoAnchorLink(link) {
        const self = this;

        try {
            // 按有链接时作判断
            let _isPhoto = (link) => {
                link = self.makeFBLinkFull(link);

                let photoId = self.getPhotoIdFromLink(link);
                if (!photoId) {
                    return false;
                }

                return true;
            }

            if (typeof link === 'string') {
                // link 当有链接时，需要有链接的要求作判断
                if (link.length > 5) {
                    return _isPhoto(link);
                }
            }

            return false;
        } catch (error) {
            throw new Error(`Error-myutil-0119: ${error.message}`);
        }
    }

    /**
    * facebook 使用的关键字
    * @param {*} isLowerCase 是否转为小写
    * @returns 
    */
    /* 
    let keywords = myUtil.facebookKeywords(true);

    if (keywords.includes(spanText.toLowerCase())) {
                       
    }
    */
    static facebookKeywords(isLowerCase = false) {
        try {
            let keywords = [
                'Like', 'Comment', 'Reply', 'Share',
                'See translation', 'Top Contributor', 'Today',
                'Most relevant', 'Top comments', 'Newest', 'Most recent', 'All comments',
                'Active', 'Comment', 'Author',
                'All reactions', 'Write a public comment', 'View more comments',
                'Create', 'Reels and short videos', 'Send message', 'People You May Know', 'Original audio',
            ];

            if (isLowerCase) {
                keywords = keywords.map(value => value.toLowerCase());
            }
            return keywords;
        } catch (error) {
            throw new Error(`Error-myutil-0127: ${error.message}`);
        }
    }

    /**
     * 递归获取对象的属性值
     * @param {*} obj 
     * @param  {...any} keys 
     * @returns 
     */
    /* 
    let value = myUtil.getObjectChainValue(data, 'xxx');
    let value = myUtil.getObjectChainValue(data, 'xxx', 'xxx');
    */
    static getObjectChainValue(obj, ...keys) {
        try {
            for (let key of keys) {
                if (Array.isArray(obj) && typeof key === 'number') {
                    // 处理数组对象的获取
                    if (key < obj.length) {
                        obj = obj[key];
                    } else {
                        return null;
                    }
                } else if (obj && obj.hasOwnProperty(key)) {
                    obj = obj[key];
                } else {
                    return null;
                }
            }
            return obj;
        } catch (error) {
            throw new Error(`Error-myutil-0142: ${error.message}`);
        }
    }

    /**
     * 截断文本
     * @param {*} text 
     * @param {*} limit 
     * @param {*} mode 
     * @returns 
     */
    /* 
    let text2 = myUtil.truncateText(text, 20, 'words');
    */
    static truncateText(text, limit = 100, mode = 'characters') {
        try {
            if (!(text && typeof text === 'string')) {
                return '';
            }

            if (mode === 'words') {
                const words = text.split(/\s+/);
                if (words.length <= limit) return text;
                return words.slice(0, limit).join(' ') + '...';
            } else {
                if (text.length <= limit) return text;

                let truncated = text.substr(0, limit);
                const lastSpace = truncated.lastIndexOf(' ');

                // For non-Latin scripts, we don't adjust for word boundaries
                if (!/[\u3000-\u9fff]/.test(truncated) && lastSpace > limit / 2) {
                    truncated = truncated.substr(0, lastSpace);
                }

                return truncated.trim() + '...';
            }
        } catch (error) {
            throw new Error(`Error-myutil-0151: ${error.message}`);
        }
    }

    /**
     * 是否输入 yes
     * @param {*} value 
     * @param {*} def 
     * @returns 
     */
    /* 
    let value = await ctOptions.getOptionValue('xxxxxx', true);
    let isEssayLike = myUtil.isTurn(value, true); // 是否输入 yes
     */
    static isTurn(value, def) {
        try {
            value = String(value).toLocaleLowerCase();
            if (value === 'yes') {
                return true;
            }
            if (value === 'no') {
                return false;
            }
            return def;
        } catch (error) {
            throw new Error(`Error-myutil-0153: ${error.message}`);
        }
    }

    /**
     * 把一个数组彻底展平 
     * @param {*} data 
     * @returns 
     */
    static flat2(data) {
        try {
            let _isChildIsArray = (arr) => {
                return arr && Array.isArray(arr) && arr.length && Array.isArray(arr[0]);
            }

            let loop = 0;
            while (loop < 10 && _isChildIsArray(data)) {
                data = data.flat();
                loop++;
            }

            return data;
        } catch (error) {
            throw new Error(`Error-myutil-0154: ${error.message}`);
        }
    }

    /**
     * 压缩HTML，去除所有换行、多余的空格和标签之间的空格
     * @param {*} html 
     * @returns 
     */
    static compressHTML(html) {
        try {
            return html.replace(/(\r\n|\n|\r)/gm, '')
                .replace(/\s+/g, ' ')
                .replace(/(>)\s*</g, '><')
                .trim();
        } catch (error) {
            throw new Error(`Error-myutil-0155: ${error.message}`);
        }
    }

    /* 
    const debouncedResizeHandler = myUtil.debounce(() => {
        //
    }, 250);
    window.addEventListener('resize', debouncedResizeHandler);
    */
    /**
     * 防抖
     * @param {*} func 
     * @param {*} wait 
     * @param {*} immediate 
     * @returns 
     */
    static debounce(func, wait, immediate) {
        try {
            let timeout;
            return function () {
                let context = this, args = arguments;
                let later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                let callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        } catch (error) {
            throw new Error(`Error-myutil-0158: ${error.message}`);
        }
    }

    static copyText(text) {
        // const self = this;
        try {
            return new Promise((resolve, reject) => {
                // 尝试使用现代 Clipboard API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text)
                        .then(() => resolve(true))
                        .catch(err => reject(new Error('Failed to copy text: ' + err)));
                } else {
                    // 回退方案：使用 document.execCommand
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed'; // 避免页面滚动
                    textarea.style.opacity = '0'; // 隐藏元素
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        const successful = document.execCommand('copy');
                        document.body.removeChild(textarea);
                        if (successful) {
                            resolve(true);
                        } else {
                            reject(new Error('Failed to copy text using execCommand'));
                        }
                    } catch (err) {
                        document.body.removeChild(textarea);
                        reject(new Error('Failed to copy text: ' + err));
                    }
                }
            });
        } catch (error) {
            throw new Error(`Error-myutil-0159: ${error.message}`);
        }
    }

    /**
     * 美化链接
     * @param {*} link 
     * @returns 
     */
    static pureLink2(link) {
        try {
            if (!(link && typeof link === 'string')) {
                return link;
            }

            link = link + '';

            // https://fb.com
            link = link.replace(/https:\/\/fb\.com/i, 'https://www.facebook.com');

            // https://www.fb.com
            link = link.replace(/https:\/\/www\.fb\.com/i, 'https://www.facebook.com');

            // https://facebook.com
            link = link.replace(/https:\/\/facebook\.com/i, 'https://www.facebook.com');

            link = link.replace(/http:\/\//, 'https://');

            link = link.replace(/\s+/g, '');
            link = link.replace(/\/+$/g, '');
            return link;
        } catch (error) {
            throw new Error(`Error-myutil-0160 ${error.message}`);
        }
    }

    // 0154


}
