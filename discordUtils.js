import {
  Client,
  VoiceChannel,
  Guild,
  GatewayDispatchEvents,
  Events,
  Status
} from "discord.js";
/**
 *   VoiceBasedChannel,
  DiscordGatewayAdapterCreator,

 */
import discordjs from 'discord.js';

//#region Variables
const adapters = new Map();
const trackedClients = new Set();
const trackedShards = new Map();
//#endregion

//#region connectToChannel()
/**
 * 
 * @param {VoiceChannel} channel 
 * @returns 
 */
export async function connectToChannel(channel) {
  const connection = discordjs.joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: createDiscordJSAdapter(channel),
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}
//#endregion
//#region trackClient()
/**
 * Tracks a Discord.js client, listening to VOICE_SERVER_UPDATE and VOICE_STATE_UPDATE events
 *
 * @param {Client} client - The Discord.js Client to track
 */
export function trackClient(client) {
  if (trackedClients.has(client)) return;
  trackedClients.add(client);
  client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (payload) => {
    adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
  });
  client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (payload) => {
    if (
      payload.guild_id &&
      payload.session_id &&
      payload.user_id === client.user?.id
    ) {
      adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
    }
  });
  client.on(Events.ShardDisconnect, (_, shardId) => {
    const guilds = trackedShards.get(shardId);
    if (guilds) {
      for (const guildID of guilds.values()) {
        adapters.get(guildID)?.destroy();
      }
    }
    trackedShards.delete(shardId);
  });
}
//#endregion
//#region trackGuild()
/**
 *
 * @param {Guild} guild
 */
export function trackGuild(guild) {
  let guilds = trackedShards.get(guild.shardId);
  if (!guilds) {
    guilds = new Set();
    trackedShards.set(guild.shardId, guilds);
  }
  guilds.add(guild.id);
}
//#endregion
//#region createDiscordJSAdapter()
/**
 * Creates an adapter for a Voice Channel.
 *
 * @param { discordjs.VoiceBasedChannel } channel - The channel to create the adapter for
 * @returns { discordjs.DiscordGatewayAdapterCreator }
 */
export function createDiscordJSAdapter(channel) {
  return (methods) => {
    adapters.set(channel.guild.id, methods);
    trackClient(channel.client);
    trackGuild(channel.guild);
    return {
      sendPayload(data) {
        if (channel.guild.shard.status === Status.Ready) {
          channel.guild.shard.send(data);
          return true;
        }
        return false;
      },
      destroy() {
        return adapters.delete(channel.guild.id);
      },
    };
  };
}
//#endregion
