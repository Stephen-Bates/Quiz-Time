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
    {
        question: "Say what? Again",
        anwsers: [
            "This, again",
            "That, again",
            "The other, again",
            "All of the above, again"
        ],
        correct: 3
    },
]
var unaskedQuestions = [];

// List of recorded highscores
var highscores = [];

var quizTimers = [];
// Create <header> element and its children
function createHeader(){
    var header = document.createElement('header');
    var highscoreTable = document.createElement('section');
    var highscoreList = document.createElement('ol');
    var timerSection = document.createElement('div');

    highscoreTable.setAttribute('id','highscore-table');
    highscoreTable.innerHTML = "Highscore Table";
    highscoreList.setAttribute('id','highscore-list');
    
    timerSection.setAttribute('id', 'quiz-timer');

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
    document.querySelector('#quiz-timer').innerHTML = (duration - elapsedTime / 100).toPrecision(3);        
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
    quizTimers.push(startTimer(quizDuration, 10, updateTimer, endQuiz));
    unaskedQuestions = [...questions];
    nextQuestion();
}

function nextQuestion(){
    // End the quiz if there are no unasked questions
    if( unaskedQuestions.length == 0){
        endQuiz();
        return;
    }
    // Otherwise,
    // Select a random question from the questions that haven't been asked this round
    
    var question = unaskedQuestions[Math.floor(Math.random(unaskedQuestions.length))];
    unaskedQuestions.splice(unaskedQuestions.indexOf(question), 1);
    console.log(unaskedQuestions);
    // Render the question to the screen
    document.querySelector('#main-text-section').innerHTML = question.question;
    // Create the list that will hold the anwsers
    var anwserList = document.createElement('ol');
    anwserList.setAttribute('id', 'anwser-list');
    // Create the items that represent the anwsers and add them to the list
    for (const anwserIndex in question.anwsers) {
        var anwserItem = document.createElement('button');
        anwserItem.classList.add('anwser-item');
        anwserItem.innerHTML = question.anwsers[anwserIndex];

        // Create event listeners for the buttons
        anwserItem.addEventListener('click', function(event){
            // Disable the buttons to prevent multiple inputs
            for(item of document.querySelectorAll('.anwser-item')){
                item.disabled = true;
            }
            // Correct anwsers
            if(anwserIndex == question.correct){
                // Style the button to show correct anwser
                event.target.classList.add('right-anwser');
            } 
            // Incorrect anwsers
            else {
                // Style the button to show incorrect anwser
                event.target.classList.add('wrong-anwser');
                // Create a snippet to inform user what the correct anwser was
                var correction = document.createElement('p');
                correction.classList.add('correction');
                correction.innerHTML = "wrongo bucko";
                // Add the snippet to the end of the action section
                document.querySelector('#main-action-section').appendChild(document.createElement('hr'));
                document.querySelector('#main-action-section').appendChild(correction);
            }
            // Start a time interval to wait and let user view the outcome, then move to the next question
            quizTimers.push(startTimer(1,1000,null,nextQuestion));
        })
        anwserList.appendChild(anwserItem);
    }
    document.querySelector('#main-action-section').replaceChildren(anwserList);
}

function endQuiz(){
    console.log('ending quiz');
    clearInterval(...quizTimers);
    var score = document.querySelector('#quiz-timer').innerHTML;
    document.querySelector('#main-text-section').innerHTML = `That's the end of the quiz<br>Your final score was: ${score}`;

    var submissionForm = document.createElement('form');

    var nameField = document.createElement('input');
    nameField.setAttribute('type', 'text');
    nameField.setAttribute('id', 'name-field');
    nameField.setAttribute('placeholder', 'Enter your name');
    
    var submitButton = document.createElement('button');
    submitButton.innerHTML = 'Submit Highscore';
    submitButton.setAttribute('data-score', score);
    submissionForm.append(nameField);
    submissionForm.append(submitButton);
    submissionForm.addEventListener('submit', addHighscore);
    
    document.querySelector('#main-action-section').replaceChildren(submissionForm);
}
// Duration in seconds
function startTimer(duration, stepInterval, stepCallback = null, delayedCallback = null){
    var stepsElapsed = 0;
    var timerInterval = setInterval(function() {
        stepsElapsed ++;
        // Call this function each step
        if(stepCallback !== null){
            // Passes information about the timer
            stepCallback(duration, stepsElapsed);
        }
        if(stepsElapsed / (1000/stepInterval) >= duration) {
            // Stops execution of action at set interval
            clearInterval(timerInterval);
            console.log(delayedCallback);
        
            // Call this function on last step
            if(delayedCallback !== null){
                delayedCallback();
            }
        }
    
      }, stepInterval);
      return timerInterval;
}

// Add a new highscore to the list
function addHighscore(event){
    event.preventDefault();

    var highscore = {
        name: event.target[0].value,
        value: event.target[1].dataset.score
    }
    console.log(highscore);
    
    var index = 0
    for (const score of highscores) {
        if (highscore.value <= score.value){
            index++;
        }
    }
    highscores.splice(index,0,highscore);
    
    saveHighscores();
    updateHighscoreTable();
    mainIntro();
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
    console.log('init');
    createHeader();
    createBody();

    loadHighscores();
    mainIntro();
}

init()