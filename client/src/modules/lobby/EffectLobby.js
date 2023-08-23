/**
 * Created by Team 2 - LongLH - GDF 17 on 23/12/2022.
 */

EffectLobby = {};

EffectLobby.changeNumberLabel = function (label, delta, secondDuration) {
    let startTime = Date.now();
    if (delta === 0 || secondDuration <= 0) {
        label.setString(Utils.getInstance().formatIntToCurrencyString(Utils.getInstance().formatCurrencyStringToInt(label.getString()) + delta));
        return;
    }
    let secondPerFrame = 1 / 60;
    let amountChange = Math.ceil(Math.min(Math.abs(delta), Math.abs(delta) / secondDuration * secondPerFrame)) * (delta < 0 ? -1 : 1);
    label.setString(Utils.getInstance().formatIntToCurrencyString(Utils.getInstance().formatCurrencyStringToInt(label.getString()) + amountChange));
    let finishTime = Date.now();
    setTimeout(EffectLobby.changeNumberLabel,  Math.max(1, Time.secondToMilisec(secondPerFrame) - finishTime + startTime), label, delta-amountChange, secondDuration-secondPerFrame);
}

EffectLobby.gainObject = function (baseObject, numberObject, coordinateFrom, coordinateTo, parentGUI, callback) {
    new EffectGainObject(baseObject, numberObject, coordinateFrom, coordinateTo, parentGUI, callback);
}