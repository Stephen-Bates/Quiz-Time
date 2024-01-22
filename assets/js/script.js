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

function updateHighscoreTable(){
    var scoreItems = [];
    for (const score of highscores) {
        var scoreItem = document.createElement('li');
        var scoreName = document.createElement('div');
        var scoreValue = document.createElement('div');

        scoreName.innerHTML = score.name;
        scoreValue.innerHTML = score.value;

        scoreItem.setAttribute('class', 'highscore-item');
        scoreItem.appendChild(scoreName);
        scoreItem.appendChild(scoreValue);

        scoreItems.push(scoreItem);
    }
    document.querySelector('#highscore-list').replaceChildren(...scoreItems);
}
// Create <main> element and its children
function createBody(){

}

// Add a new highscore to the list
function addHighscore(newName, newValue){
    var highscore = {
        name: newName,
        value: newValue
    }

    var index = 0
    for (const score of highscores) {
        if (highscore.value <= score.value){
            index++;
        }
    }
    highscores.splice(index,0,highscore);
    
    saveHighscores();
    updateHighscoreTable();
}

// Load highscore data from local storage and save it to highscores variable
function loadHighscores(){
    highscores = [];
    storedScores = JSON.parse(localStorage.getItem(highscoreKey));

    if(storedScores !== null){
        highscores.push(...storedScores);
    }
    updateHighscoreTable();
}

// Save highscores variable to local storage
function saveHighscores(){
    localStorage.setItem(highscoreKey, JSON.stringify(highscores));
}

function init(){
    createHeader();
    loadHighscores();
    
}

init()