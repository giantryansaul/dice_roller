import { DiscordRequest } from "./utils";


export async function HasGuildCommands(appId: string | undefined, guildId: string | undefined, commands: any[]) {
    if (guildId === '' || appId === '') return;
    for (const c of commands) {
      await HasGuildCommand(appId, guildId, c);
    }
  }

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data && Array.isArray(data)) {
      const installedNames = data.map((c) => c.name);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command.name)) {
        console.log(`Installing "${command.name}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command.name}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
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
      name: 'dice_string',
      description: 'The dice to roll',
      required: true,
      type: 3,
    }
  ]
};