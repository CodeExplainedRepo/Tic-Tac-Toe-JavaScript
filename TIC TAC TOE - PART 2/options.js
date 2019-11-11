// SELECT ELEMENTS
const options = document.querySelector(".options");
const gameOverElement = document.querySelector(".gameover");

// SELECT BUTTONS
const computerBtn = options.querySelector(".computer");
const friendBtn = options.querySelector(".friend");
const xBtn = options.querySelector(".x");
const oBtn = options.querySelector(".o");
const playBtn = options.querySelector(".play");

// SOME VARIABLES TO STORE USER'S OPTIONS
let OPPONENT;
const player = new Object;

// ADD AND EVENT LISTENER TO EVERY BUTTON
computerBtn.addEventListener("click", function(){
    OPPONENT = "computer";

    switchActive(friendBtn, computerBtn);
});

friendBtn.addEventListener("click", function(){
    OPPONENT = "friend";

    switchActive(computerBtn, friendBtn);
});

xBtn.addEventListener("click", function(){
    player.man = "X";
    player.computer = "O";
    player.friend = "O";

    switchActive(oBtn, xBtn);
});

oBtn.addEventListener("click", function(){
    player.man = "O";
    player.computer = "X";
    player.friend = "X";

    switchActive(xBtn, oBtn);
});

playBtn.addEventListener("click", function(){
    // CHECK IF THE USER CHOSE AN OPPONENT
    if( !OPPONENT){
        computerBtn.style.backgroundColor = "#f00";
        friendBtn.style.backgroundColor = "#f00";

        return;
    }

    // CHECK IF THE USER CHOSE A SYMBOL
    if( !player.man ){
        xBtn.style.backgroundColor = "#f00";
        oBtn.style.backgroundColor = "#f00";

        return;
    }

    // RUN THE GAME
    init(player, OPPONENT);
    options.classList.add("hide");
});

// SWITCH ACTIVE CLASS BETWEEN TWO ELEMENTS
function switchActive(off, on){
    off.classList.remove("active");
    on.classList.add("active");
}