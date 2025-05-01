/**
 * @name: encouragement.js
 * @description: Discord slash command that gives encouragement to the user.
 * @author: William Qu. Documentation by Anthony Choi.
 */



// IMPORTS
const { SlashCommandBuilder } = require("discord.js");


// VARIABLES
const message = "https://tenor.com/view/gif-gif-19494503";


// COMMAND BUILDER
module.exports = {
	data: new SlashCommandBuilder()
		.setName('encouragement')
		.setDescription('Gives you encouragement.'),

	async execute(interaction) {
		await interaction.reply(message);
	},
};