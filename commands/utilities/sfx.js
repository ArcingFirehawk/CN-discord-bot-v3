/**
 * @name: voiceline.js
 * @description: Discord slash command that plays a random local voiceline.
 * @author: Anthony Choi.
 * 
 * Packages: @discordjs/voice, libsodium-wrappers, ffmpeg-static.
 */



// VARIABLES
const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { generateDependencyReport, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const config = require("../../config.json");
 
// COMMAND BUILDER
module.exports = {
	data: new SlashCommandBuilder()
		.setName("sfx")
		.setDescription("Plays a random sound effect or voiceline in a voice channel."),

	async execute(interaction, client) {
		// LOCAL VARIABLES
		const voiceChannelId = config.voiceChannelId;
		const voiceChannel = client.channels.cache.get(voiceChannelId);
		// const voiceChannel = "General";
		const guildID = config.guildId;
		const player = createAudioPlayer();    // Creates the audio player.
		

		player.on(AudioPlayerStatus.Playing, () => {
			console.log("An audio file is being played.");
		});
		
		player.on("error", error => {
			console.error(`ERROR: ${error.message}`);
		});

		// const resource = createAudioResource(".mp3");    // Reintroduce when ready.
		player.play(resource);

		const connection = joinVoiceChannel({
			channelId: voiceChannelId,
			// guildId: GUILD_ID,
			guildId: guildId,
			// adapterCreator: voiceChannel.guild.voiceAdapterCreator
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
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