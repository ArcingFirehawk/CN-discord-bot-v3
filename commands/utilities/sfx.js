/**
 * @name: voiceline.js
 * @description: Discord slash command that plays a random local voiceline.
 * @author: Anthony Choi.
 * 
 * Packages: @discordjs/voice, libsodium-wrappers, ffmpeg-static.
 * 
 * To-Do: Create audio file objects with the directory and name.
 */



// GLOBAL VARIABLES
const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { generateDependencyReport, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const config = require("../../config.json");
 
// COMMAND BUILDER
module.exports = {
	data: new SlashCommandBuilder()
		.setName("sfx")
		.setDescription("Plays a random sound effect or voiceline in a voice channel."),

	async execute(interaction) {
		// LOCAL VARIABLES
		const guildId = config.guildId;
		// const guild = client.guild.cache.get(guildId);
		// const guild = interaction.client.guild.fetch(guildId);
		const voiceChannelId = config.voiceChannelId;
		console.log("Channel ID: ", voiceChannelId);
		console.log("Guild ID: ", guildId);
		// const voiceChannel = client.channels.cache.get(voiceChannelId);
		// const voiceChannel = guild.channels.fetch(voiceChannelId);
		// const voiceChannel = interaction.guild.channels.cache.get(voiceChannelId);
		const voiceChannel = interaction.client.channels.fetch(voiceChannelId);
		const player = createAudioPlayer();    // Creates the audio player.

		player.on(AudioPlayerStatus.Playing, () => {
			console.log("An audio file is being played.");
		});
		
		player.on("error", error => {
			console.error(`ERROR: ${error.message}`);
		});

		const resource = createAudioResource("cc3-juggernaut-voiceline3.mp3");    // Reintroduce when ready.
		player.play(resource);

		const connection = joinVoiceChannel({
			channelId: voiceChannelId,
			guildId: guildId,
			// adapterCreator: voiceChannel.guild.voiceAdapterCreator
			adapterCreator: voiceChannel.guild.voiceAdapterCreator
		});

		interaction.reply({
			content: "Connected to voice channel.",
			flags: MessageFlags.Ephemeral
		});

		const subscription = connection.subscribe(player);

		if (subscription) {
			setTimeout(() => subscription.unsubscribe(), 10_000);
		}
	},
};