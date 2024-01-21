// Key to localstorage to access highscore data
const highscoreKey = 'highscores';

// List of recorded highscores
var highscores = [];

// Create <header> element and its children
function createHeader(){
    var header = document.createElement('header');
    var highscoreTable = document.createElement('div');
    var highscoreList = document.createElement('ol');

    highscoreTable.innerHTML = "Highscore Table";
    highscoreTable.setAttribute('id','highscore-table');

    highscoreList.setAttribute('id','highscore-list');
    
    highscoreTable.appendChild(highscoreList);
    header.appendChild(highscoreTable);
    document.body.appendChild(header);
}

// Create <main> element and its children
function createBody(){

}

// Load highscore data from local storage and save it to highscores variable
function loadHighscores(){
    highscores = [];
    storedScores = JSON.parse(localStorage.getItem(highscoreKey));

    if(storedScores !== null){
        highscores.push(...storedScores);
    }
}

// Save highscores variable to local storage
function saveHighscores(){
    localStorage.setItem(highscoreKey, JSON.stringify(highscores));
}

function init(){
    loadHighscores();
    
    createHeader();
}

init()