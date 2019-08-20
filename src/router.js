import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import Answer from './views/Answer.vue';
import HomePage from './views/HomePage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('./views/Admin.vue'),
    },
    {
      path: '/answer',
      name: 'answer',
      component: Answer,
    },
  ],
});
