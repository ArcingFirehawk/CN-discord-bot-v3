/**
 * @name: ping.js
 * @description: Demo command.
 * @author: ?
 */



// IMPORTS
const { SlashCommandBuilder } = require('discord.js');


// COMMAND BUILDER
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong! 2'),
	async execute(interaction) {
		await interaction.reply('Pong! 2');
	},
};
