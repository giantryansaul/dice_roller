import {describe, expect, test, jest, beforeEach} from '@jest/globals';
import { DiceGroup } from '../DiceGroup';
import { DieRoll } from '../DieRoll';

jest.mock('../DieRoll');
const mockDieRoll = jest.mocked(DieRoll);
const mockRoll = jest.spyOn(DieRoll.prototype, 'roll').mockImplementation(() => 6);

describe('DiceGroup', () => {
    describe('evalDiceInput', () => {
        beforeEach(() => {
            mockDieRoll.mockClear();
            mockRoll.mockClear();
        });

        test('initalize and returns DieRoll obj, d6(6) = 6', () => {
            const diceGroup = new DiceGroup('d6');
            expect(diceGroup.input).toBe('d6');
            const ret = diceGroup.evalDiceInput();
            expect(ret).toBe(6);
            expect(mockRoll).toBeCalledTimes(1);
            expect(mockDieRoll).toBeCalledTimes(1);
        });

        test('multiple DieRoll instances with a multiplier, 2d6(6+6) = 12', () => {
            const diceGroup = new DiceGroup('2d6');
            const ret = diceGroup.evalDiceInput();
            expect(ret).toBe(12);
            expect(mockRoll).toBeCalledTimes(2);
            expect(mockDieRoll).toBeCalledTimes(2);
        });
    });
});