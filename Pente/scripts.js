//Board
const gameBoard = document.getElementById("GameBoard");
const gameBoardVisual = document.getElementById("GameBoardVisual");
const gameBoardPhysical = document.getElementById("GameBoardPhysical");

//Other Elements
const ghost = document.getElementById("Ghost");
const lastPiece = document.getElementById("LastPiece");
const closeToWin = document.getElementById("CloseToWin");
const player1ColorPicker = document.getElementById("Player1Color");
const player2ColorPicker = document.getElementById("Player2Color");
const player1Name = document.getElementById("PlayerOneName");
const player1Label = document.getElementById("PlayerOneLabel");
const player2Name = document.getElementById("PlayerTwoName");
const player2Label = document.getElementById("PlayerTwoLabel");
const resetButton = document.getElementById("ResetButton");


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
    YELLOW: 'yellow',
    EMPTY: 'n'
});

//Basic Variables
let boardArray = [];
let currentPlayer = true; //True = p1 || False = p2
let playerOneColor = COLORS.WHITE;
let playerTwoColor = COLORS.BLACK;
let playerOneName = "Player 1";
let playerTwoName = "Player 2";

const countConsecutivePieces = (row, col, rowShift, colShift) => {
    // Tristyn's baby mk2
    var count = 1;
    var consecutive = true;
    var curPiece = boardArray[row][col];
    while (consecutive) {
        let nextPiece = COLORS.EMPTY;
        try{
            nextPiece = boardArray[row + (count * rowShift)][col + (count * colShift)];
        }catch(ArrayIndexOutOfBoundsException) {
            consecutive = false;
        }
        if(nextPiece !== COLORS.EMPTY) { // skips empty pieces
            if (curPiece == nextPiece) { // if the next piece is the same as the placed piece
                count++;
            } else {
                consecutive = false;
            }
        } else {
            consecutive = false;
        }
    }
    return count;
}

const capturePiece = (row, col, currentPlayerPiece) => {
    //Displacement to check all around last played piece
    let displacement = [-1, 0 , 1];

    //Iterate through the different displacements to check around piece
    for (let rowDisplacement = 0; rowDisplacement < displacement.length; rowDisplacement++) {
        for (let colDisplacement = 0; colDisplacement < displacement.length; colDisplacement++) {
             // Skip the point of origin
            if(rowDisplacement === 1 && colDisplacement === 1) {continue;}

    //Check if three spots away is still in bounds 
    if(gameBoard[row+displacement[rowDisplacementt]*3][col+displacement[colPlacement]*3] < boardSize){  

        // If the current player has a piece 3 spots away
        if(gameBoard[row+displacement[i]*3][col+displacement[j]*3] === currentPlayerPiece){ 

            // Check if there are two of the other player's pieces next to the original x and y position
            if(gameBoard[row+displacement[i]][col+displacement[j]] != currentPlayerPiece
            && gameBoard[row+displacement[i]*2][col+displacement[j]*2] != currentPlayerPiece) { 
                    // Remove thos two opposite pieces from baord.
                    gameBoard[row+displacement[i]][col+displacement[j]] = "";
                    gameBoard[row+displacement[i]*2][col+displacement[j]*2] = "";
                    }
                }
            }
        }
    }
}

const highestConsecutive = (row, col) => {
    // console.log(row, col)
    let vertical = countConsecutivePieces(row, col, 0, 1) + countConsecutivePieces(row, col, 0, -1) - 1;
    let horizontal = countConsecutivePieces(row, col, 1, 0) + countConsecutivePieces(row, col, -1, 0) - 1;
    let diagonalLeft = countConsecutivePieces(row, col, -1, 1) + countConsecutivePieces(row, col, 1, -1) - 1;
    let diagonalRight = countConsecutivePieces(row, col, -1, -1) + countConsecutivePieces(row, col, 1, 1) -1;
    // console.log(vertical + " vertical")
    // console.log(horizontal + " horizontal")
    // console.log(diagonalLeft + " diagonal left")
    // console.log(diagonalRight + " diagonal right")
    // console.log("\n")

    var consecutivePieces = [ vertical, horizontal, diagonalLeft, diagonalRight ];
    return Math.max(...consecutivePieces);
}

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
            boardArray[row][col] = COLORS.EMPTY;
        }
    }
    lastPiece.hidden = true;
    //console.log(boardArray);
};

