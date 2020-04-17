import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import { firestorePlugin } from 'vuefire';
import firebase from 'firebase/app'
import 'firebase/firestore'
import config from '../env.js'

import { routes } from './routes'
import './registerServiceWorker'

firebase.initializeApp(config)

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(firestorePlugin);

export const db = firebase.firestore()

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
