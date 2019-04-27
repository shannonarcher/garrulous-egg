import axios from 'axios';

const usersApi = 'http://0.0.0.0:3000/api/users';

export default {
  namespaced: true,
  state: {
    currentUser: {},
  },
  actions: {
    async login({ commit }, name) {
      const { data: user } = await axios.post(usersApi, {
        name,
      });
      commit('setCurrentUser', user);
    },
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
  },
};
