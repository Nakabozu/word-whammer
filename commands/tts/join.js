// const {
//   SlashCommandBuilder,
//   ChannelType,
//   ChatInputCommandInteraction,
//   MessageFlags,
// } = require("discord.js");
// const {
//   joinVoiceChannel,
//   createAudioResource,
//   createAudioPlayer,
//   StreamType,
// } = require("@discordjs/voice");
// const say = require("say");
// const { join } = require("node:path");
// const {
//   mT,
//   ansiR,
//   wB,
//   bT,
//   cT,
//   buT,
//   gT,
//   rT,
//   rB,
//   wT,
//   yT,
// } = require("../../utilities.js");
// const { createDiscordJSAdapter } = require("../../discordUtils.js");

import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ChannelType,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
  StreamType,
} from "@discordjs/voice";
import say from "say";
import { dirname, join as joinPath } from "path";
import { fileURLToPath, pathToFileURL } from 'url';
import { createDiscordJSAdapter } from "../../discordUtils.js";
import {
  mT,
  ansiR,
  wB,
  bT,
  cT,
  buT,
  gT,
  rT,
  rB,
  wT,
  yT,
} from "../../utilities.js";
// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//////////////////////////////////////////////////////////////////////
//             discord.js Embedded Message documentation            //
// https://discordjs.guide/popular-topics/embeds.html#embed-preview //
//////////////////////////////////////////////////////////////////////
export const data = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins a Voice Channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The name of the channel the bot will join.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    );

    export const execute = async(/** @type {ChatInputCommandInteraction} */ interaction) => {
    // console.log(`${cT}Executing join command${ansiR}`);
    ////////////////////////
    // AUDIO PLAYER SETUP //
    ////////////////////////
    const player = createAudioPlayer();
    // console.log(`${cT}Player Created${ansiR}`);
    //////////////////////////////
    // VOICE CHANNEL CONNECTION //
    //////////////////////////////
    // console.log(`${wB}${bT}JOINING!${ansiR}`);
    const voiceChannel = interaction.options.getChannel("channel");
    // console.log(`${cT}voiceChannel details Obtained${ansiR}`);

    let voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    // console.log(`${cT}voiceConnection established${ansiR}`);

    voiceConnection.subscribe(player);
    // console.log(`${cT}voiceConnection has subscribed${ansiR}`);

    if (voiceChannel.members.size <= 0) {
      // Bot counts as 1
      // console.log(
//         `${rB}${wT}No active listeners in the voice channel.${ansiR}
// Members:`,
//         voiceChannel.members
//       );
      await interaction.reply({
        content: `I'm in ${voiceChannel.name}, but there are no active listeners!`,
        ephemeral: true,
      });
      voiceConnection.disconnect();
      voiceConnection.destroy();
      return;
    }
    // console.log(`${cT}voiceConnection${buT} - ${ansiR}`, voiceConnection);
    /////////////////////////////
    // GENERATING A VOICE FILE //
    /////////////////////////////
    // say.export(
    //   "Ready to WHAM some words boss!",
    //   null,
    //   1.3,
    //   joinPath(__dirname, "join.mp3"),
    //   (err) => {
    //     if (err) {
    //       return console.error(err);
    //     }
    //   }
    // );
    // console.log(`${cT}Generated ${buT}"join.mp3"${ansiR}`);
    ////////////////////////
    // PLAYING VOICE FILE //
    ////////////////////////
    player.on("stateChange", (oldState, newState) => {
      {
        // console.log(
        //   `Player state changed from ${oldState.status} to ${newState.status}`
        // );
        if (newState.status === "autopaused") {
          // console.log(`${yT}Player is autopaused.${ansiR}`);
        }
      }
    });

    // He can say something silly if you uncomment this
    // const audioResource = createAudioResource(joinPath(__dirname, "join.mp3"), {
    //   inputType: StreamType.Arbitrary,
    // });
    // console.log(`${cT}audioResource${buT} - ${ansiR}`, audioResource);
    // player.play(audioResource);
    // console.log(`${cT}played${buT} audioResource${ansiR}`);

    await interaction.reply({
      content: `Ready to wham some words in ${voiceChannel.name}`,
      // HIDE THE COMMAND FROM THE PUBLIC
      flags: MessageFlags.Ephemeral, // Makes the message only visible to the user that triggered it
    });
    // console.log(`${cT}Replied to interaction${ansiR}`);
    return;
  };