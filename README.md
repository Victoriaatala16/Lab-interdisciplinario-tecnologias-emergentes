## Investigación de proyecto basado en mejorar el seguimiento y la seguridad de visitantes en los senderos de alta montaña del Parque Mahuida, en la comuna de La Reina, Santiago de Chile.

Proyecto de investigación aplicada que busca abordar la falta de trazabilidad en tiempo real de los visitantes que recorren los senderos de alta montaña del Parque Mahuida (La Reina, Santiago), zona con el porcentaje más alto de riesgo de deslizamientos de la Región Metropolitana. A partir de datos oficiales, entrevistas a guardaparques y registro en terreno, se analiza el sistema actual de control de acceso y seguimiento, y se exploran alternativas tecnológicas que permitan monitorear en tiempo real la ubicación y estado de las personas en ruta.

La propuesta resultante es un **Sistema de Trazabilidad y Alerta en Montaña** para el sendero Cerro La Cruz: el senderista lleva un dispositivo, a lo largo del sendero hay tótems solares que registran su paso y se comunican por LoRa (915 MHz), y en la caseta de guardaparques una base con un PC muestra por dónde va cada persona, calcula atrasos y recibe las alertas, sin depender de la señal celular.

## Integrantes

* Victoria Atala
* Valeria Cheetham
* Maximiliano Greve
* Laura Hoppe

## Contenido del repositorio

| Carpeta | Qué contiene |
|---|---|
| [`encargos/`](encargos) | Entregas del taller (Encargos 1, 3, 4, 5, 7 y 8), Certamen 1, recorrido de la solución y BOM |
| [`entrevista/`](entrevista) | Preguntas y audios de las entrevistas a guardaparques; videos y transcripción de las entrevistas a senderistas |
| [`imagenes/`](imagenes) | Registro fotográfico en terreno (20-08-2026 y 29-08-2026) |
| [`Referente/`](Referente) | Fichas de los 12 referentes del proyecto |
| [`Soluciones/`](Soluciones) | Cruce del caso con referentes y primera propuesta de solución |
| [`Prototipos/`](Prototipos) | Plantillas 1:10 de las maquetas de checkpoints y fotos de las maquetas y del dispositivo personal |
| [`bibliografia/`](bibliografia) | Enlaces consultados, agrupados por tema |

## Recorrido del proyecto

| Etapa | Qué se hizo | Resultado |
|---|---|---|
| Encargo 1 | Exploración de los 3 ámbitos propuestos por la Municipalidad de La Reina | Se elige el ámbito de patrimonio y turismo: los senderos del Parque Mahuida |
| Avance 20-08-2026 | Datos oficiales y entrevistas a dos guardaparques | No existe seguimiento en ruta: "no sabemos en vivo" |
| Encargos 3 y 4 | De dato a insight, entrevistas a 4 senderistas, datos nuevos y stakeholders | Problema definido |
| Caso y soluciones | Cruce con UTMB LiveTrail y Disney MagicBand | Primera idea: pulsera + tótems solo en Cerro La Cruz |
| Encargo 5 | Crazy 8, SCAMPER, seis sombreros y matriz de Pugh | Gana la red de trazabilidad por postes conectados por LoRa |
| Certamen 1 | Presentación de contexto a propuesta | Objetivos, referentes y genealogía de la propuesta |
| Encargo 7 + BOM | Arquitectura, flujo, fallas y lista de materiales | Arquitectura 1.1: clip BLE, SOS en el tótem y energía solar de 12 V |
| Encargo 8 + maquetas | Primera prueba electrónica, maquetas 1:10 y chequeo de viento | 7 checkpoints viables en aluminio y piedra del lugar |
| Dispositivo personal | 7 formatos probados sobre el cuerpo | Opciones para llevar el clip |
| Red LoRa (Rev. 3) | Ubicación final de los tótems según el terreno | 6 radios y ningún repetidor |

## Punto de partida · Encargo 1

Antes de elegir el tema se exploraron los tres ámbitos de acción propuestos por la Municipalidad de La Reina. Para cada uno se buscó una situación problemática, de 2 a 3 datos de evidencia y al menos dos enmarques, sin proponer todavía soluciones.

| Ámbito | Situaciones exploradas |
|---|---|
| Salud pública | Agendar hora en el CESFAM depende de llamar o ir presencialmente, mientras comunas como Vitacura y Recoleta ya tienen plataformas; las Huertas Urbanas funcionan en un solo terreno (Aldea del Encuentro) con cupos limitados |
| Patrimonio y turismo urbano | El ingreso a los senderos de Mahuida exige registro presencial en un único punto, con filas los fines de semana; la información digital de rutas está repartida en apps externas (AllTrails, Wikiloc) |
| Participación ciudadana | Los 3 puntos limpios municipales están sobre un mismo eje (Jorge Alessandri / Príncipe de Gales); las demandas de tránsito, señalética y ciclovías no tienen un canal claro de seguimiento |

De esta exploración se eligió el ámbito de **patrimonio y turismo urbano**, en particular los senderos de alta montaña del Parque Mahuida, que es el foco de todo lo que sigue.

* Acotación: el encargo se trabajó con los conceptos vistos en clase: situación problemática → problema → pregunta de investigación → objetivos; enmarques según *Frame Innovation* (Kees Dorst, 2015); y las cuatro etapas cognitivas dato → información → hallazgo → insight.
* Archivo: [`encargos/Encargo_1/Encargo_1.pdf`](encargos/Encargo_1/Encargo_1.pdf)

## Avance 20-08-2026

### 1. Problemática y enmarque

#### Problemática

El Parque Mahuida reconoce oficialmente que su zona de alta montaña presenta riesgo de deslizamientos, pero no cuenta con un sistema que permita saber en tiempo real qué personas están recorriendo los senderos ni si alguien se atrasó en su retorno.

#### Contexto

La Reina tiene un 48,1% de su superficie en zonas de riesgo de deslizamiento, el porcentaje más alto de la Región Metropolitana, y el sector montañoso del Parque Mahuida está identificado dentro de esa zona. En rutas de alta dificultad como Cerro La Cruz (2.554 msnm, 14,2 km, hasta 10 horas de ascenso), el registro de visitantes sigue dependiendo de anotaciones manuales, planillas Excel recientes y llamadas telefónicas puntuales a media tarde, sin ningún mecanismo de trazabilidad continua durante el recorrido.

#### Enmarques

1. **Riesgo identificado, control básico** — el municipio reconoce el riesgo, pero el control de las personas en terreno depende de señalética y criterio humano, no de datos en tiempo real.
2. **Se sabe dónde está el peligro, no dónde están las personas** — existe mapa de zonas de riesgo, pero no información en tiempo real sobre quién está recorriendo esas zonas.

### 2. Datos cualitativos y cuantitativos provenientes de fuentes

#### Datos cuantitativos

##### PLADECO La Reina 2019-2025
La Reina tiene un 48,1% de su superficie en zonas con riesgo de deslizamientos de tierra, el porcentaje más alto de la Región Metropolitana. Entre 2014 y 2019 hubo 7 incendios forestales en la comuna, que afectaron aproximadamente 11,5 hectáreas, principalmente en la zona precordillera cercana al parque.
* Fuente: PLADECO La Reina 2019-2025

##### Parque Mahuida / Municipalidad de La Reina (información oficial)
El sendero Cerro La Cruz llega a 2.554 msnm, con 14,2 km y hasta 10 horas de duración — la ruta de mayor riesgo del parque. Para señalizar solo 10 km de senderos de montaña, el parque trasladó 80 estacas (800 kilos) en 3 viajes de helicóptero.
* Fuente: Parque Mahuida y Municipalidad de La Reina (información oficial)

##### Entrevistas propias a guardaparques (20-08-2026)
Según los guardaparques Leo y Fernanda Barrios, los rescates bajaron de un promedio de 2 a 3 casos por mes (con guardaparque único, antes del equipo actual) a 1-2 casos cada 3 meses tras la incorporación de un equipo completo hace un año.
* Acotación: Este es un dato observacional recogido en entrevista, no una cifra oficial publicada por el parque.

