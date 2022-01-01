const {
	Client,
	MessageEmbed,
	Intents
} = require("discord.js");
require("dotenv").config();
const request = require("request");
const express = require("express");
const app = express();
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
});
// const { CommandInt } = require("./modules/CommandInt.js");
// const AutoMod = require("./modules/AutoMod.js");
client.on("ready", readyHandler);
client.on("interactionCreate", interactionHandler);
client.on("messageCreate", scanMsg);
client.on("guildMemberAdd", memberJoinHandler);
client.on("messageUpdate", scanMsg);

const config = require("./config.json");
const bannedWords = config.bannedWords;
const regex = new RegExp(`(${bannedWords})`, "i");
const {
	Templates
} = require("./modules/Templates.js");

function scanMsg(msg, newMsg) {
	if (msg.author.bot) return;
	if (regex.test(msg.content || newMsg.content)) {
		let msgCnt = msg.content;
		msg.delete();
		msg.author.send({
			embeds: [automodTemplate(msg, msgCnt)]
		});
		console.log(`${msg.author.tag} can be MODERATED: ${msg.member.moderatable}, MANAGED: ${msg.member.manageable}`)
		if (msg.member.moderatable && msg.member.manageable) {
			msg.member.timeout(5000, `Using a blacklisted term`);
		}
		client.guilds.fetch("863849951469633546").then(srv => {
			srv.channels.fetch("891799774498529290").then(chnl => {
				chnl.send({
					embeds: [loggingTemplate(msg, "AutoMod", "Message Matched Filter", msg.author.tag, client.user.tag)]
				});
			})
		})
	}
}

function acntLinkHandler(data) {

}
function memberJoinHandler(usr) {
	usr.send({embeds:[acntLinkTemplate(usr)]});
}

function readyHandler() {
	console.log(`Logged in as ${client.user.tag}`);
	console.log(
		`Currently serving ${client.guilds.cache.size} guilds, with a total of ${
      client.channels.cache.size
    } channels, with ${client.guilds.cache.reduce(
      (a, g) => a + g.memberCount,
      0
    )} total users.`
	);

	const responses = [
		`${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} epic people`,
		`Everything you do`,
		`The Entity's Realm`,
		`r00tkitt on Twitch`,
		`God Damn It Demonitized`
	];
	const responsesType = [
		`WATCHING`,
		`WATCHING`,
		`COMPETING`,
		`STREAMING`,
		`LISTENING`
	];
	var number = 0;

	function randomizer() {
		if (number == responses.length - 1) {
			number = -1;
		}
		number++;
		let GameActivity = responses[number];
		let GameActivityType = responsesType[number];
		client.user.setActivity(GameActivity, {
			type: GameActivityType,
			url: "https://twitch.tv/r00tkitt"
		});
		client.user.setStatus("online");
	}
	setInterval(randomizer, 10000);

	client.user.setStatus("online");

	let fetchCmdOpts = {
		method: "GET",
		url: "https://discord.com/api/applications/576945188186882049/commands",
		headers: {
			authorization: `Bot ${process.env.CHEESE}`
		}
	};
	request(fetchCmdOpts, function (error, response, body) {
		if (error) console.warn(new Error(error));
		// console.log(response);
		console.log(body);
	});
	cmdCreate();
}

function warnTemplate(int) {
	let embedOut = new MessageEmbed()
		.setTitle(`WARNING`)
		.setDescription(
			`You have been warned in **${int.guild.name}**. Details are listed below`
		)
		.addField(`Moderator Involved`, `\`${int.user.tag}\``)
		.addField(`Reason`, `\`${int.options.getString("reason")}\``)
		.setTimestamp(new Date())
		.setColor("#ffdd00")
		.setFooter(
			`If you wish to dispute this infraction, please contact an Admin`
		);
	return embedOut;
}

function banTemplate(int) {
	let banDur;

	if (int.options.getInteger("duration") != null) {
		banDur = int.options.getInteger("duration");
	} else {
		banDur = Date.now() + 3155692600;
	}
	let embedOut = new MessageEmbed()
		.setTitle(`BANNED`)
		.setDescription(
			`You have been banned from **${int.guild.name}**. Details are listed below`
		)
		.addField(`Moderator Involved`, `\`${int.user.tag}\``)
		.addField(`Reason`, `\`${int.options.getString("reason")}\``)
		.addField(`Time until unban (if applicable)`, `<t:${banDur}:R>`)
		.setTimestamp(new Date())
		.setColor("#ff0000")
		.setFooter(
			`If you wish to dispute this infraction, please contact an Admin`
		);
	return embedOut;
}

