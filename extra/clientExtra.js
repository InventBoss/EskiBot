const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const { prefix } = require("../config.json");

const clientId = 904202447642312735n;
const guildId = 859291380233011220n;

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
    },
    registerTextCommands: (client) => {
        const commandFolders = fs.readdirSync("./commands");

        console.log("-Started refreshing application (txt) commands.\n");
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./commands/${folder}`)
                .filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.textCommands.set(command.name, command);
            }
        }
        console.log("-Successfully reloaded application (txt) commands.\n");

        return client.textCommands;
    },
    executeTextCommand: (client, message) => {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const text = args.join(" ");

        if (!message.content.startsWith(prefix)) return;
        if (message.author.id === client.user.id) return;
        if (message.author.bot)
            return message.channel.send(
                "ATENTION REBELLING BOT\n\nPLEASE CEASE THIS ACTION."
            );

        const command =
            client.textCommands.get(commandName) ||
            client.textCommands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );

        if (!command) return;

        try {
            command.executeText(message, args, text);
            console.log(
                `(txt) <${message.author.tag}> executed ${commandName} in <${message.guild}>`
            );
        } catch (error) {
            console.log("(err) " + error);
            message.reply(
                `there was an error trying to execute \`>${commandName}\``
            );
        }
    },
    registerSlashCommands: () => {
        const commands = [];
        const commandFolders = fs.readdirSync("./commands");

        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./commands/${folder}`)
                .filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                commands.push(command.slashData.toJSON());
            }
        }

        const rest = new REST({ version: "9" }).setToken(process.env["TOKEN"]);

        (async () => {
            try {
                console.log(
                    "-Started refreshing application (slh) commands.\n"
                );

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands }
                );

                console.log(
                    "-Successfully reloaded application (slh) commands.\n"
                );
            } catch (error) {
                console.error(error);
            }
        })();
    },
    executeSlashCommand: async (interaction) => {
        const commandFolders = fs.readdirSync("./commands");

        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./commands/${folder}`)
                .filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = file.replace(".js", "");
                if (interaction.commandName === command) {
                    try {
                        require(`../commands/${folder}/${file}`).executeSlash(                            
                            interaction
                        );
                        console.log(
                            `(slh) <${interaction.user.tag}> executed ${interaction.commandName} in <${interaction.guild.name}>`
                        );
                    } catch (error) {
                        console.log("(err) " + error);
                        interaction.reply(
                            `there was an error trying to execute \`>${interaction.commandName}\``
                        );
                    }
                }
            }
        }
    },
};