#### Datos cualitativos

##### Entrevista Leo, guardaparque Parque Mahuida (20-08-2026)
Leo explicó el funcionamiento actual del registro de visitantes y del seguimiento en ruta. Según el profesional, el registro varía según el día y la dificultad del sendero: en senderos de baja dificultad solo se anotan datos básicos, mientras que en rutas de alta montaña (Cerro La Cruz, Morro La Reina, Cerro San Ramón) se exige además registro en Socorro Andino y se establece una hora límite de bajada, verificada mediante una llamada telefónica entre la 1 y 2 PM.

El guardaparque confirmó explícitamente que no existe seguimiento en tiempo real: "no sabemos en vivo, no tenemos seguimiento en vivo." También describió un sistema informal de puntos de corte por tiempo en rutas de alta dificultad (por ejemplo, un máximo de 45 minutos para llegar a un punto de control), que actualmente está "en marcha blanca" y aún no ha sido publicado formalmente por el parque.

Respecto a la cobertura de señal, indicó que varía según la compañía telefónica: WOM tendría la mejor cobertura dentro del parque, mientras que Movistar sería la más deficiente, con visitantes que pierden señal desde el inicio de algunos senderos. La comunicación con quienes están en ruta depende exclusivamente de llamadas desde un celular exclusivo del equipo de guardaparques.

Sobre la exigencia de grupos mínimos de dos personas y mayoría de edad para Cerro La Cruz, Leo señaló que no se trata de una obligación formal sino de una recomendación de precaución, y que el 100% de los incidentes atendidos correspondió a personas que iban acompañadas.

##### Entrevista Fernanda Barrios, guardaparque Parque Mahuida (20-08-2026)
Fernanda confirmó de manera independiente varios de los puntos señalados por Leo. Indicó que el sistema de registro cambió de papel a una planilla Excel hace aproximadamente un mes, y que anteriormente solo se aplicaba un registro más riguroso a quienes iban a senderos de altas cumbres. Señaló textualmente que "sería lo ideal tener también un sistema, una plataforma", mientras el equipo intenta automatizar manualmente la planilla con apoyo de herramientas de inteligencia artificial genéricas.

Respecto al seguimiento en ruta, coincidió en que "no sabemos dónde está hasta que sale", y describió que en el sendero Guayacán —donde la gente tiende a perderse con mayor frecuencia— el único método de apoyo disponible es que los visitantes envíen fotografías de su ubicación para ser guiados telefónicamente.

Sobre la cobertura de comunicación, indicó que la señal celular es intermitente y varía por compañía, y añadió un dato adicional relevante: incluso las radios internas del equipo de guardaparques pierden cobertura dentro del bosque, lo que dificulta la comunicación entre el personal en terreno y la administración del parque.

* Acotación: Ambas entrevistas fueron realizadas en terreno como parte del levantamiento propio del equipo, y se complementan con registro fotográfico del parque (cuaderno de registro, señalética y puntos de control) disponible en la carpeta [`imagenes/`](imagenes). Los audios y las preguntas están en [`entrevista/Entrevistas_Guardaparques/`](entrevista/Entrevistas_Guardaparques).

##### Reglamento del Parque Mahuida (información oficial)
El parque exige credencial presencial e intransferible para el ingreso, con límite de un acompañante sin costo adicional. Se prohíbe pernoctar, encender fuego, arrancar vegetación y abandonar mascotas; estas deben portar correa y su acceso está limitado hasta el punto conocido como "la antena". El horario general de funcionamiento es de 8:00 a 19:00 horas, con horarios de ascenso diferenciados según sendero (por ejemplo, Cerro La Cruz hasta las 9:00 AM).
* Acotación: El reglamento evidencia un control riguroso sobre el acceso al parque, que contrasta con la ausencia de seguimiento una vez que el visitante ya se encuentra en el sendero.

### 3. Desglose de entrevistas por pregunta, con clasificación cuali/cuanti

Aplicando la clasificación de datos vista en clase (separar cada dato en cuantitativo o cualitativo antes de analizar), se desglosan a continuación ambas entrevistas pregunta por pregunta.

#### Entrevista a Leo, guardaparque Parque Mahuida

**Pregunta 1 — Frecuencia de extravíos y rescates**

¿Con qué frecuencia se pierde o se atrasa gente en los senderos, sobre todo en Cerro La Cruz? ¿Han tenido que salir a buscar a alguien en el último tiempo?

El equipo actual de guardaparques lleva un año completo trabajando; antes hubo un período de prueba con un solo guardaparque. En esa etapa previa, los rescates/extravíos ocurrían entre 2 y 3 veces por mes. Desde que está el equipo completo, la cifra bajó a 1-2 casos cada 3 meses. Las causas actuales suelen ser fortuitas: torceduras de tobillo, caídas o deshidratación en época estival por mal manejo del agua.

| Dato | Tipo |
|---|---|
| Antigüedad del equipo actual (1 año) | Cuanti |
| Rescates antes del equipo completo: 2-3/mes | Cuanti |
| Rescates actuales: 1-2 cada 3 meses | Cuanti |
| Causas típicas (torcedura, caída, deshidratación) | Cuali |
| Explicación de por qué bajó (mejores indicaciones al ingreso) | Cuali |

**Pregunta 2 — Registro actual de entrada y salida**

¿Cómo funciona hoy el control de quién entra y sale? ¿Queda registrado en papel, en el QR, o de alguna otra forma?

El flujo de visitantes es muy desigual: de jueves a domingo llegan entre 300 y 400 personas, mientras que de lunes a miércoles a veces no se superan las 50. En días de baja afluencia, los porteros logran hacer un registro manual completo. En días de alta afluencia, hay 1 a 2 personas dedicadas al registro. En senderos de baja dificultad solo se anota nombre y sendero; en senderos de alta dificultad (Cerro La Cruz, Morro La Reina, Cerro San Ramón) se exige además registro en Socorro Andino, hora límite de bajada y una llamada de verificación entre la 1 y 2 PM.

| Dato | Tipo |
|---|---|
| Visitantes fin de semana: 300-400 | Cuanti |
| Visitantes entre semana: menos de 50 | Cuanti |
| Personal dedicado al registro (1 entre semana, 2 fin de semana) | Cuanti |
| Horario de llamada de verificación (1-2 PM) | Cuanti |
| Diferencia de exigencia de registro según dificultad del sendero | Cuali |
| Explicación del porqué del registro diferenciado | Cuali |

**Pregunta 3 — Seguimiento en ruta**

Una vez que la persona ya entró al sendero, ¿tienen alguna forma de saber dónde va o si sigue el ritmo normal, o solo se sabe cuando vuelve a la entrada?

El guardaparque afirmó explícitamente: "no sabemos en vivo, no tenemos seguimiento en vivo." Solo se sabe a qué sendero fue cada persona por el registro de entrada. Existe un sistema informal de "puntos de corte por tiempo" en senderos de alta dificultad: por ejemplo, un máximo de 45 minutos para llegar al punto conocido como "la antena"; si el visitante se demora más, se asume que no está en condiciones de completar la ruta. Este sistema está "en marcha blanca" y aún no se ha publicado en la página web del parque.

| Dato | Tipo |
|---|---|
| Punto de corte de 45 minutos hasta "la antena" | Cuanti |
| Tiempo promedio de Cerro La Cruz (5-6 horas) | Cuanti |
| "No sabemos en vivo, no tenemos seguimiento en vivo" (cita textual) | Cuali |
| Sistema de puntos de corte está "en marcha blanca", no publicado | Cuali |
| Apoyo actual: mapas físicos, señalética, presencia en app SUDA | Cuali |

**Pregunta 4 — Cobertura de señal y comunicación**

¿Cómo es la cobertura de señal (celular/radio) en la zona alta? ¿Cómo se comunican con alguien que está en la montaña si pasa algo?

