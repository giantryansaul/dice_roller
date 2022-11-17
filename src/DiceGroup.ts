import { DieRoll } from "./DieRoll";

export class DiceGroup {
    input: string;
    storedRoll: Array<DieRoll> = [];
    realValue = 0;

    constructor(input: string) {
        this.input = input;
    }

    evalDiceInput(): number {
        const diceExpression = this.input.split("d");
        const diceMultiple = diceExpression[0] !== '' ? diceExpression[0] : 1;
        const dieSides = diceExpression[1];
        const dice: DieRoll[] = [];
        for (let i = 0; i < diceMultiple; i++) {
            dice.push(new DieRoll(Number(dieSides)));
        }
        this.storedRoll = dice;
        const tempEval = this.storedRoll.map(die => die.roll());

        //TODO: More eval options, this only evaluates xdy and not advantage or keep high
        this.realValue = tempEval.reduce((x, y) => { return x + y; });
        return this.realValue;
    }

    returnRealValue(): number {
        return this.realValue;
    }
}
