const fs = require("fs");
const Discord = require("discord.js");
const _ = require("underscore");

const tick = (client) => {
    const date = new Date();

    if (date.getHours() == 12 && date.getMinutes() == 0) {
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

            const channelIds = [859291595671994379n, 896071289381470286n];

            for (const channelId of channelIds) {
                const role =
                    client.channels.cache.get(`${channelId}`).guild.roles.cache.find(
                        (role) => role.name === "Polls Ping"
                    ) || "";
                
                const embed = new Discord.MessageEmbed()
                    .setColor("#8ae9ff")
                    .setTitle("Daily Poll")
                    .setDescription(`${role} ${chosenPoll}`);

                const pollMessage = await client.channels.cache
                    .get(`${channelId}`)
                    .send({ embeds: [embed] });

                await pollMessage.react("1️⃣");
                await pollMessage.react("2️⃣");
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
