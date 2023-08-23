package cmd.obj.friend;


public class HttpResponseFriends {
    public int error;
    public SocialFriendInfo[] listFriend;

    public HttpResponseFriends(int _error, SocialFriendInfo[] _listFriend) {
        error = _error;
        listFriend = _listFriend;
    }

}
