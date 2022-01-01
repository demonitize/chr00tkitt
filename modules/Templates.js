const {MessageEmbed} = require("discord.js");

class Templates {
	timeout(user, ofdMsg, author, int) {
		let embedOut = new MessageEmbed()
		.setColor("#0099ff")
		.setTitle(`Timeout`)
		.setAuthor(author.username, author.avatarURL())
		.setDescription(
			`You have been sent to Time Out in **${int.guild.name}**. Details are listed below`
		)
		.addFields({
			name: "Duration",
			value: `Three Minutes`
		}, {
			name: "Moderator Involved",
			value: `\`${author.username}\``
		})
		.setTimestamp(new Date())
		.setFooter(
			`If you wish to appeal this infraction, please message a Sever Administrator.`
		);

	return embedOut;
	}
	untimeout(user, ofdMsg, author, int) {
		let embedOut = new MessageEmbed()
		.setColor("#0099ff")
		.setTitle(`Timeout Removed`)
		.setAuthor(author.username, author.avatarURL())
		.setDescription(
			`You have been removed from Time Out in **${int.guild.name}**. Details are listed below`
		)
		.addFields({
			name: "Moderator Involved",
			value: `\`${author.username}\``
		})
		.setTimestamp(new Date())
		.setFooter(
			`Remember to follow the rules`
		);

	return embedOut;
	}
	warn(user, ofdMsg, author, int) {
		let embedOut = new MessageEmbed()
		.setColor("#0099ff")
		.setTitle(`Warning`)
		.setAuthor(author.username, author.avatarURL())
		.setDescription(
			`You have been warned in **${int.guild.name}**. Details are listed below`
		)
		.addFields(
			{
			name: "Offending Message / Reason",
			value: `\`${ofdMsg}\``
			},
			{
			name: "Moderator Involved",
			value: `\`${author.username}\``
		})
		.setTimestamp(new Date())
		.setFooter(
			`If you wish to appeal this infraction, please message a Sever Administrator.`
		);

	return embedOut;
	}
}

module.exports = Templates;