El uso de radios es muy bajo (aproximadamente 1 de cada 100 personas). La cobertura celular varía por compañía: WOM tendría la mejor cobertura (llega incluso más allá de Morro La Reina hacia Cerro La Cruz), Entel sería regular, y Movistar la peor, con visitantes que pierden señal desde el inicio mismo de los senderos. La comunicación con quienes están en ruta se hace exclusivamente por teléfono, desde un celular exclusivo del equipo de guardaparques. De aproximadamente 500 visitantes un sábado, solo 20 a 40 van a senderos de alta dificultad, lo que representa un máximo de 40 llamadas de verificación en un día.

| Dato | Tipo |
|---|---|
| Uso de radios: ~1 de cada 100 personas | Cuanti |
| Ranking de cobertura por compañía (WOM > Entel > Movistar) | Cuanti (categórico) |
| Visitantes a senderos de alta dificultad: 20-40 de 500 | Cuanti |
| Llamadas de verificación por día: hasta 40 | Cuanti |
| Explicación de por qué Movistar falla desde el inicio del sendero | Cuali |
| Único canal de comunicación: teléfono del equipo | Cuali |

**Pregunta 5 — Regla de grupo mínimo y mayoría de edad**

Lo de los grupos mínimos de 2 personas y el requisito de mayoría de edad para Cerro La Cruz, ¿de dónde salió esa regla? ¿Ha habido algún incidente que la haya motivado?

Según Leo, no es una obligación formal, sino una recomendación de precaución que probablemente surgió de un criterio informal de una administración anterior del parque, cuya página web no se actualiza hace años. Si una persona con experiencia llega sola, no se le impide el ingreso. El 100% de los incidentes atendidos por el equipo correspondió a personas que iban acompañadas, y el aviso siempre llegó a través de un acompañante, familiar o amigo cercano.

| Dato | Tipo |
|---|---|
| 100% de los incidentes atendidos fue con personas acompañadas | Cuanti |
| La regla no es obligación, es sugerencia (aclaración explícita) | Cuali |
| Página web del parque no se actualiza hace años | Cuali |
| Lógica detrás de la sugerencia (tener apoyo en primeros auxilios) | Cuali |

---

#### Entrevista a Fernanda Barrios, guardaparque Parque Mahuida

**Pregunta 1 — Frecuencia de extravíos y rescates**

¿Con qué frecuencia se pierde o se atrasa gente en los senderos, sobre todo en Cerro La Cruz? ¿Has tenido que salir a buscar a alguien en el último tiempo?

Según Fernanda, la frecuencia de personas perdidas es baja, porque el sendero está bien señalizado y se dan indicaciones al ingreso, además de pedir a los visitantes llevar la ruta descargada. A ella personalmente no le ha tocado hacer un rescate. En incidentes graves de altas cumbres, el parque no realiza la evacuación: da aviso a Socorro Andino, que es quien evacúa; el equipo del parque solo apoya con primeros auxilios mientras llega ese apoyo externo.

| Dato | Tipo |
|---|---|
| A Fernanda no le ha tocado hacer rescates directamente | Cuanti (frecuencia nula en su experiencia) |
| Práctica de pedir ruta descargada a los visitantes | Cuali |
| Protocolo: Socorro Andino evacúa, el parque solo asiste | Cuali |
| Explicación de por qué la frecuencia es baja (señalética + indicaciones) | Cuali |

**Pregunta 2 — Registro actual de entrada y salida**

¿Cómo funciona hoy el control de quién entra y sale? ¿Queda registrado en papel, en el QR, o de alguna otra forma?

El sistema cambió hace aproximadamente un mes. Antes todo se anotaba en hoja de papel, y solo a quienes iban a rutas de altas cumbres (Tascún) se les hacía un registro más riguroso, con declaración jurada y aviso a Socorro Andino. Ahora todos los senderos se registran en una planilla Excel. Fernanda señaló textualmente: "sería lo ideal que tuviésemos también un sistema, una plataforma", y comentó que el equipo intenta automatizar manualmente el Excel con apoyo de herramientas de inteligencia artificial genéricas, pero sin contar con un sistema real.

| Dato | Tipo |
|---|---|
| Cambio de papel a Excel: hace ~1 mes | Cuanti (temporalidad) |
| Registro previo diferenciado solo para altas cumbres | Cuali |
| "Sería lo ideal tener una plataforma" (cita textual) | Cuali |
| Uso de IA genérica para intentar automatizar el Excel | Cuali |

**Pregunta 3 — Seguimiento en ruta**

Una vez que la persona ya entró al sendero, ¿tienen alguna forma de saber dónde va o si sigue el ritmo normal, o solo se sabe cuando vuelve a la entrada?

Fernanda confirmó, de forma independiente a Leo: "no sabemos dónde está hasta que sale." Dependen del teléfono del visitante, a quien se le pide anotar el número del parque. En el sendero Guayacán, donde la gente tiende a perderse con más frecuencia, el único apoyo disponible es que los visitantes envíen fotos de su ubicación para ser guiados. A quienes van a altas cumbres se les pide comunicarse a partir de la 1 PM, con un horario máximo de retorno; desde la tarde el equipo llama para verificar estado y ubicación.

| Dato | Tipo |
|---|---|
| Horario de inicio de llamadas de verificación (1 PM) | Cuanti |
| "No sabemos dónde está hasta que sale" (cita textual) | Cuali |
| Guayacán identificado como el sendero donde más se pierde la gente | Cuali |
| Método improvisado: visitantes envían fotos para ser guiados | Cuali |

**Pregunta 4 — Cobertura de señal y comunicación**

¿Cómo es la cobertura de señal, como celular o radio, en la zona alta? ¿Cómo se comunican con alguien que está en la montaña?

La señal es intermitente y varía según compañía; Fernanda usa Claro y la describe como no muy buena, mientras que WOM andaría mejor (coincide con lo señalado por Leo). Agregó un dato nuevo: ni siquiera las radios internas del equipo de guardaparques funcionan bien dentro del bosque — incluso el personal de la administración, ubicado más abajo, puede no recibir las comunicaciones de radio desde el sendero.

| Dato | Tipo |
|---|---|
| Comparación de cobertura por compañía (Claro deficiente, WOM mejor) | Cuanti (categórico) |
| Fallas de radio interna dentro del bosque | Cuali |
| La administración (abajo) a veces no recibe las radios del sendero | Cuali |

**Pregunta 5 — Regla de grupo mínimo y mayoría de edad**

Lo de los grupos mínimos de dos personas y el requisito de mayoría de edad para Cerro La Cruz, ¿de dónde salió esa regla? ¿Ha habido algún incidente que la haya motivado?

Fernanda coincidió con Leo: no es una regla formal, sino una recomendación de precaución, pensada sobre todo para personas sin experiencia. Si el guardaparque evalúa que la persona tiene las capacidades y conocimientos necesarios, no se le pone problema para ir sola. La única exigencia real y más estricta aplica a menores de edad, quienes sí deben ir acompañados de un adulto responsable por temas de responsabilidad ante un eventual accidente.

| Dato | Tipo |
|---|---|
| Confirmación cruzada con Leo: no es obligación, es sugerencia | Cuali |
| Exigencia real y distinta para menores de edad (adulto responsable) | Cuali |
| Criterio de evaluación caso a caso por parte del guardaparque | Cuali |

## Encargos 3 y 4 · Iteración y profundización

### 1. De dato a insight

Aplicando las cuatro etapas cognitivas vistas en clase al dato principal de la investigación:

| Etapa | Contenido |
|---|---|
| Dato | "El 48,1% de la superficie de La Reina está amenazada por remoción en masa" (PLADECO) |
| Información | Al cruzar ese dato con el Plan Regulador Metropolitano de Santiago (PRMS), la zona de mayor riesgo geofísico de la comuna, el Área Montañosa Quebrada O-16, queda justo al oriente del Parque Mahuida, donde están los senderos de alta montaña |
| Hallazgo | El parque ha invertido en motos eléctricas, cámaras de vigilancia autónomas y señalética, pero todas esas inversiones vigilan el terreno o la infraestructura, nunca a las personas que caminan por los senderos |
| Insight | Existe una desconexión entre el nivel de riesgo que el propio municipio reconoce en su planificación y la capacidad de saber, en cualquier momento, dónde está cada persona expuesta a ese riesgo |

