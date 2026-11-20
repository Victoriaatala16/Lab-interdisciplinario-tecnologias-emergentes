#include <WiFi.h>
#include <esp_now.h>

uint8_t macTotem1[] = {0x64, 0xB7, 0x08, 0xAD, 0x2B, 0x20};
uint8_t macBroadcast[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

typedef struct struct_telemetria {
  char id_dispositivo[16];
  float latitud;
  float longitud;
  float altitud;
  int satelites;
  char hora[10];
  bool estado_sos;
  int ultimo_totem;
  char sentido[8];
} struct_telemetria;

typedef struct struct_control {
  char comando[16];
  char parametro[32];
} struct_control;

struct_telemetria datosPulsera;
struct_control datosControl;

volatile bool nuevoPaquetePendiente = false;
volatile int ultimoRssi = -100;
unsigned long ultimoCheckInEnviado = 0;

void agregarPeer(uint8_t *mac) {
  esp_now_peer_info_t peer;
  memset(&peer, 0, sizeof(peer));
  memcpy(peer.peer_addr, mac, 6);
  peer.channel = 0;
  peer.encrypt = false;
  esp_now_add_peer(&peer);
}

void alRecibirPaquete(const esp_now_recv_info_t *info, const uint8_t *datos, int len) {
  if (len < sizeof(datosPulsera)) return;
  memcpy(&datosPulsera, datos, sizeof(datosPulsera));
  ultimoRssi = info->rx_ctrl->rssi;
  nuevoPaquetePendiente = true;
}

void setup() {
  Serial.begin(115200);
  delay(1500);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  if (esp_now_init() != ESP_OK) {
    Serial.println("[ERROR] Fallo ESP-NOW en XIAO");
    return;
  }

  esp_now_register_recv_cb(alRecibirPaquete);
  agregarPeer(macTotem1);
  agregarPeer(macBroadcast);

  Serial.println("[OK] XIAO TOTEM-2 INICIADO...");
}

void loop() {
  if (nuevoPaquetePendiente) {
    nuevoPaquetePendiente = false;

    if (strlen(datosPulsera.id_dispositivo) > 0) {
      // Umbral calibrado para antena cerámica del XIAO S3 (-85 dBm)
      bool cerca = (ultimoRssi > -85);

      Serial.print("[XIAO T2] Pulsera: ");
      Serial.print(datosPulsera.id_dispositivo);
      Serial.print(" | RSSI: ");
      Serial.print(ultimoRssi);

      if (cerca || datosPulsera.estado_sos) {
        Serial.println(" -> DETECTADA EN TOTEM 2!");

        if (!datosPulsera.estado_sos && (millis() - ultimoCheckInEnviado > 6000)) {
          ultimoCheckInEnviado = millis();
          memset(&datosControl, 0, sizeof(datosControl));
          strcpy(datosControl.comando, "CHECK_IN");
          strcpy(datosControl.parametro, "2");
          esp_now_send(macBroadcast, (uint8_t *)&datosControl, sizeof(datosControl));
        }

        datosPulsera.ultimo_totem = 2;
        esp_now_send(macTotem1, (uint8_t *)&datosPulsera, sizeof(datosPulsera));
      } else {
        Serial.println(" (Lejos)");
      }
    }
  }
  delay(10);
}