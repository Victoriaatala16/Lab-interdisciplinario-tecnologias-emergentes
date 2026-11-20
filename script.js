
const totemsData = [
  { id: 1,  corto: "T1",  nombre: "Base Caseta",     x: 85,  y: 285, alt: 810,  km: 0.0 },
  { id: 2,  corto: "T2",  nombre: "Qda. Peumo",      x: 155, y: 265, alt: 960,  km: 1.4 },
  { id: 3,  corto: "T3",  nombre: "Bosque Litre",    x: 225, y: 242, alt: 1110, km: 2.2 },
  { id: 4,  corto: "T4",  nombre: "Mirador Quillay", x: 295, y: 218, alt: 1260, km: 3.1 },
  { id: 5,  corto: "T5",  nombre: "Cuesta Boldo",    x: 365, y: 194, alt: 1410, km: 3.9 },
  { id: 6,  corto: "T6",  nombre: "Filo Espino",     x: 435, y: 172, alt: 1560, km: 4.8 },
  { id: 7,  corto: "T7",  nombre: "Paso Cóndor",     x: 505, y: 150, alt: 1700, km: 5.5 },
  { id: 8,  corto: "T8",  nombre: "Portezuelo",      x: 575, y: 128, alt: 1840, km: 6.2 },
  { id: 9,  corto: "T9",  nombre: "Loma Alta",       x: 645, y: 106, alt: 1965, km: 7.1 },
  { id: 10, corto: "T10", nombre: "La Pirca",        x: 715, y: 85,  alt: 2090, km: 7.9 },
  { id: 11, corto: "T11", nombre: "Filo Cumbre",     x: 785, y: 65,  alt: 2195, km: 8.7 },
  { id: 12, corto: "T12", nombre: "Cumbre La Cruz",  x: 865, y: 45,  alt: 2295, km: 9.5 }
];

const titulos = {
  resumen: "Resumen",
  mapa: "Mapa del cerro",
  senderistas: "Senderistas",
  caseta: "Pulseras y caseta",
  reportes: "Reportes"
};

let sesion = { usuario: "Rodrigo Valdés", cerro: "Cerro La Cruz", turno: "--:--" };
let modoLogin = "SIM";
let modoDatos = "SIM";
let filtroActual = "TODOS";
let totemSeleccionado = null;
let excelCierreDescargado = false;

let registrosReales = [];
// Máximo 12 senderistas en simulación diaria (acorde a ~40 semanales) y máximo 1 atención
let registrosSimulados = generarDatosSimulados(12, false);
let historialDias = {
  AYER: generarDatosSimulados(9, true),
  DOMINGO: generarDatosSimulados(14, true)
};

