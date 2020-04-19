<template>
  <div>
    <div v-if="!created">
      <br><br>
      <div class="columns">
          <div class="column"></div>
          <div class="column is-one-third">
          <!-- <div class="control"> -->
          <!-- <input class="input" type="text" placeholder="Name" v-model="name"> -->
        <!-- </div> -->
        <br>
        <button class="button is-success" @click="createGame">Create</button>
        <br><br>
        <router-link class="button is-info is-outlined" :to="`/join`" tag="button">Go to Join Page</router-link>
        </div>
        <div class="column"></div>
      </div>
    </div>
    <div v-if="created">
      <h2>Game code : {{token}}</h2>
      Game created <br>
      Waiting for other players to join <br><br>
      Players joined: 
      <div v-if="games.length > 0">
      <span v-for="player in games[0].playersJoined" :key="player">
        <span class="has-text-danger">{{player}}<br></span> 
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
      name: "",
      token: 0,
      created: false,
      games: []
    };
  },
  methods: {
    createGame() {
       firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.name = user.displayName.split(" ")[0];
            }
            else {
              this.$router.push({ path: '/' });
            }
      if (this.name === "") {
        return;
      }
      this.token = Math.floor(100000 + Math.random() * 900000);
      db.collection('games').add({
        token: this.token,
        createdBy: this.name,
        createdAt: new Date(),
        playersJoined: [this.name],
        playersUID: [user.uid],
        playerPhotos: [],
        turn: this.name,
        gameOver: false,
        gameOverTeamWon: 0,
        bidderTeam: 0,
        roundStarter: this.name,
        state: "deal0",
        trump: "X",
        bid: 0,
        bidder: "",
        bids: [-1, -1, -1, -1],
        bidder1: this.name,
        bidder2: "",
        bidTurn: this.name,
        sequence: [],
        player1: [],
        player2: [],
        player3: [],
        player4: [],
        trumpState: "not set",
        team1: 0,
        team2: 0,
        team1current: 0,
        team2current: 0,
        stakes: 1,
        waitFlag: false,
        gameTurn: this.name,
        double: [],
        redouble: [],
        fullset: []
      });
      this.created = true;
      
      this.$bind('games', db.collection('games').where('token', '==', this.token));
      });
    }
  }
}
</script>


<style scoped>
  div {
    text-align: center;
    color: #dbd5d5;
  }
  h2 {
    font-size: 2rem;
    margin-top: 5rem;
  }
</style>