### 2. Metodología aplicada

**Método 1 — Entrevista en terreno.** Ir al lugar donde ocurre el problema y preguntarle a quien lo vive a diario. Se aplicó a los guardaparques Leo y Fernanda Barrios en la Plaza de los Senderos (20-08-2026), por separado, para triangular los datos (ver Avance 20-08-2026).

**Método 2 — Entrevista de evocación.** Sacar a la persona de la situación real y hacerla imaginar un escenario hipotético, para obtener respuestas más honestas y menos condicionadas por lo que "se supone" que debe responder. Se aplicó a 4 senderistas (Pablo, Nemesio, José y Gonzalo) al terminar su caminata por la Quebrada de Guayacán. Preguntas:

1. ¿El recorrido tiene suficiente seguridad? ¿Sientes que hay vigilancia, o en caso de un problema estarías solo?
2. ¿Conocías algo relevante de la ruta antes de subir? ¿Tuviste algún problema de señalética?
3. ¿Alguien te dio una referencia de cuánto dura la subida?
4. Si te hubiera pasado algo, ¿tu primera opción sería llamar a alguien?
5. Los guardaparques llaman por teléfono para hacer seguimiento. Si no tuvieras señal, ¿qué crees que pasaría?
6. Si el parque supiera aproximadamente por qué tramo vas, ¿te daría más tranquilidad?
7. ¿Dirías que este sendero es seguro? ¿Por qué?

### 3. Entrevistas a senderistas (Quebrada de Guayacán)

#### Hallazgos generales

* Ninguno percibió vigilancia activa, pero la mayoría se sintió seguro igual.
* Ninguno conocía de antemano el sistema de llamadas de control de los guardaparques.
* 3 de 4 reaccionaron de forma positiva a la idea de un "punto de control".
* Contrapunto: Gonzalo prefiere la autonomía antes que el monitoreo; no todos reciben la propuesta igual.

#### Respuestas por senderista

| Senderista | Percepción de seguridad | Sin señal | Punto de control |
|---|---|---|---|
| Pablo | No vio vigilancia; confía en ir con precaución y bastones de trekking. Recomienda descargar el mapa porque al inicio hay varias bifurcaciones | Se guía con AllTrails, que sigue registrando por GPS sin señal | Valora más su app con GPS |
| Nemesio | Se sintió seguro porque el sendero estaba concurrido: "había gente cerca mío, siempre". Vio señaléticas caídas | "No reaccionaría porque no me llegaría nada... me extrañaría" | "Igual estaría bueno" |
| José | Seguro, pero no libre de riesgo; hay un tramo donde se escala con manos y pies y no hay señalética | "Estaría bastante nervioso y complicado", aunque lo asume como parte del riesgo | "Sentiría mucha más tranquilidad si es que tuviera un punto de referencia" |
| Gonzalo | "Bastante seguro"; la señalética hace difícil perderse | Se orienta con referencias visuales, como ver Santiago; el teléfono es su tercera o cuarta opción | Le daría "más lo mismo": "es un poco de responsabilidad de cada uno" |

| Dato | Tipo |
|---|---|
| 4 senderistas entrevistados al terminar la ruta | Cuanti |
| 3 de 4 valoran positivamente un punto de control | Cuanti |
| Ninguno conocía de antemano el sistema de llamadas | Cuanti |
| Estacas caídas o retiradas y un tramo de trepada sin señalética | Cuali |
| Uso de apps propias (AllTrails) como respaldo sin señal | Cuali |
| La seguridad entendida como responsabilidad personal (Gonzalo) | Cuali |

* Acotación: José además trabaja en el parque y conoce el sistema desde dentro, por lo que su respuesta tiene más peso. Los videos y la transcripción están en [`entrevista/Entrevistas_Senderistas/`](entrevista/Entrevistas_Senderistas).

### 4. Datos nuevos

| Dato | Tipo |
|---|---|
| Mahuida es, junto al Cerro Manquehue y El Carbón, una de las cumbres más visitadas de la Región Metropolitana | Cuanti |
| La superficie del parque cambia según la fuente: 140 ha (PLADECO), 160 ha (La Tercera) y 170 ha (sitios turísticos) | Cuanti |
| El acceso es solo en vehículo particular o en 3 líneas de bus (403, D02 y 422) que dejan a 600 m | Cuanti |
| La RENAMU Mahuida es la tercera Reserva Natural Municipal de Chile, después de Arica y Cartagena | Cuanti |
| El Gobierno de Santiago destinó cerca de $45.000 millones a equipos de rescate para Socorro Andino, UNIREM y Bomberos | Cuanti |
| SENAPRED identificó 405 puntos críticos en la Región Metropolitana (falta confirmar si Mahuida está entre ellos) | Cuanti |
| El PRMS identifica el sector montañoso cercano al parque como zona de riesgo geofísico por remoción en masa | Cuali |
| El parque recibe regularmente a colegios completos y agrupaciones de adultos mayores | Cuali |
| Existe un protocolo formal para subir a las altas cumbres fuera del horario normal, pero el control sigue siendo manual | Cuali |
| Desde 2025 el parque usa motos eléctricas Gogoro y cámaras autónomas: ya está en modo de modernización tecnológica | Cuali |
| SENAPRED tiene un mapa público, el Visor Chile Preparado, que cruza datos de SERNAGEOMIN, CONAF, el IGM y los municipios | Cuali |

* Fuentes: PLADECO La Reina 2019-2025, La Tercera (2025), Radio Universidad de Chile (2025), Gobierno de Santiago (2026), SENAPRED, parquemahuida.cl, Tripadvisor y Andeshandbook.
* Acotación: buscar también en fuentes de turismo y reseñas, no solo institucionales, reveló el dato de posicionamiento (una de las cumbres más visitadas de la RM), que no aparecía en ningún documento oficial. La diferencia en la superficie es en sí un hallazgo: ni siquiera el tamaño del parque está centralizado.

### 5. Stakeholders

| Actor | Tipo | Rol en el problema |
|---|---|---|
| Senderistas de alta montaña | Usuario primario | Usan el sistema; están expuestos al riesgo |
| Visitantes ocasionales (familias, colegios, adultos mayores) | Usuario secundario | Circulan por las rutas fáciles; no necesitan el dispositivo, pero sí información |
| Guardaparques Mahuida | Usuario operador | Hoy hacen el control manual; usarían el panel de monitoreo |
| Corporación Parque Mahuida | Institución municipal | Administra la reserva desde 2020; es dueña del problema y decide si implementar |
| Dirección de Seguridad (MLR) | Institución municipal | Ya gestiona la vigilancia tecnológica del parque (motos, cámaras) |
| Unidad de Gestión del Riesgo de Desastres y Emergencias (MLR) | Institución municipal | Protocolo de emergencias comunal; coordinaría la respuesta si alguien no vuelve |
| Cuerpo de Socorro Andino | Institución externa | Responde los rescates reales en montaña en la RM |
| UNIREM (Bomberos) | Institución externa | Unidad de rescate especializada, que ya recibe inversión regional |
| SENAPRED | Institución estatal | Gestión de riesgo a nivel nacional, con mapas de amenaza públicos |

* Acotación: el parque también lo usan el Club de Equitación, la SOECH (escultores) y el Museo Campesino. Mahuida es multiuso, por lo que el dispositivo es solo para quien va a las rutas de riesgo, no para todo el parque.

### 6. Problema definido

Mahuida es una de las cumbres más visitadas de la Región Metropolitana y la tercera Reserva Natural Municipal del país, con inversión tecnológica activa en vigilancia del espacio (motos eléctricas y cámaras autónomas, 2025). El municipio también reconoce oficialmente, en su PLADECO, que la zona montañosa colindante es la de mayor riesgo geofísico de la Región Metropolitana. Pese a ese doble reconocimiento, como destino relevante y como zona de riesgo, el control de las personas que ingresan a los senderos de alta montaña sigue siendo un registro presencial (en papel o Excel), sin ningún mecanismo de trazabilidad en tiempo real ni diferenciación clara entre el visitante ocasional y quien va a la zona de riesgo real.

