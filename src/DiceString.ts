import { Random } from "random-js";
import { DiceGroup }  from "./DiceGroup";

// eslint-disable-next-line no-useless-escape
const DICE_SPLIT_REGEX = /((?:\d+d|d)\d+|[-\+()]|\d+)/;
const DICE_GROUP_REGEX = /((?:\d+d|d)\d+)/;

export class DiceString {
    input: string;
    randomGenerator: Random;
    splitInput: string[] = [];
    diceRollObjs: Array<string|DiceGroup> = [];
    evalString: string[] = [];

    constructor(input: string, randomGenerator = new Random()) {
        this.input = input;
        this.randomGenerator = randomGenerator;
    }

    eval() {
        this.splitInputByRegex();
        this.evalSplitInput();
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

    evalSplitInput(): Array<string|DiceGroup> {
        if (this.splitInput.length === 0) {
            throw Error('Cannot evaluate empty input');
        }

        this.diceRollObjs = this.splitInput.flatMap(x => {
            if (RegExp(DICE_GROUP_REGEX).test(x)) {
                const diceGroup = new DiceGroup(x, this.randomGenerator);
                diceGroup.evalDiceInput();
                return diceGroup;
            } else {
                return x;
            }
        });

        return this.diceRollObjs;
    }
}


