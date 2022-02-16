import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";
import axios from "axios";

export const commandName = "search";
export const command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription("画像検索してくれるよ！")
  .addStringOption((option) =>
    option.setName("keyword").setDescription("キーワード").setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("save")
      .setDescription("メッセージを残しますか？")
      .setChoices([
        ["残す", 1],
        ["削除", 0],
      ])
  );

const search = async (q) => {
  const endpoint = new URL("https://www.googleapis.com/customsearch/v1");
  endpoint.searchParams.append("key", process.env.SEARCH_KEY as string);
  endpoint.searchParams.append("cx", process.env.SEARCH_CX as string);
  endpoint.searchParams.append("searchType", "image");
  endpoint.searchParams.append("q", q);
  const response = await axios({
    method: "get",
    url: endpoint.toString(),
  });
  const item = response.data.items[0];
  return item && [item.link, item.image.thumbnailLink];
};

export const commandHandler = async (stream: CommandInteraction<CacheType>) => {
  const q = stream.options.get("keyword")?.value;
  const shouldSave = stream.options.get("save")?.value ?? 0;
  const [url, thumbnail] = await search(q);
  const embed = new MessageEmbed()
    .setImage(url ?? "")
    .setTitle(`検索キーワード: ${q}`)
    .setThumbnail(thumbnail ?? "")
    .setDescription(url ?? "");
  const message = await stream.channel?.send({
    content: `${stream.member?.toString()}\n以下の画像が見つかりました🧑‍💻`,
    embeds: [embed],
  });
  stream.reply({
    content: shouldSave
      ? "検索結果はメッセージから削除されることはありません🙋‍♀️"
      : "検索結果は十秒後に削除されます👋",
    ephemeral: true,
  });
  if (!shouldSave) {
    setTimeout(() => {
      message?.delete();
    }, 10000);
  }
};
