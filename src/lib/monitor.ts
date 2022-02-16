import { Client, TextChannel } from "discord.js";

export const monitorAccessChannel = (
  client: Client,
  targetChannelIDs: string[],
  announcementRoomID: string
) => {
  client.on("voiceStateUpdate", async (before, after) => {
    if (before.channelId !== after.channelId) {
      const announcementRoom = await client.channels.cache.get(
        announcementRoomID
      );
      if (!(announcementRoom && announcementRoom instanceof TextChannel))
        throw "not found notification channel";
      if (before.channel && targetChannelIDs.includes(before.channel.id)) {
        await announcementRoom.send(
          `**${before.channel.name}** から __${before.member?.user.username}__ が退出しました👋`
        );
      }
      if (after.channel && targetChannelIDs.includes(after.channel.id)) {
        await announcementRoom.send(
          `**${after.channel.name}** に __${after.member?.user.username}__ が参加しました😘`
        );
      }
    }
  });
};
