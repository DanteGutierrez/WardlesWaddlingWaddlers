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
let playerPicture = document.getElementById("PlayerPicture");
let playerTurnLabel = document.getElementById("PlayerTurnLabel");

//Stars
let starOne = document.getElementById("StarOne");
let starTwo = document.getElementById("StarTwo");
let starThree = document.getElementById("StarThree");

//Global Variables
let difficulty = 0;
let playerTurn = true; //True = P1 | False = P2
let row_selected;
let difficulties = {
    0: [1, 3, 5],
    1: [1, 3, 5, 7],
    2: [3, 5, 7, 9, 11]
};
let board;

//Method
const TurnSwitch = () => {
    playerPicture.src = playerTurn ? "media/Whale.png" : "media/BretIcon.png";
    playerPicture.alt = playerTurn ? "Player 1 Icon" : "Player 2 Icon";
    playerTurnLabel.innerHTML = playerTurn ? "Player 1's Turn" : "Player 2's Turn";
    row_selected = null;
}

const DifficultySwitch = StarId => {
    if (StarId !== "StarOne" && StarId !== "StarTwo" && StarId !== "StarThree") {
        console.log("fixed ya");
        return;
    };
    starOne.classList.remove("star-on");
    starTwo.classList.remove("star-on");
    starThree.classList.remove("star-on");
    starOne.classList.remove("star-off");
    starTwo.classList.remove("star-off");
    starThree.classList.remove("star-off");
    switch (StarId) {
        case "StarOne":
            starOne.classList.add("star-on");
            starTwo.classList.add("star-off");
            starThree.classList.add("star-off");
            break;
        case "StarTwo":
            starOne.classList.add("star-on");
            starTwo.classList.add("star-on");
            starThree.classList.add("star-off");
            break;
        case "StarThree":
            starOne.classList.add("star-on");
            starTwo.classList.add("star-on");
            starThree.classList.add("star-on");
            break;
        default:
            console.log("There was a bit of an issue");
            break;
    }
};

const game_over = () => {
    var count = 0;
    for(let i = 0; i < board.length; i++) {
        count+=board[i];
    }
    if (count <= 1) {
        // game is over, stop everything
        alert("Game Over ... Won");
    }
}

const remove_piece = row => {
    if (row == row_selected || row_selected == null) {
        cur_stick = board[row];
        if (cur_stick > 0) {
            cur_stick--;
            row_selected = row;
        }
        game_over();
    }
}

const reset_game = () => {
    return difficulties[difficulty];
}

const setup_board = () => {
    board = reset_game();
    // handle piece placement visually?
}

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
    DifficultySwitch(evt.path[0].id);
});

//Run on StartUp
TurnSwitch();
DifficultySwitch("StarOne");
setup_board(difficulty);






