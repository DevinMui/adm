#include <Servo.h>
#include <LiquidCrystal.h>
#include <LCDKeypad.h>

LiquidCrystal lcd(8, 9, 4, 5, 6, 7);
Servo steering, ESC;

int turn = 90;
int throttle = 95;
boolean shift;

void setup()
{
  lcd.begin(16, 2);
  lcd.setCursor(0, 0);
  lcd.print("ADM Initializing");
  delay(1000);
  
  ESC.attach(0);
  delay(200);
  ESC.write(105);
  delay(200);
  ESC.write(90);
  delay(200);
  
  lcd.setCursor(0, 0);
  lcd.print("   ADM Ready!   ");
  delay(500);
}

void loop()
{
  lcd.setCursor(0,1);
  lcd.print("SPEED: ");
  lcd.setCursor(7,1);
  lcd.print(throttle);
  //stop = 95
  ESC.write(throttle);
  delay(250);
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
  if (throttle <= 70)
  {
    shift = false;
  }
  else if (throttle >= 95)
    shift = true;
}


