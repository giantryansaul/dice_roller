import {describe, expect, test, jest} from '@jest/globals';
import { Random } from 'random-js';
import { DieRoll } from '../DieRoll';

jest.mock('random-js', () => {
    return {
        Random: jest.fn().mockImplementation(() => {
            return {
                die: jest.fn().mockImplementation(() => { return 6; })
            };
        })
    };
});

// const mockRandom = jest.mocked(Random);
const mockRandom = Random as jest.Mocked<typeof Random>;
// const mockRandom = (Random as unknown as jest.Mocked<Random>);

describe('DieRoll', () => {
    test('initializes roll', () => {

        const dieRoll: DieRoll = new DieRoll(6);
        const a = dieRoll.roll();
        expect(a).toEqual(6);
        const b = dieRoll.roll();
        expect(b).toEqual(6);
        const c = dieRoll.roll();
        expect(c).toEqual(6);
        expect(mockRandom.mock.instances.length).toBe(1);
        expect(mockRandom.die.mock.calls.length).toBe(3);
    });
});