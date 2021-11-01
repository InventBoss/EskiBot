const Discord = require("discord.js");
const clientExtra = require("./extra/clientExtra.js");
require("dotenv").config();

const client = clientExtra.createClient();

client.on("ready", async () => {
    client.user.setActivity("the mighty iDenali!", {
        type: "WATCHING",
    });

    client.textCommands = new Discord.Collection();
    client.textCommands = clientExtra.registerTextCommands(client);

    clientExtra.registerSlashCommands();

    console.log(
        `-Successfully Logged in as ${client.user.tag}\n`
    );
});

client.on("messageCreate", (message) => {
    clientExtra.executeTextCommand(client, message);
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand())
        return clientExtra.executeSlashCommand(interaction);
});

clientExtra.startBot(client, process.env["TOKEN"]);
