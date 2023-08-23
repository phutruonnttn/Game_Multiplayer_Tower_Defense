let Utils = cc.Class.extend({

    formatIntToCurrencyString: function (number) {
        var returnString = ""
        var numberStr = "" + number
        let count = 0
        for (let i=numberStr.length-1; i>=0; i--) {
            count++
            returnString = numberStr[i] + returnString
            if (count === 3 && i !== 0) {
                returnString = "." + returnString
                count = 0;
            }
        }
        return returnString
    },

    formatCurrencyStringToInt: function (string) {
        let returnString = "";
        string.split('').forEach((char) => {
            if (char !== '.')
                returnString += char;
        });
        return Number(returnString);
    },

    // Lay vector tu 2 diem
    getVector: function (firstPoint, secondPoint) {
        return cc.p(
            Utils.round(secondPoint.x - firstPoint.x),
            Utils.round(secondPoint.y - firstPoint.y)
        );
    },

    // Chuan hoa vector
    normalizeVector: function (vector) {
        var lengthOfVector = this.getVectorLength(vector);
        return cc.p(
            Utils.round(vector.x/lengthOfVector),
            Utils.round(vector.y/lengthOfVector)
        );
    },

    getCosAngle2Vector: function (v1,v2) {
        return Utils.round(Utils.round(Utils.round(v1.x * v2.x) + Utils.round(v1.y * v2.y))
            / Utils.round(this.getVectorLength(v1)*this.getVectorLength(v2)));
    },
    
    getVectorLengthSqr: function (vector) {
        return Utils.round(vector.x * vector.x + vector.y * vector.y);
    },

    getVectorLength: function (vector) {
        return Utils.round(Math.sqrt(this.getVectorLengthSqr(vector)));
    },

    inCircle: function (centre, radius, pos) {
        return this.getVectorLengthSqr(this.getVector(centre, pos)) <= Utils.round(Math.pow(radius, 2));
    },

    // Số thực truyền vào được làm tròn đến 3 chữ số thập phân
    // sau dấu phẩy, và được chuyển về kiểu int bằng cách * 1000
    // -> tối ưu số byte khi truyền/ nhận gói tin với server
    roundAndParseToInt: function (number) {
        return Math.floor(number * 1000)
    },

    // Trả về chuỗi ký tự số tự nhiên luôn có tối thiểu 4 chữ số
    to4digitNum: function (n) {
        if (n < 10)
            return "000" + n;
        if (n < 100)
            return "00" + n;
        if (n < 1000)
            return "0" + n;
        return n;
    },

    objectAssign: function (target, source) {
        for (let key in source)
            target[key] = source[key];
        return target;
    }
})

var _utils;
Utils.getInstance = function () {
    if (_utils === undefined)
        _utils = new Utils();
    return _utils;
}

Utils.round = function (n) {
    var rounder = 1000;
    return Math.round(n * rounder) / rounder;
};

Utils.equal = function (a, b) {
    var eps = 0.000001;
    return Math.abs(a - b) <= eps;
};