function formatearHorasMin(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function generarDatosSimulados(cantidad, jornadaCerrada = false) {
  const nombres = [
    "Carlos Mendoza", "Fernanda Paz", "Matías Rojas", "Camila Soto",
    "Sebastián Silva", "Valentina Muñoz", "Diego Contreras", "Isidora Morales",
    "Tomás Fuentes", "Javiera Herrera", "Nicolás Castro", "Antonia Vargas",
    "Benjamín Reyes", "Sofía Navarro", "Lucas Torres"
  ];

  // Reparto realista de hitos para los activos
  const hitosActivos = [3, 5, 5, 7, 8, 10, 11, 6];

  return Array.from({ length: cantidad }, (_, i) => {
    const nombre = nombres[i % nombres.length];
    const cod = `PULSERA-${String(i + 1).padStart(2, "0")}`;
    const id = nombre.split(" ")[0].toUpperCase().slice(0, 8);
    const hIng = 6 + Math.floor(i / 3);
    const mIng = (i * 17) % 60;
    const horaIngreso = `${String(hIng).padStart(2, "0")}:${String(mIng).padStart(2, "0")}`;

    let estado = "EN_RECORRIDO";
    let totemActual = hitosActivos[i % hitosActivos.length];
    let sentido = (totemActual >= 8 && i % 2 === 0) ? "VUELTA" : "IDA";
    let horaSalida = null;
    let incompleto = false;
    let minSinMarca = 14 + ((i * 7) % 25);
    let duracionMin = null;

    if (jornadaCerrada || i < Math.floor(cantidad * 0.35)) {
      // ~4 ya bajaron
      estado = (i === 2) ? "INCOMPLETO" : "COMPLETO";
      incompleto = (estado === "INCOMPLETO");
      totemActual = 1;
      sentido = "VUELTA";
      duracionMin = 385 + ((i * 29) % 165); // Entre 6h 25m y 9h 10m
      const totMinSal = hIng * 60 + mIng + duracionMin;
      horaSalida = `${String(Math.floor(totMinSal / 60)).padStart(2, "0")}:${String(totMinSal % 60).padStart(2, "0")}`;
      minSinMarca = 0;
    } else if (!jornadaCerrada && i === cantidad - 1) {
      // Máximo 1 caso en atención (nunca SOS por defecto; SOS es solo emergencia)
      estado = "ATENCION";
      totemActual = 7;
      sentido = "IDA";
      minSinMarca = 118;
    } else if (!jornadaCerrada && i === cantidad - 2) {
      // 1 caso con hito omitido
      estado = "INCOMPLETO";
      incompleto = true;
      totemActual = 6;
      sentido = "IDA";
    }

    const marcas = { 1: `${horaIngreso}:00` };
    const maxT = horaSalida ? 12 : totemActual;
    for (let t = 2; t <= maxT; t++) {
      if (incompleto && t === 3) continue;
      const mPaso = hIng * 60 + mIng + ((t - 1) * 24);
      marcas[t] = `${String(Math.floor(mPaso / 60)).padStart(2, "0")}:${String(mPaso % 60).padStart(2, "0")}:${String((i * 19) % 60).padStart(2, "0")}`;
    }
    if (horaSalida) marcas[1] = `${horaSalida}:00`;

    const horaUltimoPaso = horaSalida ? `${horaSalida}:00` : (marcas[totemActual] || `${horaIngreso}:00`);
    const tInfo = totemsData[totemActual - 1];

    return {
      codigoPulsera: cod, esFisica: false, encendida: !horaSalida, asignada: true,
      id, nombre, rut: `19.${100 + i}.${200 + i}-K`, fono: `+56 9 8${100 + i} 4410`,
      emergencia: `+56 9 7${200 + i} 9912`, salud: i === 4 ? "Asma leve" : "Sin antecedentes",
      horaIngreso, horaSalida, duracionMin, ultimaHoraPaso: horaUltimoPaso,
      minutosSinMarca: minSinMarca, totemActual, sentido, estado, incompleto, marcas,
      lat: -33.45, lon: -70.51, alt: tInfo.alt, km: tInfo.km
    };
  });
}

function obtenerFlotaActiva() {
  return modoDatos === "REAL" ? registrosReales : registrosSimulados;
}

function setLoginMode(m) {
  modoLogin = m;
  document.getElementById("optLoginSim").className = "seg-opt" + (m === "SIM" ? " active" : "");
  document.getElementById("optLoginReal").className = "seg-opt" + (m === "REAL" ? " active" : "");
}

function iniciarSesion() {
  const u = document.getElementById("loginUser").value.trim() || "Guardaparque";
  const c = document.getElementById("loginCerro").value;
  const t = new Date().toTimeString().slice(0, 5);
  sesion = { usuario: u, cerro: c, turno: t };
  modoDatos = modoLogin;

  document.getElementById("hudGuardName").innerText = u;
  document.getElementById("hudGuardTurn").innerText = `Inicio ${t}`;
  document.getElementById("sidebarCerroSelect").value = c;
  document.getElementById("loginScreen").style.display = "none";

  actualizarUIModo();
  renderizarTodo();
}

function abrirVentana(id, btnEl) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + id).classList.add("active");
  document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  document.getElementById("pageTitle").innerText = titulos[id] || "Panel";
  renderizarTodo();
}

function alternarModoDatos() {
  modoDatos = (modoDatos === "SIM") ? "REAL" : "SIM";
  actualizarUIModo();
  renderizarTodo();
}

function actualizarUIModo() {
  const chip = document.getElementById("btnModeChip");
  const txt = document.getElementById("modeChipText");
  if (modoDatos === "REAL") {
    chip.className = "status-chip online";
    txt.innerText = "Hardware real";
  } else {
    chip.className = "status-chip sim";
    txt.innerText = `Simulación (${registrosSimulados.length})`;
  }
}

