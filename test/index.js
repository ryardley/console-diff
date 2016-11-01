import { assert } from 'chai';
import { ast } from '../src/index';

describe('printf debugger', () => {
  it('should create the correct ast with adding an element.', () => {
    const obj1 = { one: 'one' };
    const obj2 = { one: 'one', two: 'two' };

    const colors = {
      normal: 'black',
      add: 'green',
      remove: 'red',
    };
    const expected = [
      {
        level: 0,
        color: colors.normal,
        text: '{',
        newline: true,
      },
      {
        level: 1,
        color: colors.normal,
        text: 'one: "one"',
        newline: true,
      },
      {
        level: 1,
        symbol: '+',
        color: colors.add,
        text: 'two: "two"',
        newline: true,
      },
      {
        level: 0,
        color: colors.normal,
        text: '}',
        newline: true,
      },
    ];
    const actual = ast(obj1, obj2);
    assert.deepEqual(actual, expected, 'output does not match');
  });
  it('should create the correct ast with removing an element.', () => {
    const obj1 = { one: 'one', two: 'two' };
    const obj2 = { one: 'one' };


    const colors = {
      normal: 'black',
      add: 'green',
      remove: 'red',
    };
    const expected = [
      {
        level: 0,
        color: colors.normal,
        text: '{',
        newline: true,
      },
      {
        level: 1,
        color: colors.normal,
        text: 'one: "one"',
        newline: true,
      },
      {
        level: 1,
        symbol: '-',
        color: colors.remove,
        text: 'two: "two"',
        newline: true,
      },
      {
        level: 0,
        color: colors.normal,
        text: '}',
        newline: true,
      },
    ];
    const actual = ast(obj1, obj2);
    assert.deepEqual(actual, expected, 'output does not match');
  });
  it('should create the correct ast with editing an element.', () => {
    const obj1 = { one: 'one', two: 'two' };
    const obj2 = { one: 'one', two: 'four' };


    const colors = {
      normal: 'black',
      add: 'green',
      remove: 'red',
    };
    const expected = [
      {
        level: 0,
        color: colors.normal,
        text: '{',
        newline: true,
      },
      {
        level: 1,
        color: colors.normal,
        text: 'one: "one"',
        newline: true,
      },
      {
        level: 1,
        symbol: '-',
        color: colors.remove,
        text: 'two: "two"',
        newline: true,
      },
      {
        level: 1,
        symbol: '+',
        color: colors.add,
        text: 'two: "four"',
        newline: true,
      },
      {
        level: 0,
        color: colors.normal,
        text: '}',
        newline: true,
      },
    ];
    const actual = ast(obj1, obj2);
    assert.deepEqual(actual, expected, 'output does not match');
  });
  it.only('should handle changing the contents of an array', () => {
    const obj1 = { one: 'one', two: ['two', 'twenty'] };
    const obj2 = { one: 'one', two: ['two', 'four'] };
    const actual = ast(obj1, obj2);
    // console.log(JSON.stringify(actual, null, 2));
    const expected = {};
    assert.deepEqual(actual, expected, 'output does not match');
  });
});
