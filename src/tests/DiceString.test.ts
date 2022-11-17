import {describe, expect, test, jest, beforeEach} from '@jest/globals';
import { DiceString } from '../DiceString';
import { DiceGroup } from '../DiceGroup';

const mockDiceGroup = jest.spyOn(DiceGroup.prototype, 'evalDiceInput').mockImplementation(() => 6);
const mockReturnValue = jest.spyOn(DiceGroup.prototype, 'returnRealValue').mockImplementation(() => 6);

describe('DiceString', () => {
    describe('splitInputByRegex', () => {

        //TODO: keep high, low
        //TODO: explode

        test('throws error when input is blank string', () => {
            const dice = new DiceString('');
            expect(() => {
            dice.splitInputByRegex();
            }).toThrow(new Error('Cannot evaluate empty input'));
        });

        test('throws error when input does not match dice or math operators', () => {
            const dice = new DiceString('{exit}');
            expect(() => {
            dice.splitInputByRegex();
            }).toThrow(new Error('Invalid characters on input'));
        });

        test('handles whitespace', () => {
            const dice = new DiceString(' 1 + 10 ');
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(["1", "+", "10"]);
        });

        test('handles floating point', () => {
            const dice = new DiceString(' 1 + 0.5 ');
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(["1", "+", "0.5"]);
        });

        test('handles division', () => {
            const dice = new DiceString(' 4 / 2 ');
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(["4", "/", "2"]);
        });

        test('handles multiplication', () => {
            const dice = new DiceString(' 2 * 2 ');
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(["2", "*", "2"]);
        });

        test('handles parenthesis', () => {
            const dice = new DiceString(' ( 2 * 2 ) ');
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(["(", "2", "*", "2", ")"]);
        });

        test('splits random input with numbers to output with numbers', () => {
            const dice = new DiceString("Random String 12345");
            expect(() => {
            dice.splitInputByRegex();
            }).toThrow(new Error('Invalid characters on input'));
        });

        test('splits "1+10" input to ["1", "+", "10"]', () => {
            const dice = new DiceString("1+10");
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(["1", "+", "10"]);
        });

        test('splits "d6" input to ["d6"]', () => {
            const dice = new DiceString("d6");
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(['d6']);
        });

        test('splits "D6" input to ["d6"]', () => {
            const dice = new DiceString("D6");
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(['d6']);
        });

        test('splits "2d6" input to ["2d6"]', () => {
            const dice = new DiceString('2d6');
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(['2d6']);
        });

        test('splits "100d100" input to ["100d100"]', () => {
            const dice = new DiceString('100d100');
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(['100d100']);
        });

        test('splits "d6+2d6" input to ["d6", "+", "2d6"]', () => {
            const dice = new DiceString('d6+2d6');
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(['d6', '+', '2d6']);
        });

        test('splits "(d6+2d6)-d4" input to ["(", "d6", "+", "2d6", ")", "-", "d4"]', () => {
            const dice = new DiceString('(d6+2d6)-d4');
            const ret = dice.splitInputByRegex();
            expect(ret).toEqual(["(", "d6", "+", "2d6", ")", "-", "d4"]);
        });
    });

    describe('evalSplitInput', () => {
        beforeEach(() => {
            mockDiceGroup.mockClear();
        });

        test('splits single roll out into single dice group', () => {
            const dice = new DiceString('2d6');
            dice.splitInput = ['2d6'];
            const ret = dice.evalSplitInput();
            expect(mockDiceGroup).toHaveBeenCalledTimes(1);
            expect(ret).toBe(6);
        });

        test('splits 2 rolls out to multiple groups', () => {
            const dice = new DiceString('2d6 + 3d10');
            dice.splitInput = ['2d6', '+', '3d6'];
            const ret = dice.evalSplitInput();
            expect(mockDiceGroup).toHaveBeenCalledTimes(2);
            expect(ret).toBe(12);
        });

        test('subtracts groups', () => {
            const dice = new DiceString('2d6 + 3d10');
            dice.splitInput = ['2d6', '-', '3d6'];
            const ret = dice.evalSplitInput();
            expect(mockDiceGroup).toHaveBeenCalledTimes(2);
            expect(ret).toBe(0);
        });

        test('divides groups', () => {
            const dice = new DiceString('2d6 / 3d10');
            dice.splitInput = ['2d6', '/', '3d6'];
            const ret = dice.evalSplitInput();
            expect(mockDiceGroup).toHaveBeenCalledTimes(2);
            expect(ret).toBe(1);
        });

        test('multiplies groups', () => {
            const dice = new DiceString('2d6 * 3d10');
            dice.splitInput = ['2d6', '*', '3d6'];
            const ret = dice.evalSplitInput();
            expect(mockDiceGroup).toHaveBeenCalledTimes(2);
            expect(ret).toBe(36);
        });

        test('uses floating point', () => {
            const dice = new DiceString('2d6 * 0.5');
            dice.splitInput = ['2d6', '*', '0.5'];
            const ret = dice.evalSplitInput();
            expect(mockDiceGroup).toHaveBeenCalledTimes(1);
            expect(ret).toBe(3);
        });

        test('uses parenthesis', () => {
            const dice = new DiceString('(d6 + 2) * 3d10');
            dice.splitInput = ['(', 'd6', '+', '2', ')', '*', '3d10'];
            const ret = dice.evalSplitInput();
            expect(mockDiceGroup).toHaveBeenCalledTimes(2);
            expect(ret).toBe(48);
        });
    });
});