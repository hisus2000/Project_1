#include <WiFi.h>
#include <FirebaseESP32.h>
#include <SimpleDHT.h>
#define WIFI_SSID "ConMeoBeo2.4GHz"
#define WIFI_PASSWORD "choduchien"
#define FIREBASE_HOST "https://project-1-44bc6-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "MtLsyFKEp5OuJdxGzgu13m95txVqymJrsUaH1B8V"
#define LED 23
#define fan 22
#define nutnhan_1 2
#define nutnhan_2 15
int t1 = 0, t2 = 0;
int status1, status2;
FirebaseData fbdo;
SimpleDHT11 dht11;

String path;
int pinDHT11 = 14;
byte temperature = 0;
byte humidity = 0;

void button_1()
{
  t1 = !t1;
  delay(20);
  if (t1 == 1)
  {
    digitalWrite(LED, HIGH);
    Firebase.setString(fbdo, "/Living Room/Light", "ON");
  }
  else
  {
    digitalWrite(LED, LOW);
    Firebase.setString(fbdo, "/Living Room/Light", "OFF");
  }
}

void setup()
{
  // attachInterrupt(nutnhan_1, button_1, CHANGE);
  pinMode(LED, OUTPUT);
  pinMode(fan, OUTPUT);
  pinMode(nutnhan_1, INPUT);
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
}

void loop()
{
  LivingRoom_Light();
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

void LivingRoom_Light()
{
  if (Firebase.getString(fbdo, "/Living Room/Light"))
  {
    Serial.println("Living Room Light: " + fbdo.stringData());
    if (fbdo.stringData() == "ON")
    {
      t1 = 1;
    }
    else
    {
      t1 = 0;
    }
  }

  if (t1 == 1)
  {
    digitalWrite(LED, HIGH);
    Firebase.setString(fbdo, "/Living Room/Light", "ON");
  }
  else
  {
    digitalWrite(LED, LOW);
    Firebase.setString(fbdo, "/Living Room/Light", "OFF");
  }

  if (Firebase.getString(fbdo, "/Living Room/Fan"))
  {
    Serial.println("Fan: " + fbdo.stringData());
    if (fbdo.stringData() == "ON")
    {
      digitalWrite(fan, HIGH);
    }
    else
    {
      digitalWrite(fan, LOW);
    }
  }
}