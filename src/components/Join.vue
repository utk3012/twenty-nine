<template>
  <div class="main">
      <div v-if="!joined">
      <br><br>
      <div class="columns">
          <div class="column"></div>
          <div class="column is-one-third">
            <h1 class="has-text-white">Join Game</h1>
            <br>
          <div class="control">
          <input class="input" type="number" placeholder="Game code" v-model="token">
        </div>
        <br>
        <button class="button is-success" @click="joinGame" style="margin-right: 10px;">Join</button>
        &emsp;
        <router-link class="button is-info is-outlined" :to="`/create`" tag="button">Go to Create</router-link>
        <br><br>
        <div class="has-text-white">Last games joined: 
          <span class="has-text-success" v-for="(game, index) in lastGames" :key="game.token">{{ game.token }}<span v-if="index+1 != lastGames.length">, </span></span>
          <span class="has-text-danger" v-if="lastGames.length === 0">None</span>
          </div>
        </div>
        <div class="column"></div>
      </div>
    </div>
    <div v-if="joined" class="joined-view">
      Game joined <br>
      Waiting for other players to join <br><br>
      Players joined: 
      <div v-if="games.length > 0">
      <span v-for="player in games[0].playersJoined" :key="player">
        <span class="has-text-danger">{{ player }}<br></span> 
      </span>
      <br>
      <span v-if="games[0].playersJoined.length === 4">
          <router-link class="button is-success" :to="`/play/${token}`" tag="button">Play</router-link>
      </span>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../main';
import firebase from 'firebase';

export default {
    data() {
        return {
            token: null,
            joined: false,
            games: [],
            name: null,
            lastGames: []
        }
    },
    created() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.name = user.displayName.split(" ")[0];
        }
        else {
          this.$router.push({ path: '/' });
        }
        this.$bind('lastGames', db.collection('games').where('playersUID', 'array-contains', user.uid));
      });
    },
  methods: {
      joinGame() {
        // localStorage.setItem("player", this.token);
        // this.$router.push({ path: '/play/582563' });
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.name = user.displayName.split(" ")[0];
            }
            else {
              this.$router.push({ path: '/' });
            }
          if (!this.token || !this.name) {
              return;
          }
          db.collection('games').where('token', '==', +this.token)
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  if (doc.data().playersJoined.length < 4 && doc.data().playersUID.indexOf(user.uid) === -1) {  
                    if (doc.data().playersJoined.indexOf(this.name) !== -1) {
                      this.name += '1';
                    }                    
                    db.collection("games").doc(doc.id).update({ playersJoined: firebase.firestore.FieldValue.arrayUnion(this.name) });
                    db.collection("games").doc(doc.id).update({ playersUID: firebase.firestore.FieldValue.arrayUnion(user.uid) });
                    this.joined = true;
                  }
                  else if (doc.data().playersUID.indexOf(user.uid) !== -1) {
                    this.joined = true;
                  }
                })
            })
          this.$bind('games', db.collection('games').where('token', '==', +this.token));
        });
      }
  }
}
</script>


<style scoped>
  .main {
      text-align: center;
  }
  .joined-view {
      font-size: 1.1rem;
      margin-top: 5rem;
      color: #dbd5d5;
  }
</style>
