package cmd.obj.authen;


public class AuthenticationInfo {
    public String uID;
    public String displayName;
    public String avatarURL;
    public String accountType;
    public String accountName;

    public AuthenticationInfo(String _uID, String _displayName, String _avatarURL, String _accountType,
                              String _accountName) {
        uID = _uID;
        displayName = _displayName;
        avatarURL = _avatarURL;
        accountType = _accountType;
        accountName = _accountName;
    }

    public void printInfo() {
        System.out.println("uID = " + uID);
        System.out.println("displayName = " + displayName);
        System.out.println("avatarURL = " + avatarURL);
        System.out.println("accountType = " + accountType);
        System.out.println("accountName = " + accountName);
    }
}
