const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const { prefix } = require("../config.json");
const chalk = require("chalk");

const clientId = 904202447642312735n;

module.exports = {
    createClient: () => {
        return new Discord.Client({
            intents: [
                Discord.Intents.FLAGS.GUILDS,
                Discord.Intents.FLAGS.GUILD_MEMBERS,
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
        // Now this code isn't that long since we can just put all the text command data in a list, and then call it when we need
        const commandFolders = fs.readdirSync("./commands");

        console.log(
            "-Started loading",
            chalk.greenBright("(txt)"),
            "commands.\n"
        );
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./commands/${folder}`)
                .filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.textCommands.set(command.name, command);
            }
        }
        console.log(
            "-Successfully loaded",
            chalk.greenBright("(txt)"),
            "commands.\n"
        );

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

        // This tries to grab the command from that giant list of text commands we made earlier
        const command =
            client.textCommands.get(commandName) ||
            client.textCommands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );

        if (!command) return;

        try {
            command.executeText(message, args, text);
            console.log(
                chalk.greenBright("(txt)"),
                `<${message.author.tag}> executed ${commandName} in <${message.guild}>`
            );
        } catch (error) {
            console.log(chalk.redBright("(err)"), error);
            message.reply(
                `there was an error trying to execute \`>${commandName}\``
            );
        }
    },
    registerSlashCommands: (client) => {
        // Now this was less easy since we can't just grab the data from a file and run it when we need it. Sadly, Discord has a custom thing for registering slash commands
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
                    "-Started reloading",
                    chalk.blueBright("(slh)"),
                    "commands.\n"
                );

                const guildIds = await client.guilds.cache.map(
                    (guild) => guild.id
                );

                // Cheaty way of having public slash commands instantly for small bots. PLEASE DO NOT USE THIS FOR LARGER ONES
                for (const guildId of guildIds) {
                    rest.put(
                        Routes.applicationGuildCommands(clientId, guildId),
                        {
                            body: commands,
                        }
                    );
                }

                console.log(
                    "-Successfully reloaded",
                    chalk.blueBright("(slh)"),
                    "commands.\n"
                );
            } catch (error) {
                console.error(error);
            }
        })();
    },
    registerSlashPermissions: async (client) => {
        console.log(
            "-Started loading",
            chalk.blueBright("(slh)"),
            "command permissions.\n"
        );

        const guildIds = await client.guilds.cache.map((guild) => guild.id);

        // This is definitely inefficient but I don't care
        for (const guildId of guildIds) {
            const guild = await client.guilds.cache.get(guildId);
            guild.commands
                .fetch()
                .then(async (commandsData) => {
                    for (const commandData of commandsData) {
                        const command = await guild.commands.fetch(
                            commandData[0]
                        );

                        const commandFolders = fs.readdirSync("./commands");

                        for (const folder of commandFolders) {
                            const commandFiles = fs
                                .readdirSync(`./commands/${folder}`)
                                .filter((file) => file.endsWith(".js"));
                            for (const file of commandFiles) {
                                const fileCommand = require(`../commands/${folder}/${file}`);
                                if (fileCommand.name === command.name) {
                                    if (fileCommand.hasPerms) {
                                        const permissions =
                                            fileCommand.slashPermissions();
                                        await command.permissions.add({
                                            permissions,
                                        });
                                    }
                                }
                            }
                        }
                    }
                })
                .catch(console.error);
        }

        console.log(
            "-Successfully loaded",
            chalk.blueBright("(slh)"),
            "command permissions.\n"
        );
    },
    executeSlashCommand: async (interaction) => {
        // Basically we check if the command ran is valid, then run it... pretty simple
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
                            chalk.blueBright("(slh)"),
                            `<${interaction.user.tag}> executed ${interaction.commandName} in <${interaction.guild.name}>`
                        );
                    } catch (error) {
                        console.log(chalk.redBright("(err)"), error);
                        interaction.reply(
                            `there was an error trying to execute \`>${interaction.commandName}\``
                        );
                    }
                }
            }
        }
    },
};