/* ================= CIERRE DE DÍA ================= */
function abrirModalCierreDia() {
  const lista = obtenerFlotaActiva();
  const ingresos = lista.length;
  const devueltas = lista.filter(p => p.horaSalida !== null).length;
  const pendientes = lista.filter(p => p.horaSalida === null && p.asignada).length;

  excelCierreDescargado = false;
  document.getElementById("btnConfirmarFinDia").disabled = true;
  document.getElementById("btnDescargarCierre").innerText = "1. Descargar Excel de respaldo";

  document.getElementById("cierreGuardSub").innerText = `${sesion.usuario} · ${sesion.cerro}`;
  document.getElementById("cierreIngresos").innerText = ingresos;
  document.getElementById("cierreDevueltas").innerText = devueltas;
  document.getElementById("cierrePendientes").innerText = pendientes;

  const alertaBox = document.getElementById("cierreAlertaBox");
  alertaBox.innerHTML = pendientes > 0
    ? `Quedan <b>${pendientes} pulsera(s)</b> sin salida registrada. Verifica antes de cerrar o deja nota.`
    : `Todas las pulseras del turno registran devolución en caseta.`;

  document.getElementById("cierreDiaModal").classList.add("open");
}

function cerrarModalCierreDia() {
  document.getElementById("cierreDiaModal").classList.remove("open");
}

function descargarExcelParaCierre() {
  exportarExcelEstructurado("CIERRE");
  excelCierreDescargado = true;
  document.getElementById("btnDescargarCierre").innerText = "✓ Excel descargado";
  document.getElementById("btnConfirmarFinDia").disabled = false;
}

function ejecutarFinDiaYCerrarSesion() {
  if (!excelCierreDescargado) return;
  if (modoDatos === "REAL") registrosReales = [];
  else registrosSimulados = generarDatosSimulados(12, false);
  document.getElementById("cierreNotas").value = "";
  cerrarModalCierreDia();
  document.getElementById("loginScreen").style.display = "flex";
}

/* ================= RENDERIZADO ================= */
function renderizarTodo() {
  renderResumenGeneral();
  renderMapaTopografico();
  if (totemSeleccionado) inspeccionarTotem(totemSeleccionado);
  renderTablaSenderistas();
  renderReporteDiario();
}

function renderResumenGeneral() {
  const lista = obtenerFlotaActiva();
  const ingresos = lista.length;
  const salidas = lista.filter(p => p.horaSalida !== null).length;
  const dentro = lista.filter(p => p.horaSalida === null && p.asignada).length;
  const completos = lista.filter(p => p.estado === "COMPLETO").length;
  const incompletos = lista.filter(p => p.incompleto || p.estado === "INCOMPLETO").length;
  const atencion = lista.filter(p => p.estado === "ATENCION" || p.estado === "SOS").length;

  document.getElementById("kpiIngresos").innerText = ingresos;
  document.getElementById("kpiSalidas").innerText = salidas;
  document.getElementById("kpiDentro").innerText = dentro;
  document.getElementById("kpiCompletos").innerText = completos;
  document.getElementById("kpiIncompletos").innerText = incompletos;
  document.getElementById("kpiAtencion").innerText = atencion;

  document.getElementById("navPillDentro").innerText = dentro;
  document.getElementById("navPillAlertas").innerText = atencion;

  const casos = lista.filter(p => p.estado === "SOS" || p.estado === "ATENCION" || p.estado === "INCOMPLETO");
  document.getElementById("resumenAlertCount").innerText = `${casos.length}`;
  const attEl = document.getElementById("resumenAttentionList");

  if (casos.length === 0) {
    attEl.innerHTML = `<div class="clean-row" style="color:var(--muted);">Sin situaciones pendientes de revisión</div>`;
  } else {
    attEl.innerHTML = casos.slice(0, 5).map(p => {
      const desc = p.estado === "SOS" ? "Emergencia SOS activada" : (p.estado === "ATENCION" ? `${p.minutosSinMarca} min sin registrar paso` : "Hito intermedio omitido");
      const dirCls = p.sentido === "VUELTA" ? "vuelta" : "ida";
      return `
        <div class="clean-row" onclick="abrirFichaSenderista('${p.codigoPulsera}')">
          <div>
            <b>${p.id}</b> <span style="color:var(--muted);">· ${p.nombre}</span>
            <span class="dir-pill ${dirCls}">${p.sentido}</span>
            <div class="clean-row-sub">${desc} · Tótem ${p.totemActual}</div>
          </div>
          <span class="mono-time">${p.ultimaHoraPaso}</span>
        </div>
      `;
    }).join("");
  }

  const movEl = document.getElementById("resumenMovesList");
  if (lista.length === 0) {
    movEl.innerHTML = `<div class="clean-row" style="color:var(--muted);">Esperando registros desde Tótem 1...</div>`;
  } else {
    movEl.innerHTML = lista.slice(0, 5).map(p => {
      const dirCls = p.sentido === "VUELTA" ? "vuelta" : "ida";
      return `
        <div class="clean-row" onclick="abrirFichaSenderista('${p.codigoPulsera}')">
          <div>
            <b>${p.id}</b> <span style="color:var(--muted);">→ Tótem ${p.totemActual}</span>
            <span class="dir-pill ${dirCls}">${p.sentido}</span>
            <div class="clean-row-sub">${p.nombre} · ${p.alt} msnm</div>
          </div>
          <span class="mono-time">${p.ultimaHoraPaso}</span>
        </div>
      `;
    }).join("");
  }
}

