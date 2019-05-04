import store from './store';

describe('Store', () => {
  test('it should have modules defined', () => {
    expect(store.modules.levels).toBeDefined();
    expect(store.modules.users).toBeDefined();
  });
});
