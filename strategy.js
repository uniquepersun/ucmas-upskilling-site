
document.getElementById('submit-answer').addEventListener('click', function() {
    const userAnswer = parseInt(document.getElementById('user-answer').value);
    const feedbackMessage = document.getElementById('feedback-message');
    const correctAnswer = parseInt(document.getElementById('problem-display').getAttribute('data-answer'));

    if (isNaN(userAnswer)) {
        feedbackMessage.textContent = "can't you provide a valid number!";
    } else if (userAnswer === correctAnswer) {
        feedbackMessage.textContent = "correct!";
    } else {
        feedbackMessage.textContent = "incorrect, try again!";
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
