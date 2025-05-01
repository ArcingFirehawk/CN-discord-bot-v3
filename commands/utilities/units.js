/**
 * @name: units.js
 * @description: Discord slash command that returns a unit's information.
 * @author: William Qu. Debugging and refactoring by Anthony Choi.
 * 
 * ISSUES: Trying to make the select menu use Unit class, default params for constructor.
 */



// IMPORTS
const axios = require('axios'); // Use axios instead of request
const cheerio = require('cheerio');
const Unit = require("../../classes/Unit.js");


// GLOBAL VARIABLES
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
let response;
let urlUnit;    // Unit's url.
const selectMenuUnits = [];    // Array to store the results of the search query.


// FUNCTIONS

// Gets a list of unit for the selector.
function fillSelectMenu(urlSearch) {
	let unitArray = [];

	unitArray = unitArray.filter(OnlyUnique);

	return unitArray;
}

// Function to get the values for the final response.
async function getstuff(urls) {    // !!! Why async function?
    const url = `https://qutvirtual4.qut.edu.au${urls}`;    // !!! Why do you need a 2nd url var? Scope issue?
    
    try {
        const response = await axios.get(url); // Wait for the HTTP request to complete
        const $ = cheerio.load(response.data); // Load the HTML data
        
        // Remove unwanted <th> elements
        $('th').remove();
        
        const name = $('div#outline > h1:first');
		const semester = $('dl.availabilities > dd');
		const year = $('.year-tab');
        const campus = $('dl.availabilities > dt > strong');
        const credit = $('table.basicinfo > tbody > tr:nth-child(4) > td');    // !!! Broken
        const overview = $('div.tab-pane > div.p');
        
		unit = new Unit(name.text(), year.text(), semester.text(), campus.text(), credit.text(), overview.text());    // !!! Want to extracting text from web to class.
		const finaltext = `**[${unit.code} ${unit.name} (${unit.year} - ${unit.semester})](<${url}>)**\nCampus(es): ${unit.campus}\nCredit Points: ${unit.creditPoints}\n\n${unit.overview}`

        return finaltext; // Return the extracted data.
		
    } catch (error) {
        console.error('Error while fetching unit details:', error);
        return null; // Return null or handle error appropriately
    }
}



// Function that builds the final response to the user. !!! Hasn't been change for this command.
function finalResponseBuilder(Unit, url) {
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
		.setName('unit')
		.setDescription('Returns information about a unit.')
		.addStringOption(option =>
			option.setName('unitcodeorname')
				.setDescription('The code or name of the unit to lookup.')
				.setRequired(true)),

	async execute(interaction) {
		// LOCAL VARIABLES
		option = interaction.options.getString('unitcodeorname');
		let urlSearch;    // The URL to query for a unit in QUT Search.


		// Reply to the interaction with a loading message.
		await interaction.reply({ content: '🔍 Searching for units...', ephemeral: true });

		// option = interaction.options.getString('unitcodeorname');
		urlSearch = `https://qutvirtual4.qut.edu.au/web/qut/search?params.query=${option}&profile=UNIT&params.showOldUnits=false&params.sortKey=0`

		try {
			// Fetch the HTML data
			response = await axios.get(urlSearch);
			const $ = cheerio.load(response.data);
			$('.unit-details-heading').remove(); // Remove unnecessary elements

			// let info = [];

			// !!! Fills the selector.
			$('.class-result-item').find('div.search-unit-info').each(function (index, element) {
				const adr = $(element).find('h4 > a').attr('href');
				const q = require('url').parse(adr, true);
				// const qdata = q.query;
				const qdata = `${$(element).find('h4 > a').text()}`;

				// info = uniqueArray(info);
				
				// selectMenuUnits.push(new Unit(qdata));

				selectMenuUnits.push(new Unit(qdata, null, null, null, null, null))

				// selectMenuUnits.push({
				// 	label: qdata,
				// 	// label: `${$(element).find('h4 > a').text()}`,    // (${$(element).find('.unit-details > li:first').text()} - ${qdata.year})`,
				// 	// description: `${$(element).find('.unit-details > .unit-details-location').text()} - ${$(element).find('.unit-details > .unit-details-attendance-mode').text()} (${$(element).find('.unit-details > .unit-details-startDate').text()} - ${$(element).find('.unit-details > .unit-details-endDate').text()})`,
				// 	value: adr,
				// });

				
			});

			
			console.log(`info: ${selectMenuUnits[0]}`);    // !!! Console output for testing.

			// console.log("TEST1:\n" + info)    // !!! Console output for testing.

			if (!selectMenuUnits || selectMenuUnits.length === 0) {
				// If no results found
				await interaction.editReply({ content: 'ERROR: No units found.', ephemeral: true });
			} else {
				// Create the select menu for user to choose
				const select = new StringSelectMenuBuilder()
					.setCustomId('starter')
					.setPlaceholder('Make a selection!')
					.addOptions(
						selectMenuUnits.map(item => {
							return new StringSelectMenuOptionBuilder()
								.setLabel(`${item.code} ${item.name}`)
								.setValue(item.link);
						})
					);

				const row = new ActionRowBuilder().addComponents(select);

				// Update the reply with the select menu
				const response = await interaction.editReply({
					content: 'Select your unit:',
					components: [row]
				});

				// Collector filter to ensure the user is interacting
				const collectorFilter = i => i.customId === 'starter' && i.user.id === interaction.user.id;

				// Await the interaction response with a timeout
				try {
					const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
					
					//console.log('User selected:', confirmation.values);
					const idk = await getstuff(confirmation.values);    // !!! Ask Will: What does this get?
					await confirmation.update({ content: `${idk}`, components: [] });

					// !!! Console output for testing.
					console.log("\nconfirmation: \n" + confirmation + "\n\n");
					console.log("\nconfirmation.values: \n" + confirmation.values + "\n\n");
					console.log("\nidk: \n" + idk + "\n\n");

					// Handle the selected option (confirmation)
					//console.log(getstuff(confirmation.values));
					// await confirmation.update({ content: `You selected: ${getstuff(confirmation.values)}`, components: [] });
				} catch {
					await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
				}
				
			}
		} catch (error) {
			// Handle request or parsing errors
			console.error('Error while fetching unit data:', error);
			await interaction.editReply({ content: 'Hmmm, Something went wrong', ephemeral: true });
		}
	},
};