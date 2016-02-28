#include <Adafruit_GPS.h>
#include <SoftwareSerial.h>
#include <String.h>
 
SoftwareSerial gprsSerial(7,8);

SoftwareSerial mySerial(3, 2);

Adafruit_GPS GPS(&mySerial);
#define GPSECHO  true
boolean usingInterrupt = false;
void useInterrupt(boolean);

void setup()
{

  GPS.begin(9600);
  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);

  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);  
  GPS.sendCommand(PGCMD_ANTENNA);
  useInterrupt(true);

  delay(500);
  
  gprsSerial.begin(19200); // GPRS shield baud rate 
  //delay(500);
  Serial.begin(115200);
  //Serial.println("Adafruit GPS library basic test!");

}

SIGNAL(TIMER0_COMPA_vect) {
  char c = GPS.read();
#ifdef UDR0
  if (GPSECHO)
    if (c) UDR0 = c;
#endif
}

void useInterrupt(boolean v) {
  if (v) {
    OCR0A = 0xAF;
    TIMSK0 |= _BV(OCIE0A);
    usingInterrupt = true;
  } else {
    TIMSK0 &= ~_BV(OCIE0A);
    usingInterrupt = false;
  }
}

uint32_t timer = millis();
void loop()
{
  // +CMGL: 1,"REC UNREAD","+14159943383","","16/02/28,12:37:06-32"
  // Bbjj
  
  if (! usingInterrupt) {
    char c = GPS.read();
  }

  if (GPS.newNMEAreceived()) {

    if (!GPS.parse(GPS.lastNMEA())) 
      return; 
  }
  //if (timer > millis())  timer = millis();
  if (millis() - timer > 5000) {
    timer = millis(); // reset the timer

    ReadMessages();
    DeleteMessages();
    
    if (GPS.fix) {
      Serial.print("Location: ");
      float latitude = GPS.latitude;
      String lat = String(latitude);
      float longitude = GPS.longitude;
      String lon = String(longitude);
      
      if(GPS.lat == 'N'){
        Serial.print("+"); Serial.print(lat[0]); Serial.print(lat[1]); lat.remove(0,2); Serial.print(" "); Serial.print(lat);
      } else {
        Serial.print("-"); Serial.print(lat[0]); Serial.print(lat[1]); lat.remove(0,2); Serial.print(" "); Serial.print(lat);
      }
      Serial.print(", ");
      if(GPS.lon == 'E'){
        Serial.print("+"); Serial.print(lon[0]); Serial.print(lon[1]); Serial.print(lon[2]); lon.remove(0,3); Serial.print(" "); Serial.print(lon);
      } else {
        Serial.print("-"); Serial.print(lon[0]); Serial.print(lon[1]); Serial.print(lon[2]); lon.remove(0,3); Serial.print(" "); Serial.print(lon);
      }
      Serial.println();

      Serial.print("Speed (knots): "); Serial.println(GPS.speed);
    }
  }

  if (gprsSerial.available()){ // if the shield has something to say
    Serial.write(gprsSerial.read()); // display the output of the shield
  }
}

void ReadMessages()
{
  Serial.println("Reading...");
  gprsSerial.println("AT+CMGL=\"ALL\"");
}

void SendTextMessage(String text)
{
  Serial.println("Sending Text...");
  gprsSerial.print("AT+CMGF=1\r"); // Set the shield to SMS mode
  delay(100);
  // send sms message, the phone number needs to include the country code e.g. if a U.S. phone number such as (540) 898-5543 then the string must be:
  // +15408985543
  gprsSerial.println("AT+CMGS = \"+14159943383\"");
  delay(100);
  gprsSerial.println(text); //the content of the message
  delay(100);
  gprsSerial.print((char)26);//the ASCII code of the ctrl+z is 26 (required according to the datasheet)
  delay(100);
  gprsSerial.println();
  Serial.println("Text Sent.");
}

void DeleteMessages()
{
  gprsSerial.println("AT+CMGD=1,4");
}

