package cmd.obj.friend;


public class PortalFriendInfo {
    public long id;
    public String accountName;
    public String displayName;
    public String avatarURL;

    public PortalFriendInfo(long _id, String _accountName, String _displayName) {
        id = _id;
        accountName = _accountName;
        displayName = _displayName;
    }

    public PortalFriendInfo(long id, String name, String socialDisplayName, String avatar) {
        this.id = id;
        this.accountName = name;
        this.displayName = socialDisplayName;
        this.avatarURL = avatar;
    }

    public String toString() {
        return String.format("%s|%s|%s|%s", new Object[] { id, accountName, displayName, avatarURL });
    }

}
