#include <WiFi.h>
#include <PubSubClient.h>
#include <DHTesp.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define DHT_PIN 15
#define PIR_PIN 27
#define TRIG_PIN 5
#define ECHO_PIN 18
#define LDR_PIN 34

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASS = "";

const char* MQTT_HOST = "test.mosquitto.org";
const int MQTT_PORT = 1883;

String DEVICE_TOKEN =
"7ffae5b26556b78e085c54c95f4826a391b58a3b32e58011087a47e37e061198";

String DEVICE_ID = "wokwi-esp32-01";

WiFiClient espClient;
PubSubClient mqtt(espClient);

DHTesp dht;

LiquidCrystal_I2C lcd(0x27, 20, 4);

unsigned long lastPub = 0;
int page = 0;

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void connectMQTT() {

  mqtt.setServer(MQTT_HOST, MQTT_PORT);

  while (!mqtt.connected()) {

    String clientId =
      "ESP32-" + String(random(10000));

    mqtt.connect(clientId.c_str());

    delay(500);
  }
}

float getDistance() {

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIG_PIN, LOW);

  long duration =
      pulseIn(ECHO_PIN, HIGH);

  return duration * 0.034 / 2;
}

void setup() {

  Serial.begin(115200);

  pinMode(PIR_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  dht.setup(DHT_PIN, DHTesp::DHT22);

  lcd.init();
  lcd.backlight();

  lcd.setCursor(0,0);
  lcd.print("Connecting...");

  connectWiFi();
  connectMQTT();

  lcd.clear();
  lcd.print("System Ready");

  delay(1000);
}

void loop() {

  if (!mqtt.connected()) {
    connectMQTT();
  }

  mqtt.loop();

  if (millis() - lastPub > 5000) {

    lastPub = millis();

    TempAndHumidity th =
        dht.getTempAndHumidity();

    int pir =
        digitalRead(PIR_PIN);

    float distance =
        getDistance();

    int light =
        analogRead(LDR_PIN);

    lcd.clear();

    if(page == 0){

      lcd.setCursor(0,0);
      lcd.print("Temp:");
      lcd.print(th.temperature);

      lcd.setCursor(0,1);
      lcd.print("Hum:");
      lcd.print(th.humidity);
    }

    else if(page == 1){

      lcd.setCursor(0,0);
      lcd.print("Motion:");

      if(pir)
        lcd.print("YES");
      else
        lcd.print("NO");

      lcd.setCursor(0,1);
      lcd.print("Dist:");
      lcd.print(distance);
      lcd.print("cm");
    }

    else{

      lcd.setCursor(0,0);
      lcd.print("Light:");

      lcd.setCursor(0,1);
      lcd.print(light);
    }

    page++;
    if(page > 2) page = 0;

    String payload = "{";
    payload += "\"temperature\":" + String(th.temperature,1) + ",";
    payload += "\"humidity\":" + String(th.humidity,1) + ",";
    payload += "\"motion\":" + String(pir) + ",";
    payload += "\"distance\":" + String(distance,1) + ",";
    payload += "\"light\":" + String(light);
    payload += "}";

    mqtt.publish(
      "iot/gdpr/telemetry",
      payload.c_str()
    );

    Serial.println(payload);
  }
}