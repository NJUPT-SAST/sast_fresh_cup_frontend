import Vue from 'vue';
import './plugins/vuetify';
import './plugins/animte.css';
import App from './App';
import router from './router';
import store from './store';

import mock from './mock/index';

Vue.config.productionTip = false;

new Vue({
  router,
  // store,
  store: mock,
  render: h => h(App),
}).$mount('#app');
