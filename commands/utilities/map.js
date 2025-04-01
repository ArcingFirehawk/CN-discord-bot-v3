/**
 * @name: map.js
 * @description: Discord slash command that links to QUT's campus maps.
 * @author: Anthony Choi with assistance from William Qu and Yimming <Last Name>.
 */



// VARAIABLES
const { SlashCommandBuilder } = require("discord.js");
const link = "https://www.qut.edu.au/about/campuses-and-facilities/maps-and-getting-here";
let response;


// COMMAND BUILDER
module.exports =
{
	// Sets up the command.
	data: new SlashCommandBuilder()
		.setName("map")
		.setDescription("Returns the link to QUT's campus maps."),

	// Enables the command's functionality.
	async execute(interaction)
	{
		response = `Here's the link to the campuses' maps: ${link}.`;
		await interaction.reply(
		{
			content: response,
			ephemeral: true
		})
	},
};