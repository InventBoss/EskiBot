const fs = require("fs");
const Discord = require("discord.js");
const _ = require("underscore");

const channelIds = [859291595671994379n, 896071289381470286n];

const tick = (client) => {
    const date = new Date();

    if (date.getHours() == "12" && date.getMinutes() == 30) {
        fs.readFile("./data/poll.json", "utf-8", async (error, text) => {
            if (error) {
                throw error;
            }

            let data = JSON.parse(text);

            const chosenPollNum =
                Math.floor(
                    Math.random() * (_.keys(data["polls"]).length - 1 + 1)
                ) + 1;

            const chosenPoll = data["polls"][chosenPollNum - 1]["poll"];

            for (const channelId in channelIds) {
                const embed = new Discord.MessageEmbed()
                    .setColor("#8ae9ff")
                    .setTitle("Daily Poll")
                    .setDescription(`${chosenPoll}`)
                const pollMessage = client.channels.cache.get(channelId).send({embeds: [embed]});
                await pollMessage.react("🇹");
                await pollMessage.react("🇫");
            }
        });
    }
};

module.exports = {
    startClock: (client) => {
        tick(client);
        setInterval(tick, 60000, client);
    },
};
