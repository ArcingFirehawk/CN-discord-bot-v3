/**
 * @name: voiceline.js
 * @description: Discord slash command that plays a random local voiceline.
 * @author: Anthony Choi.
 * 
 * Packages: @discordjs/voice, libsodium-wrappers, ffmpeg-static.
 * 
 * ISSUES: "voiceAdapterCreator" not working.
 */



// IMPORTS
const { SlashCommandBuilder, MessageFlags } = require("discord.js");
// const { generateDependencyReport, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
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

// Function that creates the AudioFile object(s).
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

    return objArray[index];
}


// COMMAND BUILDER
module.exports = {
	data: new SlashCommandBuilder()
		.setName("sfx")
		.setDescription("Plays a random sound effect or voiceline in a voice channel."),

	async execute(interaction) {
		

		
		// LOCAL VARIABLES
		const guildId = process.env.GUILD_ID;
		// const guild = client.guild.cache.get(guildId);
		// const guild = interaction.client.guild.fetch(guildId);
		// const voiceChannelId = config.voiceChannelId;
		const voiceChannelId = process.env.SFX_VOICE_CHANNEL_ID;
		// const voiceChannel = client.channels.cache.get(voiceChannelId);
		// const voiceChannel = guild.channels.fetch(voiceChannelId);
		// const voiceChannel = interaction.guild.channels.cache.get(voiceChannelId);
		const voiceChannel = interaction.client.channels.fetch(voiceChannelId);
		const player = createAudioPlayer();    // Creates the audio player.
		
		const objArray = createAudioObjects();
		const resource = createAudioResource(objArray[2].filePath);

		// if statement that ends the command if the user is in a the correct voice channel.
		if (interaction.member.voice.channel != voiceChannelId) {
			return await interaction.reply({
				content: 'You need to join a voice channel before using this command.',
				flags: MessageFlags.Ephemeral
			});
		}
		
		try {
			// const connection = joinVoiceChannel({
			// 	channelId: voiceChannelId,
			// 	guildId: guildId,
			// 	// adapterCreator: voiceChannel.guild.voiceAdapterCreator
			// 	adapterCreator: voiceChannel.guild.voiceAdapterCreator
			// });
			
			// const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            const connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.member.voice.channel.guild.id,
				adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator
			});


		} catch (e) {
			console.log(`\n\nERROR: ${e}\n\n`);
			await interaction.editReply({
				content: "There was a problem with the command. Please try again later.",
				components: []
			});
		}

		player.on(AudioPlayerStatus.Playing, () => {
			console.log("An audio file is being played.");
		});
		
		player.on("error", error => {
			console.error(`ERROR: ${error.message}`);
		});

		
		
		player.play(resource);


		interaction.reply({
			content: "Connected to voice channel.",
			flags: MessageFlags.Ephemeral
		});

		const subscription = connection.subscribe(player);

		if (subscription) {
			setTimeout(() => subscription.unsubscribe(), 10_000);
			
			await interaction.editReply({
				content: "TIMED OUT",
				components: []
			});
		}
	},
};