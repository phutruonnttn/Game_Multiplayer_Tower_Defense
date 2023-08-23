/**
 * Created by Team 2 - LongLH - GDF 17 on 4/11/2022.
 */


// var Time = new Date();
var Time = Time || {};

Time.unit = {
    D: 86400,
    H: 3600,
    M: 60,
    S: 1,
}

Time.secondToShortStr = function (second) {
    let strTime;
    for (let unit in Time.unit) {
        let timeAmount = Math.floor(second / Time.unit[unit]);
        if (timeAmount > 0) {
            second -= timeAmount * Time.unit[unit];
            timeAmount = String.concat(timeAmount, unit);
            if (strTime !== undefined) {
                strTime = String.concat(strTime, " ", timeAmount);
                break;
            }
            else {
                strTime = timeAmount;
            }
        }
    }
    if (strTime === undefined)
        strTime = "0S";
    return strTime;
};

Time.milisecToSecond = function (milisec) {
    return milisec / 1000;
}

Time.secondToMilisec = function (second) {
    return second * 1000;
}