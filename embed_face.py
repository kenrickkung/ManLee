import torch
import torch.nn as nn
import cv2 as cv
import sys
import numpy as np

class Encoder(nn.Module):
    def __init__(self, channels_img, features, img_size):
        super(Encoder, self).__init__()
        self.img_size = img_size
        
        self.encoder = nn.Sequential(
            
            nn.Conv2d(channels_img, features*8, (4,4), (2,2), 1),
            nn.BatchNorm2d(features*8),
            nn.ReLU(),
            
            self._enc_block(features*8, features*16, (4,4), (2,2), 1),
            self._enc_block(features*16, features*16, (4,4), (2,2), 1),
            self._enc_block(features*16, features*32, (4,4), (2,2), 2),
            self._enc_block(features*32, features*16, (4,4), (2,2), 1), #256x4x4

            nn.Flatten(),
            nn.Linear(features*16*4*4, 1024),
            nn.ReLU(),
            nn.Linear(1024, 128),
            nn.Softmax(dim=1),
            
        )
           
    
    def _enc_block(self, in_channels, out_channels, kernel_size, stride, padding):
        return nn.Sequential(
            nn.Conv2d(
                in_channels,
                out_channels,
                kernel_size,
                stride,
                padding,
                bias=False
            ),
            nn.BatchNorm2d(out_channels),
            nn.ReLU6(),
            nn.Dropout(0.1),
        )

    def forward(self, images):
        return self.encoder(images)

def get_face_tensor(imgfile, device):
    face_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eyes_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_eye.xml')
    img=cv.imread(imgfile)
    gray=cv.cvtColor(img,cv.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1,2)

    cropped_image = gray[faces[0][1]:faces[0][1]+faces[0][3], faces[0][0]:faces[0][0]+faces[0][2]] # Slicing to crop the image
    eyes = eyes_cascade.detectMultiScale(cropped_image)
    cropped_image = cv.resize(cropped_image, (112,112))/255
    if len(eyes) < 2:
        return None
    return (torch.tensor(cropped_image).float().unsqueeze(0).unsqueeze(0).to(device))

def main():
    CHANNELS = 1
    FEATURES = 16
    IMG_SIZE = 112
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    enc = Encoder(CHANNELS, FEATURES, IMG_SIZE).to(device)
    enc.load_state_dict(torch.load("softmax_sd.pth", map_location = device))
    enc.eval()

    img = get_face_tensor(sys.argv[1], device)
    if img == None:
        print(-1)
        return 1
    with torch.no_grad():
        embedding = enc(img)*10e15
        print(str(embedding.tolist()).replace(" ", "")[2:-2])
    return 0

main()

