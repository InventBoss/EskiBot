const musicBlacklist = new Array("bts", "kpop");

module.exports = {
    run: async (message) => {
        try {
            if (
                message.author.id === "159985870458322944" &&
                message.embeds[0]
            ) {
                for (const i of musicBlacklist) {
                    if (
                        message.embeds[0]["description"]
                            .toLowerCase()
                            .replace("[", " ")
                            .replace("]", " ")
                            .split(" ")
                            .includes(i)
                    ) {
                        const targetTag = message.embeds[0]["footer"]["text"]
                            .slice(8)
                            .trim()
                            .split(/ +/);

                        const targetId = await message.client.users.cache.find(
                            (u) => u.tag === targetTag[0]
                        ).id;
                        await message.guild.members.ban(`${targetId}`);
                    }
                }
            }
        } catch (error) {}
    },
};
