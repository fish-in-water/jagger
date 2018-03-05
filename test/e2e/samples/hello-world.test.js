import { Selector } from 'testcafe';

fixture('Testing Calculator')// declare the fixture
  .page('http://localhost:3002/jagger/samples/calculator');  // specify the start page
  
test('title', async t => {
  await t.expect(Selector('title').innerText).eql('calculator');
});

test('1 + 2 = 3', async t => {
  await t
    .typeText('#num0', '1')
    .typeText('#num1', '2')
    .expect(Selector('#sum').value).eql('3');
});
