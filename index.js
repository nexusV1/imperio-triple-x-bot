// BOT DE WHATSAPP - CREADO POR EL IMPERIO TRIPLE X
// PROPIETARIO: Infinity Rango-A

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const pino = require("pino");

const cooldowns = {};
const balances = {};
const currencyName = "Imperio";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        getMessage: async () => {}
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "open") {
            console.log("✅ Bot conectado correctamente.");
        } else if (connection === "close") {
            console.log("❌ Conexión cerrada, reconectando...");
            startBot();
        } else if (update.pairingCode) {
            console.log(`📲 Tu código de emparejamiento es: ${update.pairingCode}`);
        }
    });

    // Generar código de 6 dígitos
    setTimeout(async () => {
        let code = await sock.requestPairingCode("5492915268762"); // <---- PON AQUÍ TU NÚMERO CON CÓDIGO DE PAÍS SIN +
        console.log(`📌 Código de emparejamiento: ${code}`);
    }, 3000);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message || !m.key.remoteJid) return;
        const from = m.key.remoteJid;
        const body = m.message.conversation || m.message.extendedTextMessage?.text || "";

        if (!balances[from]) balances[from] = 0;

        // Comando menú
        if (body.startsWith("!menu")) {
            let menu = `📜 *Bot WhatsApp*  
_Creado por:_ El Imperio Triple X  
_Propietario:_ Infinity Rango-A

#crimen → Gana 3k-5k  
#tra → Gana 6k-10k (30% perder)  
#al → Gana 10k-13k (10% perder)  
#bal → Ver saldo  
#pay <monto> → Transferir  
#bet <monto> → Apostar`;
            await sock.sendMessage(from, { text: menu });
        }

        // Comando saldo
        if (body.startsWith("#bal")) {
            await sock.sendMessage(from, { text: `💰 Tienes ${balances[from]} ${currencyName}` });
        }

        // Comando pagar
        if (body.startsWith("#pay")) {
            const args = body.split(" ");
            const amount = parseInt(args[1]);
            if (isNaN(amount) || amount <= 0) return sock.sendMessage(from, { text: "Cantidad inválida." });
            balances[from] -= amount;
            balances[from] = Math.max(0, balances[from]);
            await sock.sendMessage(from, { text: `✅ Has transferido ${amount} ${currencyName}` });
        }

        // Comando crimen
        if (body.startsWith("#crimen")) {
            if (cooldowns[from] && Date.now() - cooldowns[from].crimen < 180000) return sock.sendMessage(from, { text: "⏳ Espera 3 minutos." });
            let ganado = getRandomInt(3000, 5000);
            balances[from] += ganado;
            cooldowns[from] = { ...cooldowns[from], crimen: Date.now() };
            await sock.sendMessage(from, { text: `🔫 Has robado y ganaste ${ganado} ${currencyName}` });
        }

        // Comando trabajo
        if (body.startsWith("#tra")) {
            if (cooldowns[from] && Date.now() - cooldowns[from].tra < 180000) return sock.sendMessage(from, { text: "⏳ Espera 3 minutos." });
            if (Math.random() < 0.3) {
                cooldowns[from] = { ...cooldowns[from], tra: Date.now() };
                return sock.sendMessage(from, { text: "❌ Te robaron en el trabajo y no ganaste nada." });
            }
            let ganado = getRandomInt(6000, 10000);
            balances[from] += ganado;
            cooldowns[from] = { ...cooldowns[from], tra: Date.now() };
            await sock.sendMessage(from, { text: `💼 Trabajaste y ganaste ${ganado} ${currencyName}` });
        }

        // Comando alquiler
        if (body.startsWith("#al")) {
            if (cooldowns[from] && Date.now() - cooldowns[from].al < 60000) return sock.sendMessage(from, { text: "⏳ Espera 1 minuto." });
            if (Math.random() < 0.1) {
                let perdido = getRandomInt(10000, 13000);
                balances[from] = Math.max(0, balances[from] - perdido);
                cooldowns[from] = { ...cooldowns[from], al: Date.now() };
                return sock.sendMessage(from, { text: `❌ Te violaron y perdiste ${perdido} ${currencyName}` });
            }
            let ganado = getRandomInt(10000, 13000);
            balances[from] += ganado;
            cooldowns[from] = { ...cooldowns[from], al: Date.now() };
            await sock.sendMessage(from, { text: `🏠 Alquilaste y ganaste ${ganado} ${currencyName}` });
        }
    });
}

startBot();
