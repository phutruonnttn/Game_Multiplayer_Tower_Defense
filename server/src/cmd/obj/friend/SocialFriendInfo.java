package cmd.obj.friend;


public class SocialFriendInfo {
    public String accountType = "";
    public String socialName = "";
    public String socialId = "";

    public String avatarURL = "";
    public int numSentInvitation;
    public long recentTimeSentInvitation;
    public long zingId = -1;
    public String displayName = "";
    public int numStar;

    public SocialFriendInfo(String _accountType, String _id, String _name) {
        accountType = _accountType;
        socialName = _name;
        socialId = _id;
    }
}
