plugin.extend('PlatforBATTLErapper', {
    ctor: function (config) {

    },
    logCustom:function (data) {
        cc.log("logCustom", data);
    },
    getDeviceID:function () {

    },
    showAddToHomePopup:function () {
        if(!this.isCanShowAddToHomePopup())
        {
            return false;
        }
        var startX, startY;
        var duration, iPadXShift = 208;
        return true;
    },
    isCanShowAddToHomePopup:function(){
        if(cc.sys.os !== cc.sys.OS_IOS){
            return false;
        }
        if(this.isStandalone()){
            return false;
        }
        return true;
    },
    isStandalone:function(){
        return (typeof window.navigator != "undefined" && window.navigator.standalone);
    }

});