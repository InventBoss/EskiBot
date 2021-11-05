const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "poll",
    executeText: (message, args) => {
        if (!message.guild)
            return message.channel.send(
                "Sorry but I can only do this command in servers."
            );

        if (
            message.member.permissions.has("ADMINISTRATOR", {
                checkAdmin: true,
                checkOwner: true,
            }) ||
            message.author.id === 617816411750006794n
        ) {
            if (args[0] === "add") {
                fs.readFile("./data/poll.json", "utf-8", (error, text) => {
                    if (error) {
                        throw error;
                    }

                    let data = JSON.parse(text);

                    const sentPoll = args.slice(1).join(" ");

                    data["polls"].push({
                        poll: sentPoll,
                    });

                    text = JSON.stringify(data, null, 4);

                    fs.writeFile("./data/poll.json", text, (error) => {
                        if (error) {
                            throw error;
                        }

                        const embed = new Discord.MessageEmbed()
                            .setColor("#ccfeff")
                            .setAuthor(
                                `Added poll to the database`,
                                "https://cdn.discordapp.com/attachments/896071289884778556/906225556767510538/EB.png"
                            );
                        message.channel.send({ embeds: [embed] });
                    });
                });
            }
        } else {
            message.channel.send("Sorry but you can't run this command");
        }
    },
    slashData: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Use to manage the daily polls")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Add a true/false poll to the database")
                .addStringOption((option) =>
                    option
                        .setName("poll")
                        .setDescription("Insert new poll here")
                        .setRequired(true)
                )
        ),
    executeSlash: async (interaction) => {
        if (
            interaction.member.permissions.has("ADMINISTRATOR", {
                checkAdmin: true,
                checkOwner: true,
            }) ||
            interaction.author.id === 617816411750006794n
        ) {
            if (interaction.options.getSubcommand() === "add") {
                fs.readFile("./data/poll.json", "utf-8", (error, text) => {
                    if (error) {
                        throw error;
                    }

                    let data = JSON.parse(text);

                    const sentPoll = interaction.options.getString("poll");

                    data["polls"].push({
                        poll: sentPoll,
                    });

                    text = JSON.stringify(data, null, 4);

                    fs.writeFile("./data/poll.json", text, async (error) => {
                        if (error) {
                            throw error;
                        }

                        const embed = new Discord.MessageEmbed()
                        .setColor("#ccfeff")
                        .setAuthor(
                            `Added poll to the database`,
                            "https://cdn.discordapp.com/attachments/896071289884778556/906225556767510538/EB.png"
                        );
                        return await interaction.reply({ embeds: [embed] });
                    });
                });
            }
        } else {
            await interaction.reply("Sorry but you can't run this command");
        }
    },
};
