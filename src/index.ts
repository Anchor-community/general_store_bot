import { Client, Intents } from "discord.js";
import { config } from "dotenv";
import { prepareCommand } from "~/command";
import { monitorAccessChannel } from "~/lib/monitor";

config();

const main = () => {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  });
  prepareCommand(client);
  monitorAccessChannel(client, ["762902513938202633"], "777867008280231956");
  client.login(process.env.BOT_TOKEN);
};

main();
