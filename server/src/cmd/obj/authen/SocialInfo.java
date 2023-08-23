package cmd.obj.authen;


public class SocialInfo {
    public int error;
    public String openId;
    public String avatar;
    public String name;
    public String displayName;

    public SocialInfo(int _err, String _openId, String _ava, String _name, String _displayName) {
        super();
        error = _err;
        openId = _openId;
        avatar = _ava;
        name = _name;
        displayName = _displayName;
    }
}
