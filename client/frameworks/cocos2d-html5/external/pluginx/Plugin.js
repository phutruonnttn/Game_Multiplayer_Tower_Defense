/****************************************************************************
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * plugin manager
 * @class
 *
 */
var plugin;
(function(){

    if(cc === undefined){
        return;
    }

    //Native plugin usage
    /** @expose */
    var PluginManager = cc.Class.extend(
        {
            ctor:function () {

            },
            getInstance: function(){
                return this;
            },
        }
    );
    /** @expose */
    PluginManager.prototype = {
        constructor: PluginManager,

        /** @expose */
        getInstance: function(){
            return this;
        },

        /** @expose */
        loadPlugin: function(pluginName){
            if(PluginList[pluginName])
                return PluginList[pluginName]
            return plugin.create(pluginName);
        },

        /** @expose */
        unloadPlugin: function(pluginName){

        }
    };

    var PluginAssembly = function(){};

    PluginAssembly.prototype = {
        constructor: PluginAssembly,

        /** @expose */
        setDebugMode: function(debug){},

        /** @expose */
        startSession: function(appKey){},

        /** @expose */
        setCaptureUncaughtException: function(Capture){},

        /** @expose */
        callFuncWithParam: function(funName){
            if(typeof this[funName] === 'function'){
                var args =  Array.prototype.splice.call(arguments, 1);
                for(var i = 0; i <args.length; i++)
                {
                    args[i] = args[i].get();
                }
                return this[funName].apply(this, args);
            }else{
                cc.log("function is not define");
            }
        },

        /** @expose */
        callStringFuncWithParam: function(funName){
            this.callFuncWithParam.apply(arguments);
        },

        /** @expose */
        callIntFuncWithParam: function(funName){
            this.callFuncWithParam.apply(arguments);
        },
        callBoolFuncWithParam:function(funName){
            this.callFuncWithParam.apply(arguments);
        },
        /** @expose */
        getPluginName: function(){
            return this._name;
        },

        /** @expose */
        getPluginVersion: function(){
            return this._version;
        }
    };

    /** @expose */
    PluginAssembly.extend = function(name, porp){
        var p, prototype = {};
        for(p in PluginAssembly.prototype){
            prototype[p] = PluginAssembly.prototype[p];
        }
        for(p in porp){
            prototype[p] = porp[p];
        }
        var tmp = eval("(function " + name + "Plugin(){})");
        prototype.constructor = tmp;
        tmp.prototype = prototype;
        return tmp;
    };

    //Param
    var Param = cc.Class.extend({
        ctor:function (type, value) {
            this.type = type;
            this.value = value;
        },
        get:function () {
            var paramType = plugin.PluginParam.ParamType,tmpValue;
            var type = this.type;
            var value = this.value;
            switch(type){
                case paramType.TypeInt:
                    tmpValue = parseInt(value);
                    break;
                case paramType.TypeFloat:
                    tmpValue = parseFloat(value);
                    break;
                case paramType.TypeBool:
                    tmpValue = Boolean(value);
                    break;
                case paramType.TypeString:
                    tmpValue = String(value);
                    break;
                case paramType.TypeStringMap:
                    tmpValue = value//JSON.stringify(value);
                    break;
                default:
                    tmpValue = value;
            }
            return tmpValue
        }
    });


    /** @expose */
    Param.ParamType = {
        /** @expose */
        TypeInt:1,
        /** @expose */
        TypeFloat:2,
        /** @expose */
        TypeBool:3,
        /** @expose */
        TypeString:4,
        /** @expose */
        TypeStringMap:5
    };

    /** @expose */
    Param.AdsResultCode = {
        /** @expose */
        AdsReceived:0,
        /** @expose */
        FullScreenViewShown:1,
        /** @expose */
        FullScreenViewDismissed:2,
        /** @expose */
        PointsSpendSucceed:3,
        /** @expose */
        PointsSpendFailed:4,
        /** @expose */
        NetworkError:5,
        /** @expose */
        UnknownError:6
    };

    /** @expose */
    Param.PayResultCode = {
        /** @expose */
        PaySuccess:0,
        /** @expose */
        PayFail:1,
        /** @expose */
        PayCancel:2,
        /** @expose */
        PayTimeOut:3
    };

    /** @expose */
    Param.ShareResultCode = {
        /** @expose */
        ShareSuccess:0,
        /** @expose */
        ShareFail:1,
        /** @expose */
        ShareCancel:2,
        /** @expose */
        ShareTimeOut:3
    };

    /** @expose */
    var PluginList = {};

    /** @expose */
    var Plugin = {
        extend:function(name, extend)
        {
            this.extends[name] = extend;
        },
        /** @expose */
        create: function(name){
            if(!this.extends[name]){
                console.error("Extends plugin first!", name );
                return null;
            }
            var config = (cc.game.config && cc.game.config["plugin"]) || {};
            PluginList[name] = new (PluginAssembly.extend(name, this.extends[name]));
            typeof PluginList[name].ctor === "function" && PluginList[name].ctor(config);
            return PluginList[name];
        },

        /** @expose */
        PluginList: PluginList,
        extends:[],

        /** @expose */
        PluginParam: Param,

        /** @expose */
        PluginManager: new PluginManager()

    };

    /** @expose */
    plugin = Plugin;

})();