import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { CacheType, Client, CommandInteraction } from "discord.js";
import {
  commandName as searchCommandName,
  command as searchCommand,
  commandHandler as searchCommandHandler,
} from "~/command/search";

const commandNames = [searchCommandName] as const;

type CommandName = typeof commandNames[number];

const commands = [searchCommand];

const commandHandler: {
  [key in CommandName]: (
    stream: CommandInteraction<CacheType>
  ) => Promise<void>;
} = {
  search: searchCommandHandler,
};

export const prepareCommand = async (client: Client) => {
  const rest = new REST({ version: "9" }).setToken(
    process.env.BOT_TOKEN as string
  );
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.BOT_ID as string,
        process.env.GUILD_ID as string
      ),
      { body: commands }
    );
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
    throw error;
  }
  client.on("interactionCreate", (stream) => {
    if (!stream.isCommand()) return;
    commandHandler[stream.commandName](stream);
  });
};
