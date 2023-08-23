package util.server;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.LinkedList;
import java.util.List;


public class ServerLoop implements Runnable {
    public class LoopMethod {
        public String methodName;
        public Object target;
        public int maxTime;
        public int curTime;
        public int numTime;

        public LoopMethod(String fName, Object fTarget, int excTime, int nTime) {
            super();
            methodName = fName;
            target = fTarget;
            maxTime = excTime;
            curTime = excTime;
            numTime = nTime;
        }

        public boolean onTimer() {
            curTime--;
            if (curTime <= 0) {
                try {
                    Class c = target.getClass();
                    Method f = c.getMethod(methodName);
                    f.invoke(target, new Object[0]);
                    if (numTime > 0) {
                        numTime--;
                        if (numTime == 0) {
                            return false;
                        }
                    }
                    curTime = maxTime;
                    return true;
                } catch (IllegalAccessException e) {
                    return false;
                } catch (InvocationTargetException e) {
                    return false;
                } catch (NoSuchMethodException e) {
                    return false;
                }
            }
            return true;
        }
    }

    private List<LoopMethod> fList = new LinkedList<LoopMethod>();

    public ServerLoop() {
        super();
    }

    public void register(String fName, Object fTarget, int excTime, int nTime) {
        fList.add(new LoopMethod(fName, fTarget, excTime, nTime));
    }

    public void run() {
        //Logger.getLogger("packet").debug("go go Task Loop");
        for (int i = 0; i < fList.size(); i++) {
            if (!fList.get(i).onTimer()) {
                fList.remove(i);
                i--;
            }
        }
    }
}
