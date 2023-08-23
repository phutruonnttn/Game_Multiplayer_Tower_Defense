package model.matching;

import config.matching.MatchingConfig;
import handler.MatchingHandler;

public class FameRangeHandle implements Runnable{
    public UserInMatching userInMatching;

    public FameRangeHandle(UserInMatching userInMatching) {
        this.userInMatching = userInMatching;
    }

    @Override
    public void run() {
        userInMatching.rangeFame += MatchingConfig.FAME_EXTEND;
        MatchingHandler.getInstance().findMatch(userInMatching);
    }
}
