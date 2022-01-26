//Board
const gameBoard = document.getElementById("GameBoard");
const gameBoardVisual = document.getElementById("GameBoardVisual");

const ghost = document.getElementById("Ghost");
let boardArray = [];

//Basic Variables
const outsideMargin = 8;
const boardMarginY = 30;
const boardMarginX = 30;
const cellSize = 40;
const boardSize = 19;

//Click
gameBoard.addEventListener("click", evt => {
    //Grab Current Cursor Coords
    let x = evt.clientX;
    let y = evt.clientY;
    console.log(`True Coords: ${x}, ${y}`);
    //Tells what tile you are on, in terms of the array
    let aX = Math.floor((x - outsideMargin - boardMarginX - (cellSize / 2)) / cellSize);
    let aY = Math.floor((y - outsideMargin - boardMarginY - (cellSize / 2)) / cellSize);
    console.log(`Assumed Cell: ${aX}, ${aY}`);
});

//Ghost Hover
gameBoard.addEventListener("mousemove", evt => {
    //Grab Current Cursor Coords
    let x = evt.clientX;
    let y = evt.clientY;
    //Tells what tile you are on, in terms of the array
    let aX = Math.floor((x - outsideMargin - boardMarginX - (cellSize / 2)) / cellSize);
    let aY = Math.floor((y - outsideMargin - boardMarginY - (cellSize / 2)) / cellSize);
    if ((aX >= 0 && aX <= boardSize) && (aY >= 0 && aY <= boardSize)) { //If you are within the bounds of the array, display the ghost
        //Ghost math
        let bX = (aX * cellSize) + boardMarginX + outsideMargin + (cellSize / 2);
        let bY = (aY * cellSize) + boardMarginY + outsideMargin + (cellSize / 2);
        ghost.hidden = false;
        ghost.style.left = `${bX}px`;
        ghost.style.top = `${bY}px`;
    }
    else {
        ghost.hidden = true;
    }
});

//Generate Board
const generateBoard = () => {
    let board = "";
    for (let i = 0; i < boardSize + 1; i++) {
        board += "<div class='container horizontal'>";
        for (let j = 0; j < boardSize + 1; j++) {
            board += `<div class="boardCell"></div>`;
        }
        board += "</div>";
    }
    gameBoardVisual.innerHTML = board;
    for (let i = 0; i < boardSize; i++) {
        boardArray[i] = [];
        for (let j = 0; j < boardSize; j++) {
            boardArray[i][j] = "";
        }
    }
    console.log(boardArray);
};
generateBoard();