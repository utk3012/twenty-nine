<template>
  <div class="main">
      <div v-if="manipulate">
      <br><br>
      <div class="columns">
          <div class="column"></div>
          <div class="column is-one-third">
              <table class="table is-bordered is-striped is-narrow is-hoverable">
                <thead>
                    <tr>
                    <th>Team Mate</th>
                    <th>Matches Played</th>
                    <th>Won</th>
                    <th>Lost</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="([key, value], index) in Object.entries(teams)" :key="index">
                        <th>{{ key }}</th>
                        <td>{{ value.matches }}</td>
                        <td>{{ value.won }}</td>
                        <td>{{ value.matches - value.won}}</td>
                    </tr>
                </tbody>
              </table>
        </div>
        <div class="column"></div>
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
            games: [],
            manipulate: false,
            name: null,
            lastGames: [],
            teams: {}
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
        db.collection('games').where('playersUID', 'array-contains', user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.games.push(doc.data());
                })
                this.lastGames = this.games.filter(el => {
                    if (el.team1 >= 6 || el.team2 >= 6 || el.team1 <= -6 || el.team2 <= -6) {
                        return true;
                    }
                    return false;
                });
                for (const game of this.lastGames) {
                    const myIndex = game.playersJoined.indexOf(this.name);
                    const teamMateIndex = (myIndex+2)%4;
                    const teamMate = game.playersJoined[teamMateIndex];
                    if (!this.teams[teamMate]) {
                        this.teams[teamMate] = {matches: 0, won: 0}
                    }
                    this.teams[teamMate].matches += 1;
                    if (myIndex === 0 || teamMateIndex === 0) {
                        if (game.team1 >= 6 || game.team2 <= -6) {
                            this.teams[teamMate].won += 1;
                        }
                    }
                    if (myIndex !== 0 && teamMateIndex !== 0) {
                        if (game.team2 >= 6 || game.team1 <= -6) {
                            this.teams[teamMate].won += 1;
                        }
                    }
                }
                this.manipulate = true;
            })
      });
    },
  methods: {
      
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
