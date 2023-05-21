import ID from './id';

test('test', () => {
  const time = new Date();
  const id = ID.create(time);
  const cache: string[] = [];

  expect(id.time).toEqual(new Date(time));

  for (let i = 0; i < 1e4; i++) {
    const id = ID.create().toString();
    expect(id in cache).toBeFalsy();
    cache.push(id);
  }
});
