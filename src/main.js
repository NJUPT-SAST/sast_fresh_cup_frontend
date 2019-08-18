import Vue from 'vue';
import './plugins/vuetify';
import './plugins/animte.css';
import App from './App';
import router from './router';
import store from './store/index';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
