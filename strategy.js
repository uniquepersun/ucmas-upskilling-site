let score = 0;
let timer;
let timeLeft = 60; // time for each round
let timerStarted = false;

document.getElementById('user-answer').addEventListener('focus', function() {
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }
});

document.getElementById('submit-answer').addEventListener('click', function() {
    const userAnswer = parseInt(document.getElementById('user-answer').value);
    const feedbackMessage = document.getElementById('feedback-message');
    const correctAnswer = parseInt(document.getElementById('problem-display').getAttribute('data-answer'));

    if (isNaN(userAnswer)) {
        feedbackMessage.textContent = "can't you provide a valid number!";
    } else if (userAnswer === correctAnswer) {
        score++;
        feedbackMessage.textContent = `correct! Your score: ${score}`;
    } else {
        feedbackMessage.textContent = `incorrect! Your score: ${score}`;
    }

    generateProblem();
});

function generateProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const problemDisplay = document.getElementById('problem-display');
    const correctAnswer = num1 + num2;

    problemDisplay.textContent = `${num1} + ${num2} = ?`;
    problemDisplay.setAttribute('data-answer', correctAnswer);
}

function startTimer() {
    const timerDisplay = document.getElementById('timer-display');
    timer = setInterval(function() {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`time is already out of your hands! Your final score: ${score}`);
            resetGame();
        }
    }, 1000);
}

function resetGame() {
    score = 0;
    timeLeft = 60;
    timerStarted = false;
    generateProblem();
    document.getElementById('feedback-message').textContent = '';
}

generateProblem();


