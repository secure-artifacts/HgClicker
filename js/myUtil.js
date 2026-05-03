class myUtil {

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

    static timeToSeconds(timeString) {
        const self = this;

        try {
            let _calc = (hours, minutes, seconds) => {
                hours = Number(hours);
                minutes = Number(minutes);
                seconds = Number(seconds);

                if (hours >= 24) { hours = 23; }
                if (minutes >= 60) { minutes = 59; }
                if (seconds >= 60) { seconds = 59; }

                let total = 0;
                if (hours > 0) { total += hours * 3600; }
                if (minutes > 0) { total += minutes * 60; }
                total += seconds;
                return total;
            };

            timeString += '';
            timeString = self.textTrim(timeString);

            if (!timeString) { return 0; }

            let matches = null;

            matches = timeString.match(/^(\d+)[^\d]+?(\d+)[^\d]+?(\d+)$/);
            if (matches) { return _calc(matches[1], matches[2], matches[3]); }

            matches = timeString.match(/^(\d+)[^\d]+?(\d+)$/);
            if (matches) { return _calc(0, matches[1], matches[2]); }

            matches = timeString.match(/^(\d+)$/);
            if (matches) { return _calc(0, 0, matches[1]); }

            return 0;
        } catch (error) {
            throw new Error(`Error-myutil-0018: ${error.message}`);
        }
    }

    static arrayUnique(array) {
        try {
            if (Array.isArray(array) && array.length) {
                return array.filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                });
            }
            return array;
        } catch (error) {
            throw new Error(`Error-myutil-0022: ${error.message}`);
        }
    }

    static randomBetweenInt(min, max) {
        try {
            if (min > max) { let temp = min; min = max; max = temp; }
            min = Math.ceil(min);
            max = Math.floor(max + 1);
            return Math.floor(Math.random() * (max - min) + min);
        } catch (error) {
            throw new Error(`Error-myutil-0039: ${error.message}`);
        }
    }

    static randomArrayItem(array) {
        const self = this;
        try {
            if (!(Array.isArray(array) && array.length)) { return array; }
            let index = self.randomBetweenInt(0, array.length - 1);
            return array[index];
        } catch (error) {
            throw new Error(`Error-myutil-0041: ${error.message}`);
        }
    }

    static async sleep(ms) {
        try {
            return new Promise(resolve => setTimeout(resolve, ms));
        } catch (error) {
            throw new Error(`Error-myutil-0044: ${error.message}`);
        }
    }

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
}
