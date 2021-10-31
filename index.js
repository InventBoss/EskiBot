const clientExtra = require("./extra/client.js");
require("dotenv").config();

const client = clientExtra.createClient();

client.on("ready", async () => {
    client.user.setActivity("the mighty iDenali!", {
        type: "WATCHING",
    });

    console.log(`Logged in as ${client.user.tag}`);
    console.log("-------------Log-------------");
});

clientExtra.startBot(client, process.env["TOKEN"]);
