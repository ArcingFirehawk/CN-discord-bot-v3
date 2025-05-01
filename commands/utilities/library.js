/**
 * @name: library.js
 * @description: Discord slash command that returns information about a library's current capacity.
 * @author: William Qu. Debugging and refactoring by Anthony Choi and Isaac Lee with assistance from Yiming He.
 */



// IMPORTS
const axios = require("axios");
const cheerio = require("cheerio");
const Room = require("../../classes/Room.js");
const { SlashCommandBuilder, MessageFlags } = require("discord.js");


// GLOBAL VARIABLES
let option;
let urlProper;


// FUNCTIONS

// Function that builds the library's URL.
function urlBuilder(option) {
	let url = `https://spaces.library.qut.edu.au/mob/${option}`;
	
	if (option == "Law")
		url = url.toLowerCase();

	return url;
}

// Function that builds the final response to the user.
function finalResponseBuilder(Rooms, option, url) {
	const block = Rooms[0].number.charAt(3);
	const time = Rooms[0].startTime;

	return `The ${option} library's (${block}-block) current individual room capacity at ` 
		 + `${time} is ${percentageCalc(Rooms)}%.\nHere's the link that shows all of its available rooms: ${url}.`;
}

// Function that calculates the percentage of booked rooms.
function percentageCalc(Rooms) {
	const roomLength = Rooms.length;
	let numBooked = 0;
	let bookedPercent;

	Rooms.forEach(element => {
		if (element.isBooked === true)
			numBooked++;		
	});

	bookedPercent = (numBooked / roomLength) * 100;
	bookedPercent = (Math.round(bookedPercent * 100) / 100).toFixed(2);

	return bookedPercent;
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
				flags: MessageFlags.Ephemeral
			});

		option = interaction.options.getString('campus');
		urlProper = urlBuilder(option);

		try {
			// Gets HTML data.
			const response = await axios.get(urlProper);
			const $ = cheerio.load(response.data);

			$('.past').remove();    // Remove unnecessary elements.
			$('.fa-icon').remove();
			const roomArray = [];

			// Gets information from the website.
			$('.room_wrapper').each(function (index, element) {
				const roomNumber = $(element).find('a > .room > h3 ').text();
				const startTime = $(element).find('a > .room_booking > ul > li').attr('title');
				const maxCapacity = $(element).find('a > .room > span').text().replace(" ", "");
				let isBooked = false;
				const roomUrl = $(element).find('a').attr('href');

				// if-else statement to determine if a room is booked for the current time.
				if ($(element).find("a > .room_booking > ul > li").attr("class") === "booked current")
					isBooked = true;

				roomArray.push(new Room(roomNumber, startTime, maxCapacity, isBooked, roomUrl))
			});
			
			// if-else statement that checks if roomArray is null.
			if (!roomArray || roomArray.length === 0) {
				await interaction.editReply("Hmmm, we had trouble getting the data.");
			} else {
				await interaction.editReply(finalResponseBuilder(roomArray, option, urlProper));
			}
			
		} catch (error) {
			// Handle request or parsing errors.
			console.error('Error while fetching unit data:', error);
			await interaction.editReply("Hmmm, Something went wrong.");
		}
	},
};