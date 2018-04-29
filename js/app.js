/*
 * Create a list that holds all of your cards
 */
(function () {

  const cardTypes = ['fa-envelope', 'fa-eye', 'fa-fighter-jet', 'fa-home', 'fa-life-bouy', 'fa-newspaper-o', 'fa-phone', 'fa-rocket'];
  let cards = [];
  let numOfMoves = 0;
  let timer = 0;
  let openCard = '';

    /*
   * Display the cards on the page
   *   - shuffle the list of cards using the provided "shuffle" method below
   *   - loop through each card and create its HTML
   *   - add each card's HTML to the page
   */

  function init() {
    numOfMoves = 0;
    timer = 0;

    // generate an array of cards that contains the match for each
    // valid card type
    generateCards();

    // shuffle the strings of valid card types
    shuffle(cards);

    // create a document fragment to store the dynamically
    // generated cards
    generateHtml();
   
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
      li.addEventListener('click', (e)=> checkCard(e));
    });
    deck.appendChild(fragment);
  }

  function reset() {
    numOfMoves = 0;
    timer = 0;
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
    // if user did not click on card or icon, return
    if (event.target.nodeName !== 'LI' && event.target.nodeName !== 'I') {
      return;
    }
    displayCard(event.target);
    if (openCard) {

    }

  }

  function displayCard(target) {
    if (target.nodeName === 'LI') {
      target.className = "card open show";
      console.log(target.firstChild.className);
    } else if (target.nodeName === 'I') {
      target.parentElement.className = "card open show";
      console.log(target.className);
    }
    
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