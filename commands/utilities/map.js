/**
 * @name: map.js
 * @description: Discord slash command that links to QUT's campus maps.
 * @author: Anthony Choi. Assistance provided by William Qu and Yiming He.
 */



// IMPORTS
const { SlashCommandBuilder, MessageFlags } = require("discord.js");


// VARAIABLES
const link = "https://www.qut.edu.au/about/campuses-and-facilities/maps-and-getting-here";
const response = `Here's the link to QUT's campus maps: ${link}`;


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
		await interaction.reply(
		{
			content: response,
			flags: MessageFlags.Ephemeral
		})
	},
};