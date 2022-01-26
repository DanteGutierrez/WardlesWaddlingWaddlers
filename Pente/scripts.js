//Board
const gameBoard = document.getElementById("GameBoard");
const gameBoardVisual = document.getElementById("GameBoardVisual");
const gameBoardPhysical = document.getElementById("GameBoardPhysical");

//Other Elements
const ghost = document.getElementById("Ghost");



//Board Customization Consts
const outsideMargin = 0;
const boardMargin = 30;
const cellSize = 40;
const boardSize = 19;

// JS Enum Equivalent
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

//Array Coord => Pixel Coord
const findPixelCoord = ArrayCoord => {
    // Takes either Array Row number or Array Y number and turns it into pixel measurement
    return (ArrayCoord * cellSize) + boardMargin + outsideMargin + (cellSize / 2);
}

//Pixel Coord => Array Coord
const findArrayCoord = PixelCoord => {
    //Takes either Pixel X or Pixel Y and turns it into Array Coord
    return Math.floor((PixelCoord - outsideMargin - boardMargin - (cellSize / 2)) / cellSize);
}

//Generate Board
const generateBoard = () => {
    //Clear Board
    let board = "";

    //Tie rows and columns of visual tiles
    for (let row = 0; row < boardSize + 1; row++) {
        board += "<div class='container horizontal'>";
        for (let col = 0; col < boardSize + 1; col++) {
            board += `<div class="boardCell"></div>`;
        }
        board += "</div>";
    }

    //Add all tiles to board
    gameBoardVisual.innerHTML = board;

    //Go through all tiles of the board and clear out pieces
    for (let row = 0; row < boardSize; row++) {
        boardArray[row] = [];
        for (let col = 0; col < boardSize; col++) {
            boardArray[row][col] = "";
        }
    }

    //console.log(boardArray);
};

//Render the Board
const renderBoard = () => {
    //Clear pieces
    gameBoardPhysical.innerHTML = "";

    //Iterate through board and place every piece
    for (let row = 0; row < boardArray.length; row++) {
        for (let col = 0; col < boardArray[row].length; col++) {
            if (boardArray[row][col] !== "") {

                //Turn color into png string
                let imageString = "assets/" + boardArray[row][col] + ".png"

                //Find out where to place the piece
                x = findPixelCoord(row);
                y = findPixelCoord(col);
                
                //Generate the piece at calculated coords with image
                gameBoardPhysical.innerHTML += `<img src=${imageString} style="left:${x}px; top:${y}px;"/>`;
            }
        }
    }
}

//Place Piece Click
gameBoard.addEventListener("click", evt => {

    //Grab Current Cursor Coords
    let x = evt.clientX;
    let y = evt.clientY;
    // console.log(`True Coords: ${x}, ${y}`);

    //Tells what tile you are on, in terms of the array
    let arrayX = findArrayCoord(x);
    let arrayY = findArrayCoord(y);
    // console.log(`Assumed Cell: ${arrayX}, ${arrayY}`);

    //Set Color in place
    boardArray[arrayX][arrayY] = (currentPlayer ? playerOneColor : playerTwoColor); 

    //Update Board
    renderBoard();

    //Change Player Turn
    currentPlayer = !currentPlayer;
    
});

//Ghost Hover Piece
gameBoard.addEventListener("mousemove", evt => {

    //Grab Current Cursor Coords
    let x = evt.clientX;
    let y = evt.clientY;

    //Tells what tile you are on, in terms of the array
    let arrayX = findArrayCoord(x);
    let arrayY = findArrayCoord(y);

    //If you are within the bounds of the array, display the ghost
    if ((arrayX >= 0 && arrayX <= boardSize - 1) && (arrayY >= 0 && arrayY <= boardSize - 1)) { 

        //Ghost math
        let boardX = findPixelCoord(arrayX);
        let boardY = findPixelCoord(arrayY);

        //Change player color
        ghost.src = "assets/" + (currentPlayer ? playerOneColor : playerTwoColor) + ".png"; 

        //Move Piece
        ghost.style.left = `${boardX}px`;
        ghost.style.top = `${boardY}px`;

        //After all other parts of the ghost are set, make the ghost appear
        ghost.hidden = false;
    }
    else {

        //Hide the ghost because you are outside of the board
        ghost.hidden = true;
    }
});

generateBoard();