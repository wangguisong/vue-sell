// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods';
import seller from 'components/seller/seller';
import ratings from 'components/ratings/ratings';

import 'common/stylus/index.styl';

// http://router.vuejs.org/zh-cn/essentials/getting-started.html
// 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(VueRouter);
Vue.use(VueResource);

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是通过 Vue.extend() 创建的组件构造器，或者，只是一个组件配置对象。
const routes = [
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
];

// 3. 创建 router 实例，然后传 `routes` 配置, 你还可以传别的配置参数, 不过先这么简单着吧。
// 参见Router 构造配置 http://router.vuejs.org/zh-cn/api/options.html
const router = new VueRouter({
  routes, // （缩写）相当于 routes: routes
  linkActiveClass: 'active' // 激活<router-link>时class类名
});

// 4. 创建和挂载根实例。记得要通过 router 配置参数注入路由，从而让整个应用都有路由功能
new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app');

// 默认导航
router.replace('goods');

// 跳过 eslint代码检查规则: eslint-disable no-new
/* eslint-disable no-new */
/* new Vue({
 el: '#app',
 template: '<App/>',
 components: {App}
 });
 */
