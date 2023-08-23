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
 * Google SDK for Web Platform <br/>
 * GoogleAgent...
 *
 * @property {String} name - plugin name
 * @property {String} version - API version
 */
var ggsdk = {
    /** expose */
    gapi:{}
}
plugin.extend('UserGoogle', {
    name: "",
    version: "",
    _userInfo: null,
    _isLoggedIn: false,

    /**
     * Succeed code returned in callbacks
     * @constant
     * @type {Number}
     */
    CODE_SUCCEED: 0,

    ctor: function (config) {
        this.name = "google";
        this.version = "1.0";
        this._userInfo = {};
        this._isLoggedIn = false;
        var self = this;

        this.config = config['google'];
        /** @expose */
        window.ggAsyncInit = function()
        {
            plugin.GoogleAgent.asyncInit();
        };

        plugin.GoogleAgent = this;

        (function(d, s, id) {                      // Load the SDK asynchronously
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.type = "text/javascript";
            js.async = true;
            js.src = "https://apis.google.com/js/client:platform.js?onload=ggAsyncInit";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));

    },
    asyncInit:function()
    {
        var self = this;
        gapi['load']('auth2', function()
        {
            //gapi.client.setApiKey(config.apiKey);
             gapi['auth2']['init'](self.config)['then'](function () {
                 gapi['auth2']['getAuthInstance']()['isSignedIn']['listen'](self.updateSigninStatus);
                 self.updateSigninStatus(gapi['auth2']['getAuthInstance']()['isSignedIn']['get']());
            });
        });
    },
    updateSigninStatus:function(isSignedIn)
    {

        if(isSignedIn)
        {

        }else
        {

        }
        plugin.GoogleAgent._isLoggedIn = isSignedIn;
    },

    _makeApiCall:function() {

    },
    /**
     * Gets the current object
     * @returns {GoogleAgent}
     */
    getInstance: function () {
        return this;
    },
    /**
     * Login to google
     * @param {Function} callback
     * @param {Array} permissions
     * @example
     * //example
     * plugin.GoogleAgent.login();
     */
    login: function(callback) {
        this._callback = callback;
        var self = this;
        gapi['auth2']['getAuthInstance']()['signIn']()['then'](function (response) {
            var accessToken = response['getAuthResponse'](true)['access_token'];
            typeof callback === 'function' && callback(0, accessToken);
        })['catch'](function (error) {
            console.log(error);
            callback(1, error);
        });
    },
    /**
     * Checking login status
     * @return {Bool} Whether user is logged in
     * @example
     * //example
     * plugin.GoogleAgent.isLoggedIn(type, msg);
     */
    isLoggedIn: function() {
        //this._checkLoginStatus();
        return this._isLoggedIn;
    },

    /**
     * Logout of google
     * @param {Function} callback
     * @example
     * //example
     * plugin.GoogleAgent.logout(callback);
     */
    logout: function (callback) {
        this._callback = callback;
        gapi['auth2']['getAuthInstance']()['signOut']();
        typeof callback === 'function' && callback(2);
    },
    getAccessToken: function () {
        return this._userInfo ? this._userInfo['accessToken'] : null;
    },

    /**
     * Acquiring User ID
     * @return {String}
     * @example
     * //example
     * var userID = plugin.GoogleAgent.getUserID();
     */
    getUserID: function () {
        return this._userInfo ? this._userInfo['userID'] : null;
    },

    destroyInstance: function () {
    },
    configDeveloperInfo:function()
    {

    }
});
