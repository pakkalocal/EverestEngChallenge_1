module.exports = {
    getKeyByValue: (object, value) => {
        let key = Object.keys(object).find(key => object[key] === value);
        delete object[key]
        return key;
    },
    // find max sum subset of a given array
    getCombinations: (array, sum) => {
        function add(a, b) { return a + b; }

        function fork(i, t) {
            var r = (result[0] || []).reduce(add, 0),
                s = t.reduce(add, 0);
            if (i === array.length || s > sum) {
                if (s <= sum && t.length && r <= s) {
                    if (r < s) {
                        result = [];
                    }
                    result.push(t);
                }
                return;
            }
            fork(i + 1, t.concat([array[i]]));
            fork(i + 1, t);
        }

        var result = [];
        fork(0, []);
        return result;
    },
    toFixed: (num, fixed) => {
        return Math.trunc(num*Math.pow(10, fixed))/Math.pow(10, fixed)
    }
}