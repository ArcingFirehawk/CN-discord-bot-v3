/**
 * @name: voiceline.js
 * @description: Discord slash command that plays a random local voiceline.
 * @author: Anthony Choi.
 * 
 * Packages: @discordjs/voice, libsodium-wrappers, ffmpeg-static.
 * 
 * ISSUES: Need bot to wait until its in "ready" VoiceConnectionStatus before playing audio.
 * TO-DO: Auto disconnect bot from voice channel after 5 or 10 sec.
 */



// IMPORTS
const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require("@discordjs/voice");
const fs = require('fs');
const AudioFile = require("../../classes/AudioFile.js");


// FUNCTIONS

// Function to get the filepath of all locally stored audio files.
function getAudioResources() {
	const fileArray = fs.readdirSync("audio");
	let filePathArray = [];

	for (let i = 0; i < fileArray.length; i++) {
		filePathArray[i] = "/audio/" + fileArray[i];
	}
	
	return filePathArray;
}

// Function that creates an array of AudioFile object(s).
function createAudioObjects() {
    let filePathArray = getAudioResources();
	let objArray = [];

	filePathArray.forEach(element => {
    objArray.push(new AudioFile(element));
	});
	
	return objArray;
}

// Function that chooses a random AudioFile object.
function chooseAudioFile() {
	let objArray = createAudioObjects();
	let index = Math.floor(Math.random() * objArray.length);

    return objArray[index].filePath;
}


// COMMAND BUILDER
module.exports = {
	data: new SlashCommandBuilder()
		.setName("sfx")
		.setDescription("Plays a random sound effect or voiceline in a voice channel."),

	async execute(interaction) {
		// LOCAL VARIABLES
		const guildId = process.env.GUILD_ID;
		const voiceChannelId = process.env.SFX_VOICE_CHANNEL_ID;
		const voiceChannel = interaction.client.channels.fetch(voiceChannelId);
		const player = createAudioPlayer();    // Creates the audio player.
		let isReady = false;
		
		const resource = createAudioResource(chooseAudioFile());

		if (interaction.member.voice.channel != voiceChannelId) {
			return await interaction.reply({
				// content: `ERROR: Please join the "${voiceChannel}" voice channel before using this command.`,
				content: "ERROR: Please join the correct voice channel before using this command.",
				flags: MessageFlags.Ephemeral
			});
			
		}
		
		// try-catch that makes the bot join a voice channel and play the audio file.
		try {
            const connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.member.voice.channel.guild.id,
				adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator
			});

			await interaction.reply({
					content: "Connecting...",
					flags: MessageFlags.Ephemeral
			});

			await interaction.editReply("Connected to voice channel.");

			// while (!isReady) {
			// 	connection.on(VoiceConnectionStatus.Ready, () => {
			// 		interaction.editReply("Connected to voice channel.")
			// 		isReady = true;
			// 	});
			// }

			player.addListener("stateChange", (oldOne, newOne) => {
				// if (newOne.state == "Ready") {
				// 	interaction.edit({
				// 		content: "Connected to voice channel.",
				// 		flags: MessageFlags.Ephemeral
				// 	});

				// 	// isReady = true;
				// }

				if (newOne.status == "idle")
					setTimeout(() => { if (newOne.state == "idle") connection.destroy()}, 5000);
			});
			
				// if statement that disconnects bot from voice channel if idle for a time.
			// if (isReady == player.state) {
			// 	connection.subscribe(player);
			// 	player.play(resource);
			// 	console.log("An audio file is being played.");
			// }

			connection.subscribe(player);
			player.play(resource);
			console.log("\nNOTICE: An audio file is being played.");

			// player.on(AudioPlayerStatus.Idle, () => {
			// 	interaction.editReply("Audio file has finished playing. Disconnecting bot from voice channel in 5 seconds.")	
			// });

			// interaction.editReply("Audio file has finished playing. Disconnecting bot from voice channel in 5 seconds.");
			

		} catch (e) {
			console.log(`\n\nERROR: ${e}\n\n`);
		}

		// interaction.reply({
		// 	content: "Connected to voice channel.",
		// 	flags: MessageFlags.Ephemeral
		// });
	},
};