const Discord = require("discord.js");

module.exports = {
    createClient: () => {
        return new Discord.Client({
            intents: [
                Discord.Intents.FLAGS.GUILDS,
                Discord.Intents.FLAGS.GUILD_MESSAGES,
                Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Discord.Intents.FLAGS.DIRECT_MESSAGES,
                Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            ],
            partials: ["MESSAGE", "CHANNEL", "REACTION"],
        });
    },
    startBot: (client, token) => {
        client.login(token);
    }
}