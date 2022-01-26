//Board
const gameBoard = document.getElementById("GameBoard");
const gameBoardVisual = document.getElementById("GameBoardVisual");
const gameBoardPhysical = document.getElementById("GameBoardPhysical");

//Other Elements
const ghost = document.getElementById("Ghost");



//Consts
const outsideMargin = 0;
const boardMargin = 30;
const cellSize = 40;
const boardSize = 19;
const COLORS = Object.freeze({
    BLACK: 'black',
    BLUE: 'blue',
    GREEN: 'green',
    ORANGE: 'orange',
    PURPLE: 'purple',
    RED: 'red',
    WHITE: 'white',
    YELLOW: 'yellow'
});

//Basic Variables
let boardArray = [];
let currentPlayer = true; //True = p1 || False = p2
let playerOneColor = COLORS.WHITE;
let playerTwoColor = COLORS.BLACK;

//Find Board Coord
const findBoardCoord = ArrayCoord => {
    // Takes either Array Row number or Array Y number and turns it into pixel measurement
    return (ArrayCoord * cellSize) + boardMargin + outsideMargin + (cellSize / 2);
}

//Generate Board
const generateBoard = () => {
    // r = row || c = column
    let board = "";
    for (let r = 0; r < boardSize + 1; r++) {
        board += "<div class='container horizontal'>";
        for (let c = 0; c < boardSize + 1; c++) {
            board += `<div class="boardCell"></div>`;
        }
        board += "</div>";
    }
    gameBoardVisual.innerHTML = board;
    for (let r = 0; r < boardSize; r++) {
        boardArray[r] = [];
        for (let c = 0; c < boardSize; c++) {
            boardArray[r][c] = ""; //Generates a blank board
        }
    }
    console.log(boardArray);
};

//Render the Board
const renderBoard = () => {
    gameBoardPhysical.innerHTML = "";
    // r = row || c = column
    for (let r = 0; r < boardArray.length; r++) {
        for (let c = 0; c < boardArray[r].length; c++) {
            if (boardArray[r][c] !== "") {
                let imageString = "assets/" + boardArray[r][c] + ".png"
                x = findBoardCoord(r);
                y = findBoardCoord(c);
                gameBoardPhysical.innerHTML += `<img src=${imageString} style="left:${x}px; top:${y}px;"/>`;
            }
        }
    }
}

//Click
gameBoard.addEventListener("click", evt => {
    //Grab Current Cursor Coords
    let x = evt.clientX;
    let y = evt.clientY;
    console.log(`True Coords: ${x}, ${y}`);
    //Tells what tile you are on, in terms of the array
    let aX = Math.floor((x - outsideMargin - boardMargin - (cellSize / 2)) / cellSize);
    let aY = Math.floor((y - outsideMargin - boardMargin - (cellSize / 2)) / cellSize);
    console.log(`Assumed Cell: ${aX}, ${aY}`);
    //Set Color in place
    boardArray[aX][aY] = (currentPlayer ? playerOneColor : playerTwoColor); 
    renderBoard();
    //Change Player Turn
    currentPlayer = !currentPlayer;
    
});

//Ghost Hover
gameBoard.addEventListener("mousemove", evt => {
    //Grab Current Cursor Coords
    let x = evt.clientX;
    let y = evt.clientY;
    //Tells what tile you are on, in terms of the array
    let aX = Math.floor((x - outsideMargin - boardMargin - (cellSize / 2)) / cellSize);
    let aY = Math.floor((y - outsideMargin - boardMargin - (cellSize / 2)) / cellSize);
    if ((aX >= 0 && aX <= boardSize - 1) && (aY >= 0 && aY <= boardSize - 1)) { //If you are within the bounds of the array, display the ghost
        //Ghost math
        let bX = findBoardCoord(aX);
        let bY = findBoardCoord(aY);

        ghost.src = "assets/" + (currentPlayer ? playerOneColor : playerTwoColor) + ".png"; //Change player color
        //Move Piece
        ghost.style.left = `${bX}px`;
        ghost.style.top = `${bY}px`;
        ghost.hidden = false;
    }
    else {
        ghost.hidden = true;
    }
});

generateBoard();