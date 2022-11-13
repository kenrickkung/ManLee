import cv2
import numpy as np
import matplotlib.pyplot as plt
import cv2 as cv
import skimage.io as io

def detectface(imgfile):
    face_cascade = cv2.CascadeClassifier('haarcascades/haarcascade_frontalface_default.xml')
    img=cv2.imread(imgfile)
    gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    faces= face_cascade.detectMultiScale(gray, 1.1,2)
    #for (x, y, w, h) in faces:
        #cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

    cropped_image = gray[faces[0][1]:faces[0][1]+faces[0][3],faces[0][0]:faces[0][0]+faces[0][2]] # Slicing to crop the image
    if len(cropped_image)!=112:
        cropped_image=cv.resize(cropped_image,(112,112))
    
    return(cropped_image)
