const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const button = document.getElementById('button');
const hitBtn = document.getElementById('hit');
const stayBtn = document.getElementById('stay');
const resetBtn = document.getElementById('reset');
const doubleBtn = document.getElementById("double");
const insuranceBtn = document.getElementById("insurance");

const player = document.getElementById("player");
const dealer = document.getElementById("dealer");

const container = document.getElementById("container");

var moneyDisplay = document.getElementById("money");
var moneyAmt = 2500;

var dealerCards = [];
var playerCards = [];

var dealerTotal = 0;
var playerTotal = 0;

var blackjack = false;
var under21 = true;

button.addEventListener('click', deal);
stayBtn.addEventListener('click', stayScenario);
hitBtn.addEventListener('click', hitScenario);
resetBtn.addEventListener('click', resetGame);
doubleBtn.addEventListener('click', doubleScenario);
insuranceBtn.addEventListener('click', insuranceScenario);

var betContainer = document.getElementById("betContainer");
var betButtons = document.getElementsByClassName("betButton");
var betDisplay = document.createElement("h1");
var betAmt = 0;

var finalWords = document.getElementById("finalWords");

// resets game
function resetGame() {
    console.log("Reset Game");
    dealerCards = [];
    playerCards = [];
    blackjack = false;
    under21 = true;
    betAmt = 0;
    betDisplay.remove();
    updateTotals();
    // resets buttons
    button.classList.remove("hidden");
    hitBtn.classList.add("hidden");
    stayBtn.classList.add("hidden");
    resetBtn.classList.add("hidden");
    doubleBtn.classList.add("hidden");
    for (let i = 0; i < betButtons.length; i++) {
        betButtons[i].classList.remove("hidden");
    }
    // removes cards
    var cardsList = document.querySelectorAll('.card');
    var cardsListArr = Array.prototype.slice.call(cardsList);
    for (let i = 0; i < cardsListArr.length; i++) {
        cardsListArr[i].remove();
    }
    // removes words
    var h2List = document.querySelectorAll('h2');
    var h2ListArr = Array.prototype.slice.call(h2List);
    for (let i = 0; i < h2ListArr.length; i++) {
        h2ListArr[i].remove();
    }
    finalWords.innerText = "";
}

function deal() {
    // updates money
    moneyAmt -= betAmt;
    moneyDisplay.innerText = "$" + moneyAmt;

    // gives dealer and player two random starting cards
    for (let i = 0; i < 2; i++) {
        let randomCard = getRandomCard();
        dealerCards.push(randomCard);
        var newCard = document.createElement("div");
        newCard.classList.add("card");
        if (i == 1) {
            newCard.classList.add("flipped");
            newCard.setAttribute("id", "flippedCard");
        }
        dealer.appendChild(newCard);
        newCard.innerText = dealerCards[i];
    }
    for (let i = 0; i < 2; i++) {
        let randomCard = getRandomCard();
        playerCards.push(randomCard);
        var newCard = document.createElement("div");
        newCard.classList.add("card");
        player.appendChild(newCard);
        newCard.innerText = playerCards[i];
    }

    // removes button and adds hit or stay buttons
    button.classList.add("hidden");
    hitBtn.classList.remove("hidden");
    stayBtn.classList.remove("hidden");
    doubleBtn.classList.remove("hidden");
    if (dealerCards[0] == 'A') {
        insuranceBtn.classList.remove("hidden");
    }
    // removes bet buttons
    for (let i = 0; i < betButtons.length; i++) {
        betButtons[i].classList.add("hidden");
    }

    updateTotals();

    console.log(dealerCards, dealerTotal);
    console.log(playerCards, playerTotal);

    // checks for Blackjack
    if (playerTotal == 21) {
        if (dealerTotal != 21) {
            blackjack = true;
        }
        endGame();
    }
}

function updateTotals() {
    playerTotal = 0;
    dealerTotal = 0;
    // calculates player and dealer totals
    for (let i = 0; i < playerCards.length; i++) {
        playerTotal += cardToNum(playerCards[i]);
    }
    for (let i = 0; i < dealerCards.length; i++) {
        dealerTotal += cardToNum(dealerCards[i]);
    }

    // corrects ace values
    if (playerTotal > 21 && playerCards.includes('A')) {
        for (let i = 0; i < playerCards.length; i++) {
            // breaks if player total is under 21
            if (playerTotal <= 21) {
                break;
            } else if (playerCards[i] == 'A') {
                playerTotal -= 10;
            }
        }
    }
    if (dealerTotal > 21 && dealerCards.includes('A')) {
        for (let i = 0; i < dealerCards.length; i++) {
            if (dealerTotal <= 21) {
                break;
            } else if (dealerCards[i] == 'A') {
                dealerTotal -= 10;
            }
        }
    }
}

