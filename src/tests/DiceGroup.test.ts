import {describe, expect, test, jest, beforeEach} from '@jest/globals';
import { DiceGroup } from '../DiceGroup';
import { DieRoll } from '../DieRoll';

jest.mock('../DieRoll');
const mockDieRoll = jest.mocked(DieRoll);
const mockRoll = jest.spyOn(DieRoll.prototype, 'roll').mockImplementation(() => 6);

describe('DiceGroup', () => {
    describe('returnDiceRollsAsString', () => {
        beforeEach(() => {
            mockDieRoll.mockClear();
            mockRoll.mockClear();
        });

        test('should return a string with the dice rolls', () => {
            const diceGroup = new DiceGroup('1d6');
            diceGroup.evalDiceInput();
            diceGroup.storedRoll = [{result: 6, sides: 6} as DieRoll];
            expect(diceGroup.returnDiceRollsAsString()).toBe('6(d6)');
        });

        test('should return a string with multiple dice rolls', () => {
            const diceGroup = new DiceGroup('2d6');
            diceGroup.evalDiceInput();
            diceGroup.storedRoll = [{result: 6, sides: 6} as DieRoll, {result: 6, sides: 6} as DieRoll];
            expect(diceGroup.returnDiceRollsAsString()).toBe('6(d6) 6(d6)');
        });

        test.skip('[Need to track dropped dice] should return a string with multiple dice rolls', () => {
            const diceGroup = new DiceGroup('2d6kh1');
            diceGroup.evalDiceInput();
            diceGroup.storedRoll = [{result: 6, sides: 6} as DieRoll, {result: 6, sides: 6} as DieRoll];
            expect(diceGroup.returnDiceRollsAsString()).toBe('6(d6)');
        });
    });

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
            const mockRoll = jest.spyOn(DieRoll.prototype, 'roll').mockReturnValueOnce(5).mockReturnValueOnce(3);
            const diceGroup = new DiceGroup('2d6');
            const ret = diceGroup.evalDiceInput();
            expect(ret).toBe(8);
            expect(mockRoll).toBeCalledTimes(2);
            expect(mockDieRoll).toBeCalledTimes(2);
        });

        test('keep one high die from 2d6kh1', () => {
            const mockRoll = jest.spyOn(DieRoll.prototype, 'roll').mockReturnValueOnce(5).mockReturnValueOnce(3);
            const diceGroup = new DiceGroup('2d6kh1');
            const ret = diceGroup.evalDiceInput();
            expect(ret).toBe(5);
            expect(mockRoll).toBeCalledTimes(2);
            expect(mockDieRoll).toBeCalledTimes(2);
        });

        test('keep two high die from 4d6kh2', () => {
            const mockRoll = jest.spyOn(DieRoll.prototype, 'roll')
                .mockReturnValueOnce(6)
                .mockReturnValueOnce(5)
                .mockReturnValueOnce(3)
                .mockReturnValueOnce(1);
            const diceGroup = new DiceGroup('4d6kh2');
            const ret = diceGroup.evalDiceInput();
            expect(ret).toBe(11);
            expect(mockRoll).toBeCalledTimes(4);
            expect(mockDieRoll).toBeCalledTimes(4);
        });

        test('keep one low die from 2d6kl1', () => {
            const mockRoll = jest.spyOn(DieRoll.prototype, 'roll').mockReturnValueOnce(5).mockReturnValueOnce(3);
            const diceGroup = new DiceGroup('2d6kl1');
            const ret = diceGroup.evalDiceInput();
            expect(ret).toBe(3);
            expect(mockRoll).toBeCalledTimes(2);
            expect(mockDieRoll).toBeCalledTimes(2);
        });

        test('keep two high die from 4d6kl2', () => {
            const mockRoll = jest.spyOn(DieRoll.prototype, 'roll')
                .mockReturnValueOnce(6)
                .mockReturnValueOnce(5)
                .mockReturnValueOnce(3)
                .mockReturnValueOnce(1);
            const diceGroup = new DiceGroup('4d6kl2');
            const ret = diceGroup.evalDiceInput();
            expect(ret).toBe(4);
            expect(mockRoll).toBeCalledTimes(4);
            expect(mockDieRoll).toBeCalledTimes(4);
        });
    });
});