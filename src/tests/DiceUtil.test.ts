import {describe, expect, test, jest} from '@jest/globals';
import { DiceString } from '../DiceString';
import { DiceGroup } from '../DiceGroup';

jest.mock('../DiceGroup', () => {
    return {
        DiceGroup: jest.fn().mockImplementation(() => {
            return {
                evalDiceInput: jest.fn().mockImplementation(() => { return 6; })
            };
        })
    };
});
const mockDiceGroup = jest.mocked(DiceGroup);

// let mockedDiceGroup: jest.Mocked<DiceGroup.DiceGroupType> = {
//     evalDiceInput: jest.fn()
// };
// mockedDiceGroup.default.mockReturnValue(6);

// const { default: DiceGroup } = (DiceGroup as unknown) as typeof 

// const mockDiceGroup = jest.mocked(DiceGroup);
// mockDiceGroup.evalDiceInput().mockReturnValue(6);
// (DiceGroup as unknown as jest.Mock).mockReturnValue(6);

describe('DiceString', () => {
    describe('splitInputByRegex', () => {
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

        //TODO: test for floating point numbers

        //TODO: multiplication and division

        //TODO: keep high, low, explode

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
            expect(mockDiceGroup.mock.instances.length).toBe(1);
        });

        test('splits 2 rolls out to multiple groups', () => {
            const dice = new DiceString('2d6 + 3d10');
            dice.splitInput = ['2d6 + 3d10'];
            const ret = dice.evalSplitInput();
            expect(mockDiceGroup.mock.instances.length).toBe(2);
        });
    });
});