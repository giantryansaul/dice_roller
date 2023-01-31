import { DiscordRequest } from "./utils";

type CommandOption = {
  name: string;
  description: string;
  type: number;
  required?: boolean;
  choices?: { name: string; value: string }[];
};

type Command = {
  name: string;
  description: string;
  options?: CommandOption[];
  id?: string;
}

let installedCommands: Command[] = [];


export async function InitializeCommands(appId: string, guildId: string, commands: Command[]): Promise<void> {  
  console.log(`Initializing commands for ${appId} and ${guildId}...`);
  installedCommands = await GetInstalledCommands(appId, guildId);
  for (const command of commands) {
    const installedCommand = installedCommands.find((ic) => ic.name === command.name);
    if (!installedCommand) {
      await InstallGuildCommand(appId, guildId, command);
    } else if (installedCommand.id) {
      console.log(`"${command.name}" command already installed with id ${installedCommand.id}`);
      await UpdateGuildCommand(appId, guildId, command, installedCommand.id);
    }
  }
}

async function GetInstalledCommands(appId, guildId) {
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(appId: string, guildId: string, command: Command): Promise<void> {
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  try {
    console.log(`Installing command ${command.name}`);
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

export async function UpdateGuildCommand(appId: string, guildId: string, command: Command, commandId: string): Promise<void> {
  const endpoint = `applications/${appId}/guilds/${guildId}/commands/${commandId}`;
  try {
    console.log(`Updating command ${command.name} with id ${commandId}`);
    await DiscordRequest(endpoint, { method: 'PATCH', body: command });
  } catch (err) {
    console.error(err);
  }
}

// Simple test command
export const TEST_COMMAND = {
  name: 'test',
  description: 'Basic guild command',
  type: 1,
};

export const ROLL_DICE = {
  name: 'roll',
  description: 'Roll some dice from a command',
  type: 1,
  options: [
    {
      name: 'message',
      description: 'The dice to roll',
      required: true,
      type: 3,
    }
  ]
};