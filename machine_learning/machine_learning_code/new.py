import numpy as np
import cv2

traffic_cascade = cv2.CascadeClassifier('traffic-light.xml')
img = cv2.imread('images/1.png')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

lights = traffic_cascade.detectMultiScale(gray, 1.3, 5)
for (x,y,w,h) in lights:
	cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
	roi_gray = gray[y:y+h, x:x+w]
	roi_color = img[y:y+h, x:x+w]
	print "yes"

cv2.imshow('img',img)
cv2.waitKey(0)
cv2.destroyAllWindows()