import {describe, expect, test, jest} from '@jest/globals';
import { Random } from 'random-js';
import { DieRoll } from '../DieRoll';

const mocked = jest.spyOn(Random.prototype, 'die').mockImplementation(() => 6);

describe('DieRoll', () => {
    test('initializes roll and mock test', () => {
        const dieRoll: DieRoll = new DieRoll(6);
        const a = dieRoll.roll();
        expect(a).toEqual(6);
        const b = dieRoll.roll();
        expect(b).toEqual(6);
        const c = dieRoll.roll();
        expect(c).toEqual(6);
        expect(mocked).toHaveBeenCalledTimes(3);

        expect(dieRoll.result).toBe(6);
        expect(dieRoll.sides).toBe(6);
    });
});