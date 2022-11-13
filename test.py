import random
import time
def dummy():
    time.sleep(3)
    print(str([random.randint(0,10)/10,random.randint(0,10)/10])[1:-1])
if __name__ =='__main__' :
    dummy = dummy()