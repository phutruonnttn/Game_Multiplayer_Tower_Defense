package battle.model;

import Constant.BattleError;
import bitzero.server.entities.User;
import cmd.request.battle.RequestBattleAction;

public class BattleAction {

    public User user;
    public int cmdID;
    public int countReceiveAction;
    public RequestBattleAction actionArguments;
    public int errorCode;

    public BattleAction(User user, int cmdID, int countReceiveAction, RequestBattleAction actionArguments) {
        this.user = user;
        this.cmdID = cmdID;
        this.countReceiveAction = countReceiveAction;
        this.actionArguments = actionArguments;
        this.errorCode = BattleError.SUCCESS;
    }
}
