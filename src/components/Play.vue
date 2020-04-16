<template>
  <div class="main" v-if="players.length === 3">
      <div class="columns is-vcentered" style="margin-top: 10px;">
         <div class="column">
          <div class="columns is-vcentered">
              <!-- <div class="column"/></div> -->
              <div class="column is-two-third" style="margin-left: 5px;">
             Bid: <span class="has-text-info"> {{ game[0].bidder }} 
                 <span class="has-text-weight-bold has-text-success"> {{ game[0].bid }} </span>
                 </span>
            <br>
            Trump: 
            <span v-if="game[0].trumpState === `not set`"> X</span>
            <span v-if="game[0].trumpState === `hidden`"> X</span>
            <span v-if="game[0].trumpState.endsWith(`pen`)"> {{ trumpValue }}</span>
            </div>
            <div class="column">
          <button class="button is-danger is-small" @click="revealTrump" :disabled="game[0].trumpState.endsWith(`pen`)">Trump</button>
          </div>
          </div>
        </div>
        <div class="column name">
            <span :class="game[0].turn === players[1] ? `has-text-info` : ``">{{ players[1] }}</span>&nbsp;
            <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" class="avatar">
        </div>
        <div class="column">
            <div class="columns is-vcentered">
              <div class="column is-half" style="margin-left: 5px;">
             Our points: {{ ourTeamRoundPoints }}<br>
            Their points: {{ theirTeamRoundPoints }}
            </div>
            <div class="column">
                Our Score <span class="has-text-weight-bold has-text-info">{{ ourTeamGamePoints }}</span>
            <br>
            Thier Score <span class="has-text-weight-bold has-text-info">{{ theirTeamGamePoints }}</span>
          </div>
          </div>
        </div>
      </div>
    
    <div class="columns is-vcentered" style="margin-top: 2%; min-height: 142.66px;">
        <div class="column name" style="text-align: left; margin-left: 15px; margin-top: 35px;">
            <span :class="game[0].turn === players[2] ? `has-text-info` : ``">{{ players[2] }}</span>&nbsp;
            <img src="https://www.w3schools.com/w3images/avatar2.png" alt="Avatar" class="avatar">
        </div>
        <div class="column is-half" style="display: block;  border-spacing: 10px; margin-left: 20px;">
            <span>
                    <div class="columns is-vcentered">
                        <div class="column" style="text-align: right; padding-right: 10px;">
                            <img class="card" :src="getImagePath(tableCards[0])" :alt="`${tableCards[0]}`" style="margin-right: 0px;" v-if="tableCards[0] !== ``">
                        </div>
                        <div style="width: 50px;">
                            <span v-if="tableCards[1] !== ``">
                                <img class="card" :src="getImagePath(tableCards[1])" :alt="`${tableCards[1]}`">
                            </span>
                            <span v-else>
                                <div style="min-height: 66px;"></div>
                            </span>
                            <br>
                            <span v-if="tableCards[2] !== ``">
                                <img class="card" :src="getImagePath(tableCards[2])" :alt="`${tableCards[2]}`">
                            </span>
                            <span v-else>
                                <div style="min-height: 66px;"></div>
                            </span>
                        </div>
                        <div class="column" style="text-align: left;">
                            <img class="card" :src="getImagePath(tableCards[3])" :alt="`${tableCards[3]}`" v-if="tableCards[3] !== ``">
                        </div>
                    </div>
                        <!-- <img class="card" :src="getImagePath(card)" :alt="`${card}`"> -->
                        <!-- 1023 -->
                </span>
        </div>
        <div class="column name" style="text-align: right; margin-right: 15px;  margin-top: 35px;">
            <span :class="game[0].turn === players[0] ? `has-text-info` : ``">{{ players[0] }}</span>&nbsp;
            <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="Avatar" class="avatar">
        </div>
      </div>

      <div class="columns" style="margin-top: 0%;">
        <div class="column" style="display: block; margin-left: 50px;">    
            <div class="has-text-danger" style="margin-bottom: 10px;">
                <span v-if="game[0].state === `play` && game[0].turn === myName">Your turn</span>
                <span v-if="game[0].state === `play` && game[0].turn !== myName">{{ game[0].turn }}'s Turn</span>
                <span v-if="game[0].state === `bidding` && game[0].bidTurn !== myName">{{ game[0].bidTurn }} is bidding</span>
                <span v-if="game[0].state === `setTrump` && game[0].bidder !== myName">{{ game[0].bidder }} is setting trump</span>
            </div>
            <span v-if="game[0].state !== 'deal0'">
                <span v-for="(card, index) in game[0][`player${myIndex+1}`]" :key="card">
                    <span>
                        <img class="card" :src="getImagePath(card)" :alt="`${card}`" @click="playCard(card, index)">
                    </span>
                </span>
            </span> 
            <span v-if="game[0].turn === myName && game[0].state === 'deal0'">
                <button class="button is-success is-small" @click="dealCards(16)">New Deal</button>
            </span>
            <span v-if="game[0].turn !== myName && game[0].state === 'deal0'">
                Waiting for {{ game[0].turn }} to deal
            </span>
        </div>
      </div>
    



        <div :class="`modal ${bidModalView}`">
        <div class="modal-background"></div>
        <div class="modal-content">
            <!-- <div class="modal-card">
                <header class="modal-card-head">
            <p class="modal-card-title">Bid</p>
            <button class="button is-info" @click="bid(0)">Pass</button>
            </header> -->
            <!-- <section class="modal-card-body"> -->
            <div class="buttons has-addons is-centered">
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 16, game[0].bidder1)" @click="bid(16)">16</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 17, game[0].bidder1)" @click="bid(17)">17</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 18, game[0].bidder1)" @click="bid(18)">18</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 19, game[0].bidder1)" @click="bid(19)">19</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 20, game[0].bidder1)" @click="bid(20)">20</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 21, game[0].bidder1)" @click="bid(21)">21</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 22, game[0].bidder1)" @click="bid(22)">22</button>
            </div>
            <div class="buttons has-addons is-centered">
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 23, game[0].bidder1)" @click="bid(23)">23</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 24, game[0].bidder1)" @click="bid(24)">24</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 25, game[0].bidder1)" @click="bid(25)">25</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 26, game[0].bidder1)" @click="bid(26)">26</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 27, game[0].bidder1)" @click="bid(27)">27</button>
                <button class="button is-info" :disabled="calculateBid(game[0].bid, 28, game[0].bidder1)" @click="bid(28)">28</button>
                <button class="button is-danger" @click="bid(0)">Pass</button>
            </div>
            <span class="has-text-white">Current bid:&emsp;</span>
            <span v-if="game[0].bid !== 0">
                <span class="has-text-danger">{{ game[0].bid }}</span>
                <span class="has-text-white">&emsp;by&emsp;</span> <span class="has-text-danger">{{ game[0].bidder }}</span>
            </span>
            <span v-else>
                <span class="has-text-danger">None</span>
            </span>
            <!-- </section> -->
            </div>
        <!-- </div> -->
        </div>

        <div :class="`modal ${trumpModalView}`" v-if="trumpModalView === `is-active`">
            <div class="modal-background"></div>
            <div class="modal-content">
                <!-- <div class="modal-card">
                    <header class="modal-card-head">
                <p class="modal-card-title">Bid</p>
                <button class="button is-info" @click="bid(0)">Pass</button>
                </header> -->
                <!-- <section class="modal-card-body"> -->
                    Set Trump <br><br>
                    <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][0])" alt="card" @click="setTrump(game[0][`player${myIndex+1}`][0][game[0][`player${myIndex+1}`][0].length - 1])">
                    <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][1])" alt="card" @click="setTrump(game[0][`player${myIndex+1}`][1][game[0][`player${myIndex+1}`][1].length - 1])">
                    <br>
                    <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][2])" alt="card" @click="setTrump(game[0][`player${myIndex+1}`][2][game[0][`player${myIndex+1}`][2].length - 1])">
                    <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][3])" alt="card" @click="setTrump(game[0][`player${myIndex+1}`][3][game[0][`player${myIndex+1}`][3].length - 1])">
                <!-- </section> -->
                </div>
            <!-- </div> -->
        </div>

        <div :class="`modal ${doubleModalView}`" v-if="doubleModalView === `is-active`">
            <div class="modal-background"></div>
            <div class="modal-content">
                <!-- <div class="modal-card">
                    <header class="modal-card-head">
                <p class="modal-card-title">Bid</p>
                <button class="button is-info" @click="bid(0)">Pass</button>
                </header> -->
                <!-- <section class="modal-card-body"> -->
                    <div class="buttons has-addons is-centered">
                        <button class="button is-danger" @click="highStakes(stakeValue)">
                            <span v-if="game[0].state === `double0`">Set Double</span>
                            <span v-if="game[0].state === `double1`">Set Re-Double</span>
                            <span v-if="game[0].state === `double2`">Full set</span>
                        </button>
                        <button class="button is-info" @click="highStakes(0)">Cancel</button>
                    </div>
                <!-- </section> -->
                </div>
            <!-- </div> -->
        </div>

        <div :class="`modal ${roundOverModalView}`" v-if="roundOverModalView === `is-active`">
        <div class="modal-background"></div>
        <div class="modal-content custom-modal">
            <div class="modal-card" style="width: 300px;">
                <section class="modal-card-body has-text-black" style="background-color: #dedede;">
                        Top Bidder: {{ game[0].bidder }} <br>
                        Bid: {{ game[0].bid }} <br>
                        Our points: {{ ourTeamRoundPoints }} <br>
                        Their points: {{ theirTeamRoundPoints }} <br><br>
                        <button class="button is-success is-small" :disabled="disableResetButton" v-if="this.myName === game[0].bidder" @click="resetGame()">Next</button>
                </section>
            </div> 
        </div>
        </div>

        <div :class="`modal ${marriageModalView}`" v-if="marriageModalView === `is-active`">
        <div class="modal-background"></div>
        <div class="modal-content custom-modal">
            <div class="modal-card" style="width: 300px;">
                <section class="modal-card-body has-text-black" style="background-color: #dedede;">
                        {{ hasMarriage }} has marriage!<br><br>
                        <button class="button is-success is-small" @click="ackMarriage">Next</button>
                </section>
            </div> 
        </div>
        </div>
        
  </div>

