'use strict';

// click to start the game and hides after clicking it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text visible'));

    overlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            overlay.classList.remove('visible');
        });
    });
}




// initialize error count and array of card names
let errors =  0;

// list of our player cards
const cardList = [
    'demko',
    'luongo',
    'boeser',
    'burrows',
    'daniel',
    'henrick',
    'jtmiller',
    'kuzmenko',
    'petterson',
    'quinn'
];

let cardSet; // array to store the shuffled deck
const board = []; // array to represent the game board
const rows = 4; // number of rows on the game board
const columns = 5; // number of columns on the game board. total number of cards is 10 then creates two sets that = 20.


let card1Selected; // variable to store the first selected card
let card2Selected; // variable to store the second selected card

// execute the following code when the window is fully loaded
window.onload = function () {
    shuffleCards(); // shuffle the cards. each card appears twice.
    startGame(); // start the game by setting up the board
}

// function to shuffle the cards in the deck
function shuffleCards () {
    cardSet = cardList.concat(cardList); // creates an array with two of each card
    console.log(cardSet);

    // shuffle the cards randomly
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length); // get a random index.
        // math.random gives a decimal place number and multiply by 20. math.floor makes it an integer number

        // swap the positions of two cards in the array
        const temp = cardSet[i];
        cardSet[i] = cardSet[j];
        cardSet[j] = temp;
    }

    console.log(cardSet);
}

// function to start the game by setting up the game board
function startGame () {
    // arrange the cards on the board in a 4x5 grid
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let cardImg = cardSet.pop(); // get the next card from the shuffled deck
            row.push(cardImg);

            // create an image element for the card
            let card = document.createElement("img");
            card.id = r.toString() + '-' + c.toString(); // set a ID for the card
            card.src = 'images/' + cardImg + ".jpg"; // set the image source for the card
            card.classList.add("card"); // add a CSS class to style the card
            
            card.addEventListener('click', selectCard); // add a click event listener to the card

            document.getElementById('board').append(card); // append the card to the game board
        }
        board.push(row); // add the row to the game board
    }

    console.log(board);
    setTimeout(hideCards, 1000); // hide the cards after a brief delay. allows user to see the cards before playing
}

// function to hide the front face of the cards
function hideCards() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.getElementById(r.toString() + '-' + c.toString());
            card.src = 'images/' + 'back.jpg'; // set the image source to the back of the card
        }
    }
}

// function to handle the selection of a card
function selectCard() {
    if (this.src.includes('back')) { // check if the clicked card is facing down
        if (!card1Selected) {
            card1Selected = this;

            playCardClickSound(); // play the card click sound


            let coords = card1Selected.id.split('-');
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card1Selected.src = 'images/' + board[r][c] + ".jpg"; // flip the card facing up
        }
        else if (!card2Selected && this != card1Selected) {
            card2Selected = this;

            playCardClickSound(); // play the card click sound

            let coords = card2Selected.id.split('-');
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card2Selected.src = 'images/' + board[r][c] + ".jpg"; // flip the second card facing up
            setTimeout(update, 500); // after a delay, check if the two selected cards match. lets user see the flipped cards for 1 second.
        }
    }
}


// function to update the game state after two cards are selected
// Add a variable to keep track of matched pairs
let matches = 0;

// global declaration scope for game win sound
const winGameSound = new Audio('./audio/finish-game-sound.mp3');
const correctCardSound = new Audio('./audio/right-goal-sound.mp3');
const incorrectCardSound = new Audio('./audio/wrong-post-sound.mp3');
// Set the volume to 50% (0.5)
correctCardSound.volume = 0.5;

function update() {
    // if the selected cards don't match, flip them back facing down
    if (card1Selected.src != card2Selected.src) {
        card1Selected.src = 'images/' + 'back.jpg';
        card2Selected.src = 'images/' + 'back.jpg';
        errors += 1; // counts the error count
        document.getElementById('errors').innerText = errors; // update the error count on the HTML page
        //sound plays when cards do NOT match
        incorrectCardSound.play();

    } else {
        // Cards match, increment the matches count
        matches += 1;
        // sound played if cards match
        correctCardSound.play();
        // Check if all cards are matched
        if (matches === cardList.length) {
            document.getElementById('playAgainBtn').style.display = 'block';
            document.getElementById('end-game').style.display = 'block';
        // all cards are matched
            winGameSound.play();

        } else {
            // Hide the play again button if the game is not finished
            document.getElementById('playAgainBtn').style.display = 'none';
            document.getElementById('end-game').style.display = 'none';
        }
    }

    card1Selected = null; // reset the first selected card
    card2Selected = null; // reset the second selected card
}


function restartGame() {
    // Reset game variables
    errors = 0;
    matches = 0;
    document.getElementById('errors').innerText = errors;


    // Clear the board
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board.length = 0;

    // Shuffle and start the game again
    shuffleCards();
    startGame();
    hideCards();

    // Hide the playAgainBtn after it is clicked
    document.getElementById('playAgainBtn').style.display = 'none';
    document.getElementById('end-game').style.display = 'none';


    // Remove and add the event listener for playAgainBtn
    const playAgainBtn = document.getElementById('playAgainBtn');
    playAgainBtn.removeEventListener('click', restartGame);
    playAgainBtn.addEventListener('click', restartGame);
    

    // Pause the win game sound
    winGameSound.pause();
    winGameSound.currentTime = 0; // Reset the sound to the beginning

    //when restart button is clicked
    playCardClickSound(); // play the card click sound

}

    

// function to play the card click sound
function playCardClickSound() {
    const cardClickSound = new Audio('./audio/sound-effect.mp3');
    cardClickSound.play();

}


let backgroundMusic = document.getElementById('backgroundMusic');
let isMusicPlaying = true;

function toggleBackgroundMusic() {
    if (isMusicPlaying) {
        pauseBackgroundMusic();
    } else {
        playBackgroundMusic();
    }
}

function playBackgroundMusic() {
    backgroundMusic.play();
    isMusicPlaying = true;
}

function pauseBackgroundMusic() {
    backgroundMusic.pause();
    isMusicPlaying = false;
}