function renderMapaTopografico() {
  const gT = document.getElementById("totemsGroup");
  const gS = document.getElementById("sendersGroup");
  gT.innerHTML = "";
  gS.innerHTML = "";

  const activos = obtenerFlotaActiva().filter(p => p.asignada && p.horaSalida === null);

  totemsData.forEach((t, idx) => {
    const yOff = (idx % 2 === 0) ? 17 : 28;
    const isSel = (totemSeleccionado === t.id) ? "selected" : "";

    gT.innerHTML += `
      <line x1="${t.x}" y1="${t.y}" x2="${t.x}" y2="305" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
      <circle cx="${t.x}" cy="${t.y}" r="5.5" class="totem-node ${isSel}" onclick="inspeccionarTotem(${t.id})"></circle>
      <text x="${t.x}" y="${t.y + yOff}" class="totem-label">${t.corto}</text>
      <text x="${t.x}" y="${t.y + yOff + 9}" class="totem-sub">${t.alt}m</text>
    `;

    const enEsteTotem = activos.filter(p => p.totemActual === t.id);
    if (enEsteTotem.length > 0) {
      const haySOS = enEsteTotem.some(p => p.estado === "SOS");
      const hayAtencion = enEsteTotem.some(p => p.estado === "ATENCION");
      const hayFisica = enEsteTotem.some(p => p.esFisica);

      let pillBg = "#1e293b", pillStroke = "#38bdf8";
      if (haySOS) { pillBg = "#450a0a"; pillStroke = "#ef4444"; }
      else if (hayAtencion) { pillBg = "#422006"; pillStroke = "#f59e0b"; }
      else if (hayFisica) { pillBg = "#052e16"; pillStroke = "#22c55e"; }

      gS.innerHTML += `
        <g transform="translate(${t.x}, ${t.y - 22})" style="cursor:pointer;" onclick="inspeccionarTotem(${t.id})">
          <circle cx="0" cy="0" r="11" fill="${pillBg}" stroke="${pillStroke}" stroke-width="1.6"></circle>
          <text x="0" y="3.5" fill="#fafafa" font-size="10" font-weight="700" text-anchor="middle">${enEsteTotem.length}</text>
        </g>
      `;
    }
  });
}

