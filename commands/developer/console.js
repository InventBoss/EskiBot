const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const Canvas = require("canvas");
const moment = require("moment");

module.exports = {
    name: "console",
    category: "dev",
    executeText: async (message, args) => {
        if (!message.author.id === "617816411750006794") return;

        if (args[0] === "say") {
            if (!message.guild)
                return message.channel.send(
                    "Sorry but I can only do this command in servers."
                );

            // Code used to echo the input after the subcommand is ran
            message.channel.bulkDelete(1).then(() => {
                let finalMessage = args.slice(1).join(" ");
                message.channel.send(finalMessage);
            });
        }
        if (args[0] === "server") {
            if (!message.guild)
                return message.channel.send(
                    "Sorry but I can only do this command in servers."
                );

            if (args[1] === "icon") {
                const embed = new Discord.MessageEmbed()
                    .setColor("#ccfeff")
                    .setAuthor(
                        "Here you go my dude",
                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                    )
                    .setImage(message.channel.guild.iconURL());
                return message.channel.send({ embeds: [embed] });
            } else if (args[1] === "members") {
                const memberCount = message.channel.guild.memberCount;

                const embed = new Discord.MessageEmbed()
                    .setColor("#ccfeff")
                    .setAuthor(
                        `We Have ${memberCount} Members`,
                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                    );
                return message.channel.send({ embeds: [embed] });
            }
        }
        if (args[0] === "nick") {
            if (!message.guild.me.permissions.has("MANAGE_NICKNAMES"))
                return message.channel.send(
                    "Sorry but I don't have permission father"
                );

            const newNick = args.slice(1).join(" ");

            message.guild.me.setNickname(newNick);
            const embed = new Discord.MessageEmbed()
                .setColor("#ccfeff")
                .setAuthor(
                    `Set nick to ${newNick}`,
                    "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                );
            return message.channel.send({ embeds: [embed] });
        }
        if (args[0] === "test") {
            function roundRect(ctx, x, y, width, height, radius) {
                if (typeof radius === "undefined") {
                    radius = 5;
                }
                if (typeof radius === "number") {
                    radius = { tl: radius, tr: radius, br: radius, bl: radius };
                } else {
                    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
                    for (var side in defaultRadius) {
                        radius[side] = radius[side] || defaultRadius[side];
                    }
                }
                ctx.beginPath();
                ctx.moveTo(x + radius.tl, y);
                ctx.lineTo(x + width - radius.tr, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
                ctx.lineTo(x + width, y + height - radius.br);
                ctx.quadraticCurveTo(
                    x + width,
                    y + height,
                    x + width - radius.br,
                    y + height
                );
                ctx.lineTo(x + radius.bl, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
                ctx.lineTo(x, y + radius.tl);
                ctx.quadraticCurveTo(x, y, x + radius.tl, y);
                ctx.closePath();
                ctx.fill();
            }
            const applyText = (canvas, size, text) => {
                const context = canvas.getContext("2d");
                let fontSize = size;

                do {
                    context.font = `${(fontSize -= 10)}px Jetbrains Mono`;
                } while (context.measureText(text).width > canvas.width - 200);

                return context.font;
            };
            const member = message.member;

            const canvas = Canvas.createCanvas(700, 350);
            const context = canvas.getContext("2d");

            const background = await Canvas.loadImage(
                "./assets/background/background.png"
            );

            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            context.fillStyle = "#aafff9";

            context.font = applyText(canvas, 70, member.user.tag);
            context.fillText(`${member.user.tag}`, 205, 70);

            context.fillStyle = "#8e8e8e"
            
            context.font = `18px Jetbrains Mono`;
            context.fillText(
                `Joined at ${moment(member.joinedAt).format(
                    "MMMM Do YYYY, h:mm a"
                )}`,
                210,
                110
            );

            context.fillText(
                `Created at ${moment(member.user.createdAt).format(
                    "MMMM Do YYYY, h:mm a"
                )}`,
                210,
                140
            );            

            context.font = `21px Jetbrains Mono`;
            context.textAlign = "center";
            context.fillText("Make sure to read rules. Don't be a piece of shit.", canvas.width / 2, 225);

            context.fillStyle = "#ffffff";

            context.font = `38px Jetbrains Mono`;
            context.fillText(
                "And don't forget to have fun!",
                canvas.width / 2,
                285
            );

            context.fillStyle = "#aafff9";

            roundRect(
                context,
                50,
                canvas.height / 2 - 5,
                canvas.width - 100,
                10,
                5
            );
            context.fillStyle = "#ffffff";

            context.beginPath();
            context.arc(120, 80, 70, 0, 2 * Math.PI);
            context.fill();

            context.beginPath();
            context.arc(120, 80, 65, 0, 2 * Math.PI, true);
            context.closePath();
            context.clip();

            const avatar = await Canvas.loadImage(
                member.user.displayAvatarURL({ format: "png" })
            );
            context.drawImage(avatar, 55, 15, 130, 130);

            const attachment = new Discord.MessageAttachment(
                canvas.toBuffer(),
                "profile.png"
            );

            return message.channel.send({
                content: `Welcome to this fine server <@${member.id}> :clap:`,
                files: [attachment],
            });
        }
    },
    slashData: new SlashCommandBuilder()
        .setName("console")
        .setDescription("A developer command for InventBoss")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("say")
                .setDescription("Violate my free speech")
                .addStringOption((option) =>
                    option
                        .setName("input")
                        .setDescription("Insert Violation")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("server")
                .setDescription("Get info about a server")
                .addStringOption((option) =>
                    option
                        .setName("data")
                        .setDescription("What data can I get for you today?")
                        .setRequired(true)
                        .addChoice("Icon", "icon")
                        .addChoice("Server Id", "id")
                        .addChoice("Member Count", "members")
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("nick")
                .setDescription('Change my name "legally"')
                .addStringOption((option) =>
                    option
                        .setName("name")
                        .setDescription(
                            "What I will be smuggled into America as"
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("test")
                .setDescription("InventBoss tests with this")
        ),
    executeSlash: async (interaction) => {
        if (interaction.user.id === "617816411750006794") {
            if (interaction.options.getSubcommand() === "say") {
                return await interaction.reply(
                    interaction.options.getString("input")
                );
            } else if (interaction.options.getSubcommand() === "test") {
            } else if (interaction.options.getSubcommand() === "server") {
                if (interaction.options.getString("data") === "icon") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("#ccfeff")
                        .setAuthor(
                            "Here You Go My Dude",
                            "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                        )
                        .setImage(interaction.guild.iconURL());
                    return await interaction.reply({ embeds: [embed] });
                } else if (interaction.options.getString("data") === "id") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("#ccfeff")
                        .setAuthor(
                            `The Server ID is ${interaction.guild.id}`,
                            "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                        );
                    return await interaction.reply({ embeds: [embed] });
                } else if (
                    interaction.options.getString("data") === "members"
                ) {
                    const memberCount = interaction.guild.memberCount;

                    const embed = new Discord.MessageEmbed()
                        .setColor("#ccfeff")
                        .setAuthor(
                            `We Have ${memberCount} Members`,
                            "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                        );
                    return await interaction.reply({ embeds: [embed] });
                }
            }
            if (interaction.options.getSubcommand() === "nick") {
                if (!interaction.guild.me.permissions.has("MANAGE_NICKNAMES"))
                    return interaction.reply(
                        "Sorry but I don't have permission father"
                    );

                const newNick = interaction.options.getString("name");

                interaction.guild.me.setNickname(newNick);
                const embed = new Discord.MessageEmbed()
                    .setColor("#ccfeff")
                    .setAuthor(
                        `Set nick to ${newNick}`,
                        "https://cdn.discordapp.com/attachments/883560212563386428/906225307063836732/EB.png"
                    );
                return interaction.reply({ embeds: [embed] });
            }
            return await interaction.reply({
                content:
                    "Looks like nothing happened... Might wanna check that.",
                ephemeral: true,
            });
        }
        return await interaction.reply("You're not my father >:(");
    },
};
