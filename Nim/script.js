//Buttons
const instructionsCloseButton = document.getElementById("InstructionsCloseButton");
const instructionsOpenButton = document.getElementById("InstructionsOpenButton");
const resetButton = document.getElementById("ResetButton");
const difficultyContainer = document.getElementById("DifficultyContainer");
const turnButton = document.getElementById("TurnButton");

//Inputs
const playerOneInput = document.getElementById("PlayerOneInput");
const playerTwoInput = document.getElementById("PlayerTwoInput");

//Ids
const instructionsHide = document.getElementById("InstructionsHide");
const gameHide = document.getElementById("GameHide");
const playerPicture = document.getElementById("PlayerPicture");
const playerTurnLabel = document.getElementById("PlayerTurnLabel");
const gameCanvas = document.getElementById("GameCanvas");

//Stars
const starOne = document.getElementById("StarOne");
const starTwo = document.getElementById("StarTwo");
const starThree = document.getElementById("StarThree");

//Global Variables
const difficulties = {
    0: [1, 3, 5],
    1: [1, 3, 5, 7],
    2: [3, 5, 7, 9, 11]
};
let difficulty = 0;
let playerTurn = false; //True = P1 | False = P2
let row_selected;
let board;
let playerOneName;
let playerTwoName;

//Method
const TurnSwitch = () => {
    playerTurn = !playerTurn;
    playerPicture.src = playerTurn ? "media/Whale.png" : "media/BretIcon.png";
    playerPicture.alt = playerTurn ? `${playerOneName} Icon` : `${playerTwoName} Icon`;
    playerTurnLabel.innerHTML = playerTurn ? `${playerOneName}'s Turn` : `${playerTwoName}'s Turn`;
    row_selected = null;
}

const DifficultySwitch = StarId => {
    if (StarId !== "StarOne" && StarId !== "StarTwo" && StarId !== "StarThree") { //Checks for any input that isnt a star, then breaks out
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
            console.log("Star selection is broken");
            break;
    }
    setup_board();
};

const game_over = async (row) => {
    var count = 0;
    for(let i = 0; i < board.length; i++) {
        count+=board[i];
    }
    if (count <= 1) {
        // game is over, stop everything
        console.log(`Game Over ${playerTurn ? `${playerOneName}` : `${playerTwoName}`} Won`); //TODO fix this to display to user
        document.getElementById(`Row${row}`).lastChild.disabled = true;
    }
    return;
}
const delete_harpoon = async (row) => {
    box = document.getElementById(`Row${row}`).firstChild;
    if (box.children.length > 1) {
        harpoon = box.firstChild;
        box.removeChild(harpoon);
    }
    else {
        document.getElementById(`Row${row}`).style.display = "none";
    }
    return;
}

const remove_piece = async (row) => {
    if (row == row_selected || row_selected == null) {
        // Logic
        if (board[row] > 0) {
            board[row]--;
            row_selected = row;
        }
        // Display Update
        await delete_harpoon(row);
        // Win Check
        await game_over(row);
    }
}

const setup_board = () => {
    /*
    Generates the images and buttons for the current difficulty. If the button to take a harpoon is pressed,
    the button calls remove_piece() and passes in the row the button was clicked for. Every harpoon has a way
    of identifying itself, through it's alt tag, it gives the row and current position of itself. You are 
    going to have to use this in order to remove or hide it.
    */
    playerOneName = playerOneInput.value !== "" ? playerOneInput.value : "Player 1";
    playerTwoName = playerTwoInput.value !== "" ? playerTwoInput.value : "Player 2";
    playerTurn = false;
    TurnSwitch();
    board = Object.assign([], difficulties[difficulty]);
    let finishedBoard = "";
    for (let row = 0; row < board.length; row++) {
        finishedBoard += `<div id="Row${row}" class="container item vertical harpoon-group"><div class="container item horizontal">`;
        for (let stick = 0; stick < board[row]; stick++) {
            finishedBoard += `<img src="media/Match_Stick.png" alt="${row + " " + stick}" class="item"/>`;
        }
        finishedBoard += `</div><button class="item take-button" onClick="remove_piece(${row})">Take Here</button></div>`;
    }
    gameCanvas.innerHTML = finishedBoard;
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
    setup_board();
});

difficultyContainer.addEventListener("click", evt => {
    DifficultySwitch(evt.path[0].id);
});

turnButton.addEventListener("click", evt => {
    if (row_selected != null) {
        TurnSwitch();
    }
    
});

//Run on StartUp
DifficultySwitch("StarOne");
setup_board();