function inspeccionarTotem(num) {
  totemSeleccionado = num;
  renderMapaTopografico();
  const t = totemsData[num - 1];
  const enPunto = obtenerFlotaActiva().filter(p => p.totemActual === num && p.horaSalida === null);

  document.getElementById("totemInspector").innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:baseline;">
      <div>
        <b style="color:var(--text); font-size:0.92rem;">${t.corto} · ${t.nombre}</b>
        <div style="font-size:0.74rem; color:var(--muted);">${t.alt} msnm · Km ${t.km}</div>
      </div>
      <span style="font-size:0.74rem; color:var(--accent); font-weight:600;">${enPunto.length} en punto</span>
    </div>

    <div class="clean-list" style="max-height:240px; overflow-y:auto;">
      ${enPunto.length === 0
        ? '<div class="clean-row" style="color:var(--muted);">Sin senderistas registrados actualmente en este tótem</div>'
        : enPunto.map(p => {
            const dirCls = p.sentido === "VUELTA" ? "vuelta" : "ida";
            return `
              <div class="clean-row" onclick="abrirFichaSenderista('${p.codigoPulsera}')">
                <div>
                  <b>${p.id}</b> <span style="color:var(--muted);">· ${p.nombre}</span>
                  <div class="clean-row-sub">Sentido: <span class="dir-pill ${dirCls}" style="margin-left:0;">${p.sentido}</span></div>
                </div>
                <div style="text-align:right;">
                  <span class="mono-time" style="color:var(--text); display:block;">${p.ultimaHoraPaso}</span>
                  <span style="font-size:0.68rem; color:var(--muted);">hora paso</span>
                </div>
              </div>
            `;
          }).join("")
      }
    </div>
    <button class="btn btn-subtle btn-sm" onclick="simularPasoTotem(${num})">Probar paso en ${t.corto}</button>
  `;
}

function irASenderistasConFiltro(filtro) {
  filtroActual = filtro;
  abrirVentana("senderistas", document.querySelectorAll(".nav-link")[2]);
}

function setFiltroSenderistas(filtro, btn) {
  filtroActual = filtro;
  document.querySelectorAll(".tab-pill").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderTablaSenderistas();
}

function renderTablaSenderistas() {
  const q = (document.getElementById("searchSenderista").value || "").toLowerCase();
  const tbody = document.getElementById("tbodySenderistas");
  let lista = obtenerFlotaActiva();

  if (filtroActual !== "TODOS") {
    lista = lista.filter(p => p.estado === filtroActual || (filtroActual === "ATENCION" && p.estado === "SOS"));
  }
  if (q) {
    lista = lista.filter(p => p.id.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q) || p.codigoPulsera.toLowerCase().includes(q));
  }

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--muted); padding:28px;">Sin registros en esta vista</td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(p => {
    let dotColor = "var(--info)", label = "En recorrido";
    if (p.estado === "COMPLETO") { dotColor = "var(--sage)"; label = "Completo"; }
    else if (p.estado === "INCOMPLETO") { dotColor = "var(--warn)"; label = "Incompleto"; }
    else if (p.estado === "ATENCION") { dotColor = "var(--warn)"; label = "Atención"; }
    else if (p.estado === "SOS") { dotColor = "var(--danger)"; label = "SOS Emergencia"; }

    const dirCls = p.sentido === "VUELTA" ? "vuelta" : "ida";
    const salidaTxt = p.horaSalida ? `${p.horaSalida} (${formatearHorasMin(p.duracionMin || 420)})` : "—";

    return `
      <tr onclick="abrirFichaSenderista('${p.codigoPulsera}')">
        <td><b>${p.id}</b> · ${p.nombre}<br><span style="font-size:0.72rem; color:var(--muted);">${p.codigoPulsera}</span></td>
        <td>${p.horaIngreso}</td>
        <td>
          Tótem ${p.totemActual}/12 <span class="dir-pill ${dirCls}">${p.sentido}</span>
          <div style="font-size:0.72rem; color:var(--muted); margin-top:2px;">Marcó: ${p.ultimaHoraPaso}</div>
        </td>
        <td>${p.horaSalida ? "—" : `${p.minutosSinMarca} min`}</td>
        <td>${salidaTxt}</td>
        <td><span class="status-tag"><span class="dot-ind" style="background:${dotColor};"></span>${label}</span></td>
      </tr>
    `;
  }).join("");
}

function abrirFichaSenderista(cod) {
  const p = obtenerFlotaActiva().find(x => x.codigoPulsera === cod);
  if (!p) return;

  document.getElementById("drawerName").innerText = `${p.nombre} (${p.id})`;
  document.getElementById("drawerSub").innerText = `${p.codigoPulsera} · RUT ${p.rut} · Emergencia: ${p.emergencia}`;

  let hitosHtml = totemsData.map(t => {
    const h = p.marcas ? p.marcas[t.id] : null;
    return `
      <div class="clean-row" style="padding:9px 12px;">
        <span><b>${t.corto}</b> <span style="color:var(--muted);">· ${t.nombre}</span></span>
        <span class="mono-time" style="color:${h ? 'var(--text)' : 'var(--subtle)'};">${h || "—"}</span>
      </div>
    `;
  }).join("");

  const dirCls = p.sentido === "VUELTA" ? "vuelta" : "ida";

  document.getElementById("drawerBody").innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; background:var(--surface); padding:12px; border-radius:8px; border:1px solid var(--border);">
      <div><span style="color:var(--muted); font-size:0.7rem;">Ingreso</span><br><b>${p.horaIngreso} hrs</b></div>
      <div><span style="color:var(--muted); font-size:0.7rem;">Salida / Tiempo</span><br><b>${p.horaSalida ? `${p.horaSalida} (${formatearHorasMin(p.duracionMin || 420)})` : "En ruta"}</b></div>
      <div><span style="color:var(--muted); font-size:0.7rem;">Último registro</span><br><b>T${p.totemActual} · ${p.ultimaHoraPaso}</b> <span class="dir-pill ${dirCls}">${p.sentido}</span></div>
      <div><span style="color:var(--muted); font-size:0.7rem;">Observaciones</span><br><b>${p.salud}</b></div>
    </div>
    <div class="clean-list">${hitosHtml}</div>
    ${!p.horaSalida ? `<button class="btn btn-accent" onclick="registrarSalidaManual('${p.codigoPulsera}')">Registrar salida</button>` : ""}
  `;
  document.getElementById("senderDrawer").classList.add("open");
}

