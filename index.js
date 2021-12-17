const Discord = require("discord.js");
const clientExtra = require("./extra/clientExtra.js");
const messageFeatures = require("./extra/messageFeatures.js")
const time = require("./extra/time.js");
const welcome = require("./extra/welcome.js");
require("dotenv").config();

/*
Welcome to the EskiBot source code!
Now I don't like to comment code, so I'm gonna put out some ground rules for that:

- I will usually not comment code in the slash command data and the text command data, just the text.
- I will usually only comment code that is interesting/helpful, so no "This subcommand blah blah blah".
- I won't comment on the command's slash command registering code bc you guys can figure it out.

And that should be it for now!
*/

const client = clientExtra.createClient();

// Runs when the client is logged into the given account
client.on("ready", async () => {
    client.user.setActivity("the mighty iDenali!", {
        type: "WATCHING",
    });

    // Initialize text commands
    client.textCommands = new Discord.Collection();
    client.textCommands = clientExtra.registerTextCommands(client);

    // Initialize slash commands
    clientExtra.registerSlashCommands(client);

    // Register the permissions
    clientExtra.registerslashPermissions(client)

    // Begin the poll timer
    time.startClock(client);

    console.log(`-Successfully Logged in as ${client.user.tag}\n`);
});

// Used to run text commands
client.on("messageCreate", (message) => {
    messageFeatures.run(message)
    clientExtra.executeTextCommand(client, message);
});

// Used to run slash commands
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand())
        return clientExtra.executeSlashCommand(interaction);
});

// Used to rip-off the MEE6 welcome feature
client.on("guildMemberAdd", async (member) => {
    welcome.run(member)
})

clientExtra.startBot(client, process.env["TOKEN"]);
