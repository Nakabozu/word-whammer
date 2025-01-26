// const {
//   SlashCommandBuilder,
//   ChannelType,
//   ChatInputCommandInteraction,
//   MessageFlags
// } = require("discord.js");
// const { getVoiceConnection } = require("@discordjs/voice");

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

//////////////////////////////////////////////////////////////////////
//             discord.js Embedded Message documentation            //
// https://discordjs.guide/popular-topics/embeds.html#embed-preview //
//////////////////////////////////////////////////////////////////////
export const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription(
    "Disconnects the Word Whammer from the voice channel.  No more whamming."
  );

export const execute = async (
  /** @type {ChatInputCommandInteraction} */ interaction
) => {
  console.log(`You're trying to leave ${interaction.guildId}`);

  const voiceConn = getVoiceConnection(interaction.guildId);
  console.log(voiceConn);
  const isDisconnected = voiceConn.disconnect();
  voiceConn.destroy();

  await interaction.reply({
    content: isDisconnected
      ? `No more words to wham in ${interaction.guild.name}, I guess.`
      : "wtf... something bork...",
    // HIDE THE COMMAND FROM THE PUBLIC
    flags: MessageFlags.Ephemeral, // Makes the message only visible to the user that triggered it
  });
  return;
};