* Acotación: un sistema de trazabilidad por puntos no solo ayudaría al parque. En un rescate real, podría entregar a Socorro Andino o UNIREM el último punto conocido de la persona, reduciendo el tiempo de búsqueda; hoy esos equipos llegan a ciegas a una montaña donde el único registro es la planilla de entrada.
* Archivos: [`encargos/Encargo_3/Encargo_3.pdf`](encargos/Encargo_3/Encargo_3.pdf) y [`encargos/Encargo_4/Encargo4.pdf`](encargos/Encargo_4/Encargo4.pdf)

## Caso y soluciones

### 1. Cruce del caso con referentes

| | Parque Mahuida (caso) | UTMB LiveTrail (referente directo) | Disney MagicBand (referente indirecto) |
|---|---|---|---|
| Contexto | Rutas de alta montaña sin cobertura celular garantizada | Carreras de montaña | Parques temáticos extensos |
| Identificación | Registro en la entrada | Pulsera con chip por corredor | Pulsera con chip |
| Ubicación | Desconocida hasta que la persona vuelve | Paso registrado automáticamente en checkpoints; la organización ve el recorrido | Paso registrado automáticamente en puntos determinados, sin GPS en vivo |
| Qué detecta | Solo el no-retorno, con llamadas | Cuando alguien no aparece donde debería | Dónde estuvo la persona, aproximadamente |
| Emergencia | Llamada del visitante o de su acompañante | Canal SOS | — |

**Contexto en común:** controlar el recorrido de personas en zonas de montaña y detectar a tiempo cuando alguien se desvía, se atrasa o no llega (directo), y conocer la ubicación aproximada de una persona dentro de un espacio amplio mediante puntos de control, sin que tenga que hacer acciones constantemente (indirecto).

### 2. Primera propuesta: pulsera + tótems para Cerro La Cruz

1. **Al entrar:** el senderista elige el sendero, dice cuántas personas van con él y recibe una pulsera.
2. **En el camino:** hay tótems en puntos por donde la gente ya pasa. Al acercar la pulsera queda registrado hasta dónde llegó y a qué hora. El tótem funciona solo, sin señal de celular.
3. **Guardaparques:** ven en una pantalla por qué tótems pasó cada grupo, si alguien se demora más de lo normal entre un punto y otro y cuánta gente hay en el sendero.
4. **Al salir:** se devuelve la pulsera y se cierra el registro.

La idea evita a propósito el seguimiento en tiempo real, que es demasiado difícil de lograr: se basa en el paso por puntos clave y en el conteo de pulseras entregadas. Solo se aplica a Cerro La Cruz, porque en el sendero fácil (3 km) nadie se pierde ni necesita rescate, mientras que Cerro La Cruz sí es riesgoso (14,2 km, cerca de 5 horas de subida, grupo y mayoría de edad recomendados). Los senderos fácil y medio se quedan con el código QR de información, porque ahí lo que faltaba era un mapa digital, no seguridad.

* Archivo: [`Soluciones/Caso y Soluciones.pdf`](Soluciones/Caso%20y%20Soluciones.pdf)

## Encargo 5 · Recorrido a la solución

**Problema de partida:** el Parque Mahuida no puede hacer un seguimiento continuo de los senderistas en sus rutas de alta montaña. Es especialmente crítico en Cerro La Cruz (2.554 msnm, 14,2 km y hasta 10 horas), en una comuna con el 48,1% de su superficie en riesgo de deslizamiento. El parque depende de registros manuales, Excel y llamadas puntuales, sin poder detectar a tiempo atrasos o la falta de retorno de un visitante.

### 1. Crazy 8

Cada integrante generó 8 ideas en 8 minutos (32 en total). Agrupadas:

| Familia | Ideas |
|---|---|
| Dispositivo personal | Baliza satelital con SOS, pulsera NFC/RFID, pulsera con GPS, pulsera biométrica que detecta inmovilidad, reloj con pulso y detección de caídas, llavero con GPS, GPS + SOS tipo Garmin |
| Puntos en el sendero | Puntos de check-in físicos, postes con lectores, tótems o estacas con botón SOS, botón de pánico cada 2 km, red de repetidores LoRa, red Bluetooth de largo alcance |
| Software y control | App que funciona sin internet y sincroniza en puntos con señal, "modo montaña" con track GPS, geocercas, aforo digital de entradas y salidas, central de monitoreo en la Plaza de los Senderos, códigos QR por tramo, Life360 |
| Otras | Compañero de ruta con check-in cruzado, drone de patrullaje, bengalas, silbato de infrasonido, chalecos por color de ruta, luces nocturnas, puntos de encuentro numerados, kit con radio, panel de información |

Lo más importante a recalcar fue la **falta de señal en las zonas de riesgo** y la **necesidad de detectar atrasos o no-retornos**. La mezcla de ideas fue una pulsera o dispositivo GPS con botón SOS, geocercas y registro de entrada y salida.

### 2. SCAMPER

| Letra | Pregunta | Respuesta |
|---|---|---|
| S · Sustituir | ¿Qué podemos reemplazar? | La señal celular por comunicación satelital o una red LoRa de bajo consumo entre postes |
| C · Combinar | ¿Qué podemos unir? | La pulsera con el registro de entrada y salida: el mismo dispositivo es "ticket" y rastreador |
| A · Adaptar | ¿Qué podemos traer de otro contexto? | El monitoreo de pulso y ritmo y la detección de impactos fuertes (como Crash Detection de Apple), aplicada a caídas en la montaña |
| M · Modificar | ¿Qué podemos aumentar, reducir o alterar? | Transmitir la ubicación cada 10-15 min en vez de en vivo, para que la batería dure las 10 horas |
| P · Proponer otros usos | ¿Qué otra función podría tener? | Mapas de calor de afluencia y de los tramos más usados o riesgosos |
| E · Eliminar | ¿Qué podemos quitar? | El registro manual en papel o Excel |
| R · Reorganizar | ¿Qué pasa si cambiamos la lógica? | Alertar solo por excepción: cuando alguien no vuelve a la hora estimada o sale de la geocerca |

### 3. Seis sombreros

| Sombrero | Respuesta |
|---|---|
| Blanco · Evidencia | Se sabe que el 48,1% de La Reina tiene riesgo de deslizamiento y que Cerro La Cruz llega a 10 horas sin señal; falta el costo real de un dispositivo y saber si el parque tiene presupuesto o convenios |
| Rojo · Intuición | Da confianza y tranquilidad a guardaparques, familias y senderistas, como se vio en las entrevistas de evocación |
| Negro · Riesgo | Costo de implementación, resistencia a llevar un dispositivo adicional y falta de mantenimiento de la red |
| Amarillo · Valor | Funciona si se integra al registro que ya existe en la caseta, sin pasos extra, con un registro digital centralizado |
| Verde · Alternativas | Un "llavero SOS" simple solo para emergencias, con el GPS continuo como opción |
| Azul · Proceso | Monitoreo por excepción: más liviano, barato de mantener y fácil de escalar a otras rutas |

### 4. Matriz de Pugh

* **A · Sistema satelital adaptativo:** pulsera con GPS, botón SOS, detección de caídas y geocercas; transmite por satélite cada 10-15 min.
* **B · Red de trazabilidad por postes:** tótems con lectores que registran el paso de cada senderista (como en el trail running), conectados por LoRa hasta un punto con señal, con botón SOS en cada poste y aforo digital en portería.
* **C · App offline + monitoreo biométrico:** app con "modo montaña" que guarda el track GPS sin internet y un smartwatch que detecta inmovilidad.

| Criterio | Datum | A | B | C |
|---|---|---|---|---|
| Detección de emergencia sin señal (F) | S | + | + | S |
| Autonomía de batería | S | − | + | − |
| Costo de implementación | S | + | − | + |
| Facilidad de uso para el senderista | S | S | S | S |
| Integración con el proceso de portería | S | S | + | + |
| Escalabilidad a otras rutas | S | S | + | + |

