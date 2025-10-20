
const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");

const { state, saveState } = useSingleFileAuthState("./auth_info.json");

async function startSock() {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false, // No mostrar QR
    });

    sock.ev.on("creds.update", saveState);

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, isNewLogin } = update;
        if (connection === "open") {
            console.log("✅ ¡Conectado a WhatsApp!");
        } else if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("❌ Conexión cerrada, reconectando:", shouldReconnect);
            if (shouldReconnect) startSock();
        }
    });

    // Si es un nuevo login, generar código de emparejamiento
    if (!state.creds.registered) {
        const phoneNumber = "5492915268762"; // <- tu número completo con código de país, sin espacios
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(`🔢 Ingresa este código en tu teléfono: ${code}`);
    }
}

startSock();


// Configurar FFmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Función para descargar imagen desde URL
async function descargarImagenDesdeUrl(url) {
  return new Promise((resolve, reject) => {
    console.log(`🌐 Iniciando descarga de: ${url}`);
    const protocolo = url.startsWith('https:') ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'WhatsApp Bot/1.0'
      }
    };
    
    const request = protocolo.get(url, options, (response) => {
      console.log(`📊 Respuesta HTTP: ${response.statusCode}`);
      console.log(`📝 Content-Type: ${response.headers['content-type']}`);
      
      // Seguir redirecciones
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        console.log(`🔄 Siguiendo redirect a: ${response.headers.location}`);
        return descargarImagenDesdeUrl(response.headers.location).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Error HTTP: ${response.statusCode} - ${response.statusMessage}`));
        return;
      }
      
      const chunks = [];
      let totalBytes = 0;
      
      response.on('data', (chunk) => {
        chunks.push(chunk);
        totalBytes += chunk.length;
      });
      
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        console.log(`✅ Descarga completa: ${buffer.length} bytes`);
        resolve(buffer);
      });
      
      response.on('error', (error) => {
        console.error(`❌ Error en respuesta: ${error.message}`);
        reject(error);
      });
    });
    
    request.setTimeout(60000, () => {
      console.error(`⏰ Timeout en descarga de: ${url}`);
      request.destroy();
      reject(new Error('Timeout en descarga de imagen'));
    });
    
    request.on('error', (error) => {
      console.error(`❌ Error en solicitud: ${error.message}`);
      
      // Detectar errores específicos de certificados SSL/TLS
      if (error.code === 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY' || 
          error.code === 'SELF_SIGNED_CERT_IN_CHAIN' ||
          error.message.includes('certificate')) {
        console.error(`🔒 ERROR DE CERTIFICADOS SSL/TLS DETECTADO`);
        console.error(`💡 SOLUCIÓN: Instala certificados CA en tu sistema Linux:`);
        console.error(`   sudo apt-get update && sudo apt-get install ca-certificates`);
        console.error(`   sudo update-ca-certificates`);
      }
      
      reject(error);
    });
  });
}

// Base de datos de personajes coleccionables
const personajesAnime = [
  // Dragon Ball Super
  {
    id: 'goku_ui',
    nombre: 'Son Goku Ultra Instinct',
    anime: 'Dragon Ball Super',
    rareza: 'Legendario',
    valor: 75000,
    poder: 999999,
    nivel: 'Dios',
    descripcion: '🔥 La transformación más poderosa de Goku. Ha dominado el Ultra Instinto Perfecto, una técnica que ni los dioses pueden dominar fácilmente. Su cuerpo se mueve automáticamente sin necesidad de pensamiento.',
    habilidades: ['Ultra Instinto', 'Kamehameha Definitivo', 'Velocidad Divina'],
    imagenUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    probabilidad: 0.02 // 2%
  },
  {
    id: 'goku_ssb',
    nombre: 'Son Goku Super Saiyan Blue',
    anime: 'Dragon Ball Super', 
    rareza: 'Épico',
    valor: 35000,
    poder: 850000,
    nivel: 'Dios',
    descripcion: '💙 Goku en Super Saiyan Blue (Super Saiyan God Super Saiyan). Combina el poder del Super Saiyan con la energía divina del Super Saiyan God. Control perfecto del ki divino.',
    habilidades: ['Super Kamehameha Blue', 'Kaioken x20', 'Teletransportación'],
    imagenUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
    probabilidad: 0.08 // 8%
  },
  {
    id: 'vegeta_ssb',
    nombre: 'Vegeta Super Saiyan Blue',
    anime: 'Dragon Ball Super',
    rareza: 'Épico', 
    valor: 32000,
    poder: 820000,
    nivel: 'Dios',
    descripcion: '👑 El Príncipe de los Saiyans en Super Saiyan Blue. Su orgullo y determinación lo han llevado al nivel divino. Maestro del Final Flash con poder celestial.',
    habilidades: ['Final Flash Blue', 'Big Bang Attack', 'Orgullo Saiyan'],
    imagenUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png',
    probabilidad: 0.10 // 10%
  },
  {
    id: 'vegeta_ue',
    nombre: 'Vegeta Ultra Ego',
    anime: 'Dragon Ball Super',
    rareza: 'Legendario',
    valor: 65000,
    poder: 950000,
    nivel: 'Dios Destructor',
    descripcion: '💜 Vegeta ha alcanzado el Ultra Ego, la contraparte destructiva del Ultra Instinto. Su poder aumenta con cada golpe recibido. Camino hacia Dios de la Destrucción.',
    habilidades: ['Ultra Ego', 'Hakai', 'Poder Destructivo Infinito'],
    imagenUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png',
    probabilidad: 0.03 // 3%
  },
  // One Punch Man
  {
    id: 'saitama_serio',
    nombre: 'Saitama Modo Serio',
    anime: 'One Punch Man',
    rareza: 'Legendario',
    valor: 100000,
    poder: 999999,
    nivel: 'Imparable',
    descripcion: '💀 Saitama cuando finalmente se toma las cosas en serio. Su poder no tiene límites conocidos. Un solo golpe serio puede destruir planetas enteros. El héroe más fuerte.',
    habilidades: ['Serious Punch', 'Serious Table Flip', 'Velocidad Infinita'],
    imagenUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png',
    probabilidad: 0.01 // 1%
  },
  {
    id: 'saitama_casual',
    nombre: 'Saitama (Héroe Calvo)',
    anime: 'One Punch Man',
    rareza: 'Raro',
    valor: 18000,
    poder: 500000,
    nivel: 'Clase S',
    descripcion: '🥚 El héroe más poderoso de todos, pero nadie lo reconoce. Puede derrotar cualquier enemigo con un solo golpe. Su mayor problema es que todo es muy aburrido para él.',
    habilidades: ['Normal Punch', 'Consecutive Normal Punches', 'Jump'],
    imagenUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
    probabilidad: 0.26 // 26%
  },
  {
    id: 'genos_upgrade',
    nombre: 'Genos Full Power',
    anime: 'One Punch Man',
    rareza: 'Común',
    valor: 12000,
    poder: 220000,
    nivel: 'Clase S',
    descripcion: '🤖 El Cyborg Demonio después de sus últimas mejoras. Discípulo devoto de Saitama. Sus partes robóticas son de última generación y su determinación es inquebrantable.',
    habilidades: ['Incineration Cannon', 'Machine Gun Blow', 'Rocket Punch'],
    imagenUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/142.png',
    probabilidad: 0.50 // 50%
  }
];

// Función para obtener personaje aleatorio basado en probabilidades
function obtenerPersonajeAleatorio() {
  const random = Math.random();
  let acumulado = 0;
  
  // Ordenar por probabilidad (más raros primero)
  const personajesOrdenados = [...personajesAnime].sort((a, b) => a.probabilidad - b.probabilidad);
  
  for (const personaje of personajesOrdenados) {
    acumulado += personaje.probabilidad;
    if (random <= acumulado) {
      return personaje;
    }
  }
  
  // Fallback al último personaje (más común)
  return personajesOrdenados[personajesOrdenados.length - 1];
}

// Base de datos
let usuarios = {};
if (fs.existsSync("usuarios.json")) {
  usuarios = JSON.parse(fs.readFileSync("usuarios.json"));
  guardarBD();
}
function guardarBD() {
  fs.writeFileSync("usuarios.json", JSON.stringify(usuarios, null, 2));
}

// Sistema de rangos (simplificado por poder, ajusta valores a gusto)
function obtenerRangoClasificacion(poder) {
  if (poder < 500) return { rango: "Callejero", clasificacion: "C" };
  if (poder < 1500) return { rango: "Callejero", clasificacion: "B" };
  if (poder < 2500) return { rango: "Callejero", clasificacion: "A" };

  if (poder < 4000) return { rango: "Héroe", clasificacion: "C" };
  if (poder < 6000) return { rango: "Héroe", clasificacion: "B" };
  if (poder < 8000) return { rango: "Héroe", clasificacion: "A" };

  if (poder < 11000) return { rango: "Continental", clasificacion: "B" };
  if (poder < 15000) return { rango: "Continental", clasificacion: "A" };
  if (poder < 20000) return { rango: "Continental", clasificacion: "S" };

  if (poder < 30000) return { rango: "Planetario", clasificacion: "D" };
  if (poder < 45000) return { rango: "Planetario", clasificacion: "C" };
  if (poder < 60000) return { rango: "Planetario", clasificacion: "B" };
  if (poder < 80000) return { rango: "Planetario", clasificacion: "A" };
  if (poder < 100000) return { rango: "Planetario", clasificacion: "S" };

  if (poder < 150000) return { rango: "Estelar", clasificacion: "B" };
  if (poder < 200000) return { rango: "Estelar", clasificacion: "A" };
  if (poder < 300000) return { rango: "Estelar", clasificacion: "S" };

  if (poder < 400000) return { rango: "Universal", clasificacion: "A" };
  if (poder < 500000) return { rango: "Universal", clasificacion: "S" };

  if (poder < 700000) return { rango: "Infinity", clasificacion: "A" };
  if (poder < 900000) return { rango: "Infinity", clasificacion: "S" };

  if (poder < 1200000) return { rango: "Celestial", clasificacion: "S" };
  if (poder < 1500000) return { rango: "Eterno", clasificacion: "S" };
  if (poder < 2000000) return { rango: "Sester", clasificacion: "B" };
  if (poder < 2500000) return { rango: "Sester", clasificacion: "A" };
  if (poder < 3000000) return { rango: "Sester", clasificacion: "S" };

  if (poder < 4000000) return { rango: "Eterniti", clasificacion: "S" };
  if (poder < 5000000) return { rango: "Eterniun", clasificacion: "C" };
  if (poder < 6000000) return { rango: "Eterniun", clasificacion: "B" };
  if (poder < 7000000) return { rango: "Eterniun", clasificacion: "A" };
  return { rango: "Eterniun", clasificacion: "S" };
}

// Función para formatear números grandes
function formatearNumero(num) {
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(1) + 'B';
  } else if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'MM';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

// Función para procesar inversiones pendientes
function procesarInversiones(user, userId) {
  if (!user.inversionesPendientes || user.inversionesPendientes.length === 0) {
    return [];
  }

  const ahora = Date.now();
  const inversionesListas = [];
  const inversionesRestantes = [];

  for (const inversion of user.inversionesPendientes) {
    if (ahora >= inversion.vencimiento) {
      inversionesListas.push(inversion);
      user.dinero += inversion.retorno;
    } else {
      inversionesRestantes.push(inversion);
    }
  }

  user.inversionesPendientes = inversionesRestantes;

  if (inversionesListas.length > 0) {
    guardarBD();
  }

  return inversionesListas;
}

// Administradores supremos
const ADMIN_SUPREMO = "5492915268762@s.whatsapp.net";
const ADMIN_SECUNDARIO = "5492915207066@s.whatsapp.net";

// Base de datos de admins supremos
let adminsSupremos = {};
if (fs.existsSync("admins.json")) {
  adminsSupremos = JSON.parse(fs.readFileSync("admins.json"));
}
function guardarAdmins() {
  fs.writeFileSync("admins.json", JSON.stringify(adminsSupremos, null, 2));
}

// Control de reconexión para evitar múltiples sockets
let isReconnecting = false;
let currentSocket = null;
let pairingRequested = false;
let salesVerifierInterval = null;

async function startBot() {
  // Limpiar socket anterior si existe
  if (currentSocket) {
    currentSocket.ev.removeAllListeners();
    currentSocket.end();
  }

  // Limpiar interval anterior si existe
  if (salesVerifierInterval) {
    clearInterval(salesVerifierInterval);
    salesVerifierInterval = null;
  }

  // Resetear flag de emparejamiento para nueva sesión
  pairingRequested = false;

  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const sock = makeWASocket({ 
    auth: state,
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: false
  });

  currentSocket = sock;

  sock.ev.on("creds.update", saveCreds);

  // Manejo de conexión y código de emparejamiento
  // Solicitar código de emparejamiento una sola vez
  if (!sock.authState.creds.registered && !pairingRequested) {
    pairingRequested = true;
    console.log("\n🔗 Generando código de emparejamiento...");
    console.log("📱 Ve a WhatsApp > Configuración > Dispositivos vinculados > Vincular dispositivo");
    console.log("💡 Cuando te pida el código, úsalo para vincular este bot\n");

    try {
      // Esperar un momento para estabilizar conexión
      await new Promise(resolve => setTimeout(resolve, 2000));
      const pairingCode = await sock.requestPairingCode("5492915268762");
      console.log("🎯 CÓDIGO DE EMPAREJAMIENTO: " + pairingCode);
      console.log("💬 Usa este código en WhatsApp para vincular el bot a tu cuenta\n");
      console.log("📝 PASOS:");
      console.log("1. Abre WhatsApp en tu teléfono");
      console.log("2. Ve a Configuración > Dispositivos vinculados");
      console.log("3. Toca 'Vincular dispositivo'");
      console.log("4. Ingresa el código: " + pairingCode);
    } catch (error) {
      console.log("❌ Error generando código:", error.message);
      pairingRequested = false; // Permitir reintentar
    }
  }

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log("❌ Conexión cerrada debido a:", lastDisconnect?.error);

      // Limpiar interval de ventas automáticas al cerrar conexión
      if (salesVerifierInterval) {
        clearInterval(salesVerifierInterval);
        salesVerifierInterval = null;
      }

      if (statusCode === 401) {
        console.log("🔐 Sesión expirada, limpiando autenticación...");
        pairingRequested = false; // Permitir nueva solicitud de código
      } else if (!isReconnecting) {
        console.log("🔄 Reconectando...");
        isReconnecting = true;
        setTimeout(() => {
          isReconnecting = false;
          startBot();
        }, 3000);
      }
    } else if (connection === "open") {
      console.log("✅ ¡Bot conectado exitosamente a WhatsApp!");
      isReconnecting = false;

      // Iniciar verificador de ventas automáticas solo si no existe
      if (!salesVerifierInterval) {
        salesVerifierInterval = setInterval(() => {
        const ahora = Date.now();
        let ventasRealizadas = false;

        Object.entries(usuarios).forEach(([userId, user]) => {
          if (user.ventasPendientes && user.ventasPendientes.length > 0) {
            const ventasOriginales = user.ventasPendientes.length;
            user.ventasPendientes = user.ventasPendientes.filter(venta => {
              if (ahora >= venta.tiempoVenta) {
                if (venta.item === 'onzaOro' && user.inventario && user.inventario.onzaOro > 0) {
                  user.inventario.onzaOro -= 1;
                  user.dinero += venta.precio;
                  ventasRealizadas = true;

                  // Notificar al usuario de la venta automática
                  try {
                    if (currentSocket === sock) {
                      sock.sendMessage(userId, {
                        text: `◈ ¡Venta automática ejecutada!\n\n◆ Item vendido: *Onza de Oro*\n◈ Precio recibido: *$${venta.precio.toLocaleString()}*\n◉ El bot compró tu onza de oro automáticamente\n◊ Tus coins universal: *$${user.dinero.toLocaleString()}*`
                      });
                    }
                  } catch (error) {
                    console.log("Error enviando notificación de venta automática:", error);
                  }
                }
                return false;
              }
              return true;
            });

            if (user.ventasPendientes.length !== ventasOriginales) {
              ventasRealizadas = true;
            }
          }
        });

        // Solo guardar BD si se realizaron ventas
        if (ventasRealizadas) {
          guardarBD();
        }
      }, 60000);
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const chatId = msg.key.remoteJid;
    const senderId = msg.key.participant || chatId;

    // Ignorar mensajes de sistema/estado
    if (chatId.includes("status@broadcast") || chatId.includes("@newsletter")) return;

    const body = msg.message.conversation || 
                 msg.message.extendedTextMessage?.text ||
                 msg.message.imageMessage?.caption ||
                 msg.message.videoMessage?.caption;
    if (!body) return;

    // Solo responder a comandos que empiecen con #
    if (!body.startsWith("#")) return;

    // Registrar usuario (por remitente, no por chat)
    if (!usuarios[senderId]) {
      usuarios[senderId] = {
        nombre: senderId.split("@")[0],
        nivel: 1,
        poder: 100,
        rayo: null,
        ultimaDaily: 0,
        ultimoEntrenamiento: 0,
        coinsUniversal: 0,
        dinero: 1000,
        banco: 0,
        ultimoTrabajo: 0,
        ultimoRobo: 0,
        ultimaApuesta: 0,
        ultimaInversion: 0,
        ultimaMineria: 0,
        negocio: null,
        ultimoNegocio: 0,
        multiplicadorTrabajo: 0,
        inversionesPendientes: [],
        descripcion: null,
        genero: null,
        cumpleanos: null,
        ruletaChallenge: null,
        coleccionables: [],
        ultimoColeccionable: 0,
        personajeDisponible: null,
        mensajePersonajeId: null
      };
      guardarBD();
    }

    let user = usuarios[senderId];

    // Asegurar compatibilidad con usuarios existentes
    if (!user.ultimoEntrenamiento) {
      user.ultimoEntrenamiento = 0;
    }
    if (!user.hasOwnProperty('coinsUniversal')) {
      user.coinsUniversal = 0;
    }
    if (!user.hasOwnProperty('dinero')) {
      user.dinero = 1000;
    }
    if (!user.hasOwnProperty('ultimoTrabajo')) {
      user.ultimoTrabajo = 0;
    }
    if (!user.hasOwnProperty('ultimoRobo')) {
      user.ultimoRobo = 0;
    }
    if (!user.hasOwnProperty('multiplicadorTrabajo')) {
      user.multiplicadorTrabajo = 0;
    }
    if (!user.hasOwnProperty('ultimaApuesta')) {
      user.ultimaApuesta = 0;
    }
    if (!user.hasOwnProperty('ultimaInversion')) {
      user.ultimaInversion = 0;
    }
    if (!user.hasOwnProperty('negocio')) {
      user.negocio = null;
    }
    if (!user.hasOwnProperty('ultimoNegocio')) {
      user.ultimoNegocio = 0;
    }
    if (!user.hasOwnProperty('ultimaMineria')) {
      user.ultimaMineria = 0;
    }
    if (!user.hasOwnProperty('inversionesPendientes')) {
      user.inversionesPendientes = [];
    }
    if (!user.hasOwnProperty('descripcion')) {
      user.descripcion = null;
    }
    if (!user.hasOwnProperty('genero')) {
      user.genero = null;
    }
    if (!user.hasOwnProperty('cumpleanos')) {
      user.cumpleanos = null;
    }
    if (!user.hasOwnProperty('banco')) {
      user.banco = 0;
    }
    if (!user.hasOwnProperty('ruletaChallenge')) {
      user.ruletaChallenge = null;
    }
    if (!user.hasOwnProperty('coleccionables')) {
      user.coleccionables = [];
    }
    if (!user.hasOwnProperty('ultimoColeccionable')) {
      user.ultimoColeccionable = 0;
    }
    if (!user.hasOwnProperty('personajeDisponible')) {
      user.personajeDisponible = null;
    }
    if (!user.hasOwnProperty('mensajePersonajeId')) {
      user.mensajePersonajeId = null;
    }

    // Procesar inversiones pendientes automáticamente
    const inversionesCompletadas = procesarInversiones(user, senderId);
    if (inversionesCompletadas.length > 0) {
      const totalGanado = inversionesCompletadas.reduce((total, inv) => total + inv.retorno, 0);
      await sock.sendMessage(chatId, { 
        text: `◈ ¡Inversiones completadas!\n\n◉ Inversiones procesadas: ${inversionesCompletadas.length}\n▲ Total ganado: *$${totalGanado.toLocaleString()}* coins universal\n◉ Balance actual: *$${user.dinero.toLocaleString()}*`
      }, {
        quoted: msg
      });
    }

    // #menu - Menu con comandos de economía
    if (body.startsWith("#menu") || body.startsWith("#help")) {
      const menu = `◆ ═══════════════════ ◆
        ★ SUPREME BOT ★
◆ ═══════════════════ ◆


» ═══ COMANDOS BÁSICOS ═══ «

  [?] #menu ➤ Mostrar este menú
  [?] #com ➤ Ver comandos por categorías
  [R] #registrar [nombre] ➤ Cambiar nombre
  [P] #perfil ➤ Ver tu perfil completo
  [T] #rank ➤ Top 10 usuarios más fuertes
  [I] #info ➤ Información del grupo


» ═══ PERSONALIZACIÓN ═══ «

  [D] #setdesc [texto] ➤ Establecer descripción
  [G] #setgenero [género] ➤ Establecer género
  [B] #setcumple [fecha] ➤ Establecer cumpleaños


» ═══ ENTRENAMIENTO ═══ «

  [E] #entrenar ➤ Entrenar poder
  [+] #daily ➤ Recompensa diaria de poder


» ═══════ ECONOMÍA ═══════ «

  [W] #trabajar ➤ Ganar coins universal
  [S] #robar ➤ Actividades ilegales
  [$] #bal ➤ Ver tu balance actual
  [>] #d [cantidad] ➤ Depositar al banco
  [<] #retirar [cantidad] ➤ Retirar del banco
  [T] #tienda ➤ Ver items disponibles
  [C] #comprar [número/item] ➤ Comprar items de la tienda
  [V] #inventario ➤ Ver y vender inventario
  [%] #apostar [cantidad] ➤ Apostar coins universal
  [^] #invertir [cantidad] ➤ Invertir a largo plazo
  [B] #negocio ➤ Crear/reclamar negocio
  [M] #minar ➤ Minar en cuevas


» ═══════ COMBATE ═══════ «

  [X] #duelo @usuario ➤ Desafiar a otro usuario
  [O] #ruleta @usuario [cantidad] ➤ Ruleta rusa con apuesta


» ═══ COLECCIONABLES ═══ «

  [?] #colec ➤ Ver personaje aleatorio de anime
  [!] #re ➤ Reclamar personaje mostrado
  [L] #colecciones ➤ Ver tus personajes reclamados


» ═══ UTILIDADES ═══ «

  [#] #sticker ➤ Crear sticker


» ═══════ STATUS ═══════ «

  Estado ➤ ACTIVO
  Versión ➤ v4.0
  Bot ➤ SUPREME
  Creado por ➤ L

◆ ═══════════════════ ◆`;

      await sock.sendMessage(chatId, { text: menu }, { quoted: msg });
    }

    // #com - Comandos por categorías
    if (body.startsWith("#com")) {
      const args = body.split(" ");

      if (args.length < 2) {
        const categorias = `◆ ═══════════════════ ◆
      » CATEGORÍAS DE COMANDOS «
◆ ═══════════════════ ◆

[1] *#com basicos* - Comandos básicos
[2] *#com personalizacion* - Personalizar perfil
[3] *#com entrenamiento* - Entrenar y subir poder
[4] *#com economia* - Sistema económico
[5] *#com combate* - Duelos y batallas
[6] *#com utilidades* - Herramientas útiles
[7] *#com admin* - Comandos de administrador

» *Ejemplo:* #com economia

◆ ═══════════════════ ◆`;

        await sock.sendMessage(chatId, { text: categorias }, { quoted: msg });
        return;
      }

      const categoria = args[1].toLowerCase();
      let menuCategoria = "";

      switch (categoria) {
        case "basicos":
        case "básicos":
        case "basic":
          menuCategoria = `[1] *COMANDOS BÁSICOS*

[?] #menu ➤ Mostrar menú completo
[?] #com ➤ Ver comandos por categorías
[R] #registrar [nombre] ➤ Cambiar tu nombre
[P] #perfil ➤ Ver tu perfil completo
[T] #rank ➤ Top 10 usuarios más fuertes
[I] #info ➤ Información del grupo

» *Usa #com [categoría] para ver otros comandos*`;
          break;

        case "personalizacion":
        case "personalización":
        case "perfil":
          menuCategoria = `[2] *PERSONALIZACIÓN*

[D] #setdesc [texto] ➤ Establecer descripción personal
[G] #setgenero [género] ➤ Establecer tu género
[B] #setcumple [fecha] ➤ Establecer tu cumpleaños

*Géneros disponibles:*
• masculino, femenino, no binario
• prefiero no decir, otro

» *Ejemplo:* #setdesc Me gusta programar`;
          break;

        case "entrenamiento":
        case "entrenar":
        case "poder":
          menuCategoria = `[3] *ENTRENAMIENTO Y PODER*

[E] #entrenar ➤ Entrenar para ganar poder
[+] #daily ➤ Recompensa diaria de poder
[T] #tienda ➤ Comprar items de poder
[C] #comprar [item] ➤ Comprar de la tienda

*Sistema de Rangos:*
• Callejero → Héroe → Continental
• Planetario → Estelar → Universal
• Infinity → Celestial → Eterno → Sester
• Eterniti → Eterniun

» *Entrena cada 30 minutos para subir de poder*`;
          break;

        case "economia":
        case "economía":
        case "dinero":
        case "money":
          menuCategoria = `[4] *SISTEMA ECONÓMICO*

[$] #bal ➤ Ver tu balance actual
[W] #trabajar ➤ Ganar coins universal
[S] #robar ➤ Actividades ilegales (riesgo)
[>] #d [cantidad] ➤ Depositar al banco
[<] #retirar [cantidad] ➤ Retirar del banco
[%] #apostar [cantidad] ➤ Apostar en el casino
[^] #invertir [cantidad] ➤ Inversiones a largo plazo
[B] #negocio ➤ Crear/reclamar negocio
[M] #minar ➤ Explorar cuevas (items raros)
[V] #inventario ➤ Ver y vender items

» *Tip:* Invierte para ganancias garantizadas`;
          break;

        case "combate":
        case "pelea":
        case "batalla":
          menuCategoria = `[5] *COMBATE Y BATALLAS*

[X] #duelo @usuario ➤ Desafiar a otro usuario
[O] #ruleta @usuario [cantidad] ➤ Ruleta rusa con apuesta

*Reglas de Duelo:*
• Ganador aleatorio basado en poder
• Recompensa de poder para el ganador
• Sin pérdidas para el perdedor

*Reglas de Ruleta:*
• 50% probabilidad cada uno
• Ganador se lleva toda la apuesta
• Ambos deben tener el dinero

» *Los duelos dan poder, la ruleta da dinero*`;
          break;

        case "coleccionables":
        case "anime":
        case "cartas":
          menuCategoria = `[6] *COLECCIONABLES ANIME*

[?] #colec ➤ Ver personaje aleatorio de anime
[!] #re ➤ Reclamar personaje mostrado
[L] #colecciones ➤ Ver tus personajes reclamados

*Personajes Disponibles:*
• Dragon Ball Super (Goku, Vegeta)
• One Punch Man (Saitama, Genos)

*Rareza y Probabilidades:*
• 🟢 Común (25%) - Valor: $8,000
• 🔵 Raro (15%) - Valor: $15,000
• 🟣 Épico (5-6%) - Valor: $22,000-25,000
• 🟡 Legendario (0.5-2%) - Valor: $45,000-100,000

*Cooldown:* 30 minutos entre coleccionables
» *¡Colecciona personajes únicos de anime!*`;
          break;

        case "utilidades":
        case "herramientas":
        case "tools":
          menuCategoria = `[7] *UTILIDADES*

[#] #sticker ➤ Crear stickers de imágenes/videos
    • Responde a una imagen con #sticker
    • O envía imagen con caption #sticker

*Formatos soportados:*
• IMG Imágenes (JPG, PNG, WEBP)
• VID Videos (MP4) - máx 5 segundos
• GIF GIFs - máx 3 segundos

» *Envía media + "#sticker" para convertir*`;
          break;

        case "admin":
        case "administrador":
          if (senderId === ADMIN_SUPREMO || senderId === ADMIN_SECUNDARIO) {
            menuCategoria = `[7] *COMANDOS DE ADMINISTRADOR*

[+] #addpower @usuario [cantidad] ➤ Dar poder
[$] #addmoney @usuario [cantidad] ➤ Dar dinero
[!] #resetuser @usuario ➤ Resetear usuario

*Solo para administradores supremos*
• Poder ilimitado para gestionar usuarios
• Resetear estadísticas si es necesario

» *Usa con responsabilidad*`;
          } else {
            menuCategoria = `[X] *ACCESO DENEGADO*

[!] Solo administradores supremos pueden ver estos comandos.

» *Usa #com para ver otras categorías disponibles*`;
          }
          break;

        default:
          menuCategoria = `[?] *Categoría no encontrada*

» *Categorías disponibles:*
• basicos, personalizacion, entrenamiento
• economia, combate, utilidades, admin

» *Ejemplo:* #com economia`;
          break;
      }

      await sock.sendMessage(chatId, { text: menuCategoria }, { quoted: msg });
    }

    // #registrar - Cambiar nombre
    if (body.startsWith("#registrar ")) {
      const nombreNuevo = body.split(" ").slice(1).join(" ").trim();
      if (!nombreNuevo || nombreNuevo.length < 2) {
        await sock.sendMessage(chatId, { text: "❌ Usa un nombre válido\n💡 Ejemplo: #registrar Mi Nombre" }, { quoted: msg });
        return;
      }

      if (nombreNuevo.length > 25) {
        await sock.sendMessage(chatId, { text: "❌ Nombre muy largo. Máximo 25 caracteres." }, { quoted: msg });
        return;
      }

      user.nombre = nombreNuevo;
      guardarBD();
      await sock.sendMessage(chatId, { text: `✅ Tu nuevo nombre es: *${nombreNuevo}*` }, { quoted: msg });
    }

    // #setdesc - Establecer descripción
    if (body.startsWith("#setdesc ")) {
      const descripcion = body.split(" ").slice(1).join(" ").trim();
      if (!descripcion || descripcion.length < 1) {
        await sock.sendMessage(chatId, { text: "❌ Usa una descripción válida\n💡 Ejemplo: #setdesc Me gusta programar" }, { quoted: msg });
        return;
      }

      if (descripcion.length > 100) {
        await sock.sendMessage(chatId, { text: "❌ Descripción muy larga. Máximo 100 caracteres." }, { quoted: msg });
        return;
      }

      user.descripcion = descripcion;
      guardarBD();
      await sock.sendMessage(chatId, { text: `✅ Tu descripción es: *${descripcion}*` }, { quoted: msg });
    }

    // #setgenero - Establecer género
    if (body.startsWith("#setgenero ")) {
      const genero = body.split(" ").slice(1).join(" ").trim().toLowerCase();
      const generosValidos = ['masculino', 'femenino', 'no binario', 'prefiero no decir', 'otro'];

      if (!genero || !generosValidos.includes(genero)) {
        await sock.sendMessage(chatId, { 
          text: "❌ Género no válido\n\n💡 Opciones disponibles:\n• masculino\n• femenino\n• no binario\n• prefiero no decir\n• otro\n\n📝 Ejemplo: #setgenero masculino", 
          quoted: msg 
        });
        return;
      }

      user.genero = genero;
      guardarBD();
      await sock.sendMessage(chatId, { text: `✅ Tu género es: *${genero}*` }, { quoted: msg });
    }

    // #setcumple - Establecer cumpleaños
    if (body.startsWith("#setcumple ")) {
      const cumpleanos = body.split(" ").slice(1).join(" ").trim();
      if (!cumpleanos || cumpleanos.length < 1) {
        await sock.sendMessage(chatId, { text: "❌ Usa una fecha válida\n💡 Ejemplo: #setcumple 15 de Mayo" }, { quoted: msg });
        return;
      }

      if (cumpleanos.length > 50) {
        await sock.sendMessage(chatId, { text: "❌ Fecha muy larga. Máximo 50 caracteres." }, { quoted: msg });
        return;
      }

      user.cumpleanos = cumpleanos;
      guardarBD();
      await sock.sendMessage(chatId, { text: `✅ Tu cumpleaños es: *${cumpleanos}*` }, { quoted: msg });
    }

    // #sticker - Crear sticker avanzado con soporte para videos/GIFs y media directa
    if (body.startsWith("#sticker")) {
      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const args = body.split(" ").slice(1).join(" ").trim();

      // Verificar si el mensaje actual tiene media con "#sticker" en el caption
      const currentImageMsg = msg.message.imageMessage;
      const currentVideoMsg = msg.message.videoMessage;
      const currentGifMsg = msg.message.gifMessage;

      let sourceMsg = null;
      let sourceMsgFull = null;
      let imageMsg = null;
      let videoMsg = null;
      let gifMsg = null;
      let processingMethod = "";

      // Prioritizar media directa si contiene "#sticker" en el caption
      if ((currentImageMsg || currentVideoMsg || currentGifMsg) && body.includes("#sticker")) {
        sourceMsg = msg.message;
        sourceMsgFull = msg;
        imageMsg = currentImageMsg;
        videoMsg = currentVideoMsg;
        gifMsg = currentGifMsg;
        processingMethod = "directo";
      } else if (quotedMsg) {
        // Usar mensaje citado como método de respaldo
        sourceMsg = quotedMsg;
        sourceMsgFull = {
          key: {
            remoteJid: chatId,
            id: msg.message.extendedTextMessage.contextInfo.stanzaId,
            participant: msg.message.extendedTextMessage.contextInfo.participant
          },
          message: quotedMsg
        };
        imageMsg = quotedMsg.imageMessage;
        videoMsg = quotedMsg.videoMessage;
        gifMsg = quotedMsg.gifMessage || quotedMsg.documentMessage;
        processingMethod = "respuesta";
      }

      // Si no hay media directa ni citada, mostrar ayuda
      if (!sourceMsg) {
        await sock.sendMessage(chatId, { 
          text: "🎨 *Creador de Stickers Avanzado*\n\n💡 *Dos formas de usar:*\n\n**1. Media Directa:**\n• Envía una imagen/video/GIF con \"#sticker\" en el caption\n• Ejemplo: Envía una foto con caption \"#sticker mi sticker genial\"\n\n**2. Responder a Media:**\n• Responde a una imagen, video o GIF con #sticker\n• Ejemplo: Responde con \"#sticker descripción opcional\"\n\n✨ *Formatos soportados:*\n• 🖼️ Imágenes (JPG, PNG, WEBP)\n• 🎥 Videos (MP4, MOV) - máx 5 segundos\n• 🎭 GIFs animados - máx 3 segundos\n\n🎯 *Pack personalizado:* Bot Supreme - Hecho por: [tu nombre]", 
          quoted: msg 
        });
        return;
      }

      if (!imageMsg && !videoMsg && !gifMsg) {
        await sock.sendMessage(chatId, { 
          text: "❌ Formato no soportado\n\n✅ *Formatos válidos:*\n• 🖼️ Imágenes (JPG, PNG)\n• 🎥 Videos (MP4, MOV)\n• 🎭 GIFs animados\n\n💡 Usa #sticker con media válida", 
          quoted: msg 
        });
        return;
      }

      try {
        await sock.sendMessage(chatId, { text: `🎨 Procesando sticker (método ${processingMethod})...` }, { quoted: msg });

        // Descargar el contenido
        const buffer = await downloadMediaMessage(sourceMsgFull, 'buffer', {});
        const username = user.nombre || senderId.split("@")[0];

        let stickerBuffer;

        if (imageMsg) {
          // Procesar imagen sin watermark visual
          stickerBuffer = await sharp(buffer)
            .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .webp()
            .toBuffer();

        } else if (videoMsg || gifMsg) {
          // Procesar video/GIF con FFmpeg sin watermark visual
          const tempInput = `temp_input_${Date.now()}.${videoMsg ? 'mp4' : 'gif'}`;
          const tempOutput = `temp_output_${Date.now()}.webp`;
          const escapedUsername = username.replace(/'/g, "\\'").replace(/:/g, "\\:");

          fs.writeFileSync(tempInput, buffer);

          await new Promise((resolve, reject) => {
            ffmpeg(tempInput)
              .inputOptions('-t 5') // Limitar a 5 segundos máximo
              .outputOptions([
                `-vf scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0`,
                '-vcodec libwebp',
                '-lossless 0',
                '-quality 75',
                '-preset picture',
                '-an', // Sin audio
                '-vsync 0',
                '-loop 0'
              ])
              .format('webp')
              .save(tempOutput)
              .on('end', () => {
                fs.unlinkSync(tempInput);
                resolve();
              })
              .on('error', (err) => {
                if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
                reject(err);
              });
          });

          stickerBuffer = fs.readFileSync(tempOutput);
          fs.unlinkSync(tempOutput);
        }

        // Crear metadata personalizada del sticker pack
        const stickerOptions = {
          sticker: stickerBuffer
        };

        await sock.sendMessage(chatId, stickerOptions, { quoted: msg });

        const tipoMedia = imageMsg ? "imagen" : (videoMsg ? "video" : "GIF");
        await sock.sendMessage(chatId, { 
          text: `✅ ¡Sticker creado exitosamente!\n\n🎨 *Procesado:* ${tipoMedia}\n👤 *Creado por:* ${username}\n📦 *Pack:* Bot Supreme\n⚡ *Método:* ${processingMethod}`
        }, {
          quoted: msg 
        });

      } catch (error) {
        console.error("Error creando sticker:", error);
        await sock.sendMessage(chatId, { 
          text: `❌ Error creando sticker\n\n💡 *Posibles causas:*\n• Archivo muy grande\n• Formato no compatible\n• Error de servidor\n\n🔄 Intenta con otro archivo`
        }, {
          quoted: msg 
        });
      }
    }

    // #daily - Recompensa diaria
    if (body.startsWith("#daily")) {
      const ahora = Date.now();
      const cooldown = 86400000; // 24 horas en milisegundos
      const tiempoRestante = user.ultimaDaily + cooldown - ahora;

      if (tiempoRestante > 0) {
        const horas = Math.floor(tiempoRestante / 3600000);
        const minutos = Math.floor((tiempoRestante % 3600000) / 60000);
        await sock.sendMessage(chatId, { 
          text: `◊ Ya reclamaste tu recompensa diaria\n※ Espera *${horas}h ${minutos}m* para reclamar nuevamente`,
          quoted: msg
        });
        return;
      }

      // Recompensa progresiva basada en nivel
      const poderBase = 500;
      const poderBonus = user.nivel * 50;
      const poderTotal = poderBase + poderBonus + Math.floor(Math.random() * 200);

      user.poder += poderTotal;
      user.ultimaDaily = ahora;
      user.nivel = Math.floor(user.poder / 1000) + 1;

      const coinsReward = Math.floor(Math.random() * 3000) + 1000;
      user.dinero += coinsReward;

      guardarBD();

      const { rango, clasificacion } = obtenerRangoClasificacion(user.poder);

      await sock.sendMessage(chatId, { 
        text: `◉ ¡Recompensa diaria reclamada!\n\n⚡ +${poderTotal.toLocaleString()} poder ganado\n💰 +$${coinsReward.toLocaleString()} coins universal\n◈ Poder total: ${user.poder.toLocaleString()}\n◊ Nivel: ${user.nivel}\n◉ Rango: ${rango} ${clasificacion}\n💰 Coins Universal: $${user.dinero.toLocaleString()}`,
        quoted: msg
      });
    }

    // #entrenar - Entrenar poder con cooldown
    if (body.startsWith("#entrenar") || body.startsWith("#train")) {
      const ahora = Date.now();
      const cooldown = 1800000; // 30 minutos en milisegundos
      const tiempoRestante = user.ultimoEntrenamiento + cooldown - ahora;

      if (tiempoRestante > 0) {
        const minutos = Math.ceil(tiempoRestante / 60000);
        await sock.sendMessage(chatId, { 
          text: `◊ Aún entrenando intensamente\n※ Podrás entrenar nuevamente en *${minutos}* minutos`,
          quoted: msg
        });
        return;
      }

      // Entrenamiento progresivo
      const poderGanado = Math.floor(Math.random() * 300) + 200 + (user.nivel * 10);
      user.poder += poderGanado;
      user.ultimoEntrenamiento = ahora;
      user.nivel = Math.floor(user.poder / 1000) + 1;

      guardarBD();

      const { rango, clasificacion } = obtenerRangoClasificacion(user.poder);

      await sock.sendMessage(chatId, { 
        text: `⚡ ¡Entrenamiento completado!\n\n◉ +${poderGanado.toLocaleString()} poder ganado\n◈ Poder total: ${user.poder.toLocaleString()}\n◊ Nivel: ${user.nivel}\n◉ Rango: ${rango} ${clasificacion}`,
        quoted: msg
      });
    }

    // #trabajar - Ganar coins universal con cooldown
    if (body.startsWith("#trabajar") || body.startsWith("#work")) {
      const ahora = Date.now();
      const cooldown = 3600000; // 1 hora en milisegundos
      const tiempoRestante = user.ultimoTrabajo + cooldown - ahora;

      if (tiempoRestante > 0) {
        const minutos = Math.ceil(tiempoRestante / 60000);
        await sock.sendMessage(chatId, { 
          text: `◊ Aún trabajando duro\n※ Podrás trabajar nuevamente en *${minutos}* minutos`,
          quoted: msg
        });
        return;
      }

      // Trabajos variables basados en nivel
      const trabajos = [
        "Repartir comida",
        "Lavar autos", 
        "Vigilancia nocturna",
        "Pintar casas",
        "Jardinería",
        "Construcción",
        "Programación",
        "Marketing digital"
      ];

      const trabajoRandom = trabajos[Math.floor(Math.random() * trabajos.length)];
      let gananciaBase = Math.floor(Math.random() * 2000) + 1000 + (user.nivel * 20);

      // Aplicar multiplicador si está activo
      if (user.multiplicadorTrabajo && ahora < user.multiplicadorTrabajo) {
        gananciaBase *= 2;
      }

      user.dinero += gananciaBase;
      user.ultimoTrabajo = ahora;

      // Probabilidad de encontrar coins universal extra (10%)
      let mensajeExtra = "";
      if (Math.random() < 0.1) {
        const bonusCoins = Math.floor(Math.random() * 500) + 200;
        user.dinero += bonusCoins;
        mensajeExtra = `\n◈ ¡BONUS! Encontraste *$${bonusCoins.toLocaleString()}* adicionales en el trabajo`;
      }

      guardarBD();

      const multiplicadorTexto = (user.multiplicadorTrabajo && ahora < user.multiplicadorTrabajo) ? "\n◈ ¡Multiplicador x2 aplicado!" : "";

      await sock.sendMessage(chatId, { 
        text: `◉ ¡Trabajo completado!\n\n◈ Trabajo: *${trabajoRandom}*\n▲ Ganaste: *$${gananciaBase.toLocaleString()}* coins universal${mensajeExtra}${multiplicadorTexto}\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*`,
        quoted: msg
      });
    }

    // #bal - Ver balance
    if (body.startsWith("#bal") || body.startsWith("#balance") || body.startsWith("#dinero")) {
      // Procesar inversiones pendientes
      const inversionesCompletadas = procesarInversiones(user, senderId);

      let inversionesTexto = "";
      if (user.inversionesPendientes && user.inversionesPendientes.length > 0) {
        const tiempoRestante = user.inversionesPendientes[0].vencimiento - Date.now();
        const minutosRestantes = Math.ceil(tiempoRestante / 60000);
        inversionesTexto = `\n◊ Inversiones pendientes: *${user.inversionesPendientes.length}*\n◉ Próxima inversión lista en: *${minutosRestantes}* minutos`;
      }

      await sock.sendMessage(chatId, { 
        text: `◈ *TU BALANCE FINANCIERO*\n\n💰 Coins Universal: *$${user.dinero.toLocaleString()}*\n🏦 En el banco: *$${user.banco.toLocaleString()}*\n◉ Total: *$${(user.dinero + user.banco).toLocaleString()}*${inversionesTexto}`,
        quoted: msg
      });
    }

    // #d - Depositar al banco
    if (body.startsWith("#d ")) {
      const args = body.split(" ");
      if (args.length < 2) {
        await sock.sendMessage(chatId, { 
          text: `◈ Uso correcto: *#d [cantidad]*\n\nEjemplo: *#d 1000*`,
          quoted: msg
        });
        return;
      }

      const cantidad = parseInt(args[1]);
      if (isNaN(cantidad) || cantidad <= 0) {
        await sock.sendMessage(chatId, { 
          text: `◈ Cantidad inválida\n\nDebe ser un número positivo`,
          quoted: msg
        });
        return;
      }

      if (user.dinero < cantidad) {
        await sock.sendMessage(chatId, { 
          text: `◈ No tienes suficientes coins universal\n\n◉ Tienes: *$${user.dinero.toLocaleString()}*\n◊ Quieres depositar: *$${cantidad.toLocaleString()}*`,
          quoted: msg
        });
        return;
      }

      user.dinero -= cantidad;
      user.banco += cantidad;
      guardarBD();

      await sock.sendMessage(chatId, { 
        text: `🏦 ¡Depósito exitoso!\n\n◉ Depositaste: *$${cantidad.toLocaleString()}*\n💰 Coins Universal: *$${user.dinero.toLocaleString()}*\n🏦 En el banco: *$${user.banco.toLocaleString()}*`,
        quoted: msg
      });
    }

    // #retirar - Retirar del banco
    if (body.startsWith("#retirar ")) {
      const args = body.split(" ");
      if (args.length < 2) {
        await sock.sendMessage(chatId, { 
          text: `◈ Uso correcto: *#retirar [cantidad]*\n\nEjemplo: *#retirar 1000*`,
          quoted: msg
        });
        return;
      }

      const cantidad = parseInt(args[1]);
      if (isNaN(cantidad) || cantidad <= 0) {
        await sock.sendMessage(chatId, { 
          text: `◈ Cantidad inválida\n\nDebe ser un número positivo`,
          quoted: msg
        });
        return;
      }

      if (user.banco < cantidad) {
        await sock.sendMessage(chatId, { 
          text: `◈ No tienes suficiente dinero en el banco\n\n🏦 En el banco: *$${user.banco.toLocaleString()}*\n◊ Quieres retirar: *$${cantidad.toLocaleString()}*`,
          quoted: msg
        });
        return;
      }

      user.banco -= cantidad;
      user.dinero += cantidad;
      guardarBD();

      await sock.sendMessage(chatId, { 
        text: `💰 ¡Retiro exitoso!\n\n◉ Retiraste: *$${cantidad.toLocaleString()}*\n💰 Coins Universal: *$${user.dinero.toLocaleString()}*\n🏦 En el banco: *$${user.banco.toLocaleString()}*`,
        quoted: msg
      });
    }

    // #robar - Actividades ilegales con riesgo
    if (body.startsWith("#robar") || body.startsWith("#rob")) {
      const ahora = Date.now();
      const cooldown = 7200000; // 2 horas en milisegundos
      const tiempoRestante = user.ultimoRobo + cooldown - ahora;

      if (tiempoRestante > 0) {
        const horas = Math.ceil(tiempoRestante / 3600000);
        await sock.sendMessage(chatId, { 
          text: `◊ Las autoridades te están vigilando\n※ Podrás hacer actividades ilegales en *${horas}* horas`,
          quoted: msg
        });
        return;
      }

      const exito = Math.random() > 0.3; // 70% de éxito

      if (exito) {
        const ganancia = Math.floor(Math.random() * 3000) + 1500 + (user.nivel * 30);
        user.dinero += ganancia;
        user.ultimoRobo = ahora;
        guardarBD();

        const actividades = [
          "robaste un banco",
          "hackeaste una empresa",
          "vendiste información",
          "robaste un auto de lujo",
          "estafaste una tienda"
        ];

        const actividadRandom = actividades[Math.floor(Math.random() * actividades.length)];

        await sock.sendMessage(chatId, { 
          text: `◈ ¡Robo exitoso!\n\n◉ Actividad: *${actividadRandom}*\n▲ Ganaste: *$${ganancia.toLocaleString()}* coins universal\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*\n◊ ¡Lograste escapar!`,
          quoted: msg
        });
      } else {
        const perdida = Math.floor(user.dinero * 0.1); // Pierde 10% de su dinero
        user.dinero = Math.max(0, user.dinero - perdida);
        user.ultimoRobo = ahora;
        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `❌ ¡Robo fallido!\n\n◉ Te atraparon robando\n▼ Perdiste: *$${perdida.toLocaleString()}* coins universal en multas\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*\n◊ ¡La próxima vez ten más cuidado!`,
          quoted: msg
        });
      }
    }

    // #apostar - Apostar coins universal
    if (body.startsWith("#apostar") || body.startsWith("#bet")) {
      const ahora = Date.now();
      const cooldown = 900000; // 15 minutos en milisegundos
      const tiempoRestante = user.ultimaApuesta + cooldown - ahora;

      if (tiempoRestante > 0) {
        const minutos = Math.ceil(tiempoRestante / 60000);
        await sock.sendMessage(chatId, { 
          text: `◊ Casino cerrado temporalmente\n※ Podrás apostar en *${minutos}* minutos`,
          quoted: msg
        });
        return;
      }

      const args = body.split(" ");
      if (args.length < 2) {
        await sock.sendMessage(chatId, { 
          text: `◈ Uso correcto: *#apostar [cantidad]*\n\nEjemplo: *#apostar 1000*\nMínimo: 100 coins universal`,
          quoted: msg
        });
        return;
      }

      const cantidad = parseInt(args[1]);
      if (isNaN(cantidad) || cantidad < 100) {
        await sock.sendMessage(chatId, { 
          text: `◈ Cantidad inválida\n\nMínimo: 100 coins universal`,
          quoted: msg
        });
        return;
      }

      if (user.dinero < cantidad) {
        await sock.sendMessage(chatId, { 
          text: `◈ No tienes suficientes coins universal\n\n◉ Tienes: *$${user.dinero.toLocaleString()}*\n◊ Necesitas: *$${cantidad.toLocaleString()}*`,
          quoted: msg
        });
        return;
      }

      user.ultimaApuesta = ahora;

      // 40% de ganar el doble, 60% de perder todo
      const gano = Math.random() < 0.4;

      if (gano) {
        const ganancia = cantidad * 2;
        user.dinero += ganancia;
        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `🎰 ¡GANASTE EN EL CASINO!\n\n◉ Apostaste: *$${cantidad.toLocaleString()}*\n▲ Ganaste: *$${ganancia.toLocaleString()}*\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*\n🎉 ¡Felicidades!`,
          quoted: msg
        });
      } else {
        user.dinero -= cantidad;
        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `🎰 ¡PERDISTE EN EL CASINO!\n\n◉ Apostaste: *$${cantidad.toLocaleString()}*\n▼ Perdiste: *$${cantidad.toLocaleString()}*\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*\n😢 ¡Mejor suerte la próxima vez!`,
          quoted: msg
        });
      }
    }

    // #invertir - Inversiones a largo plazo
    if (body.startsWith("#invertir") || body.startsWith("#invest")) {
      const ahora = Date.now();
      const cooldown = 1800000; // 30 minutos en milisegundos
      const tiempoRestante = user.ultimaInversion + cooldown - ahora;

      if (tiempoRestante > 0) {
        const minutos = Math.ceil(tiempoRestante / 60000);
        await sock.sendMessage(chatId, { 
          text: `◊ Espera tu próxima inversión\n※ Podrás invertir en *${minutos}* minutos`,
          quoted: msg
        });
        return;
      }

      const args = body.split(" ");
      if (args.length < 2) {
        await sock.sendMessage(chatId, { 
          text: `◈ Uso correcto: *#invertir [cantidad]*\n\nEjemplo: *#invertir 1000*\nMínimo: 500 coins universal`,
          quoted: msg
        });
        return;
      }

      const cantidad = parseInt(args[1]);
      if (isNaN(cantidad) || cantidad < 500) {
        await sock.sendMessage(chatId, { 
          text: `◈ Cantidad inválida\n\nMínimo: 500 coins universal`,
          quoted: msg
        });
        return;
      }

      if (user.dinero < cantidad) {
        await sock.sendMessage(chatId, { 
          text: `◈ No tienes suficientes coins universal\n\n◉ Tienes: *$${user.dinero.toLocaleString()}*\n◊ Necesitas: *$${cantidad.toLocaleString()}*`,
          quoted: msg
        });
        return;
      }

      user.dinero -= cantidad;
      user.ultimaInversion = ahora;

      // Inversión garantizada con retorno del 120-150% en 30 minutos
      const retorno = Math.floor(cantidad * (1.2 + Math.random() * 0.3));
      const vencimiento = ahora + 1800000; // 30 minutos

      // Agregar inversión pendiente al array
      user.inversionesPendientes.push({
        cantidad: cantidad,
        retorno: retorno,
        vencimiento: vencimiento
      });

      guardarBD();

      await sock.sendMessage(chatId, { 
        text: `◈ ¡Inversión realizada!\n\n◉ Invertiste: *$${cantidad.toLocaleString()}*\n▲ Retorno estimado: *$${retorno.toLocaleString()}*\n◊ Tiempo: 30 minutos\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*`,
        quoted: msg
      });
    }

    // #negocio - Crear/reclamar negocio para ingresos pasivos
    if (body.startsWith("#negocio")) {
      const ahora = Date.now();

      if (!user.negocio) {
        // Crear negocio
        if (user.dinero < 5000) {
          await sock.sendMessage(chatId, { 
            text: `◈ Necesitas *$5,000* coins universal para abrir un negocio\n\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*`,
            quoted: msg
          });
          return;
        }

        const negocios = [
          "Puesto de Tacos",
          "Tienda de Ropa", 
          "Cafetería",
          "Barbería",
          "Farmacia",
          "Panadería"
        ];

        const negocioRandom = negocios[Math.floor(Math.random() * negocios.length)];
        user.dinero -= 5000;
        user.negocio = negocioRandom;
        user.ultimoNegocio = ahora;
        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `◈ ¡Negocio creado!\n\n◉ Negocio: *${negocioRandom}*\n▲ Costo: $5,000 coins universal\n◉ Genera coins universal cada 2 horas\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*`,
          quoted: msg
        });
      } else {
        // Reclamar ganancias del negocio
        const cooldown = 7200000; // 2 horas en milisegundos
        const tiempoRestante = user.ultimoNegocio + cooldown - ahora;

        if (tiempoRestante > 0) {
          const horas = Math.ceil(tiempoRestante / 3600000);
          await sock.sendMessage(chatId, { 
            text: `◊ Tu *${user.negocio}* aún está trabajando\n\n◉ Ganancias listas en *${horas}* horas`,
            quoted: msg
          });
          return;
        }

        const ganancia = Math.floor(Math.random() * 800) + 400; // 400-1200
        user.dinero += ganancia;
        user.ultimoNegocio = ahora;
        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `◈ ¡Ganancias reclamadas!\n\n◉ Negocio: *${user.negocio}*\n▲ Ganaste: *$${ganancia.toLocaleString()}*\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*`,
          quoted: msg
        });
      }
    }

    // #minar - Explorar cuevas con posibilidad de encontrar items raros
    if (body.startsWith("#minar")) {
      const ahora = Date.now();
      const cooldown = 900000; // 15 minutos en milisegundos
      const tiempoRestante = user.ultimaMineria + cooldown - ahora;

      if (tiempoRestante > 0) {
        const minutos = Math.ceil(tiempoRestante / 60000);
        await sock.sendMessage(chatId, { 
          text: `◊ Aún explorando las cuevas\n※ Podrás explorar nuevamente en *${minutos}* minutos`,
          quoted: msg
        });
        return;
      }

      // Inicializar inventario si no existe
      if (!user.inventario) user.inventario = {};

      const profundidad = Math.floor(Math.random() * 1000) + 200;
      const ganancia = Math.floor(Math.random() * (30000 - 7000 + 1)) + 7000;

      user.dinero += ganancia;
      user.ultimaMineria = ahora;

      let mensaje = `◈ ¡Exploración completada!\n\n⛏️ Profundidad explorada: *${profundidad.toLocaleString()}m*\n▲ Tesoros encontrados: *$${ganancia.toLocaleString()}* coins universal\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*`;

      // Probabilidad de encontrar items raros
      const probabilidad = Math.random() * 100;

      if (probabilidad <= 0.1) {
        if (!user.inventario.diamante) user.inventario.diamante = 0;
        user.inventario.diamante += 1;

        mensaje += `\n\n※ ¡DESCUBRIMIENTO EXTRAORDINARIO!\n💎 ¡Encontraste un *DIAMANTE* en las profundidades!\n◈ Valor: *$10,600,767*\n◉ Usa #inventario diamante para venderlo`;

      } else if (probabilidad <= 2.1) {
        if (!user.inventario.onzaOro) user.inventario.onzaOro = 0;
        user.inventario.onzaOro += 1;

        // Configurar venta automática del bot en 1 hora
        const tiempoVenta = ahora + 3600000;
        if (!user.ventasPendientes) user.ventasPendientes = [];
        user.ventasPendientes.push({
          item: 'onzaOro',
          precio: 5145900,
          tiempoVenta: tiempoVenta
        });

        mensaje += `\n\n※ ¡DESCUBRIMIENTO RARO!\n🏺 ¡Encontraste una *ONZA DE ORO* enterrada!\n◈ Valor: *$5,145,900*\n◉ El bot la comprará automáticamente en 1 hora\n◊ O usa #inventario oro para venderla ahora`;
      }

      guardarBD();

      await sock.sendMessage(chatId, { 
        text: mensaje,
        quoted: msg
      });
    }

    // #vender - Vender items del inventario
    if (body.startsWith("#inventario")) {
      const args = body.split(" ");
      if (args.length < 2) {
        let inventarioTexto = `◈ *TU INVENTARIO*\n\n`;

        if (!user.inventario || Object.keys(user.inventario).length === 0) {
          inventarioTexto += `◊ Inventario vacío\n◉ Usa #minar para encontrar items raros`;
        } else {
          if (user.inventario.onzaOro && user.inventario.onzaOro > 0) {
            inventarioTexto += `◆ Onza de Oro: *${user.inventario.onzaOro}*\n   ※ Valor: *$5,145,900* c/u\n   ◉ Uso: *#inventario oro*\n\n`;
          }
          if (user.inventario.diamante && user.inventario.diamante > 0) {
            inventarioTexto += `◆ Diamante: *${user.inventario.diamante}*\n   ※ Valor: *$10,600,767* c/u\n   ◉ Uso: *#inventario diamante*\n\n`;
          }
        }

        await sock.sendMessage(chatId, { 
          text: inventarioTexto,
          quoted: msg
        });
        return;
      }

      const item = args[1].toLowerCase();

      if (item === "oro" || item === "onza") {
        if (!user.inventario || !user.inventario.onzaOro || user.inventario.onzaOro < 1) {
          await sock.sendMessage(chatId, { 
            text: `◊ No tienes onzas de oro\n◉ Usa #minar para encontrar una`,
            quoted: msg
          });
          return;
        }

        user.inventario.onzaOro -= 1;
        user.dinero += 5145900;

        // Eliminar venta pendiente si existe
        if (user.ventasPendientes) {
          user.ventasPendientes = user.ventasPendientes.filter(v => v.item !== 'onzaOro');
        }

        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `◈ ¡Venta exitosa!\n\n◆ Vendiste: *Onza de Oro*\n◈ Recibiste: *$5,145,900*\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*`,
          quoted: msg
        });

      } else if (item === "diamante") {
        if (!user.inventario || !user.inventario.diamante || user.inventario.diamante < 1) {
          await sock.sendMessage(chatId, { 
            text: `◊ No tienes diamantes\n◉ Usa #minar para encontrar uno`,
            quoted: msg
          });
          return;
        }

        user.inventario.diamante -= 1;
        user.dinero += 10600767;
        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `◈ ¡Venta extraordinaria!\n\n◆ Vendiste: *Diamante*\n◈ Recibiste: *$10,600,767*\n◉ Tus coins universal: *$${user.dinero.toLocaleString()}*`,
          quoted: msg
        });

      } else {
        await sock.sendMessage(chatId, { 
          text: `◊ Item no válido\n\n◉ Items vendibles:\n※ oro - Onza de oro\n※ diamante - Diamante\n\n◈ Usa solo: *#inventario* para ver tu inventario`,
          quoted: msg
        });
      }
    }

    // #tienda - Ver items disponibles para comprar
    if (body.startsWith("#tienda") || body.startsWith("#shop")) {
      const tienda = `◉ *TIENDA SUPREMA*

※ ITEMS DISPONIBLES ※

1. Pizza Energética → $75,000
   ➤ +25,000 poder instantáneo

2. Bebida Energética → $225,000
   ➤ +75,000 poder instantáneo

3. Vitamina Suprema → $650,000
   ➤ +200,000 poder instantáneo

4. Multiplicador x2 → $1,500,000
   ➤ Doble ganancia en #trabajar por 1 hora

5. Gema del Poder → $2,500,000
   ➤ +750,000 poder instantáneo

━━━━━━━━━━━━━━━━━━━━━━━━━━━

Compra rápida: *#comprar [número]*
Ejemplo: *#comprar 1* (para pizza)`;

      await sock.sendMessage(chatId, { text: tienda }, { quoted: msg });
    }

    // #comprar - Comprar items de la tienda
    if (body.startsWith("#comprar")) {
      const args = body.split(" ");
      if (args.length < 2) {
        await sock.sendMessage(chatId, { 
          text: `❌ Uso correcto: *#comprar [número/item]*\n\nEjemplo: *#comprar 1* o *#comprar pizza*\nUsa *#tienda* para ver items disponibles`,
          quoted: msg
        });
        return;
      }

      const item = args.slice(1).join(" ").toLowerCase();
      let itemData = null;

      // Definir items de la tienda
      const items = {
        "pizza": { nombre: "Pizza Energética", precio: 75000, poder: 25000, tipo: "poder" },
        "bebida": { nombre: "Bebida Energética", precio: 225000, poder: 75000, tipo: "poder" },
        "vitamina": { nombre: "Vitamina Suprema", precio: 650000, poder: 200000, tipo: "poder" },
        "multiplicador": { nombre: "Multiplicador x2", precio: 1500000, duracion: 3600000, tipo: "multiplicador" },
        "gema": { nombre: "Gema del Poder", precio: 2500000, poder: 750000, tipo: "poder" }
      };

      // Mapeo de números a items
      const numeroItems = {
        "1": "pizza",
        "2": "bebida", 
        "3": "vitamina",
        "4": "multiplicador",
        "5": "gema"
      };

      // Buscar item por número o nombre
      if (numeroItems[item]) {
        itemData = items[numeroItems[item]];
      } else {
        for (let key in items) {
          if (item.includes(key)) {
            itemData = items[key];
            break;
          }
        }
      }

      if (!itemData) {
        await sock.sendMessage(chatId, { 
          text: `❌ Item no encontrado\n\nUsa *#tienda* para ver items disponibles`,
          quoted: msg
        });
        return;
      }

      // Verificar si tiene dinero suficiente
      if (user.dinero < itemData.precio) {
        await sock.sendMessage(chatId, { 
          text: `◈ No tienes suficientes coins universal\n\n◉ Tienes: *$${user.dinero.toLocaleString()}*\n◎ Necesitas: *$${itemData.precio.toLocaleString()}*`,
          quoted: msg
        });
        return;
      }

      // Realizar compra
      user.dinero -= itemData.precio;

      if (itemData.tipo === "poder") {
        user.poder += itemData.poder;
        user.nivel = Math.floor(user.poder / 1000) + 1;

        const { rango, clasificacion } = obtenerRangoClasificacion(user.poder);
        await sock.sendMessage(chatId, { 
          text: `✅ ¡Compra exitosa!\n\n◉ ${itemData.nombre}\n⚡ +${itemData.poder.toLocaleString()} poder ganado\n◈ Poder total: ${user.poder.toLocaleString()}\n◊ Rango: ${rango} ${clasificacion}\n◈ Coins Universal: *$${user.dinero.toLocaleString()}*`,
          quoted: msg
        });
      } else if (itemData.tipo === "multiplicador") {
        user.multiplicadorTrabajo = Date.now() + itemData.duracion;
        await sock.sendMessage(chatId, { 
          text: `✅ ¡Compra exitosa!\n\n◉ ${itemData.nombre}\n▲ Ganarás el doble en #trabajar por 1 hora\n◈ Coins Universal: *$${user.dinero.toLocaleString()}*`,
          quoted: msg
        });
      }

      guardarBD();
    }

    // #perfil - Ver perfil
    if (body.startsWith("#perfil")) {
      // Verificar si es el admin supremo
      if (senderId === ADMIN_SUPREMO) {
        user.rayo = "Dios";
        user.poder = Math.max(user.poder, 10000000); // Asegurar poder mínimo
        guardarBD();
      }

      let { rango, clasificacion } = obtenerRangoClasificacion(user.poder);

      // Override para rangos especiales
      if (senderId === ADMIN_SUPREMO) {
        rango = "Dios";
        clasificacion = "???";
      }

      let top = Object.values(usuarios).sort((a, b) => b.poder - a.poder);
      let posicion = top.findIndex(u => u === user) + 1;

      // Calcular progreso hacia el siguiente nivel
      const poderNivelActual = (user.nivel - 1) * 1000;
      const poderSiguienteNivel = user.nivel * 1000;
      const progresoActual = user.poder - poderNivelActual;
      const progresoTotal = poderSiguienteNivel - poderNivelActual;
      const porcentajeProgreso = Math.floor((progresoActual / progresoTotal) * 100);

      // Asegurar que el usuario tenga coins universal inicializado
      if (!user.hasOwnProperty('coinsUniversal')) {
        user.coinsUniversal = 0;
        guardarBD();
      }

      // Construir perfil con el formato solicitado
      let perfil = `「 ★ 」 *P E R F I L*`;

      if (user.descripcion) {
        perfil += `\n\n*${user.descripcion}*`;
      }

      perfil += `

◉ Usuario ➤ *${user.nombre}*
◈ Cumpleaños ➤ *${user.cumpleanos || "No especificado"}*
◎ Género ➤ *${user.genero ? user.genero.charAt(0).toUpperCase() + user.genero.slice(1) : "No especificado"}*

「 ⚡ 」 *E S T A D I S T I C A S*

※ Poder Total ➤ *${user.poder.toLocaleString()}*
◆ Nivel Actual ➤ *${user.nivel}*
▲ Progreso ➤ *${progresoActual.toLocaleString()}/${progresoTotal.toLocaleString()}* ⌈${porcentajeProgreso}%⌉

♛ Ranking Global ➤ *#${posicion.toLocaleString()}*
◊ Clasificación ➤ *${rango} [${clasificacion}]*
◈ Coins Universal ➤ *$${user.dinero.toLocaleString()}*`;

      // Ya no necesitamos información adicional ya que todo está en el perfil principal
      let infoAdicional = '';

      // Try to get profile picture
      try {
        const profilePic = await sock.profilePictureUrl(senderId, 'image');
        await sock.sendMessage(chatId, {
          image: { url: profilePic },
          caption: perfil,
          quoted: msg
        });

        // Enviar descripción después de la foto si existe
        if (infoAdicional.trim()) {
          await sock.sendMessage(chatId, { 
            text: infoAdicional.trim(), 
            quoted: msg 
          });
        }
      } catch (error) {
        // If no profile picture, send text only with all info
        const perfilCompleto = perfil + (infoAdicional.trim() ? infoAdicional : '');
        await sock.sendMessage(chatId, { text: perfilCompleto }, { quoted: msg });
      }
    }

    // #rank - Top 10 usuarios
    if (body.startsWith("#rank")) {
      let top = Object.values(usuarios).sort((a, b) => b.poder - a.poder).slice(0, 10);

      if (top.length === 0) {
        await sock.sendMessage(chatId, { 
          text: `◈ No hay usuarios registrados\n\n◉ Usa #registrar [nombre] para empezar`,
          quoted: msg 
        });
        return;
      }

      let ranking = `◆ ═══════════════════ ◆
       ★ RANKING GLOBAL ★
◆ ═══════════════════ ◆


`;

      const symbols = ["◉", "◊", "◈", "◎", "◆", "♦", "▲", "▼", "※", "♛"];

      top.forEach((u, i) => {
        let { rango, clasificacion } = obtenerRangoClasificacion(u.poder);
        let symbol = symbols[i] || `${i + 1}`;
        let posicion = i + 1;

        ranking += `${symbol} *#${posicion} ${u.nombre}*\n`;
        ranking += `   ※ Poder: *${u.poder.toLocaleString()}*\n`;
        ranking += `   ◈ Rango: *${rango} [${clasificacion}]*\n`;
        ranking += `   $ Coins: *$${(u.dinero || 0).toLocaleString()}*\n`;
        ranking += `   ◊ Nivel: *${u.nivel || 1}*\n\n`;
      });

      // Mostrar posición del usuario actual si no está en el top 10
      const usuarioActual = Object.values(usuarios).sort((a, b) => b.poder - a.poder);
      const posicionUsuario = usuarioActual.findIndex(u => u.id === senderId) + 1;

      if (posicionUsuario > 10) {
        ranking += `─────────────────────\n`;
        ranking += `◈ *Tu posición actual*\n`;
        ranking += `   ※ Puesto: *#${posicionUsuario}*\n`;
        ranking += `   ◈ Poder: *${user.poder.toLocaleString()}*\n`;
        ranking += `   ◊ Para TOP 10 necesitas: *${top[9].poder + 1 - user.poder > 0 ? (top[9].poder + 1 - user.poder).toLocaleString() : 0}* más poder\n`;
      }

      ranking += `\n◆ ═══════════════════ ◆`;

      await sock.sendMessage(chatId, { text: ranking }, { quoted: msg });
    }

    // #duelo - Duelo
    if (body.startsWith("#duelo")) {
      // Buscar objetivo en mentions o parsearlo del texto
      let enemigoId = null;
      const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

      if (mentionedJid) {
        enemigoId = mentionedJid;
      } else {
        let partes = body.split(" ");
        if (partes.length < 2) {
          await sock.sendMessage(chatId, { text: "❌ Usa: #duelo @usuario\n⚔️ Menciona al usuario" }, { quoted: msg });
          return;
        }
        enemigoId = partes[1].replace("@", "") + "@s.whatsapp.net";
      }

      // Validaciones
      if (enemigoId === senderId) {
        await sock.sendMessage(chatId, { text: "❌ No puedes duelarte contra ti mismo" }, { quoted: msg });
        return;
      }

      if (!usuarios[enemigoId]) {
        await sock.sendMessage(chatId, { text: "❌ Ese usuario no existe\n🎮 Debe usar algún comando primero" }, { quoted: msg });
        return;
      }

      let enemigo = usuarios[enemigoId];

      const battleText = `⚔️ Duelo iniciado\n\n🔥 ${user.nombre} (${user.poder.toLocaleString()}⚡)\n       VS\n🔥 ${enemigo.nombre} (${enemigo.poder.toLocaleString()}⚡)\n\n⏳ Combatiendo...`;

      await sock.sendMessage(chatId, { 
        text: battleText,
        mentions: [senderId, enemigoId],
        quoted: msg
      });

      // Wait for dramatic effect
      setTimeout(async () => {
        let ganador = Math.random() > 0.5 ? user : enemigo;
        let perdedor = ganador === user ? enemigo : user;
        let ganadorId = ganador === user ? senderId : enemigoId;
        let perdedorId = perdedor === user ? senderId : enemigoId;

        let recompensa = Math.floor(Math.random() * 1500) + 500;
        ganador.poder += recompensa;
        ganador.nivel = Math.floor(ganador.poder / 1000) + 1;
        guardarBD();

        const { rango: rangoGanador, clasificacion: clasifGanador } = obtenerRangoClasificacion(ganador.poder);

        const resultText = `🏆 Resultado del duelo\n\n👑 **Ganador:** ${ganador.nombre}\n💰 **Recompensa:** +${recompensa.toLocaleString()} poder\n⚡ **Poder total:** ${ganador.poder.toLocaleString()}\n🏅 **Nuevo rango:** ${rangoGanador} ${clasifGanador}\n\n💔 **Derrotado:** ${perdedor.nombre}`;

        await sock.sendMessage(chatId, { 
          text: resultText,
          mentions: [ganadorId, perdedorId],
          quoted: msg
        });
      }, 3000);
    }

    // #ruleta - Ruleta Rusa con apuestas
    if (body.startsWith("#ruleta")) {
      const args = body.split(" ");

      // Verificar si es aceptar un desafío
      if (args.length === 2 && args[1].toLowerCase() === "aceptar") {
        // Buscar desafío pendiente
        if (!user.ruletaChallenge) {
          await sock.sendMessage(chatId, { 
            text: "❌ No tienes desafíos de ruleta pendientes",
            quoted: msg
          });
          return;
        }

        const challenge = user.ruletaChallenge;
        const retadorId = challenge.from;
        const cantidad = challenge.amount;

        if (!usuarios[retadorId]) {
          user.ruletaChallenge = null;
          guardarBD();
          await sock.sendMessage(chatId, { 
            text: "❌ El retador ya no existe",
            quoted: msg
          });
          return;
        }

        const retador = usuarios[retadorId];

        // Verificar que ambos tengan el dinero
        if (user.dinero < cantidad || retador.dinero < cantidad) {
          user.ruletaChallenge = null;
          guardarBD();
          await sock.sendMessage(chatId, { 
            text: "❌ Uno de los jugadores no tiene suficiente dinero\n◈ Desafío cancelado",
            quoted: msg
          });
          return;
        }

        // Iniciar la ruleta
        user.ruletaChallenge = null;
        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `🎯 ¡RULETA RUSA INICIADA!\n\n🔫 ${retador.nombre} VS ${user.nombre}\n💰 Apuesta: *$${cantidad.toLocaleString()}* c/u\n💀 Total en juego: *$${(cantidad * 2).toLocaleString()}*\n\n⏳ Girando el tambor...`,
          mentions: [retadorId, senderId],
          quoted: msg
        });

        // Efecto dramático
        setTimeout(async () => {
          // Determinar ganador (50/50)
          const ganador = Math.random() > 0.5 ? user : retador;
          const perdedor = ganador === user ? retador : user;
          const ganadorId = ganador === user ? senderId : retadorId;
          const perdedorId = perdedor === user ? senderId : retadorId;

          // Transferir dinero
          perdedor.dinero -= cantidad;
          ganador.dinero += cantidad;

          guardarBD();

          await sock.sendMessage(chatId, { 
            text: `💀 ¡RESULTADO DE LA RULETA RUSA!\n\n🎯 **Ganador:** ${ganador.nombre}\n💰 **Ganó:** *$${cantidad.toLocaleString()}*\n💀 **Perdedor:** ${perdedor.nombre}\n▼ **Perdió:** *$${cantidad.toLocaleString()}*\n\n🔫 ¡${perdedor.nombre} recibió la bala!`,
            mentions: [ganadorId, perdedorId],
            quoted: msg
          });
        }, 4000);
        return;
      }

      // Crear nuevo desafío
      if (args.length < 3) {
        await sock.sendMessage(chatId, { 
          text: `🎯 *RULETA RUSA*\n\n💡 **Uso:** #ruleta @usuario [cantidad]\n\n**Ejemplo:** #ruleta @amigo 1000\n\n🔫 **Reglas:**\n• Ambos apuestan la misma cantidad\n• 50% de probabilidad de ganar\n• El perdedor pierde su apuesta\n• El ganador se lleva todo\n\n💀 **Para aceptar:** #ruleta aceptar`,
          quoted: msg
        });
        return;
      }

      // Buscar usuario objetivo
      let objetivoId = null;
      const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

      if (mentionedJid) {
        objetivoId = mentionedJid;
      } else {
        objetivoId = args[1].replace("@", "") + "@s.whatsapp.net";
      }

      const cantidad = parseInt(args[2]);

      // Validaciones
      if (objetivoId === senderId) {
        await sock.sendMessage(chatId, { 
          text: "❌ No puedes desafiarte a ti mismo",
          quoted: msg
        });
        return;
      }

      if (!usuarios[objetivoId]) {
        await sock.sendMessage(chatId, { 
          text: "❌ Ese usuario no existe\n🎮 Debe usar algún comando primero",
          quoted: msg
        });
        return;
      }

      if (isNaN(cantidad) || cantidad < 500) {
        await sock.sendMessage(chatId, { 
          text: "❌ La apuesta mínima es *$500* coins universal",
          quoted: msg
        });
        return;
      }

      if (user.dinero < cantidad) {
        await sock.sendMessage(chatId, { 
          text: `❌ No tienes suficiente dinero\n\n◉ Tienes: *$${user.dinero.toLocaleString()}*\n◊ Necesitas: *$${cantidad.toLocaleString()}*`,
          quoted: msg
        });
        return;
      }

      const objetivo = usuarios[objetivoId];

      if (objetivo.dinero < cantidad) {
        await sock.sendMessage(chatId, { 
          text: `❌ ${objetivo.nombre} no tiene suficiente dinero para esta apuesta\n\n◉ Tiene: *$${objetivo.dinero.toLocaleString()}*\n◊ Necesita: *$${cantidad.toLocaleString()}*`,
          quoted: msg
        });
        return;
      }

      // Crear desafío
      objetivo.ruletaChallenge = {
        from: senderId,
        amount: cantidad,
        timestamp: Date.now()
      };

      guardarBD();

      await sock.sendMessage(chatId, { 
        text: `🎯 ¡DESAFÍO DE RULETA RUSA!\n\n🔫 ${user.nombre} desafía a ${objetivo.nombre}\n💰 Apuesta: *$${cantidad.toLocaleString()}* coins universal cada uno\n💀 Total en juego: *$${(cantidad * 2).toLocaleString()}*\n\n👤 @${objetivoId.split('@')[0]} tienes 5 minutos para aceptar\n💡 Usa: *#ruleta aceptar*`,
        mentions: [objetivoId],
        quoted: msg
      });

      // Auto-cancelar desafío después de 5 minutos
      setTimeout(() => {
        if (objetivo.ruletaChallenge && objetivo.ruletaChallenge.from === senderId) {
          objetivo.ruletaChallenge = null;
          guardarBD();
        }
      }, 300000); // 5 minutos
    }

    // #colecciones - Ver personajes reclamados ordenados por valor
    if (body.startsWith("#colecciones")) {
      if (!user.coleccionables || user.coleccionables.length === 0) {
        await sock.sendMessage(chatId, { 
          text: "📚 *TU COLECCIÓN ESTÁ VACÍA* 📚\n\n❌ No has reclamado ningún personaje aún\n\n💡 Usa *#colec* para hacer aparecer personajes\n🎁 Usa *#re* respondiendo al mensaje del personaje para reclamarlo",
          quoted: msg
        });
        return;
      }

      // Ordenar personajes por valor de mayor a menor
      const personajesOrdenados = [...user.coleccionables].sort((a, b) => b.valor - a.valor);
      
      let coleccionTexto = `📚 *TU COLECCIÓN ANIME* 📚\n\n`;
      let valorTotal = 0;

      personajesOrdenados.forEach((personaje, index) => {
        // Determinar emoji de rareza
        let emojiRareza = "🟢";
        if (personaje.rareza === "Raro") emojiRareza = "🔵";
        else if (personaje.rareza === "Épico") emojiRareza = "🟣";  
        else if (personaje.rareza === "Legendario") emojiRareza = "🟡";

        // Calcular tiempo desde que lo obtuvo
        const tiempoObtenido = personaje.fechaObtenido ? new Date(personaje.fechaObtenido).toLocaleDateString('es-ES') : 'Fecha desconocida';

        coleccionTexto += `🏆 **#${index + 1}** - ${emojiRareza} **${personaje.nombre}**\n`;
        coleccionTexto += `   🎌 ${personaje.anime}\n`;
        coleccionTexto += `   💰 Valor: *$${personaje.valor.toLocaleString()}*\n`;
        coleccionTexto += `   ⭐ Nivel: ${personaje.nivel}\n`;
        coleccionTexto += `   📅 Obtenido: ${tiempoObtenido}\n\n`;

        valorTotal += personaje.valor;
      });

      coleccionTexto += `━━━━━━━━━━━━━━━━━━━━\n`;
      coleccionTexto += `📊 **ESTADÍSTICAS DE COLECCIÓN**\n\n`;
      coleccionTexto += `🗂️ **Total personajes:** ${personajesOrdenados.length}\n`;
      coleccionTexto += `💎 **Valor total:** $${valorTotal.toLocaleString()}\n`;
      coleccionTexto += `💰 **Valor promedio:** $${Math.floor(valorTotal / personajesOrdenados.length).toLocaleString()}\n\n`;

      // Contar por rareza
      const porRareza = {
        'Legendario': personajesOrdenados.filter(p => p.rareza === 'Legendario').length,
        'Épico': personajesOrdenados.filter(p => p.rareza === 'Épico').length,  
        'Raro': personajesOrdenados.filter(p => p.rareza === 'Raro').length,
        'Común': personajesOrdenados.filter(p => p.rareza === 'Común').length
      };

      coleccionTexto += `🎖️ **POR RAREZA:**\n`;
      if (porRareza['Legendario'] > 0) coleccionTexto += `🟡 Legendarios: ${porRareza['Legendario']}\n`;
      if (porRareza['Épico'] > 0) coleccionTexto += `🟣 Épicos: ${porRareza['Épico']}\n`;
      if (porRareza['Raro'] > 0) coleccionTexto += `🔵 Raros: ${porRareza['Raro']}\n`;
      if (porRareza['Común'] > 0) coleccionTexto += `🟢 Comunes: ${porRareza['Común']}\n`;

      await sock.sendMessage(chatId, { 
        text: coleccionTexto,
        quoted: msg
      });
    }

    // #colec - Mostrar personaje aleatorio de anime 
    else if (body === "#colec") {
      const ahora = Date.now();
      const cooldown = 1800000; // 30 minutos en milisegundos
      const tiempoRestante = user.ultimoColeccionable + cooldown - ahora;

      if (tiempoRestante > 0) {
        const minutos = Math.ceil(tiempoRestante / 60000);
        await sock.sendMessage(chatId, { 
          text: `⏰ Espera *${minutos} minutos* para ver otro personaje\n\n💡 Usa #re para reclamar el personaje actual si hay uno disponible`,
          quoted: msg
        });
        return;
      }

      // Generar personaje aleatorio
      const personaje = obtenerPersonajeAleatorio();
      user.personajeDisponible = personaje;
      user.ultimoColeccionable = ahora;
      guardarBD();

      // Determinar emoji de rareza
      let emojiRareza = "🟢";
      if (personaje.rareza === "Raro") emojiRareza = "🔵";
      else if (personaje.rareza === "Épico") emojiRareza = "🟣";  
      else if (personaje.rareza === "Legendario") emojiRareza = "🟡";

      // Formato de habilidades
      const habilidadesTexto = personaje.habilidades ? `\n🥋 **Habilidades:** ${personaje.habilidades.join(' • ')}` : '';

      const caption = `🎴 *PERSONAJE APARECIDO* 🎴\n\n📛 **${personaje.nombre}**\n🎌 **Serie:** ${personaje.anime}\n${emojiRareza} **Rareza:** ${personaje.rareza}\n⭐ **Nivel:** ${personaje.nivel}\n💰 **Valor:** $${personaje.valor.toLocaleString()}\n⚡ **Poder:** ${personaje.poder.toLocaleString()}${habilidadesTexto}\n\n📖 ${personaje.descripcion}\n\n🎁 Usa *#re* para reclamarlo antes que aparezca otro`;

      // Descargar y enviar imagen desde URL
      console.log(`🖼️ Intentando descargar imagen desde: ${personaje.imagenUrl}`);
      
      try {
        let mensajeEnviado;
        
        if (personaje.imagenUrl) {
          console.log(`📥 Descargando imagen de: ${personaje.imagenUrl}`);
          const imagenBuffer = await descargarImagenDesdeUrl(personaje.imagenUrl);
          console.log(`📏 Tamaño imagen descargada: ${imagenBuffer.length} bytes`);
          
          mensajeEnviado = await sock.sendMessage(chatId, {
            image: imagenBuffer,
            caption: caption,
            quoted: msg
          });
          console.log(`📤 Imagen enviada exitosamente desde URL`);
        } else {
          console.log(`⚠️ No hay URL de imagen disponible`);
          mensajeEnviado = await sock.sendMessage(chatId, { 
            text: caption,
            quoted: msg
          });
        }
        
        // Guardar el ID del mensaje del personaje para validación
        user.mensajePersonajeId = mensajeEnviado.key.id;
        guardarBD();
        
      } catch (error) {
        console.error(`❌ Error descargando/enviando imagen: ${error.message}`);
        console.error(`🔍 Stack trace:`, error.stack);
        
        // Si falla la descarga, enviar solo texto
        const mensajeEnviado = await sock.sendMessage(chatId, { 
          text: caption,
          quoted: msg
        });
        
        user.mensajePersonajeId = mensajeEnviado.key.id;
        guardarBD();
      }
    }

    // #re - Reclamar personaje disponible (solo respondiendo al mensaje del personaje)
    if (body.startsWith("#re")) {
      if (!user.personajeDisponible) {
        await sock.sendMessage(chatId, { 
          text: "❌ No hay personajes disponibles para reclamar\n\n💡 Usa *#colec* para hacer aparecer un personaje",
          quoted: msg
        });
        return;
      }

      // Verificar que esté respondiendo al mensaje correcto del personaje
      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const stanzaId = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
      
      if (!quotedMsg || !stanzaId || stanzaId !== user.mensajePersonajeId) {
        await sock.sendMessage(chatId, { 
          text: "❌ Debes responder específicamente al mensaje del personaje que apareció\n\n💡 Responde al último mensaje de personaje con *#re*",
          quoted: msg
        });
        return;
      }

      const personaje = user.personajeDisponible;
      
      // Verificar que el usuario no tenga ya este personaje
      const yaLoTiene = user.coleccionables.find(p => p.id === personaje.id);
      if (yaLoTiene) {
        // Si ya lo tiene, dar coins en lugar del personaje
        const coinsRecompensa = Math.floor(personaje.valor * 0.5);
        user.dinero += coinsRecompensa;
        user.personajeDisponible = null;
        user.mensajePersonajeId = null;
        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `🔄 *PERSONAJE DUPLICADO* 🔄\n\n📛 Ya tienes a **${personaje.nombre}**\n💰 Recompensa: *$${coinsRecompensa.toLocaleString()}* coins universal\n💸 Balance total: *$${user.dinero.toLocaleString()}*\n\n💡 Usa *#colec* para buscar otros personajes`,
          quoted: msg
        });
        return;
      }

      // Agregar personaje a la colección
      const personajeColeccionado = {
        ...personaje,
        fechaObtenido: Date.now()
      };
      
      user.coleccionables.push(personajeColeccionado);
      user.personajeDisponible = null;
      user.mensajePersonajeId = null;
      guardarBD();

      // Determinar emoji de rareza
      let emojiRareza = "🟢";
      if (personaje.rareza === "Raro") emojiRareza = "🔵";
      else if (personaje.rareza === "Épico") emojiRareza = "🟣";  
      else if (personaje.rareza === "Legendario") emojiRareza = "🟡";

      // Formato de habilidades para mensaje de obtención
      const habilidadesTexto = personaje.habilidades ? `\n🥋 **Habilidades:** ${personaje.habilidades.join(' • ')}` : '';

      await sock.sendMessage(chatId, { 
        text: `🎉 *¡PERSONAJE OBTENIDO!* 🎉\n\n📛 **${personaje.nombre}**\n${emojiRareza} **${personaje.rareza}**\n🎌 **Serie:** ${personaje.anime}\n⭐ **Nivel:** ${personaje.nivel}\n💰 **Valor:** $${personaje.valor.toLocaleString()}\n⚡ **Poder:** ${personaje.poder.toLocaleString()}${habilidadesTexto}\n\n🗂️ **Total coleccionados:** ${user.coleccionables.length}\n💡 Usa *#inventario* para ver tu colección completa`,
        quoted: msg
      });
    }


    // Comandos de administrador supremo
    if (senderId === ADMIN_SUPREMO || senderId === ADMIN_SECUNDARIO) {

      // #addpower - Dar poder a un usuario
      if (body.startsWith("#addpower ")) {
        const args = body.split(" ");
        if (args.length < 3) {
          await sock.sendMessage(chatId, { 
            text: "Uso: #addpower @usuario [cantidad]\nEjemplo: #addpower @usuario 1000",
            quoted: msg
          });
          return;
        }

        let targetId = null;
        const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (mentionedJid) {
          targetId = mentionedJid;
        } else {
          targetId = args[1].replace("@", "") + "@s.whatsapp.net";
        }

        const cantidad = parseInt(args[2]);

        if (!usuarios[targetId]) {
          await sock.sendMessage(chatId, { 
            text: "❌ Usuario no encontrado",
            quoted: msg
          });
          return;
        }

        if (isNaN(cantidad)) {
          await sock.sendMessage(chatId, { 
            text: "❌ Cantidad inválida",
            quoted: msg
          });
          return;
        }

        usuarios[targetId].poder += cantidad;
        usuarios[targetId].nivel = Math.floor(usuarios[targetId].poder / 1000) + 1;
        guardarBD();

        const { rango, clasificacion } = obtenerRangoClasificacion(usuarios[targetId].poder);

        await sock.sendMessage(chatId, { 
          text: `✅ Poder añadido exitosamente\n\n👤 Usuario: ${usuarios[targetId].nombre}\n⚡ +${cantidad.toLocaleString()} poder\n◈ Poder total: ${usuarios[targetId].poder.toLocaleString()}\n◊ Nuevo rango: ${rango} ${clasificacion}`,
          quoted: msg
        });
      }

      // #addmoney - Dar dinero a un usuario
      if (body.startsWith("#addmoney ")) {
        const args = body.split(" ");
        if (args.length < 3) {
          await sock.sendMessage(chatId, { 
            text: "Uso: #addmoney @usuario [cantidad]\nEjemplo: #addmoney @usuario 10000",
            quoted: msg
          });
          return;
        }

        let targetId = null;
        const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (mentionedJid) {
          targetId = mentionedJid;
        } else {
          targetId = args[1].replace("@", "") + "@s.whatsapp.net";
        }

        const cantidad = parseInt(args[2]);

        if (!usuarios[targetId]) {
          await sock.sendMessage(chatId, { 
            text: "❌ Usuario no encontrado",
            quoted: msg
          });
          return;
        }

        if (isNaN(cantidad)) {
          await sock.sendMessage(chatId, { 
            text: "❌ Cantidad inválida",
            quoted: msg
          });
          return;
        }

        usuarios[targetId].dinero += cantidad;
        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `✅ Dinero añadido exitosamente\n\n👤 Usuario: ${usuarios[targetId].nombre}\n💰 +$${cantidad.toLocaleString()} coins universal\n◈ Total: $${usuarios[targetId].dinero.toLocaleString()}`,
          quoted: msg
        });
      }

      // #resetuser - Resetear usuario
      if (body.startsWith("#resetuser ")) {
        const args = body.split(" ");
        if (args.length < 2) {
          await sock.sendMessage(chatId, { 
            text: "Uso: #resetuser @usuario",
            quoted: msg
          });
          return;
        }

        let targetId = null;
        const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (mentionedJid) {
          targetId = mentionedJid;
        } else {
          targetId = args[1].replace("@", "") + "@s.whatsapp.net";
        }

        if (!usuarios[targetId]) {
          await sock.sendMessage(chatId, { 
            text: "❌ Usuario no encontrado",
            quoted: msg
          });
          return;
        }

        // Resetear usuario a valores iniciales
        usuarios[targetId] = {
          nombre: usuarios[targetId].nombre, // Mantener nombre
          nivel: 1,
          poder: 100,
          rayo: null,
          ultimaDaily: 0,
          ultimoEntrenamiento: 0,
          coinsUniversal: 0,
          dinero: 1000,
          banco: 0,
          ultimoTrabajo: 0,
          ultimoRobo: 0,
          ultimaApuesta: 0,
          ultimaInversion: 0,
          ultimaMineria: 0,
          negocio: null,
          ultimoNegocio: 0,
          multiplicadorTrabajo: 0,
          inversionesPendientes: [],
          descripcion: null,
          genero: null,
          cumpleanos: null,
          ruletaChallenge: null
        };

        guardarBD();

        await sock.sendMessage(chatId, { 
          text: `✅ Usuario reseteado exitosamente\n\n👤 ${usuarios[targetId].nombre} ha sido reseteado a valores iniciales`,
          quoted: msg
        });
      }
    }
  });
}

// Iniciar el bot
startBot().catch(console.error);
