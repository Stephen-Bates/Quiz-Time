// Key to localstorage to access highscore data
const highscoreKey = 'highscores';

const questions = [
    {
        question: "Say what?",
        anwsers: [
            "This",
            "That",
            "The other",
            "All of the above"
        ],
        correct: 3
    },

]

// List of recorded highscores
var highscores = [];

// Create <header> element and its children
function createHeader(){
    var header = document.createElement('header');
    var highscoreTable = document.createElement('section');
    var highscoreList = document.createElement('ol');
    var timerSection = document.createElement('div');

    highscoreTable.setAttribute('id','highscore-table');
    highscoreTable.innerHTML = "Highscore Table";
    highscoreList.setAttribute('id','highscore-list');
    
    timerSection.setAttribute('id', 'timer');

    highscoreTable.appendChild(highscoreList);
    header.appendChild(highscoreTable);
    header.appendChild(timerSection);
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
        scoreName.setAttribute('class', 'highscore-item-name');
        scoreValue.setAttribute('class', 'highscore-item-value');
        
        scoreItem.setAttribute('class', 'highscore-item');
        scoreItem.appendChild(scoreName);
        scoreItem.appendChild(scoreValue);

        scoreItems.push(scoreItem);
    }
    document.querySelector('#highscore-list').replaceChildren(...scoreItems);
}
// Create <main> element and its children
function createBody(){
    var main = document.createElement('main');
    var textSection = document.createElement('section');
    var actionSection = document.createElement('section');
    
    textSection.setAttribute('id','main-text-section');
    actionSection.setAttribute('id','main-action-section');

    main.appendChild(textSection);
    main.appendChild(actionSection);
    document.body.appendChild(main);
}

function mainIntro(){
    var button = document.createElement('button');

    document.querySelector('#main-text-section').innerHTML = "Welcome to Quiz Time<br>Click the button to start!";
    button.innerHTML = "Start";

    button.addEventListener('click', function(){
        startTimer(10, mainIntro);
    })
    document.querySelector('#main-action-section').replaceChildren(button);
}

function startTimer(time, delayedCallback){
    var timeElapsed = 0;
    var timerInterval = setInterval(function() {
        timeElapsed ++;
        document.querySelector('#timer').innerHTML = (time - timeElapsed / 100).toPrecision(3);
        if(timeElapsed >= time * 100) {
            // Stops execution of action at set interval
            clearInterval(timerInterval);

            document.querySelector('#timer').innerHTML = "";

            // Calls function
            if(delayedCallback !== null){
                delayedCallback();
            }
        }
    
      }, 10);
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
    createBody();

    loadHighscores();
    mainIntro();
}

init()