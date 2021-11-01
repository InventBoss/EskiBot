const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

module.exports = {
  name: "reload",
  executeText: (message, args) => {
    if (message.author.id === "617816411750006794") {
      const commandName = args[0].toLowerCase();
      const command = message.client.textCommands.get(commandName);

      if (!command) {
        return message.channel.send(`Could not find \`>${commandName}\``);
      }

      const commandFolders = fs.readdirSync("./commands");
      const folderName = commandFolders.find((folder) =>
        fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`)
      );

      delete require.cache[
        require.resolve(`../${folderName}/${command.name}.js`)
      ];

      try {
        const newCommand = require(`../${folderName}/${command.name}.js`);
        message.client.textCommands.set(newCommand.name, newCommand);
        message.channel.send(`Command \`${command.name}\` was reloaded`);
      } catch (error) {
        console.log("(err) " + error);
        message.channel.send(
          `There was an error while reloading\`>${args[0]}\``
        );
      }
    } else {
      message.channel.send("You do not have permission to run that command!");
    }
  },
  slashData: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload a command")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to reload")
        .setRequired(false)
    ),
  executeSlash: async (interaction) => {
    if (interaction.user.id === "617816411750006794") {
      const commandName = interaction.options.getString("command");
      const command = interaction.client.textCommands.get(commandName);

      if (!command) {
        return interaction.channel.send(`Could not find \`>${commandName}\``);
      }

      const commandFolders = fs.readdirSync("./commands");
      const folderName = commandFolders.find((folder) =>
        fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`)
      );

      delete require.cache[
        require.resolve(`../${folderName}/${command.name}.js`)
      ];

      try {
        const newCommand = require(`../${folderName}/${command.name}.js`);
        interaction.client.textCommands.set(newCommand.name, newCommand);
        return await interaction.reply(
          `Command \`${command.name}\` was reloaded`
        );
      } catch (error) {
        console.log("(err) " + error);
        return await interaction.reply(
          `There was an error while reloading\`>${args[0]}\``
        );
      }
    } else {
      return await interaction.reply(
        "You do not have permission to run that command!"
      );
    }
  },
};
