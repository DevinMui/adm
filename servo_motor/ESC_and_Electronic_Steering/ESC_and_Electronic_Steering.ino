#include <Servo.h>
Servo steering, ESC;
int turn = 90; 
int throttle=105; 

void setup()
{
  ESC.attach(0);
  ESC.write(105);
}

void loop()
{
  //zero = 105 
 ESC.write(throttle); 
 delay(200);
 throttle+0.2;
}



