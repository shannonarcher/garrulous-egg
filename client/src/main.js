import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import App from './App.vue';
import storeConfig from './store/store';
import routerConfig from './router/router';

Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store(storeConfig);
const router = new VueRouter(routerConfig);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app');
