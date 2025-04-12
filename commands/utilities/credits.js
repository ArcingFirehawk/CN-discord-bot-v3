/**
 * @name: encouragement.js
 * @description: Discord slash command that gives encouragement to the user.
 * @author: William Qu. Documentation by Anthony Choi.
 */



// VARIABLES
const { SlashCommandBuilder } = require('discord.js');
const message = "Made with ❤️ by the Code Network Team (2025).";


// COMMAND BUILDER
module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('Tells you who made it.'),
	async execute(interaction) {
		await interaction.reply(message);
	},
};