const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "about",
    category: "general",
    shortDesc: "`|about` | Get info about stuff you don't know\n",
    executeText: (message, args) => {
        if (!args.length) {
            const embed = new Discord.MessageEmbed()
                .setColor("#00dde0")
                .setAuthor(
                    "About | Main",
                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                )
                .addField(
                    "Categories",
                    "`|about category general` | General commands are here\n`|about category server` | For all your server needs"
                )
                .addField(
                    "Specific Command",
                    "`|about command` | Get some info on a specific command"
                )
                .addField(
                    "Eskibot",
                    "`|about me` | Get some info on what, why, and who I am"
                )
                .addField(
                    "Creator",
                    "`|about creator` | Who is my father? Well you can learn here"
                );
            message.channel.send({ embeds: [embed] });
        } else if (args[0] === "me") {
            const embed = new Discord.MessageEmbed()
                .setColor("#00dde0")
                .setAuthor(
                    "About | Myself",
                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                )
                .setDescription(
                    "My name is EskiBot, I am the offical discord bot for iDenali's servers.\n\n My father is InventBoss who created me in exchange for power in iDenali's servers.\n I was born on October 31 2021 when my father started work on me.\n\nI'm not currently open to other servers outside the iDenali family, but\nyou can find my source code [here](https://github.com/InventBoss/EskiBot)."
                );
            message.channel.send({ embeds: [embed] });
        } else if (args[0] === "creator") {
            // This is used to create buttons for this command that link to my socials
            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                    .setLabel("Twitter")
                    .setStyle("LINK")
                    .setURL("https://twitter.com/Invent_Boss"),
                new Discord.MessageButton()
                    .setLabel("Github")
                    .setStyle("LINK")
                    .setURL("https://github.com/InventBoss/MeDaBot-JavaScript")
            );

            const embed = new Discord.MessageEmbed()
                .setColor("#00dde0")
                .setAuthor(
                    "About | Creator",
                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                )
                .setDescription(
                    "My father, InventBoss, created me along with my brother, [MeDaBot](https://github.com/InventBoss/MeDaBot-JavaScript).\n\nHe's an amateur french programmer who lives in America."
                );
            message.channel.send({ embeds: [embed], components: [row] });
        } else if (args[0] === "category") {
            const commandFolders = fs.readdirSync("./commands");
            let commandContent = "";
            let correctCategory = false;

            for (const folder of commandFolders) {
                const commandFiles = fs
                    .readdirSync(`./commands/${folder}`)
                    .filter((file) => file.endsWith(".js"));
                for (const file of commandFiles) {
                    const command = require(`../../commands/${folder}/${file}`);
                    if (command.category === args[1]) {
                        commandContent += command.shortDesc;
                        correctCategory = true;
                    }
                }
            }
            if (correctCategory) {
                const embed = new Discord.MessageEmbed()
                    .setColor("#00dde0")
                    .setAuthor(
                        `About | ${
                            args[1][0].toUpperCase() + args[1].substring(1)
                        }`,
                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                    )
                    .setDescription(commandContent);
                message.channel.send({ embeds: [embed] });
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor("#00dde0")
                    .setAuthor(
                        "About | Unknown",
                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                    )
                    .setDescription(
                        "Hey maybe you wanna try a category that exists?"
                    );
                message.channel.send({ embeds: [embed] });
            }
        } else if (args[0] === "command") {
            // Ok, so for getting the description of a specific command, I just stored it all on a json file (extra/commandDesc.json) cause I thought it was cleaner
            fs.readFile(
                "./data/commandDesc.json",
                "utf-8",
                async (error, text) => {
                    if (error) {
                        throw error;
                    }

                    let fileData = JSON.parse(text);

                    const commandDesc =
                        fileData[args[1]] ?? "Sorry, try an existing command";
                    let commandName = "Unknown Command";

                    if (commandDesc !== "Sorry, try an existing command") {
                        commandName =
                            args[1][0].toUpperCase() +
                            args[1].substring(1) +
                            " Command";
                    }

                    const embed = new Discord.MessageEmbed()
                        .setColor("#00dde0")
                        .setAuthor(
                            `About | ${commandName}`,
                            "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                        )
                        .setDescription(commandDesc);
                    message.channel.send({ embeds: [embed] });
                }
            );
        }
    },
    slashData: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Gives you info about commands, me, and more")
        .addSubcommand((subcommand) =>
            subcommand.setName("me").setDescription("Tells you about me")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("creator")
                .setDescription("Who is my father? Learn here")
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("main").setDescription("The main help page")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("specific")
                .setDescription("For specific commands")
                .addStringOption((option) =>
                    option.setName("command").setDescription("Chosen command")
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("category")
                .setDescription("All the command categories")
                .addStringOption((option) =>
                    option
                        .setName("chosen")
                        .setDescription("Choose you category")
                        .setRequired(true)
                        .addChoice("General", "general")
                        .addChoice("Server", "server")
                )
        ),
    executeSlash: async (interaction) => {
        if (interaction.options.getSubcommand() == "main") {
            const embed = new Discord.MessageEmbed()
                .setColor("#00dde0")
                .setAuthor(
                    "About | Main",
                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                )
                .addField(
                    "Categories",
                    "`|about general` | General commands are here\n`|about server` | For all your server needs"
                )
                .addField(
                    "Specific Command",
                    "`|about command` | Get some info on a specific command"
                )
                .addField(
                    "Eskibot",
                    "`|about me` | Get some info on what/why/who I am"
                )
                .addField(
                    "Creator",
                    "`|about creator` | Who is my father? Well you can learn here"
                );
            await interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() == "me") {
            const embed = new Discord.MessageEmbed()
                .setColor("#00dde0")
                .setAuthor(
                    "About | Myself",
                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                )
                .setDescription(
                    "My name is EskiBot, I am the offical discord bot for iDenali's servers.\n\n My father is InventBoss who create me in exchange for power in iDenali's servers.\n I was born on October 31 2021 when my father started work on me.\n\nI'm not currently open to other servers outside the iDenali family, but\nyou can find my source code [here](https://github.com/InventBoss/EskiBot)."
                );
            interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() == "creator") {
            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                    .setLabel("Twitter")
                    .setStyle("LINK")
                    .setURL("https://twitter.com/Invent_Boss"),
                new Discord.MessageButton()
                    .setLabel("Github")
                    .setStyle("LINK")
                    .setURL("https://github.com/InventBoss/MeDaBot-JavaScript")
            );
            const embed = new Discord.MessageEmbed()
                .setColor("#00dde0")
                .setAuthor(
                    "About | Creator",
                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                )
                .setDescription(
                    "My father, InventBoss, created me along with my brother, [MeDaBot](https://github.com/InventBoss/MeDaBot-JavaScript).\n\nHe's an amateur french programmer who lives in America."
                );
            interaction.reply({ embeds: [embed], components: [row] });
        } else if (interaction.options.getSubcommand() == "category") {
            const commandFolders = fs.readdirSync("./commands");
            let commandContent = "";

            for (const folder of commandFolders) {
                const commandFiles = fs
                    .readdirSync(`./commands/${folder}`)
                    .filter((file) => file.endsWith(".js"));
                for (const file of commandFiles) {
                    const command = require(`../../commands/${folder}/${file}`);
                    if (
                        command.category ===
                        interaction.options.getString("chosen")
                    ) {
                        commandContent += command.shortDesc;
                    }
                }
            }

            const embed = new Discord.MessageEmbed()
                .setColor("#00dde0")
                .setAuthor(
                    `About | ${
                        interaction.options
                            .getString("chosen")[0]
                            .toUpperCase() +
                        interaction.options.getString("chosen").substring(1)
                    }`,
                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                )
                .setDescription(commandContent);
            interaction.reply({ embeds: [embed] });
        }
    },
};
