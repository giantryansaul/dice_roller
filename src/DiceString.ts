import { DiceGroup }  from "./DiceGroup";

// eslint-disable-next-line no-useless-escape
const DICE_SPLIT_REGEX = /((?:\d+d|d)\d+(?:k[hl]\d+)?|[\*\/\-\+()]|[+-]?(?:[0-9]*[.])?[0-9]+)/;
const DICE_GROUP_REGEX = /((?:\d+d|d)\d+(?:k[hl]\d+)?)/;

export class DiceString {
    input: string;
    splitInput: string[] = [];
    diceRollObjs: Array<string|DiceGroup> = [];
    evalString: string;
    result: number;

    constructor(input: string) {
        this.input = input;
        this.evalString = '';
        this.result = 0;
    }

    rollString(): number {
        this.splitInputByRegex();
        this.result = this.evalSplitInput();
        return this.result;
    }

    splitInputByRegex(): string[] {
        if (this.input === "") {
            throw new Error('Cannot evaluate empty input');
        }

        this.splitInput = this.input
            .toLowerCase()
            .split(" ")
            .flatMap(x => x.split(DICE_SPLIT_REGEX))
            .filter(x => x !== "");

        this.splitInput
            .forEach(x => {
                if (!RegExp(DICE_SPLIT_REGEX).test(x)) {
                    throw Error("Invalid characters on input");
                }
            });

        return this.splitInput;
    }

    evalSplitInput(): number {
        if (this.splitInput.length === 0) {
            throw Error('Cannot evaluate empty input');
        }

        this.diceRollObjs = this.splitInput.flatMap(x => {
            if (RegExp(DICE_GROUP_REGEX).test(x)) {
                const diceGroup = new DiceGroup(x);
                diceGroup.evalDiceInput();
                return diceGroup;
            } else {
                return x;
            }
        });

        this.evalString = this.diceRollObjs.map(x => {
                if (x instanceof DiceGroup) {
                    return x.returnRealValue();
                } else {
                    return x;
                }
            }).join('');

        return eval(this.evalString);
    }
}


