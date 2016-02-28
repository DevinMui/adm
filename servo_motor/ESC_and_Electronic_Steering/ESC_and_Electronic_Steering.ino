#include <Servo.h>
Servo steering, ESC;
int turn, throttle;
int pos = 0;
int x=0;
const int trigPin = 8;
const int echoPin = 7;

void setup()
{
  
  steering.attach(2);
   ESC.attach(3);
   ESC.write(40);
   delay(600);
   ESC.write(20);
   delay(600);
   ESC.write(30);
   steering.write(0);
   delay(600);
   steering.write(180);
   delay(600);
   steering.write(90);
}

void loop()
{
//   long duration, inches, cm;
//
//  // The sensor is triggered by a HIGH pulse of 10 or more microseconds.
//  // Give a short LOW pulse beforehand to ensure a clean HIGH pulse:
//  pinMode(trigPin, OUTPUT);
//  digitalWrite(trigPin, LOW);
//  delayMicroseconds(2);
//  digitalWrite(trigPin, HIGH);
//  delayMicroseconds(10);
//  digitalWrite(trigPin, LOW);
//
//  // Read the signal from the sensor: a HIGH pulse whose
//  // duration is the time (in microseconds) from the sending
//  // of the ping to the reception of its echo off of an object.
//  pinMode(echoPin, INPUT);
//  duration = pulseIn(echoPin, HIGH);
//
//  // convert the time into a distance
//  inches = microsecondsToInches(duration);
//  cm = microsecondsToCentimeters(duration);
//
//  if(inches <= 200){
//    Serial.print(inches);
//    Serial.print("in, ");
//    Serial.print(cm);
//    Serial.print("cm");
//    Serial.println();
//  } else {
//    Serial.println(-1);  
//  }
  
  //delay(100);
 
  
}