</template>

<script>
import { db } from '../main'
import firebase from 'firebase';

export default {
    data() {
        return {
            game: null,
            myName: "",
            players: [],
            myIndex: -1,
            docId: "",
            disableResetButton: false,
            cards: ["JC", "9C", "AC", "10C", "KC", "QC", "8C", "7C", "JD", "9D", "AD", "10D", "KD", "QD", "8D", "7D", "JS", "9S", "AS", "10S", "KS", "QS", "8S", "7S", "JH", "9H", "AH", "10H", "KH", "QH", "8H", "7H"],
            order: ["JC", "9C", "AC", "10C", "KC", "QC", "8C", "7C", "JD", "9D", "AD", "10D", "KD", "QD", "8D", "7D", "JS", "9S", "AS", "10S", "KS", "QS", "8S", "7S", "JH", "9H", "AH", "10H", "KH", "QH", "8H", "7H"]
        };
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.$router.push({ path: '/' });
            }
            // else {
            // }
        // this.myName = localStorage.getItem("player");
        db.collection('games').where('token', '==', +this.$route.params.id)
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  this.docId = doc.id;
                  this.myIndex = doc.data().playersUID.indexOf(user.uid);
                  if (!doc.data().playersUID.includes(user.uid) || doc.data().playersUID.length !== 4) {
                      this.$router.push({ path: '/join' });
                    return;
                  }
                  this.myName = doc.data().playersJoined[this.myIndex];
                // this.myIndex = doc.data().playersJoined.indexOf(this.myName);
                  this.players.push(doc.data().playersJoined[(doc.data().playersJoined.indexOf(this.myName)+1)%4]);
                  this.players.push(doc.data().playersJoined[(doc.data().playersJoined.indexOf(this.myName)+2)%4]);
                  this.players.push(doc.data().playersJoined[(doc.data().playersJoined.indexOf(this.myName)+3)%4]);
                })
            })
        });
    },
    methods: {
        dealCards(num) {
            let p1 = [];
            let p2 = [];
            let p3 = [];
            let p4 = [];
            db.collection('games').where('token', '==', +this.$route.params.id)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (num === 0) {
                            this.cards = this.cards.filter((val) => {
                                if (!doc.data().cardsDealt.includes(val)) {
                                    return true;
                                }
                                return false;
                            });
                        }
                        while (this.cards.length > num) {
                            const rand = Math.floor(Math.random() * (this.cards.length-1));
                            if (this.cards.length % 4 === 0) {
                                p1.push(this.cards[rand]);
                            }
                            if (this.cards.length % 4 === 1) {
                                p2.push(this.cards[rand]);
                            }
                            if (this.cards.length % 4 === 2) {
                                p3.push(this.cards[rand]);
                            }
                            if (this.cards.length % 4 === 3) {
                                p4.push(this.cards[rand]);
                            }
                            this.cards.splice(rand, 1);
                        }
                        let state = "bidding";
                        if (num === 0) {
                            p1 = [...doc.data().player1, ...p1];
                            p2 = [...doc.data().player2, ...p2];
                            p3 = [...doc.data().player3, ...p3];
                            p4 = [...doc.data().player4, ...p4];
                            state = "play";
                        }
                        else {
                            db.collection("games").doc(doc.id).update({cardsDealt: [...p1, ...p2, ...p3, ...p4]});
                        }
                        p1.sort(this.sortOrder);
                        p2.sort(this.sortOrder);
                        p3.sort(this.sortOrder);
                        p4.sort(this.sortOrder);
                        db.collection("games").doc(doc.id).update({player1: p1});
                        db.collection("games").doc(doc.id).update({player2: p2});
                        db.collection("games").doc(doc.id).update({player3: p3});
                        db.collection("games").doc(doc.id).update({player4: p4});
                        db.collection("games").doc(doc.id).update({state: state});
                    })
                })
        },
        getImagePath(fileName) {
            return require(`../assets/${fileName}.jpg`);
        },
        sortOrder(a, b) {
            return this.order.indexOf(a) - this.order.indexOf(b);
        },
        calculateBid(current, val, bidder1) {
            if (current < val) {
                return false;
            }
            if (current === val && this.myName === bidder1) {
                return false;
            }
            return true;
        },
        bid(value) {
            db.collection('games').where('token', '==', +this.$route.params.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const ind = doc.data().playersJoined.indexOf(this.myName);
                    const tempBids = [...doc.data().bids];
                    tempBids[ind] = value;
                    db.collection("games").doc(doc.id).update({ bids: tempBids });
                    if (value !== 0) {
                        db.collection("games").doc(doc.id).update({ bidder: this.myName });
                    }
                    db.collection("games").doc(doc.id).update({ bid: Math.max(...tempBids) });
                    let count = 0;
                    if (doc.data().bidder2 === "") {
                        db.collection("games").doc(doc.id).update({ bidder2: doc.data().playersJoined[(ind+1)%4] });
                    }
                    for (let i = 0; i < 4; i++) {
                        count += (tempBids[i] === 0) ? 1 : 0;
                    }
                    if (count === 3) {
                        db.collection("games").doc(doc.id).update({ state: "setTrump" });
                        return;
                    }
                    let nextBidder = "";
                    for (let i = 0; i < 4; i++) {
                        if (tempBids[(i+ind+1) % 4] === -1) {
                            nextBidder = doc.data().playersJoined[(i+ind+1) % 4];
                            break;
                        }
                    }
                    if (value === 0) {
                        if (Math.max(...tempBids) === 0) {
                            db.collection("games").doc(doc.id).update({ bidder1: doc.data().playersJoined[(ind+1)%4] });
                            db.collection("games").doc(doc.id).update({ bidder2: doc.data().playersJoined[(ind+2)%4] });
                        }
                        else {
                            if (this.myName === doc.data().bidder1) {
                                db.collection("games").doc(doc.id).update({ bidder1: doc.data().bidder2 });
                            }
                            db.collection("games").doc(doc.id).update({ bidder2: nextBidder });
                        }
                        db.collection("games").doc(doc.id).update({ bidTurn: nextBidder });
                    }
                    else {
                        if (doc.data().bidTurn === doc.data().bidder1) {
                            db.collection("games").doc(doc.id).update({ bidTurn: (doc.data().bidder2 === "" ? doc.data().playersJoined[(ind+1)%4] : doc.data().bidder2) });
                        }
                        else if (doc.data().bidTurn === doc.data().bidder2) {
                            db.collection("games").doc(doc.id).update({ bidTurn: doc.data().bidder1 });
                        }
                    }
                })
            })
        },
        setTrump(suit) {
            db.collection('games').where('token', '==', +this.$route.params.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    db.collection("games").doc(doc.id).update({ trump: suit });
                    db.collection("games").doc(doc.id).update({ trumpState: "hidden" });
                    db.collection("games").doc(doc.id).update({ state: "double0" });
                })
            })
        },
        revealTrump() {
            db.collection('games').where('token', '==', +this.$route.params.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (this.myName !== doc.data().turn) {
                        return;
                    }
                    const ind = doc.data().playersJoined.indexOf(this.myName);
                    const newSeq = [...doc.data().sequence];
                    const len = newSeq.length;
                    let checkRange = newSeq.slice(Math.max(len - (len%4), 0));
                    const playerCards = [...doc.data()[`player${ind+1}`]];
                    if (checkRange.length === 0) {
                        checkRange = newSeq.slice(len - 4);
                    }

                    const suit = checkRange[0][checkRange[0].length - 1];
                    const ownsSuit = playerCards.some((val) => {
                        return val.endsWith(suit);
                    });
                    if (ownsSuit) {
                        // player has suit, cannot open trump
                        return;
                    }
                    // checking for marriage
                    for (let i = 1; i <= 4; i++) {
                        if (doc.data()[`player${i}`].includes(`K${doc.data().trump}`) && doc.data()[`player${i}`].includes(`Q${doc.data().trump}`)) {
                            if (doc.data().playersJoined[i-1] === doc.data().bidder || doc.data().playersJoined[(i-1+2)%4] === doc.data().bidder) {
                                db.collection("games").doc(doc.id).update({ bid: Math.max(doc.data().bid-4, 16) });
                            }
                            else {
                                db.collection("games").doc(doc.id).update({ bid: Math.max(doc.data().bid+4, 28) });
                            }
                            db.collection("games").doc(doc.id).update({ state: `marriage ${doc.data().playersJoined[i-1]}` });
                            break;
                        }
                    }

                    db.collection("games").doc(doc.id).update({ trumpState: "justOpen" });
                })
            })
        },
        highStakes(val) {
            if (val === 0) {
                this.dealCards(0);
                return;
            }
            db.collection('games').where('token', '==', +this.$route.params.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (val === 2) {
                        db.collection("games").doc(doc.id).update({ stakes: val });
                        db.collection("games").doc(doc.id).update({ state: "double1" });
                    }
                    else if (val === 4) {
                        db.collection("games").doc(doc.id).update({ stakes: val });
                        db.collection("games").doc(doc.id).update({ state: "double2" });
                    }
                    else {
                        db.collection("games").doc(doc.id).update({ stakes: val });
                        this.dealCards(0);
                    }
                })
            })
        },
        playCard(card, index) {
            if (this.game[0].turn !== this.myName) {
                return;
            }
            db.collection('games').where('token', '==', +this.$route.params.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const ind = doc.data().playersJoined.indexOf(this.myName);
                    const newSeq = [...doc.data().sequence, card];
                    const len = newSeq.length;
                    let checkRange = newSeq.slice(Math.max(len - (len%4), 0));
                    const playerCards = [...doc.data()[`player${ind+1}`]];
                    if (checkRange.length === 0) {
                        checkRange = newSeq.slice(len - 4);
                    }

                    const suit = checkRange[0][checkRange[0].length - 1];
                    if (!card.endsWith(suit)) {
                        const ownsSuit = playerCards.some((val) => {
                            return val.endsWith(suit);
                        });
                        if (ownsSuit) {
                            // player has suit, didnot throw
                            return;
                        }
                    }
                    if (doc.data().trumpState === "justOpen" && !card.endsWith(doc.data().trump)) {
                        const ownsSuit = playerCards.some((val) => {
                            return val.endsWith(doc.data().trump);
                        });
                        if (ownsSuit) {
                            // player has trump, didnot throw inspite of having
                            return;
                        }
                        db.collection("games").doc(doc.id).update({ trumpState: 'open' });
                    }
                    if (doc.data().trumpState === "justOpen") {
                        db.collection("games").doc(doc.id).update({ trumpState: 'open' });
                    }
                    db.collection("games").doc(doc.id).update({ sequence: [...doc.data().sequence, card] });
                    playerCards.splice(index, 1);
                    db.collection("games").doc(doc.id).update({ [`player${ind+1}`]: playerCards });
                    if (newSeq.length % 4 === 0) {
                        db.collection("games").doc(doc.id).update({ waitFlag: true });
                        this.keepRoundScore(checkRange);
                    }
                    else {
                        db.collection("games").doc(doc.id).update({ turn: doc.data().playersJoined[(ind+1)%4] });
                    }
                })
            })
        },
        keepRoundScore(checkRange) {
            const playerOrder = [...this.players, this.myName];
            let cards = {
                "J" : { points: 3, priority: 7},
                "9" : { points: 2, priority: 6},
                "A" : { points: 1, priority: 5},
                "10" : { points: 1, priority: 4},
                "K" : { points: 0, priority: 3},
                "Q" : { points: 0, priority: 2},
                "8" : { points: 0, priority: 1},
                "7" : { points: 0, priority: 0},
            };
            db.collection('games').where('token', '==', +this.$route.params.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const trump = doc.data().trump;
                    const trumpState = doc.data().trumpState;
                    let firstCard = checkRange[0];
                    let points = cards[firstCard.slice(0, firstCard.length-1)].points;
                    let highestCard = firstCard.charAt(firstCard.length-1), 
                    highestCardPriority = cards[firstCard.slice(0, firstCard.length-1)].priority, 
                    roundWinner = playerOrder[0];
                    checkRange.splice(0,1);
                    playerOrder.splice(0,1);
                    checkRange.forEach((playedCard, i)=>{
                        let currentCard = playedCard.charAt(playedCard.length-1);
                        let currentCardPriority = cards[playedCard.slice(0, playedCard.length-1)].priority;
                        points += cards[playedCard.slice(0,playedCard.length - 1)].points;
                        if (trumpState === "hidden" || currentCard === highestCard) {
                            if (currentCardPriority > highestCardPriority){
                                highestCardPriority = currentCardPriority;
                                roundWinner = playerOrder[i];
                            }
                        } else {
                            if (currentCard === trump) {
                                highestCard = trump;
                                highestCardPriority = currentCardPriority;
                                roundWinner = playerOrder[i];
                            }
                        }
                    });
                    let finalRoundScore = {team1 :doc.data().team1current, team2: doc.data().team2current};
                    let myTeamNum = 2, theirTeamNum = 2;
                    if (this.myName === doc.data().createdBy || this.players[1] === doc.data().createdBy) {
                        myTeamNum = 1;
                    }
                    // our team won round
                    if (roundWinner === this.myName || roundWinner === this.players[1]) {
                        db.collection("games").doc(doc.id).update({ [`team${myTeamNum}current`]: (doc.data()[`team${myTeamNum}current`] + points) });
                        finalRoundScore[`team${myTeamNum}`] += points;
                    }
                    // their team won round
                    else {
                        theirTeamNum = (myTeamNum === 1) ? 2 : 1;
                        db.collection("games").doc(doc.id).update({ [`team${theirTeamNum}current`]: (doc.data()[`team${theirTeamNum}current`] + points) });
                        finalRoundScore[`team${theirTeamNum}`] += points;
                    }
                    if ((finalRoundScore.team1 + finalRoundScore.team2) === 28) {
                        this.keepGameScore(finalRoundScore, myTeamNum, theirTeamNum);
                    }
                    db.collection("games").doc(doc.id).update({ turn: roundWinner });
                    setTimeout(() => {
                        db.collection("games").doc(doc.id).update({ waitFlag: false });
                        db.collection("games").doc(doc.id).update({ roundStarter: roundWinner });
                    }, 3000);
                })
            })
        },
        keepGameScore(finalRoundScore, myTeamNum, theirTeamNum) {
            db.collection('games').where('token', '==', +this.$route.params.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // our team won game
                    if (doc.data().bidder === this.myName || doc.data().bidder === this.players[1]) {
                        if (doc.data().bid <= finalRoundScore[`team${myTeamNum}`]) {
                            db.collection("games").doc(doc.id).update({ [`team${myTeamNum}`]: (doc.data()[`team${myTeamNum}`] + doc.data().stakes) });
                        }
                        else {
                            db.collection("games").doc(doc.id).update({ [`team${myTeamNum}`]: (doc.data()[`team${myTeamNum}`] - doc.data().stakes) });
                        }
                    }
                    // their team won game
                    else {
                        if (doc.data().bid <= finalRoundScore[`team${theirTeamNum}`]) {
                            db.collection("games").doc(doc.id).update({ [`team${theirTeamNum}`]: (doc.data()[`team${theirTeamNum}`] + doc.data().stakes) });
                        }
                        else {
                            db.collection("games").doc(doc.id).update({ [`team${theirTeamNum}`]: (doc.data()[`team${theirTeamNum}`] - doc.data().stakes) });
                        }
                    }
                    db.collection("games").doc(doc.id).update({ state: "roundOver" });
                })
            })
        },
        resetGame() {
            this.disableResetButton = true;
            setTimeout(() => {
                db.collection('games').where('token', '==', +this.$route.params.id)
                .get()
                .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const ind = doc.data().playersJoined.indexOf(doc.data().gameTurn);
                    const nextPlayer = doc.data().playersJoined[(ind+1)%4];
                    db.collection("games").doc(doc.id).update({ state: "deal0" });
                    db.collection("games").doc(doc.id).update({ bid: 0 });
                    db.collection("games").doc(doc.id).update({ bidTurn: nextPlayer });
                    db.collection("games").doc(doc.id).update({ bidder: "" });
                    db.collection("games").doc(doc.id).update({ bidder1: nextPlayer });
                    db.collection("games").doc(doc.id).update({ bidder2: "" });
                    db.collection("games").doc(doc.id).update({ bids: [-1, -1, -1, -1] });
                    db.collection("games").doc(doc.id).update({ cardsDealt: [] });
                    db.collection("games").doc(doc.id).update({ gameTurn: nextPlayer });
                    db.collection("games").doc(doc.id).update({ player1: [] });
                    db.collection("games").doc(doc.id).update({ player2: [] });
                    db.collection("games").doc(doc.id).update({ player3: [] });
                    db.collection("games").doc(doc.id).update({ player4: [] });
                    db.collection("games").doc(doc.id).update({ sequence: [] });
                    db.collection("games").doc(doc.id).update({ stakes: 1 });
                    db.collection("games").doc(doc.id).update({ team1current: 0 });
                    db.collection("games").doc(doc.id).update({ team2current: 0 });
                    db.collection("games").doc(doc.id).update({ trump: 'X' });
                    db.collection("games").doc(doc.id).update({ trumpState: 'not set' });
                    db.collection("games").doc(doc.id).update({ turn: nextPlayer });
                    db.collection("games").doc(doc.id).update({ roundStarter: nextPlayer });
                    this.disableResetButton = false;
                    })
                })
            }, 2000);
        },
        ackMarriage() {
            setTimeout(() => {
                db.collection('games').where('token', '==', +this.$route.params.id)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection("games").doc(doc.id).update({ state: "play" });
                        })
                    })
            }, 2000);
        }
    },
    firestore() {
        return {
            game: db.collection('games').where('token', '==', +this.$route.params.id)
        };
    },
    computed: {
        bidModalView() {
            if (this.game[0].state === "bidding" && this.game[0].bidTurn === this.myName) {
                return 'is-active';
            }
            return "";
        },
        trumpModalView() {
            if (this.game[0].state === "setTrump" && this.game[0].bidder === this.myName) {
                return 'is-active';
            }
            return "";
        },
        roundOverModalView() {
            if (this.game[0].state === "roundOver") {
                return 'is-active';
            }
            return "";
        },
        marriageModalView() {
            if (this.game[0].state.startsWith('marriage')) {
                return 'is-active';
            }
            return "";
        },
        hasMarriage() {
            if (this.game[0].state.startsWith('marriage')) {
                return this.game[0].state.split(" ")[1];
            }
            return "";
        },
        doubleModalView() {
            if (this.game[0].state === "double0" && (this.game[0].bidder !== this.myName && this.game[0].bidder !== this.players[1])) {
                return 'is-active';
            }
            else if (this.game[0].state === "double1" && (this.game[0].bidder === this.myName || this.game[0].bidder === this.players[1])) {
                return 'is-active';
            }
            else if (this.game[0].state === "double2" && (this.game[0].bidder !== this.myName && this.game[0].bidder !== this.players[1])) {
                return 'is-active';
            }
            return "";
        },
        trumpValue() {
            if (this.game[0].trump === "S") {
                return '♠';
            }
            else if (this.game[0].trump === "C") {
                return '♣';
            }
            else if (this.game[0].trump === "H") {
                return '♥';
            }
            else {
                return '♦';
            }
        },
        // trumpColor() {
        //     if (this.game[0].trump === "H" || this.game[0].trump === "D") {
        //         return "color: red";
        //     }
        //     return "";
        // },
        stakeValue() {
            if (this.game[0].state === 'double0') {
                return 2;
            }
            else if (this.game[0].state === 'double1') {
                return 4;
            }
            else {
                return 6;
            }
        },
        tableCards() {
            const len = this.game[0].sequence.length;
            const roundStarterIndex = [...this.players, this.myName].indexOf(this.game[0].roundStarter);
            const order = {
                "0": [3, 1, 0, 2],
                "1": [1, 0, 2, 3],
                "2": [0, 2, 3, 1],
                "3": [2, 3, 1, 0]
            };
            const answer = ["", "", "", ""];
            let toDisplay = [];
            if (len > 0 && len % 4 === 0 && this.game[0].waitFlag) {
                toDisplay = this.game[0].sequence.slice(len - 4);
            }
            else {
                toDisplay =  this.game[0].sequence.slice(Math.max(len - (len%4), 0));
            }
            for (let i=0; i<toDisplay.length; i++) {
                answer[order[roundStarterIndex][i]] = toDisplay[i];
            }
            return answer;
        },
        ourTeamRoundPoints() {
            let myTeamNum = 2;
            if (this.myName === this.game[0].createdBy || this.players[1] === this.game[0].createdBy) {
                myTeamNum = 1;
            }
            return this.game[0][`team${myTeamNum}current`];
        },
        theirTeamRoundPoints() {
            let theirTeamNum = 1;
            if (this.myName === this.game[0].createdBy || this.players[1] === this.game[0].createdBy) {
                theirTeamNum = 2;
            }
            return this.game[0][`team${theirTeamNum}current`];
        },
        ourTeamGamePoints() {
            let myTeamNum = 2;
            if (this.myName === this.game[0].createdBy || this.players[1] === this.game[0].createdBy) {
                myTeamNum = 1;
            }
            return this.game[0][`team${myTeamNum}`];
        },
        theirTeamGamePoints() {
            let theirTeamNum = 1;
            if (this.myName === this.game[0].createdBy || this.players[1] === this.game[0].createdBy) {
                theirTeamNum = 2;
            }
            return this.game[0][`team${theirTeamNum}`];
        }
    }
}
</script>


<style scoped>
    .main {
        color: #dbd5d5;
        text-align: center;
        /* display: grid; */
        /* grid-template-columns: repeat(5, 1fr); */
        /* grid-template-rows: 1fr 2fr 1fr; */
        /* grid-row-gap: 10px; */
    }
    .columns {
        min-height: 33%;
    }
    .name {
        font-size: 25px;
        color: #b1c7c4; 
    }
    .avatar {
        vertical-align: middle;
        width: 40px;
        height: 40px;
        border-radius: 50%;
     }
    .card {
        width: 50px;
        height: 66px;
        margin-right: 5px;
        border-radius: 4px;
        text-align: center;
        font-size: 25px;
    }
    .custom-modal {
        width: 300px;
        border-radius: 8px;
    }
</style>
