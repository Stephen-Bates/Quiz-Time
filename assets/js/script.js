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
        question: "Variables can be declared using what keyword?",
        anwsers: [
            "let",
            "var",
            "all of the above",
            "none of the above"            
        ],
        correctIndex: 2,
        tip: "let or var can be used to declare variables."
    },
    {
        question: "How are variables declared using the keyword let different than variables declared with the keyword var?",
        anwsers: [
            "processing speed",
            "variable scope rules",
            "variable type rules",
            "no difference"
        ],
        correctIndex: 1,
        tip: "variables declared with the keyword let do not persist outside of an enclosing block {}, while variables declared with var do."
    },
    {
        question: "The acronym DOM stands for _____",
        anwsers: [
            "Determined Over Messenger",
            "Dataset Online Matrix",
            "Document Object Model",
            "DOM"
        ],
        correctIndex: 2,
        tip: "The top level of the DOM is the document, which holds the rest of the HTML objects under it."
    },
    {
        question: "Which of the following HTML attributes aren't applicable to all HTML elements",
        anwsers: [
            "data",
            "id",
            "class",
            "none of the above"
        ],
        correctIndex: 3,
        tip: "the id, class, and data attributes help CSS and Javascript documents traverse the DOM and extract information"
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
    highscoreTable.querySelector('tbody').replaceChildren();    
    for (const score of highscores) {
        var scoreItem = document.createElement('tr');

        var scoreName = document.createElement('td');
        scoreName.innerHTML = score.name;

        var scoreValue = document.createElement('td');
        scoreValue.innerHTML = score.value;

        scoreItem.appendChild(scoreName);
        scoreItem.appendChild(scoreValue);
        highscoreTable.querySelector('tbody').appendChild(scoreItem);
    }
}
// Update timer to reflect time remaining in quiz
function updateTimer(){
    // Reduce time remaining each step
    timerEl.dataset.timeRemaining--;
    // Set timer html to render time remaining to screen (divide by 10 to convert back to full seconds)
    timerEl.innerHTML = timerEl.dataset.timeRemaining / 10;

    // Calculate the percent of time remaining and set a transparent backgorund color based on time left
    // Color becomes more opaque the closer time remaining comes to 0
    var percentLeft = (timerEl.dataset.timeRemaining / 10) / quizDuration;
    var alphaVal = (255 - Math.round(percentLeft * 255)).toString(16).padStart(2,'0');
    timerEl.style.background = "#ff0000" + alphaVal;

    // If no more time remains
    if (timerEl.dataset.timeRemaining <= 0){
        // End the quiz
        clearInterval(quizInterval);
        clearTimeout(questionTimeout);
        mainEl.replaceChildren(...resultsScene());
    }
}
// Return elements for a main intro scene
function introScene(){
    // Introduce user and give brief explination
    var text = document.createElement('h2');
    text.classList.add('panel');
    text.innerHTML = "Welcome to Quiz Time<br>Click the button to start!";
    // Add button to start the quiz
    var button = document.createElement('button');
    button.classList.add('action');
    
    button.innerHTML = "Start";
    button.addEventListener('click', function(){
        startQuiz();
    })

    // Clear timer to stop rendering any leftover from previous quiz
    timerEl.innerHTML = '';
    timerEl.style.background = "";
    // Clear action section and set up for intro
    return [text,button];
}
// Start running the quiz
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
    mainEl.replaceChildren(...questionScene());
}
// Return elements for a question scene
function questionScene(){
    // Select a random question from the questions that haven't been asked this round
    currentQuestion = unaskedQuestions[Math.floor(Math.random(unaskedQuestions.length))];
    // Remove selected question from unasked list of questions
    unaskedQuestions.splice(unaskedQuestions.indexOf(currentQuestion), 1);
    // Render the question to the screen
    var text = document.createElement('h2');
    text.classList.add('panel');
    text.innerHTML = currentQuestion.question;
    // Create the list that will hold the anwsers
    var itemList = document.createElement('ol');
    itemList.classList.add('panel');
    itemList.setAttribute('id', 'anwser-list');

    // Create the buttons that represent the anwsers and add them to the list
    for (const anwserIndex in currentQuestion.anwsers) {
        var anwserItem = document.createElement('li');
        var anwserButton = document.createElement('button');
        anwserButton.classList.add('anwser-button');
        anwserButton.classList.add('action');
        anwserButton.innerHTML = currentQuestion.anwsers[anwserIndex];
        anwserButton.dataset.index = anwserIndex;

        // Create event listeners for the buttons
        anwserButton.addEventListener('click', evaluateAnwser);
        
        anwserItem.appendChild(anwserButton);
        itemList.appendChild(anwserItem);
    }
    return [text, itemList];
}
// Check if the anwser selected was correct or not
function evaluateAnwser(event){
    // For each button in the list of the target button
    for (child of document.querySelector('#anwser-list').children){
        // Disable functionality
        console.log(child.children[0]);
        child.children[0].disabled = true;
    }
    
    // Evaluate if anwser was correct and act accordingly
    if (event.target.dataset.index == currentQuestion.correctIndex){
        event.target.classList.add('correct-anwser');
    } else {
        event.target.classList.add('incorrect-anwser');
        // Add tip for correct anwser to end of <main>
        var tip = document.createElement('p');
        tip.innerHTML = currentQuestion.tip;
        tip.classList.add('panel');
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
            mainEl.replaceChildren(...resultsScene());
            // Exit function early
            return;
        }
        // Restart quiz timer
        quizInterval = setInterval(function() {updateTimer();},100);
        // Set next question
        mainEl.replaceChildren(...questionScene());
    }, 2000);
}
// Return elements for a results scene
function resultsScene(){
    // Calculate user score
    var score = timerEl.dataset.timeRemaining * 10;
    
    // Tell user the results
    var text = document.createElement('h2');
    text.classList.add('panel');
    text.innerHTML = `That's the end of the quiz<br>Your final score was: ${score}`;
    
    // Create form to submit new highscore
    var submissionForm = document.createElement('form');
    submissionForm.classList.add('panel');

    // Create form input field for user name
    var nameField = document.createElement('input');
    nameField.setAttribute('type', 'text');
    nameField.setAttribute('id', 'name-field');
    nameField.setAttribute('placeholder', 'Enter your name');
    
    // Create form submission button
    var submitButton = document.createElement('input');
    submitButton.innerHTML = 'Submit Highscore';
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('data-score', score);
    submitButton.classList.add('action');
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
    });
    // Button to return to start without submitting score
    var cancelButton = document.createElement('button');
    cancelButton.innerHTML = "Cancel";
    cancelButton.classList.add('action');
    
    cancelButton.addEventListener('click', (event) => {
        mainEl.replaceChildren(...introScene());
    });
        return [text, submissionForm, cancelButton];
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
