#include <SoftwareSerial.h>
#include <String.h>
 
SoftwareSerial gprsSerial(7,8);
 
void setup()
{
  gprsSerial.begin(19200); // GPRS shield baud rate 
  Serial.begin(19200);   
  delay(500);
}
uint32_t timer = millis();
void loop()
{
  if(millis() - timer > 5000){
    timer = millis();
  /*if (Serial.available()) // if there is incoming serial data
     switch(Serial.read()) // read the character
     {
       case 't': // if the character is 't'
         SendTextMessage("fag"); // send the text message
         break;
       case 'r':
         ReadMessages();
         break;
       case 'd':
         DeleteMessages();
         break;
       default:
         SendTextMessage("fag");
   
     }*/
     SendTextMessage("fag");
   }
   //SendTextMessage("fag");
 
  if (gprsSerial.available()){ // if the shield has something to say

    Serial.write(gprsSerial.read()); 

  }
}
 
/*
* Name: SendTextMessage
* Description: Send a text message to a number
*/
void ReadMessages()
{
  Serial.println("Reading...");
  gprsSerial.println("AT+CMGL=\"ALL\"");
}

void DeleteMessages()
{
  Serial.println("Deleting");
  gprsSerial.println("AT+CMGD=1,4");
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
