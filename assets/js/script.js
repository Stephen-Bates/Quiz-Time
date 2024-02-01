// Define HTML elements to be referenced
var headerEl = document.querySelector('header');
var highscoreTable = document.querySelector('#highscore-table');
var timerEl = document.querySelector('#timer');

var mainEl = document.querySelector('main');

// Key to localstorage to access highscore data
const highscoreKey = 'highscores';
// List of recorded highscores
var highscores = [];
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
        correctIndex: 3,
        tip: "I don't Know"
    },
    {
        question: "Say what? Again",
        anwsers: [
            "This, again",
            "That, again",
            "The other, again",
            "All of the above, again"
        ],
        correctIndex: 3,
        tip: "I don't know, again"
    },
]
// Pool of questions not yet asked for current quiz
var unaskedQuestions = [];
var currentQuestion;
// Reference for interval and timeout used
var quizInterval;
var questionTimeout;

// Create elements for the highscore table
function updateHighscoreTable(){
    var tableHeader = document.createElement('tr');
    var nameHeader = document.createElement('th');
    nameHeader.innerHTML = "Name";
    tableHeader.appendChild(nameHeader);
    var scoreHeader = document.createElement('th');
    scoreHeader.innerHTML = "Score";
    tableHeader.appendChild(scoreHeader);

    highscoreTable.replaceChildren(tableHeader);

    for (const score of highscores) {
        var scoreItem = document.createElement('tr');

        var scoreName = document.createElement('td');
        scoreName.innerHTML = score.name;

        var scoreValue = document.createElement('td');
        scoreValue.innerHTML = score.value;

        scoreItem.appendChild(scoreName);
        scoreItem.appendChild(scoreValue);

        highscoreTable.appendChild(scoreItem);
    }
}

function updateTimer(){
    // Reduce time remaining each step
    timerEl.dataset.timeRemaining--;
    // Set timer html to render time remaining to screen (divide by 10 to convert back to full seconds)
    timerEl.innerHTML = timerEl.dataset.timeRemaining / 10;
    // If no more time remains
    if (timerEl.dataset.timeRemaining <= 0){
        // End the quiz
        endQuiz()
    }
}

// Set up main intro scene
function introScene(){
    // Introduce user and give brief explination
    var text = document.createElement('h2');
    text.innerHTML = "Welcome to Quiz Time<br>Click the button to start!";
    // Add button to start the quiz
    var button = document.createElement('button');
    button.innerHTML = "Start";
    button.addEventListener('click', function(){
        startQuiz();
    })
    // Clear action section and set up for intro
    return [text,button];
}

function startQuiz(){
    // Set timer data to quiz duration (multiply by 10 for tenths of a second)
    timerEl.dataset.timeRemaining = quizDuration * 10;
    // Start an interval to update quiz timer every milliseconds
    quizInterval = setInterval(function() {updateTimer();},100);
    // Add all available questions to unasked list
    unaskedQuestions = [...questions];
    
    // TODO; implement check to make sure there were questions to start off with
    // Prio; Low

    // Begin asking questions
    mainEl.replaceChildren(...nextQuestion());
}

function nextQuestion(){
    // Select a random question from the questions that haven't been asked this round
    currentQuestion = unaskedQuestions[Math.floor(Math.random(unaskedQuestions.length))];
    // Remove selected question from unasked list of questions
    unaskedQuestions.splice(unaskedQuestions.indexOf(currentQuestion), 1);
    // Render the question to the screen
    var text = document.createElement('h2');
    text.innerHTML = currentQuestion.question;
    // Create the list that will hold the anwsers
    var buttonList = document.createElement('ol');
    // Create the buttons that represent the anwsers and add them to the list
    for (const anwserIndex in currentQuestion.anwsers) {
        var anwserItem = document.createElement('button');
        anwserItem.classList.add('anwser-button');
        anwserItem.innerHTML = currentQuestion.anwsers[anwserIndex];
        anwserItem.dataset.index = anwserIndex;

        // Create event listeners for the buttons
        anwserItem.addEventListener('click', evaluateAnwser);
    
        buttonList.appendChild(anwserItem);
    }
    return [text, buttonList];
}

function evaluateAnwser(event){
    // For each button in the list of the target button
    for (child of event.target.parentElement.children){
        // Disable functionality
        child.disabled = true;
    }
    
    // Evaluate if anwser was correct and act accordingly
    if (event.target.dataset.index == currentQuestion.correctIndex){
        event.target.classList.add('correct-anwser');
    } else {
        event.target.classList.add('incorrect-anwser');
        // Add break to end of <main>
        mainEl.appendChild(document.createElement('hr'));
        // Add tip for correct anwser to end of <main>
        var tip = document.createElement('p');
        tip.innerHTML = currentQuestion.tip;
        tip.classList.add('tip');
        mainEl.appendChild(tip);
        // Deduct 10 seconds (100 tenths of a second)
        timerEl.dataset.timeRemaining -= 100;
        updateTimer();
    }
    // Pause quiz timer for 2 seconds to let user see result
    clearInterval(quizInterval)
    questionTimeout = setTimeout(function(){
        // If there are no more questions to ask
        if(unaskedQuestions.length === 0){
            // End quiz
            mainEl.replaceChildren(...endQuiz());
            // Exit function early
            return;
        }
        // Restart quiz timer
        quizInterval = setInterval(function() {updateTimer();},100);
        // Set next question
        mainEl.replaceChildren(...nextQuestion());
    }, 2000);
}

function endQuiz(){
    // Calculate user score
    var score = timerEl.dataset.timeRemaining * 10;
    
    // Tell user the results
    var text = document.createElement('p');
    text.innerHTML = `That's the end of the quiz<br>Your final score was: ${score}`;

    // Create form to submit new highscore
    var submissionForm = document.createElement('form');

    // Create form input field for user name
    var nameField = document.createElement('input');
    nameField.setAttribute('type', 'text');
    nameField.setAttribute('id', 'name-field');
    nameField.setAttribute('placeholder', 'Enter your name');
    
    // Create form submission button
    var submitButton = document.createElement('button');
    submitButton.innerHTML = 'Submit Highscore';
    submitButton.setAttribute('data-score', score);
    submissionForm.append(nameField);
    submissionForm.append(submitButton);

    // Submit new highscore to table
    submissionForm.addEventListener('submit', (event) => {
        // Prevent default submit function
        event.preventDefault();

        // Create highscore prototype from form
        var highscore = {
            name: nameField.value,
            value: score
        }
    
        // Define index to insert new highscore
        var index = 0
        // Increment index until new highscore is higher than indexed score
        for (const score of highscores) {
            if (highscore.value <= score.value){
                index++;
            }
        }
        // Insert new highscore at index
        highscores.splice(index,0,highscore);

        // Save highscores to local storage
        saveHighscores();
        // Update highscore table
        updateHighscoreTable();
        // Return to intro scene
        mainEl.replaceChildren(...introScene());
        })
        return [text, submissionForm]
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
    // Load highscores stored in local storage
    loadHighscores();

    // Set <main> element to intro scene
    mainEl.replaceChildren(...introScene());
}

init()
