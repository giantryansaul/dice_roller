import { InteractionType, InteractionResponseType } from 'discord-interactions';
import 'dotenv/config';
import express from 'express';
import { InitializeCommands, ROLL_DICE, TEST_COMMAND } from './commands';
import { VerifyDiscordRequest } from './utils';
import { DiceString } from './DiceString';

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function (req, res) {

    const { type, data } = req.body;

    if (type  === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;

        if (name === 'roll') {
            const diceRollString = data.options.find((op) => op.name === "message").value;
            const user = data.member.user.username;

            console.log(`Dice roll ${diceRollString}`);

            const dice = new DiceString(diceRollString);
            dice.rollTheString();

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `${user} Request: \`${diceRollString}\`\nRoll: \`${dice.fullRollString}\`\nResult: \`${dice.result}\`\n`,
                }
            });
        }
    }

    await null;

});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);

  // Check if guild commands from commands.js are installed (if not, install them)
  if (process.env.APP_ID && process.env.GUILD_ID) {
    InitializeCommands(process.env.APP_ID, process.env.GUILD_ID, [
        TEST_COMMAND,
        ROLL_DICE,
    ]);
  }
});