**Resultado:** la B es la mejor puntuada. Es la más robusta en el criterio factor (detección sin señal), tiene la mejor autonomía porque los tótems no dependen de la batería del senderista y escala fácil a otras rutas; su debilidad es el costo inicial de la infraestructura fija. La A destaca en innovación por la detección de caídas, pero depende de la batería personal. La C es la más económica y fácil de integrar, pero depende del smartwatch del usuario.

* Acotación: quedó fuera la idea de sumar una detección de caídas al estilo de Apple, que llame sola a emergencias pero se pueda anular si no fue grave, junto con signos vitales y ritmo en tiempo real. No se logró integrar a la propuesta.
* Archivos: [`encargos/Encargo_5/Encargo_5.pdf`](encargos/Encargo_5/Encargo_5.pdf) y [`encargos/Recorrido de la solución.pdf`](encargos/Recorrido%20de%20la%20soluci%C3%B3n.pdf)

## Certamen 1 · Presentación de la propuesta

La presentación recorre contexto, problemática, levantamiento en terreno, enmarque, objetivos, referentes, genealogía de la propuesta y bibliografía.

### 1. Enmarque

| Lo que se tiene | Lo que falta |
|---|---|
| Señalética, vigilancia, tecnología y un mapa oficial de riesgo | Saber dónde está la gente una vez que entra |

### 2. Objetivos

#### Objetivo general
Diseñar un sistema de trazabilidad y monitoreo para senderistas de alta montaña en el Parque Mahuida, que permita registrar sus recorridos, detectar atrasos en los tiempos estimados y facilitar una respuesta oportuna ante situaciones de emergencia.

#### Objetivos específicos
1. Identificar las principales brechas de seguimiento y monitoreo de senderistas durante sus recorridos en las rutas de alta montaña, considerando los procesos actuales de registro y supervisión.
2. Determinar los puntos críticos, tiempos de recorrido y momentos de riesgo de las rutas seleccionadas, para establecer criterios de alerta y seguimiento.
3. Diseñar un sistema de trazabilidad que integre la información relevante del senderista y de los equipos de respuesta, permitiendo detectar atrasos y comunicar oportunamente situaciones de riesgo.

### 3. Referentes

La ficha completa de cada uno está en [`Referente/Referentes.pdf`](Referente/Referentes.pdf).

