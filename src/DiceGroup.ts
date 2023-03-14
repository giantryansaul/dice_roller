import { DieRoll } from "./DieRoll";

export class DiceGroup {
    input: string;
    storedRoll: Array<DieRoll> = [];
    realValue = 0;

    constructor(input: string) {
        this.input = input;
    }

    private keepDice(keepDiceExpression: string, dice: number[]): number[] {

         //TODO: Note which dice were dropped in this object

        const keepHighDice = keepDiceExpression.split("h");
        const keepLowDice = keepDiceExpression.split("l");
        if (keepHighDice.length > 1) {
            const keepHighDiceNumber = keepHighDice[1];
            dice.sort((a, b) => b - a);
            dice.splice(Number(keepHighDiceNumber), dice.length);
        } else if (keepLowDice.length > 1) {
            const keepLowDiceNumber = keepLowDice[1];
            dice.sort((a, b) => a - b);
            dice.splice(Number(keepLowDiceNumber), dice.length);
        }
        return dice;
    }

    evalDiceInput(): number {
        const keepDiceExpression = this.input.split("k");
        const diceExpression = keepDiceExpression[0].split("d");
        const diceMultiple = diceExpression[0] !== '' ? Number(diceExpression[0]) : 1;
        const dieSides = diceExpression[1];
        const dice: DieRoll[] = [];
        for (let i = 0; i < diceMultiple; i++) {
            dice.push(new DieRoll(Number(dieSides)));
        }
        this.storedRoll = dice;
        let tempEval = this.storedRoll.map(die => die.roll());

        if (keepDiceExpression.length > 1) {
            tempEval = this.keepDice(keepDiceExpression[1], tempEval);
        }
        
        this.realValue = tempEval.reduce((x, y) => { return x + y; });
        return this.realValue;
    }

    returnRealValue(): number {
        return this.realValue;
    }

    returnDiceRollsAsString(): string {
        return this.storedRoll.map(die => {
            return `${die.result}(d${die.sides})`;
        }).join(' ');
    }
}
