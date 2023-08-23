package util;

public class RandomNumber {

    public static int getNumberInRange(int min, int max, int step){
        return (int) Math.round((Math.random()* (max - min) + min )/step) * step;
    }

    public static int getNumberInRange(int min, int max){
        return (int)(Math.round((Math.random() * (max - min)) + min));
    }

    public static int[] getArrShuffle(int[] arr){
        int[] shuffleArr = new int[arr.length];
        for(int i = 0 ; i < arr.length; i++){
            int shuffIndex = getNumberInRange(0, arr.length - 1);
            shuffleArr[i] = arr[shuffIndex];
            shuffleArr[shuffIndex] = arr[i];
        }
        return shuffleArr;
    }
    public static int[] getRangeShuffle(int max){
        int[] shuffleArr = new int[max + 1];
        for(int i = 0 ; i <= max ; i++){
            shuffleArr[i] = i;
        }
        for(int i = 0 ; i <= max ; i++){
            int shuffIndex = getNumberInRange(0, max);
            int k = shuffleArr[i];
            shuffleArr[i] = shuffleArr[shuffIndex];
            shuffleArr[shuffIndex] = k;
        }

        return shuffleArr;
    }
}
