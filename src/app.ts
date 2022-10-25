import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { VerifyDiscordRequest } from './utils.js'
import 'dotenv/config'
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }))

app.post('/interactions', async function (req, res) {

    const { type, id, data } = req.body;

    if (type  === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG })
    }


}) 