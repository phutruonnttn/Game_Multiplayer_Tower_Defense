var LoginController = cc.Class.extend({
    _gameClient : null,
    userId: null,
    ctor: function (gameClient){
        this._gameClient = gameClient;
    },
    sendLoginReq: function (){
        var pk = this._gameClient.getOutPacket(CmdSendLogin);
        pk.pack(parseInt(this.userId));
        this._gameClient.sendPacket(pk);
    },
    connectServer: function (userId){
        if(this.userIdIsEmpty(userId)){
            return LOGIN_STATUS.INPUT_EMPTY;
        };
        if(!this.userIdIsNumber(userId)){
            return LOGIN_STATUS.INPUT_IS_NOT_NUMBER;
        };
        this.userId = parseInt(userId);
        this._gameClient.connect();

        // TODO
        gv.user.id = this.userId
    },
    userIdIsNumber: function (userId){
        if(!userId.length){
            return false;
        }
        for(var i in userId){
            if(userId[i] < '0' || userId[i] > '9'){
                return false;
            }
        }
        return true;
    },
    userIdIsEmpty: function (userId){
        if(userId.length){
            return false;
        }
        return true;
    }
});

var loginController = null;

var getLoginController = function (){
    if(loginController == null){
        loginController = new LoginController(gv.gameClient);
    }
    return loginController;
}