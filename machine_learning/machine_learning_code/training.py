import numpy as np
import cv2
import sys
from os import listdir
from os.path import isfile, join
from matplotlib import pyplot as plt

imgs = [f for f in listdir("./images/") if isfile(join("./images/", f))]

FLANN_INDEX_LSH = 6


img1 = cv2.imread("./images/base.jpg",0)

brisk = cv2.ORB_create()


kp1, des1 = brisk.detectAndCompute(img1,None)


index_params= dict(algorithm = FLANN_INDEX_LSH,
									 table_number = 6, # 12
									 key_size = 12,     # 20
									 multi_probe_level = 1) #2
search_params = dict(checks=50)   # or pass empty dictionary

flann = cv2.FlannBasedMatcher(index_params,search_params)

for filename in imgs:
		img2 = cv2.imread("./images/" + filename, 0)
		print "Detecting and computing {0}".format(filename)
		kp2, des2 = brisk.detectAndCompute(img2,None)
		print "Adding..."
		flann.add([des2])


print len(flann.getTrainDescriptors()) #verify that it actually took the descriptors in

print "Training..."
flann.train()

print "Matching..."
matches = flann.knnMatch(des1,k=2)

img2 = cv2.imread("./images/traffic.jpg", 0)
kp2, des2 = brisk.detectAndCompute(img2, None)

img3 = cv2.drawMatchesKnn(img1,kp1,img2,kp2,matches,None,**draw_params)

plt.imshow(img3),plt.show()