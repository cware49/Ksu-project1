/* ==========================================

   IT 3203 - Web Development Quiz

   JavaScript quiz functionality

   ========================================== */

// Find the quiz elements on the webpage

const quizForm = document.getElementById("quiz-form");

const timerDisplay = document.getElementById("timer");

const resultsDisplay = document.getElementById("quiz-results");

// Quiz settings

const quizDuration = 600; // 10 minutes in seconds

const passingScore = 70;

// Timer variables

let timeRemaining = quizDuration;

let timeStarted = Date.now();

let timerInterval;

let quizSubmitted = false;

// Start the countdown timer

function startTimer() {

    timerInterval = setInterval(function () {

        timeRemaining--;

        let minutes = Math.floor(timeRemaining / 60);

        let seconds = timeRemaining % 60;

        timerDisplay.textContent =

            "Time Remaining: " +

            minutes + ":" +

            String(seconds).padStart(2, "0");

        // Automatically submit when time expires

        if (timeRemaining <= 0) {

            clearInterval(timerInterval);

            submitQuiz();

        }

    }, 1000);

}

// Get a selected multiple-choice answer

function getRadioAnswer(questionName) {

    const selected = document.querySelector(

        'input[name="' + questionName + '"]:checked'

    );

    return selected ? selected.value : "";

}

// Get answers from the multiple-selection question

function getCheckboxAnswers(questionName) {

    const selected = document.querySelectorAll(

        'input[name="' + questionName + '"]:checked'

    );

    return Array.from(selected).map(input => input.value).sort();

}

// Compare two answer arrays

function arraysMatch(userAnswers, correctAnswers) {

    return userAnswers.length === correctAnswers.length &&

        userAnswers.every((answer, index) =>

            answer === correctAnswers[index]

        );

}

// Submit and grade the quiz

function submitQuiz() {

    // Prevent multiple submissions

    if (quizSubmitted) {

        return;

    }

    quizSubmitted = true;

    clearInterval(timerInterval);

    const timeSpent = Math.floor(

        (Date.now() - timeStarted) / 1000

    );

    // Collect all ten answers

    const answers = [

        document.getElementById("q1").value.trim().toLowerCase(),

        document.getElementById("q2").value.trim().toLowerCase(),

        getRadioAnswer("q3"),

        getRadioAnswer("q4"),

        getRadioAnswer("q5"),

        getCheckboxAnswers("q6"),

        getRadioAnswer("q7"),

        getRadioAnswer("q8"),

        getRadioAnswer("q9"),

        getRadioAnswer("q10")

    ];

    // Correct answers

    const correctAnswers = [

        "html",

        "style",

        "JavaScript",

        "color",

        "adapt",

        ["CSS", "HTML", "JavaScript"],

        "False",

        "True",

        "True",

        "True"

    ];

    // Explanations and correct answers

    const explanations = [

        "HTML stands for HyperText Markup Language.",

        "CSS stands for Cascading Style Sheets.",

        "JavaScript adds interactivity to websites.",

        "The color property changes text color.",

        "Responsive design adapts websites to different screen sizes.",

        "HTML, CSS, and JavaScript are common frontend technologies.",

        "HTML is a markup language, not a programming language.",

        "CSS Grid organizes content into rows and columns.",

        "JavaScript can respond to user actions.",

        "Media queries help create responsive websites."

    ];

    let score = 0;

    let resultsHTML = "<h2>Quiz Results</h2>";

    // Grade each question

    for (let i = 0; i < answers.length; i++) {

        let isCorrect;

        if (i === 5) {

            isCorrect = arraysMatch(

                answers[i],

                correctAnswers[i]

            );

        } else if (i === 0) {

            isCorrect = answers[i] === correctAnswers[i];

        } else if (i === 1) {

            isCorrect = ["style", "styles"].includes(answers[i]);

        } else {

            isCorrect = answers[i] === correctAnswers[i];

        }

        if (isCorrect) {

            score++;

        }

        let resultClass = isCorrect ? "correct" : "incorrect";

        let resultText = isCorrect ? "Correct" : "Incorrect";

        let correctAnswerText = Array.isArray(correctAnswers[i])

            ? correctAnswers[i].join(", ")

            : correctAnswers[i];

        resultsHTML += `

            <div class="quiz-question">

                <h3>Question ${i + 1}</h3>

                <p class="${resultClass}">

                    ${resultText}

                </p>

                <p>

                    Your answer:

                    ${answers[i].length === 0 ? "No answer" :

                    Array.isArray(answers[i]) ?

                    answers[i].join(", ") : answers[i]}

                </p>

                <p>

                    Correct answer: ${correctAnswerText}

                </p>

                <p>${explanations[i]}</p>

            </div>

        `;

    }

    // Calculate final percentage

    const percentage = (score / 10) * 100;

    const passed = percentage >= passingScore;

    const minutesSpent = Math.floor(timeSpent / 60);

    const secondsSpent = timeSpent % 60;

    // Display overall results

    resultsHTML = `

        <h2 class="${passed ? "correct" : "incorrect"}">

            ${passed ? "Congratulations! You Passed!" :

            "You Did Not Pass. Keep Practicing!"}

        </h2>

        <h3>Your Score: ${score}/10</h3>

        <h3>Percentage: ${percentage}%</h3>

        <h3>

            Result: ${passed ? "PASS" : "FAIL"}

        </h3>

        <p>

            Time Spent:

            ${minutesSpent} minutes and ${secondsSpent} seconds

        </p>

        <hr>

        ${resultsHTML}

        <button type="button"

            class="quiz-button"

            onclick="resetQuiz()">

            Retake Quiz

        </button>

    `;

    resultsDisplay.innerHTML = resultsHTML;

    resultsDisplay.hidden = false;

    // Disable answers after submission

    const inputs = quizForm.querySelectorAll("input");

    inputs.forEach(input => {

        input.disabled = true;

    });

    // Hide submit and reset buttons

    quizForm.querySelectorAll("button").forEach(button => {

        button.disabled = true;

    });

    // Display results at the top of the page

    resultsDisplay.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}

// Reset the quiz and start again

function resetQuiz() {

    clearInterval(timerInterval);

    quizForm.reset();

    quizSubmitted = false;

    timeRemaining = quizDuration;

    timeStarted = Date.now();

    resultsDisplay.innerHTML = "";

    resultsDisplay.hidden = true;

    // Re-enable all inputs

    const inputs = quizForm.querySelectorAll("input");

    inputs.forEach(input => {

        input.disabled = false;

    });

    // Re-enable buttons

    quizForm.querySelectorAll("button").forEach(button => {

        button.disabled = false;

    });

    timerDisplay.textContent = "Time Remaining: 10:00";

    startTimer();

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// Listen for quiz submission

quizForm.addEventListener("submit", function(event) {

    event.preventDefault();

    submitQuiz();

});

// Handle the HTML reset button

quizForm.addEventListener("reset", function() {

    if (quizSubmitted) {

        return;

    }

    clearInterval(timerInterval);

    setTimeout(function() {

        timeRemaining = quizDuration;

        timeStarted = Date.now();

        timerDisplay.textContent = "Time Remaining: 10:00";

        startTimer();

    }, 0);

});

// Start timer when the page loads

startTimer();
