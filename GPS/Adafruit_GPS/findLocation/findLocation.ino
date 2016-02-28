#include <Adafruit_GPS.h>
#include <SoftwareSerial.h>
#include <Float.h>

SoftwareSerial mySerial(3, 2);

Adafruit_GPS GPS(&mySerial);
#define GPSECHO  true
boolean usingInterrupt = false;
void useInterrupt(boolean);

void setup()
{
  Serial.begin(115200);
  Serial.println("Adafruit GPS library basic test!");

  GPS.begin(9600);
  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);

  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);  
  GPS.sendCommand(PGCMD_ANTENNA);
  useInterrupt(true);

  delay(1000);
  // Ask for firmware version
  //mySerial.println(PMTK_Q_RELEASE);
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
  if (! usingInterrupt) {
    char c = GPS.read();
  }

  if (GPS.newNMEAreceived()) {

    if (!GPS.parse(GPS.lastNMEA())) 
      return; 
  }

  // if millis() or timer wraps around, we'll just reset it
  if (timer > millis())  timer = millis();

  // approximately every 2 seconds or so, print out the current stats
  if (millis() - timer > 2000) {
    timer = millis(); // reset the timer
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
}
