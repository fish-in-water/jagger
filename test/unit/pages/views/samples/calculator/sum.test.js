import sum from '../../../../../../src/pages/views/samples/calculator/sum';

describe('sum test suit',  () => {
  test('test sum result', () => {
    expect(sum(1, 2)).toBe(3);
  }); 
});
