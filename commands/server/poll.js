const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "poll",
    category: "server",
    shortDesc: "`|poll` | Manage the daily polls\n",
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
            if (args[0] === "post") {
                fs.readFile(
                    "./data/poll.json",
                    "utf-8",
                    async (error, text) => {
                        if (error) {
                            throw error;
                        }

                        let data = JSON.parse(text);

                        const chosenPollNum =
                            Math.floor(
                                Math.random() *
                                    (_.keys(data["polls"]).length - 1 + 1)
                            ) + 1;

                        const chosenPoll =
                            data["polls"][chosenPollNum - 1]["poll"];

                        const channelIds = [
                            859291595671994379n,
                            896071289381470286n,
                        ];

                        for (const channelId of channelIds) {
                            const embed = new Discord.MessageEmbed()
                                .setColor("#8ae9ff")
                                .setTitle("Daily Poll")
                                .setDescription(`${chosenPoll}`);

                            const pollMessage =
                                await message.client.channels.cache
                                    .get(`${channelId}`)
                                    .send({ embeds: [embed] });

                            await pollMessage.react("✔️");
                            await pollMessage.react("❌");
                        }
                    }
                );
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
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("post")
                .setDescription("Post a random poll from the database")
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
            if (interaction.options.getSubcommand() === "post") {
                fs.readFile(
                    "./data/poll.json",
                    "utf-8",
                    async (error, text) => {
                        if (error) {
                            throw error;
                        }

                        let data = JSON.parse(text);

                        const chosenPollNum =
                            Math.floor(
                                Math.random() *
                                    (_.keys(data["polls"]).length - 1 + 1)
                            ) + 1;

                        const chosenPoll =
                            data["polls"][chosenPollNum - 1]["poll"];

                        const channelIds = [
                            859291595671994379n,
                            896071289381470286n,
                        ];

                        for (const channelId of channelIds) {
                            const embed = new Discord.MessageEmbed()
                                .setColor("#8ae9ff")
                                .setTitle("Daily Poll")
                                .setDescription(`${chosenPoll}`);

                            const pollMessage =
                                await interaction.client.channels.cache
                                    .get(`${channelId}`)
                                    .send({ embeds: [embed] });

                            await pollMessage.react("✔️");
                            await pollMessage.react("❌");
                        }
                        await interaction.reply({
                            content: `Post has been sent`,
                            ephemeral: true,
                        });
                    }
                );
            }
        } else {
            await interaction.reply("Sorry but you can't run this command");
        }
    },
};