function registrarSalidaManual(cod) {
  const p = obtenerFlotaActiva().find(x => x.codigoPulsera === cod);
  if (!p) return;
  p.horaSalida = new Date().toTimeString().slice(0, 5);
  p.sentido = "VUELTA";
  p.duracionMin = p.duracionMin || 410;
  p.estado = p.incompleto ? "INCOMPLETO" : "COMPLETO";
  p.minutosSinMarca = 0;
  if (p.esFisica) enviarComandoDispositivo("UNASSIGN");
  document.getElementById("senderDrawer").classList.remove("open");
  renderizarTodo();
}

/* ================= HARDWARE Y ASIGNACIÓN ================= */
function controlarFisicaDirecto(encender) {
  enviarComandoDispositivo(encender ? "POWER_ON" : "POWER_OFF");
  logTerminal(`[HW] ${encender ? "POWER_ON" : "POWER_OFF"} enviado.`);
}

function asignarDispositivo() {
  const cod = document.getElementById("regPulsera").value;
  const id = document.getElementById("regId").value.trim().toUpperCase();
  const nombre = document.getElementById("regNombre").value.trim();
  const rut = document.getElementById("regRut").value.trim();
  const fono = document.getElementById("regFono").value.trim();
  const emergencia = document.getElementById("regEmergencia").value.trim();
  const salud = document.getElementById("regSalud").value.trim();

  if (!id || !nombre) return alert("Ingresa ID y Nombre.");
  if (cod === "PULSERA-A" && !wifiActivo && !port) {
    return alert("Conecta primero el Tótem 1 (Wi-Fi o USB) para asignar la pulsera física.");
  }

  const ahora = new Date().toTimeString().slice(0, 8);
  const nuevo = {
    codigoPulsera: cod, esFisica: (cod === "PULSERA-A"), encendida: true, asignada: true,
    id, nombre, rut, fono, emergencia, salud,
    horaIngreso: ahora.slice(0, 5), horaSalida: null, duracionMin: null,
    ultimaHoraPaso: ahora, minutosSinMarca: 0, totemActual: 1, sentido: "IDA",
    estado: "EN_RECORRIDO", incompleto: false, marcas: { 1: ahora },
    lat: -33.4532, lon: -70.5234, alt: 810, km: 0.0
  };

  if (cod === "PULSERA-A") {
    registrosReales = [nuevo];
    enviarComandoDispositivo("POWER_ON");
    setTimeout(() => enviarComandoDispositivo("SET_ID:" + id), 250);
  } else {
    registrosSimulados.unshift(nuevo);
  }
  renderizarTodo();
}

function desasignarSeleccionada() {
  const cod = document.getElementById("regPulsera").value;
  if (cod === "PULSERA-A") {
    if (registrosReales[0]) {
      registrosReales[0].horaSalida = new Date().toTimeString().slice(0, 5);
      registrosReales[0].estado = "COMPLETO";
      registrosReales[0].asignada = false;
    }
    enviarComandoDispositivo("UNASSIGN");
  }
  renderizarTodo();
}

function simularPasoTotem(num) {
  enviarComandoDispositivo("CHECK_IN:" + num);
  const r = registrosReales[0];
  const t = totemsData[num - 1];
  if (r && t) {
    if (num < r.totemActual || num === 12) r.sentido = "VUELTA";
    r.totemActual = num; r.alt = t.alt; r.km = t.km;
    r.ultimaHoraPaso = new Date().toTimeString().slice(0, 8);
    r.marcas[num] = r.ultimaHoraPaso;
  }
  renderizarTodo();
}

