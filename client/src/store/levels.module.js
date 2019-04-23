import axios from 'axios';

const levelsApi = 'http://0.0.0.0:3000/api/levels';

export default {
  state: {
    count: 0,
    ids: [],
    data: {},
  },
  actions: {
    async getLevelCount({ commit }) {
      const count = await axios.get(`${levelsApi}/count`);
      commit('setCount', count);
    },
    async getLevels({ commit }) {
      const levels = await axios.get(`${levelsApi}`);
      commit('setIds', levels);
    },
    async getLevel({ commit }, id) {
      const level = await axios.get(`${levelsApi}/${id}`);
      commit('setData', level);
    },
  },
  mutations: {
    /* eslint-disable no-param-reassign */
    setCount(state, count) {
      state.count = count;
    },
    setIds(state, ids) {
      state.ids = ids;
    },
    setData(state, level) {
      state.data = {
        ...state.data,
        [level.id]: level,
      };
    },
    /* eslint-enable no-param-reassign */
  },
};
