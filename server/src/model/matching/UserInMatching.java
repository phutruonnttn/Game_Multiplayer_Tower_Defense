package model.matching;

import bitzero.server.BitZeroServer;
import bitzero.server.entities.User;
import config.matching.MatchingConfig;

import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class UserInMatching implements Comparable<UserInMatching>{
    public User user;
    public double fame;
    public int rangeFame;
    public boolean isInQueue;
    public ScheduledFuture loop;

    public UserInMatching(User user, double fame, boolean doRunLoop) {
        this.user = user;
        this.fame = fame;
        rangeFame = MatchingConfig.RANGE_FAME_INIT;
        isInQueue = true;
        if (doRunLoop) {
            runLoop();
        }
    }

    public void cancelLoop() {
        loop.cancel(true);
    }

    public void runLoop() {
        FameRangeHandle fameRangeHandle = new FameRangeHandle(this);
        loop = BitZeroServer.getInstance().getTaskScheduler().scheduleAtFixedRate(
                fameRangeHandle,
                5,
                5,
                TimeUnit.SECONDS
        );
    }

    @Override
    public int compareTo(UserInMatching o) {
        double distance = this.fame - o.fame;
        if (distance < 0) {
            return -1;
        } else if (distance > 0) {
            return  1;
        }
        return 0;
    }
}