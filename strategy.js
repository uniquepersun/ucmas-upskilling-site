const AIRTABLE_PERSONAL_ACCESS_TOKEN = 'patq40RWAi3BzhapZ.d709dde5ca58a0d09303500168a4ed1ea33f52aaaa6e5a15421f163ccad5db0c';
const AIRTABLE_BASE_ID = 'appZArpvJV1rMqzQ6';
const AIRTABLE_TABLE_NAME = 'Table 1';
const airtableApiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
const difficultyThresholds = {
    medium: 20,
    hard: 50,
};

let score = 0;
let timer;
let timeLeft = 30;
let timerStarted = false;
let difficulty = 'easy';
let skippedProblems = 0;
let streak = 0;
let maxStreak = 0;
let playername = '';
let isPracticeMode = false;

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

function initializeGame() {
    playername = prompt('Enter your name:');
    if (playername) {
        document.getElementById('submit-answer').addEventListener('click', () => saveScore(playername, score));
    }   
    const timeSelect = document.getElementById('select-time');
    timeLeft = parseInt(timeSelect.value);
    if (isPracticeMode) {
        document.getElementById('timer-display').textContent = 'Practice Mode: No time limit';
    } else {
        document.getElementById('timer-display').textContent = `Time left: ${timeLeft}s`;
    }
    generateProblem();
    loadLeaderboard();
}

function startTimer() {
    if (isPracticeMode.checked) {
        const timerDisplay = document.getElementById('timer-display')
        timerDisplay.textContent = 'practice mode: you are free to go without time boundation';
        return;
    }
    const timeSelect = document.getElementById('select-time');
    timeLeft = parseInt(timeSelect.value);
    const timerDisplay = document.getElementById('timer-display');
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    timer = setInterval(function() {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`Time is up! Your final score: ${score}`);
            saveScore(playername, score);
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

function saveScore(name, score) {
    fetch(`${airtableApiUrl}?filterByFormula={Name}='${name}'`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    .then(data => {
        if (data.records.length > 0) {
            const record = data.records[0];
            const existingScore = record.fields.Score;
            const recordId = record.id;
            
            if (score > existingScore) {
                updateScore(recordId, score);
            } else {
                console.log('New score is not higher than the existing score. No update performed.');
            }
        } else {
            createScore(name, score);
        }
    })
    .catch(error => console.error('Error:', error));
}

function createScore(name, score) {
    fetch(airtableApiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fields: {
                Name: name,
                Score: score
            }
        })
    }).then(response => response.json())
    .then(data => {
        console.log('Score created:', data);
        loadLeaderboard();
    })
    .catch(error => console.error('Error:', error));
}

function updateScore(recordId, score) {
    fetch(`${airtableApiUrl}/${recordId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fields: {
                Score: score
            }
        })
    }).then(response => response.json())
    .then(data => {
        console.log('Score updated:', data);
        loadLeaderboard();
    })
    .catch(error => console.error('Error:', error));
}


function loadLeaderboard(offset = '') {
    fetch(`${airtableApiUrl}?sort[0][field]=Score&sort[0][direction]=desc&maxRecords=10${offset ? `&offset=${offset}` : ''}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`
        }
    }).then(response => response.json())
    .then(data => {
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.innerHTML = '<h2>Leaderboard</h2><ul>';

        data.records.forEach(record => {
            const { Name, Score } = record.fields;
            leaderboard.innerHTML += `<li>${Name}: ${Score}</li>`;
        });

        leaderboard.innerHTML += '</ul>';

        if (data.offset) {
            leaderboard.innerHTML += '<button id="load-more">Load More</button>';
            document.getElementById('load-more').addEventListener('click', () => loadLeaderboard(data.offset));
            
        }
    })
    .catch(error => console.error('Error:', error));
}

function skipProblem() {
    skippedProblems++;
    feedbackMessage.textContent = `I see you skipped that. I'll increment skipped problems counter: ${skippedProblems}`;
    document.getElementById('skipped-count').textContent = `Skipped problems: ${skippedProblems}`;
    generateProblem();
}

function updateDifficulty(score) {
    const selectedDifficulty = document.getElementById('difficulty').value;

    if (selectedDifficulty === 'auto') {
        if (score >= difficultyThresholds.hard) {
            difficulty = 'hard';
            document.getElementById('difficulty-indicator').textContent = 'Current Difficulty: Hard';
            document.getElementById('difficulty-indicator').style.color = 'red';
        } else if (score >= difficultyThresholds.medium) {
            difficulty = 'medium';
            document.getElementById('difficulty-indicator').textContent = 'Current Difficulty: Medium';
            document.getElementById('difficulty-indicator').style.color = 'orange';
        } else {
            difficulty = 'easy';
            document.getElementById('difficulty-indicator').textContent = 'Current Difficulty: Easy';
            document.getElementById('difficulty-indicator').style.color = 'green';
        }
    } else {
        difficulty = selectedDifficulty;
    }
}

function generateProblem() {
    updateDifficulty(score);

    let num1, num2;

    const allowNegative = document.getElementById('allow-negative').checked;

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
            if (!allowNegative && num1 < num2) {
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
            }
            if (!allowNegative && num1 * num2 < num1) {
                [num1, num2] = [num2, num1];
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
    const timeSelect = document.getElementById('select-time');
    timeLeft = parseInt(timeSelect.value);
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

initializeGame();


