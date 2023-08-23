var localStorage = cc.sys.localStorage;

var LoginScreen = cc.Layer.extend({
    ctor: function (){
        this._super();
        this.loginController = getLoginController();
        this.loginScreen = ccs.load("ui/LoginScreen.json", "").node;
        this.loginInput = this.loginScreen.getChildByName("loginInput");
        this.loginInput.setString(localStorage.getItem("loginInput")||"");

        this.loginBtn = this.loginScreen.getChildByName("loginBtn");
        this.loginBtn.setZoomScale(0.01)
        this.loginBtn.setPressedActionEnabled(true);
        this.loginBtn.addClickEventListener(this.onSelectLogin.bind(this));

        this.notifyLabel = this.loginScreen.getChildByName("notifyLabel");
        this.notifyLabel.setVisible(false);
        this.timeout = null;
        this.addChild(this.loginScreen);
    },
    onSelectLogin: function (){
        localStorage.setItem("loginInput", this.loginInput.string);
        var userId = this.loginInput.string;
        var status = this.loginController.connectServer(userId);
        if(status == LOGIN_STATUS.INPUT_EMPTY){
            this.notifyLabel.setString("Bạn chưa nhập Id");
            this.showNotify();
        }
        if(status == LOGIN_STATUS.INPUT_IS_NOT_NUMBER){
            this.notifyLabel.setString("Nhập sai Id");
            this.showNotify();
        }

    },
    showNotify: function (){
        if(this.timeout != null){
            clearTimeout(this.timeout);
        }
        this.notifyLabel.setVisible(true);
        this.timeout = setTimeout(() => {
            this.notifyLabel.setVisible(false);
        }, 3000);
    },
    onConnectSuccess: function (){
        cc.log("connect success")
        fr.view(Lobby, 1);
    },
    onConnectFail: function (str){
        cc.log(str)
    }
})