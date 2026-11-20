#include <WiFi.h>
#include <esp_now.h>

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

struct_telemetria datosRecibidos;
struct_control datosControl;

unsigned long ultimoCheckInT1 = 0;

void agregarPeer(uint8_t *mac) {
  esp_now_peer_info_t peer;
  memset(&peer, 0, sizeof(peer));
  memcpy(peer.peer_addr, mac, 6);
  peer.channel = 0;
  peer.encrypt = false;
  esp_now_add_peer(&peer);
}

void despacharComando(const char* cmd, const char* param = "") {
  memset(&datosControl, 0, sizeof(datosControl));
  strncpy(datosControl.comando, cmd, sizeof(datosControl.comando));
  strncpy(datosControl.parametro, param, sizeof(datosControl.parametro));
  esp_now_send(macBroadcast, (uint8_t *)&datosControl, sizeof(datosControl));
}

void alRecibirESPNow(const esp_now_recv_info_t *info, const uint8_t *datos, int len) {
  if (len < sizeof(datosRecibidos)) return;
  memcpy(&datosRecibidos, datos, sizeof(datosRecibidos));

  int rssiSenal = info->rx_ctrl->rssi;
  int hito = datosRecibidos.ultimo_totem;

  // 1. Umbral más corto (-48 dBm = aprox 30 cm de la antena)
  // 2. Tiempo de espera de 25 segundos (25000 ms) para no repetir lecturas al tiro
  if (hito != 2 && (rssiSenal > -48)) {
    hito = 1;
    if (!datosRecibidos.estado_sos && (millis() - ultimoCheckInT1 > 25000)) {
      ultimoCheckInT1 = millis();
      despacharComando("CHECK_IN", "1");
    }
  }

  if (hito <= 0) hito = 1;

  float km = (hito == 2) ? 1.4 : 0.0;
  const char* nombreTotem = (hito == 2) ? "TOTEM-2" : "TOTEM-1";

  char jsonBuffer[340];
  snprintf(jsonBuffer, sizeof(jsonBuffer),
           "{\"id\":\"%s\",\"alerta\":%s,\"lat\":%.6f,\"lon\":%.6f,\"alt\":%.1f,\"sats\":%d,\"hora\":\"%s\",\"rssi\":%d,\"cerca\":true,\"totem\":\"%s\",\"km\":%.1f,\"sentido\":\"%s\",\"hito\":%d}",
           datosRecibidos.id_dispositivo,
           datosRecibidos.estado_sos ? "true" : "false",
           datosRecibidos.latitud,
           datosRecibidos.longitud,
           datosRecibidos.altitud,
           datosRecibidos.satelites,
           datosRecibidos.hora,
           rssiSenal,
           nombreTotem,
           km,
           datosRecibidos.sentido,
           hito);

  Serial.println(jsonBuffer);
}

void setup() {
  Serial.begin(115200);
  delay(500);

  WiFi.persistent(false);
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  esp_now_init();
  esp_now_register_recv_cb(alRecibirESPNow);
  agregarPeer(macBroadcast);

  Serial.println("{\"estado\":\"TOTEM_1_ONLINE\",\"nodo\":\"TOTEM-1\"}");
}

void loop() {
  if (Serial.available()) {
    String linea = Serial.readStringUntil('\n');
    linea.trim();
    if (linea.length() > 0) {
      if (linea.startsWith("SET_ID:")) {
        for (int k = 0; k < 3; k++) { despacharComando("SET_ID", linea.substring(7).c_str()); delay(30); }
      } else if (linea == "UNASSIGN") {
        for (int k = 0; k < 3; k++) { despacharComando("UNASSIGN"); delay(30); }
      } else if (linea == "ACK_EN_CAMINO") {
        for (int k = 0; k < 3; k++) { despacharComando("ACK_EN_CAMINO"); delay(30); }
      } else if (linea == "ACK_ATENDIDA") {
        for (int k = 0; k < 3; k++) { despacharComando("ACK_ATENDIDA"); delay(30); }
      } else if (linea == "RESET_NORMAL") {
        for (int k = 0; k < 3; k++) { despacharComando("RESET_NORMAL"); delay(30); }
      } else if (linea == "POWER_OFF") {
        for (int k = 0; k < 3; k++) { despacharComando("POWER_OFF"); delay(30); }
      } else if (linea == "POWER_ON") {
        for (int k = 0; k < 3; k++) { despacharComando("POWER_ON"); delay(30); }
      } else if (linea.startsWith("CHECK_IN:")) {
        despacharComando("CHECK_IN", linea.substring(9).c_str());
      }
    }
  }
  delay(10);
}