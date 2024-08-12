let score = 0;
let timer;
let timeLeft = 50;
let timerStarted = false;
let difficulty = 'easy';
let skippedProblems = 0;
let streak = 0;
let maxStreak = 0;

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
    const answerField = document.getElementById('user-answer');
    const correctAnswer = parseInt(document.getElementById('problem-display').getAttribute('data-answer'));

    if (userAnswer === '') {
        streak = 0;
        skipProblem()
    } else {
        const userAnswerNumber = parseInt(userAnswer);
        
        if (isNaN(userAnswerNumber)) {
            skippedProblems++
            feedbackMessage.textContent = "Noope!, that's an invalid answer, it'll be considered as wrong";
            document.getElementById('skipped-count').textContent = `Skipped problems: ${skippedProblems}`;
            answerField.classList.add('incorrect');
        } else if (userAnswerNumber === correctAnswer) {
            score++;
            streak++;
            if (streak > maxStreak) {
                maxStreak = streak;
            }
            if (score > parseInt(localStorage.getItem('highScore') || 0)) {
                localStorage.setItem('highScore', score);
            }
            if (maxStreak > parseInt(localStorage.getItem('maxStreak') || 0)) {
                localStorage.setItem('maxStreak', maxStreak);
            }
            feedbackMessage.textContent = `Correct! Your score: ${score} (Streak: ${streak})`;
            answerField.classList.add('correct');
            answerField.classList.add('correct');
        } else {
            feedbackMessage.textContent = `Incorrect! Your score: ${score}`;
            answerField.classList.add('incorrect');
        }

        setTimeout(function() {
            answerField.classList.remove('correct');
            answerField.classList.remove('incorrect');
        }, 250);
    }
    document.getElementById('user-answer').value = '';

    generateProblem();
}

function skipProblem() {
    skippedProblems++;
    feedbackMessage.textContent = `I see you skipped that. I'll increment skipped problems counter: ${skippedProblems}`;
    document.getElementById('skipped-count').textContent = `Skipped problems: ${skippedProblems}`;
    generateProblem();
}

function generateProblem() {
    if (streak >= 10 && difficulty === 'easy') {
        difficulty = 'medium';
        document.getElementById('difficulty-indicator').textContent = 'Current Difficulty: Medium';
        document.getElementById('difficulty-indicator').style.color = 'orange';
    } else if (streak >= 20 && difficulty === 'medium') {
        difficulty = 'hard';
        document.getElementById('difficulty-indicator').textContent = 'Current Difficulty: Hard';
        document.getElementById('difficulty-indicator').style.color = 'red';
    }

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
            if (num2 === 0) {
                num2 = 1;
                division
            }
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
    streak = 0;
    maxStreak = 0;
    skippedProblems = 0;
    timeLeft = 50;
    timerStarted = false;
    generateProblem();
    document.getElementById('feedback-message').textContent = '';
    document.getElementById('user-answer').value = '';
    document.getElementById('timer-display').textContent = `Time left: ${timeLeft}s`;
    document.getElementById('skipped-count').textContent = `Skipped problems: ${skippedProblems}`;
    let highScore = localStorage.getItem('highScore') || 0;
    let maxStreak = localStorage.getItem('maxStreak') || 0;
    document.getElementById('feedback-message').textContent = `High Score: ${highScore}, Max Streak: ${maxStreak}`;
}

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
generateProblem();


