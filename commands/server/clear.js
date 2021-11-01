const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "clear",
  executeText: (message, args) => {
    if (!message.guild)
      return message.channel.send(
        "Sorry but I can only do this command in servers."
      );

    if (
      message.member.permissions.has("MANAGE_MESSAGES", {
        checkAdmin: true,
        checkOwner: true,
      }) ||
      message.author.id === 617816411750006794
    ) {
      if (typeof args[0] === "undefined") {
        args[0] = 5;
      }
      try {
        let convertedResult = parseInt(args[0]);
        message.channel.bulkDelete(++convertedResult);
      } catch (error) {
        console.log("<Error>\n" + error);
      }
    }
  },
  slashData: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Bulk delete messages")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("How many messages to delete (default is 5)")
        .setRequired(false)
    ),
  executeSlash: async (interaction) => {
    if (
      interaction.member.permissions.has("MANAGE_MESSAGES", {
        checkAdmin: true,
        checkOwner: true,
      }) ||
      interaction.user.id === 617816411750006794
    ) {
      let number = interaction.options.getInteger("number");

      if (interaction.options.getInteger("number") == null) {
        number = 5;
      }
      try {
        let convertedResult = parseInt(number);
        interaction.channel.bulkDelete(++convertedResult);
        await interaction.reply({
          content: `Delete ${number} messages`,
          ephemeral: true,
        });
      } catch (error) {
        console.log("(err)" + error);
      }
    }
  },
};
