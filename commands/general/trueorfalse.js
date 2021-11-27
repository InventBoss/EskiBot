const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const Discord = require("discord.js");

module.exports = {
    name: "trueorfalse",
    category: "general",
    shortDesc: "`|trueorfalse` | Test your knowledge\n",
    executeText: (message) => {
        const embed = new Discord.MessageEmbed()
            .setAuthor(
                "Loading True or False",
                "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
            )
            .setColor("#2afcb3");

        message.channel.send({ embeds: [embed] }).then((triviaMessage) => {
            fetch(
                "https://opentdb.com/api.php?amount=1&type=boolean&encode=url3986"
            )
                .then((response) => response.json())
                .then(async (json) => {
                    const triviaData = json["results"][0];
                    const correctAnswer = triviaData["correct_answer"];

                    const buttonNameArray = new Array(
                        Math.random().toString(36).substring(10),
                        Math.random().toString(36).substring(10)
                    );

                    const row = new Discord.MessageActionRow().addComponents(
                        new Discord.MessageButton()
                            .setCustomId(buttonNameArray[0])
                            .setLabel("True")
                            .setStyle("SUCCESS"),
                        new Discord.MessageButton()
                            .setCustomId(buttonNameArray[1])
                            .setLabel("False")
                            .setStyle("DANGER")
                    );

                    const embed = new Discord.MessageEmbed()
                        .setAuthor(
                            "True or False | Question",
                            "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                        )
                        .setDescription(
                            `**${decodeURIComponent(triviaData["question"])}**`
                        )
                        .setFooter(
                            `${decodeURIComponent(triviaData["category"])} | ${
                                triviaData["difficulty"][0].toUpperCase() +
                                triviaData["difficulty"].substring(1)
                            }`
                        )
                        .setColor("#2afcb3");

                    triviaMessage.edit({ embeds: [embed], components: [row] });

                    const filter = (buttonInteraction) => {
                        if (buttonInteraction.user.id === message.author.id)
                            return true;
                        return false;
                    };

                    const collector =
                        triviaMessage.createMessageComponentCollector({
                            filter,
                            time: 10000,
                        });

                    collector.on("collect", async (buttonInteraction) => {
                        await buttonInteraction.deferUpdate();
                    });

                    collector.on("end", (collected) => {
                        const collectedArray = Array.from(collected);

                        if (!collectedArray.length) {
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(
                                    "True or False | Answer",
                                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                                )
                                .setDescription(
                                    `**You Didn't write anything down**\n\n*"${decodeURIComponent(
                                        triviaData["question"]
                                    )}"*\nis **${correctAnswer}**`
                                )
                                .setFooter(
                                    `${decodeURIComponent(
                                        triviaData["category"]
                                    )} | ${
                                        triviaData[
                                            "difficulty"
                                        ][0].toUpperCase() +
                                        triviaData["difficulty"].substring(1)
                                    }`
                                )
                                .setColor("#2afcb3");

                            triviaMessage.edit({ embeds: [embed] });
                        } else if (correctAnswer === "True") {
                            if (
                                collectedArray[collected.size - 1][1]
                                    .customId === buttonNameArray[0]
                            ) {
                                const embed = new Discord.MessageEmbed()
                                    .setAuthor(
                                        "True or False | Answer",
                                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                                    )
                                    .setDescription(
                                        `**You are correct**\n\n*"${decodeURIComponent(
                                            triviaData["question"]
                                        )}"*\nis **${correctAnswer}**`
                                    )
                                    .setFooter(
                                        `${decodeURIComponent(
                                            triviaData["category"]
                                        )} | ${
                                            triviaData[
                                                "difficulty"
                                            ][0].toUpperCase() +
                                            triviaData["difficulty"].substring(
                                                1
                                            )
                                        }`
                                    )
                                    .setColor("#2afcb3");

                                triviaMessage.edit({ embeds: [embed] });
                            } else {
                                const embed = new Discord.MessageEmbed()
                                    .setAuthor(
                                        "True or False | Answer",
                                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                                    )
                                    .setDescription(
                                        `**Sorry, that's wrong**\n\n*"${decodeURIComponent(
                                            triviaData["question"]
                                        )}"*\nis **${correctAnswer}**`
                                    )
                                    .setFooter(
                                        `${decodeURIComponent(
                                            triviaData["category"]
                                        )} | ${
                                            triviaData[
                                                "difficulty"
                                            ][0].toUpperCase() +
                                            triviaData["difficulty"].substring(
                                                1
                                            )
                                        }`
                                    )
                                    .setColor("#2afcb3");

                                triviaMessage.edit({ embeds: [embed] });
                            }
                        } else {
                            if (
                                collectedArray[collected.size - 1][1]
                                    .customId === buttonNameArray[1]
                            ) {
                                const embed = new Discord.MessageEmbed()
                                    .setAuthor(
                                        "True or False | Answer",
                                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                                    )
                                    .setDescription(
                                        `**You are correct**\n\n*"${decodeURIComponent(
                                            triviaData["question"]
                                        )}"*\nis **${correctAnswer}**`
                                    )
                                    .setFooter(
                                        `${decodeURIComponent(
                                            triviaData["category"]
                                        )} | ${
                                            triviaData[
                                                "difficulty"
                                            ][0].toUpperCase() +
                                            triviaData["difficulty"].substring(
                                                1
                                            )
                                        }`
                                    )
                                    .setColor("#2afcb3");

                                triviaMessage.edit({ embeds: [embed] });
                            } else {
                                const embed = new Discord.MessageEmbed()
                                    .setAuthor(
                                        "True or False | Answer",
                                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                                    )
                                    .setDescription(
                                        `**Sorry, that's wrong**\n\n*"${decodeURIComponent(
                                            triviaData["question"]
                                        )}"*\nis **${correctAnswer}**`
                                    )
                                    .setFooter(
                                        `${decodeURIComponent(
                                            triviaData["category"]
                                        )} | ${
                                            triviaData[
                                                "difficulty"
                                            ][0].toUpperCase() +
                                            triviaData["difficulty"].substring(
                                                1
                                            )
                                        }`
                                    )
                                    .setColor("#2afcb3");

                                triviaMessage.edit({ embeds: [embed] });
                            }
                        }
                    });
                });
        });
    },
    slashData: new SlashCommandBuilder()
        .setName("trueorfalse")
        .setDescription(
            "Do you know stuff? The answer is no! Learn stuff here."
        ),
    executeSlash: async (interaction) => {
        const embed = new Discord.MessageEmbed()
            .setAuthor(
                "Loading True or False",
                "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
            )
            .setColor("#2afcb3");

        interaction.reply({ embeds: [embed] }).then(async () => {
            fetch(
                "https://opentdb.com/api.php?amount=1&type=boolean&encode=url3986"
            )
                .then((response) => response.json())
                .then(async (json) => {
                    const triviaData = json["results"][0];
                    const correctAnswer = triviaData["correct_answer"];

                    const buttonNameArray = new Array(
                        Math.random().toString(36).substring(10),
                        Math.random().toString(36).substring(10)
                    );

                    const row = new Discord.MessageActionRow().addComponents(
                        new Discord.MessageButton()
                            .setCustomId(buttonNameArray[0])
                            .setLabel("True")
                            .setStyle("SUCCESS"),
                        new Discord.MessageButton()
                            .setCustomId(buttonNameArray[1])
                            .setLabel("False")
                            .setStyle("DANGER")
                    );

                    const embed = new Discord.MessageEmbed()
                        .setAuthor(
                            "True or False | Question",
                            "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                        )
                        .setDescription(
                            `**${decodeURIComponent(triviaData["question"])}**`
                        )
                        .setFooter(
                            `${decodeURIComponent(triviaData["category"])} | ${
                                triviaData["difficulty"][0].toUpperCase() +
                                triviaData["difficulty"].substring(1)
                            }`
                        )
                        .setColor("#2afcb3");

                    interaction.editReply({
                        embeds: [embed],
                        components: [row],
                    });

                    const filter = (buttonInteraction) => {
                        if (buttonInteraction.user.id === interaction.member.id)
                            return true;
                        return false;
                    };
                    const interactionMessage = await interaction.fetchReply();
                    const collector =
                        interactionMessage.createMessageComponentCollector({
                            filter,
                            time: 10000,
                        });

                    collector.on("collect", async (buttonInteraction) => {
                        await buttonInteraction.deferUpdate();
                    });

                    collector.on("end", (collected) => {
                        const collectedArray = Array.from(collected);

                        if (!collectedArray.length) {
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(
                                    "True or False | Answer",
                                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                                )
                                .setDescription(
                                    `**You Didn't write anything down**\n\n*"${decodeURIComponent(
                                        triviaData["question"]
                                    )}"*\nis **${correctAnswer}**`
                                )
                                .setFooter(
                                    `${decodeURIComponent(
                                        triviaData["category"]
                                    )} | ${
                                        triviaData[
                                            "difficulty"
                                        ][0].toUpperCase() +
                                        triviaData["difficulty"].substring(1)
                                    }`
                                )
                                .setColor("#2afcb3");

                            interaction.editReply({ embeds: [embed] });
                        } else if (correctAnswer === "True") {
                            if (
                                collectedArray[collected.size - 1][1]
                                    .customId === buttonNameArray[0]
                            ) {
                                const embed = new Discord.MessageEmbed()
                                    .setAuthor(
                                        "True or False | Answer",
                                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                                    )
                                    .setDescription(
                                        `**You are correct**\n\n*"${decodeURIComponent(
                                            triviaData["question"]
                                        )}"*\nis **${correctAnswer}**`
                                    )
                                    .setFooter(
                                        `${decodeURIComponent(
                                            triviaData["category"]
                                        )} | ${
                                            triviaData[
                                                "difficulty"
                                            ][0].toUpperCase() +
                                            triviaData["difficulty"].substring(
                                                1
                                            )
                                        }`
                                    )
                                    .setColor("#2afcb3");

                                interaction.editReply({ embeds: [embed] });
                            } else {
                                const embed = new Discord.MessageEmbed()
                                    .setAuthor(
                                        "True or False | Answer",
                                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                                    )
                                    .setDescription(
                                        `**Sorry, that's wrong**\n\n*"${decodeURIComponent(
                                            triviaData["question"]
                                        )}"*\nis **${correctAnswer}**`
                                    )
                                    .setFooter(
                                        `${decodeURIComponent(
                                            triviaData["category"]
                                        )} | ${
                                            triviaData[
                                                "difficulty"
                                            ][0].toUpperCase() +
                                            triviaData["difficulty"].substring(
                                                1
                                            )
                                        }`
                                    )
                                    .setColor("#2afcb3");

                                interaction.editReply({ embeds: [embed] });
                            }
                        } else {
                            if (
                                collectedArray[collected.size - 1][1]
                                    .customId === buttonNameArray[1]
                            ) {
                                const embed = new Discord.MessageEmbed()
                                    .setAuthor(
                                        "True or False | Answer",
                                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                                    )
                                    .setDescription(
                                        `**You are correct**\n\n*"${decodeURIComponent(
                                            triviaData["question"]
                                        )}"*\nis **${correctAnswer}**`
                                    )
                                    .setFooter(
                                        `${decodeURIComponent(
                                            triviaData["category"]
                                        )} | ${
                                            triviaData[
                                                "difficulty"
                                            ][0].toUpperCase() +
                                            triviaData["difficulty"].substring(
                                                1
                                            )
                                        }`
                                    )
                                    .setColor("#2afcb3");

                                interaction.editReply({ embeds: [embed] });
                            } else {
                                const embed = new Discord.MessageEmbed()
                                    .setAuthor(
                                        "True or False | Answer",
                                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                                    )
                                    .setDescription(
                                        `**Sorry, that's wrong**\n\n*"${decodeURIComponent(
                                            triviaData["question"]
                                        )}"*\nis **${correctAnswer}**`
                                    )
                                    .setFooter(
                                        `${decodeURIComponent(
                                            triviaData["category"]
                                        )} | ${
                                            triviaData[
                                                "difficulty"
                                            ][0].toUpperCase() +
                                            triviaData["difficulty"].substring(
                                                1
                                            )
                                        }`
                                    )
                                    .setColor("#2afcb3");

                                interaction.editReply({ embeds: [embed] });
                            }
                        }
                    });
                });
        });
    },
};
