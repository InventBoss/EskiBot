const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    name: "user",
    category: "general",
    hasPerms: false,
    shortDesc: "`|user` | Get info about people you don't know\n",
    executeText: (message, args) => {
        // Use this code if you wanna grab the users GuildMember object for text commands
        const chosenUser =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member

        const embed = new Discord.MessageEmbed()
            .setColor("#85a7ff")
            .setAuthor(
                `User | ${chosenUser.user.tag}`,
                chosenUser.user.displayAvatarURL()
            )
            .setDescription(
                `**Here's some info about ${chosenUser.user.tag}**\n\nId | **${
                    chosenUser.id
                }**\nJoined Server | **${moment(chosenUser.joinedAt).format(
                    "LLLL"
                )}**\nCreated Account | **${moment(
                    chosenUser.user.createdAt
                ).format("LLLL")}**`
            );

        message.channel.send({ embeds: [embed] });
    },
    slashData: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get a bunch of info on people")
        .addMentionableOption((option) =>
            option
                .setName("person")
                .setDescription(
                    "Choose who to immediately violate their privacy"
                )
                .setRequired(true)
        ),
    executeSlash: async (interaction) => {
        const chosenUser = await interaction.guild.members.cache.get(
            await interaction.options.getMentionable("person").id
        );

        const embed = new Discord.MessageEmbed()
            .setColor("#85a7ff")
            .setAuthor(
                `User | ${chosenUser.user.tag}`,
                chosenUser.user.displayAvatarURL()
            )
            .setDescription(
                `**Here's some info about ${chosenUser.user.tag}**\n\nId | **${
                    chosenUser.id
                }**\nJoined Server | **${moment(chosenUser.joinedAt).format(
                    "LLLL"
                )}**\nCreated Account | **${moment(
                    chosenUser.user.createdAt
                ).format("LLLL")}**`
            );

        return await interaction.reply({ embeds: [embed] });
    },
};
