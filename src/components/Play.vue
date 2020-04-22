<template>
  <div class="main" v-if="players.length === 3">
      <div class="columns is-vcentered" style="margin-top: 10px;">
            <div class="column">
                <div class="columns is-vcentered">
                    <div class="column is-two-third" style="margin-left: 5px;">
                    Bid: <span class="has-text-info"> {{ game[0].bidder }} 
                            <span class="has-text-weight-bold has-text-success"> {{ game[0].bid }} </span>
                            </span>
                    <br>
                    Trump: 
                    <span v-if="game[0].trumpState === `not set`"> X</span>
                    <span v-if="game[0].trumpState === `hidden`"> X</span>
                    <span v-if="game[0].trumpState.endsWith(`pen`)"> {{ trumpValue }}</span>
                    <span v-if="game[0].stakes === 2" class="has-text-danger"> (Double)</span>
                    <span v-if="game[0].stakes === 4" class="has-text-danger"> (Re-Double)</span>
                    <span v-if="game[0].stakes === 6" class="has-text-danger"> (Full Set)</span>
                    </div>
                    <div class="column">
                        <button class="button is-danger is-small" v-if="!game[0].gameOver" @click="revealTrump" :disabled="game[0].trumpState.endsWith(`pen`)">Trump</button>
                        <button class="button is-success is-small" v-if="game[0].gameOver" @click="skipGame" :disabled="myName !== game[0].bidder">Skip</button>
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
                        Their Score <span class="has-text-weight-bold has-text-info">{{ theirTeamGamePoints }}</span>
                    </div>
                </div>
            </div>
      </div>
    
    <div class="columns is-vcentered" style="margin-top: 2%; min-height: 156px;">
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
                <span v-if="game[0].state === `double`">Considering double</span>
                <span v-if="game[0].state === `redouble`">Considering Re-double</span>
                <span v-if="game[0].state === `fullset`">Considering Fullset</span>
            </div>
            <span v-if="game[0].state !== 'deal0'">
                <span v-for="(card, index) in game[0][`player${myIndex+1}`]" :key="card">
                    <span>
                        <img class="card" :src="getImagePath(card)" :alt="`${card}`" @click="playCard(card, index)">
                    </span>
                </span>
            </span> 
            <span v-if="game[0].gameTurn === myName && game[0].state === 'deal0'">
                <button class="button is-success is-small" @click="dealCards(16)">New Deal</button>
            </span>
            <span v-if="game[0].gameTurn !== myName && game[0].state === 'deal0'">
                Waiting for {{ game[0].turn }} to deal
            </span>
        </div>
      </div>
    
        <div :class="`modal ${bidModalView}`" v-if="bidModalView === `is-active`">
        <div class="modal-background"></div>
        <div class="modal-content">
            <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][0])" alt="card">
            <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][1])" alt="card">
            <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][2])" alt="card">
            <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][3])" alt="card">
            <br>
            <br>
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
            </div>
        </div>

        <div :class="`modal ${trumpModalView}`" v-if="trumpModalView === `is-active`">
            <div class="modal-background"></div>
            <div class="modal-content">
                Set Trump <br><br>
                <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][0])" alt="card" @click="setTrump(game[0][`player${myIndex+1}`][0][game[0][`player${myIndex+1}`][0].length - 1])">
                <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][1])" alt="card" @click="setTrump(game[0][`player${myIndex+1}`][1][game[0][`player${myIndex+1}`][1].length - 1])">
                <br>
                <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][2])" alt="card" @click="setTrump(game[0][`player${myIndex+1}`][2][game[0][`player${myIndex+1}`][2].length - 1])">
                <img class="card" :src="getImagePath(game[0][`player${myIndex+1}`][3])" alt="card" @click="setTrump(game[0][`player${myIndex+1}`][3][game[0][`player${myIndex+1}`][3].length - 1])">
            </div>
        </div>

        <div :class="`modal ${doubleModalView}`" v-if="doubleModalView === `is-active`">
            <div class="modal-background"></div>
            <div class="modal-content" style="height: 50px;">
                <div class="buttons has-addons is-centered">
                    <span v-if="game[0].state === `double`">
                        <button class="button is-danger" @click="highStakes(2)">Set Double</button>
                        <button class="button is-info" @click="highStakes(1)">Cancel</button>
                    </span>
                    <span v-if="game[0].state === `redouble`">
                        <button class="button is-danger" @click="highStakes(4)">Re-Double</button>
                        <button class="button is-info" @click="highStakes(3)">Cancel</button>
                    </span>
                    <span v-if="game[0].state === `fullset`">
                        <button class="button is-danger" @click="highStakes(6)">Full Set</button>
                        <button class="button is-info" @click="highStakes(5)">Cancel</button>
                    </span>
                </div>
            </div>
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
                    <button class="button is-success is-small" :disabled="disableResetButton" v-if="myName === game[0].bidder" @click="resetGame()">Next</button>
                </section>
            </div> 
        </div>
        </div>

        <div :class="`modal ${marriageModalView}`" v-if="marriageModalView === `is-active`">
        <div class="modal-background"></div>
        <div class="modal-content custom-modal">
            <div class="modal-card" style="width: 300px;">
                <section class="modal-card-body has-text-black" style="background-color: #dedede;">
                    {{ hasMarriage }} has marriage! {{ trumpValue }}<br><br>
                    <button class="button is-success is-small" @click="ackMarriage">Next</button>
                </section>
            </div> 
        </div>
        </div>
        
        <div :class="`modal ${trumpOpenModalView}`" v-if="trumpOpenModalView === `is-active`">
        <div class="modal-background"></div>
        <div class="modal-content custom-modal">
            <div class="modal-card" style="width: 300px;">
                <section class="modal-card-body has-text-black" style="background-color: #dedede;">
                    {{ game[0].turn }} opened trump! {{ trumpValue }}<br>
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
            docRef: null,
            disableStakeButton: false,
            disableResetButton: false,
            order: ["JC", "9C", "AC", "10C", "KC", "QC", "8C", "7C", "JD", "9D", "AD", "10D", "KD", "QD", "8D", "7D", "JS", "9S", "AS", "10S", "KS", "QS", "8S", "7S", "JH", "9H", "AH", "10H", "KH", "QH", "8H", "7H"]
        };
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.$router.push({ path: '/' });
            }
            // this.myName = localStorage.getItem("player");
            this.$bind('game', db.collection('games').where('token', '==', +this.$route.params.id))
                .then(() => {
                    this.$watch(() => this.game[0].double, this.doubleDecision);
                    this.$watch(() => this.game[0].redouble, this.redoubleDecision);
                    this.$watch(() => this.game[0].fullset, this.fullsetDecision);
                });
            db.collection('games').where('token', '==', +this.$route.params.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.docRef = db.collection("games").doc(doc.id);
                    this.myIndex = doc.data().playersUID.indexOf(user.uid);
                    if (!doc.data().playersUID.includes(user.uid) || doc.data().playersUID.length !== 4) {
                        this.$router.push({ path: '/join' });
                        return;
                    }
                    // this.myIndex = doc.data().playersJoined.indexOf(this.myName);
                    this.myName = doc.data().playersJoined[this.myIndex];
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
            let cards = ["JC", "9C", "AC", "10C", "KC", "QC", "8C", "7C", "JD", "9D", "AD", "10D", "KD", "QD", "8D", "7D", "JS", "9S", "AS", "10S", "KS", "QS", "8S", "7S", "JH", "9H", "AH", "10H", "KH", "QH", "8H", "7H"];
            if (num === 0) {
                cards = this.game[0].cardsLeft;
            }
            while (cards.length > num) {
                const rand = Math.floor(Math.random() * (cards.length-1));
                if (cards.length % 4 === 0) {
                    p1.push(cards[rand]);
                }
                if (cards.length % 4 === 1) {
                    p2.push(cards[rand]);
                }
                if (cards.length % 4 === 2) {
                    p3.push(cards[rand]);
                }
                if (cards.length % 4 === 3) {
                    p4.push(cards[rand]);
                }
                cards.splice(rand, 1);
            }
            let state = "bidding";
            if (num === 0) {
                p1 = [...this.game[0].player1, ...p1];
                p2 = [...this.game[0].player2, ...p2];
                p3 = [...this.game[0].player3, ...p3];
                p4 = [...this.game[0].player4, ...p4];
                state = "play";
            }
            else {
                this.docRef.update({ cardsLeft: cards });
            }
            p1.sort(this.sortOrder);
            p2.sort(this.sortOrder);
            p3.sort(this.sortOrder);
            p4.sort(this.sortOrder);
            this.docRef.update({ player1: p1, player2: p2, player3: p3, player4: p4, state: state});
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
            const ind = this.game[0].playersJoined.indexOf(this.myName);
            const tempBids = [...this.game[0].bids];
            tempBids[ind] = value;
            this.docRef.update({ bids: tempBids });
            if (value !== 0) {
                this.docRef.update({ bidder: this.myName });
            }
            this.docRef.update({ bid: Math.max(...tempBids) });
            let count = 0;
            if (this.game[0].bidder2 === "") {
                this.docRef.update({ bidder2: this.game[0].playersJoined[(ind+1)%4] });
            }
            for (let i = 0; i < 4; i++) {
                count += (tempBids[i] === 0) ? 1 : 0;
            }
            if (count === 3) {
                this.docRef.update({ state: "setTrump" });
                return;
            }
            let nextBidder = "";
            for (let i = 0; i < 4; i++) {
                if (tempBids[(i+ind+1) % 4] === -1) {
                    nextBidder = this.game[0].playersJoined[(i+ind+1) % 4];
                    break;
                }
            }
            if (value === 0) {
                if (Math.max(...tempBids) === 0) {
                    this.docRef.update({ bidder1: this.game[0].playersJoined[(ind+1)%4] });
                    this.docRef.update({ bidder2: this.game[0].playersJoined[(ind+2)%4] });
                }
                else {
                    if (this.myName === this.game[0].bidder1) {
                        this.docRef.update({ bidder1: this.game[0].bidder2 });
                    }
                    this.docRef.update({ bidder2: nextBidder });
                }
                this.docRef.update({ bidTurn: nextBidder });
            }
            else {
                if (this.game[0].bidTurn === this.game[0].bidder1) {
                    this.docRef.update({ bidTurn: (this.game[0].bidder2 === "" ? this.game[0].playersJoined[(ind+1)%4] : this.game[0].bidder2) });
                }
                else if (this.game[0].bidTurn === this.game[0].bidder2) {
                    this.docRef.update({ bidTurn: this.game[0].bidder1 });
                }
            }
        },
        setTrump(suit) {
            this.docRef.update({ trump: suit, trumpState: "hidden", state: "double" });
        },
        revealTrump() {
            if (this.myName !== this.game[0].turn || this.game[0].state !== "play") {
                return;
            }
            const ind = this.game[0].playersJoined.indexOf(this.myName);
            const newSeq = [...this.game[0].sequence];
            const len = newSeq.length;
            let checkRange = newSeq.slice(Math.max(len - (len%4), 0));
            const playerCards = [...this.game[0][`player${ind+1}`]];
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
            let marriage = false;
            for (let i = 1; i <= 4; i++) {
                if (this.game[0][`player${i}`].includes(`K${this.game[0].trump}`) && this.game[0][`player${i}`].includes(`Q${this.game[0].trump}`)) {
                    if (this.game[0].playersJoined[i-1] === this.game[0].bidder || this.game[0].playersJoined[(i-1+2)%4] === this.game[0].bidder) {
                        this.docRef.update({ bid: Math.max(this.game[0].bid-4, 16) });
                    }
                    else {
                        this.docRef.update({ bid: Math.min(this.game[0].bid+4, 28) });
                    }
                    this.docRef.update({ state: `marriage ${this.game[0].playersJoined[i-1]}` });
                    marriage = true;
                    break;
                }
            }
            this.docRef.update({ trumpState: "justOpen" });
            if (!marriage) {
                this.docRef.update({ state: "trumpOpen" });
                setTimeout(() => {
                    this.docRef.update({ state: "play" });
                }, 3000);
            }
        },
        highStakes(val) {
            this.disableStakeButton = true;
            setTimeout(() => {
                this.disableStakeButton = false;
            }, 1000);
            if (val === 2 || val === 1) {
                this.docRef.update({ double: firebase.firestore.FieldValue.arrayUnion({ name: this.myName, action: val }) });
            }
            else if (val === 4 || val === 3) {
                this.docRef.update({ redouble: firebase.firestore.FieldValue.arrayUnion({ name: this.myName, action: val }) });
            }
            else if (val === 6 || val === 5) {
                this.docRef.update({ fullset: firebase.firestore.FieldValue.arrayUnion({ name: this.myName, action: val }) });
            }
        },
        playCard(card, index) {
            if (this.game[0].turn !== this.myName || this.game[0].state !== "play") {
                return;
            }
            const ind = this.game[0].playersJoined.indexOf(this.myName);
            const newSeq = [...this.game[0].sequence, card];
            if (newSeq.length % 4 === 0) {
                this.docRef.update({ waitFlag: true });
            }
            const len = newSeq.length;
            let checkRange = newSeq.slice(Math.max(len - (len%4), 0));
            const playerCards = [...this.game[0][`player${ind+1}`]];
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
            if (this.game[0].trumpState === "justOpen" && !card.endsWith(this.game[0].trump)) {
                const ownsSuit = playerCards.some((val) => {
                    return val.endsWith(this.game[0].trump);
                });
                if (ownsSuit) {
                    // player has trump, didnot throw inspite of having
                    return;
                }
                this.docRef.update({ trumpState: 'open' });
            }
            if (this.game[0].trumpState === "justOpen") {
                this.docRef.update({ trumpState: 'open' });
            }
            playerCards.splice(index, 1);
            this.docRef.update({ [`player${ind+1}`]: playerCards });
            let allCardsPlayed = [...this.game[0].sequence, card];
            this.docRef.update({ sequence: allCardsPlayed });
            if (newSeq.length % 4 === 0) {
                this.keepRoundScore(checkRange, allCardsPlayed.length);
            }
            else {
                this.docRef.update({ turn: this.game[0].playersJoined[(ind+1)%4] });
            }
        },
        keepRoundScore(checkRange, noOfCardsPlayed) {
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
            const trump = this.game[0].trump;
            const trumpState = this.game[0].trumpState;
            let firstCard = checkRange[0];
            let points = cards[firstCard.slice(0, firstCard.length-1)].points;
            let highestCard = firstCard.charAt(firstCard.length-1), 
            highestCardPriority = cards[firstCard.slice(0, firstCard.length-1)].priority, 
            roundWinner = playerOrder[0];
            checkRange.splice(0,1);
            playerOrder.splice(0,1);
            checkRange.forEach((playedCard, i) => {
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
            let finalRoundScore = {team1 :this.game[0].team1current, team2: this.game[0].team2current};
            let myTeamNum = 2, theirTeamNum = 2;
            if (this.myName === this.game[0].createdBy || this.players[1] === this.game[0].createdBy) {
                myTeamNum = 1;
            }
            theirTeamNum = (myTeamNum === 1) ? 2 : 1;
            // our team won round
            if (roundWinner === this.myName || roundWinner === this.players[1]) {
                this.docRef.update({ [`team${myTeamNum}current`]: (this.game[0][`team${myTeamNum}current`] + points) });
                finalRoundScore[`team${myTeamNum}`] += points;
            }
            // their team won round
            else {
                this.docRef.update({ [`team${theirTeamNum}current`]: (this.game[0][`team${theirTeamNum}current`] + points) });
                finalRoundScore[`team${theirTeamNum}`] += points;
            }
            // update turn of winner
            this.docRef.update({ turn: roundWinner });
            // wait 3 seconds before removing cards from table
            setTimeout(() => {
                this.docRef.update({ waitFlag: false });
                this.docRef.update({ roundStarter: roundWinner });
            }, 3000);
            // cards over, round over condition
            if (noOfCardsPlayed === 32) {
                this.keepGameScore(finalRoundScore, myTeamNum, theirTeamNum);
            }
            // skip game condition
            else if (this.game[0].trumpState === "open" && this.game[0].gameOver === false) {
                if (this.game[0].bidder === this.myName || this.game[0].bidder === this.players[1]) {
                    if (finalRoundScore[`team${theirTeamNum}`] > (28 - this.game[0].bid)) {
                        this.docRef.update({ gameOver: true, gameOverTeamWon: theirTeamNum, bidderTeam: myTeamNum });
                    }
                    else if (finalRoundScore[`team${myTeamNum}`] >= this.game[0].bid && finalRoundScore[`team${theirTeamNum}`] > 0) {
                        this.docRef.update({ gameOver: true, gameOverTeamWon: myTeamNum, bidderTeam: myTeamNum });
                    }
                }
                else {
                    if (finalRoundScore[`team${myTeamNum}`] > (28 - this.game[0].bid)) {
                        this.docRef.update({ gameOver: true, gameOverTeamWon: myTeamNum, bidderTeam: theirTeamNum });
                    }
                    else if (finalRoundScore[`team${theirTeamNum}`] >= this.game[0].bid && finalRoundScore[`team${myTeamNum}`] > 0) {
                        this.docRef.update({ gameOver: true, gameOverTeamWon: theirTeamNum, bidderTeam: theirTeamNum });
                    }
                }
            }
        },
        skipGame() {
            let extra = 0;
            if (this.game[0][`team${this.game[0].bidderTeam}current`] === 28) {
                extra = 1;
            }
            if (this.game[0].gameOverTeamWon === this.game[0].bidderTeam) {
                this.docRef.update({ [`team${this.game[0].bidderTeam}`]: (this.game[0][`team${this.game[0].bidderTeam}`] + this.game[0].stakes + extra) });
            }
            else {
                this.docRef.update({ [`team${this.game[0].bidderTeam}`]: (this.game[0][`team${this.game[0].bidderTeam}`] - this.game[0].stakes) });
            }
            this.docRef.update({ state: "roundOver" });
        },
        keepGameScore(finalRoundScore, myTeamNum, theirTeamNum) {
            // our team won game
            let extra = 0;
            if (this.game[0].bidder === this.myName || this.game[0].bidder === this.players[1]) {
                if (finalRoundScore[`team${myTeamNum}`] === 28) {
                    extra = 1;
                }
                if (this.game[0].bid <= finalRoundScore[`team${myTeamNum}`]) {
                    this.docRef.update({ [`team${myTeamNum}`]: (this.game[0][`team${myTeamNum}`] + this.game[0].stakes + extra) });
                }
                else {
                    this.docRef.update({ [`team${myTeamNum}`]: (this.game[0][`team${myTeamNum}`] - this.game[0].stakes) });
                }
            }
            // their team won game
            else {
                if (finalRoundScore[`team${theirTeamNum}`] === 28) {
                    extra = 1;
                }
                if (this.game[0].bid <= finalRoundScore[`team${theirTeamNum}`]) {
                    this.docRef.update({ [`team${theirTeamNum}`]: (this.game[0][`team${theirTeamNum}`] + this.game[0].stakes + extra) });
                }
                else {
                    this.docRef.update({ [`team${theirTeamNum}`]: (this.game[0][`team${theirTeamNum}`] - this.game[0].stakes) });
                }
            }
            this.docRef.update({ state: "roundOver" });
        },
        resetGame() {
            console.log("reset");
            this.disableResetButton = true;
            const ind = this.game[0].playersJoined.indexOf(this.game[0].gameTurn);
                const nextPlayer = this.game[0].playersJoined[(ind+1)%4];
                this.docRef.update({ 
                    bid: 0,
                    bidTurn: nextPlayer,
                    bidder: "",
                    bidder1: nextPlayer,
                    bidder2: "",
                    bids: [-1, -1, -1, -1],
                    gameTurn: nextPlayer,
                    gameOverTeamWon: 0,
                    bidderTeam: 0,
                    player1: [],
                    player2: [],
                    player3: [],
                    player4: [],
                    sequence: [],
                    stakes: 1,
                    team1current: 0,
                    team2current: 0,
                    trump: 'X',
                    trumpState: 'not set',
                    turn: nextPlayer,
                    gameOver: false,
                    roundStarter: nextPlayer,
                    double: [],
                    redouble: [],
                    fullset: []
                });
            setTimeout(() => {
                this.docRef.update({ state: "deal0" });
                this.disableResetButton = false;
            }, 2000);
        },
        ackMarriage() {
            setTimeout(() => {
                this.docRef.update({ state: "play" });
            }, 2000);
        },
        doubleDecision(double) {
            if (double.length === 2 && this.game[0].state === "double" && double[1].name === this.myName) {
                if (double[0].action === 2 || double[1].action === 2) {
                    this.docRef.update({ state: "redouble", stakes: 2 });
                }
                else {
                    this.docRef.update({ state: "play" });
                    this.dealCards(0);
                }
            }
        },
        redoubleDecision(redouble) {
            if (redouble.length === 2 && this.game[0].state === "redouble" && redouble[1].name === this.myName) {
                if (redouble[0].action === 4 || redouble[1].action === 4) {
                    this.docRef.update({ state: "fullset", stakes: 4 });
                }
                else {
                    this.docRef.update({ state: "play" });
                    this.dealCards(0);
                }
            }
        },
        fullsetDecision(fullset) {
            if (fullset.length === 2 && this.game[0].state === "fullset" && fullset[1].name === this.myName) {
                if (fullset[0].action === 6 || fullset[1].action === 6) {
                    this.docRef.update({ stakes: 6 });
                }
                this.docRef.update({ state: "play" });
                this.dealCards(0);
            }
        }
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
            if (this.disableStakeButton) {
                return "";
            }
            if (this.game[0].state === "double" && (this.game[0].bidder !== this.myName && this.game[0].bidder !== this.players[1])) {
                const choiceMade = this.game[0].double.some((val) => {
                    return (val.name === this.myName);
                });
                return choiceMade ? "" : "is-active";
            }
            else if (this.game[0].state === "redouble" && (this.game[0].bidder === this.myName || this.game[0].bidder === this.players[1])) {
                const choiceMade = this.game[0].redouble.some((val) => {
                    return (val.name === this.myName);
                });
                return choiceMade ? "" : "is-active";
            }
            else if (this.game[0].state === "fullset" && (this.game[0].bidder !== this.myName && this.game[0].bidder !== this.players[1])) {
                const choiceMade = this.game[0].fullset.some((val) => {
                    return (val.name === this.myName);
                });
                return choiceMade ? "" : "is-active";
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
        trumpOpenModalView() {
            if (this.game[0].state === "trumpOpen") {
                return "is-active";
            }
            return "";
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
        width: 52px;
        height: 70px;
        margin-right: 5px;
        border-radius: 4px;
        text-align: center;
        font-size: 20px;
    }
    .custom-modal {
        width: 300px;
        border-radius: 8px;
    }
</style>