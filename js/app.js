(function () {

  const cardTypes = ['fa-envelope', 'fa-eye', 'fa-fighter-jet', 'fa-home', 'fa-life-bouy', 'fa-newspaper-o', 'fa-phone', 'fa-rocket'];
  const numMovesPerStar = 10;
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
    document.querySelector('.modal__button').addEventListener('click', reset);
  }

  // generates cards by pushing two of each card type 
  function generateCards() {
    cards = cardTypes.reduce((array, type) => {
      array.push(type, type);
      return array;
    }, []);
  }

  // generate star and card HTML
  // uses document fragments to avoid DOM
  // reflow/repaint
  function generateHtml() {
    const deck = document.querySelector('.deck');
    deck.innerHTML = '';
    const cardFrag = document.createDocumentFragment();
    cards.map((card) => {
      const li = document.createElement('li');
      li.className = 'card';
      const i = document.createElement('i');
      i.className = `fa ${card}`;
      li.appendChild(i);
      cardFrag.appendChild(li);
      li.addEventListener('click', handleClickCard);
    })
    deck.appendChild(cardFrag);

    const starFrag = document.createDocumentFragment();
    const starContainer = document.querySelector('.stars');
    starContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const li = document.createElement('li');
      const i = document.createElement('i');
      i.className = 'fa fa-star';
      li.appendChild(i);
      starFrag.appendChild(li);
    }
    starContainer.appendChild(starFrag);

  }

  // resets all variables, hides the modal, and displays 
  // a new random set of cards
  function reset() {
    matches = 0;
    moves = 0;
    time = 0;
    openCard = '';
    gameRunning = false;
    document.querySelector('.time').textContent = time;
    document.querySelector('.moves').textContent = moves;
    clearInterval(timer);
    shuffle(cards);
    generateHtml();
    document.querySelector('.container').style = "display: flex";
    document.querySelector('.modal__container').style = "display: none";
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

  // callback for clicked card
  // first it makes sure that the selected object is
  // not the nested "I"
  // then starts the timer on first click
  // then either -> selects a card
  //       or    -> checks if cards match
  function handleClickCard(event) {
    let selectedCard;
    if (event.target.nodeName === 'LI') {
      selectedCard = event.target;
    } else {
      selectedCard = event.target.parentElement;
    }

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

  // checks if cards are a match by
  // checking if the nested I class names
  // are the same, if match or not, still
  // increments move count
  function isMatch(card) {
    if (card === openCard) {
      return;
    }

    if (card.firstChild.className === openCard.firstChild.className) {
      setMatch(card);
    }  else {
      noMatch(card);
    }
    incrementMoves();
  }

  // handler for when two cards match
  // it removes the two event listeners
  // sets their classes and then checks if game is over
  // by checking matches against number of cardTypes
  function setMatch(card) {
    card.removeEventListener('click', handleClickCard);
    openCard.removeEventListener('click', handleClickCard);
    card.className = 'card match';
    openCard.className = 'card match';
    openCard = '';
    matches++;
    if (matches === cardTypes.length) {
      incrementMoves();
      clearInterval(timer);
      gameRunning = false;
      showWinner();
    }
  }

  // winning function that hides the cards and
  // displays the winning modal
  function showWinner() {
    document.querySelector('.container').style = "display: none";
    document.querySelector('.modal__container').style = "display: flex";
    document.querySelector('.modal__moves').textContent = moves;
    document.querySelector('.modal__time').textContent = time;
    const numOfStars = document.querySelectorAll('.fa.fa-star').length;
    document.querySelector('.modal__stars').textContent = numOfStars;
  }

  // handler for when cards do not match
  // sets their class and then uses a 
  // timeout function to reset the class
  // back to regular card
  // use a tempcard to hold the reference
  // to allow the user to click on the same
  // card before the animation finishes
  function noMatch(card) {
    card.className = 'card nomatch';
    openCard.className = 'card nomatch';
    let tempCard = openCard;
    openCard = ''
    setTimeout(resetClass.bind(this, card, tempCard), 1000);
  }

  // resets the class of the cards selected
  // if the user has not already selected the card
  // again before the animation finishes
  function resetClass(card, tempCard) {
    if (openCard !== card) {
      card.className = 'card';
    }
    if (openCard !== tempCard) {
      tempCard.className = 'card';
    }
  }

  // starts the timer
  function runTimer() {
    time++;
    document.querySelector('.time').textContent = time;
  }

  // increments the move counter and also 
  // removes a star by setting the class name
  // to an empty star
  function incrementMoves() {
    moves++;
    document.querySelector('.moves').textContent = moves;
    if ((moves <= numMovesPerStar * 2) && (moves % numMovesPerStar === 0)) {
      document.querySelector('.stars .fa.fa-star').className = 'fa fa-star-o';
    }
  }

  // displays a card when clicked
  function displayCard(card) {
    card.className = "card open show";
  }

  // sets the listeners and generates the html
  init();

})();