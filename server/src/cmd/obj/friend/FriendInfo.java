package cmd.obj.friend;


public class FriendInfo {
    public String accountType;
    public String socialName;
    public String socialId;

    public String avatarURL;

    public FriendInfo(String _accountType, String _id, String _name) {
        accountType = _accountType;
        socialName = _name;
        socialId = _id;
    }
}
