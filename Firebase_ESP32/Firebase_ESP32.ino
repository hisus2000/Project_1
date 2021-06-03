#include <WiFi.h>
#include <FirebaseESP32.h>
#include <SimpleDHT.h>
#define WIFI_SSID "ConMeoBeo2.4GHz"
#define WIFI_PASSWORD "choduchien"
#define FIREBASE_HOST "https://project-1-44bc6-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "MtLsyFKEp5OuJdxGzgu13m95txVqymJrsUaH1B8V"
#define LED 23
#define Fan 22
//-----------------------------------------------------------------------------------

//---------------------------------------
// Define FirebaseESP32 data object
FirebaseData fbdo;
SimpleDHT11 dht11;


String path;
int pinDHT11 = 14;
byte temperature = 0;
byte humidity = 0;
int gio, phut, giay;
char thoigian[10];
String trangthai;
void setup()
{
  pinMode(LED, OUTPUT);
  pinMode(Fan, OUTPUT);
  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  Firebase.setReadTimeout(fbdo, 1000 * 60);
  Firebase.setwriteSizeLimit(fbdo, "tiny");
  Firebase.setString(fbdo, "/Living Room/Light", "OFF");
  Firebase.setString(fbdo, "/Living Room/Fan", "OFF");
}
void loop()
{
  LivingRoom();
  button_1();
  readDHT11();
  Firebase.setInt(fbdo, "/Living Room/Temperature", temperature);
  Firebase.setInt(fbdo, "/Living Room/Humidity", humidity);
  Serial.println("Temperature:" + String(temperature));
  Serial.println("Humidity:" + String(humidity));
}

void readDHT11()
{
  if (dht11.read(pinDHT11, &temperature, &humidity, NULL))
  {
    Serial.println("Read DHT11 failed.");
  }
}

void LivingRoom()
{
  if (Firebase.getString(fbdo, "/Living Room/Light"))
  {
    Serial.println("Living Room Light: " + fbdo.stringData());
    if (fbdo.stringData() == "ON")
    {
      digitalWrite(LED, HIGH);
    }
    else
    {
      digitalWrite(LED, LOW);
    }
  }
  if (Firebase.getString(fbdo, "/Living Room/Fan"))
  {
    Serial.println("Fan: " + fbdo.stringData());
    if (fbdo.stringData() == "ON")
    {
      digitalWrite(Fan, HIGH);
    }
    else
    {
      digitalWrite(Fan, LOW);
    }
  }
}
