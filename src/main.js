import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import { firestorePlugin } from 'vuefire';
import firebase from 'firebase/app'
import 'firebase/firestore'

import { routes } from './routes'

firebase.initializeApp({
  apiKey: "AIzaSyC7VuiuyQyAaIjnEXbMR69U26TmJfHKXyM",
  authDomain: "twenty-nine-game.firebaseapp.com",
  databaseURL: "https://twenty-nine-game.firebaseio.com",
  projectId: "twenty-nine-game",
  storageBucket: "twenty-nine-game.appspot.com",
  messagingSenderId: "192071876425",
  appId: "1:192071876425:web:30923cc4527d786d4ea498",
  measurementId: "G-9E2L73Z1YD"
})

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
