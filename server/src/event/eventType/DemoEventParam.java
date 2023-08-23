package event.eventType;

import bitzero.server.core.IBZEventParam;

/**
 * Created by hieupt on 11/8/18.
 */
public enum DemoEventParam implements IBZEventParam {
    NAME,
    USER,
    LOGIN_SUCCESS;

    private DemoEventParam(){}

}
