// const {
//   SlashCommandBuilder,
//   ChannelType,
//   ChatInputCommandInteraction,
//   MessageFlags,
// } = require("discord.js");
// const {
//   joinVoiceChannel,
//   getVoiceConnection,
//   createAudioResource,
//   createAudioPlayer,
//   StreamType,
// } = require("@discordjs/voice");
// const { join } = require('node:path');
// const { createReadStream } = require("node:fs");
// const say = require("say");

import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  StreamType,
} from "@discordjs/voice";
import { dirname, join } from "path";
import { createReadStream } from "fs";
import { fileURLToPath } from "url";
import { Say } from "say";
// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//////////////////////////////////////////////////////////////////////
//             discord.js Embedded Message documentation            //
// https://discordjs.guide/popular-topics/embeds.html#embed-preview //
//////////////////////////////////////////////////////////////////////
export const data = new SlashCommandBuilder()
  .setName("wham")
  .setDescription("Whams some words into the voice chat")
  .addStringOption((option) =>
    option
      .setName("words")
      .setDescription("The words that will be whammed into voice comms.")
      .setRequired(true)
  );

export const execute = async (
  /** @type {ChatInputCommandInteraction} */ interaction
) => {
  const say = new Say(process.env.SAY_ENV);
  const player = createAudioPlayer();
  const voiceConn = getVoiceConnection(interaction.guildId);
  if (!voiceConn?.subscribe) {
    await interaction.reply({
      content: `Oops... Whammer so sorry. Whammer DCed from ${
        interaction.guild.name
      }.  Try /join to wham in ${
        interaction.member?.voice?.channel ?? "a voice channel"
      }`,
      // HIDE THE COMMAND FROM THE PUBLIC
      flags: MessageFlags.Ephemeral, // Makes the message only visible to the user that triggered it
    });
    return;
  }
  voiceConn.subscribe(player);
  
  await new Promise((resolve, reject) => {
    say.export(
      interaction?.options?.getString("words"),
      null,
      1.1,
      join(__dirname, "wham.mp3"),
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });

  const audioResource = createAudioResource(join(__dirname, "wham.mp3"), {
    inputType: StreamType.Arbitrary,
  });
  player.play(audioResource);

  await interaction.reply({
    content: `Whamming Words in ${interaction.guild.name}`,
    // HIDE THE COMMAND FROM THE PUBLIC
    flags: MessageFlags.Ephemeral, // Makes the message only visible to the user that triggered it
  });
  return;
};