| Referente | Tipo | Qué aporta a Mahuida | Límite o diferencia |
|---|---|---|---|
| [UTMB LiveTrail](https://montblanc.utmb.world/es/races-runners/other-information/LiveTrail) | Directo · registro en puntos de control | Conocer el último punto de paso y registrar tiempos | Es una competición deportiva |
| [Garmin inReach](https://www.garmin.com/) | Directo · comunicación de emergencia | Una vía de aviso independiente del celular | Usa red satelital, no LoRa |
| [Safety Passport](https://play.google.com/store/apps/details?id=com.duomo.pasaportetdp) | Directo · itinerarios y último punto conocido | Asociar identidad, recorrido y último punto informado | No es localización continua ni comunicación de emergencia |
| [TickTalk](https://www.myticktalk.com/) | Indirecto · aviso a terceros | Alertar a una persona encargada cuando ocurre un evento | Depende de la señal celular |
| [Disney MagicBand](https://disneyworld.disney.go.com/guest-services/magicband-plus/) | Indirecto · identificación sencilla | Pocos pasos y puntos de interacción reconocibles | Otra tecnología, alcance y propósito |
| [Cyclers](https://mwm.ai/es/apps/cyclers-bike-route-planner/1213867271) | Indirecto · información por tramos | Diferenciar tramos por riesgo, no solo por dificultad | No es una solución de rescate |
| [Eco-Counter PYRO-Box Evo](https://es.eco-counter.com/soluciones/productos/piro-box-evo) | Contador automático de personas | Detección sin botón y autonomía en exterior | Cuenta personas, pero no las identifica |
| [Talkaphone Wireless Blue Light Tower](https://www.talkaphone.com/products/blue-light-phones/wireless-tower/) | Tótem de asistencia | Botón de emergencia, aviso luminoso y electrónica dentro de un poste | Usa celular o IP, no LoRa |
| [Milesight EM300-TH](https://www.milesight.com/iot/product/lorawan-sensor/em300-th) | Sensor ambiental inalámbrico | Encapsulado resistente, autonomía y envío inalámbrico de mediciones | LoRaWAN no es compatible con cualquier enlace LoRa; no mide lluvia |
| [U.S. Forest Service](https://www.fs.usda.gov/) | Constructivo · postes y orientación | Preguntas sobre postes, resistencia, ubicación y mantenimiento | No garantiza que el anclaje sirva en Mahuida |
| [National Park Service · Wayside Exhibits](https://www.nps.gov/features/hfc/guidelines/) | Constructivo · paneles de exterior | Escala humana, legibilidad y adaptación al paisaje | En cumbres requiere evaluación adicional |
| [New York State Parks](https://parks.ny.gov/) | Constructivo · sistemas de señalización | Dimensiones, señalética por puntos y coherencia formal | Criterios de otro territorio |

### 4. Genealogía de la propuesta

Ideas del Crazy 8 que se mantienen en la propuesta:

| Idea | Qué aporta |
|---|---|
| Tótems con lector | Registro automático del paso |
| Red LoRa | Conecta los tótems sin señal celular |
| Detección de salida y aforo digital | Alerta si alguien no vuelve a tiempo, sin acción manual |
| Botón SOS | En el tótem y en el dispositivo |
| Central de monitoreo | Recibe todas las alertas |
| Monitoreo de pulso | Detecta inmovilidad temprana |
| App "modo montaña" | GPS offline como respaldo |

* Archivos: [`encargos/Certamen_1/Presentación certamen_1.pdf`](encargos/Certamen_1/Presentaci%C3%B3n%20certamen_1.pdf) y enlace a la presentación en Canva en [`encargos/link ppt y avance.pdf`](encargos/link%20ppt%20y%20avance.pdf)

## Encargo 7 · Arquitectura, flujo y BOM

El **Sistema de Trazabilidad y Alerta en Montaña** tiene tres partes: un dispositivo personal, los tótems del sendero y la base en la caseta de guardaparques.

### 1. Qué hace el sistema

| Función | Descripción |
|---|---|
| Registro en la caseta | El guardaparque asocia el nombre del senderista con el ID de su dispositivo |
| Paso por los tótems | Al pasar cerca se registra solo: hora, tiempo total y tiempo entre tótems, al subir y al bajar |
| Avisos al senderista | Luz e ícono si pasa la hora límite o si el tótem detecta que viene lluvia |
| SOS | Llega al PC a través del tótem más cercano y se confirma de vuelta |
| Vista del cerro | El último tótem envía una foto liviana cada cierto tiempo |

### 2. Inputs, procesador y outputs

| Capa | Qué incluye |
|---|---|
| Inputs | ID del dispositivo (BLE / ESP-NOW al pasar cerca del tótem); botón SOS; clima con el sensor BME280 (presión, temperatura y humedad); cámara del último tótem; nombre, ID y hora límite en la interfaz web |
| Procesador | ESP32 del dispositivo (lee el botón y recibe avisos); Heltec LoRa V3 del tótem (registra hora, ID y clima, decide el aviso de lluvia y envía por LoRa); Heltec receptor + PC (calculan tiempos, comparan con la hora límite y generan alertas) |
| Outputs | Dispositivo: luz e ícono; tótem: LED y buzzer; guardaparque: interfaz web con tiempos, clima, fotos y alertas SOS; rescatistas: llamada si hay SOS |

### 3. Flujo

**Recorrido normal:** (1) en la caseta se registran nombre e ID → (2) en cada tótem, al subir y al bajar, el dispositivo envía su ID → (3) el tótem manda hora, ID y clima al PC → (4) el PC muestra los tiempos al guardaparque → (5) el último tótem envía una foto liviana → (6) al volver se cierra el registro.

**Alerta y SOS:** si se pasa la hora límite o viene lluvia, el senderista recibe un ícono y una luz. Si presiona SOS, la alerta pasa por el tótem cercano hasta el PC, el guardaparque la confirma y la confirmación vuelve como luz verde.

### 4. Fallas y límites

| Si falla | Qué pasa | Respuesta de diseño |
|---|---|---|
| No hay tótem cerca del dispositivo | No salen el SOS ni los avisos | Tótems más juntos en tramos críticos |
| Enlace LoRa | No llegan datos al PC | El tótem guarda el registro y lo reenvía después |
| Sensor BME280 | No hay dato de clima | Aviso de "sin lectura" en el PC |
| Batería o panel solar | El tótem puede apagarse | Aviso de batería baja al PC |
| PC o gateway caído | No hay monitoreo remoto | El tótem sigue avisando localmente con LED y buzzer |

Para el dispositivo personal se bocetaron cinco formas: llavero con mosquetón, pin, pulsera con banda elástica, clip y tarjeta.

### 5. Arquitectura 1.1 y BOM v1.1 (01-10-2026)

Al cotizar y revisar la compatibilidad de los componentes aparecieron barreras que cambiaron la arquitectura entre el BOM_v01 (28-09-2026) y el BOM_v1.1 (01-10-2026):

| Barrera detectada | Cambio en la arquitectura 1.1 |
|---|---|
| LoRa no sirve para enviar imágenes | Se descarta la cámara |
| El RFID alcanza solo centímetros y no puede avisarle al senderista | La pulsera RFID pasiva se reemplaza por un clip BLE activo (Seeed XIAO ESP32-C3 + batería + buzzer + interruptor) que emite su ID y pita si el tótem avisa una condición insegura |
| El clip no tiene LoRa | El SOS pasa al tótem, como botón físico |
| Un panel de 170 mA no alimenta BLE + LoRa | Panel de 20 W, controlador PWM y batería AGM de 12 V 7 Ah por tótem |
| La Heltec V3 no tolera 12 V | Convertidor LM2596 12 → 5 V y fusible |
| El GPIO de la Heltec no maneja un buzzer fuerte | Transistores 2N2222 |
| El BME280 dentro de la caja sellada mide mal | El sensor va fuera de la caja |
| La batería AGM no cabe en la caja | La batería va en una caja aparte |
| En Chile LoRa usa 915 MHz | Antenas de 915 MHz (los módulos de 433 MHz no sirven) |

Además se agregó un reloj de tiempo real DS3231 para poner la hora real en cada registro y reenviar si se corta LoRa, y se descartó la impresión 3D.

| Subsistema | Ítems | Costo (CLP) |
|---|---|---|
| Electrónica | 22 | $337.654 |
| Mecánica / estructura | 4 | $50.860 |
| Ensamblaje | 9 | $40.300 |
| Terminaciones | 1 | $3.500 |
| **Total** | **36** | **$432.314** |

La compra se divide en dos fases:

* **Fase 1 (11 ítems, $108.400):** un tótem de prueba, la base y un clip, para probar el alcance LoRa entre la caseta y Cerro La Cruz con las antenas incluidas, y la detección BLE. El tótem de prueba se alimenta con powerbank.
* **Fase 2 ($323.914):** solo si la fase 1 funciona. Segundo tótem, electrónica completa de ambos tótems (RTC, SOS, LED y buzzer), clips 2 y 3, cadena solar, antenas externas si hacen falta y montaje final.

* Acotación: dos funciones de la arquitectura no tienen BOM físico porque son software: la base de datos que calcula tiempos por tramo y detecta no-retornos, y el panel web de guardaparques con aforo, clima y alertas SOS.
* Archivos: [`encargos/encargo 7/encargo 7 Bom y flujo.pdf`](encargos/encargo%207/encargo%207%20Bom%20y%20flujo.pdf) y [`encargos/BOM_Parque_Mahuida_v1.1.xlsx`](encargos/BOM_Parque_Mahuida_v1.1.xlsx) (hojas BOM, Fases, Trazabilidad, Resumen e Historial)

## Encargo 8 · Exploración de prototipos

### 1. Primera prueba electrónica (ESP-NOW)

| Aspecto | Detalle |
|---|---|
| Objetivo | Comprobar la comunicación inalámbrica entre el dispositivo personal y el tótem |
| Estado | Prueba de mesa realizada |
| Funcionamiento logrado | Se presiona el botón del dispositivo → envía los datos del usuario al tótem → el tótem registra hora, ID y estado → el dispositivo emite 2 pitidos de recepción |
| Información registrada | Nombre, hora, dirección MAC, estado del evento y conteo acumulado |
| Próximo paso | Detección automática por proximidad e integración con la red LoRa |

### 2. Viabilidad constructiva

Cada prototipo se evaluó según cinco criterios:

* **Materialidad:** materiales y uniones resistentes a la intemperie.
* **Dimensiones:** alturas, diámetros y proporciones en relación con una persona.
* **Transporte:** peso y posibilidad de subir las piezas por el sendero.
* **Montaje:** ensamblaje, fijación al terreno y acceso para mantención.
* **Entorno:** viento, pendiente, radiación solar y paisaje del parque.

### 3. Maquetas de checkpoints

#### Evolución

1. **v1 · Pórtico de colihue (1:20):** inviable. Sumaba más de 190 kg de colihue (≈154 kg en los tótems y ≈40 kg en la viga), con piezas de 3,2 m y un momento de viento de ≈4 kN·m en la base. No había forma de subirlo a la cumbre.
2. **Revisión 2 (07-10-2026):** más simple de construir y transportar, con materiales del lugar, conectado con la historia del cerro y que cada checkpoint sea "la foto". Resultado: la v2, con 7 propuestas en aluminio color óxido y piedra del lugar.
3. **Revisión 3 (08-10-2026):** justificar por qué es viable cada prototipo, sus materiales, cómo se sube y cómo interactúa con el cerro. Se hizo un chequeo preliminar de viento y **6 de las 7 propuestas se corrigieron (v2.1)**.
4. **09-10-2026:** corrección de las plantillas (pestañas fuera de las piezas, cruz de 26 cm, barra de escala).

#### Los 7 checkpoints (v2.1)

| CP | Prototipo | Qué cuenta del cerro | Estructura | Chequeo de viento | Peso y transporte |
|---|---|---|---|---|---|
| 1 | Tótem Mawida (entrada) | La fauna del cerro: cóndor, zorro culpeo, vizcacha y lagartija | Tubo Ø100×3 enterrado 0,9 m con piedra del lugar, sin hormigón | 64 MPa a 100 km/h | 22,0 kg; llega en auto |
| 2 | Silueta del águila | El ave calada deja ver el cielo real | Placa de aluminio de 2 mm sobre dos postes 60×60×2 enterrados 0,8 m | 56 MPa a 100 km/h | 18,6 kg entre 2-3 personas, piezas de 0,9-1,4 m |
| 3 | El Caminante | Homenaje a incas, arrieros y excursionistas; es la foto típica | Tubo cuadrado apernado (sin soldar), piernas 50×50×3 enterradas 0,7 m y bastón de colihue | 39 MPa; ya no se vuelca de costado | 18,8 kg por el camino de servicio, o a pie en tramos de 1,33 m o menos |
| 4 | Hoja de guayacán | Marca el desvío a la Quebrada de Guayacán y presenta una especie endémica y vulnerable | Poste 70×70×3 en 3 tramos, enterrado 0,8 m, y placa con una rama grabada | 64 MPa a 130 km/h | 15,3 kg entre 2 personas, tramos de 0,93 m |
| 5 | Ventana al valle | No tapa la vista: la encuadra | Marco de tubos de aluminio, postes 50×50 enterrados 0,7 m con puntales traseros | 59 MPa | 16,9 kg entre 2-3 personas, piezas de 1 m o menos |
| 6 | Columna de piedras | Es una apacheta: no necesita hoyo y las piedras vuelven a su sitio al retirarla | Cono de malla galvanizada Ø0,7/0,4 × 1,0 m relleno con ≈365 kg de piedra del lugar, con mástil | Factor de seguridad al vuelco de 1,2 (cilindro) a 2,1 (cono) | 11,1 kg; la malla va enrollada en la mochila |
| 7 | Cruz de la cumbre | La pirca imita los muros incas; los cables se amarran a rocas sin perforar | Tubo de aluminio 50×50 sujeto por 3 vientos de cable inox de 3 mm | Cada cable resiste ≈5.000 N y toma ≈1.050 N | 13,5 kg entre 3 personas (4-5 kg cada una), piezas de 0,9 m o menos |

* Supuestos del chequeo: ráfaga de 100 km/h en los puntos bajos y de 130 km/h desde el cruce hacia arriba; aluminio 6063-T5 (fy 110 MPa), aceptando hasta 73 MPa; empotramiento por el método de Broms y vuelco en la columna.
* Acotación: es un chequeo preliminar. Falta validar las ráfagas de diseño y los cálculos con el profesor o un ingeniero (NCh 432).



### 4. Dispositivo personal

Se exploraron siete formas de llevar el dispositivo. Las maquetas a escala real se probaron sobre el cuerpo en dos versiones (fotos del 22-10-2026 en [`Prototipos/Fotos_Dispositivo/`](Prototipos/Fotos_Dispositivo)).

| Formato | Cómo se lleva | Por qué se exploró |
|---|---|---|
| Pulsera | Banda elástica ajustable, en la muñeca o el tobillo | Barata, fácil de fabricar y de revisar |
| Llavero | Cuerda o mosquetón, colgado de la mochila o el cinturón | Práctico de transportar y resistente a golpes |
| Collar | Cuerda al cuello | Fácil de usar; podría vibrar para dar alertas |
| Imán | Dos piezas magnéticas, una por dentro y otra por fuera de la prenda | Cada senderista elige dónde ponerlo |
| Cinturón | Cinta de mochila regulable a la cintura | Se adapta a distintas personas y prendas |
| Clip de ropa | Clip trasero, con luces en la parte superior | Visible en la oscuridad |
| Clip de cordón | Clip en los cordones de la zapatilla | Discreto y sin ocupar las manos; debe aguantar barro y polvo |

Todos deben resistir sudor, polvo, lluvia y golpes. Estos formatos exploran cómo llevar la electrónica definida en la arquitectura 1.1 (el clip BLE con XIAO ESP32-C3, batería, buzzer e interruptor en una caja pequeña).

* Archivo: [`encargos/Encargo_8/Encargo 8 exploración de prototipos.pdf`](encargos/Encargo_8/Encargo%208%20exploracio%CC%81n%20de%20prototipos.pdf)

## Red LoRa · Ubicación final de los tótems (Rev. 3, 22-10-2026)

Con los prototipos definidos, se estudió dónde poner cada tótem para que la señal LoRa llegue a la caseta según el perfil del terreno del sendero Cerro La Cruz.

**Nueva numeración:** CP1 pasa a ser la caseta de guardaparques, que funciona como base (gateway + PC, registro y entrega del clip). Los tótems son CP2 a CP6, de abajo hacia arriba, y corresponden a los antiguos CP3 a CP7. El antiguo CP1 (Tótem Mawida, en la entrada del parque) se eliminó porque esa zona es segura.

| Punto | Prototipo | Lugar | km por sendero | Altura (msnm) | Antena | Envía a |
|---|---|---|---|---|---|---|
| CP1 · Base | — | Caseta de guardaparques, Plaza de los Senderos | 0 | 906 | 4 m | — |
| CP2 | El Caminante | Mirador de la Antena | 1,18 | 1.098 | 2,5 m | CP1 (0,71 km) |
| CP3 | Hoja de guayacán | Mirador del Guayacán, 263 m antes del cruce | 1,71 | 1.283 | 2,5 m | CP1 (1,05 km) |
| CP4 | Ventana al valle | 42 m antes del Mirador del Filo | 3,21 | 1.870 | 3 m (mín. 2,5) | CP1 (2,20 km) |
| CP5 | Columna de piedras | 36 m antes de la Cumbre de las Antenas | 5,13 | 2.299 | 2,5 m (mástil) | CP4 (1,65 km) |
| CP6 | Cruz de la cumbre | 64 m antes de la cruz | 6,45 | 2.545 | 2,5 m | CP5 (1,19 km) |

De la caseta a la cruz hay 6,51 km por sendero y +1.662 m de desnivel. CP5 y CP6 no ven la caseta, así que su mensaje salta de tótem en tótem (CP6 → CP5 → CP4 → caseta).

| Dato | Tipo |
|---|---|
| Opción B: 6 radios (base + 5 tótems) y 0 repetidores | Cuanti |
| Opción C (sin CP2): 5 radios | Cuanti |
| Con los tótems en sus lugares originales hacían falta 3 repetidores (9 radios) | Cuanti |
| Enlace más justo: CP5 → CP4, 1.650 m, con 55 dB de margen (36 dB si el terreno fuera 5 m más alto) | Cuanti |
| CP4 es crítico: no tiene respaldos con vista limpia; hay que probar CP4 → CP3 y CP6 → CP4 | Cuali |
| Si el registro fuera en la portería, el número de radios es el mismo, pero CP3 queda 100 m bajo el cruce y CP5 76 m antes de la antecumbre | Cuali |

* Acotación: las distancias y alturas salen del perfil del terreno; los enlaces se confirman recién con las pruebas en terreno de la fase 1.


## Bibliografía

La lista completa, agrupada por tema, está en [`bibliografia/bibliografias.pdf`](bibliografia/bibliografias.pdf). Principales fuentes:

#### Municipalidad de La Reina
* [PLADECO La Reina 2019-2025](https://www.lareina.cl/wp-content/uploads/2025/09/Pladeco-2019-2025-APROBADO.pdf)
* [Señalética en senderos (operativo en helicóptero)](https://www.lareina.cl/senaleticas-en-sendero/)
* [Parque Mahuida en el organigrama municipal](https://lareina.cl/la-reina-tiene-la-primera-reserva-natural-de-la-region-metropolitana/parque-mahuida-2/)

#### Parque Mahuida
* [Senderos](http://www.parquemahuida.cl/senderos/)
* [Información y protocolos de ingreso](http://www.parquemahuida.cl/informacion/)

#### Prensa y turismo
* [La Tercera: los senderos del Parque Mahuida](https://www.latercera.com/finde/noticia/los-senderos-del-parque-mahuida-que-te-permitiran-ver-la-ciudad-en-180/)
* [Radio Universidad de Chile: Mahuida como modelo de parque urbano sostenible](https://radio.uchile.cl/2025/12/11/parque-mahuida-de-la-reina-se-convierte-en-modelo-de-parque-urbano-sostenible-para-america-latina/)
* [Wikiexplora: Cerro La Cruz](https://www.wikiexplora.com/Cerro_La_Cruz)
* [AllTrails: Reserva Natural Municipal Mahuida](https://www.alltrails.com/es/parques/chile/reserva-natural-municipal-mahuida)
* [Andeshandbook: Sendero Loma Pelada](https://www.andeshandbook.org/senderismo/ruta/1795/Sendero_Loma_Pelada)

#### Rescate y emergencias
* [Gobierno de Santiago: Plan de Invierno 2026](https://www.gobiernosantiago.cl/2026/05/05/autoridades-revisan-plan-de-invierno-2026-y-anuncian-puntos-criticos-de-la-region-metropolitana-de-cara-al-sistema-frontal-que-llegara-este-miercoles-a-la-capital/)
* [SENAPRED: Región Metropolitana](https://www.senapred.cl/category/region-metropolitana/)
* [SENAPRED: Visor Chile Preparado](https://senapred.cl/visor-chile-preparado/)

#### Metodología
* Dorst, K. (2015). *Frame Innovation: Create New Thinking by Design*. MIT Press.
