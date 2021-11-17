const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "inspireme",
    category: "general",
    shortDesc: "`|inpspireme` | Become namaste my dudes\n",
    executeText: (message) => {
        // Fetch from the inspirobot api! I'd recommend you put this url in your browser, then click the link
        fetch("https://inspirobot.me/api?generate=true")
            .then((response) => response.text())
            .then((text) => {
                const embed = new Discord.MessageEmbed()
                    .setColor("#9996ff")
                    .setAuthor(
                        "Inspiration",
                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                    )
                    .setImage(text);
                message.channel.send({ embeds: [embed] });
            });
    },
    slashData: new SlashCommandBuilder()
        .setName("inspireme")
        .setDescription("Wow! Much inspiration"),
    executeSlash: async (interaction) => {
        fetch("https://inspirobot.me/api?generate=true")
            .then((response) => response.text())
            .then((text) => {
                const embed = new Discord.MessageEmbed()
                    .setColor("#9996ff")
                    .setAuthor(
                        "Inspiration",
                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                    )
                    .setImage(text);
                return interaction.reply({ embeds: [embed] });
            });
    },
};
