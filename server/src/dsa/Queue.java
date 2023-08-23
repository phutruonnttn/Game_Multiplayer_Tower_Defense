package dsa;

import java.util.ArrayList;

public class Queue {
    private ArrayList<Object> data;
    public Queue() {
        data = new ArrayList<>();
    }

    public boolean isEmpty() {
        return data.isEmpty();
    }

    public void enqueue(Object item) {
        data.add(item);
    }

    public Object dequeue() {
        if (isEmpty()) return null;
        Object returnValue = data.get(0);
        data.remove(0);
        return returnValue;
    }
}
