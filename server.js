const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8270250780:AAFSgyrx0fsSzklLJjFwEUVQHYzsNpPCPRs";
const bot = new TelegramBot(TOKEN, { polling: true });

const DATA_FILE = "data.json";

// загрузка игроков
function loadPlayers() {
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

// сохранение
function savePlayers(players) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));
}

// команда добавления
bot.onText(/\/add (.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    const args = match[1].split(" ");
    const name = args[0];
    const rank = args[1];
    const role = args[2];

    const players = loadPlayers();

    players.push({
        name,
        rank,
        role,
        avatar: `img/${name.toLowerCase()}.png`
    });

    savePlayers(players);

    bot.sendMessage(chatId, `✅ Игрок ${name} добавлен`);
});
// список
bot.onText(/\\/list /, (msg) => {
    const players = loadPlayers();

    let text = "📋 Игроки:\\n";
    players.forEach(p => {
        text += `${p.name} (${p.role})\\n`;
    });

    bot.sendMessage(msg.chat.id, text);
});