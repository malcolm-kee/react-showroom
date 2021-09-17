import { parseQueryString, stringifyQueryString } from './query-string';

test(`parseQueryString`, () => {
  expect(parseQueryString('name=malcolm&team=showroom')).toStrictEqual({
    name: 'malcolm',
    team: 'showroom',
  });
  expect(parseQueryString('?name=malcolm&team=showroom')).toStrictEqual({
    name: 'malcolm',
    team: 'showroom',
  });
  expect(parseQueryString('?name=malcolm&team=showroom&id&')).toStrictEqual({
    name: 'malcolm',
    team: 'showroom',
    id: '',
  });
  expect(
    parseQueryString('?person=malcolm&person=chew&team=showroom&id&')
  ).toStrictEqual({
    person: ['malcolm', 'chew'],
    team: 'showroom',
    id: '',
  });
});

test(`stringifyQueryString`, () => {
  expect(
    stringifyQueryString({
      name: 'malcolm',
      age: 5,
      details: null,
    })
  ).toMatchInlineSnapshot(`"?name=malcolm&age=5"`);
  expect(
    stringifyQueryString({
      good: true,
      age: 500,
      details: undefined,
    })
  ).toMatchInlineSnapshot(`"?good=true&age=500"`);
  expect(
    stringifyQueryString({
      person: ['malcolm', 'riki'],
      team: 'showroom',
      id: '',
    })
  ).toMatchInlineSnapshot(`"?person=malcolm&person=riki&team=showroom"`);
});
