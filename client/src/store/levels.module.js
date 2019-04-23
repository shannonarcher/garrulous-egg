import axios from 'axios';

const levelsApi = 'http://0.0.0.0:3000/api/levels';

export default {
  namespaced: true,
  state: {
    count: 0,
    ids: [],
    data: {},
  },
  getters: {
    count(state) {
      return state.count;
    },
    levels(state) {
      return state.ids.map(level => state.data[level.id] || level);
    },
  },
  actions: {
    async getCount({ commit }) {
      const { data: count } = await axios.get(`${levelsApi}/count`);
      commit('setCount', count);
    },
    async getLevels({ commit }) {
      const { data: levels } = await axios.get(`${levelsApi}`);
      commit('setIds', levels);
    },
    async getLevel({ commit, state }, id) {
      if (state.data[id]) {
        return;
      }
      const { data: level } = await axios.get(`${levelsApi}/${id}`);
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
