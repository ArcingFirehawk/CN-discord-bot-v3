/**
 * @name: voiceline.js
 * @description: Discord slash command that plays a random local voiceline.
 * @author: Anthony Choi.
 * 
 * Packages: @discordjs/voice, ffmpeg-static.
 */



// VARIABLES
const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { generateDependencyReport, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayer } = require("@discordjs/voice");
// const condig = require("../config.json");

// COMMAND BUILDER
module.exports = {
	data: new SlashCommandBuilder()
		.setName("sfx")
		.setDescription("Plays a random voiceline in a voice channel. If you can guess where's it's from, you get a cookie."),

	async execute(interaction, client) {
		// LOCAL VARIABLES
		// const voiceChannelId = config.audioChannelId;
		const voiceChannelId = 1267389187729129486;
		// const voiceChannel = client.channels.cache.get(voiceChannelId);
		const voiceChannel = "General";
		// const guildID = config.guildId;
		const player = createAudioPlayer();    // Creates the audio player.
		

		player.on(AudioPlayerStatus.Playing, () => {
			console.log("An audio file is being played.");
		});
		
		player.on("error", error => {
			console.error(`ERROR: ${error.message}`);
		});

		const resource = createAudioResource("audio\cc3-juggernaut-voiceline1.mp3");
		player.play(resource);

		const connection = joinVoiceChannel({
			channelId: voiceChannelId,
			// guildId: guildId,
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