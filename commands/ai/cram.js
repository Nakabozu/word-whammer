import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  Collection,
  Message,
  MessageFlags,
  SnowflakeUtil,
} from "discord.js";
import { ansiR, cT } from "../../utilities.js";
import { cramIt } from "../../googleAi.js";

//////////////////////////////////////////////////////////////////////
//             discord.js Embedded Message documentation            //
// https://discordjs.guide/popular-topics/embeds.html#embed-preview //
//////////////////////////////////////////////////////////////////////
export const data = new SlashCommandBuilder()
  .setName("cram")
  .setDescription("Cram many word into few word.")
  .addNumberOption((option) =>
    option
      .setName("hours")
      .setDescription("Number of hours to cram.")
      .setMaxValue(24)
      .setMinValue(0)
  )
  .addNumberOption((option) =>
    option
      .setName("minutes")
      .setDescription("Number of minutes to cram.")
      .setMaxValue(59)
      .setMinValue(0)
  );

export const execute = async (
  /** @type {ChatInputCommandInteraction} */ interaction
) => {
  try {
    console.log(`${cT}Executing cram command${ansiR}`);
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    let targetDate = new Date();
    let afterSnowflake;
    const rollbackHours = interaction.options.getNumber("hours") ?? 0;
    const rollbackMinutes = interaction.options.getNumber("minutes") ?? 0;
    const isRollbackCollection =
      rollbackHours ||
      (rollbackMinutes && rollbackHours > 0) ||
      rollbackMinutes > 0;

    if (isRollbackCollection) {
      if (rollbackHours)
        targetDate.setHours(targetDate.getHours() - rollbackHours);
      if (rollbackMinutes)
        targetDate.setMinutes(targetDate.getMinutes() - rollbackMinutes); // 30 minutes ago
      afterSnowflake = SnowflakeUtil.generate({
        timestamp:
          Date.now() -
          rollbackHours * 60 * 60 * 1000 -
          rollbackMinutes * 60 * 1000,
      });
    }

    let allMessages = [];
    let newMessages, pageEndingMessage;
    do {
      newMessages = await interaction.channel.messages.fetch({
        limit: 100,
        after: pageEndingMessage?.id ?? afterSnowflake,
      });
      if (newMessages.size > 0) {
        allMessages = newMessages
          .map((message) => {
            return `**${message.author.globalName}**:\n${message.content}`;
          })
          .concat(allMessages);

        pageEndingMessage = newMessages.first();
      }
    } while (newMessages.size >= 100 && isRollbackCollection);

    let processedMessages = allMessages.reverse().join("\n");

    // #region DEBUG ZONE
    // console.log(processedMessages);
    // await interaction.editReply({
    //   content: "Done!",
    // });
    // return;
    //#endregion
    // Ask AI to summarize
    let aiResponse = await cramIt(processedMessages);

    // Cut it into 2000 character messages.
    let segmentedAiResponse = [];
    const CHARACTER_LIMIT = 2000;
    while (aiResponse.length > CHARACTER_LIMIT) {
      segmentedAiResponse.push(aiResponse.slice(0, CHARACTER_LIMIT));
      aiResponse = aiResponse.slice(CHARACTER_LIMIT);
    }
    segmentedAiResponse.push(aiResponse);

    // Put AI response in chat
    await interaction.editReply({
      content: segmentedAiResponse.shift(),
    });
    // while (segmentedAiResponse.length > 0) {
    //   await interaction.reply({
    //     content: segmentedAiResponse.shift(),
    //   });
    // }
    return;
  } catch (e) {
    console.error(e);
    await interaction.editReply({
      content: `Oops... Whammer so sorry. Whammer not good crammer, so broke.`,
      // HIDE THE COMMAND FROM THE PUBLIC
      flags: MessageFlags.Ephemeral, // Makes the message only visible to the user that triggered it
    });
  }
};