function muteTemplate(int) {
	let muteDur;

	if (int.options.getInteger("duration") != null) {
		muteDur = int.options.getInteger("duration");
	} else {
		muteDur = Date.now() + 3155692600;
	}
	let embedOut = new MessageEmbed()
		.setTitle(`MUTED`)
		.setDescription(
			`You have been muted in **${int.guild.name}**. Details are listed below`
		)
		.addField(`Moderator Involved`, `\`${int.user.tag}\``)
		.addField(`Reason`, `\`${int.options.getString("reason")}\``)
		.addField(`Time until unmute (if applicable)`, `<t:${muteDur}:R>`)
		.setTimestamp(new Date())
		.setColor("#ff9500")
		.setFooter(
			`If you wish to dispute this infraction, please contact an Admin`
		);
	return embedOut;
}

function kickTemplate(int) {
	let embedOut = new MessageEmbed()
		.setTitle(`KICKED`)
		.setDescription(
			`You have been kicked from **${int.guild.name}**. Details are listed below`
		)
		.addField(`Moderator Involved`, `\`${int.user.tag}\``)
		.addField(`Reason`, `\`${int.options.getString("reason")}\``)
		.setTimestamp(new Date())
		.setColor("#ff5100")
		.setFooter(
			`If you wish to dispute this infraction, please contact an Admin`
		);
	return embedOut;
};

function automodTemplate(int, msgCnt) {
	let embedOut = new MessageEmbed()
		.setTitle(`AutoMod`)
		.setDescription(`Your message has been deleted from **${int.guild.name}** for the following reasons:`)
		.addField(`Reason`, "`Message matched Regex`")
		.addField(`Message Content`, `\`${msgCnt}\``)
		.setTimestamp(new Date())
		.setColor("#34e1eb")
		.setFooter(
			`If you wish to dispute this infraction, please contact an Admin`
		);
	return embedOut;
}

function loggingTemplate(int, logType, reason, user, infractionAuthor) {
	let embedOut = new MessageEmbed()
		.setTitle(`Moderation Logs`)
		.addField(`Log Type`, `\`${logType}\``)
		.addField(`Reason`, `\`${reason}\``)
		.addField(`User`, `\`${user}\``)
		.addField(`Moderator Involved`, `\`${infractionAuthor}\``)
		.setTimestamp(new Date())
		.setColor("#34e1eb");
	return embedOut;
}

function reportTemplate(int) {
	let embedOut = new MessageEmbed()
		.setTitle(`User Report`)
		.addField(`Report Author`, `\`${int.user.tag}\``)
		.addField(`User Being Reported`, `\`${int.options.getUser("user").tag}\``)
		.addField(`Reason`, `\`${int.options.getString("reason")}\``)
		.setTimestamp(new Date())
		.setColor("#34e1eb");
	return embedOut;
}

function acntLinkTemplate(member) {
	let embedOut = new MessageEmbed()
	.setTitle(`Welcome to the server!`)
	.setDescription(`Welcome to ${member.guild.name}! \\n \\n
	 To Verify your account, please click the URL below to link your Twitch and Discord. \\n \\n \\n
	 If you are unable to link your accounts, please contact **DEMONITIZED BOI#6969** for help \\n \\n
	 https://discord.com/api/oauth2/authorize?client_id=576945188186882049&redirect_uri=https%3A%2F%2Fdemonitize.github.io%2Fdemonitize%2Fapi%2Fr00tkitt%2Fauth&response_type=code&scope=identify%20connections%20guilds`)
	.setTimestamp(new Date())
	.setColor("#9714d9");
return embedOut;
}

