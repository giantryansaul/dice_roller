import { Random } from "random-js";


export class DieRoll {
    sides: number;
    result = 0;
    randomGenerator: Random;
    dropped: Boolean;

    constructor(sides: number, randomGenerator = new Random()) {
        if (Number.isNaN(sides)) {
            throw Error('Sides was NaN');
        }
        this.sides = sides;
        this.randomGenerator = randomGenerator;
        this.dropped = false;
    }

    roll(): number {
        this.result = this.randomGenerator.die(this.sides);
        return this.result;
    }
}
