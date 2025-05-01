/**
 * @name: encouragement.js
 * @description: Discord slash command that tells the user who made the Discord bot.
 * @author: William Qu. Documentation by Anthony Choi.
 */



// IMPORTS
const { SlashCommandBuilder } = require("discord.js");


// VARIABLES
const message = "Made with ❤️ by the Code Network Team.";


// COMMAND BUILDER
module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('Tells you who made it.'),
	async execute(interaction) {
		await interaction.reply(message);
	},
};