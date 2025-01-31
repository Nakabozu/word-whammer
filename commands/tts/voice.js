import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { ansiR, cT, voiceEnum } from "../../utilities.js";
import { addVoice, deleteVoices } from "../../db.js";

//////////////////////////////////////////////////////////////////////
//             discord.js Embedded Message documentation            //
// https://discordjs.guide/popular-topics/embeds.html#embed-preview //
//////////////////////////////////////////////////////////////////////
// Voice Selection Params:
// https://cloud.google.com/text-to-speech/docs/reference/rest/Shared.Types/StreamingSynthesizeConfig#VoiceSelectionParams
// Supported Voices:
// https://cloud.google.com/text-to-speech/docs/voices

export const data = new SlashCommandBuilder()
  .setName("voice")
  .setDescription("The words will sound different when whammed.")
  .addStringOption((option) =>
    option
      .setName("voice")
      .setDescription("The title given to this whammer of words")
      .addChoices(
        { name: "Elizabeth", value: "en-GB-Standard-A" },
        { name: "Noah", value: "en-GB-Standard-B" },
        // { name: "Fleur", value: "en-GB-Standard-C" },
        // { name: "Archibald", value: "en-GB-Standard-D" },
        // { name: "Isobel", value: "en-GB-Standard-F" },
        // { name: "Georgina", value: "en-GB-Standard-N" },
        // { name: "Roscoe", value: "en-GB-Standard-O" },

        { name: "Desmond", value: "en-US-Standard-A" },
        { name: "Andrew", value: "en-US-Standard-B" },
        { name: "Liora", value: "en-US-Standard-C" },
        // { name: "Jake", value: "en-US-Standard-D" },
        // { name: "Lucy", value: "en-US-Standard-E" },
        // { name: "Tiffany", value: "en-US-Standard-F" },
        // { name: "Madeline", value: "en-US-Standard-G" },
        { name: "Sophie", value: "en-US-Standard-H" },
        // { name: "Theo", value: "en-US-Standard-I" },
        // { name: "Edwin", value: "en-US-Standard-J" },

        { name: "Charlotte", value: "en-AU-Standard-A" },
        { name: "Oliver", value: "en-AU-Standard-D" },

        { name: "Sunita", value: "en-IN-Standard-E" },
        { name: "Ramesh", value: "en-IN-Standard-F" },

        { name: "Peter", value: "da-DK-Standard-C" },
        { name: "Anne", value: "da-DK-Standard-E" },

        { name: "Eino", value: "fi-FI-Standard-B" },
        { name: "Aino", value: "fi-FI-Standard-A" },

        { name: "Nathaniel", value: "fil-PH-Standard-A" },
        { name: "Althea", value: "fil-PH-Standard-D" },

        { name: "Emma", value: "fr-CA-Standard-A" },
        { name: "Leo", value: "fr-CA-Standard-D" },

        { name: "Himari", value: "ja-JP-Standard-B" },
        { name: "Nagi", value: "ja-JP-Standard-D" },

      )
      .setRequired(true)
  );

export const execute = async (
  /** @type {ChatInputCommandInteraction} */ interaction
) => {
  // console.log(`${cT}Executing voice command${ansiR}`);
  /////////////
  // DB Pull //
  /////////////
  // console.log(`${cT}Clearing database of voices${ansiR}`);
  deleteVoices();
  // console.log(`${cT}Adding new voice to DB${ansiR}`);
  addVoice(interaction.options.getString("voice"));

  await interaction.reply({
    content: `New voice will wham, and welcome to the jam! (${interaction.options.getString(
      "voice"
    )})`,
    // HIDE THE COMMAND FROM THE PUBLIC
    flags: MessageFlags.Ephemeral, // Makes the message only visible to the user that triggered it
  });
  // console.log(`${cT}Replied to interaction${ansiR}`);
  return;
};
