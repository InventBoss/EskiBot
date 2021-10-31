const Discord = require("discord.js");
const config = require("./config.json");
require("dotenv").config();

function startBot() {
  client.login(process.env["TOKEN"]);
}

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const prefix = config.prefix;

client.on("ready", async () => {
  client.user.setActivity("the mighty iDenali!", {
    type: "WATCHING",
  });

  console.log(`Logged in as ${client.user.tag}`);
  console.log("-------------Log-------------");
});

startBot();
