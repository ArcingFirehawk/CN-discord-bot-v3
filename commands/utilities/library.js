/**
 * @name: library.js
 * @description: Discord slash command that returns information about a library's current capacity.
 * @author: William Qu. Debugging and refactoring by Anthony Choi and Isaac Lee with assistance from Yiming He.
 * 
 * Issues: Needs to be tested when rooms are booked (might not be picking up when rooms are booked).
 * 		   For some reason `flags: MessageFlags.Ephemeral` doesn't work.
 */



// IMPORTS
const roomClass = require("../../classes/Room.js");
const axios = require("axios");    // Use axios instead of request.
const cheerio = require("cheerio");


// VARIABLES
const { SlashCommandBuilder } = require("discord.js");
let option;
let url;


// FUNCTIONS

// Function that builds the library's URL.
function urlBuilder(option) {
	let url = `https://spaces.library.qut.edu.au/mob/${option}`;
	
	if (option == "Law") {
		url = url.toLowerCase();
	}

	return url;
}

// Function that builds the final response to the user.
function responseBuilder(Rooms, option, url) {
	const block = Rooms[0].roomNumber.charAt(3);
	const time = Rooms[0].timeSlot;
	const roomLength = Rooms.length;
	let numBooked = 0;

	Rooms.forEach(element => {
		if (element.booked == 1)
			numBooked++;
	});

	return `The ${option} library's (${block}-block) current individual room capacity at ${time} is ${(numBooked / roomLength) * 100}%.\r\nHere's the link that shows all of its available rooms: ${url}.`;
}


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
					{ name: 'Law', value: 'Law' }
				)
				.setRequired(true)),

	async execute(interaction) {
		// Reply to the interaction with a loading message.
		await interaction.reply(
			{
				content: "🔍 Analysing data...",
				ephemeral: true
				// flags: MessageFlags.Ephemeral    // !!! Not working.
			});

		option = interaction.options.getString('campus');
		url = urlBuilder(option);

		try {
			// Retrieves HTML data.
			const response = await axios.get(url);
			const $ = cheerio.load(response.data);
			$('.past').remove(); // Remove unnecessary elements
			$('.fa-icon').remove();
			const info = [];

			// Gets information from the website.
			$('.room_wrapper').each(function (index, element) {    // !!! Why isn't index being used here?
				const room = $(element).find('a > .room > h3 ').text();
				const adr = $(element).find('a').attr('href');
				const capacity = $(element).find('a > .room > span').text().replace(" ", "");
				const time = $(element).find('a > .room_booking > ul > li').attr('title');
				const booked = $(element).find('booked').length;    // !!! Needs to be changed to pick up if the room is actually booked?.

				info.push((new roomClass(room, time, capacity, booked, adr)))
			});
			
			// Checks if info is null. If null, fails.
			if (!info || info.length === 0) {
				// If no results found
				await interaction.editReply(
					{
						content: 'Hmmm, we had trouble getting the data.'
					});
			} else {

				// !!! What does the following do and is it necessary anymore?
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

				console.log(info)    // Console output for testing.
				await interaction.editReply(responseBuilder(info, option, url));
			}
		} catch (error) {
			// Handle request or parsing errors
			console.error('Error while fetching unit data:', error);
			await interaction.editReply(
				{
					content: "Hmmm, Something went wrong."
				});
		}
	},
};