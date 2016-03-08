#include <Servo.h>
Servo steering, ESC;
int turn = 90;
int throttle = 95;
boolean shift;

void setup()
{
  //Serial.begin(9200);
  ESC.attach(0);
  delay(200);
  ESC.write(105);
  delay(200);
  ESC.write(90);
  delay(200);
}

void loop()
{
  //Serial.println(throttle);
  //Serial.print(shift);
  //stop = 95
  ESC.write(throttle);
  delay(50);
  esc();
  if (shift)
  {
    throttle -= 0.5;
  }
  else
  {
    throttle++;
  }
}

void esc()
{
  if (throttle <= 1)
  {
    shift = false;
  }
  else if (throttle >= 95)
    shift = true;

}


