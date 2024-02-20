var currentQuestionIndex = 0;
var score = 0;
var questions = [];

// Function to fetch quiz questions from API
function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
        .then(response => response.json())
        .then(data => {
            questions = data.results.map(result => {
                return {
                    question: result.question,
                    choices: result.incorrect_answers.concat(result.correct_answer),
                    correctAnswer: result.correct_answer
                };
            });
            console.log(questions);
            displayQuestion();
            document.getElementById('restartButton').style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

// Function to display current question
function displayQuestion() {
    var questionElement = document.getElementById('question');
    var choicesElement = document.getElementById('choices');
    var currentQuestion = questions[currentQuestionIndex];
    // console.log(currentQuestion);
    questionElement.textContent = currentQuestion.question;
    choicesElement.innerHTML = '';

    currentQuestion.choices.forEach((choice, index) => {
        var button = document.createElement('button');
        button.textContent = choice;
        button.onclick = function() {
            checkAnswer(index);
        };
        choicesElement.appendChild(button);
    });
}

// Function to check the answer
function checkAnswer(selectedIndex) {
    var currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.choices[selectedIndex] === currentQuestion.correctAnswer) {
        score++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// Function to end the quiz
function endQuiz() {
    var quizElement = document.getElementById('quiz');
    var resultMessage = '';
    if (score >= 3) {
        resultMessage = `<div class="pass"><h2>Pass!</h2><div>`;
    } else {
        resultMessage = `<div class="fail"><h2>Fail!</h2><div>`;
    }
    quizElement.innerHTML = resultMessage +
                            '<p>Your Score: ' + score + ' out of ' + questions.length + '</p>';
    var scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = 'Final Score: ' + score;
    }
    var restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.style.display = 'block';
    }
}

// Function to restart the quiz
function restartQuiz() {
    var quizElement = document.getElementById('quiz');
    quizElement.innerHTML = `<div id="question"></div>
    <div id="choices"></div>`;
    currentQuestionIndex = 0;
    score = 0;
    fetchQuestions();
    var restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.style.display = 'none';
    }
}

// Fetch questions from API and start the quiz
fetchQuestions();
