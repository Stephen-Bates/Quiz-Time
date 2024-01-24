// Key to localstorage to access highscore data
const highscoreKey = 'highscores';
// Duration of the quiz in seconds
const quizDuration = 60;
// Pool of potential questions to be asked
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

var quizTimer;
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
        scoreName.classList.add('highscore-item-name');
        scoreValue.classList.add('highscore-item-value');
        
        scoreItem.classList.add('highscore-item');
        scoreItem.appendChild(scoreName);
        scoreItem.appendChild(scoreValue);

        scoreItems.push(scoreItem);
    }
    document.querySelector('#highscore-list').replaceChildren(...scoreItems);
}

function updateTimer(duration, elapsedTime){
    document.querySelector('#timer').innerHTML = (duration - elapsedTime / 100).toPrecision(3);        
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
        startQuiz();
    })
    document.querySelector('#main-action-section').replaceChildren(button);
}

function startQuiz(){
    quizTimer = startTimer(quizDuration, 10, updateTimer, endQuiz);
    var unaskedQuestions = [...questions]
    nextQuestion(unaskedQuestions);
}

function nextQuestion(unaskedQuestions){
    // Select a random question from the questions that haven't been asked this round
    question = unaskedQuestions[Math.floor(Math.random(unaskedQuestions.length))];
    // Render the question to the screen
    document.querySelector('#main-text-section').innerHTML = question.question;
    // Create the list that will hold the anwsers
    var anwserList = document.createElement('ol');
    anwserList.setAttribute('id', 'anwser-list');
    // Create the items that represent the anwsers and add them to the list
    for (const anwserIndex in question.anwsers) {
        var anwserItem = document.createElement('button');
        anwserItem.innerHTML = question.anwsers[anwserIndex];

        if(anwserIndex == question.correct){
            // Correct anwsers
            
        } else {
            // Incorrect anwsers
            anwserItem.addEventListener('click', function(){
                anwserItem.classList.add('wrong-anwser');
                
                document.querySelector('#main-action-section').appendChild(document.createElement('hr'));
            })
        }
        anwserList.appendChild(anwserItem);
    }
    document.querySelector('#main-action-section').replaceChildren(anwserList);
}

function endQuiz(){
    clearInterval(quizTimer);

}
// Duration in seconds
function startTimer(duration, stepInterval, stepCallback = null, delayedCallback = null){
    var timeElapsed = 0;
    var timerInterval = setInterval(function() {
        timeElapsed ++;
        // Call this function each step
        if(stepCallback !== null){
            // Passes information about the timer
            stepCallback(duration, timeElapsed);
        }
        if(timeElapsed >= duration * 100) {
            // Stops execution of action at set interval
            clearInterval(timerInterval);
            
            // Call this function on last step
            if(delayedCallback !== null){
                delayedCallback();
            }
        }
    
      }, stepInterval);
      return timerInterval;
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