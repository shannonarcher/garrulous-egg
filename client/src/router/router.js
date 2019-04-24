import Home from '@/pages/Home.vue';
import Levels from '@/pages/Levels.vue';

export default {
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      pathToRegexOptions: {
        strict: true,
      },
    },
    {
      path: '/levels',
      name: 'levels',
      component: Levels,
      pathToRegexOptions: {
        strict: true,
      },
    },
  ],
};