function simularSOSPrueba() {
  activarBannerSOS("PULSERA-A", "VIKI", 2, new Date().toTimeString().slice(0, 8), -33.4510, -70.5190);
}

function activarBannerSOS(cod, id, totem, hora, lat, lon) {
  // Máximo 1 SOS activo en todo el sistema
  registrosReales.forEach(x => { if (x.estado === "SOS") x.estado = "EN_RECORRIDO"; });
  registrosSimulados.forEach(x => { if (x.estado === "SOS") x.estado = "EN_RECORRIDO"; });

  const target = registrosReales[0] || registrosSimulados[0];
  if (target) target.estado = "SOS";

  document.getElementById("sosBanner").classList.add("active");
  document.getElementById("sosText").innerHTML = `<b>Emergencia SOS:</b> ${cod} (${id}) · Tótem ${totem} · ${hora}`;
  renderizarTodo();
}

function cambiarEstadoSOS(est) {
  if (est === "EN_CAMINO") enviarComandoDispositivo("ACK_EN_CAMINO");
  else if (est === "ATENDIDA") enviarComandoDispositivo("ACK_ATENDIDA");
  else {
    enviarComandoDispositivo("RESET_NORMAL");
    registrosReales.forEach(x => { if (x.estado === "SOS") x.estado = "EN_RECORRIDO"; });
    registrosSimulados.forEach(x => { if (x.estado === "SOS") x.estado = "EN_RECORRIDO"; });
    document.getElementById("sosBanner").classList.remove("active");
  }
  renderizarTodo();
}

/* ================= REPORTES Y EXCEL ================= */
function renderReporteDiario() {
  const fechaKey = document.getElementById("reportDateSelect").value;
  const dataset = fechaKey === "HOY" ? obtenerFlotaActiva() : (historialDias[fechaKey] || []);

  document.getElementById("repIngresos").innerText = dataset.length;
  document.getElementById("repCompletos").innerText = dataset.filter(p => p.estado === "COMPLETO").length;
  document.getElementById("repIncompletos").innerText = dataset.filter(p => p.incompleto || p.estado === "INCOMPLETO").length;

  const cerrados = dataset.filter(p => p.duracionMin);
  const promMin = cerrados.length
    ? Math.round(cerrados.reduce((acc, p) => acc + p.duracionMin, 0) / cerrados.length)
    : 438;
  document.getElementById("repTiempoProm").innerText = formatearHorasMin(promMin);

  const franjas = { "06:00": 0, "07:00": 0, "08:00": 0, "09:00": 0, "10:00": 0, "11:00": 0 };
  dataset.forEach(p => {
    const h = (p.horaIngreso || "08:00").slice(0, 2) + ":00";
    if (franjas[h] !== undefined) franjas[h]++;
  });

  const maxVal = Math.max(1, ...Object.values(franjas));
  document.getElementById("hourlyChart").innerHTML = Object.entries(franjas).map(([hora, cant]) => {
    const pct = Math.round((cant / maxVal) * 100);
    return `
      <div class="bar-item">
        <b>${cant}</b>
        <div class="bar-rect" style="height:${Math.max(4, pct)}%;"></div>
        <span>${hora}</span>
      </div>
    `;
  }).join("");
}

