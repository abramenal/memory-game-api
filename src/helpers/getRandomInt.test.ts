import getRandomInt from './getRandomInt';

const RANDOM_VALUE = 0.5;

jest.spyOn(Math, 'random').mockImplementation(() => RANDOM_VALUE);

describe('getRandomInt', () => {
  it('returns "random" integer value', () => {
    const res = getRandomInt(10);
    expect(res).toEqual(5);
  });
});
