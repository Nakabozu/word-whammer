const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  ChannelType,
} = require("discord.js");
const tarot = require("../../assets/tarot.json");

//////////////////////////////////////////////////////////////////////
//             discord.js Embedded Message documentation            //
// https://discordjs.guide/popular-topics/embeds.html#embed-preview //
//////////////////////////////////////////////////////////////////////
module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins a Voice Channel")
    .addChannelOption((option) => 
      option
        .setName("channel")
        .setDescription("The name of the channel the bot will join.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    ).toJSON(),

  async execute(/** @type {} */ interaction) {

  },
};
