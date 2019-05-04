import mockAxios from 'axios';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';

import levels from './levels.module';

function createStore() {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  return new Vuex.Store({
    modules: {
      levels,
    },
  });
}

describe('Levels Module', () => {
  test('module should exist', () => {
    expect(levels).toBeTruthy();
  });

  describe('when getting number of levels', () => {
    test('it should get the number of levels', async () => {
      mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: 100 }));

      const store = createStore();
      await store.dispatch('levels/getCount');
      expect(store.getters['levels/count']).toBe(100);
    });
  });

  describe('when getting the level ids', () => {
    test('it should get the level ids', async () => {
      mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: [{ id: 'an-id' }] }));

      const store = createStore();
      await store.dispatch('levels/getLevels');
      expect(store.getters['levels/levels'][0]).toEqual({
        id: 'an-id',
      });
    });
  });

  describe('when getting the level data', () => {
    beforeEach(() => {
      mockAxios.get.mockImplementation((url) => {
        if (url.includes('an-id')) {
          return Promise.resolve({
            data: {
              id: 'an-id',
              primaryWord: 'prism',
            },
          });
        }
        return Promise.resolve({ data: [{ id: 'an-id' }] });
      });
    });

    test('it should get data for the level', async () => {
      const store = createStore();
      await store.dispatch('levels/getLevels');
      await store.dispatch('levels/getLevel', 'an-id');

      expect(store.getters['levels/levels'][0]).toEqual(
        expect.objectContaining({
          id: 'an-id',
          primaryWord: 'prism',
        }),
      );
    });

    describe('when getting level data that has already been fetched', () => {
      test('it should get data for the level from cache', async () => {
        const store = createStore();
        await store.dispatch('levels/getLevels');
        await store.dispatch('levels/getLevel', 'an-id');

        mockAxios.get.mockClear();
        await store.dispatch('levels/getLevel', 'an-id');

        expect(store.getters['levels/levels'][0]).toEqual(
          expect.objectContaining({
            id: 'an-id',
            primaryWord: 'prism',
          }),
        );

        expect(mockAxios).not.toHaveBeenCalled();
      });
    });
  });
});
