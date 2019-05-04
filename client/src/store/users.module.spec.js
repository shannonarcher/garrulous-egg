import mockAxios from 'axios';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';

import users from './users.module';

function createStore() {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  return new Vuex.Store({
    modules: {
      users,
    },
  });
}

describe('Users Module', () => {
  test('module should exist', () => {
    expect(users).toBeTruthy();
  });

  describe('when logging in a user', () => {
    test('it should obtain a new or existing user', async () => {
      mockAxios.post.mockImplementationOnce((path, data) => Promise.resolve({
        data: {
          name: data.name,
          id: 'an-id',
        },
      }));

      const store = createStore();
      await store.dispatch('users/login', 'Alice');
      expect(store.getters['users/user']).toEqual({
        name: 'Alice',
        id: 'an-id',
      });
    });
  });
});
