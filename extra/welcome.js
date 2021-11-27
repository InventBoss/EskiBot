const Discord = require("discord.js");
const Canvas = require("canvas");
const moment = require("moment");

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

module.exports = {
    run: async (member) => {
        const canvas = Canvas.createCanvas(700, 350);
        const context = canvas.getContext("2d");

        const background = await Canvas.loadImage(
            "./assets/background/background.png"
        );

        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.fillStyle = "#aafff9";

        context.font = applyText(canvas, 70, member.user.tag);
        context.fillText(`${member.user.tag}`, 205, 70);

        context.fillStyle = "#8e8e8e";

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
        context.fillText(
            "Make sure to read rules. Don't be a piece of shit.",
            canvas.width / 2,
            225
        );

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

        member.guild.channels.cache
            .find((i) => i.name === "welcome")
            .send({
                content: `Welcome to this fine server <@${member.id}> :clap:`,
                files: [attachment],
            });
    },
};
