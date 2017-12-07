function Deck (){
  //Card values
  self.card = [
    'cat',
    'cat', 
    'hat',
    'hat',
    'pumpkin',
    'pumpkin',
    'bone',
    'bone',
    'rip',
    'rip',
    'ghost',
    'ghost',
    'boiler',
    'boiler',
    'skull',
    'skull',
    'boilerOrange',
    'boilerOrange',
    'candy',
    'candy'
  ];
}

Deck.prototype = {
  contructor : Deck,

    //Create Ramdom Deck 
  deckRandom : function() {
      Deck();
      this.randomDeck = new Array();
      let empty = false;

      while(!empty){
        let randomIndex = Math.floor(Math.random()*self.card.length);
        this.randomDeck.push(self.card[randomIndex]);
        self.card.splice(randomIndex, 1);
        if(self.card.length <= 0) empty = true;
      }

      for(let i=0; i<this.randomDeck.length; i++){
        self.card[i] = this.randomDeck[i];
      }
  },    
};

let deck = new Deck();
deck.deckRandom();

let allCards = document.getElementById('all-cards');
let score = document.getElementById('score');
let high_Score = document.getElementById('highScore');
let reset = document.getElementById('Reset');
let count = 0;
let count_Score = 0;

let first_Card;
let second_Card;

let firstCard_Id;
let secondCard_Id;

let firstCard_Value;
let secondCard_Value;

function _showCards (){

  for (let i = 0; i < 20; i++) {

    let li = document.createElement('li');
    li.classList.add('card', 'front-card');
    li.value = i;
    allCards.appendChild(li);
  }

  let li = document.getElementsByClassName('card');

  for (let i = 0; i < li.length; i++) {
    li[i].addEventListener('click', function () {
      count++;
      if (count === 1) {
        this.classList.add('card-' + card[this.value]);
        first_Card = card[this.value];
        firstCard_Value = this.value;
        firstCard_Id = this;
      }
      if (count === 2) {
        this.classList.add('card-' + card[this.value]);
        second_Card = card[this.value];
        secondCard_Value = this.value;
        secondCard_Id = this;
        setTimeout (function () {
              
          if (first_Card === second_Card) {
              if (firstCard_Value !== secondCard_Value) {

                firstCard_Id.classList.add('hideCard');
                secondCard_Id.classList.add('hideCard');

                score.innerText = count_Score += 100;
                high_Score.innerText = score.innerText;
             
                count = 0;
              } else {
                // console.log('cheater');
                count = 1;
              }
          }
          else {
            count = 0;
            firstCard_Id.className = ' ';
            secondCard_Id.className = ' ';
            firstCard_Id.classList.add('card', 'front-card');
            secondCard_Id.classList.add('card', 'front-card');
          }
        },900)
      }
    });   
  }
}
_showCards();

reset.addEventListener('click', function(){
  score.innerText = 0;
  firstCard_Id.classList.add('card', 'front-card');
})
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