//Render the Board
const renderBoard = () => {
    //Clear pieces
    gameBoardPhysical.innerHTML = "";

    //Iterate through board and place every piece
    for (let row = 0; row < boardArray.length; row++) {
        for (let col = 0; col < boardArray[row].length; col++) {
            if (boardArray[row][col] !== COLORS.EMPTY) {

                //Turn color into png string
                let imageString = "assets/" + boardArray[row][col] + ".png";

                //Find out where to place the piece
                x = findPixelCoord(row);
                y = findPixelCoord(col);
                
                //Generate the piece at calculated coords with image
                gameBoardPhysical.innerHTML += `<img src=${imageString} style="left:${x}px; top:${y}px;" class="piece"/>`;
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
    

    //Change Last place piece indicator
    lastPiece.hidden = true;

    if ((arrayX >= 0 && arrayX <= boardSize - 1) && (arrayY >= 0 && arrayY <= boardSize - 1)) {
        if ((boardArray[arrayX][arrayY] === COLORS.EMPTY)) {
            //Set Color in place
            boardArray[arrayX][arrayY] = currentPlayer ? playerOneColor : playerTwoColor; 
            let consecutivePieces = highestConsecutive(arrayX, arrayY);
            console.log(consecutivePieces)
            if(consecutivePieces == 3) {
                closeToWin.innerHTML = (currentPlayer ? playerOneName : playerTwoName) + " has a tria!";
            } else if (consecutivePieces == 4) {
                closeToWin.innerHTML = (currentPlayer ? playerOneName : playerTwoName) + " has a tessera!";
            } else if (consecutivePieces >= 5) {
                closeToWin.innerHTML = (currentPlayer ? playerOneName : playerTwoName) + " has won!";
                // TODO win
            }

            //Set piece indicator place
            lastPiece.style.left = `${findPixelCoord(arrayX) + (cellSize / 4)}px`;
            lastPiece.style.top = `${findPixelCoord(arrayY) + (cellSize / 4)}px`;

            lastPiece.hidden = false;

            //Update Board
            renderBoard();

            //Change Player Turn
            currentPlayer = !currentPlayer;
        }
    }
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

//Player 1 color picker
player1ColorPicker.addEventListener("click", evt => {
    elementList = evt.composedPath();
    for (let elementI = 0; elementI < 3; elementI++) {
        //elementList[i].classList.contains
        switch (elementList[elementI].classList[0]) {
            case "black":
                playerOneColor = COLORS.BLACK;
                break;
            case "blue":
                playerOneColor = COLORS.BLUE;
                break;
            case "green":
                playerOneColor = COLORS.GREEN;
                break;
            case "orange":
                playerOneColor = COLORS.ORANGE;
                break;
            case "purple":
                playerOneColor = COLORS.PURPLE;
                break;
            case "red":
                playerOneColor = COLORS.RED;
                break;
            case "white":
                playerOneColor = COLORS.WHITE;
                break;
            case "yellow":
                playerOneColor = COLORS.YELLOW;
                break;
            default:
                playerOneColor = COLORS.BLACK;
                break;
        }
    }
});

//Player 2 color picker
player2ColorPicker.addEventListener("click", evt => {
    elementList = evt.composedPath();
    for (let elementI = 0; elementI < 3; elementI++) {
        //elementList[i].classList.contains
        switch (elementList[elementI].classList[0]) {
            case "black":
                playerTwoColor = COLORS.BLACK;
                break;
            case "blue":
                playerTwoColor = COLORS.BLUE;
                break;
            case "green":
                playerTwoColor = COLORS.GREEN;
                break;
            case "orange":
                playerTwoColor = COLORS.ORANGE;
                break;
            case "purple":
                playerTwoColor = COLORS.PURPLE;
                break;
            case "red":
                playerTwoColor = COLORS.RED;
                break;
            case "white":
                playerTwoColor = COLORS.WHITE;
                break;
            case "yellow":
                playerTwoColor = COLORS.YELLOW;
                break;
            default:
                playerTwoColor = COLORS.BLACK;
                break;
        }
    }
});

resetButton.addEventListener("click", evt => {
    generateBoard();
    renderBoard();
})

player1Name.addEventListener("keyup", evt => {
    playerOneName = player1Name.value;
    player1Label.innerHTML = playerOneName;
})
player2Name.addEventListener("keyup", evt => {
    playerTwoName = player2Name.value;
    player2Label.innerHTML = playerTwoName;
})

generateBoard();
