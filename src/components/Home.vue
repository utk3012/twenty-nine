<template>
  <div id="app">
    <div class="main">
      <h1>29</h1>  
      <h2 v-if="name">Hi {{ name }}!</h2>
      <h2 v-else>Please Sign In</h2>
      <br>
      <button class="button is-danger" @click="login()">Login with Google</button>
      <br><br>
      <router-link class="button is-success" to="/create" tag="button">Create game</router-link>
      <br><br>
      <router-link class="button is-success" to="/join" tag="button">Join game</router-link>
      <br><br>
      <router-link class="button is-danger" to="/stats" tag="button">Statistics</router-link>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      name: null
    };
  },
  methods: {
    login() {
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
       this.name = user.displayName; 
      }
    });
  }
}
</script>

<style scoped>
h1 {
  font-size: 3rem;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #dbd5d5;
  margin-top: 40px;
}

</style>