function exportarExcelEstructurado(origen = "HOY") {
  const fechaKey = origen === "CIERRE" ? "HOY" : document.getElementById("reportDateSelect").value;
  const dataset = fechaKey === "HOY" ? obtenerFlotaActiva() : (historialDias[fechaKey] || []);
  const fechaStr = fechaKey === "HOY" ? "2026-11-18" : (fechaKey === "AYER" ? "2026-11-17" : "2026-11-15");
  const notasCierre = (document.getElementById("cierreNotas").value || "").replace(/;/g, ",");

  let csv = "\uFEFF";
  csv += "Fecha;Cerro;Guardaparque_Turno;ID_Pulsera;Nombre_Senderista;RUT;Hora_Ingreso;Hora_Salida;Ultimo_Totem;Sentido;Hora_Ultimo_Paso;T1;T2;T3;T4;T5;T6;T7;T8;T9;T10;T11;T12;Tiempo_Total_Min;Estado_Recorrido;Registro_Incompleto;Observaciones_Turno\n";

  dataset.forEach(p => {
    const marcasCols = Array.from({ length: 12 }, (_, idx) => (p.marcas && p.marcas[idx + 1]) ? p.marcas[idx + 1] : "").join(";");
    csv += `${fechaStr};${sesion.cerro};${sesion.usuario};${p.codigoPulsera} (${p.id});${p.nombre};${p.rut};${p.horaIngreso};${p.horaSalida || "En cerro"};T${p.totemActual};${p.sentido};${p.ultimaHoraPaso};${marcasCols};${p.duracionMin || "En curso"};${p.estado};${p.incompleto ? "SI" : "NO"};${notasCierre}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Cierre_CerroLaCruz_${fechaStr}_${sesion.usuario.replace(/\s+/g, "_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ================= WI-FI Y USB ================= */
let wifiActivo = false;
let wifiInterval = null;
let ultimoSeq = -1;
let port = null;

function alternarConexionWifi() {
  const chip = document.getElementById("btnWifiChip");
  const txt = document.getElementById("wifiChipText");
  if (wifiActivo) {
    wifiActivo = false;
    clearInterval(wifiInterval);
    chip.classList.remove("online");
    txt.innerText = "Tótem 1 desconectado";
    document.getElementById("hwConnStatus").innerText = "Desconectada";
    return;
  }
  wifiActivo = true;
  txt.innerText = "Conectando...";
  consultarDatosWifi();
  wifiInterval = setInterval(consultarDatosWifi, 1200);
}

async function consultarDatosWifi() {
  if (!wifiActivo) return;
  const chip = document.getElementById("btnWifiChip");
  const txt = document.getElementById("wifiChipText");
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 1100);
    const res = await fetch(`${TOTEM1_IP}/datos`, { signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error();
    const d = await res.json();

    chip.classList.add("online");
    txt.innerText = "Tótem 1 en línea";
    document.getElementById("hwConnStatus").innerText = "En línea";
    if (d.seq !== undefined && d.seq !== ultimoSeq && d.id) {
      ultimoSeq = d.seq;
      procesarTelemetriaReal(d);
    }
  } catch (e) {
    chip.classList.remove("online");
    txt.innerText = "Buscando Tótem 1...";
  }
}

function procesarTelemetriaReal(d) {
  const ahora = d.hora || new Date().toTimeString().slice(0, 8);
  const hito = Math.min(12, Math.max(1, d.hito || 1));
  const tInfo = totemsData[hito - 1];

  if (registrosReales.length === 0) {
    registrosReales.push({
      codigoPulsera: "PULSERA-A", esFisica: true, encendida: true, asignada: true,
      id: d.id, nombre: "Senderista Activo", rut: "--", fono: "--", emergencia: "--", salud: "--",
      horaIngreso: ahora.slice(0, 5), horaSalida: null, duracionMin: null,
      ultimaHoraPaso: ahora, minutosSinMarca: 0, totemActual: hito, sentido: d.sentido || "IDA",
      estado: d.alerta ? "SOS" : "EN_RECORRIDO", incompleto: false, marcas: { [hito]: ahora },
      lat: d.lat, lon: d.lon, alt: tInfo.alt, km: tInfo.km
    });
  } else {
    const r = registrosReales[0];
    r.id = d.id; r.totemActual = hito; r.sentido = d.sentido || "IDA";
    r.ultimaHoraPaso = ahora; r.minutosSinMarca = 0; r.alt = tInfo.alt; r.km = tInfo.km;
    r.marcas[hito] = ahora;
    if (d.alerta) r.estado = "SOS";
  }
  if (d.alerta) activarBannerSOS("PULSERA-A", d.id, hito, ahora, d.lat, d.lon);
  logTerminal(`[RX] ID:${d.id} · T${hito} · RSSI ${d.rssi}`);
  renderizarTodo();
}

async function conectarTotemUSB() {
  if (!("serial" in navigator)) return alert("Usa Chrome o Edge.");
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    document.getElementById("hwConnStatus").innerText = "USB conectado";
  } catch (e) {}
}

async function enviarComandoDispositivo(cmd) {
  if (wifiActivo) {
    try { await fetch(`${TOTEM1_IP}/cmd?c=${encodeURIComponent(cmd)}`); } catch (e) {}
  }
  if (port && port.writable) {
    try {
      const w = port.writable.getWriter();
      await w.write(new TextEncoder().encode(cmd + "\n"));
      w.releaseLock();
    } catch (e) {}
  }
}

function logTerminal(msg) {
  const box = document.getElementById("terminalLog");
  box.innerHTML = `<div>${msg}</div>` + box.innerHTML;
}

renderizarTodo();
