//Board
const gameBoard = document.getElementById("GameBoard");
const gameBoardVisual = document.getElementById("GameBoardVisual");
const gameBoardPhysical = document.getElementById("GameBoardPhysical");

//Other Elements
const ghost = document.getElementById("Ghost");
const lastPiece = document.getElementById("LastPiece");
const player1closeToWin = document.getElementById("Player1CloseToWin");
const player2closeToWin = document.getElementById("Player2CloseToWin");
const player1ColorPicker = document.getElementById("Player1Color");
const player2ColorPicker = document.getElementById("Player2Color");
const player1Name = document.getElementById("PlayerOneName");
const player2Name = document.getElementById("PlayerTwoName");
const resetButton = document.getElementById("ResetButton");
const colorPickRow = document.getElementById("ColorPickRow");
const player1CaptureLabel = document.getElementById("PlayerOneCaptureLabel");
const player2CaptureLabel = document.getElementById("PlayerTwoCaptureLabel");
const player1ColorImage = document.getElementById("Player1ColorChoiceImage");
const player2ColorImage = document.getElementById("Player2ColorChoiceImage");


//Board Customization Consts
const outsideMargin = 0;
const boardMargin = 20;
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
let gameStarted = false;
let gameWon = false;
let playerOneCaptures = 0;
let playerTwoCaptures = 0;
const captureStates = ["○ ○ ○ ○ ○", "● ○ ○ ○ ○", "● ● ○ ○ ○", "● ● ● ○ ○", "● ● ● ● ○", "● ● ● ● ●"];

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
            if (row + (displacement[rowDisplacement] * 3) >= 0 && row + (displacement[rowDisplacement] * 3) < boardSize) {
                if (col + (displacement[colDisplacement] * 3) >= 0 && col + (displacement[colDisplacement] * 3) < boardSize) {
                    // If the current player has a piece 3 spots away
                    if (boardArray[row + (displacement[rowDisplacement] * 3)][col + (displacement[colDisplacement] * 3)] === currentPlayerPiece) {
                        // Check if there are two of the other player's pieces next to the original x and y position
                        if (boardArray[row + displacement[rowDisplacement]][col + displacement[colDisplacement]] != currentPlayerPiece
                            && boardArray[row + displacement[rowDisplacement] * 2][col + displacement[colDisplacement] * 2] != currentPlayerPiece) {
                            // Remove thos two opposite pieces from baord.
                            boardArray[row + displacement[rowDisplacement]][col + displacement[colDisplacement]] = COLORS.EMPTY;
                            boardArray[row + displacement[rowDisplacement] * 2][col + displacement[colDisplacement] * 2] = COLORS.EMPTY;
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
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
    gameStarted = false;
    gameWon = false;
    playerOneCaptures = 0;
    playerTwoCaptures = 0;
    player1CaptureLabel.innerHTML = captureStates[0]; 
    player2CaptureLabel.innerHTML = captureStates[0]; 
    player1closeToWin.innerHTML = "Nothing to Report";
    player2closeToWin.innerHTML = "Nothing to Report";
    colorPickRow.style.display = "flex";

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

const updateCaptures = () => {
    currentPlayer ? player1CaptureLabel.innerHTML = captureStates[playerOneCaptures] : player2CaptureLabel.innerHTML = captureStates[playerTwoCaptures];

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

    if ((arrayX >= 0 && arrayX <= boardSize - 1) && (arrayY >= 0 && arrayY <= boardSize - 1) && !gameWon) {
        if ((boardArray[arrayX][arrayY] === COLORS.EMPTY)) {
            //Set Color in place
            boardArray[arrayX][arrayY] = currentPlayer ? playerOneColor : playerTwoColor; 
            let consecutivePieces = highestConsecutive(arrayX, arrayY);
            gameStarted = true;
            colorPickRow.style.display = "none";
            if(consecutivePieces == 3) {
                currentPlayer ? player1closeToWin.innerHTML = (playerOneName + " has a tria!") : player2closeToWin.innerHTML = (playerTwoName + " has a tria!")
            } else if (consecutivePieces == 4) {
                currentPlayer ? player1closeToWin.innerHTML = (playerOneName + " has a tessera!") : player2closeToWin.innerHTML = (playerTwoName + " has a tessera!")
            } else if (consecutivePieces >= 5) {
                currentPlayer ? player1closeToWin.innerHTML = (playerOneName + " has won!") : player2closeToWin.innerHTML = (playerTwoName + " has won!")
                gameWon = true;
                // TODO win
            }

            if (capturePiece(arrayX, arrayY, currentPlayer ? playerOneColor : playerTwoColor)) {
                (currentPlayer ? playerOneCaptures++ : playerTwoCaptures++);
                updateCaptures();
                if ((currentPlayer ? playerOneCaptures == 5 : playerTwoCaptures == 5)) {
                    currentPlayer ? player1closeToWin.innerHTML = (playerOneName + " has won!") : player2closeToWin.innerHTML = (playerTwoName + " has won!")
                    gameWon = true;
                }
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
    if ((arrayX >= 0 && arrayX <= boardSize - 1) && (arrayY >= 0 && arrayY <= boardSize - 1) && !gameWon) { 

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
    let elementList = evt.composedPath();
    let colorPicked = false;
    let oppositeColorIndex = -1;
    for (let opposite = 0; opposite < player2ColorPicker.children.length; opposite++) {
        player2ColorPicker.children[opposite].style.display = "flex";
    }
    for (let elementI = 0; elementI < 3; elementI++) {
        //elementList[i].classList.contains
        switch (elementList[elementI].classList[0]) {
            case "black":
                playerOneColor = COLORS.BLACK;
                player1ColorImage.src = "assets/" + COLORS.BLACK + ".png";
                colorPicked = true;
                oppositeColorIndex = 0;
                break;
            case "blue":
                playerOneColor = COLORS.BLUE;
                player1ColorImage.src = "assets/" + COLORS.BLUE + ".png";
                colorPicked = true;
                oppositeColorIndex = 1;
                break;
            case "green":
                playerOneColor = COLORS.GREEN;
                player1ColorImage.src = "assets/" + COLORS.GREEN + ".png";
                colorPicked = true;
                oppositeColorIndex = 2;
                break;
            case "orange":
                playerOneColor = COLORS.ORANGE;
                player1ColorImage.src = "assets/" + COLORS.ORANGE + ".png";
                colorPicked = true;
                oppositeColorIndex = 3;
                break;
            case "purple":
                playerOneColor = COLORS.PURPLE;
                player1ColorImage.src = "assets/" + COLORS.PURPLE + ".png";
                colorPicked = true;
                oppositeColorIndex = 4;
                break;
            case "red":
                playerOneColor = COLORS.RED;
                player1ColorImage.src = "assets/" + COLORS.RED + ".png";
                colorPicked = true;
                oppositeColorIndex = 5;
                break;
            case "white":
                playerOneColor = COLORS.WHITE;
                player1ColorImage.src = "assets/" + COLORS.WHITE + ".png";
                colorPicked = true;
                oppositeColorIndex = 6;
                break;
            case "yellow":
                playerOneColor = COLORS.YELLOW;
                player1ColorImage.src = "assets/" + COLORS.YELLOW + ".png";
                colorPicked = true;
                oppositeColorIndex = 7;
                break;
            default:
                playerOneColor = COLORS.BLACK;
                break;
        }
        if (colorPicked) {
            player2ColorPicker.children[oppositeColorIndex].style.display = "none";
            console.log(player2ColorPicker.children[oppositeColorIndex])
            break;
        }
    }
});

//Player 2 color picker
player2ColorPicker.addEventListener("click", evt => {
    let elementList = evt.composedPath();
    let colorPicked = false;
    let oppositeColorIndex = -1;
    for (let opposite = 0; opposite < player1ColorPicker.children.length; opposite++) {
        player1ColorPicker.children[opposite].style.display = "flex";
    }
    for (let elementI = 0; elementI < 3; elementI++) {
        //elementList[i].classList.contains
        switch (elementList[elementI].classList[0]) {
            case "black":
                playerTwoColor = COLORS.BLACK;
                player2ColorImage.src = "assets/" + COLORS.BLACK + ".png";
                colorPicked = true;
                oppositeColorIndex = 0;
                break;
            case "blue":
                playerTwoColor = COLORS.BLUE;
                player2ColorImage.src = "assets/" + COLORS.BLUE + ".png";
                colorPicked = true;
                oppositeColorIndex = 1;
                break;
            case "green":
                playerTwoColor = COLORS.GREEN;
                player2ColorImage.src = "assets/" + COLORS.GREEN + ".png";
                colorPicked = true;
                oppositeColorIndex = 2;
                break;
            case "orange":
                playerTwoColor = COLORS.ORANGE;
                player2ColorImage.src = "assets/" + COLORS.ORANGE + ".png";
                colorPicked = true;
                oppositeColorIndex = 3;
                break;
            case "purple":
                playerTwoColor = COLORS.PURPLE;
                player2ColorImage.src = "assets/" + COLORS.PURPLE + ".png";
                colorPicked = true;
                oppositeColorIndex = 4;
                break;
            case "red":
                playerTwoColor = COLORS.RED;
                player2ColorImage.src = "assets/" + COLORS.RED + ".png";
                colorPicked = true;
                oppositeColorIndex = 5;
                break;
            case "white":
                playerTwoColor = COLORS.WHITE;
                player2ColorImage.src = "assets/" + COLORS.WHITE + ".png";
                colorPicked = true;
                oppositeColorIndex = 6;
                break;
            case "yellow":
                playerTwoColor = COLORS.YELLOW;
                player2ColorImage.src = "assets/" + COLORS.YELLOW + ".png";
                colorPicked = true;
                oppositeColorIndex = 7;
                break;
            default:
                playerTwoColor = COLORS.BLACK;
                break;
        }
        if (colorPicked) {
            player1ColorPicker.children[oppositeColorIndex].style.display = "none";
            console.log(player1ColorPicker.children[oppositeColorIndex])
            break;
        }
    }
});

resetButton.addEventListener("click", evt => {
    generateBoard();
    renderBoard();
})

player1Name.addEventListener("focusout", evt => {
    playerOneName = player1Name.value;
})
player2Name.addEventListener("focusout", evt => {
    playerTwoName = player2Name.value;
})

generateBoard();
