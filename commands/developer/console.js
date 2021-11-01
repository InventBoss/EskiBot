const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
    name: "console",
    executeText: (message, args) => {
        if (!message.author.id === "617816411750006794") return;

        if (args[0] === "say") {
            if (!message.guild)
                return message.channel.send(
                    "Sorry but I can only do this command in servers."
                );

            message.channel.bulkDelete(1).then(() => {
                let finalMessage = args.slice(1).join(" ");
                message.channel.send(finalMessage);
            });
        }
        if (args[0] === "server") {
            if (!message.guild)
                return message.channel.send(
                    "Sorry but I can only do this command in servers."
                );
            if (args[1] === "icon") {
                const embed = new Discord.MessageEmbed()
                    .setColor("#ccfeff")
                    .setAuthor(
                        "Here you go my dude",
                        "https://cdn.discordapp.com/icons/859291380233011220/f4de60c3767e3fb3043f2e4e362d3f12.webp"
                    )
                    .setImage(message.channel.guild.iconURL());
                return message.channel.send({ embeds: [embed] });
            } else if (args[1] === "id") {
                const embed = new Discord.MessageEmbed()
                    .setColor("#ccfeff")
                    .setAuthor(
                        `The Server ID is ${message.channel.guild.id}`,
                        "https://cdn.discordapp.com/icons/859291380233011220/f4de60c3767e3fb3043f2e4e362d3f12.webp"
                    );
                return message.channel.send({ embeds: [embed] });
            } else if (args[1] === "members") {
				const memberCount = message.channel.guild.memberCount;
	
				const embed = new Discord.MessageEmbed()
					.setColor("#ccfeff")
					.setAuthor(
						`We Have ${memberCount} Members`,
						"https://cdn.discordapp.com/icons/859291380233011220/f4de60c3767e3fb3043f2e4e362d3f12.webp"
					);
				return message.channel.send({ embeds: [embed] });
			}
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
        ),
    executeSlash: async (interaction) => {
        if (interaction.user.id === "617816411750006794") {
            if (interaction.options.getSubcommand() === "say") {
                return await interaction.reply(
                    interaction.options.getString("input")
                );
            } else if (interaction.options.getSubcommand() === "server") {
                if (interaction.options.getString("data") === "icon") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("#ccfeff")
                        .setAuthor(
                            "Here You Go My Dude",
                            "https://cdn.discordapp.com/icons/859291380233011220/f4de60c3767e3fb3043f2e4e362d3f12.webp"
                        )
                        .setImage(interaction.guild.iconURL());
                    return await interaction.reply({ embeds: [embed] });
                } else if (interaction.options.getString("data") === "id") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("#ccfeff")
                        .setAuthor(
                            `The Server ID is ${interaction.guild.id}`,
                            "https://cdn.discordapp.com/icons/859291380233011220/f4de60c3767e3fb3043f2e4e362d3f12.webp"
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
                            "https://cdn.discordapp.com/icons/859291380233011220/f4de60c3767e3fb3043f2e4e362d3f12.webp"
                        );
                    return await interaction.reply({ embeds: [embed] });
                }
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