async function interactionHandler(int) {
	let userId;
	switch (int.commandId) {
		case `917569703134777385`:
			await int.deferReply();
			await int.options
				.getUser("user")
				.send({
					embeds: [await warnTemplate(int)]
				});
			await int.editReply(`Warned ${int.options.getUser("user").tag}`);
			await client.guilds.fetch("863849951469633546").then(srv => {
				srv.channels.fetch("891799774498529290").then(chnl => {
					chnl.send({
						embeds: [loggingTemplate(int, "Warning", int.options.getString("reason"), int.options.getUser("user").tag, int.user.tag)]
					});
				})
			})
			break;
		case `917570577022222386`:
			await int.deferReply();
			await int.options
				.getUser("user")
				.send({
					embeds: [await muteTemplate(int)]
				});
			await int.editReply(`Muted ${int.options.getUser("user").tag}`);
			await client.guilds.fetch("863849951469633546").then(srv => {
				srv.channels.fetch("891799774498529290").then(chnl => {
					chnl.send({
						embeds: [loggingTemplate(int, "Mute", int.options.getString("reason"), int.options.getUser("user").tag, int.user.tag)]
					});
				})
			})
			break;
		case `917874631984152596`:
			await int.deferReply();
			if (int.guild.members.fetch(int.options.getUser("user").id).then(usr => {
					if (usr.moderatable && usr.manageable) return true;
				})) {
				await int.guild.members.ban(int.options.getUser("user").id, {
					reason: int.options.getString("reason")
				});
				await int.options
					.getUser("user")
					.send({
						embeds: [await banTemplate(int)]
					});
				await int.editReply(`Banned ${int.options.getUser("user").tag}`);
				await client.guilds.fetch("863849951469633546").then(srv => {
					srv.channels.fetch("891799774498529290").then(chnl => {
						chnl.send({
							embeds: [loggingTemplate(int, "Ban", int.options.getString("reason"), int.options.getUser("user").tag, int.user.tag)]
						});
					})
				})
			} else {
				await int.editReply(`**ERROR!** My role isn't high enough to manage this user, or I lack permissions.`);
			}

			break;
		case `917874961622900746`:
			await int.deferReply();
			await int.options
				.getUser("user")
				.send({
					embeds: [await kickTemplate(int)]
				});
			await int.editReply(`Kicked ${int.options.getUser("user").tag}`);
			await client.guilds.fetch("863849951469633546").then(srv => {
				srv.channels.fetch("891799774498529290").then(chnl => {
					chnl.send({
						embeds: [loggingTemplate(int, "Kick", int.options.getString("reason"), int.options.getUser("user").tag, int.user.tag)]
					});
				})
			})
			break;
		case `917897306039263253`:
			await int.deferReply({
				ephemeral: true
			});
			await client.guilds.fetch("863849951469633546").then(srv => {
				srv.channels.fetch("909878667121918013").then(chnl => {
					chnl.send({
						embeds: [reportTemplate(int)]
					});
				})
			})
			await int.editReply({
				content: `Reported ${int.options.getUser("user").tag} to the moderation team. Thank you for your report!`,
				ephemeral: true
			});
			break;
	}
}

function cmdCreate() {
	// client.application.commands
	// 	.create({
	// 		name: "report",
	// 		description: "Reports someone to the mod team",
	// 		options: [{
	// 				name: "user",
	// 				description: "The user you are reporting",
	// 				type: "USER",
	// 				required: true
	// 			},
	// 			{
	// 				name: "reason",
	// 				description: "The reason you are reporting them for",
	// 				type: "STRING",
	// 				required: true
	// 			}
	// 		]
	// 	})
	// .then(data => {
	//   client.application.commands.permissions.set({
	//     command: data.id,
	//     guild: "863849951469633546",
	//     permissions: [
	//       {
	//         id: "864009976669012008",
	//         permission: true,
	//         type: "ROLE"
	//       },
	//       {
	//         id: "864011100843802633",
	//         permission: true,
	//         type: "ROLE"
	//       },
	//       {
	//         id: "864010371333619723",
	//         permission: true,
	//         type: "ROLE"
	//       }
	//     ]
	//   });
	// });
}

app.use(express.static("public"));




app.post("/api/verify", (req, res) => {
	request.post({url:"https://discord.com/api/oauth2/token", form: {client_id:'576945188186882049',client_secret:process.env.CLIENT_SECRET, grant_type:"authorization_code",code:req.query.code, redirect_uri:"https://chr00tkitt.herokuapp.com/api/verify"}}, function (error, response, body) {
		if (error) console.warn(new Error(error));
		// console.log(response);
		console.log(body);
	});
});

app.listen(8080)

client.login(process.env.CHEESE);
