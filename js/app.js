/*
 * Create a list that holds all of your cards
 */
(function () {

  const cardTypes = ['fa-envelope', 'fa-eye', 'fa-fighter-jet', 'fa-home', 'fa-life-bouy', 'fa-newspaper-o', 'fa-phone', 'fa-rocket'];
  const numMovesPerStar = 8;
  let timer;
  let cards = [];
  let moves = 0;
  let time = 0;
  let openCard = '';
  let gameRunning = false;
  let matches = 0;

  function init() {
    // generate an array of cards that contains the match for each
    // valid card type
    generateCards();

    // shuffle the strings of valid card types
    shuffle(cards);

    // generate dynamic html based on the strings
    generateHtml();
   
    // setup a click listener for the reset button
    document.querySelector('.restart').addEventListener('click', reset);
  }

  function generateCards() {
    cards = cardTypes.reduce((array, type) => {
      array.push(type, type);
      return array;
    }, []);
  }

  function generateHtml() {
    const deck = document.querySelector('.deck');
    deck.innerHTML = '';
    const fragment = document.createDocumentFragment();
    cards.map((card) => {
      const li = document.createElement('li');
      li.className = 'card';
      const i = document.createElement('i');
      i.className = `fa ${card}`;
      li.appendChild(i);
      fragment.appendChild(li);
      li.addEventListener('click', checkCard);
    })
    deck.appendChild(fragment);
  }

  function reset() {
    moves = 0;
    time = 0;
    gameRunning = false;
    document.querySelector('.time').textContent = time;
    document.querySelector('.moves').textContent = moves;
    clearInterval(timer);
    shuffle(cards);
    generateHtml();
  }

  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function checkCard(event) {
    const selectedCard = event.target;

    if (!gameRunning) {
      gameRunning = true;
      timer = setInterval(runTimer, 1000);
    }

    if (!openCard) {
      openCard = selectedCard;
      displayCard(selectedCard);
    } else {
      isMatch(selectedCard);
    }
  }

  function isMatch(card) {
    if (card === openCard || card.nodeName === 'I') {
      return;
    }

    if (card.firstChild.className === openCard.firstChild.className && card !== openCard) {
      setMatch(card);
    }  else {
      noMatch(card);
    }
    incrementMoves();
  }

  function setMatch(card) {
    card.removeEventListener('click', checkCard);
    card.className = 'card match';
    openCard.className = 'card match';
    openCard = '';
    matches++;
    if (matches === cardTypes.length) {
      gameRunning = false;
      showWinner();
    }
  }

  function showWinner() {
    console.log('winner');
  }

  function noMatch(card) {
    card.className = 'card nomatch';
    openCard.className = 'card nomatch';
    setTimeout(setNoMatch.bind(this, card), 700);
  }

  function setNoMatch(card) {
    card.className = 'card';
    openCard.className = 'card';
    openCard = '';
  }

  function runTimer() {
    time++;
    document.querySelector('.time').textContent = time;
  }

  function incrementMoves() {
    moves++;
    document.querySelector('.moves').textContent = moves;
    if ((moves <= numMovesPerStar * 3) && (moves % numMovesPerStar === 0)) {
      document.querySelector('.stars .fa.fa-star').className = 'fa fa-star-o';
    }
  }

  function displayCard(card) {
    card.className = "card open show";
  }


  /*
   * set up the event listener for a card. If a card is clicked:
   *  - display the card's symbol (put this functionality in another function that you call from this one)
   *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
   *  - if the list already has another card, check to see if the two cards match
   *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
   *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
   *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
   *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
   */

  init();

})();