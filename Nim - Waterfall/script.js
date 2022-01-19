//Buttons
let instructionsCloseButton = document.getElementById("InstructionsCloseButton");
let instructionsOpenButton = document.getElementById("InstructionsOpenButton");
let resetButton = document.getElementById("ResetButton");
let difficultyContainer = document.getElementById("DifficultyContainer");

//Inputs
let playerOneInput = document.getElementById("PlayerOneInput");
let playerTwoInput = document.getElementById("PlayerTwoInput");

//Ids
let instructionsHide = document.getElementById("InstructionsHide");
let gameHide = document.getElementById("GameHide");

//Stars
let starOne = document.getElementById("StarOne");
let starTwo = document.getElementById("StarTwo");
let starThree = document.getElementById("StarThree");

//Global Variables
let difficulty = 0;

//Event Listeners
instructionsCloseButton.addEventListener("click", evt => {
    instructionsHide.hidden = true;
    gameHide.hidden = false;
});

instructionsOpenButton.addEventListener("click", evt => {
    instructionsHide.hidden = false;
    gameHide.hidden = true;
});

resetButton.addEventListener("click", evt => {
    setup_board(difficulty);
});

difficultyContainer.addEventListener("click", evt => {
    starOne.classList.remove("star-on");
    starTwo.classList.remove("star-on");
    starThree.classList.remove("star-on");
    starOne.classList.remove("star-off");
    starTwo.classList.remove("star-off");
    starThree.classList.remove("star-off");
    switch (evt.path[0].id) {
        case "StarOne":
            starOne.classList.add("star-on");
            starTwo.classList.add("star-off");
            starThree.classList.add("star-off");
            difficulty = 0;
            break;
        case "StarTwo":
            starOne.classList.add("star-on");
            starTwo.classList.add("star-on");
            starThree.classList.add("star-off");
            difficulty = 1;
            break;
        case "StarThree":
            starOne.classList.add("star-on");
            starTwo.classList.add("star-on");
            starThree.classList.add("star-on");
            difficulty = 2;
            break;
        default:
            console.log("There was a bit of an issue");
            break;
    }
    setup_board(difficulty);
});

let turn = 0;
let row_selected;
var difficulties = {
    0: [1, 3, 5],
    1: [1, 3, 5, 7],
    2: [3, 5, 7, 9, 11]
}

let board = reset_game();

const setup_board = difficulty => {
    // handle piece placement visually?
    return difficulties[difficulty];
}

const remove_piece = row => {
    // remove one piece from the row that is given, check for a win
    if (row == row_selected || row_selected == null) {
        cur_stick = board[row];
        if (cur_stick > 0) {
            cur_stick--;
            row_selected = row;
        }
        game_over();
    }
}

const game_over = () => {
    if (1 == 1) { // TODO change the condition
        turn = 0;
    }
    // check if there's only one piece left on the board and declare the winner
}

const switch_turns = () => {
    // switch turn between players
    row_selected = null;
}