// converts card to numerical value
function cardToNum(value) {
    num = 0;
    if (isNaN(value)) {
        if (value == 'A') {
            num = 11;
        } else {
            num = 10;
        }
    } else {
        num = parseInt(value);
    }
    return num;
}

function displayTotals() {
    // display player total
    var playerTotDisplay = document.createElement("h2");
    playerTotDisplay.innerText = playerTotal;
    player.appendChild(playerTotDisplay);
    // display dealer total
    if (playerTotal <= 21) {
        var dealerTotDisplay = document.createElement("h2");
        dealerTotDisplay.innerText = dealerTotal;
        dealer.appendChild(dealerTotDisplay);
    }
}

function hitScenario() {
    insuranceBtn.classList.add("hidden");

    // gets random card and adds to player cards
    var randCard = getRandomCard();
    playerCards.push(randCard);
    var newCard = document.createElement("div");
    newCard.classList.add("card");
    player.appendChild(newCard);
    newCard.innerText = playerCards[playerCards.length - 1];

    updateTotals();
    console.log(randCard, playerTotal);

    // checks if player won (maybe can consolidate into endGame() function)
    if (playerTotal == 21) {
        under21 = false;
        stayScenario();
    }
    // checks if player lost
    if (playerTotal > 21) {
        under21 = false;
        endGame();
    }
    doubleBtn.classList.add("hidden");
}

function stayScenario() {
    insuranceBtn.classList.add("hidden");

    // flips dealer's second card
    document.getElementById("flippedCard").classList.remove("flipped");

    // auto plays for dealer
    while (dealerTotal <= 16) {
        var randCard = getRandomCard();
        dealerCards.push(randCard);
        var newCard = document.createElement("div");
        newCard.classList.add("card");
        dealer.appendChild(newCard);
        newCard.innerText = dealerCards[dealerCards.length - 1];
        updateTotals();
        console.log(randCard, dealerTotal);
    }
    endGame();
}

function insuranceScenario() {
    var sideBet = betAmt / 2;
    updateTotals();
    document.getElementById("flippedCard").classList.remove("flipped");
    // insurance win scenario
    if (dealerTotal == 21) {
        finalWords.innerText += "You win! Money back.";
        moneyAmt += betAmt;
        button.classList.add("hidden");
        hitBtn.classList.add("hidden");
        stayBtn.classList.add("hidden");
        resetBtn.classList.remove("hidden");
        doubleBtn.classList.add("hidden");
        // insurance lose scenario
    } else {
        moneyAmt -= sideBet;
        finalWords.innerText += "No insurance!";
        stayScenario();
    }
    insuranceBtn.classList.add("hidden");
    moneyDisplay.innerText = "$" + moneyAmt;
}

function doubleScenario() {
    insuranceBtn.classList.add("hidden");

    moneyAmt -= betAmt;
    betAmt *= 2;
    moneyDisplay.innerText = "$" + moneyAmt;
    betDisplay.innerText = "$" + betAmt;
    hitScenario();
    if (under21) {
        stayScenario();
    }
}

function endGame() {
    insuranceBtn.classList.add("hidden");
    // tells who wins
    console.log(playerTotal, dealerTotal);
    if (playerTotal > 21) {
        finalWords.innerText += " You lose! Too many!";
    } else if (playerTotal < dealerTotal && dealerTotal <= 21) {
        finalWords.innerText += " You lose!";
    } else if (playerTotal == dealerTotal) {
        finalWords.innerText += " Push!";
        moneyAmt += betAmt;
    } else if (blackjack) {
        finalWords.innerText += " Blackjack!";
        moneyAmt += (betAmt * 2.5);
    } else {
        finalWords.innerText += " You win!";
        moneyAmt += (betAmt * 2);
    }
    button.classList.add("hidden");
    hitBtn.classList.add("hidden");
    stayBtn.classList.add("hidden");
    resetBtn.classList.remove("hidden");
    doubleBtn.classList.add("hidden");
    moneyDisplay.innerText = "$" + moneyAmt;
    displayTotals();
}

// gets random card
function getRandomCard() {
    var randomCard = Math.floor(Math.random() * cards.length);
    return cards[randomCard];
}

// updates bet amount
for (let i = 0; i < betButtons.length; i++) {
    betButtons[i].addEventListener('click', function () {
        betDisplay.innerText = "$" + betButtons[i].innerText;
        betDisplay.classList.add('betDisplay');
        betContainer.appendChild(betDisplay);
        betAmt = parseInt(betButtons[i].innerText);
    });
}





