import 'dotenv/config';
import express from 'express';
import { DiceString } from './DiceString';
import { v4 as uuidv4 } from "uuid";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());
app.use(cors())

app.post('/roll', async function (req, res) {

    const { diceRollString } = req.body;

    const dice = new DiceString(diceRollString);
    dice.rollTheString();
    return res.send({ roll: {
        id: uuidv4(),
        request: diceRollString,
        result: dice.result,
        fullRollString: dice.fullRollString,
    }});
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


