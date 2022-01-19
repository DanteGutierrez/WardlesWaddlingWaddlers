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
});