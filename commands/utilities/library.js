/**
 * @name: library.js
 * @description: Discord slash command that returns information about the current capacity QUT's libraries.
 * @author: William Qu. Debugging and refactoring by Anthony Choi and Isaac Lee with assistance from Yiming He.
 * 
 * Issues: GP Law library doesn't work.
 * 
 * Features: Add the link for library spaces so user can check them.
 *     KG: https://spaces.library.qut.edu.au/mob/KG
 *     GP: https://spaces.library.qut.edu.au/mob/GP
 *     Law: https://spaces.library.qut.edu.au/mob/law
 */



// IMPORTS
const roomClass = require("../../classes/Room.js");
const axios = require('axios'); // Use axios instead of request
const cheerio = require('cheerio');


// VARIABLES
const { SlashCommandBuilder } = require('discord.js');



// METHODS


// COMMAND BUILDER
module.exports = {
	data: new SlashCommandBuilder()
		.setName('library')
		.setDescription('Returns information about the libary\'\s current capacity.')
		.addStringOption(option =>
			option.setName('campus')
				.setDescription('Select a library.')
				.addChoices(
					{ name: 'Gardens Point', value: 'GP' },
					{ name: 'Kelvin Grove', value: 'KG' },
					{ name: 'Gardens Point Law', value: 'Law' },
				)
				.setRequired(true)),

	async execute(interaction) {
		// Reply to the interaction with a loading message.
		await interaction.reply(
			{
				content: '🔍 Analysing Data...',
				ephemeral: true
			});

		const option = interaction.options.getString('campus');
		const url = `https://spaces.library.qut.edu.au/mob/${option}`;

		try {
			// Retrievs HTML data.
			const response = await axios.get(url);
			const $ = cheerio.load(response.data);
			$('.past').remove(); // Remove unnecessary elements
			$('.fa-icon').remove();
			const info = [];

			// Gets information from the website.
			$('.room_wrapper').each(function (index, element) {
				const room = $(element).find('a > .room > h3 ').text();
				const adr = $(element).find('a').attr('href');
				const capacity = $(element).find('a > .room > span').text().replace(" ", "");
				const time = $(element).find('a > .room_booking > ul > li').attr('title');
				const booked = $(element).find('booked').length;

				info.push((new roomClass(room, time, capacity, booked, adr)))
			});
			
			// Checks if info is null. If null, fails.
			if (!info || info.length === 0) {
				// If no results found
				await interaction.editReply(
					{
						content: 'Hmmm, we had trouble getting the data.',
						ephemeral: true
					});
			} else {

				// const levelCapacity = {};
				// levels.forEach(room => {
				// 	const levelKey = room.level;
				// 	if (!levelCapacity[levelKey]) {
				// 		levelCapacity[levelKey] = {
				// 			totalCapacity: 0,
				// 			currentAvailableCapacity: 0
				// 		};
				// 	}
				// 	levelCapacity[levelKey].totalCapacity += room.capacity;
				// 	if (room.availableSlots > 0) {
				// 		levelCapacity[levelKey].currentAvailableCapacity += room.capacity;
				// 	}
				// });

				// Example usage:
				// console.log("Total and Available Capacity per Level:");
				// Object.keys(levelCapacity).forEach(level => {
				// 	console.log(`Level ${level}: 
      			// 	Total Capacity = ${levelCapacity[level].totalCapacity}, 
      			// 	Available Capacity = ${levelCapacity[level].currentAvailableCapacity}`);
				// });

				console.log(info)
				// console.log("hey")    // !!! TEST
				await interaction.editReply({ content: info[0].stringify(info)});
			}
		} catch (error) {
			// Handle request or parsing errors
			console.error('Error while fetching unit data:', error);
			await interaction.editReply(
				{
					content: "Hmmm, Something went wrong.",
					ephemeral: true
				});
		}
	},
};