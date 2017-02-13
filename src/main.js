import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';

// 引入路由组件
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

import 'common/stylus/index.styl';

// 开启debug模式
Vue.config.debug = true;

Vue.use(VueRouter);
Vue.use(VueResource);

// 创建路由实例
const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [{
    path: '/goods',
    component: goods
  }, {
    path: '/ratings',
    component: ratings
  }, {
    path: '/seller',
    component: seller
  }, {
    path: '/*',
    redirect: '/goods'
  }]
});

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

