const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const Canvas = require("canvas");
const moment = require("moment");

module.exports = {
    name: "console",
    category: "dev",
    executeText: async (message, args) => {
        if (!message.author.id === "617816411750006794") return;

        if (args[0] === "say") {
            if (!message.guild)
                return message.channel.send(
                    "Sorry but I can only do this command in servers."
                );

            // Code used to echo the input after the subcommand is ran
            message.channel.bulkDelete(1).then(() => {
                let finalMessage = args.slice(1).join(" ");
                message.channel.send(finalMessage);
            });
        } else if (args[0] === "server") {
            if (!message.guild)
                return message.channel.send(
                    "Sorry but I can only do this command in servers."
                );

            if (args[1] === "icon") {
                const embed = new Discord.MessageEmbed()
                    .setColor("#ccfeff")
                    .setAuthor(
                        "Here you go my dude",
                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                    )
                    .setImage(message.channel.guild.iconURL());
                return message.channel.send({ embeds: [embed] });
            } else if (args[1] === "members") {
                const memberCount = message.channel.guild.memberCount;

                const embed = new Discord.MessageEmbed()
                    .setColor("#ccfeff")
                    .setAuthor(
                        `We Have ${memberCount} Members`,
                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                    );
                return message.channel.send({ embeds: [embed] });
            }
        } else if (args[0] === "nick") {
            if (!message.guild.me.permissions.has("MANAGE_NICKNAMES"))
                return message.channel.send(
                    "Sorry but I don't have permission father"
                );

            const newNick = args.slice(1).join(" ");

            message.guild.me.setNickname(newNick);
            const embed = new Discord.MessageEmbed()
                .setColor("#ccfeff")
                .setAuthor(
                    `Set nick to ${newNick}`,
                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                );
            return message.channel.send({ embeds: [embed] });
        } else if (args[0] === "test") {
            const embed = new Discord.MessageEmbed()
                .setDescription("[BTS (방탄소년단) '작은 것들을 위한 시 (Boy With Luv) (feat. Halsey)' Official MV](https://www.youtube.com/watch?v=Dm9m29M3cKg)")
                .setFooter("Added by InventBoss#7641")                
            message.channel.send({ embeds: [embed] });
        }
    },
    slashData: new SlashCommandBuilder()
        .setName("console")
        .setDescription("A developer command for InventBoss")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("say")
                .setDescription("Violate my free speech")
                .addStringOption((option) =>
                    option
                        .setName("input")
                        .setDescription("Insert Violation")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("server")
                .setDescription("Get info about a server")
                .addStringOption((option) =>
                    option
                        .setName("data")
                        .setDescription("What data can I get for you today?")
                        .setRequired(true)
                        .addChoice("Icon", "icon")
                        .addChoice("Server Id", "id")
                        .addChoice("Member Count", "members")
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("nick")
                .setDescription('Change my name "legally"')
                .addStringOption((option) =>
                    option
                        .setName("name")
                        .setDescription(
                            "What I will be smuggled into America as"
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("test")
                .setDescription("InventBoss tests with this")
        ),
    executeSlash: async (interaction) => {
        if (interaction.user.id === "617816411750006794") {
            if (interaction.options.getSubcommand() === "say") {
                return await interaction.reply(
                    interaction.options.getString("input")
                );
            } else if (interaction.options.getSubcommand() === "test") {
            } else if (interaction.options.getSubcommand() === "server") {
                if (interaction.options.getString("data") === "icon") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("#ccfeff")
                        .setAuthor(
                            "Here You Go My Dude",
                            "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                        )
                        .setImage(interaction.guild.iconURL());
                    return await interaction.reply({ embeds: [embed] });
                } else if (interaction.options.getString("data") === "id") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("#ccfeff")
                        .setAuthor(
                            `The Server ID is ${interaction.guild.id}`,
                            "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                        );
                    return await interaction.reply({ embeds: [embed] });
                } else if (
                    interaction.options.getString("data") === "members"
                ) {
                    const memberCount = interaction.guild.memberCount;

                    const embed = new Discord.MessageEmbed()
                        .setColor("#ccfeff")
                        .setAuthor(
                            `We Have ${memberCount} Members`,
                            "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                        );
                    return await interaction.reply({ embeds: [embed] });
                }
            }
            if (interaction.options.getSubcommand() === "nick") {
                if (!interaction.guild.me.permissions.has("MANAGE_NICKNAMES"))
                    return interaction.reply(
                        "Sorry but I don't have permission father"
                    );

                const newNick = interaction.options.getString("name");

                interaction.guild.me.setNickname(newNick);
                const embed = new Discord.MessageEmbed()
                    .setColor("#ccfeff")
                    .setAuthor(
                        `Set nick to ${newNick}`,
                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                    );
                return interaction.reply({ embeds: [embed] });
            }
            return await interaction.reply({
                content:
                    "Looks like nothing happened... Might wanna check that.",
                ephemeral: true,
            });
        }
        return await interaction.reply("You're not my father >:(");
    },
};
