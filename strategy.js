let score = 0;
let timer;
let timeLeft = 50;
let timerStarted = false;
let difficulty = 'easy';

document.getElementById('user-answer').addEventListener('focus', function() {
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }
});

document.getElementById('submit-answer').addEventListener('click', submitAnswer);
document.getElementById('user-answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        submitAnswer();
    }
});

function startTimer() {
    const timerDisplay = document.getElementById('timer-display');
    timerDisplay.textContent = `Time left: ${timeLeft}s`;

    timer = setInterval(function() {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`Time is up! Your final score: ${score}`);
            resetGame();
        }
    }, 1000);
}

function submitAnswer() {
    const userAnswer = parseInt(document.getElementById('user-answer').value);
    const feedbackMessage = document.getElementById('feedback-message');
    const correctAnswer = parseInt(document.getElementById('problem-display').getAttribute('data-answer'));

    if (isNaN(userAnswer)) {
        feedbackMessage.textContent = "Noope!, that's empty, it'll be considered as wrong";
    } else if (userAnswer === correctAnswer) {
        score++;
        feedbackMessage.textContent = `correct! Your score: ${score}`;
    } else {
        feedbackMessage.textContent = `incorrect! Your score: ${score}`;
    }

    document.getElementById('user-answer').value = '';

    generateProblem();
}

function generateProblem() {
    const difficulty = document.getElementById('difficulty').value;
    let num1, num2;
    
    switch (difficulty) {
        case 'easy':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            break;
        case 'medium':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            break;
        case 'hard':
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 100) + 1;
            break;
    }

    const operation = Math.floor(Math.random() * 4);
    let problemText = '';
    let correctAnswer;

    switch (operation) {
        case 0:
            problemText = `${num1} + ${num2} = ?`;
            correctAnswer = num1 + num2;
            break;
            case 1:
            if (num1 < num2) {
                [num1, num2] = [num2, num1];
            }
            problemText = `${num1} - ${num2} = ?`;
            correctAnswer = num1 - num2;
            break;
        case 2:
            problemText = `${num1} × ${num2} = ?`;
            correctAnswer = num1 * num2;
            break;
        case 3:
            problemText = `${num1 * num2} ÷ ${num1} = ?`;
            correctAnswer = num2;
            break;
    }

    const problemDisplay = document.getElementById('problem-display');
    problemDisplay.textContent = problemText;
    problemDisplay.setAttribute('data-answer', correctAnswer);
}

function resetGame() {
    score = 0;
    timeLeft = 50;
    timerStarted = false;
    generateProblem();
    document.getElementById('feedback-message').textContent = '';
    document.getElementById('user-answer').value = '';
    document.getElementById('timer-display').textContent = `Time left: ${timeLeft}s`;
    document.getElementById('difficulty-easy').addEventListener('click', function() {
        difficulty = 'easy';
        resetGame();
    });
    
    document.getElementById('difficulty-medium').addEventListener('click', function() {
        difficulty = 'medium';
        resetGame();
    });
    
    document.getElementById('difficulty-hard').addEventListener('click', function() {
        difficulty = 'hard';
        resetGame();
    });
}
generateProblem();


