import { Random } from "random-js";
import { DieRoll } from "./DieRoll";

export class DiceGroup {
    input: string;
    randomGenerator: Random;
    storedRoll: Array<DieRoll> = [];
    returnValue = 0;

    constructor(input: string, randomGenerator = new Random()) {
        this.input = input;
        this.randomGenerator = randomGenerator;
    }

    evalDiceInput(): number {
        const diceExpression = this.input.split("d");
        const diceMultiple = diceExpression[0] !== '' ? diceExpression[0] : 1;
        const dieSides = diceExpression[1];
        const dice: DieRoll[] = [];
        for (let i = 0; i < diceMultiple; i++) {
            dice.push(new DieRoll(Number(dieSides), this.randomGenerator));
        }
        this.storedRoll = dice;
        const tempEval = this.storedRoll.map(die => die.roll());

        //TODO: More eval options, this only evaluates xdy and not advantage or keep high
        this.returnValue = tempEval.reduce((x, y) => { return x + y; });
        return this.returnValue;
    }
}
